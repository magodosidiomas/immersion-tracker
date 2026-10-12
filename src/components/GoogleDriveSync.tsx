import { useState } from 'react'
import {
  Cloud,
  CloudCheck,
  RefreshCw,
  LogOut,
  Info,
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
} from '@/lib/google-drive'
import type { GoogleDriveUser } from '@/types/google-drive'
import { toast } from 'sonner'

// Ícone oficial Google Drive em SVG vetorial limpo
export function GoogleDriveLogo({ className = 'size-4.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 87.3 78" fill="none">
      <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H6.6c0 1.55.4 3.1 1.2 4.45l-1.2 9.4Z" fill="#0066DA"/>
      <path d="M43.65 25 29.9 1.2C28.55 2 27.4 3.1 26.6 4.5L1.2 48.5c-.8 1.35-1.2 2.9-1.2 4.45h27.5L43.65 25Z" fill="#00AC47"/>
      <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.3c.8-1.35 1.2-2.9 1.2-4.45H59.8l5.85 11.2 7.9 12.6Z" fill="#EA4335"/>
      <path d="M43.65 25h27.5c0-1.55-.4-3.1-1.2-4.45L56.2 3.3C54.85 1.2 52.4 0 49.75 0h-12.2L43.65 25Z" fill="#00832D"/>
      <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.45 1.2h50.9c1.55 0 3.1-.4 4.45-1.2L59.8 53Z" fill="#2684FC"/>
      <path d="M73.4 20.55 59.65 44.35 43.65 25 56.2 3.3c-1.35-.8-2.9-1.2-4.45-1.2h12.2c2.65 0 5.1 1.2 6.45 3.3l3 5.2 6.2 10.75c.8 1.4 1.2 2.95 1.2 4.5-.4-2.15-1.9-4.1-4.4-5.3Z" fill="#FFBA00"/>
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

  const formatLastSync = (ts: number | null) => {
    if (!ts) return 'Nunca sincronizado'
    const diff = Math.floor((Date.now() - ts) / 1000)
    if (diff < 60) return 'Agora mesmo'
    if (diff < 3600) return `Há ${Math.floor(diff / 60)} min`
    if (diff < 86400) return `Há ${Math.floor(diff / 3600)} h`
    const d = new Date(ts)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  const handleConnect = async () => {
    try {
      setIsSyncing(true)
      const res = await connectGoogleDrive()
      setUser(res.user)
      setIsConnected(true)
      toast.success('Conectado ao Google Drive')

      try {
        const syncRes = await syncWithGoogleDrive()
        setLastSync(getLastSyncTime())
        toast.success(`Sincronizado com a nuvem (${syncRes.sessionsCount} sessões)`)
        onSyncComplete?.()
      } catch (syncErr: any) {
        console.error('Falha na sincronização inicial:', syncErr)
      }
    } catch (err: any) {
      console.error('Falha ao conectar:', err)
      toast.error(err.message || 'Falha ao conectar com o Google')
    } finally {
      setIsSyncing(false)
    }
  }

  const handleSyncNow = async () => {
    try {
      setIsSyncing(true)
      const res = await syncWithGoogleDrive()
      setLastSync(getLastSyncTime())
      toast.success(`Backup sincronizado (${res.sessionsCount} sessões)`)
      onSyncComplete?.()
    } catch (err: any) {
      console.error('Erro na sincronização:', err)
      if (err.message?.includes('expirada') || err.message?.includes('401')) {
        setIsConnected(false)
        setUser(null)
      }
      toast.error(err.message || 'Erro ao sincronizar com o Google Drive')
    } finally {
      setIsSyncing(false)
    }
  }

  const handleDisconnect = () => {
    disconnectGoogleDrive()
    setIsConnected(false)
    setUser(null)
    toast.success('Desconectado do Google Drive')
  }

  return (
    <div className="space-y-2.5">
      {/* Header do Card com Ícone de Info (i) */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <Cloud className="size-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Google Drive
          </span>
          <button
            type="button"
            onClick={() => setIsInfoOpen(true)}
            className="text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer p-0.5 rounded-sm"
            title="Como funciona a sincronização e privacidade"
            aria-label="Informações sobre o Google Drive"
          >
            <Info className="size-3.5" />
          </button>
        </div>

        {isConnected && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Conectado
          </span>
        )}
      </div>

      {/* Card Principal */}
      <div className="p-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xs space-y-3.5">
        {!isConnected ? (
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-foreground tracking-tight">
                Sincronização na nuvem
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                Sincronize entre celular e computador.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleConnect}
              disabled={isSyncing}
              className="w-full h-11 min-h-[44px] rounded-xl font-medium text-sm flex items-center justify-center gap-2.5 cursor-pointer bg-background hover:bg-muted/50 text-foreground border-border/90 shadow-none transition-all active:scale-[0.99]"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="size-4 animate-spin text-muted-foreground" />
                  <span>Conectando...</span>
                </>
              ) : (
                <>
                  <GoogleDriveLogo className="size-4.5 shrink-0" />
                  <span>Conectar com Google Drive</span>
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Usuário Conectado */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="size-8 rounded-full border border-border/80 object-cover shrink-0"
                  />
                ) : (
                  <div className="size-8 rounded-full bg-muted text-foreground flex items-center justify-center font-bold text-xs shrink-0">
                    {user?.name?.charAt(0) || 'G'}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{user?.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate font-mono">{user?.email}</p>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleDisconnect}
                title="Desconectar"
                className="size-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer shrink-0"
              >
                <LogOut className="size-4" />
              </Button>
            </div>

            {/* Linha de Status de Sincronização */}
            <div className="flex items-center justify-between text-xs py-1 px-0.5 text-muted-foreground border-t border-border/40 pt-2">
              <div className="flex items-center gap-1.5">
                <CloudCheck className="size-3.5 text-emerald-400" />
                <span>Último sync:</span>
              </div>
              <span className="font-medium text-foreground">{formatLastSync(lastSync)}</span>
            </div>

            {/* Ação Sincronizar Agora */}
            <Button
              type="button"
              variant="outline"
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="w-full h-10 min-h-[44px] rounded-xl font-medium text-xs flex items-center justify-center gap-2 cursor-pointer border-border/80 hover:bg-muted/40 transition-colors"
            >
              <RefreshCw className={`size-3.5 ${isSyncing ? 'animate-spin text-foreground' : 'text-muted-foreground'}`} />
              <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar agora'}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Modal explicativa do (i) */}
      <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <DialogContent className="max-w-[360px] p-5">
          <DialogHeader className="text-left gap-1.5">
            <div className="flex items-center gap-2">
              <GoogleDriveLogo className="size-5 shrink-0" />
              <DialogTitle className="text-base font-semibold tracking-tight">
                Google Drive & Privacidade
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
              A autenticação é feita diretamente com o Google. O Imerso utiliza exclusivamente uma pasta oculta reservada (<code className="text-[10px] bg-muted/80 px-1 py-0.5 rounded text-foreground font-mono">appDataFolder</code>) para guardar suas sessões e perfis.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>Seus arquivos pessoais (documentos, fotos) <strong>nunca</strong> são acessados.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>Seus dados ficam 100% no seu próprio Drive, sem servidores intermediários.</span>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              className="w-full h-10 rounded-xl text-xs font-semibold cursor-pointer"
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
