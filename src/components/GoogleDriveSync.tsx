import { useState } from 'react'
import {
  Cloud,
  CloudCheck,
  RefreshCw,
  LogOut,
  AlertCircle,
  HelpCircle,
  FolderLock,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  isGoogleDriveConfigured,
  getStoredAccessToken,
  getStoredDriveUser,
  getLastSyncTime,
  connectGoogleDrive,
  disconnectGoogleDrive,
  syncWithGoogleDrive,
} from '@/lib/google-drive'
import type { GoogleDriveUser } from '@/types/google-drive'
import { toast } from 'sonner'

interface GoogleDriveSyncProps {
  onSyncComplete?: () => void
}

export function GoogleDriveSync({ onSyncComplete }: GoogleDriveSyncProps) {
  const isConfigured = isGoogleDriveConfigured()
  const [user, setUser] = useState<GoogleDriveUser | null>(() => getStoredDriveUser())
  const [isConnected, setIsConnected] = useState<boolean>(() => Boolean(getStoredAccessToken() && getStoredDriveUser()))
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const [lastSync, setLastSync] = useState<number | null>(() => getLastSyncTime())
  const [showConfigHelp, setShowConfigHelp] = useState<boolean>(false)

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
    if (!isConfigured) {
      setShowConfigHelp(true)
      return
    }

    try {
      setIsSyncing(true)
      const res = await connectGoogleDrive()
      setUser(res.user)
      setIsConnected(true)
      toast.success('Conectado ao Google Drive')

      // Immediate first sync
      try {
        const syncRes = await syncWithGoogleDrive()
        setLastSync(getLastSyncTime())
        toast.success(`Sincronizado com a nuvem (${syncRes.sessionsCount} sessões)`)
        onSyncComplete?.()
      } catch (syncErr: any) {
        console.error('Falha na sincronização inicial:', syncErr)
        toast.error('Conectado, mas falhou ao sincronizar dados')
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
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <Cloud className="size-3.5 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Nuvem & Google Drive
          </span>
        </div>
        {isConnected && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Conectado
          </span>
        )}
      </div>

      <div className="p-3.5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xs space-y-3">
        {!isConnected ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-xl bg-muted/60 border border-border/60 flex items-center justify-center shrink-0 text-foreground">
                <FolderLock className="size-5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <h4 className="text-sm font-semibold text-foreground tracking-tight">
                  Sincronização Automática
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Salva suas sessões no espaço isolado do seu Google Drive (<code className="text-[11px] bg-muted/70 px-1 py-0.5 rounded">appDataFolder</code>). Seus dados ficam 100% sob seu controle.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={handleConnect}
              disabled={isSyncing}
              className="w-full h-11 min-h-[44px] rounded-xl font-medium text-sm flex items-center justify-center gap-2.5 cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 shadow-none transition-all"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="size-4 animate-spin text-primary" />
                  <span>Conectando...</span>
                </>
              ) : (
                <>
                  <svg className="size-4.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Conectar com Google Drive</span>
                </>
              )}
            </Button>

            {!isConfigured && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertCircle className="size-4 text-amber-400 shrink-0" />
                  <span>Configuração do Client ID necessária</span>
                </div>
                <p className="text-[11px] text-amber-200/80 leading-normal">
                  Para ativar o login real, adicione o ID do Google no seu arquivo de ambiente ou Cloudflare Pages.
                </p>
                <button
                  type="button"
                  onClick={() => setShowConfigHelp(!showConfigHelp)}
                  className="text-[11px] font-semibold underline underline-offset-2 hover:text-amber-100 flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="size-3.5" />
                  {showConfigHelp ? 'Ocultar instruções' : 'Ver como configurar em 2 passos'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Info do usuário conectado */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="size-8 rounded-full border border-border/80 object-cover shrink-0"
                  />
                ) : (
                  <div className="size-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                    {user?.name?.charAt(0) || 'G'}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{user?.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
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

            {/* Status do último backup */}
            <div className="flex items-center justify-between text-xs py-1 px-1 text-muted-foreground border-t border-border/40 pt-2">
              <div className="flex items-center gap-1.5">
                <CloudCheck className="size-3.5 text-muted-foreground" />
                <span>Último sync:</span>
              </div>
              <span className="font-medium text-foreground">{formatLastSync(lastSync)}</span>
            </div>

            {/* Botão de sincronizar agora */}
            <Button
              type="button"
              variant="outline"
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="w-full h-10 min-h-[44px] rounded-xl font-medium text-xs flex items-center justify-center gap-2 cursor-pointer border-border/80 hover:bg-muted/50 transition-colors"
            >
              <RefreshCw className={`size-3.5 ${isSyncing ? 'animate-spin text-primary' : 'text-muted-foreground'}`} />
              <span>{isSyncing ? 'Sincronizando agora...' : 'Sincronizar agora'}</span>
            </Button>
          </div>
        )}

        {/* Modal/Accordion de Instruções de Configuração */}
        {showConfigHelp && (
          <div className="p-3 rounded-xl bg-muted/40 border border-border/80 text-xs text-foreground/90 space-y-2 mt-2">
            <h5 className="font-semibold text-foreground text-xs flex items-center gap-1.5">
              <span>Como configurar o Google Drive (Custo $0)</span>
            </h5>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-muted-foreground leading-relaxed">
              <li>Acesse o <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="underline text-primary inline-flex items-center gap-0.5">Google Cloud Console <ExternalLink className="size-2.5" /></a>.</li>
              <li>Crie um <strong>OAuth 2.0 Client ID</strong> do tipo <em>Aplicação Web</em>.</li>
              <li>Em <strong>Origens JavaScript autorizadas</strong>, adicione:
                <div className="mt-1 font-mono text-[10px] bg-background/80 p-1 rounded border border-border/60">
                  http://localhost:5173<br />
                  https://imerso.pages.dev
                </div>
              </li>
              <li>Adicione a variável no seu arquivo <code className="text-foreground">.env</code>:
                <div className="mt-1 font-mono text-[10px] bg-background/80 p-1 rounded border border-border/60 select-all">
                  VITE_GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
                </div>
              </li>
              <li>Na Cloudflare Pages, basta adicionar <code className="text-foreground">VITE_GOOGLE_CLIENT_ID</code> nas <em>Environment variables</em> de produção.</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}
