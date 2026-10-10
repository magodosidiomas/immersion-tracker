export interface GoogleDriveFile {
  id: string
  name: string
  mimeType: string
  modifiedTime?: string
  size?: string
}

export interface GoogleDriveBackupPayload {
  version: number
  exportedAt: string
  clientTimestamp: number
  languages: any[]
  currentLanguageId: string
  sessions: any[]
}

export interface GoogleDriveUser {
  name: string
  email: string
  picture?: string
}

export interface GoogleDriveSyncState {
  isConnected: boolean
  isSyncing: boolean
  lastSyncTime: number | null
  user: GoogleDriveUser | null
  error: string | null
  configured: boolean
}
