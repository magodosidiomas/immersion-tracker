import { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'

const LANGUAGE_FLAG_MAP: Record<string, string> = {
  // Principais (mais estudados no mundo)
  en: 'us', // EUA conforme solicitação do usuário
  es: 'es', // Espanha conforme solicitação do usuário
  fr: 'fr',
  de: 'de',
  ja: 'jp',
  it: 'it',
  ko: 'kr',
  zh: 'cn',
  ru: 'ru',
  pt: 'br',
  ar: 'sa',
  hi: 'in',
  nl: 'nl',
  tr: 'tr',
  pl: 'pl',
  sv: 'se',
  no: 'no',
  da: 'dk',
  fi: 'fi',
  el: 'gr',
  he: 'il',
  uk: 'ua',
  ro: 'ro',
  cs: 'cz',
  hu: 'hu',
  th: 'th',
  id: 'id',
  vi: 'vn',
  tl: 'ph',
  af: 'za',
  sq: 'al',
  hy: 'am',
  eu: 'es-pv',
  bn: 'bd',
  be: 'by',
  bs: 'ba',
  bg: 'bg',
  ca: 'es-ct',
  hr: 'hr',
  sk: 'sk',
  sl: 'si',
  eo: 'eo',
  et: 'ee',
  gl: 'es-ga',
  cy: 'gb-wls',
  ka: 'ge',
  ga: 'ie',
  is: 'is',
  la: 'va',
  lv: 'lv',
  lt: 'lt',
  ms: 'my',
  mn: 'mn',
  fa: 'ir',
  sr: 'rs',
  sw: 'tz',
  ta: 'in',
  te: 'in',
  ur: 'pk',
}

const preloadedUrls = new Set<string>()

export function preloadFlag(code: string) {
  const flagCode = LANGUAGE_FLAG_MAP[code] || code
  const url = `/flags/${flagCode}.svg`
  if (typeof window !== 'undefined' && !preloadedUrls.has(url)) {
    preloadedUrls.add(url)
    const img = new Image()
    img.src = url
  }
}

export function preloadFlags(codes: string[]) {
  codes.forEach(preloadFlag)
}

// Auto-preload all catalog flags globally when script loads
if (typeof window !== 'undefined') {
  preloadFlags(Object.keys(LANGUAGE_FLAG_MAP))
}

interface LanguageFlagProps {
  code: string
  className?: string
  size?: number
}

export function LanguageFlag({ code, className = 'size-5', size }: LanguageFlagProps) {
  const [hasError, setHasError] = useState(false)
  const flagCode = LANGUAGE_FLAG_MAP[code] || code

  useEffect(() => {
    preloadFlag(code)
  }, [code])

  if (hasError) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full bg-muted/60 text-muted-foreground ring-1 ring-border/40 shrink-0 ${className}`}
        style={size ? { width: size, height: size } : undefined}
        aria-hidden="true"
      >
        <Globe className="size-3 text-muted-foreground" />
      </span>
    )
  }

  return (
    <img
      src={`/flags/${flagCode}.svg`}
      alt=""
      aria-hidden="true"
      loading="eager"
      decoding="async"
      onError={() => setHasError(true)}
      className={`rounded-full object-cover shrink-0 ring-1 ring-black/10 dark:ring-white/15 shadow-2xs select-none pointer-events-none ${className}`}
      style={size ? { width: size, height: size } : undefined}
    />
  )
}
