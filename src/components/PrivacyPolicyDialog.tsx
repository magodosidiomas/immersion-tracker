import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ShieldCheck, HardDrive, Lock, Globe, Check } from 'lucide-react'

interface PrivacyPolicyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PrivacyPolicyDialog({ open, onOpenChange }: PrivacyPolicyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-5 sm:p-6 max-h-[85vh] overflow-y-auto">
        <DialogHeader className="gap-2 text-left pb-1 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="size-4.5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold tracking-tight">
                Privacidade & Dados
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Como o Imerso protege a sua privacidade (Privacy by Design)
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3 text-sm leading-relaxed text-muted-foreground">
          {/* Item 1: Zero Servidores */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/50">
            <HardDrive className="size-4.5 text-foreground shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-foreground text-sm">
                Zero Servidores Próprios (100% Client-Side)
              </h4>
              <p>
                O Imerso não possui banco de dados em servidor central. Todas as suas sessões e perfis de idioma são guardados exclusivamente no navegador do seu dispositivo (<code className="text-xs bg-muted/60 px-1.5 py-0.5 rounded">localStorage</code>).
              </p>
            </div>
          </div>

          {/* Item 2: Google Drive e appDataFolder */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/50">
            <Lock className="size-4.5 text-foreground shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-foreground text-sm">
                Sincronização Segura com o Google Drive
              </h4>
              <p>
                A sincronização opcional utiliza o escopo estrito <code className="text-xs bg-muted/60 px-1.5 py-0.5 rounded">appDataFolder</code>. O aplicativo <strong>não tem acesso</strong> às suas fotos, documentos ou arquivos pessoais do seu Drive. Ele acessa apenas uma pasta oculta exclusiva do Imerso criada na sua própria conta.
              </p>
            </div>
          </div>

          {/* Item 3: Seus Direitos (LGPD / GDPR) */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/50">
            <Globe className="size-4.5 text-foreground shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-foreground text-sm">
                Controle Total e Exclusão (LGPD / GDPR)
              </h4>
              <p>
                Você é o único dono dos seus dados. A qualquer momento você pode exportar seu histórico em JSON, desconectar sua conta Google Drive ou limpar seus dados locais.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-foreground/80 space-y-1">
            <span className="font-semibold flex items-center gap-1.5 text-primary text-sm">
              <Check className="size-3.5 stroke-[2.5px]" />
              Sem rastreadores ou anúncios
            </span>
            <p className="text-muted-foreground leading-normal text-xs">
              O Imerso não vende, não compartilha e não monitora sua atividade com terceiros.
            </p>
          </div>
        </div>

        <DialogFooter className="pt-2 border-t border-border/50">
          <Button
            type="button"
            className="w-full h-11 min-h-[44px] rounded-xl text-sm font-semibold cursor-pointer bg-[#6d28d9] hover:bg-[#5b21b6] text-white"
            onClick={() => onOpenChange(false)}
          >
            Entendido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
