import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ScrollAreaFade } from '@/components/ui/scroll-area-fade'
import { toast } from 'sonner'
import {
  Sun,
  Moon,
  Play,
  Pause,
  Square,
  Check,
  AlertCircle,
  Clock,
  Globe,
  Layers,
  ChevronLeft,
  Plus
} from 'lucide-react'

interface StorybookViewProps {
  onBackToApp: () => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export function StorybookView({ onBackToApp, theme, onToggleTheme }: StorybookViewProps) {
  const [activeTab, setActiveTab] = useState('botoes')
  const [sampleInput, setSampleInput] = useState('Coreano')

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors p-4 md:p-8 max-w-5xl mx-auto">
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Layers className="size-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Imerso UI Kit & Storybook</h1>
            <Badge variant="outline" className="ml-2 font-mono text-xs">shadcn + tailwind v4</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Catálogo interativo de componentes padrão do sistema em Light e Dark mode.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={onToggleTheme} className="gap-2">
            {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
            <span>{theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</span>
          </Button>

          <Button size="sm" onClick={onBackToApp} className="gap-2">
            <ChevronLeft className="size-4" />
            <span>Voltar ao App Imerso</span>
          </Button>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full mb-8 h-auto p-1 bg-muted/60">
          <TabsTrigger value="botoes" className="py-2">Botões</TabsTrigger>
          <TabsTrigger value="inputs" className="py-2">Formulários</TabsTrigger>
          <TabsTrigger value="cards" className="py-2">Cards & Badges</TabsTrigger>
          <TabsTrigger value="overlays" className="py-2">Modais & Sheets</TabsTrigger>
          <TabsTrigger value="design" className="py-2">Cores & Tipografia</TabsTrigger>
        </TabsList>

        {/* 1. SEÇÃO BOTÕES */}
        <TabsContent value="botoes" className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-1">Variantes de Botões</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Diferentes níveis de hierarquia para ações principais, secundárias e destrutivas.
            </p>
            <div className="flex flex-wrap items-center gap-3 p-6 border rounded-xl bg-card">
              <Button variant="default">Primary (Default)</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-1">Tamanhos & Ícones</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Escala de tamanhos para diferentes densidades e usos com ícones.
            </p>
            <div className="flex flex-wrap items-center gap-3 p-6 border rounded-xl bg-card">
              <Button size="lg" className="gap-2">
                <Play className="size-4" /> Botão Grande (lg)
              </Button>
              <Button size="default" className="gap-2">
                <Clock className="size-4" /> Padrão (default)
              </Button>
              <Button size="sm" className="gap-1.5">
                <Check className="size-3.5" /> Pequeno (sm)
              </Button>
              <Button size="xs">Extra Pequeno (xs)</Button>
              <Button size="icon" variant="outline" title="Ícone">
                <Globe className="size-4" />
              </Button>
              <Button size="icon" variant="destructive" title="Excluir">
                <Square className="size-4" />
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-1">Exploração de Roxo Refinado (Anti-AI-Slop)</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Cores sólidas, sem gradientes de plástico e sem halos coloridos falsos. Clique e passe o mouse para testar:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border border-zinc-800 rounded-2xl bg-zinc-900/50 mb-8">
              {/* Opção 1: Linear Sólido */}
              <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between space-y-4">
                <div>
                  <div className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/10 text-violet-300 border border-violet-500/20 mb-2">OPÇÃO 1 • RECOMENDADA (LINEAR)</div>
                  <h4 className="font-bold text-sm text-white">Roxo Sólido Corporativo</h4>
                  <p className="text-xs text-zinc-400 mt-1">Cor sólida profunda (#6d28d9 / violet-700), texto branco puro, contraste WCAG AA+, sem gradiente e com sombra neutra física preta.</p>
                </div>
                <button
                  type="button"
                  className="w-full h-14 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 active:scale-[0.98]
                    bg-[#6d28d9] hover:bg-[#5b21b6] border border-violet-500/30 shadow-sm"
                >
                  <Play className="size-5 fill-current" /> Iniciar sessão
                </button>
              </div>

              {/* Opção 2: Dark Violet Arquitetural */}
              <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between space-y-4">
                <div>
                  <div className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 mb-2">OPÇÃO 2 • ARQUITETURAL</div>
                  <h4 className="font-bold text-sm text-white">Violeta Escuro Fosco</h4>
                  <p className="text-xs text-zinc-400 mt-1">Fundo sóbrio (#4c1d95 / violet-900) com borda física iluminada (#7c3aed / 40%), ultra integrado ao dark mode sem competir com o timer.</p>
                </div>
                <button
                  type="button"
                  className="w-full h-14 rounded-2xl font-bold text-base text-violet-100 flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 active:scale-[0.98]
                    bg-[#3b0764] hover:bg-[#4c1d95] border border-violet-500/40 shadow-sm"
                >
                  <Play className="size-5 fill-current text-violet-200" /> Iniciar sessão
                </button>
              </div>

              {/* Opção 3: Monocromático com Acento Violeta */}
              <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between space-y-4">
                <div>
                  <div className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 mb-2">OPÇÃO 3 • MINIMAL CHIC</div>
                  <h4 className="font-bold text-sm text-white">Chumbo com Acento Roxo</h4>
                  <p className="text-xs text-zinc-400 mt-1">Fundo zinc escuro clássico de alta densidade, com tipografia violeta e borda viva, mantendo o minimalismo original.</p>
                </div>
                <button
                  type="button"
                  className="w-full h-14 rounded-2xl font-bold text-base text-violet-300 flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 active:scale-[0.98]
                    bg-zinc-900 hover:bg-zinc-850 hover:text-white border border-violet-500/50 shadow-sm"
                >
                  <Play className="size-5 fill-current" /> Iniciar sessão
                </button>
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-1">Botões de Ação do Timer (Imerso)</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Controles reais utilizados no cronômetro do aplicativo.
            </p>
            <div className="space-y-4 max-w-md p-6 border rounded-xl bg-card">
              <div>
                <span className="text-xs text-muted-foreground font-mono block mb-2">Estado Ocioso (Largura Total)</span>
                <Button size="lg" className="w-full h-14 text-base font-medium gap-2">
                  <Play className="size-5 fill-current" /> Iniciar
                </Button>
              </div>

              <div>
                <span className="text-xs text-muted-foreground font-mono block mb-2">Estado Rodando (Lado a lado)</span>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="lg" className="h-12 gap-2">
                    <Pause className="size-4" /> Pausar
                  </Button>
                  <Button variant="secondary" size="lg" className="h-12 gap-2 text-destructive hover:text-destructive">
                    <Square className="size-4" /> Encerrar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 2. SEÇÃO INPUTS & FORMULÁRIOS */}
        <TabsContent value="inputs" className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-1">Inputs de Texto</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Campos para formulários, buscas e filtros.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl p-6 border rounded-xl bg-card">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Idioma</label>
                <Input
                  value={sampleInput}
                  onChange={(e) => setSampleInput(e.target.value)}
                  placeholder="Ex: Japonês, Alemão..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Campo com Ícone / Busca</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Pesquisar idiomas..." />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Campo Desabilitado</label>
                <Input disabled value="Não editável" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-destructive">Campo com Erro</label>
                <Input className="border-destructive focus-visible:ring-destructive/30" value="00:00:00" />
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" /> Informe um tempo maior que 00:00:00
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-1">Display Numérico de Tempo (Estilo Samsung Clock)</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Usado no Resumo da Sessão e Registro Manual do Imerso para digitação da direita para a esquerda.
            </p>
            <div className="p-8 border rounded-xl bg-card max-w-md text-center space-y-2">
              <div className="font-mono text-5xl font-light tracking-tight text-foreground py-4 px-6 border rounded-2xl bg-muted/20">
                00:47:00
              </div>
              <p className="text-xs text-muted-foreground">Formato tabular hh:mm:ss otimizado para digitação rápida</p>
            </div>
          </div>
        </TabsContent>

        {/* 3. SEÇÃO CARDS & BADGES */}
        <TabsContent value="cards" className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-1">Badges de Notificação & Status</h2>
            <p className="text-sm text-muted-foreground mb-4">Pílulas compactas para categorias e status.</p>
            <div className="flex flex-wrap items-center gap-3 p-6 border rounded-xl bg-card">
              <Badge variant="default">Ativo</Badge>
              <Badge variant="secondary">Imersão</Badge>
              <Badge variant="outline">Imersão Interativa</Badge>
              <Badge variant="destructive">Excluído</Badge>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                Meta Atingida
              </Badge>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-1">Cards de Conteúdo</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Superfícies de agrupamento estruturadas.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card Padrão */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumo Semanal</CardTitle>
                  <CardDescription>Horas dedicadas nos últimos 7 dias</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-3xl font-bold tracking-tight">12h 45m</div>
                  <p className="text-sm text-muted-foreground">+2h 10m em relação à semana passada</p>
                </CardContent>
                <CardFooter className="border-t pt-4 text-xs text-muted-foreground flex justify-between">
                  <span>Atualizado hoje</span>
                  <span className="font-medium text-foreground">Coreano</span>
                </CardFooter>
              </Card>

              {/* Card de Nível (especificação do Imerso) */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-semibold">Nível 5</Badge>
                    <span className="font-mono text-sm font-medium">4h 30m / 10h</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden border">
                    <div className="bg-primary h-full rounded-full transition-all" style={{ width: '45%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">Faltam 5h 30m para o Nível 6</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 4. SEÇÃO OVERLAYS, MODAIS E SHEETS */}
        <TabsContent value="overlays" className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-1">Toasts / Notificações (Sonner)</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Toasts rápidos que aparecem no topo com mensagens de confirmação do SPEC.
            </p>
            <div className="flex flex-wrap gap-3 p-6 border rounded-xl bg-card">
              <Button
                variant="outline"
                onClick={() => toast.success('Sessão salva · 47 min · Escuta e leitura · Imersão')}
              >
                Toast de Sucesso (Sessão Salva)
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.warning('Encerre a sessão para trocar de idioma')}
              >
                Toast de Aviso (Sessão Ativa)
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.error('Sessão descartada')}
              >
                Toast Destrutivo (Descarte)
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-1">Diálogo de Confirmação (Modal)</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Para ações irreversíveis (descartar sessão ou remover idioma).
            </p>
            <div className="p-6 border rounded-xl bg-card">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="h-11 min-h-[44px] rounded-xl text-sm font-medium px-5">
                    Abrir Diálogo de Confirmação
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[380px] p-6">
                  <DialogHeader className="gap-2 text-left">
                    <DialogTitle className="text-lg font-semibold tracking-tight">Descartar esta sessão?</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                      Os 47 minutos medidos não serão registrados no seu histórico. Esta ação não pode ser desfeita.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="grid grid-cols-2 gap-2.5 pt-2">
                    <Button variant="outline" className="h-11 min-h-[44px] rounded-xl text-sm font-medium flex-1">
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      className="h-11 min-h-[44px] rounded-xl text-sm font-medium flex-1"
                      onClick={() => toast.error('Sessão descartada')}
                    >
                      Descartar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-1">Bottom Sheet / Drawer (Vaul)</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Gesto móvel nativo para escolha de Práticas e Seleção de Idioma.
            </p>
            <div className="p-6 border rounded-xl bg-card">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="secondary" className="gap-2">
                    <Globe className="size-4" /> Abrir Bottom Sheet (Exemplo de Idioma)
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="max-w-md mx-auto p-0 border-t border-border/80">
                  <DrawerHeader className="px-5 pt-4 pb-2 text-left">
                    <DrawerTitle className="text-base font-semibold tracking-tight">Trocar de idioma</DrawerTitle>
                    <DrawerDescription className="text-xs text-muted-foreground">Selecione o perfil de estudo ativo</DrawerDescription>
                  </DrawerHeader>
                  <ScrollAreaFade className="px-3 py-1 space-y-0.5 max-h-[46vh]">
                    {[
                      { name: 'Coreano', native: '한국어' },
                      { name: 'Japonês', native: '日本語' },
                      { name: 'Inglês', native: 'English' },
                      { name: 'Espanhol', native: 'Español' },
                      { name: 'Francês', native: 'Français' },
                      { name: 'Alemão', native: 'Deutsch' },
                    ].map((item, i) => (
                      <button
                        key={item.name}
                        className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl transition-all duration-150 text-left cursor-pointer ${
                          i === 0
                            ? 'bg-muted/70 font-medium text-foreground'
                            : 'hover:bg-muted/40 active:bg-muted/60 text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{item.name}</span>
                          <span className="text-xs text-muted-foreground">({item.native})</span>
                        </div>
                        {i === 0 && <Check className="size-4 text-primary shrink-0 stroke-[2.25px]" />}
                      </button>
                    ))}
                  </ScrollAreaFade>
                  <div className="p-4 pt-3 space-y-2 border-t border-border/40">
                    <Button
                      variant="secondary"
                      className="w-full h-11 min-h-[44px] rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-pointer shadow-none"
                    >
                      <Plus className="size-4" />
                      <span>Adicionar idioma</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full h-11 min-h-[44px] rounded-xl font-medium text-sm text-foreground/80 hover:text-foreground hover:bg-muted/50 cursor-pointer flex items-center justify-center transition-colors"
                    >
                      Gerenciar idiomas
                    </Button>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </TabsContent>

        {/* 5. SEÇÃO CORES & TIPOGRAFIA */}
        <TabsContent value="design" className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-1">Cores Semânticas do Sistema</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Variáveis OKLCH mapeadas para Light e Dark mode automático.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 border rounded-xl bg-card">
              <div className="p-4 rounded-lg bg-background border flex flex-col justify-between h-24">
                <span className="text-xs font-mono font-medium">Background</span>
                <span className="text-xs text-muted-foreground">--background</span>
              </div>
              <div className="p-4 rounded-lg bg-card border flex flex-col justify-between h-24">
                <span className="text-xs font-mono font-medium">Card</span>
                <span className="text-xs text-muted-foreground">--card</span>
              </div>
              <div className="p-4 rounded-lg bg-primary text-primary-foreground flex flex-col justify-between h-24">
                <span className="text-xs font-mono font-medium">Primary</span>
                <span className="text-xs opacity-80">--primary</span>
              </div>
              <div className="p-4 rounded-lg bg-secondary text-secondary-foreground flex flex-col justify-between h-24">
                <span className="text-xs font-mono font-medium">Secondary</span>
                <span className="text-xs opacity-80">--secondary</span>
              </div>
              <div className="p-4 rounded-lg bg-muted text-muted-foreground flex flex-col justify-between h-24">
                <span className="text-xs font-mono font-medium">Muted</span>
                <span className="text-xs opacity-80">--muted</span>
              </div>
              <div className="p-4 rounded-lg bg-accent text-accent-foreground flex flex-col justify-between h-24">
                <span className="text-xs font-mono font-medium">Accent</span>
                <span className="text-xs opacity-80">--accent</span>
              </div>
              <div className="p-4 rounded-lg bg-destructive text-white flex flex-col justify-between h-24">
                <span className="text-xs font-mono font-medium">Destructive</span>
                <span className="text-xs opacity-80">--destructive</span>
              </div>
              <div className="p-4 rounded-lg border flex flex-col justify-between h-24">
                <span className="text-xs font-mono font-medium">Border</span>
                <span className="text-xs text-muted-foreground">--border</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-1">Escala Tipográfica</h2>
            <div className="space-y-4 p-6 border rounded-xl bg-card">
              <div>
                <span className="text-xs text-muted-foreground font-mono block">Display / Herói</span>
                <div className="text-4xl font-bold tracking-tight">14h 32m</div>
              </div>
              <Separator />
              <div>
                <span className="text-xs text-muted-foreground font-mono block">Timer Mono Tabular</span>
                <div className="font-mono text-3xl font-light">01:24:50</div>
              </div>
              <Separator />
              <div>
                <span className="text-xs text-muted-foreground font-mono block">Heading 1 & Heading 2</span>
                <h1 className="text-2xl font-bold">Título Principal</h1>
                <h2 className="text-lg font-semibold text-muted-foreground">Subtítulo ou Seção</h2>
              </div>
              <Separator />
              <div>
                <span className="text-xs text-muted-foreground font-mono block">Corpo & Texto de Apoio</span>
                <p className="text-sm">Texto padrão de leitura para instruções e resumos.</p>
                <p className="text-xs text-muted-foreground">Texto de apoio e detalhes secundários (12px - 13px).</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
