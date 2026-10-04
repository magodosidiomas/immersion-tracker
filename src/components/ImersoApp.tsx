import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
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
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Sun,
  Moon,
  Layers,
  Timer as TimerIcon,
  Calendar as CalendarIcon,
  Award,
  BarChart3,
  History,
  AlertCircle,
  Lock
} from 'lucide-react'
import { StatsView } from '@/components/StatsView'
import { AddLanguageView } from '@/components/AddLanguageView'
import { ManageLanguagesView } from '@/components/ManageLanguagesView'
import { LanguageFlag, preloadFlags } from '@/components/LanguageFlag'
import { ScrollAreaFade } from '@/components/ui/scroll-area-fade'
import {
  PRACTICES,
  type SessionRecord,
  type LanguageProfile,
  type ImmersionStyle
} from '@/types/imerso'
import {
  getStoredLanguages,
  saveStoredLanguages,
  getCurrentLanguageId,
  setCurrentLanguageId,
  getStoredSessions,
  saveSessionRecord,
  deleteSessionRecord,
  deleteSessionsForLanguage,
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
  const [currentScreen, setCurrentScreen] = useState<'main' | 'add-language' | 'manage-languages'>('main')
  const [addLanguageOrigin, setAddLanguageOrigin] = useState<'sheet' | 'manage'>('sheet')
  const [highlightedDayKey, _setHighlightedDayKey] = useState<string | null>(null)
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null)
  const [manualEntryDate, setManualEntryDate] = useState<number | null>(null)
  const dateInputRef = useRef<HTMLInputElement>(null)

  // Languages
  const [languages, setLanguages] = useState<LanguageProfile[]>(getStoredLanguages)
  const [currentLangId, setCurrentLangIdState] = useState<string>(getCurrentLanguageId)
  const [isLangDrawerOpen, setIsLangDrawerOpen] = useState(false)

  // Preload flags for user languages immediately
  useEffect(() => {
    if (languages.length > 0) {
      preloadFlags(languages.map(l => l.id))
    }
  }, [languages])

  // Timer State
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const accumulatedRef = useRef<number>(0)
  const timerIntervalRef = useRef<number | null>(null)

  // Tipografia Global Travada em Outfit (Geometria moderna, zeros circulares sem corte)
  const fontClass = 'font-outfit'

  useEffect(() => {
    document.documentElement.setAttribute('data-app-font', 'outfit')
  }, [])

  // Summary State (After Encerrar)
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [summarySeconds, setSummarySeconds] = useState(0)
  const [selectedPractice, setSelectedPractice] = useState<string>('')
  const [selectedStyle, setSelectedStyle] = useState<ImmersionStyle | null>(null)
  const [isPracticeDrawerOpen, setIsPracticeDrawerOpen] = useState(false)
  const [practiceDrawerStep, setPracticeDrawerStep] = useState<1 | 2>(1)
  const [tempPractice, setTempPractice] = useState<string>('')
  const [inlineErrors, setInlineErrors] = useState<{ time?: string; practice?: string; style?: string }>({})
  const [entrySource, setEntrySource] = useState<'timer' | 'manual'>('timer')

  // Time Editor State (Estilo Samsung: digitação da direita para a esquerda via input nativo)
  const [isEditingTime, setIsEditingTime] = useState(false)
  const digitBufferRef = useRef('000000')
  const isFreshEditRef = useRef(true)
  const timeInputRef = useRef<HTMLInputElement>(null)

  const getDigitsFromSeconds = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600)
    const mins = Math.floor((totalSecs % 3600) / 60)
    const secs = totalSecs % 60
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(hrs)}${pad(mins)}${pad(secs)}`
  }

  const getSecondsFromDigits = (digits: string) => {
    const padded = digits.padStart(6, '0')
    const hrs = parseInt(padded.slice(0, 2), 10) || 0
    const mins = parseInt(padded.slice(2, 4), 10) || 0
    const secs = parseInt(padded.slice(4, 6), 10) || 0
    return Math.min(24 * 3600, hrs * 3600 + mins * 60 + secs)
  }

  const handleStartEditTime = () => {
    setIsEditingTime(true)
    isFreshEditRef.current = true
    const initialDigits = getDigitsFromSeconds(summarySeconds)
    digitBufferRef.current = initialDigits
    setTimeout(() => {
      if (timeInputRef.current) {
        const len = timeInputRef.current.value.length
        timeInputRef.current.setSelectionRange(len, len)
      }
    }, 0)
  }

  const handleDigitInput = (key: string) => {
    setInlineErrors(prev => ({ ...prev, time: undefined }))
    let newDigits = digitBufferRef.current
    if (key === 'backspace' || key === 'b') {
      newDigits = isFreshEditRef.current ? '000000' : ('0' + digitBufferRef.current.slice(0, 5))
    } else if (/^[0-9]$/.test(key)) {
      newDigits = isFreshEditRef.current
        ? ('00000' + key).slice(-6)
        : (digitBufferRef.current + key).slice(-6)
    }
    isFreshEditRef.current = false
    digitBufferRef.current = newDigits
    setSummarySeconds(getSecondsFromDigits(newDigits))
    setTimeout(() => {
      if (timeInputRef.current) {
        const len = timeInputRef.current.value.length
        timeInputRef.current.setSelectionRange(len, len)
      }
    }, 0)
  }

  const handleTimeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault()
      handleDigitInput(e.key)
    } else if (e.key === 'Backspace') {
      e.preventDefault()
      handleDigitInput('backspace')
    } else if (e.key === 'Delete') {
      e.preventDefault()
      digitBufferRef.current = '000000'
      isFreshEditRef.current = false
      setSummarySeconds(0)
      setInlineErrors(prev => ({ ...prev, time: undefined }))
    } else if (e.key === 'Enter' || e.key === 'Escape') {
      e.currentTarget.blur()
    }
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nativeEvent = e.nativeEvent as InputEvent
    if (nativeEvent.inputType === 'deleteContentBackward') {
      handleDigitInput('backspace')
      return
    }
    if (nativeEvent.data && /^[0-9]$/.test(nativeEvent.data)) {
      handleDigitInput(nativeEvent.data)
      return
    }
    const rawDigits = e.target.value.replace(/\D/g, '')
    if (rawDigits.length > 0) {
      if (isFreshEditRef.current) {
        const lastDigit = rawDigits.slice(-1)
        const newDigits = ('00000' + lastDigit).slice(-6)
        isFreshEditRef.current = false
        digitBufferRef.current = newDigits
        setSummarySeconds(getSecondsFromDigits(newDigits))
      } else {
        const newDigits = rawDigits.slice(-6).padStart(6, '0')
        isFreshEditRef.current = false
        digitBufferRef.current = newDigits
        setSummarySeconds(getSecondsFromDigits(newDigits))
      }
      setInlineErrors(prev => ({ ...prev, time: undefined }))
    } else {
      digitBufferRef.current = '000000'
      isFreshEditRef.current = false
      setSummarySeconds(0)
    }
  }

  // Discard & Delete Confirmation Dialogs
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false)
  const [isDeleteSessionDialogOpen, setIsDeleteSessionDialogOpen] = useState(false)

  // Sessions History
  const [sessions, setSessions] = useState<SessionRecord[]>(getStoredSessions)

  const currentLanguage =
    languages.find(l => l.id === currentLangId) ||
    languages[0] || { id: '', name: 'Nenhum idioma', nativeName: '' }

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
    setEntrySource('timer')
    const initialDigits = getDigitsFromSeconds(finalSecs)
    digitBufferRef.current = initialDigits
    isFreshEditRef.current = true
    setIsEditingTime(false)
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

  const handleReorderLanguages = (newLanguages: LanguageProfile[]) => {
    setLanguages(newLanguages)
    saveStoredLanguages(newLanguages)
  }

  const handleAddLanguage = (newLang: LanguageProfile, origin: 'sheet' | 'manage') => {
    const updated = [...languages, newLang]
    setLanguages(updated)
    saveStoredLanguages(updated)

    if (origin === 'sheet' || languages.length === 0) {
      setCurrentLangIdState(newLang.id)
      setCurrentLanguageId(newLang.id)
      setCurrentScreen('main')
      toast.success(`${newLang.name} adicionado`)
    } else {
      setCurrentScreen('manage-languages')
      toast.success(`${newLang.name} adicionado`)
    }
  }

  const handleDeleteLanguage = (langId: string) => {
    const langToRemove = languages.find(l => l.id === langId)
    const updated = languages.filter(l => l.id !== langId)
    setLanguages(updated)
    saveStoredLanguages(updated)
    deleteSessionsForLanguage(langId)
    setSessions(getStoredSessions())

    if (langToRemove) {
      toast.success(`${langToRemove.name} removido`)
    }

    if (updated.length === 0) {
      setAddLanguageOrigin('sheet')
      setCurrentScreen('add-language')
    } else if (currentLangId === langId) {
      const nextLang = updated[0]
      setCurrentLangIdState(nextLang.id)
      setCurrentLanguageId(nextLang.id)
    }
  }

  // Discard and navigation logic
  const handleRequestDiscard = () => {
    if (summarySeconds <= 10) {
      // Discard directly if under 10 seconds (SPEC rule)
      setIsSummaryOpen(false)
      setIsEditingTime(false)
      setTimerState('idle')
      setElapsedSeconds(0)
      accumulatedRef.current = 0
      startTimeRef.current = null
      toast.info('Sessão descartada')
    } else {
      setIsDiscardDialogOpen(true)
    }
  }

  const handleBackToTimer = () => {
    setIsSummaryOpen(false)
    setIsEditingTime(false)
    if (summarySeconds > 0) {
      accumulatedRef.current = summarySeconds
      setElapsedSeconds(summarySeconds)
      setTimerState('paused')
    } else {
      setTimerState('idle')
    }
  }

  const handleConfirmDiscard = () => {
    setIsDiscardDialogOpen(false)
    setIsSummaryOpen(false)
    setIsEditingTime(false)
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
    setTimerState('idle')
    setElapsedSeconds(0)
    accumulatedRef.current = 0
    startTimeRef.current = null
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

  // Save Session (Pronto / Edição)
  const handleSaveSession = () => {
    const errors: { time?: string; practice?: string; style?: string } = {}

    if (summarySeconds <= 0) {
      errors.time = 'Informe um tempo maior que 00:00:00.'
    }
    if (!selectedPractice) {
      errors.practice = 'Selecione uma prática.'
    } else {
      const practiceObj = PRACTICES.find(p => p.name === selectedPractice)
      if (practiceObj?.hasStyle && !selectedStyle) {
        errors.style = 'Selecione o estilo de imersão.'
      }
    }

    if (Object.keys(errors).length > 0) {
      setInlineErrors(errors)
      return
    }

    const existingSession = editingSessionId ? sessions.find(s => s.id === editingSessionId) : null
    const newRecord: SessionRecord = {
      id: editingSessionId || Date.now().toString(),
      language: existingSession ? existingSession.language : currentLangId,
      startedAt: existingSession
        ? existingSession.startedAt
        : manualEntryDate || (Date.now() - summarySeconds * 1000),
      duration: summarySeconds,
      practice: selectedPractice,
      style: selectedStyle || undefined,
      source: existingSession ? existingSession.source : entrySource,
    }

    saveSessionRecord(newRecord)
    setSessions(getStoredSessions())
    setIsSummaryOpen(false)
    setManualEntryDate(null)
    const isEdit = !!editingSessionId
    setEditingSessionId(null)

    const mins = Math.max(1, Math.round(summarySeconds / 60))
    const styleInfo = selectedStyle ? ` · ${selectedStyle}` : ''
    toast.success(isEdit ? 'Sessão atualizada' : `Sessão salva · ${mins} min · ${selectedPractice}${styleInfo}`)
  }

  const handleDeleteSession = () => {
    if (!editingSessionId) return
    deleteSessionRecord(editingSessionId)
    setSessions(getStoredSessions())
    setIsSummaryOpen(false)
    setIsDeleteSessionDialogOpen(false)
    setEditingSessionId(null)
    toast.info('Sessão excluída')
  }

  // Filter sessions for current language
  const languageSessions = sessions.filter(s => s.language === currentLangId)
  const totalSecondsLanguage = languageSessions.reduce((acc, curr) => acc + curr.duration, 0)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-6 transition-colors">
      {/* Container Central com proporção móvel e bordas suaves */}
      <div className={`w-full max-w-[400px] h-[700px] max-h-[90vh] border border-border/80 bg-card rounded-[32px] p-5 flex flex-col relative shadow-sm overflow-hidden ${fontClass}`}>
        {currentScreen === 'add-language' || languages.length === 0 ? (
          <AddLanguageView
            userLanguages={languages}
            onAddLanguage={lang => handleAddLanguage(lang, addLanguageOrigin)}
            onClose={() => {
              if (addLanguageOrigin === 'manage') {
                setCurrentScreen('manage-languages')
              } else {
                setCurrentScreen('main')
              }
            }}
            isFirstUse={languages.length === 0}
          />
        ) : currentScreen === 'manage-languages' ? (
          <ManageLanguagesView
            languages={languages}
            sessions={sessions}
            onBack={() => setCurrentScreen('main')}
            onOpenAddLanguage={() => {
              setAddLanguageOrigin('manage')
              setCurrentScreen('add-language')
            }}
            onReorderLanguages={handleReorderLanguages}
            onDeleteLanguage={handleDeleteLanguage}
          />
        ) : (
          <>
            {/* Top Bar Geral: Apenas visível quando NÃO estiver no Resumo/Edição */}
            {!isSummaryOpen && (
              <header className="flex items-center justify-between min-h-[48px] mb-4">
                {timerState !== 'idle' ? (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsDiscardDialogOpen(true)}
                      className="size-9 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                      title="Descartar sessão"
                    >
                      <X className="size-5" />
                    </Button>
                    <div />
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLanguageClick}
                      className="gap-2 font-semibold text-sm h-10 px-3 rounded-xl border-border bg-background cursor-pointer"
                    >
                      {currentLanguage.id && (
                        <LanguageFlag code={currentLanguage.id} className="size-4 shrink-0" />
                      )}
                      <span>{currentLanguage.name}</span>
                      <ChevronDown className="size-3.5 text-muted-foreground" />
                    </Button>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Registrar sessão manual"
                        className="size-9 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                        onClick={() => {
                          setSummarySeconds(1800) // 30 min default
                          setEntrySource('manual')
                          digitBufferRef.current = '003000'
                          isFreshEditRef.current = true
                          setIsEditingTime(false)
                          setSelectedPractice('')
                          setSelectedStyle(null)
                          setInlineErrors({})
                          setIsSummaryOpen(true)
                        }}
                      >
                        <Plus className="size-5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleTheme}
                        className="size-9 rounded-lg text-muted-foreground cursor-pointer"
                        title="Alternar Light / Dark"
                      >
                        {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={onOpenStorybook}
                        className="size-9 rounded-lg text-primary cursor-pointer"
                        title="Abrir UI Kit / Storybook"
                      >
                        <Layers className="size-4" />
                      </Button>
                    </div>
                  </>
                )}
              </header>
            )}

            {/* CONTEÚDO PRINCIPAL (CONDICIONAL POR ABA) */}
            {isSummaryOpen ? (
              /* TELA DE RESUMO DA SESSÃO / EDIÇÃO */
              <div className="flex-1 flex flex-col justify-between pt-1 pb-2">
                <div>
                  {/* Top Bar do Resumo / Registro Manual / Edição */}
                  <div className="flex items-center justify-between min-h-[48px] mb-4">
                    {editingSessionId || entrySource === 'manual' ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setIsSummaryOpen(false)
                          setEditingSessionId(null)
                        }}
                        className="size-9 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                        title="Fechar sem salvar"
                      >
                        <X className="size-5" />
                      </Button>
                    ) : (
                      <>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={handleBackToTimer}
                          className="size-9 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Voltar ao timer"
                        >
                          <ChevronLeft className="size-5" />
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={handleRequestDiscard}
                          className="size-9 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                          title="Descartar sessão"
                        >
                          <X className="size-5" />
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Campo de Tempo Editável */}
                  <div className="mb-6 text-center">
                    <input
                      ref={timeInputRef}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="off"
                      value={formatTime(summarySeconds)}
                      onFocus={handleStartEditTime}
                      onBlur={() => setIsEditingTime(false)}
                      onKeyDown={handleTimeKeyDown}
                      onChange={handleTimeChange}
                      className={`w-full text-5xl sm:text-6xl font-extrabold py-5 px-6 rounded-2xl border text-center transition-all tabular-nums font-outfit bg-card shadow-xs focus:outline-none cursor-text caret-primary ${
                        inlineErrors.time
                          ? 'border-destructive ring-4 ring-destructive/10'
                          : isEditingTime
                          ? 'border-primary ring-4 ring-primary/10'
                          : 'border-border hover:border-border/80'
                      }`}
                      aria-label="Tempo da sessão"
                      title="Clique ou toque para editar o tempo"
                    />
                    {inlineErrors.time && (
                      <p className="text-xs text-destructive mt-2 flex items-center justify-center gap-1 font-medium">
                        <AlertCircle className="size-3.5" /> {inlineErrors.time}
                      </p>
                    )}
                  </div>

                  {/* Seletor de Atividade (UX Copy: "O que você fez?") */}
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingTime(false)
                        handleOpenPracticeDrawer()
                      }}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all bg-card cursor-pointer shadow-xs active:scale-[0.99] ${
                        inlineErrors.practice || inlineErrors.style ? 'border-destructive ring-1 ring-destructive/20' : 'border-border hover:border-border/80'
                      }`}
                    >
                      <div>
                        <div className={`text-base ${selectedPractice ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'}`}>
                          {selectedPractice || 'O que você fez?'}
                        </div>
                        {selectedStyle && (
                          <div className="text-xs text-muted-foreground mt-0.5 font-medium">{selectedStyle}</div>
                        )}
                      </div>
                      <ChevronDown className="size-4 text-muted-foreground" />
                    </button>
                    {(inlineErrors.practice || inlineErrors.style) && (
                      <p className="text-xs text-destructive mt-1.5 flex items-center gap-1 font-medium">
                        <AlertCircle className="size-3.5" /> {inlineErrors.practice || inlineErrors.style}
                      </p>
                    )}
                  </div>
                </div>

                {/* Barra de Ação: Salvar Sessão / Excluir Sessão (Regra UI: Botões pareados com mesma altura h-14) */}
                <div className="pt-4 mt-auto">
                  {editingSessionId ? (
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="lg"
                        onClick={() => setIsDeleteSessionDialogOpen(true)}
                        className="h-14 text-sm font-semibold rounded-2xl text-destructive bg-destructive/10 hover:bg-destructive/20 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        Excluir sessão
                      </Button>
                      <Button
                        type="button"
                        size="lg"
                        onClick={() => {
                          setIsEditingTime(false)
                          handleSaveSession()
                        }}
                        className="h-14 text-sm font-bold rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm active:scale-[0.98] transition-all duration-150 cursor-pointer"
                      >
                        Salvar alterações
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      size="lg"
                      onClick={() => {
                        setIsEditingTime(false)
                        handleSaveSession()
                      }}
                      className="w-full h-14 text-base font-bold rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm active:scale-[0.98] transition-all duration-150 cursor-pointer"
                    >
                      Salvar sessão
                    </Button>
                  )}
                </div>
              </div>
        ) : activeTab === 'timer' ? (
          /* ABA 1: TIMER (CONFORME SPEC.MD SEÇÃO 3) */
          <div className="flex-1 flex flex-col justify-between py-2">
            <div />

            {/* Grande Display hh:mm:ss: Outfit ExtraBold (800), espaçamento confortável e contraste acessível */}
            <div className="text-center my-auto py-8">
              <div
                className={`text-[66px] sm:text-[74px] leading-none tracking-[0.015em] tabular-nums font-extrabold select-none transition-colors duration-200 ${
                  timerState === 'idle'
                    ? 'text-zinc-500 dark:text-zinc-400'
                    : 'text-foreground'
                }`}
              >
                {formatTime(elapsedSeconds)}
              </div>
            </div>

            {/* Controles do Timer: 56px de altura, cantos suaves e resposta tátil sólida */}
            <div className="space-y-3 pb-2">
              {timerState === 'idle' && (
                <Button
                  size="lg"
                  onClick={handleStart}
                  className="w-full h-14 text-base sm:text-lg font-bold rounded-2xl gap-2.5 shadow-sm active:scale-[0.98] transition-all duration-150 cursor-pointer"
                >
                  <Play className="size-5 fill-current" /> Iniciar
                </Button>
              )}

              {timerState === 'running' && (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={handlePause}
                    className="h-14 text-base font-semibold rounded-2xl gap-2 bg-zinc-100 dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 border border-zinc-300/90 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-750 shadow-xs active:scale-[0.98] transition-all duration-150 cursor-pointer"
                  >
                    <Pause className="size-4.5" /> Pausar
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    onClick={handleStop}
                    className="h-14 text-base font-bold rounded-2xl gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm active:scale-[0.98] transition-all duration-150 cursor-pointer"
                  >
                    <Check className="size-5 stroke-[2.5px]" /> Concluir
                  </Button>
                </div>
              )}

              {timerState === 'paused' && (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={handleResume}
                    className="h-14 text-base font-semibold rounded-2xl gap-2 bg-zinc-100 dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 border border-zinc-300/90 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-750 shadow-xs active:scale-[0.98] transition-all duration-150 cursor-pointer"
                  >
                    <Play className="size-4.5 fill-current" /> Retomar
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    onClick={handleStop}
                    className="h-14 text-base font-bold rounded-2xl gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm active:scale-[0.98] transition-all duration-150 cursor-pointer"
                  >
                    <Check className="size-5 stroke-[2.5px]" /> Concluir
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'metas' ? (
          /* ABA 2: METAS E NÍVEIS (PROTÓTIPO & SPEC SEÇÃO 12) */
          (() => {
            const LEVELS: [number, number][] = [
              [0, 1], [1, 3], [3, 5], [5, 10], [10, 20], [20, 35], [35, 50], [50, 75], [75, 100], [100, 150],
              [150, 200], [200, 300], [300, 400], [400, 500], [500, 600], [600, 750], [750, 1000]
            ]
            const formatHuman = (secs: number) => {
              if (secs <= 0) return '0 min'
              const h = Math.floor(secs / 3600)
              const m = Math.round((secs % 3600) / 60)
              if (h === 0) return `${m}m`
              if (m === 0) return `${h}h`
              return `${h}h ${m}m`
            }

            const totalSecs = totalSecondsLanguage
            const totalHours = totalSecs / 3600
            let levelIdx = LEVELS.findIndex(l => totalHours < l[1])
            const isMax = levelIdx < 0
            if (isMax) levelIdx = LEVELS.length - 1

            const [lo, hi] = LEVELS[levelIdx]
            const spanHours = hi - lo
            const lvlDoneSecs = Math.max(0, totalSecs - lo * 3600)
            const remSecs = Math.max(0, hi * 3600 - totalSecs)
            const pct = Math.min(100, Math.max(0, (lvlDoneSecs / (spanHours * 3600)) * 100))

            return (
              <ScrollAreaFade className="flex-1 min-h-0 py-2 pr-3 space-y-4">
                {/* Header */}
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block mb-1">
                    Tempo total
                  </span>
                  <div className="text-5xl font-extrabold tracking-tight text-foreground tabular-nums">
                    {formatHuman(totalSecs)}
                  </div>
                </div>

                {/* Hero Card Level Progress */}
                <Card className="border border-border/70 bg-muted/20 rounded-2xl shadow-none overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-foreground">
                        {isMax ? 'Nível Máximo' : `Nível ${levelIdx + 1}`}
                      </span>
                      <span className="tabular-nums text-sm text-muted-foreground font-medium">
                        {formatHuman(lvlDoneSecs)} / {spanHours}h
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-1 space-y-3">
                    <div className="w-full bg-muted/80 rounded-full h-2.5 overflow-hidden border border-border/40">
                      <div
                        className="bg-foreground h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {isMax ? 'Você concluiu todos os níveis!' : `Faltam ${formatHuman(remSecs)} para o Nível ${levelIdx + 2}`}
                    </p>
                  </CardContent>
                </Card>

                {/* Lista de Níveis */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-semibold text-muted-foreground px-1 block">
                    Níveis
                  </span>
                  <div className="bg-muted/20 rounded-2xl border border-border/70 divide-y divide-border/40 overflow-hidden">
                    {LEVELS.map(([loH, hiH], idx) => {
                      const isDone = isMax || idx < levelIdx
                      const isCur = !isMax && idx === levelIdx
                      const isLocked = !isMax && idx > levelIdx

                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between px-4 py-3 min-h-[48px] ${
                            isCur ? 'bg-muted/40 font-semibold text-foreground' : isLocked ? 'opacity-40 text-muted-foreground' : 'text-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-5 flex items-center justify-center shrink-0">
                              {isDone ? (
                                <Check className="size-4 text-muted-foreground stroke-[2.5px]" />
                              ) : isCur ? (
                                <span className="size-3.5 rounded-full border-2 border-foreground" />
                              ) : (
                                <Lock className="size-4 text-muted-foreground/60 stroke-[1.75px]" />
                              )}
                            </div>
                            <span className="text-sm font-medium">Nível {idx + 1}</span>
                          </div>
                          <span className="text-sm tabular-nums text-muted-foreground font-normal">
                            {loH}h – {hiH}h
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </ScrollAreaFade>
            )
          })()
        ) : activeTab === 'estatisticas' ? (
          /* ABA 3: ESTATÍSTICAS (SUPERFÍCIE ÚNICA) */
          <StatsView sessions={sessions} currentLanguage={currentLanguage} />
        ) : (
          /* ABA 4: HISTÓRICO (PROTÓTIPO & SPEC SEÇÃO 11) */
          (() => {
            const isoDate = (d: Date) => d.toISOString().slice(0, 10)
            const todayIso = isoDate(new Date())
            const yesterdayIso = isoDate(new Date(Date.now() - 86400000))

            const monthLabel = (ts: number) => {
              const str = new Date(ts).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
              return str.charAt(0).toUpperCase() + str.slice(1)
            }

            const dateLabel = (ts: number) => {
              const key = isoDate(new Date(ts))
              if (key === todayIso) return 'Hoje'
              if (key === yesterdayIso) return 'Ontem'
              const d = new Date(ts)
              const w = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
              const m = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
              return `${w}, ${d.getDate()} ${m}`
            }

            const formatHuman = (secs: number) => {
              if (secs <= 0) return '0 min'
              const h = Math.floor(secs / 3600)
              const m = Math.round((secs % 3600) / 60)
              if (h === 0) return `${m} min`
              if (m === 0) return `${h}h`
              return `${h}h ${m}m`
            }

            const formatDateDisplay = (isoStr: string) => {
              const parts = isoStr.split('-').map(Number)
              if (parts.length !== 3) return isoStr
              const [y, m, d] = parts
              const dt = new Date(y, m - 1, d)
              return dt.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
            }

            // Group sessions by day ISO
            const allGroups: { dayKey: string; timestamp: number; items: typeof languageSessions }[] = []
            languageSessions.forEach(s => {
              const k = isoDate(new Date(s.startedAt))
              let g = allGroups[allGroups.length - 1]
              if (!g || g.dayKey !== k) {
                g = { dayKey: k, timestamp: s.startedAt, items: [] }
                allGroups.push(g)
              }
              g.items.push(s)
            })

            const displayGroups = selectedDateFilter
              ? allGroups.filter(g => g.dayKey === selectedDateFilter)
              : allGroups

            let currentMonth = ''

            return (
              <ScrollAreaFade className="flex-1 min-h-0 py-2 pr-3 space-y-3">
                {/* Header & Calendário Jump */}
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xl font-bold tracking-tight text-foreground">Histórico</span>
                  <div className="relative flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          dateInputRef.current?.showPicker()
                        } catch {
                          dateInputRef.current?.focus()
                          dateInputRef.current?.click()
                        }
                      }}
                      className="size-11 min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/60 transition-all cursor-pointer active:scale-95 border border-border/40"
                      title="Navegar no calendário"
                    >
                      <CalendarIcon className="size-5 text-foreground/80" />
                      <input
                        ref={dateInputRef}
                        type="date"
                        max={todayIso}
                        onChange={e => {
                          const targetDay = e.target.value
                          if (targetDay) {
                            setSelectedDateFilter(targetDay)
                          }
                        }}
                        className="sr-only"
                      />
                    </button>
                  </div>
                </div>

                {/* Filtro Ativo por Data */}
                {selectedDateFilter && (
                  <div className="flex items-center justify-between p-2.5 bg-muted/30 rounded-xl border border-border/60 text-xs">
                    <span className="font-semibold text-foreground truncate mr-2">
                      Filtrado: {formatDateDisplay(selectedDateFilter)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedDateFilter(null)}
                      className="text-muted-foreground hover:text-foreground font-semibold px-2.5 py-1 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer shrink-0"
                    >
                      Ver todo o histórico
                    </button>
                  </div>
                )}

                {languageSessions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm font-medium">
                    Nenhuma sessão registrada em {currentLanguage.name} ainda.
                  </div>
                ) : selectedDateFilter && displayGroups.length === 0 ? (
                  /* Estado de Vazio Dedicado para Data Selecionada */
                  <div className="flex flex-col items-center justify-center text-center p-6 bg-muted/20 border border-border/70 rounded-2xl space-y-4 my-4">
                    <div className="size-12 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground">
                      <CalendarIcon className="size-6 text-foreground/70" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-foreground">
                        Nenhum registro em {formatDateDisplay(selectedDateFilter)}
                      </h4>
                      <p className="text-xs text-muted-foreground font-medium">
                        Você não possui sessões de estudo salvas nesta data.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full pt-1">
                      <Button
                        type="button"
                        onClick={() => {
                          const targetTs = new Date(selectedDateFilter + 'T12:00:00').getTime()
                          setManualEntryDate(targetTs)
                          setEditingSessionId(null)
                          setSummarySeconds(1800)
                          setSelectedPractice('Escuta e leitura')
                          setSelectedStyle('Imersão')
                          setEntrySource('manual')
                          digitBufferRef.current = getDigitsFromSeconds(1800)
                          isFreshEditRef.current = true
                          setIsSummaryOpen(true)
                        }}
                        className="w-full h-11 min-h-[44px] font-semibold text-xs gap-1.5 cursor-pointer"
                      >
                        <Plus className="size-4" /> Registrar nesta data
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSelectedDateFilter(null)}
                        className="w-full h-11 min-h-[44px] font-semibold text-xs cursor-pointer"
                      >
                        Ver todo o histórico
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {displayGroups.map(g => {
                      const m = monthLabel(g.timestamp)
                      const showMonthHeader = m !== currentMonth
                      if (showMonthHeader) currentMonth = m
                      const dayTotal = g.items.reduce((acc, x) => acc + x.duration, 0)
                      const isHighlighted = highlightedDayKey === g.dayKey

                      return (
                        <div key={g.dayKey} id={`day-group-${g.dayKey}`} className="space-y-2 scroll-mt-6">
                          {showMonthHeader && (
                            <div className="sticky top-0 bg-card/95 backdrop-blur-xs py-2 px-1 text-xs font-bold uppercase tracking-widest text-muted-foreground z-10">
                              {m}
                            </div>
                          )}

                          <div className="flex items-center justify-between px-1 pt-1">
                            <span className="text-sm font-bold text-foreground/90">
                              {dateLabel(g.timestamp)}
                            </span>
                          </div>

                          <div
                            className={`bg-muted/20 rounded-2xl border transition-all duration-300 divide-y divide-border/40 overflow-hidden ${
                              isHighlighted
                                ? 'border-primary/60 bg-primary/5 ring-2 ring-primary/30 shadow-md'
                                : 'border-border/70 hover:border-border/90'
                            }`}
                          >
                            {g.items.map(s => (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => {
                                  setEditingSessionId(s.id)
                                  setSummarySeconds(s.duration)
                                  setSelectedPractice(s.practice)
                                  setSelectedStyle(s.style || null)
                                  setEntrySource('manual')
                                  digitBufferRef.current = getDigitsFromSeconds(s.duration)
                                  isFreshEditRef.current = true
                                  setIsSummaryOpen(true)
                                }}
                                className="w-full flex items-center justify-between px-4 py-3 min-h-[52px] text-left hover:bg-muted/40 transition-colors cursor-pointer"
                              >
                                <div className="space-y-0.5">
                                  <div className="text-base font-semibold text-foreground">{s.practice}</div>
                                  {s.style && (
                                    <div className="text-xs text-muted-foreground font-medium">{s.style}</div>
                                  )}
                                </div>
                                <span className="tabular-nums text-sm font-semibold text-foreground/90">
                                  {formatHuman(s.duration)}
                                </span>
                              </button>
                            ))}

                            <div className="flex items-center justify-between px-4 py-3 bg-muted/40 text-sm font-semibold text-foreground border-t border-border/50">
                              <span className="text-muted-foreground font-medium">Total do dia</span>
                              <span className="tabular-nums text-base font-bold text-foreground">
                                {formatHuman(dayTotal)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </ScrollAreaFade>
            )
          })()
        )}

        {/* BOTTOM NAV (Some durante sessão ativa, conforme SPEC SEÇÃO 2) */}
        {timerState === 'idle' && !isSummaryOpen && (
          <nav className="flex items-center justify-around px-1 pt-3 border-t border-border mt-auto">
            <button
              onClick={() => setActiveTab('timer')}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer ${
                activeTab === 'timer'
                  ? 'bg-primary/10 dark:bg-primary/15 text-primary font-bold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 font-medium'
              }`}
            >
              <TimerIcon className={`size-5 ${activeTab === 'timer' ? 'stroke-[2.25px]' : 'stroke-[1.75px]'}`} />
              <span className="text-xs tracking-tight">Timer</span>
            </button>

            <button
              onClick={() => setActiveTab('metas')}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer ${
                activeTab === 'metas'
                  ? 'bg-primary/10 dark:bg-primary/15 text-primary font-bold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 font-medium'
              }`}
            >
              <Award className={`size-5 ${activeTab === 'metas' ? 'stroke-[2.25px]' : 'stroke-[1.75px]'}`} />
              <span className="text-xs tracking-tight">Metas</span>
            </button>

            <button
              onClick={() => setActiveTab('estatisticas')}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer ${
                activeTab === 'estatisticas'
                  ? 'bg-primary/10 dark:bg-primary/15 text-primary font-bold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 font-medium'
              }`}
            >
              <BarChart3 className={`size-5 ${activeTab === 'estatisticas' ? 'stroke-[2.25px]' : 'stroke-[1.75px]'}`} />
              <span className="text-xs tracking-tight">Estatísticas</span>
            </button>

            <button
              onClick={() => setActiveTab('historico')}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer ${
                activeTab === 'historico'
                  ? 'bg-primary/10 dark:bg-primary/15 text-primary font-bold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 font-medium'
              }`}
            >
              <History className={`size-5 ${activeTab === 'historico' ? 'stroke-[2.25px]' : 'stroke-[1.75px]'}`} />
              <span className="text-xs tracking-tight">Histórico</span>
            </button>
          </nav>
        )}
        </>
      )}
      </div>

      {/* DRAWER: TROCA DE IDIOMA (REFINADO - SEM LINHAS EXCESSIVAS, SEM CARDS, SCROLL COM FADE, CHECKMARK) */}
      <Drawer open={isLangDrawerOpen} onOpenChange={setIsLangDrawerOpen}>
        <DrawerContent className="max-w-[400px] mx-auto p-0 border-t border-border/80">
          <DrawerHeader className="px-5 pt-4 pb-2 text-left">
            <DrawerTitle className="text-base font-semibold tracking-tight">Idioma</DrawerTitle>
            <DrawerDescription className="sr-only">
              Selecione o idioma da sua sessão
            </DrawerDescription>
          </DrawerHeader>

          {/* LISTA LIMPA COM MÁSCARA DINÂMICA (SEM FADE NO TOPO SE NÃO HOUVER ROLAGEM) */}
          <ScrollAreaFade className="px-3.5 py-1.5 space-y-1.5 max-h-[46vh]">
            {languages.map(lang => {
              const isSelected = lang.id === currentLangId
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.id)}
                  className={`w-full flex items-center justify-between py-3 px-3.5 rounded-xl transition-all duration-150 text-left cursor-pointer ${
                    isSelected
                      ? 'bg-muted/70 font-medium text-foreground'
                      : 'hover:bg-muted/40 active:bg-muted/60 text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <LanguageFlag code={lang.id} className="size-5.5 shrink-0" />
                    <span className="text-sm font-semibold text-foreground truncate">{lang.name}</span>
                    <span className="text-xs text-muted-foreground font-normal shrink-0">
                      ({lang.nativeName})
                    </span>
                  </div>

                  {isSelected && (
                    <Check className="size-4 text-primary shrink-0 stroke-[2.25px]" />
                  )}
                </button>
              )
            })}
          </ScrollAreaFade>

          {/* AÇÕES FIXAS DO RODAPÉ (RULE: MESMA ALTURA MÍNIMA DE 44PX E TEXTO LEGÍVEL) */}
          <div className="p-4 pt-3 space-y-2 border-t border-border/40">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsLangDrawerOpen(false)
                setAddLanguageOrigin('sheet')
                setCurrentScreen('add-language')
              }}
              className="w-full h-11 min-h-[44px] rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-pointer shadow-none"
            >
              <Plus className="size-4" />
              <span>Adicionar idioma</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsLangDrawerOpen(false)
                setCurrentScreen('manage-languages')
              }}
              className="w-full h-11 min-h-[44px] rounded-xl font-medium text-sm text-foreground/80 hover:text-foreground hover:bg-muted/50 cursor-pointer flex items-center justify-center transition-colors"
            >
              Gerenciar idiomas
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* DRAWER: SELEÇÃO DE PRÁTICA E ESTILO (SPEC SEÇÃO 6 - REFINO IMPECCABLE) */}
      <Drawer open={isPracticeDrawerOpen} onOpenChange={setIsPracticeDrawerOpen}>
        <DrawerContent className="max-w-[400px] mx-auto p-0 border-t border-border/80">
          <DrawerHeader className="px-5 pt-4 pb-2 text-left">
            {practiceDrawerStep === 1 ? (
              <div>
                <DrawerTitle className="text-base font-semibold tracking-tight text-left">Escolha uma atividade</DrawerTitle>
                <DrawerDescription className="sr-only">
                  Selecione a atividade realizada nesta sessão
                </DrawerDescription>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 w-full">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-xl hover:bg-muted/60 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer -ml-1 transition-colors"
                  onClick={() => setPracticeDrawerStep(1)}
                  aria-label="Voltar para seleção de prática"
                >
                  <ChevronLeft className="size-5" />
                </Button>
                <div className="min-w-0 flex-1 text-left">
                  <DrawerTitle className="text-base font-semibold tracking-tight text-foreground text-left truncate">
                    Como foi a prática?
                  </DrawerTitle>
                  <DrawerDescription className="text-sm text-muted-foreground text-left truncate mt-0.5">
                    {tempPractice}
                  </DrawerDescription>
                </div>
              </div>
            )}
          </DrawerHeader>

          <ScrollAreaFade className={`px-3 py-1 ${practiceDrawerStep === 1 ? 'space-y-1 max-h-[70vh] sm:max-h-[460px]' : 'space-y-2.5 max-h-[50vh]'}`}>
            {practiceDrawerStep === 1 ? (
              // TELA 1: LISTA DAS 8 PRÁTICAS (BORDERLESS, SEM SCROLL FORÇADO, AFFORDANCE DE SUB-ETAPA)
              PRACTICES.map(p => {
                const isSelected = selectedPractice === p.name
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleChoosePractice(p.name)}
                    className={`w-full flex items-center justify-between py-2.5 px-3 min-h-[44px] rounded-xl transition-all duration-150 text-left cursor-pointer ${
                      isSelected
                        ? 'bg-muted/70 font-medium text-foreground'
                        : 'hover:bg-muted/40 active:bg-muted/60 text-foreground'
                    }`}
                  >
                    <span className="text-sm font-medium text-foreground">{p.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected && <Check className="size-4 text-primary stroke-[2.25px]" />}
                      {p.hasStyle && (
                        <ChevronRight className="size-4 text-muted-foreground/35" />
                      )}
                    </div>
                  </button>
                )
              })
            ) : (
              // TELA 2: ESTILO (CARDS COM TIPOGRAFIA CONFORTÁVEL EM TEXT-SM E CONTRASTE NÍTIDO)
              <div className="space-y-2.5 py-1">
                {[
                  {
                    id: 'Imersão' as const,
                    title: 'Imersão',
                    desc: 'Poucas ou nenhuma pausa para consultar palavras.'
                  },
                  {
                    id: 'Imersão interativa' as const,
                    title: 'Imersão interativa',
                    desc: 'Pausas frequentes para consultar palavras.'
                  }
                ].map(opt => {
                  const isSelected = selectedPractice === tempPractice && selectedStyle === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleChooseStyle(opt.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-primary/50 bg-primary/5 dark:bg-primary/10 shadow-xs'
                          : 'border-border/60 bg-muted/20 hover:bg-muted/50 hover:border-border active:scale-[0.99]'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="text-base font-semibold text-foreground tracking-tight">
                          {opt.title}
                        </div>
                        <p className="text-sm text-muted-foreground leading-normal">
                          {opt.desc}
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="size-4 text-primary stroke-[2.25px] shrink-0 mt-1" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </ScrollAreaFade>

          {/* RODAPÉ ALINHADO À REGRA DE 44PX E PISO DE 12PX */}
          <div className="p-4 pt-3 border-t border-border/40">
            <DrawerClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="w-full h-11 min-h-[44px] rounded-xl font-medium text-sm text-foreground/80 hover:text-foreground hover:bg-muted/50 cursor-pointer flex items-center justify-center transition-colors"
              >
                Cancelar
              </Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>

      {/* DIÁLOGO: CONFIRMAÇÃO DE DESCARTAR SESSÃO */}
      <Dialog open={isDiscardDialogOpen} onOpenChange={setIsDiscardDialogOpen}>
        <DialogContent className="max-w-[380px] p-6">
          <DialogHeader className="gap-2 text-left">
            <DialogTitle className="text-lg font-semibold tracking-tight">Descartar esta sessão?</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              O tempo medido ({formatTime(timerState !== 'idle' ? elapsedSeconds : summarySeconds)}) não será salvo no histórico. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="grid grid-cols-2 gap-2.5 pt-2">
            <Button
              variant="outline"
              className="h-11 min-h-[44px] rounded-xl text-sm font-medium flex-1 cursor-pointer"
              onClick={() => setIsDiscardDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="h-11 min-h-[44px] rounded-xl text-sm font-medium flex-1 cursor-pointer"
              onClick={handleConfirmDiscard}
            >
              Descartar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
