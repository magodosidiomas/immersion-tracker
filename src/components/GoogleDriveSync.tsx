import { useState, useRef, useEffect } from 'react'
import {
  RefreshCw,
  Info,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  getStoredAccessToken,
  getStoredDriveUser,
  getLastSyncTime,
  connectGoogleDrive,
  disconnectGoogleDrive,
  syncWithGoogleDrive,
  formatGoogleError,
} from '@/lib/google-drive'
import type { GoogleDriveUser } from '@/types/google-drive'
import { toast } from 'sonner'

// Ícone oficial Google Drive (Wikimedia Commons Oficial)
export function GoogleDriveLogo({ className = 'size-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 87.3 78" fill="none">
      <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066DA" />
      <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00AC47" />
      <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#EA4335" />
      <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832D" />
      <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684FC" />
      <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#FFBA00" />
    </svg>
  )
}

interface GoogleDriveSyncProps {
  onSyncComplete?: () => void
}

export function GoogleDriveSync({ onSyncComplete }: GoogleDriveSyncProps) {
  const [user, setUser] = useState<GoogleDriveUser | null>(() => getStoredDriveUser())
  const [isConnected, setIsConnected] = useState<boolean>(() => Boolean(getStoredAccessToken() && getStoredDriveUser()))
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const [lastSync, setLastSync] = useState<number | null>(() => getLastSyncTime())
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const currentToken = getStoredAccessToken()
    const currentUser = getStoredDriveUser()
    if (currentToken && currentUser) {
      setUser(currentUser)
      setIsConnected(true)
      setLastSync(getLastSyncTime())
    }
  }, [])

  const formatLastSync = (ts: number | null) => {
    if (!ts) return 'Nunca sincronizado'
    const diff = Math.floor((Date.now() - ts) / 1000)
    if (diff < 60) return 'Agora mesmo'
    if (diff < 3600) return `Há ${Math.floor(diff / 60)} min`
    if (diff < 86400) return `Há ${Math.floor(diff / 3600)} h`
    const d = new Date(ts)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  const handleCancelSync = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsSyncing(false)
    setSyncError('Sincronização cancelada por você.')
    toast.info('Sincronização cancelada')
  }

  const handleConnect = async () => {
    setSyncError(null)
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      setIsSyncing(true)
      const res = await connectGoogleDrive(controller.signal)
      setUser(res.user)
      setIsConnected(true)
      toast.success('Conectado ao Google Drive')

      try {
        const syncRes = await syncWithGoogleDrive(controller.signal)
        setLastSync(getLastSyncTime())
        toast.success(`Sincronizado com a nuvem (${syncRes.sessionsCount} sessões)`)
        onSyncComplete?.()
      } catch (syncErr: any) {
        if (controller.signal.aborted) return
        console.error('Falha na sincronização inicial:', syncErr)
        const friendly = formatGoogleError(syncErr)
        setSyncError(friendly)
      }
    } catch (err: any) {
      if (controller.signal.aborted) return
      console.error('Falha ao conectar:', err)
      const friendly = formatGoogleError(err)
      setSyncError(friendly)
      toast.error(friendly)
    } finally {
      setIsSyncing(false)
      abortControllerRef.current = null
    }
  }

  const handleSyncNow = async () => {
    setSyncError(null)
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      setIsSyncing(true)
      const res = await syncWithGoogleDrive(controller.signal)
      setLastSync(getLastSyncTime())
      toast.success(`Backup sincronizado (${res.sessionsCount} sessões)`)
      onSyncComplete?.()
    } catch (err: any) {
      if (controller.signal.aborted) return
      console.error('Erro na sincronização:', err)
      const friendly = formatGoogleError(err)
      setSyncError(friendly)
      if (err.message?.includes('expirada') || err.message?.includes('401')) {
        setIsConnected(false)
        setUser(null)
      }
      toast.error(friendly)
    } finally {
      setIsSyncing(false)
      abortControllerRef.current = null
    }
  }

  const handleDisconnect = () => {
    disconnectGoogleDrive()
    setIsConnected(false)
    setUser(null)
    setSyncError(null)
    toast.success('Desconectado do Google Drive')
  }

  return (
    <div className="space-y-2">
      {/* Header da Seção: Sincronização */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-muted-foreground block">
            Sincronização
          </span>
          <button
            type="button"
            onClick={() => setIsInfoOpen(true)}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-0.5 rounded-sm"
            title="Como funciona a sincronização e privacidade"
            aria-label="Informações sobre o Google Drive"
          >
            <Info className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Card Principal: Erro / Desconectado / Conectado */}
      {syncError ? (
        <div className="rounded-2xl border border-border/80 bg-card/60 p-4 space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 text-red-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-sm font-semibold text-foreground">Não foi possível sincronizar</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {syncError}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setSyncError(null)}
              className="flex-1 h-11 min-h-[44px] px-4 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/60 cursor-pointer transition-colors"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={isConnected ? handleSyncNow : handleConnect}
              className="flex-1 h-11 min-h-[44px] px-4 rounded-xl text-sm font-semibold text-foreground hover:bg-muted/40 border-border/80 cursor-pointer transition-colors"
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      ) : !isConnected ? (
        <div className="rounded-2xl border border-border/80 bg-card/60 p-4 space-y-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Google Drive</p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Sincronize suas sessões entre celular e computador com segurança.
            </p>
          </div>

          {isSyncing ? (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled
                className="flex-1 h-11 min-h-[44px] rounded-xl font-medium text-sm flex items-center justify-center gap-2 bg-background text-foreground border-border/90"
              >
                <RefreshCw className="size-4 animate-spin text-muted-foreground" />
                <span>Conectando...</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancelSync}
                className="h-11 min-h-[44px] px-4 rounded-xl font-medium text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer border border-border/60"
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={handleConnect}
              className="w-full h-11 min-h-[44px] rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 cursor-pointer bg-background hover:bg-muted/50 text-foreground border-border/90 shadow-none transition-all active:scale-[0.99]"
            >
              <GoogleDriveLogo className="size-4.5 shrink-0" />
              <span>Conectar com Google Drive</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-border/80 bg-card/60 p-4 space-y-4">
          {/* Topo: Avatar + Nome + Filled Check + E-mail em 14px + Timestamp */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="size-10 rounded-full border border-border/80 object-cover shrink-0"
                />
              ) : (
                <div className="size-10 rounded-full bg-muted text-foreground flex items-center justify-center font-bold text-sm shrink-0">
                  {user?.name?.charAt(0) || 'G'}
                </div>
              )}
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
                  {/* Filled Check Circle oficial verde esmeralda */}
                  <svg className="size-4 text-emerald-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs text-muted-foreground tabular-nums block">{formatLastSync(lastSync)}</span>
            </div>
          </div>

          {/* Botões Táticos com respiro superior confortável (44px min-h) */}
          {isSyncing ? (
            <div className="flex items-center gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                disabled
                className="flex-1 h-11 min-h-[44px] rounded-xl font-medium text-sm flex items-center justify-center gap-2 border-border/80"
              >
                <RefreshCw className="size-4 animate-spin text-foreground" />
                <span>Sincronizando...</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancelSync}
                className="h-11 min-h-[44px] px-4 rounded-xl font-medium text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer border border-border/60"
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={handleSyncNow}
                className="flex-1 h-11 min-h-[44px] rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer border-border/80 hover:bg-muted/40 transition-colors"
              >
                <RefreshCw className="size-4 text-muted-foreground" />
                <span>Sincronizar agora</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleDisconnect}
                className="h-11 min-h-[44px] px-4 rounded-xl font-medium text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer border border-border/60 transition-colors"
              >
                Desconectar
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Modal explicativa do (i) */}
      <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <DialogContent className="sm:max-w-[360px] p-5">
          <DialogHeader className="text-left gap-1.5">
            <div className="flex items-center gap-2">
              <GoogleDriveLogo className="size-5 shrink-0" />
              <DialogTitle className="text-base font-semibold tracking-tight">
                Google Drive & Privacidade
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed pt-1">
              Seus dados ficam salvos em uma pasta exclusiva no seu próprio Google Drive. O Imerso não tem acesso aos seus arquivos pessoais.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              className="w-full h-11 min-h-[44px] rounded-xl text-sm font-semibold cursor-pointer"
              onClick={() => setIsInfoOpen(false)}
            >
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
