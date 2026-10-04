import { useState } from 'react'
import { ChevronLeft, GripVertical, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { ScrollAreaFade } from '@/components/ui/scroll-area-fade'
import { LanguageFlag } from '@/components/LanguageFlag'
import { toast } from 'sonner'
import type { LanguageProfile, SessionRecord } from '@/types/imerso'

export interface ManageLanguagesViewProps {
  languages: LanguageProfile[]
  sessions: SessionRecord[]
  onBack: () => void
  onOpenAddLanguage: () => void
  onReorderLanguages: (languages: LanguageProfile[]) => void
  onDeleteLanguage: (languageId: string) => void
}

export function ManageLanguagesView({
  languages,
  sessions,
  onBack,
  onOpenAddLanguage,
  onReorderLanguages,
  onDeleteLanguage,
}: ManageLanguagesViewProps) {
  const [deleteTarget, setDeleteTarget] = useState<LanguageProfile | null>(null)
  const [confirmInput, setConfirmInput] = useState('')
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // Estatísticas de um idioma
  const getLanguageStats = (langId: string) => {
    const langSessions = sessions.filter(s => s.language === langId)
    const count = langSessions.length
    const totalSecs = langSessions.reduce((acc, curr) => acc + curr.duration, 0)
    const totalHours = Math.floor(totalSecs / 3600)
    const totalMins = Math.floor((totalSecs % 3600) / 60)

    let formattedTime = 'Sem sessões'
    if (totalSecs > 0) {
      if (totalHours > 0) {
        formattedTime = totalMins > 0 ? `${totalHours} h ${totalMins} min` : `${totalHours} h`
      } else {
        formattedTime = `${totalMins || 1} min`
      }
    }

    return { count, totalSecs, formattedTime }
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'

    if (draggedIndex === null || draggedIndex === index) return

    const updated = [...languages]
    const item = updated.splice(draggedIndex, 1)[0]
    updated.splice(index, 0, item)
    setDraggedIndex(index)
    onReorderLanguages(updated)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    if (confirmInput.trim().toLowerCase() !== 'remover') {
      toast.error('Digite remover para confirmar')
      return
    }

    const removedName = deleteTarget.name
    onDeleteLanguage(deleteTarget.id)
    setDeleteTarget(null)
    setConfirmInput('')
    toast.success(`${removedName} removido`)
  }

  const targetStats = deleteTarget ? getLanguageStats(deleteTarget.id) : null

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-card animate-in fade-in-50 duration-200">
      {/* Top Header */}
      <header className="flex items-center justify-between min-h-[48px] px-1 mb-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="size-9 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
          aria-label="Voltar"
        >
          <ChevronLeft className="size-5" />
        </Button>

        <h1 className="text-base font-semibold tracking-tight text-foreground font-heading">
          Gerenciar idiomas
        </h1>

        <div className="size-9" />
      </header>

      {/* Lista de Idiomas com Reordenação e Ações */}
      <ScrollAreaFade className="flex-1 min-h-0 px-1 py-1 space-y-1">
        {languages.map((lang, index) => {
          const stats = getLanguageStats(lang.id)
          const isDragging = draggedIndex === index

          return (
            <div
              key={lang.id}
              draggable
              onDragStart={e => handleDragStart(e, index)}
              onDragOver={e => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`w-full flex items-center justify-between py-2.5 px-2.5 rounded-xl transition-all duration-150 select-none ${
                isDragging
                  ? 'opacity-40 bg-muted/60 scale-[0.98]'
                  : 'hover:bg-muted/40 active:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* Ícone de Grip para arrastar */}
                <div
                  className="p-1 -ml-1 text-muted-foreground/50 hover:text-foreground cursor-grab active:cursor-grabbing shrink-0"
                  title="Arrastar para reordenar"
                >
                  <GripVertical className="size-4.5" />
                </div>

                <LanguageFlag code={lang.id} className="size-6 shrink-0" />

                <div className="flex flex-col min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {lang.name}
                    </span>
                    <span className="text-xs text-muted-foreground font-normal shrink-0">
                      ({lang.nativeName})
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {stats.formattedTime}
                  </span>
                </div>
              </div>

              {/* Botão de Excluir / Remover */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setConfirmInput('')
                  setDeleteTarget(lang)
                }}
                className="size-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 cursor-pointer transition-colors"
                title={`Remover ${lang.name}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          )
        })}

        {/* Botão Adicionar Idioma ao final da lista */}
        <div className="pt-2 px-1">
          <Button
            type="button"
            variant="ghost"
            onClick={onOpenAddLanguage}
            className="w-full justify-start gap-2 h-10 px-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-xl cursor-pointer transition-colors"
          >
            <Plus className="size-4" />
            <span>Adicionar idioma</span>
          </Button>
        </div>
      </ScrollAreaFade>

      {/* DIÁLOGO CENTRAL DE CONFIRMAÇÃO DE REMOÇÃO (SPEC SEÇÃO 8) */}
      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={open => {
          if (!open) {
            setDeleteTarget(null)
            setConfirmInput('')
          }
        }}
      >
        <DialogContent className="max-w-[380px] p-6">
          <div className="flex flex-col gap-4">
            <DialogHeader className="text-left gap-1.5">
              <DialogTitle className="text-lg font-semibold flex items-center gap-2 tracking-tight">
                {deleteTarget && <LanguageFlag code={deleteTarget.id} className="size-5 shrink-0" />}
                <span>Remover {deleteTarget?.name}?</span>
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                {targetStats && targetStats.totalSecs > 0 ? (
                  <>
                    Isso apaga <strong className="text-foreground">{targetStats.formattedTime}</strong> e{' '}
                    <strong className="text-foreground">
                      {targetStats.count}{' '}
                      {targetStats.count === 1 ? 'sessão' : 'sessões'}
                    </strong>
                    . Não dá para desfazer.
                  </>
                ) : (
                  <>Isso removerá este idioma da sua lista de perfis. Não há sessões gravadas.</>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 pt-1">
              <label htmlFor="confirm-remove-input" className="text-sm text-foreground block font-medium">
                Digite <span className="font-semibold text-destructive underline underline-offset-4 decoration-2">remover</span> para confirmar
              </label>
              <Input
                id="confirm-remove-input"
                value={confirmInput}
                onChange={e => setConfirmInput(e.target.value)}
                placeholder="remover"
                autoComplete="off"
                className="h-11 text-sm rounded-xl px-3.5 focus-visible:ring-destructive/30"
                autoFocus
              />
            </div>

            <DialogFooter className="grid grid-cols-2 gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDeleteTarget(null)
                  setConfirmInput('')
                }}
                className="h-11 min-h-[44px] rounded-xl text-sm font-medium flex-1 cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={confirmInput.trim().toLowerCase() !== 'remover'}
                onClick={handleConfirmDelete}
                className="h-11 min-h-[44px] rounded-xl text-sm font-semibold flex-1 cursor-pointer disabled:opacity-40"
              >
                Remover
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
