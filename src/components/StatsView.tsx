import { useState } from 'react'
import type { SessionRecord, LanguageProfile } from '@/types/imerso'
import { ScrollAreaFade } from '@/components/ui/scroll-area-fade'

interface StatsViewProps {
  sessions: SessionRecord[]
  currentLanguage: LanguageProfile
}

type Period = 'all' | 'month' | 'week'

interface PillarDef {
  id: string
  name: string
  items: string[]
  strokeColor: string
  dotClass: string
  activeBorderClass: string
  activeBgClass: string
}

const PILLARS: PillarDef[] = [
  {
    id: 'imm',
    name: 'Imersão',
    items: ['Escuta e leitura', 'Escuta', 'Leitura'],
    strokeColor: '#ededed',
    dotClass: 'bg-zinc-100 dark:bg-zinc-100',
    activeBorderClass: 'border-zinc-300 dark:border-zinc-600',
    activeBgClass: 'bg-zinc-100/10 dark:bg-zinc-800/40',
  },
  {
    id: 'out',
    name: 'Produção',
    items: ['Fala', 'Escrita'],
    strokeColor: '#8b8b85',
    dotClass: 'bg-zinc-400 dark:bg-zinc-400',
    activeBorderClass: 'border-zinc-400/80 dark:border-zinc-500',
    activeBgClass: 'bg-zinc-400/10 dark:bg-zinc-800/40',
  },
  {
    id: 'fnd',
    name: 'Fundamentos',
    items: ['Pronúncia', 'Gramática', 'Vocabulário'],
    strokeColor: '#50504d',
    dotClass: 'bg-zinc-600 dark:bg-zinc-600',
    activeBorderClass: 'border-zinc-500/80 dark:border-zinc-600',
    activeBgClass: 'bg-zinc-500/10 dark:bg-zinc-800/40',
  },
]

export function StatsView({ sessions, currentLanguage }: StatsViewProps) {
  const [period, setPeriod] = useState<Period>('all')
  const [activePillarId, setActivePillarId] = useState<string | null>(null)

  const now = Date.now()
  let filteredSessions = sessions.filter(
    s => s.language === currentLanguage.id || (!s.language && currentLanguage.id)
  )

  if (period === 'week') {
    filteredSessions = filteredSessions.filter(s => s.startedAt >= now - 7 * 86400000)
  } else if (period === 'month') {
    filteredSessions = filteredSessions.filter(s => s.startedAt >= now - 30 * 86400000)
  }

  const totalDurationSeconds = filteredSessions.reduce((acc, s) => acc + s.duration, 0)

  // Format seconds to human string (ex: "14h 30m" ou "45 min")
  const formatHumanDuration = (secs: number) => {
    if (secs <= 0) return '0 min'
    const hours = Math.floor(secs / 3600)
    const minutes = Math.round((secs % 3600) / 60)
    if (hours === 0) return `${minutes} min`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
  }

  // Calculate pillar distribution
  const pillarsData = PILLARS.map(pillar => {
    const matchingSessions = filteredSessions.filter(s => pillar.items.includes(s.practice))
    const pillarTotalSecs = matchingSessions.reduce((acc, s) => acc + s.duration, 0)
    const pct = totalDurationSeconds > 0 ? (pillarTotalSecs / totalDurationSeconds) * 100 : 0

    // Sub-items breakdown
    const subItems = pillar.items.map(item => {
      const itemSecs = matchingSessions
        .filter(s => s.practice === item)
        .reduce((acc, s) => acc + s.duration, 0)
      const itemPct = totalDurationSeconds > 0 ? (itemSecs / totalDurationSeconds) * 100 : 0
      return { name: item, duration: itemSecs, pct: itemPct }
    })

    return {
      ...pillar,
      duration: pillarTotalSecs,
      pct,
      subItems,
    }
  })

  const activePillar = pillarsData.find(p => p.id === activePillarId)

  // SVG Donut calculation
  const size = 164
  const strokeWidth = 14
  const radius = (size - strokeWidth - 8) / 2
  const circumference = 2 * Math.PI * radius
  let accumulatedAngle = 0

  const handlePillarToggle = (id: string) => {
    setActivePillarId(prev => (prev === id ? null : id))
  }

  return (
    <ScrollAreaFade className="flex-1 min-h-0 py-2 pr-3 space-y-4">
      {/* Filtro de Período (Pills) */}
      <div className="flex p-1 bg-muted/60 rounded-xl border border-border/60">
        <button
          type="button"
          onClick={() => setPeriod('all')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            period === 'all'
              ? 'bg-card text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Tudo
        </button>
        <button
          type="button"
          onClick={() => setPeriod('month')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            period === 'month'
              ? 'bg-card text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Este mês
        </button>
        <button
          type="button"
          onClick={() => setPeriod('week')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            period === 'week'
              ? 'bg-card text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Esta semana
        </button>
      </div>

      {/* Hero Section: Donut Chart Interativo com Centro Dinâmico (Superfície Única) */}
      <div className="flex flex-col items-center justify-center py-4 px-4 bg-muted/20 border border-border/70 rounded-2xl transition-colors">
        <div className="relative flex items-center justify-center my-1">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Donut Background Circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              className="text-muted/25"
            />

            {/* Donut Segments Interativos */}
            {totalDurationSeconds > 0 &&
              pillarsData.map(pillar => {
                if (pillar.pct <= 0) return null
                const isSelected = activePillarId === pillar.id
                const strokeDasharray = `${(pillar.pct / 100) * circumference} ${circumference}`
                const strokeDashoffset = -((accumulatedAngle / 100) * circumference)
                accumulatedAngle += pillar.pct

                return (
                  <circle
                    key={pillar.id}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={pillar.strokeColor}
                    strokeWidth={isSelected ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="butt"
                    fill="transparent"
                    className={`transition-all duration-200 cursor-pointer ${
                      activePillarId && !isSelected ? 'opacity-35' : 'opacity-100'
                    }`}
                    onMouseEnter={() => setActivePillarId(pillar.id)}
                    onMouseLeave={() => setActivePillarId(null)}
                    onClick={() => handlePillarToggle(pillar.id)}
                  />
                )
              })}
          </svg>

          {/* Display Central Dinâmico */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground truncate max-w-[100px]">
              {activePillar ? activePillar.name : 'Total'}
            </span>
            <span className="text-2xl font-extrabold tracking-tight text-foreground tabular-nums leading-tight">
              {activePillar
                ? formatHumanDuration(activePillar.duration)
                : formatHumanDuration(totalDurationSeconds)}
            </span>
            {activePillar && (
              <span className="text-xs font-semibold text-muted-foreground tabular-nums mt-0.5">
                {Math.round(activePillar.pct)}% do tempo
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lista dos 3 Pilares - Superfície Única Agrupada */}
      <div className="space-y-4 pt-1">
        {pillarsData.map(pillar => {
          const isSelected = activePillarId === pillar.id

          return (
            <div key={pillar.id} className="space-y-1.5">
              {/* Título do Pilar */}
              <button
                type="button"
                onClick={() => handlePillarToggle(pillar.id)}
                onMouseEnter={() => setActivePillarId(pillar.id)}
                onMouseLeave={() => setActivePillarId(null)}
                className={`w-full flex items-center justify-between px-1 py-0.5 rounded-lg text-left transition-colors cursor-pointer ${
                  isSelected ? 'text-foreground font-bold' : 'text-foreground/90 hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`size-3 rounded-full ${pillar.dotClass} shrink-0`} />
                  <span className="font-bold text-base tracking-tight">{pillar.name}</span>
                </div>
                <div className="tabular-nums text-sm font-semibold">
                  {formatHumanDuration(pillar.duration)}{' '}
                  <span className="font-normal text-muted-foreground">
                    · {Math.round(pillar.pct)}%
                  </span>
                </div>
              </button>

              {/* Card contendo os sub-itens agrupados sob uma única superfície limpa */}
              <div
                className={`bg-muted/20 rounded-2xl border transition-all duration-200 divide-y divide-border/40 overflow-hidden ${
                  isSelected
                    ? `${pillar.activeBorderClass} ${pillar.activeBgClass} ring-1 ring-border/50`
                    : 'border-border/70 hover:border-border/90'
                }`}
              >
                {pillar.subItems.map(item => {
                  const itemHasSecs = item.duration > 0
                  return (
                    <div
                      key={item.name}
                      className={`flex items-center justify-between px-4 py-3 min-h-[44px] text-sm transition-opacity ${
                        itemHasSecs
                          ? 'opacity-100 font-medium text-foreground'
                          : 'opacity-40 text-muted-foreground font-normal'
                      }`}
                    >
                      <span className={itemHasSecs ? 'text-foreground' : 'text-muted-foreground'}>
                        {item.name}
                      </span>
                      <span className="tabular-nums font-medium">
                        {formatHumanDuration(item.duration)}{' '}
                        <span className="text-muted-foreground font-normal">
                          · {Math.round(item.pct)}%
                        </span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </ScrollAreaFade>
  )
}
