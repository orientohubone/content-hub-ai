import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Flame, 
  Shield, 
  RefreshCw, 
  Eye, 
  Settings, 
  Key, 
  BarChart3, 
  Zap, 
  BookOpen,
  ChevronDown,
  ChevronUp,
  Folder,
  Trash2,
  Plus,
  X,
  Download,
  History,
  Info,
  Globe,
  LayoutGrid,
  TrendingUp,
  Lightbulb,
  Copy,
  Check,
  Loader2,
  Palette,
  Link2,
  Layout,
  Bell,
  Scan,
  FileText,
  Target,
  Calendar,
  ArrowRight,
  Asterisk
} from 'lucide-react';
import { 
  analyzeCompetitors, AnalysisResult, 
  fetchTrends, TrendResult, 
  analyzeSEO, SEOAuditResult, 
  fetchKeywords, KeywordResult,
  analyzeGaps, GapResult,
  generateRecs, RecResult,
  planEditorial, EditorialResult
} from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import LandingPage from './components/LandingPage';

import { translations, Language } from './translations';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tab = 'Pesquisa' | 'Trends' | 'Brands' | 'Recycler' | 'Watch' | 'SEO' | 'Keywords' | 'Gaps' | 'Recs' | 'Editorial';

interface SavedSearch {
  id: string;
  domain: string;
  date: string;
  resultsCount: number;
}

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [language, setLanguage] = useState<Language>('pt');
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<Tab>('Pesquisa');
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(true);
  const [targetDomain, setTargetDomain] = useState('vendasimples.com.br');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTags, setSearchTags] = useState<string[]>(['erp', 'sistema de gestão', 'plataforma de gestão de vendas', 'software de gestão', 'sistema de vendas', 'emissor de notas fiscais', 'controle de estoque', 'controle financeiro', 'fluxo de caixa', 'frente de caixa', 'pdv', 'contas a pagar', 'contas a receber']);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [trendResult, setTrendResult] = useState<TrendResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Trends Tab State
  const [trendPeriod, setTrendPeriod] = useState<'Última hora' | 'Hoje' | 'Semana' | 'Mês'>('Semana');
  const [trendQuery, setTrendQuery] = useState('');
  const [trendTags, setTrendTags] = useState<string[]>(['sistema de gestão', 'tendencia para pmes', 'gestão empresarial 2026', 'gestão para varejo', 'solução erp para comércio']);
  const [brandUrls, setBrandUrls] = useState<string[]>(['www.humanacademy.ai/']);
  const [brandUrlInput, setBrandUrlInput] = useState('');

  // Recycler Tab State
  const [recyclerUrl, setRecyclerUrl] = useState('');
  const [slideCount, setSlideCount] = useState<5 | 8 | 10>(5);
  const [recyclerStyle, setRecyclerStyle] = useState<'Educacional' | 'Provocativo' | 'Storytelling' | 'Data-driven'>('Educacional');
  const [recyclerHistory] = useState([
    { id: '1', url: 'www.cartacapital.com.br/do-micro-ao-macr', date: '03/03/2026, 15:12:14' },
    { id: '2', url: 'www.cigam.com.br/blog/916/cigam-60-segun', date: '02/03/2026, 15:40:51' }
  ]);

  // Watch Tab State
  const [watchDomains, setWatchDomains] = useState<string[]>(['https://sistemadegestaosimples.com.br/']);
  const [watchDomainInput, setWatchDomainInput] = useState('');
  const [watchHistory] = useState([
    { id: '1', domains: 1, date: '10/03/2026, 11:25:38' },
    { id: '2', domains: 1, date: '10/03/2026, 11:24:01' }
  ]);
  const [watchResults, setWatchResults] = useState<{ 
    domain: string; 
    sitemapUrl: string;
    lastModified: string;
    totalUrls: number;
    newUrls: { url: string; title: string; date: string }[] 
  }[] | null>(null);

  // SEO Tab State
  const [seoUrl, setSeoUrl] = useState('https://vendasimples.com.br');
  const [seoResult, setSeoResult] = useState<SEOAuditResult | null>(null);
  const [seoHistory] = useState([
    { id: '1', url: 'vendasimples.com.br', score: 9.2, date: '27/03/2026, 10:15:22' }
  ]);

  // Keywords Tab State
  const [keywordResult, setKeywordResult] = useState<KeywordResult | null>(null);
  const [keywordHistory] = useState([
    { id: '1', domain: 'vendasimples.com.br', count: 12, date: '27/03/2026, 11:45:10' }
  ]);

  // Gaps Tab State
  const [gapResult, setGapResult] = useState<GapResult | null>(null);

  // Recs Tab State
  const [recResult, setRecResult] = useState<RecResult | null>(null);

  // Editorial Tab State
  const [editorialResult, setEditorialResult] = useState<EditorialResult | null>(null);

  const [savedSearches] = useState<SavedSearch[]>([
    { id: '1', domain: 'vendasimples.com.br', date: '03/03/2026', resultsCount: 65 }
  ]);

  const [trendHistory] = useState([
    { id: '1', queries: 5, date: '02/03/2026, 15:23:35' }
  ]);

  const tabs: { id: Tab; icon: any; label: string }[] = [
    { id: 'Pesquisa', icon: Search, label: t.dashboard.search },
    { id: 'Trends', icon: Flame, label: t.dashboard.trends },
    { id: 'Brands', icon: Shield, label: t.dashboard.brands },
    { id: 'Recycler', icon: RefreshCw, label: t.dashboard.recycler },
    { id: 'Watch', icon: Eye, label: t.dashboard.watch },
    { id: 'SEO', icon: Settings, label: t.dashboard.seo },
    { id: 'Keywords', icon: Key, label: t.dashboard.keywords },
    { id: 'Gaps', icon: BarChart3, label: t.dashboard.gaps },
    { id: 'Recs', icon: Zap, label: t.dashboard.recs },
    { id: 'Editorial', icon: BookOpen, label: t.dashboard.editorial },
  ];

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm && !searchTags.includes(searchTerm)) {
      setSearchTags([...searchTags, searchTerm]);
      setSearchTerm('');
    }
  };

  const removeTag = (tag: string) => {
    setSearchTags(searchTags.filter(t => t !== tag));
  };

  const handleAddTrendTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (trendQuery && !trendTags.includes(trendQuery)) {
      setTrendTags([...trendTags, trendQuery]);
      setTrendQuery('');
    }
  };

  const removeTrendTag = (tag: string) => {
    setTrendTags(trendTags.filter(t => t !== tag));
  };

  const handleAddBrandUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (brandUrlInput && !brandUrls.includes(brandUrlInput)) {
      setBrandUrls([...brandUrls, brandUrlInput]);
      setBrandUrlInput('');
    }
  };

  const removeBrandUrl = (url: string) => {
    setBrandUrls(brandUrls.filter(u => u !== url));
  };

  const handleAddWatchDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (watchDomainInput && !watchDomains.includes(watchDomainInput)) {
      setWatchDomains([...watchDomains, watchDomainInput]);
      setWatchDomainInput('');
    }
  };

  const removeWatchDomain = (domain: string) => {
    setWatchDomains(watchDomains.filter(d => d !== domain));
  };

  const handleScanWatch = () => {
    setLoading(true);
    // Simulate scan
    setTimeout(() => {
      setWatchResults([
        {
          domain: 'sistemadegestaosimples.com.br',
          sitemapUrl: 'https://sistemadegestaosimples.com.br/sitemap.xml',
          lastModified: '27/03/2026, 14:15:00',
          totalUrls: 142,
          newUrls: [
            { 
              url: '/blog/novas-funcionalidades-erp-2026', 
              title: 'Novas Funcionalidades ERP 2026: O que esperar',
              date: '27/03/2026'
            },
            { 
              url: '/funcionalidades/controle-de-estoque-avancado', 
              title: 'Controle de Estoque Avançado para Varejo',
              date: '26/03/2026'
            },
            { 
              url: '/precos/plano-enterprise-atualizado', 
              title: 'Planos e Preços Atualizados - Enterprise',
              date: '25/03/2026'
            }
          ]
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeCompetitors(targetDomain, searchTags);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTrends = async () => {
    setLoading(true);
    setTrendResult(null);
    try {
      const data = await fetchTrends(trendPeriod, trendTags);
      setTrendResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeSEO = async () => {
    if (!seoUrl) return;
    setLoading(true);
    setSeoResult(null);
    try {
      const data = await analyzeSEO(seoUrl);
      setSeoResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchKeywords = async () => {
    setLoading(true);
    setKeywordResult(null);
    try {
      const data = await fetchKeywords(targetDomain, brandUrls);
      setKeywordResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeGaps = async () => {
    setLoading(true);
    setGapResult(null);
    try {
      const data = await analyzeGaps(targetDomain, brandUrls);
      setGapResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRecs = async () => {
    setLoading(true);
    setRecResult(null);
    try {
      const data = await generateRecs(targetDomain, result || {});
      setRecResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanEditorial = async () => {
    setLoading(true);
    setEditorialResult(null);
    try {
      // Use topics from result or keywords as base
      const topics = keywordResult?.keywords.map(k => k.term) || result?.ideas.map(i => i.title) || ["SEO", "Marketing Digital"];
      const data = await planEditorial(targetDomain, topics);
      setEditorialResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Pesquisa':
        return (
          <motion.div 
            key="pesquisa"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-8"
          >
            {/* How it works section */}
            <section className="bg-brand-card-accent rounded-[32px] overflow-hidden border border-black/5">
              <div 
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-black/5 transition-all"
                onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-brand-orange p-2.5 rounded-xl">
                    <Search size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-black">{t.dashboard.competitiveSearch}</h3>
                    <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">{t.dashboard.mapDomain}</p>
                  </div>
                </div>
                {isHowItWorksOpen ? <ChevronUp size={18} className="text-black" /> : <ChevronDown size={18} className="text-black" />}
              </div>
              
              <AnimatePresence>
                {isHowItWorksOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <div className="bg-white/40 p-5 rounded-2xl border border-white/60">
                        <div className="flex items-center gap-2 mb-3">
                          <Globe size={14} className="text-black" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-black">{t.dashboard.howItWorks.step1Title}</span>
                        </div>
                        <p className="text-[11px] text-black/60 font-medium leading-relaxed">
                          {t.dashboard.howItWorks.step1Desc}
                        </p>
                      </div>
                      <div className="bg-white/40 p-5 rounded-2xl border border-white/60">
                        <div className="flex items-center gap-2 mb-3">
                          <Search size={14} className="text-black" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-black">{t.dashboard.howItWorks.step2Title}</span>
                        </div>
                        <p className="text-[11px] text-black/60 font-medium leading-relaxed">
                          {t.dashboard.howItWorks.step2Desc}
                        </p>
                      </div>
                      <div className="bg-white/40 p-5 rounded-2xl border border-white/60">
                        <div className="flex items-center gap-2 mb-3">
                          <BarChart3 size={14} className="text-black" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-black">{t.dashboard.howItWorks.step3Title}</span>
                        </div>
                        <p className="text-[11px] text-black/60 font-medium leading-relaxed">
                          {t.dashboard.howItWorks.step3Desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Saved Searches */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-tight">{t.dashboard.savedSearches}</h3>
                <RefreshCw size={16} className="text-brand-text-muted cursor-pointer hover:text-brand-orange transition-colors" />
              </div>
              <div className="space-y-2">
                {savedSearches.map(search => (
                  <div key={search.id} className="glass-card p-4 flex items-center justify-between hover:border-brand-orange/30 transition-all group">
                    <div className="space-y-1">
                      <p className="text-sm font-bold">{search.domain}</p>
                      <p className="text-xs text-brand-text-muted">{search.date} · {search.resultsCount} {language === 'pt' ? 'resultados' : 'results'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Trash2 size={16} className="text-brand-text-muted cursor-pointer hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Inputs */}
            <section className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">{t.dashboard.targetDomain}</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={targetDomain}
                  onChange={(e) => setTargetDomain(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">{t.dashboard.searchTerms}</label>
                <form onSubmit={handleAddTag} className="flex gap-2">
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder={t.dashboard.addTerm}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="bg-brand-card border border-brand-border p-2.5 rounded-lg hover:bg-brand-card-hover transition-all">
                    <Plus size={20} />
                  </button>
                </form>
                <div className="flex flex-wrap gap-2">
                  {searchTags.map(tag => (
                    <span key={tag} className="tag">
                      {tag}
                      <X size={12} className="cursor-pointer hover:text-orange-300" onClick={() => removeTag(tag)} />
                    </span>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleAnalyze}
                disabled={loading}
                className="btn-primary w-full py-4 text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>{t.dashboard.analyzing}</span>
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    <span>{t.dashboard.analyze}</span>
                  </>
                )}
              </button>
            </section>
          </motion.div>
        );

      case 'Trends':
        return (
          <motion.div 
            key="trends"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-8"
          >
            {/* How it works section */}
            <section className="glass-card overflow-hidden border-orange-900/20">
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-brand-card-hover transition-all"
                onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-orange-950/30 p-2 rounded-lg">
                    <Flame size={18} className="text-brand-orange" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight">{t.dashboard.trendsTab.howItWorksTitle}</h3>
                    <p className="text-xs text-brand-text-muted font-medium">{t.dashboard.trendsTab.howItWorksDesc}</p>
                  </div>
                </div>
                {isHowItWorksOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              
              <AnimatePresence>
                {isHowItWorksOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <div className="step-card">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-red-950/30 p-1.5 rounded-lg">
                            <History size={14} className="text-red-500" />
                          </div>
                          <span className="text-xs font-bold">{t.dashboard.trendsTab.step1Title}</span>
                        </div>
                        <p className="text-[11px] text-brand-text-muted leading-relaxed">
                          {t.dashboard.trendsTab.step1Desc}
                        </p>
                      </div>
                      <div className="step-card">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-purple-950/30 p-1.5 rounded-lg">
                            <Search size={14} className="text-purple-500" />
                          </div>
                          <span className="text-xs font-bold">{t.dashboard.trendsTab.step2Title}</span>
                        </div>
                        <p className="text-[11px] text-brand-text-muted leading-relaxed">
                          {t.dashboard.trendsTab.step2Desc}
                        </p>
                      </div>
                      <div className="step-card">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-blue-950/30 p-1.5 rounded-lg">
                            <BarChart3 size={14} className="text-blue-500" />
                          </div>
                          <span className="text-xs font-bold">{t.dashboard.trendsTab.step3Title}</span>
                        </div>
                        <p className="text-[11px] text-brand-text-muted leading-relaxed">
                          {t.dashboard.trendsTab.step3Desc}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-brand-card rounded-lg flex items-center gap-3 border border-brand-border">
                      <Lightbulb size={16} className="text-yellow-500 shrink-0" />
                      <p className="text-[11px] text-brand-text-muted">
                        {t.dashboard.trendsTab.tip}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* History */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <History size={16} className="text-brand-text-muted" />
                <h3 className="text-sm font-black uppercase tracking-tight">{t.dashboard.trendsTab.history}</h3>
                <span className="bg-brand-card px-2 py-0.5 rounded text-[10px] text-brand-text-muted font-bold">1/3</span>
              </div>
              <div className="space-y-2">
                {trendHistory.map(item => (
                  <div key={item.id} className="glass-card p-4 flex items-center justify-between hover:border-brand-orange/30 transition-all group">
                    <div className="flex items-center gap-3">
                      <Eye size={16} className="text-brand-text-muted" />
                      <p className="text-xs text-brand-text-muted">{item.queries} queries — {item.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Download size={16} className="text-brand-text-muted cursor-pointer hover:text-brand-text" />
                      <span className="text-[10px] font-bold text-brand-text-muted">HTML</span>
                      <Trash2 size={16} className="text-brand-text-muted cursor-pointer hover:text-red-500" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Trend Radar Form */}
            <section className="glass-card p-8 space-y-8 border-brand-orange/20">
              <div className="flex items-center gap-4">
                <div className="bg-brand-orange/20 p-3 rounded-2xl">
                  <TrendingUp size={24} className="text-brand-orange" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter italic">{t.dashboard.trendsTab.formTitle}</h3>
                  <p className="text-xs text-brand-text-muted font-medium">{t.dashboard.trendsTab.formSubtitle}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">{t.dashboard.trendsTab.period}</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'Última hora', label: t.dashboard.trendsTab.periods.lastHour },
                      { id: 'Hoje', label: t.dashboard.trendsTab.periods.today },
                      { id: 'Semana', label: t.dashboard.trendsTab.periods.week },
                      { id: 'Mês', label: t.dashboard.trendsTab.periods.month }
                    ].map(({ id, label }) => (
                      <button
                        key={id}
                        onClick={() => setTrendPeriod(id as any)}
                        className={cn(
                          "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                          trendPeriod === id 
                            ? "bg-brand-orange/10 text-brand-orange border-brand-orange/30 shadow-[0_0_15px_rgba(255,77,0,0.1)]" 
                            : "bg-white/5 text-brand-text-muted border-white/10 hover:border-brand-text-muted"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            id === 'Última hora' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : 
                            id === 'Hoje' ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" :
                            id === 'Semana' ? "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" : "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                          )} />
                          {label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">{t.dashboard.trendsTab.queries}</label>
                  <form onSubmit={handleAddTrendTag} className="flex gap-3">
                    <input 
                      type="text" 
                      className="input-field flex-1" 
                      placeholder={t.dashboard.trendsTab.addQuery}
                      value={trendQuery}
                      onChange={(e) => setTrendQuery(e.target.value)}
                    />
                    <button type="submit" className="bg-white/5 border border-white/10 p-3.5 rounded-2xl hover:bg-white/10 transition-all group">
                      <Plus size={24} className="group-hover:rotate-90 transition-transform" />
                    </button>
                  </form>
                  <div className="flex flex-wrap gap-2">
                    {trendTags.map(tag => (
                      <span key={tag} className="tag bg-white/5 border-white/10 text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest flex items-center gap-2 group">
                        {tag}
                        <X size={12} className="cursor-pointer hover:text-brand-orange transition-colors" onClick={() => removeTrendTag(tag)} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleFetchTrends}
                disabled={loading}
                className="btn-primary w-full py-5 text-lg font-black uppercase tracking-widest italic group"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    <span>{t.dashboard.trendsTab.fetching}</span>
                  </>
                ) : (
                  <>
                    <TrendingUp size={24} className="group-hover:scale-110 transition-transform" />
                    <span>{t.dashboard.trendsTab.fetchTrends}</span>
                  </>
                )}
              </button>
            </section>

            {/* Trend Results */}
            <AnimatePresence>
              {trendResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8 pt-8 border-t border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">{t.dashboard.trendsTab.insights}</h2>
                    <div className="bg-brand-orange/10 px-4 py-1.5 rounded-full border border-brand-orange/30">
                      <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest">{t.dashboard.trendsTab.periods[trendPeriod.replace(' ', '').charAt(0).toLowerCase() + trendPeriod.replace(' ', '').slice(1)] || trendPeriod}</span>
                    </div>
                  </div>

                  <div className="glass-card p-6 bg-brand-orange/5 border-brand-orange/20 relative overflow-hidden group rounded-[32px]">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(trendResult.summary);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5"
                      >
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-brand-text-muted" />}
                      </button>
                    </div>
                    <div className="flex gap-5">
                      <div className="bg-brand-orange/20 p-3 rounded-2xl h-fit">
                        <Lightbulb size={24} className="text-brand-orange" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-brand-orange uppercase tracking-widest">{t.dashboard.trendsTab.strategicSummary}</p>
                        <p className="text-sm text-brand-text leading-relaxed italic font-medium">
                          "{trendResult.summary}"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trendResult.trends.map((trend, i) => (
                      <div key={i} className="glass-card p-6 space-y-4 hover:border-brand-orange/40 transition-all group rounded-[32px]">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-black uppercase tracking-tight text-brand-orange italic group-hover:translate-x-1 transition-transform">{trend.title}</h4>
                          <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                            <TrendingUp size={14} className="text-green-500" />
                            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">{(trend.relevance * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                        <p className="text-xs text-brand-text-muted leading-relaxed font-medium">
                          {trend.description}
                        </p>
                        {trend.source && (
                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <span className="text-[10px] text-brand-text-muted font-black uppercase tracking-widest">{t.dashboard.trendsTab.source}: {trend.source}</span>
                            {trend.url && (
                              <a href={trend.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-brand-orange font-black uppercase tracking-widest hover:underline flex items-center gap-1">
                                {t.dashboard.trendsTab.seeMore} <ArrowRight size={10} />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );

      case 'Brands':
        return (
          <motion.div 
            key="brands"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-8"
          >
            {/* How it works section */}
            <section className="glass-card overflow-hidden border-brand-orange/20 rounded-[40px]">
              <div 
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all"
                onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-brand-orange/20 p-3 rounded-2xl">
                    <Palette size={24} className="text-brand-orange" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tighter italic">{t.dashboard.brandsTab.howItWorksTitle}</h3>
                    <p className="text-xs text-brand-text-muted font-medium">{t.dashboard.brandsTab.howItWorksDesc}</p>
                  </div>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                  {isHowItWorksOpen ? <ChevronUp size={20} className="text-brand-orange" /> : <ChevronDown size={20} className="text-brand-text-muted" />}
                </div>
              </div>
              
              <AnimatePresence>
                {isHowItWorksOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                      <div className="glass-card p-6 bg-white/5 border-white/10 rounded-[32px] space-y-3 group hover:border-brand-orange/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-500/20 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                            <Link2 size={18} className="text-blue-400" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest">{t.dashboard.brandsTab.step1Title}</span>
                        </div>
                        <p className="text-[11px] text-brand-text-muted leading-relaxed font-medium">
                          {t.dashboard.brandsTab.step1Desc}
                        </p>
                      </div>
                      <div className="glass-card p-6 bg-white/5 border-white/10 rounded-[32px] space-y-3 group hover:border-brand-orange/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-500/20 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                            <Palette size={18} className="text-purple-400" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest">{t.dashboard.brandsTab.step2Title}</span>
                        </div>
                        <p className="text-[11px] text-brand-text-muted leading-relaxed font-medium">
                          {t.dashboard.brandsTab.step2Desc}
                        </p>
                      </div>
                      <div className="glass-card p-6 bg-white/5 border-white/10 rounded-[32px] space-y-3 group hover:border-brand-orange/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-500/20 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                            <Layout size={18} className="text-green-400" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest">{t.dashboard.brandsTab.step3Title}</span>
                        </div>
                        <p className="text-[11px] text-brand-text-muted leading-relaxed font-medium">
                          {t.dashboard.brandsTab.step3Desc}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 p-5 bg-brand-orange/5 rounded-[24px] flex items-center gap-4 border border-brand-orange/20">
                      <div className="bg-brand-orange/20 p-2 rounded-lg">
                        <Lightbulb size={20} className="text-brand-orange" />
                      </div>
                      <p className="text-xs text-brand-text-muted font-medium leading-relaxed">
                        {t.dashboard.brandsTab.tip}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Brand Intelligence Form */}
            <section className="glass-card p-8 space-y-8 border-brand-orange/20 rounded-[40px]">
              <div className="flex items-center gap-4">
                <div className="bg-brand-orange/20 p-3 rounded-2xl">
                  <Palette size={24} className="text-brand-orange" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter italic">{t.dashboard.brandsTab.formTitle}</h3>
                  <p className="text-xs text-brand-text-muted font-medium">{t.dashboard.brandsTab.formSubtitle}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">{language === 'pt' ? 'URLs de concorrentes' : 'Competitor URLs'}</label>
                  <form onSubmit={handleAddBrandUrl} className="flex gap-3">
                    <input 
                      type="text" 
                      className="input-field flex-1" 
                      placeholder={t.dashboard.brandsTab.urlPlaceholder}
                      value={brandUrlInput}
                      onChange={(e) => setBrandUrlInput(e.target.value)}
                    />
                    <button type="submit" className="bg-white/5 border border-white/10 p-3.5 rounded-2xl hover:bg-white/10 transition-all group">
                      <Plus size={24} className="group-hover:rotate-90 transition-transform" />
                    </button>
                  </form>
                  <div className="flex flex-wrap gap-2">
                    {brandUrls.map(url => (
                      <span key={url} className="tag bg-white/5 border-white/10 text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest flex items-center gap-2 group">
                        {url}
                        <X size={12} className="cursor-pointer hover:text-brand-orange transition-colors" onClick={() => removeBrandUrl(url)} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                className="btn-primary w-full py-5 text-lg font-black uppercase tracking-widest italic group"
              >
                <Palette size={24} className="group-hover:scale-110 transition-transform" />
                {t.dashboard.brandsTab.analyze}
              </button>
            </section>
          </motion.div>
        );

      case 'Recycler':
        return (
          <motion.div 
            key="recycler"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-12"
          >
            {/* How it works section */}
            <section className="bg-brand-card-accent rounded-[32px] overflow-hidden border border-black/5">
              <div 
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-black/5 transition-all"
                onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-brand-orange p-2.5 rounded-xl">
                    <RefreshCw size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-black">{t.dashboard.recyclerTab.title}</h3>
                    <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">{t.dashboard.recyclerTab.subtitle}</p>
                  </div>
                </div>
                {isHowItWorksOpen ? <ChevronUp size={18} className="text-black" /> : <ChevronDown size={18} className="text-black" />}
              </div>
              
              <AnimatePresence>
                {isHowItWorksOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <div className="bg-white/40 p-5 rounded-2xl border border-white/60">
                        <div className="flex items-center gap-2 mb-3">
                          <Link2 size={14} className="text-black" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-black">{t.dashboard.recyclerTab.step1Title}</span>
                        </div>
                        <p className="text-[11px] text-black/60 font-medium leading-relaxed">
                          {t.dashboard.recyclerTab.step1Desc}
                        </p>
                      </div>
                      <div className="bg-white/40 p-5 rounded-2xl border border-white/60">
                        <div className="flex items-center gap-2 mb-3">
                          <Settings size={14} className="text-black" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-black">{t.dashboard.recyclerTab.step2Title}</span>
                        </div>
                        <p className="text-[11px] text-black/60 font-medium leading-relaxed">
                          {t.dashboard.recyclerTab.step2Desc}
                        </p>
                      </div>
                      <div className="bg-white/40 p-5 rounded-2xl border border-white/60">
                        <div className="flex items-center gap-2 mb-3">
                          <Layout size={14} className="text-black" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-black">{t.dashboard.recyclerTab.step3Title}</span>
                        </div>
                        <p className="text-[11px] text-black/60 font-medium leading-relaxed">
                          {t.dashboard.recyclerTab.step3Desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* History */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-tight">{t.dashboard.recyclerTab.history}</h3>
                <History size={16} className="text-brand-text-muted" />
              </div>
              <div className="space-y-2">
                {recyclerHistory.map(item => (
                  <div key={item.id} className="glass-card p-4 flex items-center justify-between hover:border-brand-orange/30 transition-all group">
                    <div className="flex items-center gap-3">
                      <Eye size={16} className="text-brand-text-muted" />
                      <p className="text-xs text-brand-text-muted truncate max-w-[300px] md:max-w-md">{item.url} — {item.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Download size={16} className="text-brand-text-muted cursor-pointer hover:text-brand-text" />
                      <Trash2 size={16} className="text-brand-text-muted cursor-pointer hover:text-red-500" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recycler Form */}
            <section className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-brand-text-muted uppercase tracking-widest">{t.dashboard.recyclerTab.urlLabel}</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder={t.dashboard.recyclerTab.urlPlaceholder}
                  value={recyclerUrl}
                  onChange={(e) => setRecyclerUrl(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-black text-brand-text-muted uppercase tracking-widest">{t.dashboard.recyclerTab.slideCount}</label>
                  <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl">
                    {[5, 8, 10].map((count) => (
                      <button
                        key={count}
                        onClick={() => setSlideCount(count as any)}
                        className={cn(
                          "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          slideCount === count 
                            ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/20" 
                            : "text-brand-text-muted hover:text-white hover:bg-white/5"
                        )}
                      >
                        {count} {language === 'pt' ? 'slides' : 'slides'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-brand-text-muted uppercase tracking-widest">{t.dashboard.recyclerTab.styleLabel}</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'Educacional', label: t.dashboard.recyclerTab.styles.educational },
                      { id: 'Provocativo', label: t.dashboard.recyclerTab.styles.provocative },
                      { id: 'Storytelling', label: t.dashboard.recyclerTab.styles.storytelling },
                      { id: 'Data-driven', label: t.dashboard.recyclerTab.styles.dataDriven }
                    ].map(({ id, label }) => (
                      <button
                        key={id}
                        onClick={() => setRecyclerStyle(id as any)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                          recyclerStyle === id 
                            ? "bg-brand-orange/10 text-brand-orange border-brand-orange/30" 
                            : "bg-white/5 text-brand-text-muted border-white/10 hover:border-brand-text-muted"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                className="btn-primary"
              >
                <RefreshCw size={18} />
                {t.dashboard.recyclerTab.generate}
              </button>
            </section>
          </motion.div>
        );

      case 'Watch':
        return (
          <motion.div 
            key="watch"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-12"
          >
            {/* How it works section */}
            <section className="bg-brand-card-accent rounded-[32px] overflow-hidden border border-black/5">
              <div 
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-black/5 transition-all"
                onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-brand-orange p-2.5 rounded-xl">
                    <Eye size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-black">{t.dashboard.watchTab.title}</h3>
                    <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">{t.dashboard.watchTab.subtitle}</p>
                  </div>
                </div>
                {isHowItWorksOpen ? <ChevronUp size={18} className="text-black" /> : <ChevronDown size={18} className="text-black" />}
              </div>
              
              <AnimatePresence>
                {isHowItWorksOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <div className="bg-white/40 p-5 rounded-2xl border border-white/60">
                        <div className="flex items-center gap-2 mb-3">
                          <Globe size={14} className="text-black" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-black">1. {language === 'pt' ? 'Domínios' : 'Domains'}</span>
                        </div>
                        <p className="text-[11px] text-black/60 font-medium leading-relaxed">
                          {language === 'pt' ? 'Informe os sites dos concorrentes que deseja monitorar.' : 'Enter the competitor sites you want to monitor.'}
                        </p>
                      </div>
                      <div className="bg-white/40 p-5 rounded-2xl border border-white/60">
                        <div className="flex items-center gap-2 mb-3">
                          <RefreshCw size={14} className="text-black" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-black">2. {language === 'pt' ? 'Escanear' : 'Scan'}</span>
                        </div>
                        <p className="text-[11px] text-black/60 font-medium leading-relaxed">
                          {language === 'pt' ? 'O Firecrawl Map varre o site e compara com o último scan.' : 'Firecrawl Map crawls the site and compares it with the last scan.'}
                        </p>
                      </div>
                      <div className="bg-white/40 p-5 rounded-2xl border border-white/60">
                        <div className="flex items-center gap-2 mb-3">
                          <Bell size={14} className="text-black" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-black">3. {language === 'pt' ? 'Alertas' : 'Alerts'}</span>
                        </div>
                        <p className="text-[11px] text-black/60 font-medium leading-relaxed">
                          {language === 'pt' ? 'Receba notificações de novas URLs detectadas com preview.' : 'Receive notifications of new URLs detected with preview.'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* History */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-tight">{language === 'pt' ? 'Histórico de monitoramento' : 'Monitoring history'}</h3>
                <History size={16} className="text-brand-text-muted" />
              </div>
              <div className="space-y-2">
                {watchHistory.map(item => (
                  <div key={item.id} className="glass-card p-4 flex items-center justify-between hover:border-brand-orange/30 transition-all group">
                    <div className="flex items-center gap-3">
                      <Eye size={16} className="text-brand-text-muted" />
                      <p className="text-xs text-brand-text-muted">{item.domains} {language === 'pt' ? 'domínio(s)' : 'domain(s)'} — {item.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Download size={16} className="text-brand-text-muted cursor-pointer hover:text-brand-text" />
                      <Trash2 size={16} className="text-brand-text-muted cursor-pointer hover:text-red-500" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Watch Form */}
            <section className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-black text-brand-text-muted uppercase tracking-widest">{t.dashboard.watchTab.addDomain}</label>
                <form onSubmit={handleAddWatchDomain} className="flex gap-2">
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder={language === 'pt' ? 'concorrente.com.br' : 'competitor.com'}
                    value={watchDomainInput}
                    onChange={(e) => setWatchDomainInput(e.target.value)}
                  />
                  <button type="submit" className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-all">
                    <Plus size={20} />
                  </button>
                </form>
                <div className="flex flex-wrap gap-2">
                  {watchDomains.map(domain => (
                    <span key={domain} className="tag">
                      {domain}
                      <X size={12} className="cursor-pointer hover:text-white" onClick={() => removeWatchDomain(domain)} />
                    </span>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleScanWatch}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Eye size={18} />}
                {language === 'pt' ? 'Escanear Todos' : 'Scan All'}
              </button>
            </section>

            {/* Watch Results - Sitemap Changes */}
            <AnimatePresence>
              {watchResults && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8 pt-12 border-t border-white/5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-brand-orange/10 p-2.5 rounded-xl">
                        <Bell size={20} className="text-brand-orange" />
                      </div>
                      <h2 className="text-xl font-black uppercase tracking-tight">{t.dashboard.watchTab.newContent}</h2>
                    </div>
                    <div className="bg-brand-orange/10 px-4 py-1.5 rounded-full border border-brand-orange/20">
                      <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest">{t.dashboard.watchTab.activeAlerts}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    {watchResults.map((result, i) => (
                      <div key={i} className="bg-brand-card-accent rounded-[40px] overflow-hidden border border-black/5">
                        <div className="bg-black/5 p-6 border-b border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-center gap-4">
                            <div className="bg-white p-3 rounded-2xl shadow-sm">
                              <Globe size={20} className="text-brand-orange" />
                            </div>
                            <div>
                              <span className="text-sm font-black text-black uppercase tracking-tight block">{result.domain}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <Link2 size={12} className="text-black/40" />
                                <span className="text-[10px] text-black/40 font-bold truncate max-w-[200px]">{result.sitemapUrl}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-8">
                            <div className="text-right">
                              <span className="text-[10px] text-black/40 uppercase font-black tracking-widest block">{t.dashboard.watchTab.lastScan}</span>
                              <span className="text-xs font-bold text-black">{result.lastModified}</span>
                            </div>
                            <div className="h-8 w-px bg-black/5 hidden md:block" />
                            <div className="text-right">
                              <span className="text-[10px] text-black/40 uppercase font-black tracking-widest block">{t.dashboard.watchTab.totalUrls}</span>
                              <span className="text-xs font-bold text-black">{result.totalUrls}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-8 space-y-6">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] text-black/40 uppercase font-black tracking-widest">{t.dashboard.watchTab.recentlyAdded}</p>
                            <span className="bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                              {result.newUrls.length} {t.dashboard.watchTab.newCount}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4">
                            {result.newUrls.map((item, j) => (
                              <div key={j} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white/40 rounded-3xl border border-white/60 hover:border-brand-orange/30 transition-all group gap-4">
                                <div className="flex items-start gap-4">
                                  <div className="mt-1 bg-white p-2 rounded-xl shadow-sm">
                                    <FileText size={16} className="text-brand-orange" />
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-sm font-black text-black uppercase tracking-tight block group-hover:text-brand-orange transition-colors">{item.title}</span>
                                    <span className="text-[10px] text-black/40 font-bold truncate block">{item.url}</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-6">
                                  <span className="text-[10px] text-black/40 font-black uppercase tracking-widest">{item.date}</span>
                                  <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-white rounded-xl text-black/40 hover:text-black transition-all shadow-sm">
                                      <Eye size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-white rounded-xl text-black/40 hover:text-black transition-all shadow-sm">
                                      <RefreshCw size={16} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="pt-4">
                            <button className="text-[10px] font-black uppercase tracking-widest text-brand-orange hover:underline flex items-center gap-2">
                              <Download size={14} />
                              {t.dashboard.watchTab.exportCsv}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );

      case 'SEO':
        return (
          <motion.div 
            key="seo"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-12"
          >
            {/* How it works section */}
            <section className="bg-brand-card-accent rounded-[32px] overflow-hidden border border-black/5">
              <div 
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-black/5 transition-all"
                onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-brand-orange p-2.5 rounded-xl">
                    <Search size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-black">SEO Intelligence</h3>
                    <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Análise técnica e estratégica de URLs</p>
                  </div>
                </div>
                {isHowItWorksOpen ? <ChevronUp size={18} className="text-black" /> : <ChevronDown size={18} className="text-black" />}
              </div>
              
              <AnimatePresence>
                {isHowItWorksOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <div className="bg-white/40 p-5 rounded-2xl border border-white/60">
                        <div className="flex items-center gap-2 mb-3">
                          <Link2 size={14} className="text-black" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-black">1. URL</span>
                        </div>
                        <p className="text-[11px] text-black/60 font-medium leading-relaxed">
                          Insira a URL que deseja analisar profundamente.
                        </p>
                      </div>
                      <div className="bg-white/40 p-5 rounded-2xl border border-white/60">
                        <div className="flex items-center gap-2 mb-3">
                          <Zap size={14} className="text-black" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-black">2. Auditoria</span>
                        </div>
                        <p className="text-[11px] text-black/60 font-medium leading-relaxed">
                          O sistema analisa Core Web Vitals, Meta Tags e Conteúdo.
                        </p>
                      </div>
                      <div className="bg-white/40 p-5 rounded-2xl border border-white/60">
                        <div className="flex items-center gap-2 mb-3">
                          <BarChart3 size={14} className="text-black" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-black">3. Insights</span>
                        </div>
                        <p className="text-[11px] text-black/60 font-medium leading-relaxed">
                          Receba recomendações práticas para subir no ranking.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* History */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-tight">Análises Recentes</h3>
                <History size={16} className="text-brand-text-muted" />
              </div>
              <div className="space-y-2">
                {seoHistory.map(item => (
                  <div key={item.id} className="glass-card p-4 flex items-center justify-between hover:border-brand-orange/30 transition-all group">
                    <div className="flex items-center gap-3">
                      <Search size={16} className="text-brand-text-muted" />
                      <p className="text-xs text-brand-text-muted truncate max-w-[300px]">{item.url} — {item.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Download size={16} className="text-brand-text-muted cursor-pointer hover:text-brand-text" />
                      <Trash2 size={16} className="text-brand-text-muted cursor-pointer hover:text-red-500" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SEO Form */}
            <section className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-black text-brand-text-muted uppercase tracking-widest">URL para auditoria</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="https://seusite.com.br/pagina-importante"
                    value={seoUrl}
                    onChange={(e) => setSeoUrl(e.target.value)}
                  />
                </div>
              </div>

              <button 
                onClick={handleAnalyzeSEO}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                Analisar SEO
              </button>
            </section>

            {/* SEO Results */}
            <AnimatePresence>
              {seoResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* SEO Results Overview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-3 border-brand-orange/30 bg-brand-orange/5 rounded-[40px] group hover:scale-[1.02] transition-all">
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange">Quality Score</span>
                      <div className="text-5xl font-black text-brand-orange tracking-tighter italic">
                        {seoResult.qualityScore}<span className="text-xl opacity-50">/100</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="bg-brand-orange h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,77,0,0.5)]" 
                          style={{ width: `${seoResult.qualityScore}%` }}
                        />
                      </div>
                    </div>
                    <div className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-3 border-white/10 rounded-[40px] group hover:scale-[1.02] transition-all">
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted">Page Speed</span>
                      <div className="text-5xl font-black text-white tracking-tighter italic">
                        {seoResult.pageSpeed.score}<span className="text-xl opacity-50">/100</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="bg-green-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
                          style={{ width: `${seoResult.pageSpeed.score}%` }}
                        />
                      </div>
                    </div>
                    <div className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-3 border-white/10 rounded-[40px] group hover:scale-[1.02] transition-all">
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted">E-E-A-T Score</span>
                      <div className="text-5xl font-black text-white tracking-tighter italic">
                        {seoResult.eeat.overallScore}<span className="text-xl opacity-50">/10</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="bg-blue-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                          style={{ width: `${seoResult.eeat.overallScore * 10}%` }}
                        />
                      </div>
                    </div>
                    <div className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-3 border-white/10 rounded-[40px] group hover:scale-[1.02] transition-all">
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted">Word Count</span>
                      <div className="text-5xl font-black text-white tracking-tighter italic">
                        {seoResult.wordCount}
                      </div>
                      <span className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Palavras Detectadas</span>
                    </div>
                  </div>

                  {/* Detailed Analysis Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* On-Page & Meta Data */}
                    <ResultCard title="On-Page & Meta Data" icon={<Search size={18} />}>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Headings Structure</p>
                          <div className="space-y-2 max-h-[150px] overflow-y-auto no-scrollbar pr-1">
                            {seoResult.headings.map((h, i) => (
                              <div key={i} className="flex gap-3 items-start p-2 bg-white/5 rounded-xl border border-white/5">
                                <span className="text-[9px] bg-brand-orange text-black px-2 py-0.5 rounded-full font-black shrink-0">{h.level}</span>
                                <span className="text-[11px] text-brand-text leading-tight">{h.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Meta Tags</p>
                          <div className="space-y-3">
                            {seoResult.metaTags.map((tag, i) => (
                              <div key={i} className="space-y-1 p-2 bg-white/5 rounded-xl border border-white/5">
                                <span className="text-[9px] text-brand-orange font-black uppercase tracking-wider">{tag.name}</span>
                                <p className="text-[11px] text-brand-text-muted leading-relaxed line-clamp-2">{tag.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </ResultCard>

                    {/* E-E-A-T Analysis */}
                    <ResultCard title="E-E-A-T Assessment" icon={<Shield size={18} />}>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'Experience', val: seoResult.eeat.experience },
                            { label: 'Expertise', val: seoResult.eeat.expertise },
                            { label: 'Authority', val: seoResult.eeat.authoritativeness },
                            { label: 'Trust', val: seoResult.eeat.trustworthiness }
                          ].map((item, idx) => (
                            <div key={idx} className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                              <span className="text-[9px] font-black text-brand-text-muted uppercase tracking-widest">{item.label}</span>
                              <p className="text-[10px] text-brand-text leading-tight font-medium">{item.val}</p>
                            </div>
                          ))}
                        </div>
                        <div className="p-4 bg-brand-orange/10 border border-brand-orange/20 rounded-2xl">
                          <p className="text-[11px] text-brand-orange italic leading-relaxed font-medium">
                            "A análise de E-E-A-T sugere que esta página possui {seoResult.eeat.overallScore >= 8 ? 'alta' : 'média'} credibilidade perante os algoritmos do Google."
                          </p>
                        </div>
                      </div>
                    </ResultCard>

                    {/* Structured Data */}
                    <ResultCard title="Structured Data (Schema)" icon={<FileText size={18} />}>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Existentes</p>
                          <div className="flex flex-wrap gap-2">
                            {seoResult.structuredData.existing.map((s, i) => (
                              <span key={i} className="text-[10px] bg-green-500/10 text-green-500 px-3 py-1 rounded-full border border-green-500/20 font-bold">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <p className="text-[10px] font-black text-brand-orange uppercase tracking-widest">Recomendados</p>
                          <div className="flex flex-wrap gap-2">
                            {seoResult.structuredData.toImplement.map((s, i) => (
                              <span key={i} className="text-[10px] bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-full border border-brand-orange/20 font-bold">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </ResultCard>

                    {/* GEO Parameters */}
                    <ResultCard title="GEO Parameters (LLM Optimization)" icon={<Zap size={18} />}>
                      <div className="space-y-3">
                        {seoResult.geoParameters.map((geo, i) => (
                          <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-brand-orange uppercase tracking-tighter">{geo.parameter}</span>
                              <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{geo.status}</span>
                            </div>
                            <p className="text-[11px] text-brand-text-muted leading-relaxed">{geo.recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </ResultCard>

                    {/* Page Speed Metrics */}
                    <ResultCard title="Page Speed Metrics" icon={<TrendingUp size={18} />}>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          {seoResult.pageSpeed.metrics.map((m, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]",
                                  m.status === 'good' ? "bg-green-500 shadow-green-500/50" : m.status === 'regular' ? "bg-yellow-500 shadow-yellow-500/50" : "bg-red-500 shadow-red-500/50"
                                )} />
                                <span className="text-xs font-black uppercase tracking-tight">{m.name}</span>
                              </div>
                              <span className="text-xs font-mono font-bold text-brand-text-muted">{m.value}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-brand-text-muted text-center italic font-medium">
                          Métricas simuladas com base na estrutura e peso do conteúdo detectado.
                        </p>
                      </div>
                    </ResultCard>

                    {/* Improvements Checklist */}
                    <ResultCard title="Checklist de Melhorias" icon={<Check size={18} />}>
                      <div className="space-y-3">
                        {seoResult.checklist.map((item, i) => (
                          <div key={i} className="flex items-start gap-4 p-3 bg-white/5 rounded-2xl border border-white/5">
                            <div className={cn(
                              "mt-0.5 p-1.5 rounded-full shrink-0",
                              item.status === 'good' ? "bg-green-500/20 text-green-500" : 
                              item.status === 'regular' ? "bg-yellow-500/20 text-yellow-500" : 
                              "bg-red-500/20 text-red-500"
                            )}>
                              {item.status === 'good' ? <Check size={14} /> : item.status === 'regular' ? <Info size={14} /> : <X size={14} />}
                            </div>
                            <div className="space-y-1">
                              <span className="text-[11px] font-black uppercase tracking-tight block">{item.criterion}</span>
                              <p className="text-[10px] text-brand-text-muted leading-tight font-medium">{item.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ResultCard>
                  </div>

                  {/* Implementation Plan */}
                  <div className="glass-card p-8 space-y-6 border-brand-orange/30">
                    <div className="flex items-center gap-4">
                      <div className="bg-brand-orange/20 p-3 rounded-2xl">
                        <Lightbulb size={24} className="text-brand-orange" />
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-tighter italic">Plano de Ação Imediato</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {seoResult.improvements.map((imp, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-brand-orange/30 transition-colors group">
                          <span className="text-brand-orange font-black text-sm group-hover:scale-110 transition-transform">0{i + 1}</span>
                          <p className="text-xs text-brand-text leading-relaxed font-medium">{imp}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );

      case 'Keywords':
        return (
          <motion.div 
            key="keywords"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-8"
          >
            {/* How it works section */}
            <section className="glass-card overflow-hidden border-white/10">
              <div 
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all"
                onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-brand-orange/20 p-3 rounded-2xl">
                    <Key size={20} className="text-brand-orange" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tighter italic">Keyword Explorer</h3>
                    <p className="text-xs text-brand-text-muted font-medium">Encontre as palavras-chave que seus concorrentes estão ranqueando e você não</p>
                  </div>
                </div>
                <div className="bg-white/5 p-2 rounded-full">
                  {isHowItWorksOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              
              <AnimatePresence>
                {isHowItWorksOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <div className="step-card bg-white/5 border-white/10 p-4 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-blue-500/20 p-2 rounded-xl">
                            <Globe size={16} className="text-blue-500" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest">1. Domínio Alvo</span>
                        </div>
                        <p className="text-[11px] text-brand-text-muted leading-relaxed font-medium">
                          Utilizamos o domínio definido na aba Pesquisa como base para a análise.
                        </p>
                      </div>
                      <div className="step-card bg-white/5 border-white/10 p-4 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-purple-500/20 p-2 rounded-xl">
                            <Shield size={16} className="text-purple-500" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest">2. Concorrentes</span>
                        </div>
                        <p className="text-[11px] text-brand-text-muted leading-relaxed font-medium">
                          Comparamos com as URLs adicionadas na aba Brands para encontrar gaps.
                        </p>
                      </div>
                      <div className="step-card bg-white/5 border-white/10 p-4 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-green-500/20 p-2 rounded-xl">
                            <Key size={16} className="text-green-500" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest">3. Keyword Gap</span>
                        </div>
                        <p className="text-[11px] text-brand-text-muted leading-relaxed font-medium">
                          A IA identifica termos valiosos que seus concorrentes dominam e você não.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* History */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/5 p-2 rounded-lg">
                  <History size={16} className="text-brand-text-muted" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest italic">Histórico de buscas</h3>
                <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] text-brand-text-muted font-black uppercase tracking-widest border border-white/5">1/5</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {keywordHistory.map(item => (
                  <div key={item.id} className="glass-card p-5 flex items-center justify-between hover:border-brand-orange/30 transition-all group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="bg-brand-orange/10 p-2.5 rounded-xl group-hover:bg-brand-orange/20 transition-colors">
                        <Key size={18} className="text-brand-orange" />
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase tracking-tighter">{item.domain}</p>
                        <p className="text-[10px] text-brand-text-muted font-bold uppercase tracking-widest">{item.date} · {item.count} keywords</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group/btn">
                      <Trash2 size={16} className="text-brand-text-muted group-hover/btn:text-red-500 transition-colors" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Keyword Form */}
            <section className="glass-card p-8 space-y-8 border-brand-orange/20">
              <div className="flex items-center gap-4">
                <div className="bg-brand-orange/20 p-3 rounded-2xl">
                  <Key size={24} className="text-brand-orange" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter italic">Keyword Explorer — Análise de Keyword Gap</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Domínio Alvo</label>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-sm font-black uppercase tracking-tight">
                    {targetDomain}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Concorrentes (de Brands)</label>
                  <div className="flex flex-wrap gap-2">
                    {brandUrls.map(url => (
                      <span key={url} className="tag bg-white/5 border-white/10 text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest">{url}</span>
                    ))}
                    {brandUrls.length === 0 && <span className="text-[10px] text-brand-text-muted italic font-medium">Nenhum concorrente adicionado</span>}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleFetchKeywords}
                disabled={loading || brandUrls.length === 0}
                className="btn-primary w-full py-5 text-lg font-black uppercase tracking-widest italic group"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <Search size={24} className="group-hover:scale-110 transition-transform" />}
                Explorar Keywords
              </button>
            </section>

            {/* Keyword Results */}
            <AnimatePresence>
              {keywordResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8 pt-8 border-t border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">Keyword Gap Analysis</h2>
                    <div className="flex items-center gap-4">
                      <button className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted hover:text-brand-orange flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5 transition-all">
                        <Download size={14} />
                        Exportar CSV
                      </button>
                    </div>
                  </div>

                  <div className="glass-card overflow-hidden border-white/10 rounded-[32px]">
                    <div className="overflow-x-auto no-scrollbar">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white/5 border-b border-white/10">
                            <th className="p-6 text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Keyword</th>
                            <th className="p-6 text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Volume</th>
                            <th className="p-6 text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Dificuldade</th>
                            <th className="p-6 text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Intenção</th>
                            <th className="p-6 text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Concorrentes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {keywordResult.keywords.map((k, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors group">
                              <td className="p-6">
                                <span className="text-sm font-black text-brand-orange uppercase tracking-tight">{k.term}</span>
                              </td>
                              <td className="p-6">
                                <span className="text-xs font-bold text-brand-text-muted uppercase tracking-widest">{k.volume}</span>
                              </td>
                              <td className="p-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-16 bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                      className={cn(
                                        "h-full transition-all duration-1000",
                                        k.difficulty < 30 ? "bg-green-500" : k.difficulty < 60 ? "bg-yellow-500" : "bg-red-500"
                                      )} 
                                      style={{ width: `${k.difficulty}%` }} 
                                    />
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-widest">{k.difficulty}</span>
                                </div>
                              </td>
                              <td className="p-6">
                                <span className={cn(
                                  "text-[9px] px-3 py-1 rounded-full border font-black uppercase tracking-widest",
                                  k.intent === 'Informativo' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                  k.intent === 'Transacional' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                  k.intent === 'Navegacional' ? "bg-purple-500/10 text-purple-500 border-purple-500/20" :
                                  "bg-brand-orange/10 text-brand-orange border-brand-orange/20"
                                )}>
                                  {k.intent}
                                </span>
                              </td>
                              <td className="p-6">
                                <div className="flex flex-wrap gap-2">
                                  {k.competitors.map((c, j) => (
                                    <span key={j} className="text-[9px] text-brand-text-muted bg-white/5 px-2 py-1 rounded-lg border border-white/5 font-bold uppercase tracking-tight">
                                      {c}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ResultCard title="Oportunidades Estratégicas" icon={<Lightbulb size={18} />}>
                      <ul className="space-y-4">
                        {keywordResult.opportunities.map((opp, i) => (
                          <li key={i} className="flex items-start gap-4 text-xs text-brand-text-muted leading-relaxed font-medium">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0 shadow-[0_0_8px_rgba(255,77,0,0.5)]" />
                            {opp}
                          </li>
                        ))}
                      </ul>
                    </ResultCard>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );

      case 'Gaps':
        return (
          <motion.div 
            key="gaps"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-8"
          >
            <section className="glass-card p-6 space-y-6">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-brand-orange" />
                <h3 className="text-sm font-black uppercase tracking-tight">Content Gap Analysis</h3>
              </div>
              <p className="text-xs text-brand-text-muted">Compare seu domínio com os concorrentes para encontrar lacunas estratégicas.</p>
              
              <button 
                onClick={handleAnalyzeGaps}
                disabled={loading || brandUrls.length === 0}
                className="btn-primary w-full py-4"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Target size={20} />}
                Analisar Gaps
              </button>
            </section>

            <AnimatePresence>
              {gapResult && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="glass-card p-6">
                  <h4 className="text-sm font-black uppercase tracking-tight mb-4">Resumo Estratégico</h4>
                  <p className="text-xs text-brand-text-muted leading-relaxed font-medium">{gapResult.summary}</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {gapResult.gaps.map((gap, i) => (
                    <div key={i} className="glass-card p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-brand-orange">{gap.topic}</span>
                        <p className="text-[11px] text-brand-text-muted">{gap.opportunity}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[10px] text-brand-text-muted uppercase font-bold">Força Concorrente</p>
                          <span className={cn(
                            "text-[10px] font-bold",
                            gap.competitorStrength === 'High' ? "text-red-500" : gap.competitorStrength === 'Medium' ? "text-yellow-500" : "text-green-500"
                          )}>{gap.competitorStrength}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-brand-text-muted uppercase font-bold">Prioridade</p>
                          <span className={cn(
                            "text-[10px] font-bold",
                            gap.priority === 'High' ? "text-red-500" : gap.priority === 'Medium' ? "text-yellow-500" : "text-green-500"
                          )}>{gap.priority}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      );

      case 'Recs':
        return (
          <motion.div 
            key="recs"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-8"
          >
            <section className="glass-card p-6 space-y-6">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-brand-orange" />
                <h3 className="text-sm font-black uppercase tracking-tight">AI Content Recommendations</h3>
              </div>
              <p className="text-xs text-brand-text-muted">Recomendações baseadas em dados para impulsionar seu tráfego.</p>
              
              <button 
                onClick={handleGenerateRecs}
                disabled={loading}
                className="btn-primary w-full py-4"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                Gerar Recomendações
              </button>
            </section>

            <AnimatePresence>
              {recResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                {recResult.recommendations.map((rec, i) => (
                  <div key={i} className="glass-card p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase",
                        rec.type === 'Novo Conteúdo' ? "bg-blue-950/20 text-blue-500 border-blue-500/30" :
                        rec.type === 'Otimização' ? "bg-yellow-950/20 text-yellow-500 border-yellow-500/30" :
                        "bg-green-950/20 text-green-500 border-green-500/30"
                      )}>
                        {rec.type}
                      </span>
                      <span className="text-[10px] font-bold text-brand-orange">{rec.expectedImpact}</span>
                    </div>
                    <h4 className="text-xs font-bold">{rec.title}</h4>
                    <p className="text-[11px] text-brand-text-muted leading-relaxed">{rec.reason}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      );

      case 'Editorial':
        return (
          <motion.div 
            key="editorial"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-8"
          >
            <section className="glass-card p-6 space-y-6">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-brand-orange" />
                <h3 className="text-sm font-black uppercase tracking-tight">Plano Editorial Inteligente</h3>
              </div>
              <p className="text-xs text-brand-text-muted">Transforme insights em um cronograma de execução de 4 semanas.</p>
              
              <button 
                onClick={handlePlanEditorial}
                disabled={loading}
                className="btn-primary w-full py-4"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Calendar size={20} />}
                Gerar Plano Editorial
              </button>
            </section>

            <AnimatePresence>
              {editorialResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                {editorialResult.calendar.map((week, i) => (
                  <div key={i} className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-widest text-brand-text-muted px-2 border-l-2 border-brand-orange">{week.week}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {week.topics.map((topic, j) => (
                        <div key={j} className="glass-card p-4 flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-xs font-bold">{topic.title}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-brand-text-muted">{topic.format}</span>
                              <span className="text-[10px] text-brand-text-muted">·</span>
                              <span className="text-[10px] text-brand-text-muted">{topic.channel}</span>
                            </div>
                          </div>
                          <span className={cn(
                            "text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase",
                            topic.status === 'Planejado' ? "bg-blue-950/20 text-blue-500 border-blue-500/30" :
                            topic.status === 'Em Produção' ? "bg-yellow-950/20 text-yellow-500 border-yellow-500/30" :
                            "bg-green-950/20 text-green-500 border-green-500/30"
                          )}>
                            {topic.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      );
    }
  };

  return (
    <AnimatePresence mode="wait">
      {showLanding ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LandingPage onEnter={() => setShowLanding(false)} language={language} setLanguage={setLanguage} />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-brand-bg text-brand-text pb-20 overflow-x-hidden"
        >
          {/* Header - Minimalist Pill Style */}
          <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-6">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full h-14 flex items-center justify-between px-6">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowLanding(true)}>
                <Asterisk size={20} className="text-brand-orange" />
                <span className="font-black text-sm uppercase tracking-widest">Network Hub</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 mr-4 border-r border-white/10 pr-4">
                  <button 
                    onClick={() => setLanguage('en')}
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest transition-colors",
                      language === 'en' ? "text-brand-orange" : "text-brand-text-muted hover:text-white"
                    )}
                  >
                    EN
                  </button>
                  <button 
                    onClick={() => setLanguage('pt')}
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest transition-colors",
                      language === 'pt' ? "text-brand-orange" : "text-brand-text-muted hover:text-white"
                    )}
                  >
                    PT
                  </button>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <img 
                      key={i}
                      src={`https://picsum.photos/seed/user${i}/100/100`} 
                      className="w-6 h-6 rounded-full border-2 border-brand-bg"
                      alt="User"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <div className="h-4 w-px bg-white/10" />
                <button className="p-2 hover:bg-white/5 rounded-full transition-colors relative">
                  <Bell size={18} className="text-brand-text-muted" />
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-orange rounded-full" />
                </button>
                <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center font-black text-[10px] uppercase">
                  FL
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-5xl mx-auto px-6 pt-32 space-y-12">
            {/* Navigation Tabs - Pill Style */}
            <nav className="flex flex-wrap gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl overflow-x-auto no-scrollbar">
              {tabs.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                    activeTab === id 
                      ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/20" 
                      : "text-brand-text-muted hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </nav>

            {/* Main Content Area */}
            <div className="space-y-12">
              <AnimatePresence mode="wait">
                {renderTabContent()}
              </AnimatePresence>

              {/* Results Area */}
              {activeTab === 'Pesquisa' && (
                <AnimatePresence>
                  {result && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-12 pt-12 border-t border-white/5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold text-brand-text-muted">03</span>
                          <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                            <span className="text-[10px] uppercase font-black tracking-widest">Resultados</span>
                            <Asterisk size={12} className="text-brand-orange" />
                            <span className="text-[10px] uppercase font-black tracking-widest">Análise</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <button onClick={copyToClipboard} className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted hover:text-brand-orange flex items-center gap-2">
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copiado' : 'JSON'}
                          </button>
                          <button className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted hover:text-brand-orange flex items-center gap-2">
                            <Download size={14} />
                            PDF
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ResultCard title="Content Landscape" icon={<LayoutGrid size={18} />}>
                          <div className="space-y-6">
                            {result.landscape.map((item, i) => (
                              <div key={i} className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange">{item.site}</p>
                                <div className="flex flex-wrap gap-2">
                                  {item.themes.map((theme, j) => (
                                    <span key={j} className="text-[10px] font-bold bg-black/5 px-3 py-1 rounded-full border border-black/10 text-black/60">
                                      {theme}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </ResultCard>

                        <ResultCard title="Gap Opportunities" icon={<Search size={18} />}>
                          <ul className="space-y-4">
                            {result.gaps.map((gap, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-black/60 font-medium leading-relaxed">
                                <Asterisk size={14} className="text-brand-orange shrink-0 mt-1" />
                                {gap}
                              </li>
                            ))}
                          </ul>
                        </ResultCard>

                        <ResultCard title="Content Ideas" icon={<Lightbulb size={18} />}>
                          <div className="space-y-4">
                            {result.ideas.map((idea, i) => (
                              <div key={i} className="p-5 rounded-3xl bg-white/40 border border-white/60 space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-black text-black uppercase tracking-tight">{idea.title}</h4>
                                  <span className="text-[9px] uppercase font-black tracking-widest text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-full">{idea.format}</span>
                                </div>
                                <p className="text-xs text-black/60 font-medium leading-relaxed">{idea.description}</p>
                              </div>
                            ))}
                          </div>
                        </ResultCard>

                        <ResultCard title="Strategic Insights" icon={<TrendingUp size={18} />}>
                          <div className="space-y-6">
                            {result.insights.map((insight, i) => (
                              <div key={i} className="flex gap-4">
                                <Zap size={16} className="text-brand-orange shrink-0 mt-0.5" />
                                <p className="text-sm text-black/60 font-medium leading-relaxed">{insight}</p>
                              </div>
                            ))}
                          </div>
                        </ResultCard>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </main>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

function ResultCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-brand-card-accent rounded-[40px] p-8 space-y-8 border border-black/5">
      <div className="flex items-center gap-4">
        <div className="bg-brand-orange p-2.5 rounded-xl text-white">
          {icon}
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest text-black">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}
