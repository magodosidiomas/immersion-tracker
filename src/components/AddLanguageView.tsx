import { useState, useMemo } from 'react'
import { X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollAreaFade } from '@/components/ui/scroll-area-fade'
import { LanguageFlag } from '@/components/LanguageFlag'
import { CATALOG_LANGUAGES, normalizeText, type LanguageProfile } from '@/types/imerso'

export interface AddLanguageViewProps {
  userLanguages: LanguageProfile[]
  onAddLanguage: (lang: LanguageProfile) => void
  onClose?: () => void
  isFirstUse?: boolean
}

export function AddLanguageView({
  userLanguages,
  onAddLanguage,
  onClose,
  isFirstUse = false,
}: AddLanguageViewProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const userLangIds = useMemo(
    () => new Set(userLanguages.map(l => l.id)),
    [userLanguages]
  )

  const availableLanguages = useMemo(() => {
    // Filtra idiomas que já estão na lista do usuário (padrão da Spec e do protótipo)
    const remaining = CATALOG_LANGUAGES.filter(lang => !userLangIds.has(lang.id))
    const query = normalizeText(searchQuery)
    if (!query) return remaining

    return remaining.filter(lang => {
      const combined = normalizeText(`${lang.name} ${lang.nativeName}`)
      return combined.includes(query)
    })
  }, [userLangIds, searchQuery])

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full animate-in fade-in duration-200">
      {/* Top Header */}
      {isFirstUse ? (
        <div className="pt-2 pb-4">
          <h1 className="text-xl font-bold tracking-tight text-foreground text-left">
            Qual idioma você está aprendendo?
          </h1>
        </div>
      ) : (
        <header className="flex items-center justify-between min-h-[44px] pb-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-9 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Fechar"
          >
            <X className="size-5" />
          </Button>
          <span className="font-semibold text-base text-foreground">Adicionar idioma</span>
          <div className="size-9" /> {/* Spacer para alinhamento central */}
        </header>
      )}

      {/* Barra de Busca */}
      <div className="relative mb-3">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Buscar idioma"
          aria-label="Buscar idioma"
          autoComplete="off"
          autoFocus={isFirstUse}
          className="pl-9 pr-8 h-10 rounded-xl bg-muted/30 border-border/70 focus-visible:bg-background text-sm"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full"
            aria-label="Limpar busca"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Lista de Idiomas */}
      <ScrollAreaFade className="flex-1 min-h-0 space-y-1 pr-0.5">
        {availableLanguages.length > 0 ? (
          availableLanguages.map(lang => (
            <button
              key={lang.id}
              type="button"
              onClick={() => onAddLanguage(lang)}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl border border-transparent hover:border-border/60 hover:bg-muted/40 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <LanguageFlag code={lang.id} className="size-5 shrink-0" />
                <span className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {lang.name}
                </span>
                <span className="text-xs text-muted-foreground font-normal shrink-0">
                  ({lang.nativeName})
                </span>
              </div>
            </button>
          ))
        ) : (
          <div className="py-12 text-center flex flex-col items-center justify-center space-y-1 text-muted-foreground">
            <p className="text-sm font-medium text-foreground">
              Nenhum idioma encontrado.
            </p>
            <p className="text-xs text-muted-foreground">
              Não achou o seu? Mais opções serão adicionadas em breve.
            </p>
          </div>
        )}
      </ScrollAreaFade>
    </div>
  )
}
