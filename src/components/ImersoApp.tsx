import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  Play,
  Pause,
  Square,
  Plus,
  ChevronDown,
  ChevronLeft,
  X,
  Check,
  Sun,
  Moon,
  Layers,
  Timer as TimerIcon,
  Award,
  BarChart3,
  History,
  AlertCircle
} from 'lucide-react'
import { StatsView } from '@/components/StatsView'
import {
  PRACTICES,
  type SessionRecord,
  type LanguageProfile,
  type ImmersionStyle
} from '@/types/imerso'
import {
  getStoredLanguages,
  getCurrentLanguageId,
  setCurrentLanguageId,
  getStoredSessions,
  saveSessionRecord
} from '@/lib/storage'

interface ImersoAppProps {
  onOpenStorybook: () => void
  onOpenDesignLab?: () => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  direction?: 'industrial' | 'editorial' | 'amber'
}

type TabKey = 'timer' | 'metas' | 'estatisticas' | 'historico'
type TimerState = 'idle' | 'running' | 'paused'

export function ImersoApp({ onOpenStorybook, theme, onToggleTheme }: ImersoAppProps) {
  // Navigation
  const [activeTab, setActiveTab] = useState<TabKey>('timer')

  // Languages
  const [languages] = useState<LanguageProfile[]>(getStoredLanguages)
  const [currentLangId, setCurrentLangIdState] = useState<string>(getCurrentLanguageId)
  const [isLangDrawerOpen, setIsLangDrawerOpen] = useState(false)

  // Timer State
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const accumulatedRef = useRef<number>(0)
  const timerIntervalRef = useRef<number | null>(null)

  // Seleção de Fonte Global ('jakarta', 'outfit', 'nunito' [gamificada] ou 'sora')
  type AppFont = 'jakarta' | 'outfit' | 'nunito' | 'sora'
  const [appFont, setAppFont] = useState<AppFont>(() => {
    const saved = localStorage.getItem('imerso-app-font')
    if (saved === 'outfit' || saved === 'jakarta' || saved === 'nunito' || saved === 'sora') return saved as AppFont
    return 'jakarta'
  })

  // Peso do Timer (médio, semibold, bold)
  const [timerWeight, setTimerWeight] = useState<'medium' | 'semibold' | 'bold'>(() => {
    const saved = localStorage.getItem('imerso-timer-weight')
    if (saved === 'medium' || saved === 'semibold' || saved === 'bold') return saved
    return 'bold'
  })

  useEffect(() => {
    localStorage.setItem('imerso-app-font', appFont)
  }, [appFont])

  useEffect(() => {
    localStorage.setItem('imerso-timer-weight', timerWeight)
  }, [timerWeight])

  const fontClass =
    appFont === 'outfit'
      ? 'font-outfit'
      : appFont === 'nunito'
      ? 'font-nunito'
      : appFont === 'sora'
      ? 'font-sora'
      : 'font-jakarta'

  // Summary State (After Encerrar)
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)
  const [summarySeconds, setSummarySeconds] = useState(0)
  const [selectedPractice, setSelectedPractice] = useState<string>('')
  const [selectedStyle, setSelectedStyle] = useState<ImmersionStyle | null>(null)
  const [isPracticeDrawerOpen, setIsPracticeDrawerOpen] = useState(false)
  const [practiceDrawerStep, setPracticeDrawerStep] = useState<1 | 2>(1)
  const [tempPractice, setTempPractice] = useState<string>('')
  const [inlineErrors, setInlineErrors] = useState<{ time?: string; practice?: string; style?: string }>({})

  // Discard Confirmation Dialog
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false)

  // Sessions History
  const [sessions, setSessions] = useState<SessionRecord[]>(getStoredSessions)

  const currentLanguage = languages.find(l => l.id === currentLangId) || languages[0]

  // Timer calculation loop based on Date.now() timestamp
  useEffect(() => {
    if (timerState === 'running') {
      startTimeRef.current = Date.now()
      timerIntervalRef.current = window.setInterval(() => {
        if (startTimeRef.current) {
          const delta = Math.floor((Date.now() - startTimeRef.current) / 1000)
          setElapsedSeconds(accumulatedRef.current + delta)
        }
      }, 250)
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [timerState])

  // Format seconds to hh:mm:ss
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
  }

  // Timer Actions
  const handleStart = () => {
    accumulatedRef.current = 0
    setElapsedSeconds(0)
    setTimerState('running')
  }

  const handlePause = () => {
    if (startTimeRef.current) {
      accumulatedRef.current += Math.floor((Date.now() - startTimeRef.current) / 1000)
    }
    setTimerState('paused')
  }

  const handleResume = () => {
    setTimerState('running')
  }

  const handleStop = () => {
    let finalSecs = elapsedSeconds
    if (timerState === 'running' && startTimeRef.current) {
      finalSecs = accumulatedRef.current + Math.floor((Date.now() - startTimeRef.current) / 1000)
    }
    setTimerState('idle')
    setElapsedSeconds(0)
    accumulatedRef.current = 0

    // Open Summary View
    setSummarySeconds(finalSecs)
    setSelectedPractice('')
    setSelectedStyle(null)
    setInlineErrors({})
    setIsSummaryOpen(true)
  }

  // Language Selector clicked
  const handleLanguageClick = () => {
    if (timerState !== 'idle') {
      toast.warning('Encerre a sessão para trocar de idioma')
      return
    }
    setIsLangDrawerOpen(true)
  }

  const handleSelectLanguage = (langId: string) => {
    setCurrentLangIdState(langId)
    setCurrentLanguageId(langId)
    setIsLangDrawerOpen(false)
    const lang = languages.find(l => l.id === langId)
    if (lang) {
      toast.success(`Idioma alterado para ${lang.name}`)
    }
  }

  // Discard summary logic
  const handleRequestDiscard = () => {
    if (summarySeconds <= 10) {
      // Discard directly if under 10 seconds (SPEC rule)
      setIsSummaryOpen(false)
      toast.info('Sessão descartada')
    } else {
      setIsDiscardDialogOpen(true)
    }
  }

  const handleConfirmDiscard = () => {
    setIsDiscardDialogOpen(false)
    setIsSummaryOpen(false)
    toast.info('Sessão descartada')
  }

  // Practice Selection
  const handleOpenPracticeDrawer = () => {
    setPracticeDrawerStep(1)
    setTempPractice(selectedPractice)
    setIsPracticeDrawerOpen(true)
  }

  const handleChoosePractice = (practiceName: string) => {
    const practice = PRACTICES.find(p => p.name === practiceName)
    if (practice?.hasStyle) {
      setTempPractice(practiceName)
      setPracticeDrawerStep(2)
    } else {
      setSelectedPractice(practiceName)
      setSelectedStyle(null)
      setIsPracticeDrawerOpen(false)
      setInlineErrors(prev => ({ ...prev, practice: undefined, style: undefined }))
    }
  }

  const handleChooseStyle = (style: ImmersionStyle) => {
    setSelectedPractice(tempPractice)
    setSelectedStyle(style)
    setIsPracticeDrawerOpen(false)
    setInlineErrors(prev => ({ ...prev, practice: undefined, style: undefined }))
  }

  // Save Session (Pronto)
  const handleSaveSession = () => {
    const errors: { time?: string; practice?: string; style?: string } = {}

    if (summarySeconds <= 0) {
      errors.time = 'Informe um tempo maior que 00:00:00.'
    }
    if (!selectedPractice) {
      errors.practice = 'Escolha uma prática para salvar.'
    } else {
      const practiceObj = PRACTICES.find(p => p.name === selectedPractice)
      if (practiceObj?.hasStyle && !selectedStyle) {
        errors.style = 'Escolha o estilo da prática.'
      }
    }

    if (Object.keys(errors).length > 0) {
      setInlineErrors(errors)
      return
    }

    const newRecord: SessionRecord = {
      id: Date.now().toString(),
      language: currentLangId,
      startedAt: Date.now() - summarySeconds * 1000,
      duration: summarySeconds,
      practice: selectedPractice,
      style: selectedStyle || undefined,
      source: 'timer',
    }

    saveSessionRecord(newRecord)
    setSessions(getStoredSessions())
    setIsSummaryOpen(false)

    const mins = Math.max(1, Math.round(summarySeconds / 60))
    const styleInfo = selectedStyle ? ` · ${selectedStyle}` : ''
    toast.success(`Sessão salva · ${mins} min · ${selectedPractice}${styleInfo}`)
  }

  // Filter sessions for current language
  const languageSessions = sessions.filter(s => s.language === currentLangId)
  const totalSecondsLanguage = languageSessions.reduce((acc, curr) => acc + curr.duration, 0)
  const totalHoursLanguage = (totalSecondsLanguage / 3600).toFixed(1)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-between p-4 sm:p-6 transition-colors">
      {/* Container Central com proporção móvel e bordas suaves */}
      <div className={`w-full max-w-[400px] min-h-[700px] border border-border/80 bg-card rounded-[32px] p-5 flex flex-col relative shadow-sm overflow-hidden ${fontClass}`}>
        
        {/* Top Bar: Selector de Idioma + Ações */}
        <header className="flex items-center justify-between min-h-[48px] mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLanguageClick}
            className="gap-1.5 font-semibold text-sm h-10 px-3.5 rounded-xl border-border bg-background"
          >
            <span>{currentLanguage.name}</span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </Button>

          <div className="flex items-center gap-1.5">
            {/* Botão de Registro Manual (some durante sessão, conforme SPEC) */}
            {timerState === 'idle' && !isSummaryOpen && (
              <Button
                variant="ghost"
                size="icon"
                title="Registrar sessão manual"
                className="size-9 rounded-lg text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setSummarySeconds(1800) // 30 min default
                  setSelectedPractice('')
                  setSelectedStyle(null)
                  setInlineErrors({})
                  setIsSummaryOpen(true)
                }}
              >
                <Plus className="size-5" />
              </Button>
            )}

            {/* Alternador de Tema */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTheme}
              className="size-9 rounded-lg text-muted-foreground"
              title="Alternar Light / Dark"
            >
              {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </Button>

            {/* Acesso ao Storybook */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenStorybook}
              className="size-9 rounded-lg text-primary"
              title="Abrir UI Kit / Storybook"
            >
              <Layers className="size-4" />
            </Button>
          </div>
        </header>

        {/* CONTEÚDO PRINCIPAL (CONDICIONAL POR ABA) */}
        {isSummaryOpen ? (
          /* TELA DE RESUMO DA SESSÃO (CONFORME SPEC.MD SEÇÃO 4) */
          <div className="flex-1 flex flex-col justify-between pt-2 pb-2">
            <div>
              {/* Header do Resumo: X para descartar */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRequestDiscard}
                  className="size-9 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <X className="size-5" />
                </Button>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Resumo da sessão
                </span>
                <div className="w-9" />
              </div>

              {/* Campo de Tempo hh:mm:ss */}
              <div className="mb-6 text-center">
                <label className="text-xs font-medium text-muted-foreground block mb-2">
                  Tempo da sessão
                </label>
                <div
                  className={`text-5xl font-light py-4 px-6 rounded-2xl border bg-muted/20 tracking-tight tabular-nums ${fontClass} ${
                    inlineErrors.time ? 'border-destructive' : 'border-border'
                  }`}
                >
                  {formatTime(summarySeconds)}
                </div>
                {inlineErrors.time && (
                  <p className="text-xs text-destructive mt-1.5 flex items-center justify-center gap-1">
                    <AlertCircle className="size-3" /> {inlineErrors.time}
                  </p>
                )}
              </div>

              {/* Linha de Prática */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground block">
                  Prática
                </label>
                <button
                  type="button"
                  onClick={handleOpenPracticeDrawer}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-colors bg-background ${
                    inlineErrors.practice || inlineErrors.style ? 'border-destructive' : 'border-border'
                  }`}
                >
                  <div>
                    <div className="font-medium text-sm text-foreground">
                      {selectedPractice || <span className="text-muted-foreground">Selecionar prática</span>}
                    </div>
                    {selectedStyle && (
                      <div className="text-xs text-muted-foreground mt-0.5">{selectedStyle}</div>
                    )}
                  </div>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </button>
                {(inlineErrors.practice || inlineErrors.style) && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="size-3" /> {inlineErrors.practice || inlineErrors.style}
                  </p>
                )}
              </div>
            </div>

            {/* Barra de Ação Compacta com botão Pronto (56px) */}
            <div className="pt-4 border-t border-border mt-auto">
              <Button
                size="lg"
                onClick={handleSaveSession}
                className="w-full h-14 text-base font-semibold rounded-xl bg-primary text-primary-foreground"
              >
                Pronto
              </Button>
            </div>
          </div>
        ) : activeTab === 'timer' ? (
          /* ABA 1: TIMER (CONFORME SPEC.MD SEÇÃO 3) */
          <div className="flex-1 flex flex-col justify-between py-4">
            {/* Seletor de Comparação de Fonte Global (no Timer ocioso para teste) */}
            {timerState === 'idle' ? (
              <div className="space-y-2 mb-2 max-w-[340px] mx-auto w-full">
                {/* 4 Opções de Fontes para a Interface Toda */}
                <div className="p-1 bg-muted/60 rounded-xl border border-border/40 grid grid-cols-4 gap-1">
                  <button
                    type="button"
                    onClick={() => setAppFont('jakarta')}
                    className={`py-1.5 px-1 text-[11px] font-medium rounded-lg transition-all text-center ${
                      appFont === 'jakarta'
                        ? 'bg-card shadow-xs text-foreground font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Jakarta
                  </button>
                  <button
                    type="button"
                    onClick={() => setAppFont('outfit')}
                    className={`py-1.5 px-1 text-[11px] font-medium rounded-lg transition-all text-center ${
                      appFont === 'outfit'
                        ? 'bg-card shadow-xs text-foreground font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Outfit
                  </button>
                  <button
                    type="button"
                    onClick={() => setAppFont('nunito')}
                    className={`py-1.5 px-1 text-[11px] font-medium rounded-lg transition-all text-center ${
                      appFont === 'nunito'
                        ? 'bg-card shadow-xs text-foreground font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Nunito 🎮
                  </button>
                  <button
                    type="button"
                    onClick={() => setAppFont('sora')}
                    className={`py-1.5 px-1 text-[11px] font-medium rounded-lg transition-all text-center ${
                      appFont === 'sora'
                        ? 'bg-card shadow-xs text-foreground font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Sora ✨
                  </button>
                </div>

                {/* Alternador de Peso (Médio vs Semibold vs Bold) */}
                <div className="flex items-center justify-center gap-1 p-0.5 bg-muted/40 rounded-lg max-w-[210px] mx-auto border border-border/30">
                  <button
                    type="button"
                    onClick={() => setTimerWeight('medium')}
                    className={`flex-1 py-0.5 px-2 text-[10px] rounded-md transition-all ${
                      timerWeight === 'medium'
                        ? 'bg-card text-foreground font-medium shadow-xs'
                        : 'text-muted-foreground'
                    }`}
                  >
                    Médio
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimerWeight('semibold')}
                    className={`flex-1 py-0.5 px-2 text-[10px] rounded-md transition-all ${
                      timerWeight === 'semibold'
                        ? 'bg-card text-foreground font-semibold shadow-xs'
                        : 'text-muted-foreground'
                    }`}
                  >
                    Semibold
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimerWeight('bold')}
                    className={`flex-1 py-0.5 px-2 text-[10px] rounded-md transition-all ${
                      timerWeight === 'bold'
                        ? 'bg-card text-foreground font-bold shadow-xs'
                        : 'text-muted-foreground'
                    }`}
                  >
                    Bold
                  </button>
                </div>
              </div>
            ) : (
              <div />
            )}

            {/* Grande Display hh:mm:ss mais bold e sem zero cortado */}
            <div className="text-center my-auto py-8">
              <div
                className={`text-[70px] sm:text-[78px] leading-none tracking-[-0.035em] tabular-nums transition-all select-none ${
                  timerWeight === 'bold'
                    ? 'font-bold'
                    : timerWeight === 'semibold'
                    ? 'font-semibold'
                    : 'font-medium'
                } ${
                  timerState === 'idle' ? 'text-muted-foreground/35' : 'text-foreground'
                }`}
              >
                {formatTime(elapsedSeconds)}
              </div>
            </div>

            {/* Controles do Timer com feedback tátil */}
            <div className="space-y-3">
              {timerState === 'idle' && (
                <Button
                  size="lg"
                  onClick={handleStart}
                  className="w-full h-16 text-lg font-medium rounded-2xl gap-2 shadow-sm active:scale-[0.99] transition-transform"
                >
                  <Play className="size-5 fill-current" /> Iniciar
                </Button>
              )}

              {timerState === 'running' && (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handlePause}
                    className="h-14 text-base font-medium rounded-2xl gap-2 border-border active:scale-[0.99] transition-transform"
                  >
                    <Pause className="size-4" /> Pausar
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleStop}
                    className="h-14 text-base font-medium rounded-2xl gap-2 text-destructive hover:bg-destructive/10 active:scale-[0.99] transition-transform"
                  >
                    <Square className="size-4" /> Encerrar
                  </Button>
                </div>
              )}

              {timerState === 'paused' && (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    size="lg"
                    onClick={handleResume}
                    className="h-14 text-base font-medium rounded-2xl gap-2 active:scale-[0.99] transition-transform"
                  >
                    <Play className="size-4 fill-current" /> Retomar
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleStop}
                    className="h-14 text-base font-medium rounded-2xl gap-2 text-destructive hover:bg-destructive/10 active:scale-[0.99] transition-transform"
                  >
                    <Square className="size-4" /> Encerrar
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'metas' ? (
          /* ABA 2: METAS E NÍVEIS (SPEC SEÇÃO 12) */
          <div className="flex-1 flex flex-col justify-start py-4 space-y-5 overflow-auto">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                Total acumulado
              </span>
              <div className="text-4xl font-extrabold tracking-tight text-foreground font-mono">
                {totalHoursLanguage}h
              </div>
            </div>

            {/* Card Integrado do Nível Atual */}
            <Card className="border-border bg-muted/30 rounded-2xl">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="default" className="text-xs font-semibold">
                    Nível 1
                  </Badge>
                  <span className="font-mono text-xs text-muted-foreground">
                    {totalHoursLanguage}h / 1.0h
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-1 space-y-3">
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden border border-border/60">
                  <div
                    className="bg-primary h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.round((Number(totalHoursLanguage) / 1.0) * 100))}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Faltam {(Math.max(0, 1.0 - Number(totalHoursLanguage))).toFixed(1)}h para o Nível 2
                </p>
              </CardContent>
            </Card>

            <div className="text-xs text-muted-foreground">
              {languageSessions.length} sessões registradas em {currentLanguage.name}.
            </div>
          </div>
        ) : activeTab === 'estatisticas' ? (
          /* ABA 3: ESTATÍSTICAS (3 PILARES CONFORME PROTOTYPE) */
          <StatsView sessions={sessions} currentLanguage={currentLanguage} />
        ) : (
          /* ABA 4: HISTÓRICO (SPEC SEÇÃO 11) */
          <div className="flex-1 flex flex-col justify-start py-4 space-y-4 overflow-auto">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-sm font-semibold">Histórico de Sessões</span>
              <Badge variant="secondary" className="text-xs">
                {languageSessions.length} {languageSessions.length === 1 ? 'sessão' : 'sessões'}
              </Badge>
            </div>

            {languageSessions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                Nenhuma sessão registrada em {currentLanguage.name} ainda. Complete sua primeira sessão no Timer!
              </div>
            ) : (
              <div className="space-y-2.5">
                {languageSessions.map(session => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-background"
                  >
                    <div>
                      <div className="font-medium text-sm text-foreground">{session.practice}</div>
                      {session.style && (
                        <div className="text-xs text-muted-foreground">{session.style}</div>
                      )}
                    </div>
                    <div className="font-mono text-sm font-medium text-muted-foreground">
                      {Math.max(1, Math.round(session.duration / 60))} min
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BOTTOM NAV (Some durante sessão ativa, conforme SPEC SEÇÃO 2) */}
        {timerState === 'idle' && !isSummaryOpen && (
          <nav className="flex items-center justify-between px-2 pt-3 border-t border-border mt-auto">
            <button
              onClick={() => setActiveTab('timer')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 text-xs font-medium transition-colors ${
                activeTab === 'timer' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TimerIcon className="size-5" />
              <span>Timer</span>
            </button>

            <button
              onClick={() => setActiveTab('metas')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 text-xs font-medium transition-colors ${
                activeTab === 'metas' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Award className="size-5" />
              <span>Metas</span>
            </button>

            <button
              onClick={() => setActiveTab('estatisticas')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 text-xs font-medium transition-colors ${
                activeTab === 'estatisticas' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BarChart3 className="size-5" />
              <span>Estatísticas</span>
            </button>

            <button
              onClick={() => setActiveTab('historico')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 text-xs font-medium transition-colors ${
                activeTab === 'historico' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <History className="size-5" />
              <span>Histórico</span>
            </button>
          </nav>
        )}
      </div>

      {/* DRAWER: TROCA DE IDIOMA */}
      <Drawer open={isLangDrawerOpen} onOpenChange={setIsLangDrawerOpen}>
        <DrawerContent className="max-w-[400px] mx-auto">
          <DrawerHeader>
            <DrawerTitle>Trocar de idioma</DrawerTitle>
            <DrawerDescription>Selecione o perfil que deseja estudar agora</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-1.5 max-h-[50vh] overflow-auto">
            {languages.map(lang => {
              const isSelected = lang.id === currentLangId
              return (
                <button
                  key={lang.id}
                  onClick={() => handleSelectLanguage(lang.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-colors text-left ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">{lang.name}</span>
                    <span className="text-xs text-muted-foreground font-normal">({lang.nativeName})</span>
                  </div>
                  <div
                    className={`size-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'
                    }`}
                  >
                    {isSelected && <div className="size-1.5 bg-white rounded-full" />}
                  </div>
                </button>
              )
            })}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Fechar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* DRAWER: SELEÇÃO DE PRÁTICA E ESTILO (SPEC SEÇÃO 6) */}
      <Drawer open={isPracticeDrawerOpen} onOpenChange={setIsPracticeDrawerOpen}>
        <DrawerContent className="max-w-[400px] mx-auto">
          <DrawerHeader>
            {practiceDrawerStep === 1 ? (
              <>
                <DrawerTitle>Prática</DrawerTitle>
                <DrawerDescription>Selecione a habilidade praticada nesta sessão</DrawerDescription>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => setPracticeDrawerStep(1)}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <div>
                  <DrawerTitle>Como foi a prática?</DrawerTitle>
                  <DrawerDescription>{tempPractice}</DrawerDescription>
                </div>
              </div>
            )}
          </DrawerHeader>

          <div className="p-4 space-y-2 max-h-[55vh] overflow-auto">
            {practiceDrawerStep === 1 ? (
              // TELA 1: LISTA DAS 8 PRÁTICAS
              PRACTICES.map(p => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleChoosePractice(p.name)}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border hover:bg-muted/50 transition-colors text-left"
                >
                  <span className="text-sm font-medium text-foreground">{p.name}</span>
                  {selectedPractice === p.name && <Check className="size-4 text-primary" />}
                </button>
              ))
            ) : (
              // TELA 2: ESTILO (IMERSÃO VS IMERSÃO INTERATIVA)
              <>
                <button
                  type="button"
                  onClick={() => handleChooseStyle('Imersão')}
                  className="w-full flex flex-col p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors text-left space-y-1"
                >
                  <span className="text-sm font-semibold text-foreground">Imersão</span>
                  <span className="text-xs text-muted-foreground">
                    Poucas ou nenhuma pausa para consultar palavras.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleChooseStyle('Imersão interativa')}
                  className="w-full flex flex-col p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors text-left space-y-1"
                >
                  <span className="text-sm font-semibold text-foreground">Imersão interativa</span>
                  <span className="text-xs text-muted-foreground">
                    Pausas frequentes para consultar palavras.
                  </span>
                </button>
              </>
            )}
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* DIÁLOGO: CONFIRMAÇÃO DE DESCARTAR SESSÃO */}
      <Dialog open={isDiscardDialogOpen} onOpenChange={setIsDiscardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Descartar esta sessão?</DialogTitle>
            <DialogDescription>
              Os {Math.max(1, Math.round(summarySeconds / 60))} minutos medidos não serão registrados no seu histórico.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDiscardDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDiscard}>
              Descartar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
