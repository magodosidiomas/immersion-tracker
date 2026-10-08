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

export const DEFAULT_LANGUAGES: LanguageProfile[] = []

export const CATALOG_LANGUAGES: LanguageProfile[] = [
  // Mais estudados no mundo (Top referências: Duolingo Language Report, Ethnologue, EF EPI)
  { id: 'en', name: 'Inglês', nativeName: 'English' },
  { id: 'es', name: 'Espanhol', nativeName: 'Español' },
  { id: 'fr', name: 'Francês', nativeName: 'Français' },
  { id: 'de', name: 'Alemão', nativeName: 'Deutsch' },
  { id: 'ja', name: 'Japonês', nativeName: '日本語' },
  { id: 'it', name: 'Italiano', nativeName: 'Italiano' },
  { id: 'ko', name: 'Coreano', nativeName: '한국어' },
  { id: 'zh', name: 'Mandarim', nativeName: '中文' },
  { id: 'ru', name: 'Russo', nativeName: 'Русский' },
  { id: 'pt', name: 'Português', nativeName: 'Português' },
  { id: 'ar', name: 'Árabe', nativeName: 'العربية' },
  { id: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { id: 'nl', name: 'Holandês', nativeName: 'Nederlands' },
  { id: 'tr', name: 'Turco', nativeName: 'Türkçe' },
  { id: 'pl', name: 'Polonês', nativeName: 'Polski' },
  { id: 'sv', name: 'Sueco', nativeName: 'Svenska' },
  // Restante em ordem alfabética (pt-BR)
  { id: 'af', name: 'Africâner', nativeName: 'Afrikaans' },
  { id: 'sq', name: 'Albanês', nativeName: 'Shqip' },
  { id: 'hy', name: 'Armênio', nativeName: 'Հայերեն' },
  { id: 'eu', name: 'Basco', nativeName: 'Euskara' },
  { id: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { id: 'be', name: 'Bielorrusso', nativeName: 'Беларуская' },
  { id: 'bs', name: 'Bósnio', nativeName: 'Bosanski' },
  { id: 'bg', name: 'Búlgaro', nativeName: 'Български' },
  { id: 'ca', name: 'Catalão', nativeName: 'Català' },
  { id: 'cs', name: 'Checo', nativeName: 'Čeština' },
  { id: 'hr', name: 'Croata', nativeName: 'Hrvatski' },
  { id: 'da', name: 'Dinamarquês', nativeName: 'Dansk' },
  { id: 'sk', name: 'Eslovaco', nativeName: 'Slovenčina' },
  { id: 'sl', name: 'Esloveno', nativeName: 'Slovenščina' },
  { id: 'eo', name: 'Esperanto', nativeName: 'Esperanto' },
  { id: 'et', name: 'Estoniano', nativeName: 'Eesti' },
  { id: 'fi', name: 'Finlandês', nativeName: 'Suomi' },
  { id: 'gl', name: 'Galego', nativeName: 'Galego' },
  { id: 'cy', name: 'Galês', nativeName: 'Cymraeg' },
  { id: 'ka', name: 'Georgiano', nativeName: 'ქართული' },
  { id: 'el', name: 'Grego', nativeName: 'Ελληνικά' },
  { id: 'he', name: 'Hebraico', nativeName: 'עברית' },
  { id: 'hu', name: 'Húngaro', nativeName: 'Magyar' },
  { id: 'id', name: 'Indonésio', nativeName: 'Bahasa Indonesia' },
  { id: 'ga', name: 'Irlandês', nativeName: 'Gaeilge' },
  { id: 'is', name: 'Islandês', nativeName: 'Íslenska' },
  { id: 'la', name: 'Latim', nativeName: 'Latina' },
  { id: 'lv', name: 'Letão', nativeName: 'Latviešu' },
  { id: 'lt', name: 'Lituano', nativeName: 'Lietuvių' },
  { id: 'ms', name: 'Malaio', nativeName: 'Bahasa Melayu' },
  { id: 'mn', name: 'Mongol', nativeName: 'Монгол' },
  { id: 'no', name: 'Norueguês', nativeName: 'Norsk' },
  { id: 'fa', name: 'Persa', nativeName: 'فارسی' },
  { id: 'ro', name: 'Romeno', nativeName: 'Română' },
  { id: 'sr', name: 'Sérvio', nativeName: 'Српски' },
  { id: 'sw', name: 'Suaíli', nativeName: 'Kiswahili' },
  { id: 'tl', name: 'Tagalo', nativeName: 'Tagalog' },
  { id: 'th', name: 'Tailandês', nativeName: 'ไทย' },
  { id: 'ta', name: 'Tâmil', nativeName: 'தமிழ்' },
  { id: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { id: 'uk', name: 'Ucraniano', nativeName: 'Українська' },
  { id: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { id: 'vi', name: 'Vietnamita', nativeName: 'Tiếng Việt' },
]

export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

