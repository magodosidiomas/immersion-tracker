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
  return langs.length > 0 ? langs[0].id : 'ko'
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
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Erro ao ler sessões:', e)
  }
  return []
}

export function saveSessionRecord(session: SessionRecord) {
  const current = getStoredSessions()
  const index = current.findIndex(s => s.id === session.id)
  let updated: SessionRecord[]
  if (index >= 0) {
    updated = [...current]
    updated[index] = session
  } else {
    updated = [session, ...current]
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
