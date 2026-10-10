import type { GoogleDriveUser, GoogleDriveBackupPayload } from '@/types/google-drive'
import {
  getStoredLanguages,
  saveStoredLanguages,
  getCurrentLanguageId,
  setCurrentLanguageId,
  getStoredSessions,
} from './storage'

// Storage keys
const TOKEN_KEY = 'imerso_gdrive_token'
const TOKEN_EXPIRY_KEY = 'imerso_gdrive_token_expiry'
const USER_KEY = 'imerso_gdrive_user'
const LAST_SYNC_KEY = 'imerso_gdrive_last_sync'
const BACKUP_FILENAME = 'imerso_backup_data.json'
const SESSIONS_KEY = 'imerso_sessions_v1'

// App data folder scope: only access files created by Imerso in hidden app data folder
const DRIVE_APP_DATA_SCOPE = 'https://www.googleapis.com/auth/drive.appdata'
const USERINFO_SCOPE = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (response: { access_token?: string; error?: string; expires_in?: number }) => void
          }) => {
            requestAccessToken: (options?: { prompt?: string }) => void
          }
          revoke: (token: string, done: () => void) => void
        }
      }
    }
  }
}

export function getGoogleClientId(): string {
  return (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim()
}

export function isGoogleDriveConfigured(): boolean {
  return Boolean(getGoogleClientId())
}

export function getStoredAccessToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY)
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY)
  if (!token || !expiry) return null

  // Check if expired (with 60s buffer)
  if (Date.now() > Number(expiry) - 60000) {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_EXPIRY_KEY)
    return null
  }

  return token
}

export function getStoredDriveUser(): GoogleDriveUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // Ignore parse error
  }
  return null
}

export function getLastSyncTime(): number | null {
  const raw = localStorage.getItem(LAST_SYNC_KEY)
  return raw ? Number(raw) : null
}

export function setLastSyncTime(ts: number) {
  localStorage.setItem(LAST_SYNC_KEY, String(ts))
}

// Fetch authenticated Google User Profile
async function fetchUserProfile(accessToken: string): Promise<GoogleDriveUser | null> {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) return null
    const data = await res.json()
    return {
      name: data.name || data.email || 'Usuário Google',
      email: data.email || '',
      picture: data.picture,
    }
  } catch (e) {
    console.error('Falha ao obter perfil Google:', e)
    return null
  }
}

// Request Token via Google Identity Services
export function requestGoogleAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    const clientId = getGoogleClientId()
    if (!clientId) {
      reject(new Error('GOOGLE_CLIENT_ID não configurado'))
      return
    }

    if (!window.google?.accounts?.oauth2) {
      reject(new Error('Google Identity Services não carregado'))
      return
    }

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: `${DRIVE_APP_DATA_SCOPE} ${USERINFO_SCOPE}`,
        callback: (resp) => {
          if (resp.error) {
            reject(new Error(resp.error))
            return
          }
          if (resp.access_token) {
            const expiresIn = (resp.expires_in || 3599) * 1000
            const expiryTs = Date.now() + expiresIn
            localStorage.setItem(TOKEN_KEY, resp.access_token)
            localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiryTs))
            resolve(resp.access_token)
          } else {
            reject(new Error('Nenhum token retornado pelo Google'))
          }
        },
      })

      client.requestAccessToken({ prompt: '' })
    } catch (err) {
      reject(err)
    }
  })
}

// Connect / Login to Google Drive
export async function connectGoogleDrive(): Promise<{ user: GoogleDriveUser | null; token: string }> {
  const token = await requestGoogleAccessToken()
  const user = await fetchUserProfile(token)
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
  return { user, token }
}

// Disconnect from Google Drive
export function disconnectGoogleDrive() {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token && window.google?.accounts?.oauth2?.revoke) {
    try {
      window.google.accounts.oauth2.revoke(token, () => {})
    } catch {
      // Ignore
    }
  }
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(TOKEN_EXPIRY_KEY)
  localStorage.removeItem(USER_KEY)
}

// Find existing backup file in Google Drive AppData folder
async function findAppDataBackupFile(accessToken: string): Promise<string | null> {
  const q = encodeURIComponent(`name = '${BACKUP_FILENAME}' and 'appDataFolder' in parents and trashed = false`)
  const url = `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${q}&fields=files(id,name,modifiedTime)`

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      throw new Error('Sessão expirada. Conecte ao Google Drive novamente.')
    }
    throw new Error(`Erro ao listar backup no Google Drive (${res.status})`)
  }

  const data = await res.json()
  if (data.files && data.files.length > 0) {
    return data.files[0].id
  }
  return null
}

// Download existing backup from Google Drive
export async function downloadDriveBackup(accessToken: string, fileId: string): Promise<GoogleDriveBackupPayload | null> {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) {
    return null
  }

  return await res.json()
}

// Upload / Update backup in Google Drive appDataFolder
export async function uploadDriveBackup(accessToken: string, payload: GoogleDriveBackupPayload): Promise<void> {
  const existingFileId = await findAppDataBackupFile(accessToken)
  const jsonContent = JSON.stringify(payload, null, 2)

  if (existingFileId) {
    // Update existing file content
    const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media`
    const res = await fetch(uploadUrl, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: jsonContent,
    })

    if (!res.ok) {
      throw new Error(`Falha ao atualizar backup no Google Drive (${res.status})`)
    }
  } else {
    // Create new file via multipart upload in appDataFolder
    const metadata = {
      name: BACKUP_FILENAME,
      parents: ['appDataFolder'],
    }

    const boundary = '-------314159265358979323846'
    const delimiter = `\r\n--${boundary}\r\n`
    const closeDelimiter = `\r\n--${boundary}--`

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      jsonContent +
      closeDelimiter

    const uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart'
    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    })

    if (!res.ok) {
      throw new Error(`Falha ao criar arquivo de backup no Google Drive (${res.status})`)
    }
  }
}

// Build current local backup payload
export function buildCurrentLocalBackup(): GoogleDriveBackupPayload {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    clientTimestamp: Date.now(),
    languages: getStoredLanguages(),
    currentLanguageId: getCurrentLanguageId(),
    sessions: getStoredSessions(),
  }
}

// Smart 2-Way Sync with conflict resolution (union by session ID)
export async function syncWithGoogleDrive(): Promise<{
  sessionsCount: number
  hasRemoteChanges: boolean
}> {
  let token = getStoredAccessToken()
  if (!token) {
    // Try requesting interactive token
    token = await requestGoogleAccessToken()
  }

  // 1. Check existing remote backup
  const fileId = await findAppDataBackupFile(token)
  const localData = buildCurrentLocalBackup()

  if (!fileId) {
    // No remote backup yet -> simply push local to cloud
    await uploadDriveBackup(token, localData)
    const now = Date.now()
    setLastSyncTime(now)
    return { sessionsCount: localData.sessions.length, hasRemoteChanges: false }
  }

  // 2. Download remote backup
  const remoteData = await downloadDriveBackup(token, fileId)
  if (!remoteData || !Array.isArray(remoteData.sessions)) {
    // Corrupted or empty remote -> overwrite with local
    await uploadDriveBackup(token, localData)
    const now = Date.now()
    setLastSyncTime(now)
    return { sessionsCount: localData.sessions.length, hasRemoteChanges: false }
  }

  // 3. Smart Merge: Union sessions by ID
  const localSessions = localData.sessions || []
  const remoteSessions = remoteData.sessions || []

  const sessionMap = new Map<string, any>()
  // First insert remote
  for (const s of remoteSessions) {
    if (s && s.id) sessionMap.set(s.id, s)
  }
  // Then overlay local
  for (const s of localSessions) {
    if (s && s.id) sessionMap.set(s.id, s)
  }
  const mergedSessions = Array.from(sessionMap.values())

  // Merge languages: take union by ID
  const localLangs = localData.languages || []
  const remoteLangs = remoteData.languages || []
  const langMap = new Map<string, any>()
  for (const l of remoteLangs) {
    if (l && l.id) langMap.set(l.id, l)
  }
  for (const l of localLangs) {
    if (l && l.id) langMap.set(l.id, l)
  }
  const mergedLangs = Array.from(langMap.values())

  const mergedCurrentLangId = localData.currentLanguageId || remoteData.currentLanguageId

  // Apply to local storage
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(mergedSessions))
  saveStoredLanguages(mergedLangs)
  if (mergedCurrentLangId) {
    setCurrentLanguageId(mergedCurrentLangId)
  }

  // 4. Update cloud with merged dataset
  const mergedPayload: GoogleDriveBackupPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    clientTimestamp: Date.now(),
    languages: mergedLangs,
    currentLanguageId: mergedCurrentLangId,
    sessions: mergedSessions,
  }
  await uploadDriveBackup(token, mergedPayload)

  const now = Date.now()
  setLastSyncTime(now)

  const hasRemoteChanges = mergedSessions.length > localSessions.length

  return {
    sessionsCount: mergedSessions.length,
    hasRemoteChanges,
  }
}

// Background sync without popping OAuth login if not already connected
export async function syncSilentlyIfConnected(): Promise<boolean> {
  const token = getStoredAccessToken()
  const user = getStoredDriveUser()
  if (!token || !user) return false

  try {
    await syncWithGoogleDrive()
    return true
  } catch (err) {
    console.warn('Sync em segundo plano não completado:', err)
    return false
  }
}

