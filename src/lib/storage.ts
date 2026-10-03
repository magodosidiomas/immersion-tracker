import { DEFAULT_LANGUAGES, type SessionRecord, type LanguageProfile } from '@/types/imerso'

const SESSIONS_KEY = 'imerso_sessions_v1'
const CURRENT_LANG_KEY = 'imerso_current_lang_v1'
const LANGUAGES_KEY = 'imerso_languages_v1'

export function getStoredLanguages(): LanguageProfile[] {
  try {
    const raw = localStorage.getItem(LANGUAGES_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Erro ao ler idiomas salvos:', e)
  }
  return DEFAULT_LANGUAGES
}

export function saveStoredLanguages(languages: LanguageProfile[]) {
  localStorage.setItem(LANGUAGES_KEY, JSON.stringify(languages))
}

export function getCurrentLanguageId(): string {
  return localStorage.getItem(CURRENT_LANG_KEY) || 'ko'
}

export function setCurrentLanguageId(id: string) {
  localStorage.setItem(CURRENT_LANG_KEY, id)
}

export function getStoredSessions(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Erro ao ler sessões:', e)
  }
  return []
}

export function saveSessionRecord(session: SessionRecord) {
  const current = getStoredSessions()
  const updated = [session, ...current]
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated))
}

export function deleteSessionRecord(sessionId: string) {
  const current = getStoredSessions()
  const updated = current.filter(s => s.id !== sessionId)
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated))
}
