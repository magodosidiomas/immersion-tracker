import { useState, useRef } from 'react'
import {
  ChevronLeft,
  Sun,
  Moon,
  Download,
  Upload,
  Layers,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ScrollAreaFade } from '@/components/ui/scroll-area-fade'
import { GoogleDriveSync } from '@/components/GoogleDriveSync'
import { PrivacyPolicyDialog } from '@/components/PrivacyPolicyDialog'
import { exportBackupJSON, importBackupJSON } from '@/lib/storage'
import { APP_VERSION } from '@/version'
import { toast } from 'sonner'

export interface SettingsViewProps {
  onBack: () => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onOpenStorybook: () => void
  onDataChanged: () => void
}

export function SettingsView({
  onBack,
  theme,
  onToggleTheme,
  onOpenStorybook,
  onDataChanged,
}: SettingsViewProps) {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (!content) return
      const res = importBackupJSON(content)
      if (res.success) {
        onDataChanged()
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    }
    reader.readAsText(file)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-transparent animate-in fade-in-50 duration-200">
      {/* Top Header Nativo */}
      <header className="flex items-center justify-between min-h-[48px] px-1 mb-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="size-9 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
          aria-label="Voltar para tela principal"
        >
          <ChevronLeft className="size-5" />
        </Button>

        <h1 className="text-base font-semibold tracking-tight text-foreground font-heading">
          Configurações
        </h1>

        <div className="size-9" />
      </header>

      {/* Conteúdo com Scroll Suave */}
      <ScrollAreaFade className="flex-1 px-1 py-1 space-y-5">
        
        {/* GRUPO 1: APARÊNCIA */}
        <div className="space-y-2">
          <span className="text-sm font-semibold text-muted-foreground block px-1">
            Aparência
          </span>
          <div
            role="button"
            tabIndex={0}
            onClick={onToggleTheme}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onToggleTheme()
              }
            }}
            className="w-full h-12 min-h-[44px] flex items-center justify-between px-3.5 rounded-2xl font-medium text-sm cursor-pointer border border-border/80 bg-card/60 hover:bg-muted/40 transition-colors select-none"
          >
            <div className="flex items-center gap-2.5">
              {theme === 'light' ? (
                <Sun className="size-4.5 text-amber-500" />
              ) : (
                <Moon className="size-4.5 text-indigo-400" />
              )}
              <span>Modo {theme === 'light' ? 'claro' : 'escuro'}</span>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <Switch
                variant="purple"
                checked={theme === 'dark'}
                onCheckedChange={onToggleTheme}
                aria-label="Alternar modo escuro"
              />
            </div>
          </div>
        </div>

        {/* GRUPO 2: NUVEM & GOOGLE DRIVE */}
        <GoogleDriveSync onSyncComplete={onDataChanged} />

        {/* GRUPO 3: BACKUP LOCAL (GRUPO NATIVO ESTILO LINEAR) */}
        <div className="space-y-2">
          <span className="text-sm font-semibold text-muted-foreground block px-1">
            Backup local
          </span>
          <div className="rounded-2xl border border-border/80 bg-card/60 divide-y divide-border/50 overflow-hidden">
            <button
              type="button"
              onClick={() => {
                exportBackupJSON()
                toast.success('Backup exportado')
              }}
              className="w-full h-12 min-h-[44px] flex items-center justify-between px-3.5 text-left text-sm font-medium hover:bg-muted/40 transition-colors cursor-pointer text-foreground"
            >
              <div className="flex items-center gap-3">
                <Download className="size-4 text-muted-foreground" />
                <span>Exportar backup (JSON)</span>
              </div>
              <ChevronRight className="size-4 text-muted-foreground/40" />
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-12 min-h-[44px] flex items-center justify-between px-3.5 text-left text-sm font-medium hover:bg-muted/40 transition-colors cursor-pointer text-foreground"
            >
              <div className="flex items-center gap-3">
                <Upload className="size-4 text-muted-foreground" />
                <span>Importar backup (JSON)</span>
              </div>
              <ChevronRight className="size-4 text-muted-foreground/40" />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportFile}
            className="sr-only"
          />
        </div>

        {/* GRUPO 4: SOBRE & DESENVOLVIMENTO (LISTA NATIVA LIMPA) */}
        <div className="space-y-2">
          <span className="text-sm font-semibold text-muted-foreground block px-1">
            Sobre o app
          </span>
          <div className="rounded-2xl border border-border/80 bg-card/60 divide-y divide-border/50 overflow-hidden">
            <button
              type="button"
              onClick={() => setIsPrivacyOpen(true)}
              className="w-full h-12 min-h-[44px] flex items-center justify-between px-3.5 text-left text-sm font-medium hover:bg-muted/40 transition-colors cursor-pointer text-foreground"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-4 text-emerald-400" />
                <span>Privacidade & Dados (LGPD)</span>
              </div>
              <ChevronRight className="size-4 text-muted-foreground/40" />
            </button>

            <button
              type="button"
              onClick={onOpenStorybook}
              className="w-full h-12 min-h-[44px] flex items-center justify-between px-3.5 text-left text-sm font-medium hover:bg-muted/40 transition-colors cursor-pointer text-foreground"
            >
              <div className="flex items-center gap-3">
                <Layers className="size-4 text-muted-foreground" />
                <span>Storybook / Design System</span>
              </div>
              <ChevronRight className="size-4 text-muted-foreground/40" />
            </button>
          </div>
        </div>

        {/* Rodapé com Versão */}
        <div className="text-center pt-2 pb-6">
          <span className="text-[11px] text-muted-foreground/50 font-mono tracking-wider">
            Imerso v{APP_VERSION}
          </span>
        </div>

      </ScrollAreaFade>

      {/* Modal de Privacidade */}
      <PrivacyPolicyDialog
        open={isPrivacyOpen}
        onOpenChange={setIsPrivacyOpen}
      />
    </div>
  )
}
