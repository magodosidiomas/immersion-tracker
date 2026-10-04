import { Sparkles, Layers, Minimize2 } from 'lucide-react'

export type ContainerVariant = 'frameless' | 'dividers' | 'seamless'

interface ContainerVariantPickerProps {
  variant: ContainerVariant
  onVariantChange: (variant: ContainerVariant) => void
}

export function ContainerVariantPicker({
  variant,
  onVariantChange,
}: ContainerVariantPickerProps) {
  return (
    <div className="sticky top-0 z-20 pb-3 pt-1 bg-background/95 backdrop-blur-xs">
      <div className="flex items-center justify-between gap-2 p-1 bg-muted/40 rounded-xl border border-border/60">
        <button
          type="button"
          onClick={() => onVariantChange('frameless')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            variant === 'frameless'
              ? 'bg-card text-foreground shadow-xs border border-border/50'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          title="Modo Frameless: Zero cards ou caixas, estrutura orientada a tipografia e respiro"
        >
          <Minimize2 className="size-3.5 shrink-0" />
          <span className="truncate">Frameless</span>
        </button>

        <button
          type="button"
          onClick={() => onVariantChange('dividers')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            variant === 'dividers'
              ? 'bg-card text-foreground shadow-xs border border-border/50'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          title="Modo Dividers: Linhas divisórias ultrafinas sem bordas externas de card"
        >
          <Layers className="size-3.5 shrink-0" />
          <span className="truncate">Divisórias</span>
        </button>

        <button
          type="button"
          onClick={() => onVariantChange('seamless')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            variant === 'seamless'
              ? 'bg-card text-foreground shadow-xs border border-border/50'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          title="Modo Seamless: Uma única superfície contínua por grupo, sem sub-cards"
        >
          <Sparkles className="size-3.5 shrink-0" />
          <span className="truncate">Superfície Única</span>
        </button>
      </div>
    </div>
  )
}
