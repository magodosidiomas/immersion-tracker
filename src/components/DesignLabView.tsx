import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Pause,
  Square,
  Sparkles,
  Sliders,
  Check,
  ChevronLeft,
  Sun,
  Moon
} from 'lucide-react'

export type DesignDirection = 'industrial' | 'editorial' | 'amber'

interface DesignLabViewProps {
  onBackToApp: () => void
  currentTheme: 'light' | 'dark'
  onToggleTheme: () => void
  onApplyDirection: (direction: DesignDirection) => void
  selectedDirection: DesignDirection
}

export function DesignLabView({
  onBackToApp,
  currentTheme,
  onToggleTheme,
  onApplyDirection,
  selectedDirection
}: DesignLabViewProps) {
  const [activePreview, setActivePreview] = useState<DesignDirection>(selectedDirection)
  const [compareMode, setCompareMode] = useState<'side-by-side' | 'interactive'>('side-by-side')

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-primary text-primary-foreground">
              <Sliders className="size-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Laboratório de Design: 3 Direções Visuais</h1>
            <Badge variant="outline" className="font-mono text-xs">Anti-AI-Slop Review</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Compare os 3 universos estéticos aplicados ao Timer e à interface do Imerso, em Light e Dark mode.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={onToggleTheme} className="gap-2">
            {currentTheme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
            <span>{currentTheme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</span>
          </Button>

          <Button size="sm" onClick={onBackToApp} className="gap-2">
            <ChevronLeft className="size-4" />
            <span>Voltar ao App</span>
          </Button>
        </div>
      </header>

      {/* Modo de Visualização */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-muted/40 p-2 rounded-2xl border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-2">Visualização:</span>
          <div className="flex bg-muted p-1 rounded-xl">
            <button
              onClick={() => setCompareMode('side-by-side')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                compareMode === 'side-by-side' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
              }`}
            >
              Lado a Lado (Comparativo)
            </button>
            <button
              onClick={() => setCompareMode('interactive')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                compareMode === 'interactive' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
              }`}
            >
              Foco Individual & Teste
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Direção ativa:</span>
          <Badge variant="default" className="capitalize">
            {selectedDirection}
          </Badge>
        </div>
      </div>

      {compareMode === 'side-by-side' ? (
        /* GRID COM OS 3 MOCKUPS LADO A LADO */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* DIREÇÃO 1: PRECISÃO INDUSTRIAL & TÁTIL */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="font-bold text-base flex items-center gap-1.5">
                  1. Precisão Industrial
                  {selectedDirection === 'industrial' && <Badge variant="secondary" className="text-[10px]">Ativo</Badge>}
                </h3>
                <p className="text-xs text-muted-foreground">Inspiração Braun / Teenage Engineering / Linear</p>
              </div>
              <Button
                size="xs"
                variant={selectedDirection === 'industrial' ? 'default' : 'outline'}
                onClick={() => onApplyDirection('industrial')}
              >
                {selectedDirection === 'industrial' ? <Check className="size-3 mr-1" /> : null}
                {selectedDirection === 'industrial' ? 'Escolhido' : 'Aplicar no App'}
              </Button>
            </div>

            {/* Mockup Industrial */}
            <div className="border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-[#121212] rounded-[30px] p-5 shadow-md flex flex-col justify-between min-h-[520px] transition-all">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <span className="font-mono text-xs font-bold px-2.5 py-1 bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-md tracking-wider">
                  COREANO · 한국어
                </span>
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Display de Precisão */}
              <div className="my-auto text-center py-6 px-4 bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl shadow-inner">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 block mb-1">
                  CRONÔMETRO ATIVO
                </span>
                <div className="font-mono text-5xl font-normal tracking-tight text-neutral-900 dark:text-neutral-100 tabular-nums">
                  00:47:18
                </div>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <span className="text-xs font-mono text-neutral-500">ESCUTA E LEITURA</span>
                  <span className="text-neutral-300 dark:text-neutral-700">/</span>
                  <span className="text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300">IMERSÃO</span>
                </div>
              </div>

              {/* Controles Físicos Táteis */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-2.5">
                  <button className="h-12 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-mono text-xs font-bold rounded-xl border-b-2 border-neutral-400 dark:border-neutral-950 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 shadow-sm">
                    <Pause className="size-3.5" /> PAUSAR
                  </button>
                  <button className="h-12 bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-mono text-xs font-bold rounded-xl border-b-2 border-rose-300 dark:border-rose-900 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 shadow-sm">
                    <Square className="size-3.5" /> ENCERRAR
                  </button>
                </div>

                <div className="p-3 bg-neutral-200/60 dark:bg-neutral-900 rounded-xl text-[11px] font-mono text-neutral-600 dark:text-neutral-400 flex justify-between items-center border border-neutral-300/40 dark:border-neutral-800/60">
                  <span>METRIC: 14.5H TOTAL</span>
                  <span className="text-neutral-900 dark:text-neutral-200 font-bold">NÍVEL 5 (45%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* DIREÇÃO 2: EDITORIAL & CALMO */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="font-bold text-base flex items-center gap-1.5">
                  2. Editorial & Calmo
                  {selectedDirection === 'editorial' && <Badge variant="secondary" className="text-[10px]">Ativo</Badge>}
                </h3>
                <p className="text-xs text-muted-foreground">Inspiração Things 3 / iA Writer / Marfim</p>
              </div>
              <Button
                size="xs"
                variant={selectedDirection === 'editorial' ? 'default' : 'outline'}
                onClick={() => onApplyDirection('editorial')}
              >
                {selectedDirection === 'editorial' ? <Check className="size-3 mr-1" /> : null}
                {selectedDirection === 'editorial' ? 'Escolhido' : 'Aplicar no App'}
              </Button>
            </div>

            {/* Mockup Editorial */}
            <div className="border border-stone-200 dark:border-stone-800 bg-[#FAF7F2] dark:bg-[#181716] rounded-[30px] p-6 shadow-sm flex flex-col justify-between min-h-[520px] transition-all">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-serif italic text-stone-500 dark:text-stone-400 block">Estudando</span>
                  <span className="text-base font-semibold tracking-tight text-stone-800 dark:text-stone-100">
                    Coreano
                  </span>
                </div>
                <span className="text-xs text-stone-400 font-serif">Sessão #42</span>
              </div>

              {/* Display Editorial Calmo */}
              <div className="my-auto text-center py-8">
                <div className="font-serif text-6xl font-light tracking-tight text-stone-900 dark:text-stone-100 tabular-nums">
                  47<span className="text-stone-400 dark:text-stone-600 text-3xl font-sans">:</span>18
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-3 font-serif italic">
                  Escuta e leitura imersiva
                </p>
              </div>

              {/* Controles Suaves */}
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <button className="h-12 bg-stone-200/70 hover:bg-stone-300/80 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 font-medium text-sm rounded-2xl transition-all flex items-center justify-center gap-2">
                    <Pause className="size-4" /> Pausar
                  </button>
                  <button className="h-12 bg-stone-900 hover:bg-stone-800 text-stone-50 dark:bg-stone-100 dark:hover:bg-stone-200 dark:text-stone-900 font-medium text-sm rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm">
                    <Square className="size-3.5" /> Concluir
                  </button>
                </div>

                <div className="text-center pt-1 border-t border-stone-200/60 dark:border-stone-800/60">
                  <span className="text-xs text-stone-400 font-serif italic">14h 30m acumuladas de 20h para o Nível 6</span>
                </div>
              </div>
            </div>
          </div>

          {/* DIREÇÃO 3: GAMIFICAÇÃO ELEGANTE COM ÂMBAR */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="font-bold text-base flex items-center gap-1.5">
                  3. Âmbar Tangível
                  {selectedDirection === 'amber' && <Badge variant="secondary" className="text-[10px]">Ativo</Badge>}
                </h3>
                <p className="text-xs text-muted-foreground">Inspiração Amie / Arc / Gamificação de Luxo</p>
              </div>
              <Button
                size="xs"
                variant={selectedDirection === 'amber' ? 'default' : 'outline'}
                onClick={() => onApplyDirection('amber')}
              >
                {selectedDirection === 'amber' ? <Check className="size-3 mr-1" /> : null}
                {selectedDirection === 'amber' ? 'Escolhido' : 'Aplicar no App'}
              </Button>
            </div>

            {/* Mockup Âmbar */}
            <div className="border border-amber-200/60 dark:border-amber-900/30 bg-gradient-to-b from-amber-50/40 via-background to-background dark:from-amber-950/20 dark:via-background dark:to-background rounded-[30px] p-6 shadow-md flex flex-col justify-between min-h-[520px] transition-all">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-7 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                    KO
                  </span>
                  <span className="font-semibold text-sm">Coreano</span>
                </div>
                <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border-amber-500/30 font-semibold gap-1 text-[11px]">
                  <Sparkles className="size-3" /> Nível 5
                </Badge>
              </div>

              {/* Display de Tempo com Brilho Âmbar */}
              <div className="my-auto text-center py-6">
                <div className="inline-block p-6 rounded-3xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 shadow-sm mb-2">
                  <div className="font-mono text-5xl font-semibold tracking-tight text-foreground tabular-nums">
                    00:47:18
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-1">
                  <span className="size-2 rounded-full bg-amber-500" />
                  <span>Imersão em fluxo contínuo</span>
                </div>
              </div>

              {/* Controles Vivos */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <button className="h-12 bg-secondary hover:bg-muted font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2 border">
                    <Pause className="size-4" /> Pausar
                  </button>
                  <button className="h-12 bg-amber-500 hover:bg-amber-600 text-stone-950 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:translate-y-0.5">
                    <Square className="size-4 fill-current" /> Encerrar
                  </button>
                </div>

                <div className="bg-amber-500/10 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-500/20">
                  <div className="flex justify-between text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1.5">
                    <span>Meta do Nível 5</span>
                    <span>14h 30m / 20h</span>
                  </div>
                  <div className="w-full bg-amber-500/20 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* MODO INTERATIVO INDIVIDUAL */
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex p-1 bg-muted rounded-xl">
            {(['industrial', 'editorial', 'amber'] as DesignDirection[]).map(dir => (
              <button
                key={dir}
                onClick={() => setActivePreview(dir)}
                className={`flex-1 py-2 text-xs font-medium rounded-lg capitalize transition-all ${
                  activePreview === dir ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
                }`}
              >
                {dir === 'industrial' ? '1. Industrial' : dir === 'editorial' ? '2. Editorial' : '3. Âmbar'}
              </button>
            ))}
          </div>

          <div className="text-center">
            <Button
              className="w-full gap-2"
              onClick={() => onApplyDirection(activePreview)}
            >
              <Check className="size-4" />
              Aplicar Direção "{activePreview.toUpperCase()}" no App Imerso
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
