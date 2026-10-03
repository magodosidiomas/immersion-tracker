import { useState } from 'react'
import type { SessionRecord, LanguageProfile } from '@/types/imerso'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'

interface StatsViewProps {
  sessions: SessionRecord[]
  currentLanguage: LanguageProfile
}

type Period = 'all' | 'month' | 'week'

interface PillarDef {
  id: string
  name: string
  items: string[]
  colorClass: string
  bgTrackClass: string
}

const PILLARS: PillarDef[] = [
  {
    id: 'imm',
    name: 'Imersão',
    items: ['Escuta e leitura', 'Escuta', 'Leitura'],
    colorClass: 'bg-primary text-primary-foreground',
    bgTrackClass: 'bg-primary',
  },
  {
    id: 'out',
    name: 'Produção',
    items: ['Fala', 'Escrita'],
    colorClass: 'bg-muted-foreground text-background',
    bgTrackClass: 'bg-muted-foreground',
  },
  {
    id: 'fnd',
    name: 'Fundamentos',
    items: ['Pronúncia', 'Gramática', 'Vocabulário'],
    colorClass: 'bg-muted text-muted-foreground',
    bgTrackClass: 'bg-border',
  },
]

export function StatsView({ sessions, currentLanguage }: StatsViewProps) {
  const [period, setPeriod] = useState<Period>('all')

  const now = Date.now()
  let filteredSessions = sessions.filter(s => s.language === currentLanguage.id)

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
    const subItems = pillar.items
      .map(item => {
        const itemSecs = matchingSessions
          .filter(s => s.practice === item)
          .reduce((acc, s) => acc + s.duration, 0)
        const itemPct = totalDurationSeconds > 0 ? (itemSecs / totalDurationSeconds) * 100 : 0
        return { name: item, duration: itemSecs, pct: itemPct }
      })
      .filter(x => x.duration > 0)
      .sort((a, b) => b.duration - a.duration)

    return {
      ...pillar,
      duration: pillarTotalSecs,
      pct,
      subItems,
    }
  }).filter(p => p.duration > 0)

  return (
    <div className="flex-1 flex flex-col justify-start py-3 space-y-4 overflow-auto">
      {/* Top Section: Período e Total */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
          Tempo Dedicado
        </span>
        <div className="text-4xl font-extrabold tracking-tight text-foreground font-mono">
          {formatHumanDuration(totalDurationSeconds)}
        </div>
      </div>

      {/* Filtro de Período (Pills) */}
      <div className="flex p-1 bg-muted/60 rounded-xl border border-border/60">
        <button
          type="button"
          onClick={() => setPeriod('all')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
            period === 'all'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Tudo
        </button>
        <button
          type="button"
          onClick={() => setPeriod('month')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
            period === 'month'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Este mês
        </button>
        <button
          type="button"
          onClick={() => setPeriod('week')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
            period === 'week'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Esta semana
        </button>
      </div>

      {/* Conteúdo: Estado Vazio ou 3 Pilares */}
      {totalDurationSeconds === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 my-auto text-muted-foreground space-y-2">
          <div className="p-3 rounded-full bg-muted/40 text-muted-foreground/60 mb-1">
            <BarChart3 className="size-8" />
          </div>
          <p className="text-sm font-medium text-foreground">Nenhuma sessão registrada</p>
          <p className="text-xs max-w-[220px]">
            Conclua sua primeira sessão no Timer para visualizar a divisão dos seus estudos em 3 pilares.
          </p>
        </div>
      ) : (
        <div className="space-y-4 pt-1">
          {/* Barra Macro Segmentada Proporcional */}
          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-muted/40 border border-border/60">
              {pillarsData.map(p => (
                <div
                  key={p.id}
                  className={`h-full transition-all ${p.bgTrackClass}`}
                  style={{ width: `${p.pct}%` }}
                  title={`${p.name}: ${formatHumanDuration(p.duration)} (${Math.round(p.pct)}%)`}
                />
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground text-center">
              Divisão em 3 macro-pilares: Imersão, Produção e Fundamentos
            </p>
          </div>

          {/* Lista dos 3 Pilares com Sub-itens */}
          <div className="space-y-3">
            {pillarsData.map(pillar => (
              <Card key={pillar.id} className="border-border/80 bg-background rounded-2xl overflow-hidden shadow-none">
                <CardHeader className="p-3.5 pb-2 border-b border-border/40 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`size-2.5 rounded-full ${pillar.bgTrackClass}`} />
                      <span className="font-semibold text-sm text-foreground">{pillar.name}</span>
                    </div>
                    <div className="font-mono text-xs font-semibold text-foreground">
                      {formatHumanDuration(pillar.duration)}{' '}
                      <span className="font-normal text-muted-foreground">· {Math.round(pillar.pct)}%</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-3.5 pt-2.5 space-y-2">
                  {pillar.subItems.map(item => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className="font-mono text-foreground font-medium">
                        {formatHumanDuration(item.duration)}{' '}
                        <span className="text-muted-foreground font-normal">· {Math.round(item.pct)}%</span>
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
