export interface PracticeOption {
  name: string
  hasStyle: boolean
}

export type ImmersionStyle = 'Imersão' | 'Imersão interativa'

export interface SessionRecord {
  id: string
  language: string
  startedAt: number
  duration: number // em segundos
  practice: string
  style?: ImmersionStyle
  source: 'timer' | 'manual'
}

export interface LanguageProfile {
  id: string
  name: string
  nativeName: string
}

export const PRACTICES: PracticeOption[] = [
  { name: 'Escuta e leitura', hasStyle: true },
  { name: 'Escuta', hasStyle: true },
  { name: 'Leitura', hasStyle: true },
  { name: 'Fala', hasStyle: false },
  { name: 'Escrita', hasStyle: false },
  { name: 'Pronúncia', hasStyle: false },
  { name: 'Gramática', hasStyle: false },
  { name: 'Vocabulário', hasStyle: false },
]

export const DEFAULT_LANGUAGES: LanguageProfile[] = [
  { id: 'ko', name: 'Coreano', nativeName: '한국어' },
  { id: 'ja', name: 'Japonês', nativeName: '日本語' },
  { id: 'en', name: 'Inglês', nativeName: 'English' },
  { id: 'es', name: 'Espanhol', nativeName: 'Español' },
  { id: 'fr', name: 'Francês', nativeName: 'Français' },
  { id: 'de', name: 'Alemão', nativeName: 'Deutsch' },
  { id: 'it', name: 'Italiano', nativeName: 'Italiano' },
  { id: 'zh', name: 'Mandarim', nativeName: '中文' },
]
