import { useState } from 'react'
import type { SessionRecord, LanguageProfile } from '@/types/imerso'
import { ScrollAreaFade } from '@/components/ui/scroll-area-fade'

interface StatsViewProps {
  sessions: SessionRecord[]
  currentLanguage: LanguageProfile
}

type Period = 'all' | 'month' | 'week'

// Paleta Calibrada de Alto Contraste (Estilo Analytics)
const ACTIVITY_COLORS: Record<string, string> = {
  'Escuta e leitura': '#8b5cf6', // Roxo Linear
  'Escuta':           '#0284c7', // Azul Safira
  'Leitura':          '#6ee7b7', // Menta suave
  'Fala':             '#65a30d', // Verde Oliva
  'Escrita':          '#d97706', // Âmbar queimado
  'Vocabulário':      '#f59e0b', // Âmbar dourado
  'Gramática':        '#f43f5e', // Coral Rose
  'Pronúncia':        '#94a3b8', // Lavanda Slate
}

const IMMERSION_PRACTICES = ['Escuta e leitura', 'Escuta', 'Leitura']

export function StatsView({ sessions, currentLanguage }: StatsViewProps) {
  const [period, setPeriod] = useState<Period>('all')
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)

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

  // Formatação consistente em horas e minutos
  const formatHumanDuration = (secs: number) => {
    if (secs <= 0) return '0 min'
    const hours = Math.floor(secs / 3600)
    const minutes = Math.round((secs % 3600) / 60)
    if (hours === 0) return `${minutes} min`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
  }

  // Agrupamento por atividade
  const activityMap = new Map<string, number>()
  filteredSessions.forEach(s => {
    const current = activityMap.get(s.practice) || 0
    activityMap.set(s.practice, current + s.duration)
  })

  const activities = Array.from(activityMap.entries())
    .map(([name, duration]) => ({
      name,
      duration,
      pct: totalDurationSeconds > 0 ? (duration / totalDurationSeconds) * 100 : 0,
      isImmersion: IMMERSION_PRACTICES.includes(name),
      color: ACTIVITY_COLORS[name] || '#71717a',
    }))
    .sort((a, b) => b.duration - a.duration)

  // Cálculo de Imersão vs Outras Atividades
  const immersionDuration = activities
    .filter(a => a.isImmersion)
    .reduce((acc, a) => acc + a.duration, 0)
  const otherDuration = Math.max(0, totalDurationSeconds - immersionDuration)
  const immersionPct = totalDurationSeconds > 0 ? Math.round((immersionDuration / totalDurationSeconds) * 100) : 0

  // Atividade selecionada atualmente no Donut
  const activeItem = selectedActivity ? activities.find(a => a.name === selectedActivity) : null

  const handleToggleActivity = (name: string) => {
    setSelectedActivity(prev => (prev === name ? null : name))
  }

  const handleClearSelection = () => {
    if (selectedActivity) setSelectedActivity(null)
  }

  // Cálculos SVG do Donut Principal
  const r = 38
  const circ = 2 * Math.PI * r
  let accumulatedOffset = 0

  // Cálculos SVG do Mini-Donut de Imersão
  const miniR = 28
  const miniCirc = 2 * Math.PI * miniR
  const immDash = (immersionPct / 100) * miniCirc

  return (
    <ScrollAreaFade
      className="flex-1 min-h-0 py-2 pr-2 space-y-5"
      onClick={handleClearSelection}
    >
      {/* Filtro de Período (Pills com 'Tudo' primeiro) */}
      <div
        className="flex p-0.5 bg-muted/60 dark:bg-muted/30 rounded-xl border border-border/70"
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => {
            setPeriod('all')
            setSelectedActivity(null)
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            period === 'all'
              ? 'bg-background text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Tudo
        </button>
        <button
          type="button"
          onClick={() => {
            setPeriod('month')
            setSelectedActivity(null)
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            period === 'month'
              ? 'bg-background text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Este mês
        </button>
        <button
          type="button"
          onClick={() => {
            setPeriod('week')
            setSelectedActivity(null)
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            period === 'week'
              ? 'bg-background text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Esta semana
        </button>
      </div>

      {/* Donut Principal Interativo */}
      <div className="flex flex-col items-center justify-center my-1 select-none">
        <div
          className="relative w-[190px] h-[190px] cursor-pointer"
          onClick={e => {
            // Clicou no miolo/fundo do donut -> desmarca
            if ((e.target as HTMLElement).tagName !== 'circle') {
              handleClearSelection()
            }
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {totalDurationSeconds === 0 ? (
              <circle
                cx={50}
                cy={50}
                r={r}
                fill="none"
                stroke="currentColor"
                className="text-muted/40"
                strokeWidth={10}
              />
            ) : (
              activities.map(act => {
                const strokeDash = (act.pct / 100) * circ
                const isAct = selectedActivity === act.name
                const isDim = selectedActivity && !isAct
                const currentOffset = accumulatedOffset
                accumulatedOffset += strokeDash

                return (
                  <circle
                    key={act.name}
                    cx={50}
                    cy={50}
                    r={r}
                    fill="none"
                    stroke={act.color}
                    strokeWidth={isAct ? 14 : 11}
                    strokeDasharray={`${strokeDash} ${circ}`}
                    strokeDashoffset={-currentOffset}
                    className={`transition-all duration-200 cursor-pointer ${
                      isDim ? 'opacity-20' : 'opacity-100'
                    }`}
                    onClick={e => {
                      e.stopPropagation()
                      handleToggleActivity(act.name)
                    }}
                  />
                )
              })
            )}
          </svg>

          {/* Miolo Compacto (18px / 11px) sem o texto de 'X atividades' */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-5">
            <span className="text-[18px] font-bold tracking-tight text-foreground tabular-nums leading-tight">
              {activeItem
                ? formatHumanDuration(activeItem.duration)
                : formatHumanDuration(totalDurationSeconds)}
            </span>
            <span
              className={`text-[11px] font-medium max-w-[120px] truncate transition-colors ${
                activeItem ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {activeItem ? activeItem.name : 'Total estudado'}
            </span>
            {activeItem && (
              <span className="text-[10px] text-muted-foreground font-medium tabular-nums mt-0.5">
                {Math.round(activeItem.pct)}% do período
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Atividades */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Distribuição por atividade
          </span>
        </div>

        {activities.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground bg-muted/20 border border-border/70 rounded-xl">
            Nenhuma sessão registrada neste período.
          </div>
        ) : (
          <div className="bg-muted/20 border border-border/70 rounded-xl overflow-hidden divide-y divide-border/40">
            {activities.map(act => {
              const isAct = selectedActivity === act.name
              const isDim = selectedActivity && !isAct

              return (
                <button
                  type="button"
                  key={act.name}
                  onClick={e => {
                    e.stopPropagation()
                    handleToggleActivity(act.name)
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all cursor-pointer min-h-[46px] ${
                    isAct
                      ? 'bg-muted/60 dark:bg-muted/40'
                      : 'hover:bg-muted/40 dark:hover:bg-muted/20'
                  } ${isDim ? 'opacity-35' : 'opacity-100'}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="size-2 rounded-full shrink-0"
                      style={{ backgroundColor: act.color }}
                    />
                    <span className="text-[13px] font-medium text-foreground truncate">
                      {act.name}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 tabular-nums shrink-0 ml-3">
                    <span className="text-[13px] font-semibold text-foreground">
                      {formatHumanDuration(act.duration)}
                    </span>
                    <span className="text-[12px] text-muted-foreground min-w-[28px] text-right">
                      {Math.round(act.pct)}%
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Mini-Donut de Imersão no Rodapé */}
      {totalDurationSeconds > 0 && (
        <div
          className="bg-muted/20 border border-border/70 rounded-xl p-4 flex items-center gap-4 select-none"
          onClick={e => e.stopPropagation()}
        >
          <div className="relative size-[68px] shrink-0">
            <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
              {/* Trilha de Outras Atividades em Lilás Sutil */}
              <circle
                cx={36}
                cy={36}
                r={miniR}
                fill="none"
                stroke="#c4b5fd"
                strokeWidth={7}
                className="opacity-70 dark:opacity-80"
              />
              {/* Arco de Imersão em Roxo Linear */}
              <circle
                cx={36}
                cy={36}
                r={miniR}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth={7}
                strokeDasharray={`${immDash} ${miniCirc}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[13px] font-bold text-foreground tabular-nums">
              {immersionPct}%
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#8b5cf6] shrink-0" />
                <span className="text-[13px] font-medium text-foreground">Imersão</span>
              </div>
              <span className="text-[13px] font-semibold text-foreground tabular-nums">
                {formatHumanDuration(immersionDuration)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#c4b5fd] shrink-0" />
                <span className="text-[13px] font-medium text-muted-foreground">Outras atividades</span>
              </div>
              <span className="text-[13px] font-semibold text-foreground tabular-nums">
                {formatHumanDuration(otherDuration)}
              </span>
            </div>
          </div>
        </div>
      )}
    </ScrollAreaFade>
  )
}
