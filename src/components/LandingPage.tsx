import React from 'react';
import { motion } from 'motion/react';
import {
  Zap,
  Search,
  TrendingUp,
  Shield,
  RefreshCw,
  Eye,
  Settings,
  Key,
  BarChart3,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Globe,
  Sparkles,
  Flame,
  Target,
  Lightbulb,
  FileText,
  Brain,
  Lock,
  Sun,
  Moon,
  Mail,
  ChevronUp,
  Bell,
  LayoutGrid,
  Calendar,
} from 'lucide-react';
import { translations, Language } from '../translations';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardFooter } from './ui/card';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { LogoCloud } from './LogoCloud';

interface LandingPageProps {
  onEnter: (tab?: LandingTab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

type LandingTab =
  | 'Pesquisa'
  | 'Trends'
  | 'Brands'
  | 'Recycler'
  | 'Watch'
  | 'SEO'
  | 'Keywords'
  | 'Gaps'
  | 'Recs'
  | 'Editorial';

const features = [
  {
    icon: Search,
    title: 'Pesquisa Competitiva',
    desc: 'Analise qualquer domínio: mapeie concorrentes, keywords e posicionamento com IA.',
    tab: 'Pesquisa' as LandingTab,
  },
  {
    icon: Flame,
    title: 'Radar de Trends',
    desc: 'Detecte tendências de mercado por período com análise semântica e relevância.',
    tab: 'Trends' as LandingTab,
  },
  {
    icon: Shield,
    title: 'Brand Intelligence',
    desc: 'Monitore menções de marca, extraia paleta visual e analise identidade de concorrentes.',
    tab: 'Brands' as LandingTab,
  },
  {
    icon: RefreshCw,
    title: 'Recycler de Conteúdo',
    desc: 'Transforme artigos em carrosséis de slides prontos para publicar.',
    tab: 'Recycler' as LandingTab,
  },
  {
    icon: Eye,
    title: 'Monitor de Sitemap',
    desc: 'Detecte automaticamente novos conteúdos publicados pelos concorrentes.',
    tab: 'Watch' as LandingTab,
  },
  {
    icon: Settings,
    title: 'Auditoria SEO',
    desc: 'Diagnóstico técnico completo: score, Core Web Vitals e recomendações de otimização.',
    tab: 'SEO' as LandingTab,
  },
  {
    icon: Key,
    title: 'Keywords Estratégicas',
    desc: 'Descubra palavras-chave de alto impacto com volume, dificuldade e intenção.',
    tab: 'Keywords' as LandingTab,
  },
  {
    icon: BarChart3,
    title: 'Gap Analysis',
    desc: 'Identifique lacunas de conteúdo e oportunidades inexploradas vs concorrentes.',
    tab: 'Gaps' as LandingTab,
  },
  {
    icon: Zap,
    title: 'Recomendações IA',
    desc: 'Plano de ação personalizado com prioridades, quick wins e estratégia de longo prazo.',
    tab: 'Recs' as LandingTab,
  },
  {
    icon: BookOpen,
    title: 'Calendário Editorial',
    desc: 'Planejamento de conteúdo inteligente baseado em dados e sazonalidade.',
    tab: 'Editorial' as LandingTab,
  },
];

const benefits = [
  'Analise qualquer domínio em segundos com IA',
  'Monitore concorrentes e detecte novas publicações',
  'Identifique gaps de conteúdo e oportunidades de mercado',
  'Gere recomendações táticas priorizadas por impacto',
  'Transforme artigos em carrosséis prontos para publicar',
  'Planeje seu calendário editorial com dados reais',
  'Audite SEO técnico com métricas de performance',
  'Exporte relatórios em múltiplos formatos',
];

function ThemeToggle() {
  const [dark, setDark] = React.useState(
    () => document.documentElement.classList.contains('dark')
  );
  const toggle = () => {
    document.documentElement.classList.toggle('dark');
    setDark(prev => !prev);
    localStorage.setItem('theme', dark ? 'light' : 'dark');
  };
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
      aria-label="Toggle theme"
    >
      {dark
        ? <Sun className="h-4 w-4 text-foreground" />
        : <Moon className="h-4 w-4 text-foreground" />
      }
    </button>
  );
}

export default function LandingPage({ onEnter, language, setLanguage }: LandingPageProps) {
  const t = translations[language];

  // Init theme from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') document.documentElement.classList.add('dark');
    else if (saved === 'light') document.documentElement.classList.remove('dark');
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-6" role="banner">
        <div className="flex justify-center">
          <nav className="flex items-center gap-10 px-8 h-14 rounded-full border border-border bg-background/80 backdrop-blur-md shadow-lg relative overflow-hidden transition-all duration-300">

            {/* Neon border beam effect - Inspired by Header-fernando */}
            <div className="absolute inset-0 rounded-full pointer-events-none overflow-hidden">
              <div className="absolute inset-x-12 top-0 h-px">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-60 animate-pulse shadow-[0_0_15px_rgba(var(--primary),0.5)]"></div>
              </div>
              <div className="absolute inset-x-12 bottom-0 h-px">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-60 animate-pulse shadow-[0_0_15px_rgba(var(--primary),0.5)]"></div>
              </div>
            </div>

            <div className="flex items-center gap-2 select-none relative z-10 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src="/contenthub-light.png" alt="Content Hub Logo Light" className="h-7 w-auto logo-light" />
              <img src="/contenthub-dark.png" alt="Content Hub Logo Dark" className="h-7 w-auto logo-dark" />
            </div>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-8 text-[10px] font-black tracking-widest uppercase relative z-10">
              <a href="#funcionalidades" className="text-primary hover:text-primary/80 transition-colors">
                {t.nav.products}
              </a>
              <a href="#como-funciona" className="text-primary hover:text-primary/80 transition-colors">
                {t.nav.about}
              </a>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 relative z-10">
              {/* Language */}
              <div className="flex items-center gap-1 border border-border/60 rounded-full p-1 bg-muted/30 backdrop-blur-sm">
                <button
                  onClick={() => setLanguage('pt')}
                  className={`px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest transition-all duration-200 ${language === 'pt' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  PT
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest transition-all duration-200 ${language === 'en' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  EN
                </button>
              </div>

              <ThemeToggle />

              <Button variant="hero" size="sm" onClick={() => onEnter('Pesquisa')} className="rounded-full px-5 py-1.5 h-auto text-[10px] font-black tracking-widest uppercase flex items-center gap-2 transition-all hover:gap-3">
                {t.nav.enterHub}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-border">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-accent-foreground">
                  {t.hero.badge}
                </span>
              </div>
              
              {/* AI Partners Icons */}
              <div className="flex items-center justify-center gap-6 pt-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                >
                  <img 
                    src="/gemini-color.svg" 
                    alt="Google Gemini" 
                    className="h-4 w-4"
                  />
                  <span className="text-xs font-medium text-muted-foreground">Gemini</span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                >
                  <img 
                    src="/firecrawl-logo.svg" 
                    alt="Firecrawl" 
                    className="h-4 w-4"
                  />
                  <span className="text-xs font-medium text-muted-foreground">Firecrawl</span>
                </motion.div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
            >
              {t.hero.title1}{' '}
              <span
                className="text-gradient"
                style={{ backgroundImage: 'linear-gradient(to right, hsl(22 100% 50%), hsl(32 100% 55%))' }}
              >
                {t.hero.titleHighlight}
              </span>{' '}
              {t.hero.titleEnd}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button variant="hero" size="xl" onClick={() => onEnter('Pesquisa')}>
                {t.hero.cta}
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="hero-outline" size="xl" onClick={() => document.getElementById('funcionalidades')?.scrollIntoView({ behavior: 'smooth' })}>
                {t.hero.ctaOutline}
              </Button>
            </motion.div>
          </div>

          {/* Functionality Showcase Slider */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-16 w-full"
          >
            <LogoCloud language={language} />
          </motion.div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="funcionalidades" className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
              Funcionalidades
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Tudo que você precisa para decidir com inteligência
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Da pesquisa competitiva ao calendário editorial — uma plataforma completa para estratégia de conteúdo B2B.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 justify-items-center [&>*]:w-full">
            {features.map((feature, i) => (
              <div
                key={i}
                className="relative group p-[1px] rounded-xl overflow-hidden cursor-pointer"
                onClick={() => onEnter(feature.tab)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onEnter(feature.tab);
                  }
                }}
              >
                <div className="absolute inset-0 border-beam opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 bg-card rounded-[inherit] p-4 h-full">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                      <feature.icon className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground leading-tight">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1 line-clamp-2">{feature.desc}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] text-primary font-medium mt-2.5 ml-12 group-hover:gap-1.5 transition-all">
                    Acessar <ArrowRight className="h-2.5 w-2.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Como Funciona ─────────────────────────────────────── */}
      <section id="como-funciona" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
              Como Funciona
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Da análise ao plano de ação em{' '}
              <span className="text-primary">minutos</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fluxo integrado que combina análise automática, inteligência artificial e exportação profissional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { number: '01', title: 'Pesquisa Competitiva', desc: 'Mapeie o domínio da sua empresa e de até 10 concorrentes para um benchmark instantâneo de posicionamento.' },
              { number: '02', title: 'Trends & Keywords', desc: 'Detecte tendências emergentes no seu nicho e identifique as palavras-chave com maior potencial de tráfego.' },
              { number: '03', title: 'Content Gaps & SEO', desc: 'Descubra exatamente o que seus concorrentes não estão falando e audite o SEO técnico de qualquer página.' },
              { number: '04', title: 'Recomendações & Editorial', desc: 'Receba planos de ação priorizados pela IA e transforme diagnósticos em um calendário de conteúdo estratégico.' },
              { number: '05', title: 'Content Recycler', desc: 'Otimize sua produção transformando artigos e insights em formatos prontos para redes sociais como carrosséis e posts.' },
              { number: '06', title: 'Watch & Brand Monitoring', desc: 'Mantenha-se à frente com alertas ativos de mercado e monitore cada menção à sua marca em tempo real.' },
            ].map((step, i) => (
              <div key={i} className="relative group">
                <div className="absolute -left-4 -top-4 text-6xl font-black text-primary/10 tracking-tighter transition-all group-hover:text-primary/20 group-hover:-translate-y-1">
                  {step.number}
                </div>
                <div className="relative z-10 pt-4">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Section ───────────────────────────────────────── */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
              Inteligência Artificial
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Powered by IA em{' '}
              <span className="text-primary">múltiplas camadas</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Inteligência competitiva de ponta integrada nativamente para transformar dados brutos em estratégia de conteúdo em segundos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <div className="relative group p-[1px] rounded-xl overflow-hidden transition-all duration-300 h-full">
              <div className="absolute inset-0 border-beam opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 h-full bg-card rounded-[inherit]">
                <Card className="h-full border-0 shadow-none bg-transparent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Search className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground leading-tight">Pesquisa & Análise</p>
                          <p className="text-xs text-muted-foreground">Mapeamento competitivo</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">IA</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A IA analisa o conteúdo do domínio e gera um diagnóstico completo de posicionamento.
                    </p>
                    <Separator />
                    <div className="space-y-2.5">
                      {[
                        { icon: Search, label: 'Análise de Domínios', detail: 'Identificação de autoridade e tópicos' },
                        { icon: BarChart3, label: 'SEO & Performance', detail: 'Auditoria técnica profunda via IA' },
                        { icon: Target, label: 'Mapeamento de Gaps', detail: 'Lacunas competitivas encontradas' },
                        { icon: Lightbulb, label: 'Recomendações', detail: 'Ações priorizadas por ROI' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                          <item.icon className="h-4 w-4 text-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground">{item.label}</p>
                            <p className="text-[11px] text-muted-foreground truncate">{item.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="w-full space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Profundidade da análise</span>
                        <span className="font-medium text-primary">Avançada</span>
                      </div>
                      <Progress value={85} className="h-1.5" />
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative group p-[1px] rounded-xl overflow-hidden transition-all duration-300 h-full">
              <div className="absolute inset-0 border-beam opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 h-full bg-card rounded-[inherit]">
                <Card className="h-full border-0 shadow-none bg-transparent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Flame className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground leading-tight">Trends & Mercado</p>
                          <p className="text-xs text-muted-foreground">Inteligência de mercado</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-500">IA</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Detecte tendências emergentes no seu nicho com análise semântica e score de relevância.
                    </p>
                    <Separator />
                    <div className="space-y-2.5">
                      {[
                        { icon: Shield, label: 'Brand Monitoring', detail: 'Menções e presença de marca' },
                        { icon: Globe, label: 'Keywords Semantics', detail: 'Pesquisa de intenção de busca' },
                        { icon: TrendingUp, label: 'Market Discovery', detail: 'Tendências em tempo real' },
                        { icon: Bell, label: 'Alertas Inteligentes', detail: 'Oportunidades de momento' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                          <item.icon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground">{item.label}</p>
                            <p className="text-[11px] text-muted-foreground truncate">{item.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="w-full space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Cobertura de mercado</span>
                        <span className="font-medium text-blue-500">Completa</span>
                      </div>
                      <Progress value={92} className="h-1.5 [&>div]:bg-blue-500" />
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>

            {/* Card 3 */}
            <div className="relative group p-[1px] rounded-xl overflow-hidden transition-all duration-300 h-full">
              <div className="absolute inset-0 border-beam opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 h-full bg-card rounded-[inherit]">
                <Card className="h-full border-0 shadow-none bg-transparent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground leading-tight">Geração de Conteúdo</p>
                          <p className="text-xs text-muted-foreground">Dados brutos → publicações</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-500">IA</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Transforme análises em conteúdo publicável: carrosséis, briefs e calendários editoriais.
                    </p>
                    <Separator />
                    <div className="space-y-2.5">
                      {[
                        { icon: LayoutGrid, label: 'Content Recycler', detail: 'Artigos → Social Media Posts' },
                        { icon: Calendar, label: 'Calendário Editorial', detail: 'Planejamento 360º automatizado' },
                        { icon: FileText, label: 'Briefing Inteligente', detail: 'Estruturas completas de conteúdo' },
                        { icon: Zap, label: 'Engine de Execução', detail: 'Do insight à publicação final' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                          <item.icon className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground">{item.label}</p>
                            <p className="text-[11px] text-muted-foreground truncate">{item.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="w-full space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Acionabilidade</span>
                        <span className="font-medium text-emerald-500">Alta</span>
                      </div>
                      <Progress value={78} className="h-1.5 [&>div]:bg-emerald-500" />
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>

          {/* AI Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <Card className="border-border/60">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-tight">Google Gemini</p>
                  <p className="text-[10px] text-muted-foreground truncate">Elite AI · 2.0 Flash</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Lock className="h-4 w-4 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-tight">Infraestrutura Nativa</p>
                  <p className="text-[10px] text-muted-foreground truncate">IA de elite embarcada e pronta para uso</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────── */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-5xl font-extrabold mb-8 leading-tight">
                Estratégia antes <br className="hidden sm:block" />
                da execução
              </h2>
              <p className="text-xl opacity-90 mb-10 leading-relaxed max-w-xl">
                A maioria das empresas B2B cria conteúdo sem validar o mercado.
                No Content Hub, você decide com base em <span className="font-bold underline decoration-orange-300 underline-offset-4">dados reais</span> e benchmark competitivo profundo.
              </p>

              <div className="space-y-6">
                {[
                  { title: 'Benchmark 360º', desc: 'Cruzamento automático de performance entre sua marca e 10+ competidores.', icon: Search },
                  { title: 'Validação de Gaps', desc: 'Cada pauta é validada pela IA contra o que o mercado realmente carece no momento.', icon: Target },
                  { title: 'Native AI Flow', desc: 'Infraestrutura unificada que leva você do insight bruto ao calendário pronto.', icon: Zap },
                ].map((item, j) => (
                  <div key={j} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#030303] flex items-center justify-center shrink-0 border border-white/5">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-sm opacity-80">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Search, value: '10+', label: 'Competidores' },
                { icon: BarChart3, value: '2.0', label: 'Flash Engine' },
                { icon: Sparkles, value: '100%', label: 'Embedded AI' },
                { icon: Zap, value: '< 30s', label: 'Insights' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#030303] rounded-[2rem] p-8 text-center shadow-2xl border border-white/5 transition-all hover:scale-105 hover:bg-[#0a0a0a]">
                  <stat.icon className="h-8 w-8 mx-auto mb-4 text-primary" />
                  <p className="text-4xl font-extrabold mb-1 text-white">{stat.value}</p>
                  <p className="text-[10px] font-black tracking-widest uppercase opacity-40 text-white">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section id="precos" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Pronto para criar com inteligência?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Acesse gratuitamente e descubra o potencial do seu nicho — da análise ao plano de conteúdo em minutos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" onClick={() => onEnter('Pesquisa')}>
              Acessar Agora
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="xl" onClick={() => document.getElementById('funcionalidades')?.scrollIntoView({ behavior: 'smooth' })}>
              Ver Funcionalidades
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            Gratuito · Comece em segundos
          </p>
        </div>
      </section>

      {/* ── Footer Redesign ───────────────────────────────────── */}
      <footer className="py-24 px-4 bg-background">
        <div className="max-w-6xl mx-auto bg-muted/30 border border-primary/30 rounded-[3rem] p-12 sm:p-16 flex flex-col items-center shadow-2xl shadow-primary/5 transition-all hover:border-primary/50">

          {/* Logo Section */}
          <div className="mb-10 flex flex-col items-center gap-4 select-none group">
            <img src="/contenthub-light.png" alt="Content Hub Footer Logo Light" className="h-10 w-auto logo-light group-hover:scale-105 transition-transform duration-300" />
            <img src="/contenthub-dark.png" alt="Content Hub Footer Logo Dark" className="h-10 w-auto logo-dark group-hover:scale-105 transition-transform duration-300" />
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em] opacity-40">Inteligente & Estratégico</p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-y-4 gap-x-10 text-xs font-black tracking-widest uppercase text-muted-foreground mb-12">
            <a href="#funcionalidades" className="hover:text-primary transition-colors">{t.nav.products}</a>
            <a href="#como-funciona" className="hover:text-primary transition-colors">{t.nav.about}</a>
          </div>

          {/* Minimal Separator */}
          <div className="w-full h-px bg-border/40 max-w-4xl mb-12" />

          {/* Newsletter Form */}
          <div className="w-full max-w-xl flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center group-focus-within:bg-primary/10 transition-colors">
                <Mail className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="w-full h-14 pl-14 pr-4 rounded-full bg-background border border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-medium"
              />
            </div>
            <Button className="w-full sm:w-auto h-14 px-10 rounded-full bg-primary text-primary-foreground text-xs font-black tracking-widest uppercase hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95">
              Inscrever-se
            </Button>
          </div>

          {/* Legal / Copyright */}
          <div className="mt-16 flex flex-col items-center gap-4 border-t border-border/20 pt-8 w-full max-w-4xl">
            <p className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">
              © {new Date().getFullYear()} Content Hub AI · Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>

      {/* ── Final Back to Top Component ────────────────────────── */}
      <div className="py-12 flex justify-center bg-background">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group flex flex-col items-center gap-3 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-card shadow-sm group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <ChevronUp className="h-4 w-4" />
          </div>
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground group-hover:text-primary transition-colors">
            Voltar ao topo
          </span>
        </button>
      </div>
    </div>
  );
}
