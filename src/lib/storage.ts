import { DEFAULT_LANGUAGES, type SessionRecord, type LanguageProfile } from '@/types/imerso'

const SESSIONS_KEY = 'imerso_sessions_v1'
const CURRENT_LANG_KEY = 'imerso_current_lang_v1'
const LANGUAGES_KEY = 'imerso_languages_v1'

export function getStoredLanguages(): LanguageProfile[] {
  try {
    const raw = localStorage.getItem(LANGUAGES_KEY)
    if (raw !== null) {
      return JSON.parse(raw)
    }
  } catch (e) {
    console.error('Erro ao ler idiomas salvos:', e)
  }
  return DEFAULT_LANGUAGES
}

export function saveStoredLanguages(languages: LanguageProfile[]) {
  localStorage.setItem(LANGUAGES_KEY, JSON.stringify(languages))
}

export function getCurrentLanguageId(): string {
  const val = localStorage.getItem(CURRENT_LANG_KEY)
  if (val) return val
  const langs = getStoredLanguages()
  return langs.length > 0 ? langs[0].id : ''
}

export function setCurrentLanguageId(id: string) {
  if (id) {
    localStorage.setItem(CURRENT_LANG_KEY, id)
  } else {
    localStorage.removeItem(CURRENT_LANG_KEY)
  }
}

export function getStoredSessions(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY)
    if (raw) {
      const parsed: SessionRecord[] = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        const defaultLang = getCurrentLanguageId()
        let hasFixed = false
        const sanitized = parsed.map(s => {
          if (!s.language) {
            hasFixed = true
            return { ...s, language: defaultLang }
          }
          return s
        })
        if (hasFixed) {
          localStorage.setItem(SESSIONS_KEY, JSON.stringify(sanitized))
        }
        return sanitized
      }
    }
  } catch (e) {
    console.error('Erro ao ler sessões:', e)
  }
  return []
}

export function saveSessionRecord(session: SessionRecord) {
  const current = getStoredSessions()
  const safeSession: SessionRecord = {
    ...session,
    language: session.language || getCurrentLanguageId(),
  }
  const index = current.findIndex(s => s.id === safeSession.id)
  let updated: SessionRecord[]
  if (index >= 0) {
    updated = [...current]
    updated[index] = safeSession
  } else {
    updated = [safeSession, ...current]
  }
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated))
}

export function deleteSessionRecord(sessionId: string) {
  const current = getStoredSessions()
  const updated = current.filter(s => s.id !== sessionId)
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated))
}

export function deleteSessionsForLanguage(languageId: string) {
  const current = getStoredSessions()
  const updated = current.filter(s => s.language !== languageId)
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated))
}

export function exportBackupJSON() {
  const backupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    languages: getStoredLanguages(),
    currentLanguageId: getCurrentLanguageId(),
    sessions: getStoredSessions(),
  }

  const jsonStr = JSON.stringify(backupData, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const dateStr = new Date().toISOString().slice(0, 10)

  const a = document.createElement('a')
  a.href = url
  a.download = `imerso-backup-${dateStr}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function importBackupJSON(jsonContent: string): { success: boolean; message: string; count?: number } {
  try {
    const parsed = JSON.parse(jsonContent)
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, message: 'Arquivo JSON inválido' }
    }

    const { languages, sessions, currentLanguageId } = parsed

    if (!Array.isArray(languages) || !Array.isArray(sessions)) {
      return { success: false, message: 'Estrutura de backup incompatível' }
    }

    // Save languages and sessions
    saveStoredLanguages(languages)
    if (currentLanguageId) {
      setCurrentLanguageId(currentLanguageId)
    }

    // Merge sessions safely or replace
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))

    return { success: true, message: 'Backup restaurado com sucesso', count: sessions.length }
  } catch (err) {
    console.error('Erro ao importar backup:', err)
    return { success: false, message: 'Erro ao ler o arquivo JSON' }
  }
}

