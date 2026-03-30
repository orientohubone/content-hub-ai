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
  Asterisk,
  Sun,
  Moon,
  LogOut,
  Type
} from 'lucide-react';
import { 
  analyzeCompetitors, AnalysisResult, 
  fetchTrends, TrendResult, 
  analyzeSEO, SEOAuditResult, 
  fetchKeywords, KeywordResult,
  analyzeGaps, GapResult,
  generateRecs, RecResult,
  planEditorial, EditorialResult,
  analyzeBranding, BrandingResult, ai
} from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import LandingPage from './components/LandingPage';

import { translations, Language } from './translations';
import { scrapeUrl, mapDomain, extractStructured } from './services/firecrawlService';

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
  const [targetDomain, setTargetDomain] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [trendResult, setTrendResult] = useState<TrendResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  React.useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  React.useEffect(() => {
    setActionMessage(null);
  }, [activeTab]);

  // Trends Tab State
  const [trendPeriod, setTrendPeriod] = useState<'Última hora' | 'Hoje' | 'Semana' | 'Mês'>('Semana');
  const [trendQuery, setTrendQuery] = useState('');
  const [trendTags, setTrendTags] = useState<string[]>([]);
  const [brandUrls, setBrandUrls] = useState<string[]>([]);
  const [brandUrlInput, setBrandUrlInput] = useState('');

  // Recycler Tab State
  const [recyclerUrl, setRecyclerUrl] = useState('');
  const [slideCount, setSlideCount] = useState<5 | 8 | 10>(5);
  const [recyclerStyle, setRecyclerStyle] = useState<'Educacional' | 'Provocativo' | 'Storytelling' | 'Data-driven'>('Educacional');
  const [recyclerHistory, setRecyclerHistory] = useState<any[]>([]);

  // Watch Tab State
  const [watchDomains, setWatchDomains] = useState<string[]>([]);
  const [watchDomainInput, setWatchDomainInput] = useState('');
  const [watchHistory, setWatchHistory] = useState<any[]>([]);
  const [watchResults, setWatchResults] = useState<{ 
    domain: string; 
    sitemapUrl: string;
    lastModified: string;
    totalUrls: number;
    newUrls: { url: string; title: string; date: string }[] 
  }[] | null>(null);

  // SEO Tab State
  const [seoUrl, setSeoUrl] = useState('');
  const [seoResult, setSeoResult] = useState<SEOAuditResult | null>(null);
  const [seoHistory, setSeoHistory] = useState<any[]>([]);
  const [showAllSeoHeadings, setShowAllSeoHeadings] = useState(false);
  const [showAllSeoMetaTags, setShowAllSeoMetaTags] = useState(false);

  React.useEffect(() => {
    setShowAllSeoHeadings(false);
    setShowAllSeoMetaTags(false);
  }, [seoResult]);

  // Keywords Tab State
  const [keywordResult, setKeywordResult] = useState<KeywordResult | null>(null);
  const [keywordHistory, setKeywordHistory] = useState<any[]>([]);

  // Gaps Tab State
  const [gapResult, setGapResult] = useState<GapResult | null>(null);

  // Recs Tab State
  const [recResult, setRecResult] = useState<RecResult | null>(null);
  const [recsDomain, setRecsDomain] = useState('');

  // Editorial Tab State
  const [editorialResult, setEditorialResult] = useState<EditorialResult | null>(null);
  const [editorialDomain, setEditorialDomain] = useState('');
  const [editorialPeriod, setEditorialPeriod] = useState<2 | 4 | 8>(4);

  // Brand Intelligence State
  const [brandingResult, setBrandingResult] = useState<BrandingResult | null>(null);

  // Recycler Result State
  const [recyclerResult, setRecyclerResult] = useState<any | null>(null);

  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  const [trendHistory, setTrendHistory] = useState<any[]>([]);

  const normalizeSeoResult = (raw: any): SEOAuditResult => {
    const safe = raw && typeof raw === 'object' ? raw : {};
    const safePageSpeed = safe.pageSpeed && typeof safe.pageSpeed === 'object' ? safe.pageSpeed : {};
    const safeEeat = safe.eeat && typeof safe.eeat === 'object' ? safe.eeat : {};
    const safeStructured = safe.structuredData && typeof safe.structuredData === 'object' ? safe.structuredData : {};

    const clampScore = (value: any, max: number) => {
      const n = Number(value);
      if (!Number.isFinite(n)) return 0;
      return Math.max(0, Math.min(max, n));
    };

    return {
      url: typeof safe.url === 'string' ? safe.url : '',
      wordCount: Number.isFinite(Number(safe.wordCount)) ? Number(safe.wordCount) : 0,
      headings: Array.isArray(safe.headings) ? safe.headings : [],
      metaTags: Array.isArray(safe.metaTags) ? safe.metaTags : [],
      summary: typeof safe.summary === 'string' ? safe.summary : '',
      checklist: Array.isArray(safe.checklist) ? safe.checklist : [],
      improvements: Array.isArray(safe.improvements) ? safe.improvements : [],
      structuredData: {
        existing: Array.isArray(safeStructured.existing) ? safeStructured.existing : [],
        toImplement: Array.isArray(safeStructured.toImplement) ? safeStructured.toImplement : [],
      },
      pageSpeed: {
        score: clampScore(safePageSpeed.score, 100),
        metrics: Array.isArray(safePageSpeed.metrics) ? safePageSpeed.metrics : [],
      },
      qualityScore: clampScore(safe.qualityScore, 100),
      eeat: {
        experience: typeof safeEeat.experience === 'string' ? safeEeat.experience : '',
        expertise: typeof safeEeat.expertise === 'string' ? safeEeat.expertise : '',
        authoritativeness: typeof safeEeat.authoritativeness === 'string' ? safeEeat.authoritativeness : '',
        trustworthiness: typeof safeEeat.trustworthiness === 'string' ? safeEeat.trustworthiness : '',
        overallScore: clampScore(safeEeat.overallScore, 10),
      },
      geoParameters: Array.isArray(safe.geoParameters) ? safe.geoParameters : [],
    };
  };

  const hasMeaningfulSeoData = (data: SEOAuditResult | null): boolean => {
    if (!data) return false;
    return (
      data.wordCount > 0 ||
      (data.headings?.length || 0) > 0 ||
      (data.metaTags?.length || 0) > 0 ||
      (data.checklist?.length || 0) > 0 ||
      (data.improvements?.length || 0) > 0 ||
      (data.pageSpeed?.metrics?.length || 0) > 0 ||
      (data.structuredData?.existing?.length || 0) > 0 ||
      (data.structuredData?.toImplement?.length || 0) > 0 ||
      (data.geoParameters?.length || 0) > 0
    );
  };

  const normalizeKeywordResult = (raw: any): KeywordResult => {
    const safe = raw && typeof raw === 'object' ? raw : {};
    const keywords = Array.isArray(safe.keywords) ? safe.keywords : [];
    const opportunities = Array.isArray(safe.opportunities) ? safe.opportunities : [];

    const normalizedKeywords = keywords.map((k: any) => {
      const difficultyNum = Number(k?.difficulty);
      const normalizedDifficulty = Number.isFinite(difficultyNum) ? Math.max(0, Math.min(100, difficultyNum)) : 0;
      const allowedIntents = ['Informativo', 'Transacional', 'Navegacional', 'Comercial'] as const;
      const intent = allowedIntents.includes(k?.intent) ? k.intent : 'Informativo';
      return {
        term: typeof k?.term === 'string' ? k.term : '',
        volume: typeof k?.volume === 'string' ? k.volume : String(k?.volume ?? '-'),
        difficulty: normalizedDifficulty,
        intent,
        competitors: Array.isArray(k?.competitors) ? k.competitors.filter(Boolean) : [],
      };
    }).filter((k: any) => k.term);

    return {
      keywords: normalizedKeywords,
      opportunities: opportunities.filter((item: any) => typeof item === 'string' && item.trim().length > 0),
    };
  };

  const hasMeaningfulKeywordData = (data: KeywordResult | null): boolean => {
    if (!data) return false;
    return (data.keywords?.length || 0) > 0 || (data.opportunities?.length || 0) > 0;
  };

  const normalizeGapResult = (raw: any): GapResult => {
    const safe = raw && typeof raw === 'object' ? raw : {};
    const gaps = Array.isArray(safe.gaps) ? safe.gaps : [];
    const summary = typeof safe.summary === 'string' ? safe.summary : '';
    const allowed = ['High', 'Medium', 'Low'] as const;

    const normalizedGaps = gaps.map((g: any) => {
      const competitorStrength = allowed.includes(g?.competitorStrength) ? g.competitorStrength : 'Medium';
      const priority = allowed.includes(g?.priority) ? g.priority : 'Medium';
      return {
        topic: typeof g?.topic === 'string' ? g.topic : '',
        competitorStrength,
        opportunity: typeof g?.opportunity === 'string' ? g.opportunity : '',
        priority,
      };
    }).filter((g: any) => g.topic);

    return { gaps: normalizedGaps, summary };
  };

  const hasMeaningfulGapData = (data: GapResult | null): boolean => {
    if (!data) return false;
    return (data.gaps?.length || 0) > 0 || (data.summary?.trim().length || 0) > 0;
  };

  const analyzeGapsFallback = async (domain: string, competitors: string[]): Promise<GapResult> => {
    const targets = [domain, ...competitors].filter(Boolean).slice(0, 4);
    const scraped = await Promise.all(
      targets.map(async (url) => {
        try {
          const res = await scrapeUrl(url);
          return { url, content: res.data?.markdown || res.data?.content || "" };
        } catch {
          return { url, content: "" };
        }
      })
    );

    const prompt = `
      Você é um estrategista de conteúdo e SEO.
      Gere um CONTENT GAP ANALYSIS em JSON para:
      - Domínio principal: ${domain}
      - Concorrentes: ${competitors.join(", ")}

      Contexto coletado:
      ${scraped.map((s) => `URL: ${s.url}\nCONTEÚDO:\n${String(s.content).slice(0, 6000)}`).join("\n\n---\n\n")}

      Retorne SOMENTE JSON no formato:
      {
        "gaps": [
          {
            "topic": "string",
            "competitorStrength": "High|Medium|Low",
            "opportunity": "string",
            "priority": "High|Medium|Low"
          }
        ],
        "summary": "string"
      }

      Regras:
      - Retorne pelo menos 6 gaps quando possível.
      - opportunity precisa ser acionável (o que produzir + intenção + motivo).
    `;

    const response = await (ai as any).models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const text = String(response.text || "").replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(text);
    return normalizeGapResult(parsed);
  };

  const fetchKeywordsFallback = async (domain: string, competitors: string[]): Promise<KeywordResult> => {
    const targets = [domain, ...competitors].filter(Boolean).slice(0, 4);
    const scraped = await Promise.all(
      targets.map(async (url) => {
        try {
          const res = await scrapeUrl(url);
          return {
            url,
            content: res.data?.markdown || res.data?.content || ""
          };
        } catch {
          return { url, content: "" };
        }
      })
    );

    const prompt = `
      Você é um estrategista de SEO.
      Gere um KEYWORD GAP ANALYSIS em JSON para:
      - Domínio principal: ${domain}
      - Concorrentes: ${competitors.join(", ")}

      Contexto coletado:
      ${scraped.map((s) => `URL: ${s.url}\nCONTEÚDO:\n${String(s.content).slice(0, 6000)}`).join("\n\n---\n\n")}

      Retorne SOMENTE JSON no formato:
      {
        "keywords": [
          {
            "term": "string",
            "volume": "string",
            "difficulty": number,
            "intent": "Informativo|Transacional|Navegacional|Comercial",
            "competitors": ["string"]
          }
        ],
        "opportunities": ["string"]
      }

      Regras:
      - Retorne pelo menos 8 keywords quando possível.
      - difficulty entre 0 e 100.
      - Evite campos vazios.
    `;

    const response = await (ai as any).models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const text = String(response.text || "").replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(text);
    return normalizeKeywordResult(parsed);
  };

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


  // Persistence logic: Versioning the keys to avoid crashes with old data structures
  React.useEffect(() => {
    const data = localStorage.getItem('hub_persistent_state_v2');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed.brandUrls)) setBrandUrls(parsed.brandUrls);
        if (Array.isArray(parsed.watchDomains)) setWatchDomains(parsed.watchDomains);
        if (Array.isArray(parsed.savedSearches)) setSavedSearches(parsed.savedSearches);
        if (parsed.seoResult && typeof parsed.seoResult === 'object') setSeoResult(normalizeSeoResult(parsed.seoResult));
        if (parsed.keywordResult && typeof parsed.keywordResult === 'object') setKeywordResult(parsed.keywordResult);
        if (parsed.trendResult && typeof parsed.trendResult === 'object') setTrendResult(parsed.trendResult);
        if (parsed.brandingResult && typeof parsed.brandingResult === 'object') setBrandingResult(parsed.brandingResult);
        if (parsed.recyclerResult && typeof parsed.recyclerResult === 'object') setRecyclerResult(parsed.recyclerResult);
        if (parsed.result && typeof parsed.result === 'object') setResult(parsed.result);
      } catch (e) {
        console.error("Error loading state", e);
        localStorage.removeItem('hub_persistent_state');
      }
    }
  }, []);

  React.useEffect(() => {
    const state = {
      brandUrls, watchDomains, savedSearches, 
      seoResult, keywordResult, trendResult,
      brandingResult, recyclerResult, result
    };
    localStorage.setItem('hub_persistent_state_v2', JSON.stringify(state));
  }, [brandUrls, watchDomains, savedSearches, seoResult, keywordResult, trendResult, brandingResult, recyclerResult, result]);

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportCurrentResult = (format: 'html' | 'md' | 'pdf') => {
    const currentData = activeTab === 'Pesquisa' ? result : 
                       activeTab === 'Trends' ? trendResult :
                       activeTab === 'SEO' ? seoResult :
                       activeTab === 'Keywords' ? keywordResult :
                       activeTab === 'Brands' ? brandingResult :
                       activeTab === 'Recycler' ? recyclerResult : null;

    if (!currentData) return;

    const fileName = `analysis-${activeTab}-${new Date().toISOString().split('T')[0]}`;

    if (format === 'md') {
      const content = `# Content Hub Analysis - ${activeTab}\n\n` + 
                    `Generated on: ${new Date().toLocaleString()}\n\n` +
                    `## Result Data\n\n\`\`\`json\n${JSON.stringify(currentData, null, 2)}\n\`\`\``;
      downloadFile(content, `${fileName}.md`, 'text/markdown');
    } else if (format === 'html' || format === 'pdf') {
      const content = `
        <html>
          <head>
            <title>${fileName}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; line-height: 1.6; color: #1a1a1a; max-width: 800px; margin: 0 auto; }
              .header { border-bottom: 2px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; }
              .tab-label { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #f97316; letter-spacing: 0.1em; }
              h1 { margin-top: 10px; font-size: 32px; }
              pre { background: #f8fafc; padding: 24px; border-radius: 16px; overflow: auto; border: 1px solid #e2e8f0; font-size: 13px; }
              .footer { margin-top: 50px; font-size: 12px; color: #64748b; text-align: center; }
            </style>
          </head>
          <body>
            <div class="header">
              <span class="tab-label">Content Hub Intelligence</span>
              <h1>${activeTab} Analysis Result</h1>
              <p>Generated on: ${new Date().toLocaleString()}</p>
            </div>
            <div class="content">
              <pre>${JSON.stringify(currentData, null, 2)}</pre>
            </div>
            <div class="footer">
              Generated by Content Hub AI Dashboard
            </div>
          </body>
        </html>
      `;
      if (format === 'html') {
        downloadFile(content, `${fileName}.html`, 'text/html');
      } else {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(content);
          printWindow.document.close();
          // Wait for images if any, then print
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 250);
        }
      }
    }
  };

  const ExportToolbar = () => (
    <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-2xl border border-border/50">
      <span className="text-[10px] font-bold text-muted-foreground uppercase px-2">Exportar:</span>
      <button onClick={() => exportCurrentResult('html')} className="p-2 hover:bg-white rounded-xl text-[10px] font-bold transition-all border border-transparent hover:border-border shadow-sm">HTML</button>
      <button onClick={() => exportCurrentResult('md')} className="p-2 hover:bg-white rounded-xl text-[10px] font-bold transition-all border border-transparent hover:border-border shadow-sm">MD</button>
      <button onClick={() => exportCurrentResult('pdf')} className="p-2 hover:bg-white rounded-xl text-[10px] font-bold transition-all border border-transparent hover:border-border shadow-sm">PDF</button>
    </div>
  );

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

  const handleScanWatch = async () => {
    if (watchDomains.length === 0) return;
    setLoading(true);
    try {
      const results = await Promise.all(watchDomains.map(async (domain) => {
        const mapRes = await mapDomain(domain);
        return {
          domain,
          sitemapUrl: `${domain}${domain.endsWith('/') ? '' : '/'}sitemap.xml`,
          lastModified: new Date().toLocaleString(),
          totalUrls: mapRes.links?.length || 0,
          newUrls: (mapRes.links || []).slice(0, 3).map(link => ({
            url: link,
            title: 'Página detectada via Firecrawl',
            date: new Date().toLocaleDateString()
          }))
        };
      }));
      setWatchResults(results);
    } catch (error) {
      console.error("Error scanning watch domains:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!targetDomain.trim()) {
      setActionMessage({ type: 'error', text: 'Informe um domínio válido para iniciar a análise competitiva.' });
      return;
    }
    if (searchTags.length === 0) {
      setActionMessage({ type: 'error', text: 'Adicione pelo menos um termo de busca para a aba Pesquisa.' });
      return;
    }

    setLoading(true);
    setActionMessage(null);
    setResult(null);
    try {
      // Step 1: Scrape target domain for context
      const scrapeRes = await scrapeUrl(targetDomain);
      
      // Step 2: Analyze with Gemini
      const data = await analyzeCompetitors(targetDomain, searchTags, scrapeRes.data?.markdown);
      setResult(data);
      
      // Step 3: Add to saved searches
      const newSearch = {
        id: Date.now().toString(),
        domain: targetDomain,
        date: new Date().toLocaleDateString(),
        resultsCount: (data.landscape?.length || 0) + (data.ideas?.length || 0)
      };
      setSavedSearches(prev => [newSearch, ...prev.slice(0, 4)]);
      setActionMessage({ type: 'success', text: 'Análise competitiva concluída com sucesso.' });
    } catch (error) {
      console.error("Error in handleAnalyze:", error);
      setActionMessage({ type: 'error', text: 'Não foi possível concluir a análise competitiva. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTrends = async () => {
    if (trendTags.length === 0) {
      setActionMessage({ type: 'error', text: 'Adicione pelo menos um tópico para buscar tendências.' });
      return;
    }

    setLoading(true);
    setActionMessage(null);
    setTrendResult(null);
    try {
      const data = await fetchTrends(trendPeriod, trendTags);
      setTrendResult(data);
      setActionMessage({ type: 'success', text: 'Tendências atualizadas com sucesso.' });
    } catch (error) {
      console.error(error);
      setActionMessage({ type: 'error', text: 'Falha ao buscar tendências no momento.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeSEO = async () => {
    if (!seoUrl.trim()) {
      setActionMessage({ type: 'error', text: 'Informe uma URL para executar a auditoria SEO.' });
      return;
    }
    setLoading(true);
    setActionMessage(null);
    setSeoResult(null);
    try {
      const prompt = `
        Execute uma auditoria SEO e GEO completa da URL informada.
        Retorne obrigatoriamente um objeto JSON com:
        - url (string)
        - wordCount (number)
        - headings (array de { level, text })
        - metaTags (array de { name, content })
        - summary (string)
        - checklist (array de { criterion, status: good|regular|poor, details })
        - improvements (array de strings)
        - structuredData ({ existing: string[], toImplement: string[] })
        - pageSpeed ({ score: number 0-100, metrics: array de { name, value, status: good|regular|poor } })
        - qualityScore (number 0-100)
        - eeat ({ experience, expertise, authoritativeness, trustworthiness, overallScore: number 0-10 })
        - geoParameters (array de { parameter, status, recommendation })
      `;

      const seoSchema = {
        type: "object",
        properties: {
          url: { type: "string" },
          wordCount: { type: "number" },
          headings: {
            type: "array",
            items: {
              type: "object",
              properties: { level: { type: "string" }, text: { type: "string" } }
            }
          },
          metaTags: {
            type: "array",
            items: {
              type: "object",
              properties: { name: { type: "string" }, content: { type: "string" } }
            }
          },
          summary: { type: "string" },
          checklist: {
            type: "array",
            items: {
              type: "object",
              properties: {
                criterion: { type: "string" },
                status: { type: "string" },
                details: { type: "string" }
              }
            }
          },
          improvements: { type: "array", items: { type: "string" } },
          structuredData: {
            type: "object",
            properties: {
              existing: { type: "array", items: { type: "string" } },
              toImplement: { type: "array", items: { type: "string" } }
            }
          },
          pageSpeed: {
            type: "object",
            properties: {
              score: { type: "number" },
              metrics: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    value: { type: "string" },
                    status: { type: "string" }
                  }
                }
              }
            }
          },
          qualityScore: { type: "number" },
          eeat: {
            type: "object",
            properties: {
              experience: { type: "string" },
              expertise: { type: "string" },
              authoritativeness: { type: "string" },
              trustworthiness: { type: "string" },
              overallScore: { type: "number" }
            }
          },
          geoParameters: {
            type: "array",
            items: {
              type: "object",
              properties: {
                parameter: { type: "string" },
                status: { type: "string" },
                recommendation: { type: "string" }
              }
            }
          }
        }
      };

      const res = await extractStructured(seoUrl, prompt, seoSchema);
      
      if (res.success) {
        const normalized = normalizeSeoResult(res.data);
        if (!hasMeaningfulSeoData(normalized)) {
          throw new Error("SEO extract returned empty/low-signal payload");
        }
        setSeoResult(normalized);
        
        // Step 3: Add to history
        const newHistory = {
          id: Date.now().toString(),
          url: seoUrl,
          date: new Date().toLocaleDateString()
        };
        setSeoHistory(prev => [newHistory, ...prev.slice(0, 4)]);
        setActionMessage({ type: 'success', text: 'Auditoria SEO finalizada com sucesso.' });
      } else {
        console.error("Firecrawl Extract failed:", res.error);
        try {
          // Fallback: se o Extract não retornar dados úteis, usamos scrape + Gemini.
          const scraped = await scrapeUrl(seoUrl);
          const fallback = await analyzeSEO(seoUrl, scraped.data?.markdown || scraped.data?.content || "");
          const normalizedFallback = normalizeSeoResult(fallback);
          if (!hasMeaningfulSeoData(normalizedFallback)) {
            throw new Error("SEO fallback returned empty payload");
          }
          setSeoResult(normalizedFallback);
          setActionMessage({ type: 'success', text: 'Auditoria SEO concluída via fallback automático.' });
        } catch (fallbackError) {
          console.error("SEO fallback failed:", fallbackError);
          setActionMessage({ type: 'error', text: 'A extração da auditoria SEO falhou. Verifique a URL e tente novamente.' });
        }
      }
    } catch (error) {
      console.error("Error in handleAnalyzeSEO:", error);
      setActionMessage({ type: 'error', text: 'Não foi possível concluir a auditoria SEO.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFetchKeywords = async () => {
    if (!targetDomain.trim()) {
      setActionMessage({ type: 'error', text: 'Defina o domínio principal para analisar keywords.' });
      return;
    }
    if (brandUrls.length === 0) {
      setActionMessage({ type: 'error', text: 'Adicione ao menos uma URL concorrente para comparar keywords.' });
      return;
    }

    setLoading(true);
    setActionMessage(null);
    setKeywordResult(null);
    try {
      const data = await fetchKeywords(targetDomain, brandUrls);
      const normalized = normalizeKeywordResult(data);
      let finalResult = normalized;

      if (!hasMeaningfulKeywordData(normalized)) {
        finalResult = await fetchKeywordsFallback(targetDomain, brandUrls);
      }

      if (!hasMeaningfulKeywordData(finalResult)) {
        setActionMessage({
          type: 'error',
          text: 'A análise retornou sem keywords úteis. Tente mais concorrentes ou uma URL mais específica.'
        });
        return;
      }

      setKeywordResult(finalResult);

      // Add to history
      const newHistory = {
        id: Date.now().toString(),
        domain: targetDomain,
        date: new Date().toLocaleDateString(),
        count: (finalResult.keywords || []).length
      };
      setKeywordHistory(prev => [newHistory, ...prev.slice(0, 4)]);
      setActionMessage({ type: 'success', text: 'Pesquisa de keywords concluída.' });
    } catch (error) {
      console.error(error);
      setActionMessage({ type: 'error', text: 'Falha ao buscar keywords com os dados informados.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeGaps = async () => {
    if (!targetDomain.trim()) {
      setActionMessage({ type: 'error', text: 'Defina o domínio principal para rodar o Gap Analysis.' });
      return;
    }
    if (brandUrls.length === 0) {
      setActionMessage({ type: 'error', text: 'Adicione concorrentes para comparar e gerar os gaps.' });
      return;
    }

    setLoading(true);
    setActionMessage(null);
    setGapResult(null);
    try {
      const data = await analyzeGaps(targetDomain, brandUrls);
      let normalized = normalizeGapResult(data);
      if (!hasMeaningfulGapData(normalized) || (normalized.gaps || []).length === 0) {
        normalized = await analyzeGapsFallback(targetDomain, brandUrls);
      }

      if (!hasMeaningfulGapData(normalized) || (normalized.gaps || []).length === 0) {
        setActionMessage({ type: 'error', text: 'A análise de gaps não retornou itens úteis. Tente adicionar mais concorrentes.' });
        return;
      }

      setGapResult(normalized);
      setActionMessage({ type: 'success', text: 'Gap Analysis concluída com sucesso.' });
    } catch (error) {
      console.error(error);
      setActionMessage({ type: 'error', text: 'Não foi possível gerar os gaps de conteúdo.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRecs = async () => {
    const domainToUse = recsDomain.trim() || targetDomain.trim();
    if (!domainToUse) {
      setActionMessage({ type: 'error', text: 'Defina o domínio para gerar recomendações.' });
      return;
    }
    if (!result && !gapResult && !keywordResult) {
      setActionMessage({ type: 'error', text: 'Gere pelo menos uma análise (Pesquisa, Gaps ou Keywords) antes de pedir recomendações.' });
      return;
    }

    setLoading(true);
    setActionMessage(null);
    setRecResult(null);
    try {
      const data = await generateRecs(domainToUse, { result, gapResult, keywordResult });
      setRecResult(data);
      setActionMessage({ type: 'success', text: 'Recomendações estratégicas geradas.' });
    } catch (error) {
      console.error(error);
      setActionMessage({ type: 'error', text: 'Erro ao gerar recomendações estratégicas.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePlanEditorial = async () => {
    const domainToUse = editorialDomain.trim() || targetDomain.trim();
    if (!domainToUse) {
      setActionMessage({ type: 'error', text: 'Defina o domínio para montar o calendário editorial.' });
      return;
    }

    setLoading(true);
    setActionMessage(null);
    setEditorialResult(null);
    try {
      // Use topics from result or keywords as base
      const topics = keywordResult?.keywords.map(k => k.term) || result?.ideas.map(i => i.title) || ["SEO", "Marketing Digital"];
      const data = await planEditorial(domainToUse, topics, editorialPeriod);
      setEditorialResult(data);
      setActionMessage({ type: 'success', text: `Calendário editorial de ${editorialPeriod} semanas criado com sucesso.` });
    } catch (error) {
      console.error(error);
      setActionMessage({ type: 'error', text: 'Não foi possível gerar o calendário editorial.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeBranding = async () => {
    if (brandUrls.length === 0) {
      setActionMessage({ type: 'error', text: 'Adicione ao menos uma URL para análise de marca.' });
      return;
    }
    setLoading(true);
    setActionMessage(null);
    setBrandingResult(null);
    try {
      const url = brandUrls[0];
      const prompt = `Extract branding identity: colors (hex), fonts, logos, and typography guidelines. Format as BrandingResult JSON.`;
      
      const res = await extractStructured(url, prompt);
      
      if (res.success) {
        setBrandingResult(res.data);
        setActionMessage({ type: 'success', text: 'Análise de branding concluída.' });
      } else {
        console.error("Firecrawl Branding Extract failed:", res.error);
        setActionMessage({ type: 'error', text: 'Falha ao extrair dados de branding da URL informada.' });
      }
    } catch (error) {
      console.error("Error in handleAnalyzeBranding:", error);
      setActionMessage({ type: 'error', text: 'Erro ao analisar branding.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRecycle = async () => {
    if (!recyclerUrl.trim()) {
      setActionMessage({ type: 'error', text: 'Informe uma URL para reciclar o conteúdo.' });
      return;
    }
    setLoading(true);
    setActionMessage(null);
    setRecyclerResult(null);
    try {
      const scrapeRes = await scrapeUrl(recyclerUrl);
      const prompt = `
        RECICLE ESTE CONTEÚDO EM ${slideCount} SLIDES NO ESTILO ${recyclerStyle}:
        ${scrapeRes.data?.markdown}
        
        OBJETIVO: Transformar o conteúdo em um carrossel de slides impactante.
        ESTRUTURA JSON: { "slides": [{ "title": "string", "content": "string" }] }
        Responda apenas com o JSON puro.
      `;
      const response = await (ai as any).models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" }
      });
      const text = response.text;
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      setRecyclerResult(JSON.parse(cleaned));
      setActionMessage({ type: 'success', text: 'Conteúdo reciclado com sucesso.' });
    } catch (error) {
      console.error("Error in handleRecycle:", error);
      setActionMessage({ type: 'error', text: 'Não foi possível reciclar este conteúdo.' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setActionMessage({ type: 'success', text: 'JSON copiado para a área de transferência.' });
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
            <section className="bg-primary/5 rounded-[32px] overflow-hidden border border-primary/20">
              <div 
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-all"
                onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary p-2.5 rounded-xl">
                    <Search size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{t.dashboard.competitiveSearch}</h3>
                    <p className="text-xs font-medium text-muted-foreground">{t.dashboard.mapDomain}</p>
                  </div>
                </div>
                {isHowItWorksOpen ? <ChevronUp size={18} className="text-foreground" /> : <ChevronDown size={18} className="text-foreground" />}
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
                      <div className="bg-card p-5 rounded-2xl border border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <Globe size={14} className="text-foreground" />
                          <span className="text-[10px] font-semibold text-foreground">{t.dashboard.howItWorks.step1Title}</span>
                        </div>
                        <p className="text-[11px] text-foreground/60 font-medium leading-relaxed">
                          {t.dashboard.howItWorks.step1Desc}
                        </p>
                      </div>
                      <div className="bg-card p-5 rounded-2xl border border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <Search size={14} className="text-foreground" />
                          <span className="text-[10px] font-semibold text-foreground">{t.dashboard.howItWorks.step2Title}</span>
                        </div>
                        <p className="text-[11px] text-foreground/60 font-medium leading-relaxed">
                          {t.dashboard.howItWorks.step2Desc}
                        </p>
                      </div>
                      <div className="bg-card p-5 rounded-2xl border border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <BarChart3 size={14} className="text-foreground" />
                          <span className="text-[10px] font-semibold text-foreground">{t.dashboard.howItWorks.step3Title}</span>
                        </div>
                        <p className="text-[11px] text-foreground/60 font-medium leading-relaxed">
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
                <h3 className="text-sm font-semibold">{t.dashboard.savedSearches}</h3>
                <RefreshCw size={16} className="text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
              </div>
              <div className="space-y-2">
                {savedSearches.map(search => (
                  <div key={search.id} className="card-elevated p-4 flex items-center justify-between hover:border-brand-orange/30 transition-all group">
                    <div className="space-y-1">
                      <p className="text-sm font-bold">{search.domain}</p>
                      <p className="text-xs text-muted-foreground">{search.date} · {search.resultsCount} {t.dashboard.resultsArea}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Trash2 size={16} className="text-muted-foreground cursor-pointer hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Inputs */}
            <section className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t.dashboard.targetDomain}</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={targetDomain}
                  onChange={(e) => setTargetDomain(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t.dashboard.searchTerms}</label>
                <form onSubmit={handleAddTag} className="flex gap-2">
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder={t.dashboard.addTerm}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="bg-brand-card border border-border p-2.5 rounded-lg hover:bg-brand-card-hover transition-all">
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
                className="btn-primary w-full max-w-md mx-auto py-4 text-base"
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
            <section className="bg-primary/5 rounded-[40px] overflow-hidden border border-primary/20">
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-brand-card-hover transition-all"
                onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-orange-950/30 p-2 rounded-lg">
                    <Flame size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{t.dashboard.trendsTab.howItWorksTitle}</h3>
                    <p className="text-xs text-muted-foreground font-medium">{t.dashboard.trendsTab.howItWorksDesc}</p>
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
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
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
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
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
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {t.dashboard.trendsTab.step3Desc}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-brand-card rounded-lg flex items-center gap-3 border border-border">
                      <Lightbulb size={16} className="text-yellow-500 shrink-0" />
                      <p className="text-[11px] text-muted-foreground">
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
                <History size={16} className="text-muted-foreground" />
                <h3 className="text-sm font-semibold">{t.dashboard.trendsTab.history}</h3>
                <span className="bg-brand-card px-2 py-0.5 rounded text-[10px] text-muted-foreground font-bold">1/3</span>
              </div>
              <div className="space-y-2">
                {trendHistory.map(item => (
                  <div key={item.id} className="card-elevated p-4 flex items-center justify-between hover:border-brand-orange/30 transition-all group">
                    <div className="flex items-center gap-3">
                      <Eye size={16} className="text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{item.queries} queries — {item.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Download size={16} className="text-muted-foreground cursor-pointer hover:text-foreground" />
                      <span className="text-[10px] font-bold text-muted-foreground">HTML</span>
                      <Trash2 size={16} className="text-muted-foreground cursor-pointer hover:text-red-500" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Trend Radar Form */}
            <section className="card-elevated p-8 space-y-8 border-brand-orange/20">
              <div className="flex items-center gap-4">
                <div className="bg-primary/20 p-3 rounded-2xl">
                  <TrendingUp size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{t.dashboard.trendsTab.formTitle}</h3>
                  <p className="text-xs text-muted-foreground font-medium">{t.dashboard.trendsTab.formSubtitle}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{t.dashboard.trendsTab.period}</label>
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
                          "px-5 py-2 rounded-xl text-[10px] font-semibold transition-all border",
                          trendPeriod === id 
                            ? "bg-primary/10 text-primary border-brand-orange/30 shadow-[0_0_15px_rgba(255,77,0,0.1)]" 
                            : "bg-muted/50 text-muted-foreground border-border hover:border-brand-text-muted"
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
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{t.dashboard.trendsTab.queries}</label>
                  <form onSubmit={handleAddTrendTag} className="flex gap-3">
                    <input 
                      type="text" 
                      className="input-field flex-1" 
                      placeholder={t.dashboard.trendsTab.addQuery}
                      value={trendQuery}
                      onChange={(e) => setTrendQuery(e.target.value)}
                    />
                    <button type="submit" className="bg-muted/50 border border-border p-3.5 rounded-2xl hover:bg-muted transition-all group">
                      <Plus size={24} className="group-hover:rotate-90 transition-transform" />
                    </button>
                  </form>
                  <div className="flex flex-wrap gap-2">
                    {trendTags.map(tag => (
                      <span key={tag} className="tag bg-muted/50 border-border text-[10px] px-3 py-1.5 rounded-full font-semibold flex items-center gap-2 group">
                        {tag}
                        <X size={12} className="cursor-pointer hover:text-primary transition-colors" onClick={() => removeTrendTag(tag)} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleFetchTrends}
                disabled={loading}
                className="btn-primary w-full max-w-md mx-auto py-4 text-base group"
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
                  className="space-y-8 pt-8 border-t border-border"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">{t.dashboard.trendsTab.insights}</h2>
                    <div className="flex items-center gap-4">
                      <ExportToolbar />
                      <div className="bg-primary/10 px-4 py-1.5 rounded-full border border-brand-orange/30">
                        <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">
                          {(() => {
                            const map: any = { 'Última hora': 'lastHour', 'Hoje': 'today', 'Semana': 'week', 'Mês': 'month' };
                            return t.dashboard.trendsTab.periods[map[trendPeriod] || trendPeriod] || trendPeriod;
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-elevated p-6 bg-primary/5 border-brand-orange/20 relative overflow-hidden group rounded-[32px]">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(trendResult.summary);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="p-2 bg-muted/50 hover:bg-muted rounded-xl transition-colors border border-white/5"
                      >
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-muted-foreground" />}
                      </button>
                    </div>
                    <div className="flex gap-5">
                      <div className="bg-primary/20 p-3 rounded-2xl h-fit">
                        <Lightbulb size={24} className="text-primary" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-semibold text-primary uppercase tracking-widest">{t.dashboard.trendsTab.strategicSummary}</p>
                        <p className="text-sm text-foreground leading-relaxed italic font-medium">
                          "{trendResult.summary}"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trendResult.trends.map((trend, i) => (
                      <div key={i} className="card-elevated p-6 space-y-4 hover:border-brand-orange/40 transition-all group rounded-[32px]">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-semibold text-primary italic group-hover:translate-x-1 transition-transform">{trend.title}</h4>
                          <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                            <TrendingUp size={14} className="text-green-500" />
                            <span className="text-[10px] font-semibold text-green-500 uppercase tracking-widest">{(trend.relevance * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                          {trend.description}
                        </p>
                        {trend.source && (
                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <span className="text-[10px] text-muted-foreground font-semibold">{t.dashboard.trendsTab.source}: {trend.source}</span>
                            {trend.url && (
                              <a href={trend.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary font-semibold hover:underline flex items-center gap-1">
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
            <section className="bg-primary/5 rounded-[40px] overflow-hidden border border-primary/20">
              <div 
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-all"
                onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary/20 p-3 rounded-2xl">
                    <Palette size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{t.dashboard.brandsTab.howItWorksTitle}</h3>
                    <p className="text-xs text-muted-foreground font-medium">{t.dashboard.brandsTab.howItWorksDesc}</p>
                  </div>
                </div>
                <div className="bg-muted/50 p-2 rounded-xl border border-border">
                  {isHowItWorksOpen ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-muted-foreground" />}
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
                      <div className="card-elevated p-6 bg-muted/50 border-border rounded-[32px] space-y-3 group hover:border-brand-orange/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-500/20 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                            <Link2 size={18} className="text-blue-400" />
                          </div>
                          <span className="text-xs font-semibold">{t.dashboard.brandsTab.step1Title}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                          {t.dashboard.brandsTab.step1Desc}
                        </p>
                      </div>
                      <div className="card-elevated p-6 bg-muted/50 border-border rounded-[32px] space-y-3 group hover:border-brand-orange/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-500/20 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                            <Palette size={18} className="text-purple-400" />
                          </div>
                          <span className="text-xs font-semibold">{t.dashboard.brandsTab.step2Title}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                          {t.dashboard.brandsTab.step2Desc}
                        </p>
                      </div>
                      <div className="card-elevated p-6 bg-muted/50 border-border rounded-[32px] space-y-3 group hover:border-brand-orange/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-500/20 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                            <Layout size={18} className="text-green-400" />
                          </div>
                          <span className="text-xs font-semibold">{t.dashboard.brandsTab.step3Title}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                          {t.dashboard.brandsTab.step3Desc}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 p-5 bg-primary/5 rounded-[24px] flex items-center gap-4 border border-brand-orange/20">
                      <div className="bg-primary/20 p-2 rounded-lg">
                        <Lightbulb size={20} className="text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                        {t.dashboard.brandsTab.tip}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Brand Intelligence Form */}
            <section className="card-elevated p-8 space-y-8 border-brand-orange/20 rounded-[40px]">
              <div className="flex items-center gap-4">
                <div className="bg-primary/20 p-3 rounded-2xl">
                  <Palette size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{t.dashboard.brandsTab.formTitle}</h3>
                  <p className="text-xs text-muted-foreground font-medium">{t.dashboard.brandsTab.formSubtitle}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{t.dashboard.brandsTab.urlLabel}</label>
                  <form onSubmit={handleAddBrandUrl} className="flex gap-3">
                    <input 
                      type="text" 
                      className="input-field flex-1" 
                      placeholder={t.dashboard.brandsTab.urlPlaceholder}
                      value={brandUrlInput}
                      onChange={(e) => setBrandUrlInput(e.target.value)}
                    />
                    <button type="submit" className="bg-muted/50 border border-border p-3.5 rounded-2xl hover:bg-muted transition-all group">
                      <Plus size={24} className="group-hover:rotate-90 transition-transform" />
                    </button>
                  </form>
                  <div className="flex flex-wrap gap-2">
                    {brandUrls.map(url => (
                      <span key={url} className="tag bg-muted/50 border-border text-[10px] px-3 py-1.5 rounded-full font-semibold flex items-center gap-2 group">
                        {url}
                        <X size={12} className="cursor-pointer hover:text-primary transition-colors" onClick={() => removeBrandUrl(url)} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleAnalyzeBranding}
                disabled={loading}
                className="btn-primary w-full max-w-md mx-auto py-4 text-base group"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <Palette size={24} className="group-hover:scale-110 transition-transform" />}
                {t.dashboard.brandsTab.analyze}
              </button>
            </section>

            <AnimatePresence>
              {brandingResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8 pt-8 border-t border-border"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-brand-orange/30">
                        Visual Identity Audit
                      </span>
                    </div>
                    <ExportToolbar />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ResultCard title="Color Palette" icon={<Palette size={18} />}>
                      <div className="grid grid-cols-2 gap-3">
                        {brandingResult.colors.map((c, i) => (
                          <div key={i} className="space-y-2">
                            <div className="h-12 w-full rounded-xl border border-white/10 shadow-inner" style={{ backgroundColor: c.color }} />
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{c.color}</p>
                            <p className="text-[9px] text-muted-foreground/60">{c.label}</p>
                          </div>
                        ))}
                      </div>
                    </ResultCard>

                    <ResultCard title="Typography" icon={<Type size={18} />}>
                      <div className="space-y-4">
                        {brandingResult.fonts.map((f, i) => (
                          <div key={i} className="space-y-1">
                            <p className="text-xs font-bold">{f.font}</p>
                            <p className="text-[10px] text-muted-foreground">{f.usage}</p>
                          </div>
                        ))}
                      </div>
                    </ResultCard>

                    <ResultCard title="Detected Logos" icon={<Layout size={18} />}>
                      <div className="space-y-3">
                        {brandingResult.logos.map((l, i) => (
                          <div key={i} className="p-3 bg-muted/50 rounded-2xl border border-white/5 flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-lg">
                              <Globe size={16} className="text-muted-foreground" />
                            </div>
                            <span className="text-[10px] font-bold truncate">{l.type}</span>
                          </div>
                        ))}
                        {brandingResult.logos.length === 0 && <p className="text-[10px] text-muted-foreground italic">Nenhum logo adicional detectado.</p>}
                      </div>
                    </ResultCard>

                    <ResultCard title="Summary" icon={<Info size={18} />}>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium italic">
                        "{brandingResult.summary}"
                      </p>
                    </ResultCard>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
            <section className="bg-primary/5 rounded-[32px] overflow-hidden border border-primary/20">
              <div 
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-all"
                onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary p-2.5 rounded-xl">
                    <RefreshCw size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{t.dashboard.recyclerTab.title}</h3>
                    <p className="text-xs font-medium text-muted-foreground">{t.dashboard.recyclerTab.subtitle}</p>
                  </div>
                </div>
                {isHowItWorksOpen ? <ChevronUp size={18} className="text-foreground" /> : <ChevronDown size={18} className="text-foreground" />}
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
                      <div className="bg-card p-5 rounded-2xl border border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <Link2 size={14} className="text-foreground" />
                          <span className="text-[10px] font-semibold text-foreground">{t.dashboard.recyclerTab.step1Title}</span>
                        </div>
                        <p className="text-[11px] text-foreground/60 font-medium leading-relaxed">
                          {t.dashboard.recyclerTab.step1Desc}
                        </p>
                      </div>
                      <div className="bg-card p-5 rounded-2xl border border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <Settings size={14} className="text-foreground" />
                          <span className="text-[10px] font-semibold text-foreground">{t.dashboard.recyclerTab.step2Title}</span>
                        </div>
                        <p className="text-[11px] text-foreground/60 font-medium leading-relaxed">
                          {t.dashboard.recyclerTab.step2Desc}
                        </p>
                      </div>
                      <div className="bg-card p-5 rounded-2xl border border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <Layout size={14} className="text-foreground" />
                          <span className="text-[10px] font-semibold text-foreground">{t.dashboard.recyclerTab.step3Title}</span>
                        </div>
                        <p className="text-[11px] text-foreground/60 font-medium leading-relaxed">
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
                <h3 className="text-sm font-semibold">{t.dashboard.recyclerTab.history}</h3>
                <History size={16} className="text-muted-foreground" />
              </div>
              <div className="space-y-2">
                {recyclerHistory.map(item => (
                  <div key={item.id} className="card-elevated p-4 flex items-center justify-between hover:border-brand-orange/30 transition-all group">
                    <div className="flex items-center gap-3">
                      <Eye size={16} className="text-muted-foreground" />
                      <p className="text-xs text-muted-foreground truncate max-w-[300px] md:max-w-md">{item.url} — {item.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Download size={16} className="text-muted-foreground cursor-pointer hover:text-foreground" />
                      <Trash2 size={16} className="text-muted-foreground cursor-pointer hover:text-red-500" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recycler Form */}
            <section className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{t.dashboard.recyclerTab.urlLabel}</label>
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
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{t.dashboard.recyclerTab.slideCount}</label>
                  <div className="flex gap-2 p-1 bg-muted/50 border border-border rounded-2xl">
                    {[5, 8, 10].map((count) => (
                      <button
                        key={count}
                        onClick={() => setSlideCount(count as any)}
                        className={cn(
                          "flex-1 py-2 rounded-xl text-[10px] font-semibold transition-all",
                          slideCount === count 
                            ? "bg-primary text-white shadow-lg shadow-primary/20" 
                            : "text-muted-foreground hover:text-white hover:bg-muted/50"
                        )}
                      >
                        {count} slides
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{t.dashboard.recyclerTab.styleLabel}</label>
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
                          "px-4 py-2 rounded-xl text-[10px] font-semibold transition-all border",
                          recyclerStyle === id 
                            ? "bg-primary/10 text-primary border-brand-orange/30" 
                            : "bg-muted/50 text-muted-foreground border-border hover:border-brand-text-muted"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleRecycle}
                disabled={loading}
                className="btn-primary w-full max-w-md mx-auto py-4 text-base"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                {t.dashboard.recyclerTab.generate}
              </button>
            </section>

            <AnimatePresence>
              {recyclerResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold italic">Slides Gerados</h3>
                    <div className="flex gap-2">
                       <button className="p-2 bg-muted/50 rounded-xl border border-border"><Download size={16} /></button>
                    </div>
                  </div>

                  <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar snap-x cursor-grab active:cursor-grabbing">
                    {(recyclerResult.slides || []).map((slide: any, i: number) => (
                      <div key={i} className="min-w-[300px] h-[400px] bg-brand-card border border-primary/20 rounded-[40px] p-8 flex flex-col justify-between snap-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all"></div>
                        <div className="space-y-4 relative z-10">
                          <span className="text-[10px] font-black tracking-widest text-primary uppercase">Slide {i + 1}</span>
                          <h4 className="text-xl font-bold leading-tight">{slide.title}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed italic">{slide.content || slide.description}</p>
                        </div>
                        <div className="flex items-center justify-between relative z-10 pt-4 border-t border-white/5">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">{recyclerStyle}</span>
                          <TrendingUp size={16} className="text-primary/50" />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
            <section className="bg-primary/5 rounded-[32px] overflow-hidden border border-primary/20">
              <div 
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-all"
                onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary p-2.5 rounded-xl">
                    <Eye size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{t.dashboard.watchTab.title}</h3>
                    <p className="text-xs font-medium text-muted-foreground">{t.dashboard.watchTab.subtitle}</p>
                  </div>
                </div>
                {isHowItWorksOpen ? <ChevronUp size={18} className="text-foreground" /> : <ChevronDown size={18} className="text-foreground" />}
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
                      <div className="bg-card p-5 rounded-2xl border border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <Globe size={14} className="text-foreground" />
                          <span className="text-[10px] font-semibold text-foreground">{t.dashboard.watchTab.step1Title}</span>
                        </div>
                        <p className="text-[11px] text-foreground/60 font-medium leading-relaxed">
                          {t.dashboard.watchTab.step1Desc}
                        </p>
                      </div>
                      <div className="bg-card p-5 rounded-2xl border border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <RefreshCw size={14} className="text-foreground" />
                          <span className="text-[10px] font-semibold text-foreground">{t.dashboard.watchTab.step2Title}</span>
                        </div>
                        <p className="text-[11px] text-foreground/60 font-medium leading-relaxed">
                          {t.dashboard.watchTab.step2Desc}
                        </p>
                      </div>
                      <div className="bg-card p-5 rounded-2xl border border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <Bell size={14} className="text-foreground" />
                          <span className="text-[10px] font-semibold text-foreground">{t.dashboard.watchTab.step3Title}</span>
                        </div>
                        <p className="text-[11px] text-foreground/60 font-medium leading-relaxed">
                          {t.dashboard.watchTab.step3Desc}
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
                <h3 className="text-sm font-semibold">{t.dashboard.watchTab.history}</h3>
                <History size={16} className="text-muted-foreground" />
              </div>
              <div className="space-y-2">
                {watchHistory.map(item => (
                  <div key={item.id} className="card-elevated p-4 flex items-center justify-between hover:border-brand-orange/30 transition-all group">
                    <div className="flex items-center gap-3">
                      <Eye size={16} className="text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{item.domains} {t.dashboard.watchTab.domainLabel} — {item.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Download size={16} className="text-muted-foreground cursor-pointer hover:text-foreground" />
                      <Trash2 size={16} className="text-muted-foreground cursor-pointer hover:text-red-500" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Watch Form */}
            <section className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{t.dashboard.watchTab.addDomain}</label>
                <form onSubmit={handleAddWatchDomain} className="flex gap-2">
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder={t.dashboard.watchTab.placeholder}
                    value={watchDomainInput}
                    onChange={(e) => setWatchDomainInput(e.target.value)}
                  />
                  <button type="submit" className="bg-muted/50 border border-border p-4 rounded-2xl hover:bg-muted transition-all">
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
                className="btn-primary w-full max-w-md mx-auto py-4 text-base"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Eye size={18} />}
                {t.dashboard.watchTab.scanAll}
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
                      <div className="bg-primary/10 p-2.5 rounded-xl">
                        <Bell size={20} className="text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold">{t.dashboard.watchTab.newContent}</h2>
                    </div>
                    <div className="bg-primary/10 px-4 py-1.5 rounded-full border border-brand-orange/20">
                      <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">{t.dashboard.watchTab.activeAlerts}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    {watchResults.map((result, i) => (
                      <div key={i} className="bg-accent rounded-[40px] overflow-hidden border border-border">
                        <div className="bg-muted/50 p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-center gap-4">
                            <div className="bg-white p-3 rounded-2xl shadow-sm">
                              <Globe size={20} className="text-primary" />
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-foreground uppercase tracking-tight block">{result.domain}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <Link2 size={12} className="text-foreground/40" />
                                <span className="text-[10px] text-foreground/40 font-bold truncate max-w-[200px]">{result.sitemapUrl}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-8">
                            <div className="text-right">
                              <span className="text-[10px] text-foreground/40 uppercase font-black tracking-widest block">{t.dashboard.watchTab.lastScan}</span>
                              <span className="text-xs font-bold text-foreground">{result.lastModified}</span>
                            </div>
                            <div className="h-8 w-px bg-muted/50 hidden md:block" />
                            <div className="text-right">
                              <span className="text-[10px] text-foreground/40 uppercase font-black tracking-widest block">{t.dashboard.watchTab.totalUrls}</span>
                              <span className="text-xs font-bold text-foreground">{result.totalUrls}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-8 space-y-6">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] text-foreground/40 uppercase font-black tracking-widest">{t.dashboard.watchTab.recentlyAdded}</p>
                            <span className="bg-primary text-white text-[10px] font-semibold px-3 py-1 rounded-full">
                              {result.newUrls.length} {t.dashboard.watchTab.newCount}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4">
                            {result.newUrls.map((item, j) => (
                              <div key={j} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-card rounded-3xl border border-border hover:border-brand-orange/30 transition-all group gap-4">
                                <div className="flex items-start gap-4">
                                  <div className="mt-1 bg-white p-2 rounded-xl shadow-sm">
                                    <FileText size={16} className="text-primary" />
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-sm font-semibold text-foreground uppercase tracking-tight block group-hover:text-primary transition-colors">{item.title}</span>
                                    <span className="text-[10px] text-foreground/40 font-bold truncate block">{item.url}</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-6">
                                  <span className="text-[10px] text-foreground/40 font-semibold">{item.date}</span>
                                  <div className="flex items-center gap-2">
                                    <button 
                                      onClick={() => window.open(item.url, '_blank')}
                                      className="p-2 hover:bg-white rounded-xl text-foreground/40 hover:text-foreground transition-all shadow-sm"
                                    >
                                      <Eye size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-white rounded-xl text-foreground/40 hover:text-foreground transition-all shadow-sm">
                                      <RefreshCw size={16} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="pt-4">
                            <button className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-2">
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
            <section className="bg-primary/5 rounded-[32px] overflow-hidden border border-primary/20">
              <div 
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-all"
                onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary p-2.5 rounded-xl">
                    <Search size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{t.dashboard.tabs.seo.title}</h3>
                    <p className="text-xs font-medium text-muted-foreground">{t.dashboard.tabs.seo.subtitle}</p>
                  </div>
                </div>
                {isHowItWorksOpen ? <ChevronUp size={18} className="text-foreground" /> : <ChevronDown size={18} className="text-foreground" />}
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
                      <div className="bg-card p-5 rounded-2xl border border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <Link2 size={14} className="text-foreground" />
                          <span className="text-[10px] font-semibold text-foreground">{t.dashboard.tabs.seo.step1Title}</span>
                        </div>
                        <p className="text-[11px] text-foreground/60 font-medium leading-relaxed">
                          {t.dashboard.tabs.seo.step1Desc}
                        </p>
                      </div>
                      <div className="bg-card p-5 rounded-2xl border border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <Zap size={14} className="text-foreground" />
                          <span className="text-[10px] font-semibold text-foreground">{t.dashboard.tabs.seo.step2Title}</span>
                        </div>
                        <p className="text-[11px] text-foreground/60 font-medium leading-relaxed">
                          {t.dashboard.tabs.seo.step2Desc}
                        </p>
                      </div>
                      <div className="bg-card p-5 rounded-2xl border border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <BarChart3 size={14} className="text-foreground" />
                          <span className="text-[10px] font-semibold text-foreground">{t.dashboard.tabs.seo.step3Title}</span>
                        </div>
                        <p className="text-[11px] text-foreground/60 font-medium leading-relaxed">
                          {t.dashboard.tabs.seo.step3Desc}
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
                <h3 className="text-sm font-semibold">{t.dashboard.tabs.seo.recentAnalysis}</h3>
                <History size={16} className="text-muted-foreground" />
              </div>
              <div className="space-y-2">
                {seoHistory.map(item => (
                  <div key={item.id} className="card-elevated p-4 flex items-center justify-between hover:border-brand-orange/30 transition-all group">
                    <div className="flex items-center gap-3">
                      <Search size={16} className="text-muted-foreground" />
                      <p className="text-xs text-muted-foreground truncate max-w-[300px]">{item.url} — {item.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Download size={16} className="text-muted-foreground cursor-pointer hover:text-foreground" />
                      <Trash2 size={16} className="text-muted-foreground cursor-pointer hover:text-red-500" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SEO Form */}
            <section className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{t.dashboard.tabs.seo.urlLabel}</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder={t.dashboard.tabs.seo.placeholder}
                    value={seoUrl}
                    onChange={(e) => setSeoUrl(e.target.value)}
                  />
                </div>
              </div>

              <button 
                onClick={handleAnalyzeSEO}
                disabled={loading}
                className="btn-primary w-full max-w-md mx-auto py-4 text-base"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                {t.dashboard.tabs.seo.analyze}
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
                    <div className="card-elevated p-8 flex flex-col items-center justify-center text-center space-y-3 border-brand-orange/30 bg-primary/5 rounded-[40px] group hover:scale-[1.02] transition-all">
                      <span className="text-[10px] font-semibold text-primary">{t.dashboard.tabs.seo.results.qualityScore}</span>
                      <div className="text-5xl font-semibold text-primary tracking-tighter italic">
                        {seoResult.qualityScore}<span className="text-xl opacity-50">/100</span>
                      </div>
                      <div className="w-full bg-muted/50 h-1.5 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="bg-primary h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,77,0,0.5)]" 
                          style={{ width: `${seoResult.qualityScore}%` }}
                        />
                      </div>
                    </div>
                    <div className="card-elevated p-8 flex flex-col items-center justify-center text-center space-y-3 border-border rounded-[40px] group hover:scale-[1.02] transition-all">
                      <span className="text-[10px] font-semibold text-muted-foreground">{t.dashboard.tabs.seo.results.pageSpeed}</span>
                      <div className="text-5xl font-black tracking-tighter italic">
                        {seoResult.pageSpeed.score}<span className="text-xl opacity-50">/100</span>
                      </div>
                      <div className="w-full bg-muted/50 h-1.5 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="bg-green-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
                          style={{ width: `${seoResult.pageSpeed.score}%` }}
                        />
                      </div>
                    </div>
                    <div className="card-elevated p-8 flex flex-col items-center justify-center text-center space-y-3 border-border rounded-[40px] group hover:scale-[1.02] transition-all">
                      <span className="text-[10px] font-semibold text-muted-foreground">{t.dashboard.tabs.seo.results.eeatScore}</span>
                      <div className="text-5xl font-black tracking-tighter italic">
                        {seoResult.eeat.overallScore}<span className="text-xl opacity-50">/10</span>
                      </div>
                      <div className="w-full bg-muted/50 h-1.5 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="bg-blue-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                          style={{ width: `${seoResult.eeat.overallScore * 10}%` }}
                        />
                      </div>
                    </div>
                    <div className="card-elevated p-8 flex flex-col items-center justify-center text-center space-y-3 border-border rounded-[40px] group hover:scale-[1.02] transition-all">
                      <span className="text-[10px] font-semibold text-muted-foreground">{t.dashboard.tabs.seo.results.wordCount}</span>
                      <div className="text-5xl font-black tracking-tighter italic">
                        {seoResult.wordCount}
                      </div>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{t.dashboard.tabs.seo.results.detectedWords}</span>
                    </div>
                  </div>

                  {/* Detailed Analysis Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* On-Page & Meta Data */}
                    <ResultCard title={t.dashboard.tabs.seo.results.onPageTitle} icon={<Search size={18} />}>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Headings Structure</p>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">
                              {(seoResult.headings || []).length} itens
                            </span>
                          </div>
                          <div className="space-y-2">
                            {(showAllSeoHeadings ? (seoResult.headings || []) : (seoResult.headings || []).slice(0, 6)).map((h, i) => (
                              <div key={i} className="flex gap-3 items-start p-2 bg-muted/50 rounded-xl border border-white/5">
                                <span className="text-[9px] bg-primary text-foreground px-2 py-0.5 rounded-full font-black shrink-0">{h.level}</span>
                                <span className="text-[11px] text-foreground leading-tight break-words">{h.text}</span>
                              </div>
                            ))}
                          </div>
                          {(seoResult.headings || []).length > 6 && (
                            <button
                              type="button"
                              onClick={() => setShowAllSeoHeadings((prev) => !prev)}
                              className="text-[10px] font-semibold text-primary hover:underline"
                            >
                              {showAllSeoHeadings ? 'Mostrar menos' : `Mostrar mais (${(seoResult.headings || []).length - 6})`}
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Meta Tags</p>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">
                              {(seoResult.metaTags || []).length} itens
                            </span>
                          </div>
                          <div className="space-y-3">
                            {(showAllSeoMetaTags ? (seoResult.metaTags || []) : (seoResult.metaTags || []).slice(0, 5)).map((tag, i) => (
                              <div key={i} className="space-y-1 p-2 bg-muted/50 rounded-xl border border-white/5">
                                <span className="text-[9px] text-primary font-black uppercase tracking-wider">{tag.name}</span>
                                <p className="text-[11px] text-muted-foreground leading-relaxed break-words whitespace-pre-wrap">{tag.content}</p>
                              </div>
                            ))}
                          </div>
                          {(seoResult.metaTags || []).length > 5 && (
                            <button
                              type="button"
                              onClick={() => setShowAllSeoMetaTags((prev) => !prev)}
                              className="text-[10px] font-semibold text-primary hover:underline"
                            >
                              {showAllSeoMetaTags ? 'Mostrar menos' : `Mostrar mais (${(seoResult.metaTags || []).length - 5})`}
                            </button>
                          )}
                        </div>
                      </div>
                    </ResultCard>

                    {/* E-E-A-T Analysis */}
                    <ResultCard title={t.dashboard.tabs.seo.results.eeatTitle} icon={<Shield size={18} />}>
                      <div className="space-y-6">
                        <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">E-E-A-T Score</span>
                            <span className="text-sm font-bold text-primary">{seoResult.eeat.overallScore}/10</span>
                          </div>
                          <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-700"
                              style={{ width: `${Math.max(0, Math.min(100, seoResult.eeat.overallScore * 10))}%` }}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'Experience', val: seoResult.eeat.experience },
                            { label: 'Expertise', val: seoResult.eeat.expertise },
                            { label: 'Authority', val: seoResult.eeat.authoritativeness },
                            { label: 'Trust', val: seoResult.eeat.trustworthiness }
                          ].map((item, idx) => (
                            <div key={idx} className="p-3 bg-muted/50 rounded-2xl border border-white/5 space-y-1">
                              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</span>
                              <p className="text-[10px] text-foreground leading-tight font-medium">{item.val}</p>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'Experience', value: seoResult.eeat.experience },
                            { label: 'Expertise', value: seoResult.eeat.expertise },
                            { label: 'Authority', value: seoResult.eeat.authoritativeness },
                            { label: 'Trust', value: seoResult.eeat.trustworthiness },
                          ].map((item) => (
                            <div key={item.label} className="p-3 rounded-xl border border-border bg-card/50">
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</p>
                              <p className="mt-1 text-[10px] font-semibold text-foreground">
                                {item.value ? `${item.value.length} chars` : 'Sem detalhe'}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="p-4 bg-primary/10 border border-brand-orange/20 rounded-2xl space-y-2">
                          <p className="text-[11px] text-primary italic leading-relaxed font-medium">
                            {seoResult.eeat.overallScore >= 8
                              ? 'A página demonstra alta credibilidade para critérios de qualidade do Google.'
                              : seoResult.eeat.overallScore >= 5
                              ? 'A página apresenta credibilidade moderada e pode ser reforçada com sinais de autoridade e prova.'
                              : 'A página precisa fortalecer sinais de experiência, autoridade e confiança para competir melhor.'}
                          </p>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">
                            Prioridade sugerida: reforçar autoria, citações de fonte e evidências práticas no conteúdo.
                          </p>
                        </div>
                      </div>
                    </ResultCard>

                    {/* Structured Data */}
                    <ResultCard title={t.dashboard.tabs.seo.results.structuredTitle} icon={<FileText size={18} />}>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-xl border border-green-500/20 bg-green-500/5">
                            <p className="text-[9px] uppercase tracking-widest text-green-500 font-semibold">Schemas existentes</p>
                            <p className="text-xl font-bold text-green-500 mt-1">{(seoResult.structuredData?.existing || []).length}</p>
                          </div>
                          <div className="p-3 rounded-xl border border-primary/20 bg-primary/5">
                            <p className="text-[9px] uppercase tracking-widest text-primary font-semibold">Schemas recomendados</p>
                            <p className="text-xl font-bold text-primary mt-1">{(seoResult.structuredData?.toImplement || []).length}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <p className="text-[10px] font-semibold text-green-500 uppercase tracking-widest">{t.dashboard.tabs.seo.results.existing}</p>
                          <div className="flex flex-wrap gap-2">
                            {(seoResult.structuredData?.existing || []).map((s, i) => (
                              <span key={i} className="text-[10px] bg-green-500/10 text-green-500 px-3 py-1 rounded-full border border-green-500/20 font-bold">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <p className="text-[10px] font-semibold text-primary uppercase tracking-widest">{t.dashboard.tabs.seo.results.recommended}</p>
                          <div className="flex flex-wrap gap-2">
                            {(seoResult.structuredData?.toImplement || []).map((s, i) => (
                              <span key={i} className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full border border-brand-orange/20 font-bold">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 rounded-2xl border border-border bg-muted/30 space-y-2">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Ação recomendada</p>
                          <p className="text-[11px] text-foreground/80 leading-relaxed">
                            Priorize primeiro os schemas com maior impacto de rich results (ex.: Organization, Article, FAQ, Breadcrumb, Product) e valide no Rich Results Test.
                          </p>
                        </div>
                      </div>
                    </ResultCard>

                    {/* GEO Parameters */}
                    <ResultCard title={t.dashboard.tabs.seo.results.geoTitle} icon={<Zap size={18} />}>
                      <div className="space-y-3">
                        {(seoResult.geoParameters || []).map((geo, i) => (
                          <div key={i} className="p-4 bg-muted/50 border border-white/5 rounded-2xl space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-primary uppercase tracking-tighter">{geo.parameter}</span>
                              <span className="text-[9px] bg-muted px-2 py-0.5 rounded-full font-semibold">{geo.status}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">{geo.recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </ResultCard>

                    {/* Page Speed Metrics */}
                    <ResultCard title={t.dashboard.tabs.seo.results.speedTitle} icon={<TrendingUp size={18} />}>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          {(seoResult.pageSpeed?.metrics || []).map((m, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-2xl border border-white/5">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]",
                                  m.status === 'good' ? "bg-green-500 shadow-green-500/50" : m.status === 'regular' ? "bg-yellow-500 shadow-yellow-500/50" : "bg-red-500 shadow-red-500/50"
                                )} />
                                <span className="text-xs font-semibold">{m.name}</span>
                              </div>
                              <span className="text-xs font-mono font-bold text-muted-foreground">{m.value}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-muted-foreground text-center italic font-medium">
                          {t.dashboard.tabs.seo.results.metricsSimulated}
                        </p>
                      </div>
                    </ResultCard>

                    {/* Improvements Checklist */}
                    <ResultCard title={t.dashboard.tabs.seo.results.checklistTitle} icon={<Check size={18} />}>
                      <div className="space-y-3">
                        {(seoResult.checklist || []).map((item, i) => (
                          <div key={i} className="flex items-start gap-4 p-3 bg-muted/50 rounded-2xl border border-white/5">
                            <div className={cn(
                              "mt-0.5 p-1.5 rounded-full shrink-0",
                              item.status === 'good' ? "bg-green-500/20 text-green-500" : 
                              item.status === 'regular' ? "bg-yellow-500/20 text-yellow-500" : 
                              "bg-red-500/20 text-red-500"
                            )}>
                              {item.status === 'good' ? <Check size={14} /> : item.status === 'regular' ? <Info size={14} /> : <X size={14} />}
                            </div>
                            <div className="space-y-1">
                              <span className="text-[11px] font-semibold block">{item.criterion}</span>
                              <p className="text-[10px] text-muted-foreground leading-tight font-medium">{item.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ResultCard>
                  </div>

                  {/* Implementation Plan */}
                  <div className="card-elevated p-8 space-y-6 border-brand-orange/30">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/20 p-3 rounded-2xl">
                        <Lightbulb size={24} className="text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">{t.dashboard.tabs.seo.actionPlan}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(seoResult.improvements || []).map((imp, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-muted/50 rounded-2xl border border-white/5 hover:border-brand-orange/30 transition-colors group">
                          <span className="text-primary font-black text-sm group-hover:scale-110 transition-transform">0{i + 1}</span>
                          <p className="text-xs text-foreground leading-relaxed font-medium">{imp}</p>
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
            <section className="bg-primary/5 rounded-[40px] overflow-hidden border border-primary/20">
              <div 
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-all"
                onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary/20 p-3 rounded-2xl">
                    <Key size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{t.dashboard.tabs.keywords.title}</h3>
                    <p className="text-xs text-muted-foreground font-medium">{t.dashboard.tabs.keywords.subtitle}</p>
                  </div>
                </div>
                <div className="bg-muted/50 p-2 rounded-full">
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
                      <div className="step-card bg-muted/50 border-border p-4 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-blue-500/20 p-2 rounded-xl">
                            <Globe size={16} className="text-blue-500" />
                          </div>
                          <span className="text-xs font-semibold">{t.dashboard.tabs.keywords.step1Title}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                          {t.dashboard.tabs.keywords.step1Desc}
                        </p>
                      </div>
                      <div className="step-card bg-muted/50 border-border p-4 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-purple-500/20 p-2 rounded-xl">
                            <Shield size={16} className="text-purple-500" />
                          </div>
                          <span className="text-xs font-semibold">{t.dashboard.tabs.keywords.step2Title}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                          {t.dashboard.tabs.keywords.step2Desc}
                        </p>
                      </div>
                      <div className="step-card bg-muted/50 border-border p-4 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-green-500/20 p-2 rounded-xl">
                            <Key size={16} className="text-green-500" />
                          </div>
                          <span className="text-xs font-semibold">{t.dashboard.tabs.keywords.step3Title}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                          {t.dashboard.tabs.keywords.step3Desc}
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
                <div className="bg-muted/50 p-2 rounded-lg">
                  <History size={16} className="text-muted-foreground" />
                </div>
                <h3 className="text-sm font-semibold italic">{t.dashboard.tabs.keywords.history}</h3>
                <span className="bg-muted/50 px-3 py-1 rounded-full text-[10px] text-muted-foreground font-semibold border border-white/5">1/5</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {keywordHistory.map(item => (
                  <div key={item.id} className="card-elevated p-5 flex items-center justify-between hover:border-brand-orange/30 transition-all group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-2.5 rounded-xl group-hover:bg-primary/20 transition-colors">
                        <Key size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{item.domain}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{item.date} · {item.count} keywords</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group/btn">
                      <Trash2 size={16} className="text-muted-foreground group-hover/btn:text-red-500 transition-colors" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Keyword Form */}
            <section className="card-elevated p-8 space-y-8 border-brand-orange/20">
              <div className="flex items-center gap-4">
                <div className="bg-primary/20 p-3 rounded-2xl">
                  <Key size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{t.dashboard.tabs.keywords.formTitle}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{t.dashboard.tabs.keywords.step1Title}</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="https://seudominio.com"
                    value={targetDomain}
                    onChange={(e) => setTargetDomain(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{t.dashboard.tabs.keywords.competitors}</label>
                  <form onSubmit={handleAddBrandUrl} className="flex gap-2">
                    <input
                      type="text"
                      className="input-field"
                      placeholder="https://concorrente.com"
                      value={brandUrlInput}
                      onChange={(e) => setBrandUrlInput(e.target.value)}
                    />
                    <button type="submit" className="bg-brand-card border border-border p-2.5 rounded-lg hover:bg-brand-card-hover transition-all">
                      <Plus size={18} />
                    </button>
                  </form>
                  <div className="flex flex-wrap gap-2">
                    {brandUrls.map(url => (
                      <span key={url} className="tag bg-muted/50 border-border text-[10px] px-3 py-1.5 rounded-full font-semibold">
                        {url}
                        <X size={12} className="cursor-pointer hover:text-orange-300" onClick={() => removeBrandUrl(url)} />
                      </span>
                    ))}
                    {brandUrls.length === 0 && <span className="text-[10px] text-muted-foreground italic font-medium">{t.dashboard.tabs.keywords.noneAdded}</span>}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleFetchKeywords}
                disabled={loading || brandUrls.length === 0}
                className="btn-primary w-full max-w-md mx-auto py-4 text-base group"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <Search size={24} className="group-hover:scale-110 transition-transform" />}
                {t.dashboard.tabs.keywords.action}
              </button>
            </section>

            {/* Keyword Results */}
            <AnimatePresence>
              {keywordResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8 pt-8 border-t border-border"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Keyword Gap Analysis</h2>
                    <div className="flex items-center gap-4">
                      <button className="text-[10px] font-semibold text-muted-foreground hover:text-primary flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full border border-white/5 transition-all">
                        <Download size={14} />
                        {t.dashboard.tabs.keywords.exportCsv}
                      </button>
                    </div>
                  </div>

                  <div className="card-elevated overflow-hidden border-border rounded-[32px]">
                    <div className="overflow-x-auto no-scrollbar">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border">
                            <th className="p-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{t.dashboard.tabs.keywords.table.term}</th>
                            <th className="p-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{t.dashboard.tabs.keywords.table.volume}</th>
                            <th className="p-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{t.dashboard.tabs.keywords.table.difficulty}</th>
                            <th className="p-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{t.dashboard.tabs.keywords.table.intent}</th>
                            <th className="p-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{t.dashboard.tabs.keywords.table.competitors}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {keywordResult.keywords.map((k, i) => (
                            <tr key={i} className="hover:bg-muted/50 transition-colors group">
                              <td className="p-6">
                                <span className="text-sm font-semibold text-primary uppercase tracking-tight">{k.term}</span>
                              </td>
                              <td className="p-6">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{k.volume}</span>
                              </td>
                              <td className="p-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-16 bg-muted/50 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                      className={cn(
                                        "h-full transition-all duration-1000",
                                        k.difficulty < 30 ? "bg-green-500" : k.difficulty < 60 ? "bg-yellow-500" : "bg-red-500"
                                      )} 
                                      style={{ width: `${k.difficulty}%` }} 
                                    />
                                  </div>
                                  <span className="text-[10px] font-semibold">{k.difficulty}</span>
                                </div>
                              </td>
                              <td className="p-6">
                                <span className={cn(
                                  "text-[9px] px-3 py-1 rounded-full border font-semibold",
                                  k.intent === 'Informativo' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                  k.intent === 'Transacional' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                  k.intent === 'Navegacional' ? "bg-purple-500/10 text-purple-500 border-purple-500/20" :
                                  "bg-primary/10 text-primary border-brand-orange/20"
                                )}>
                                  {k.intent}
                                </span>
                              </td>
                              <td className="p-6">
                                <div className="flex flex-wrap gap-2">
                                  {k.competitors.map((c, j) => (
                                    <span key={j} className="text-[9px] text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg border border-white/5 font-bold uppercase tracking-tight">
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
                    <ResultCard title={t.dashboard.tabs.keywords.opportunities} icon={<Lightbulb size={18} />}>
                      <ul className="space-y-4">
                        {keywordResult.opportunities.map((opp, i) => (
                          <li key={i} className="flex items-start gap-4 text-xs text-muted-foreground leading-relaxed font-medium">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(255,77,0,0.5)]" />
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
            <section className="bg-primary/5 p-6 space-y-6 border border-primary/20 rounded-[40px]">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-primary" />
                <h3 className="text-sm font-semibold">{t.dashboard.tabs.gaps.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{t.dashboard.tabs.gaps.subtitle}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Domínio</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="https://seudominio.com"
                    value={targetDomain}
                    onChange={(e) => setTargetDomain(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Concorrentes</label>
                  <form onSubmit={handleAddBrandUrl} className="flex gap-2">
                    <input
                      type="text"
                      className="input-field"
                      placeholder="https://concorrente.com"
                      value={brandUrlInput}
                      onChange={(e) => setBrandUrlInput(e.target.value)}
                    />
                    <button type="submit" className="bg-brand-card border border-border p-2.5 rounded-lg hover:bg-brand-card-hover transition-all">
                      <Plus size={18} />
                    </button>
                  </form>
                  <div className="flex flex-wrap gap-2">
                    {brandUrls.map(url => (
                      <span key={url} className="tag bg-muted/50 border-border text-[10px] px-3 py-1.5 rounded-full font-semibold">
                        {url}
                        <X size={12} className="cursor-pointer hover:text-orange-300" onClick={() => removeBrandUrl(url)} />
                      </span>
                    ))}
                    {brandUrls.length === 0 && (
                      <span className="text-[10px] text-muted-foreground italic font-medium">
                        Adicione ao menos 1 concorrente para comparar.
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleAnalyzeGaps}
                disabled={loading || brandUrls.length === 0}
                className="btn-primary w-full max-w-md mx-auto py-4 text-base"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Target size={20} />}
                {t.dashboard.tabs.gaps.action}
              </button>
            </section>

            <AnimatePresence>
              {gapResult && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="card-elevated p-6">
                  <h4 className="text-sm font-semibold mb-4">{t.dashboard.tabs.gaps.summary}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">{gapResult.summary}</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {gapResult.gaps.map((gap, i) => (
                    <div key={i} className="card-elevated p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-primary">{gap.topic}</span>
                        <p className="text-[11px] text-muted-foreground">{gap.opportunity}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">{t.dashboard.tabs.gaps.strength}</p>
                          <span className={cn(
                            "text-[10px] font-bold",
                            gap.competitorStrength === 'High' ? "text-red-500" : gap.competitorStrength === 'Medium' ? "text-yellow-500" : "text-green-500"
                          )}>{gap.competitorStrength}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">{t.dashboard.tabs.gaps.priority}</p>
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
            <section className="bg-primary/5 p-6 space-y-6 border border-primary/20 rounded-[40px]">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-primary" />
                <h3 className="text-sm font-semibold">{t.dashboard.tabs.recs.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{t.dashboard.tabs.recs.subtitle}</p>
              
              {actionMessage?.type === 'error' && (
                <div className="bg-red-950/20 border border-red-500/30 text-red-500 text-xs p-3 rounded-lg">
                  {actionMessage.text}
                </div>
              )}
              
              {actionMessage?.type === 'success' && (
                <div className="bg-green-950/20 border border-green-500/30 text-green-500 text-xs p-3 rounded-lg flex items-center gap-2">
                  <Check size={14} />
                  {actionMessage.text}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">
                    <Globe size={12} className="inline mr-1" />
                    Domínio (opcional)
                  </label>
                  <input 
                    type="text" 
                    className="input-field w-full" 
                    placeholder="Ex: seublog.com | Deixe vazio para usar o domínio principal"
                    value={recsDomain}
                    onChange={(e) => setRecsDomain(e.target.value)}
                  />
                </div>
              </div>
              
              <button 
                onClick={handleGenerateRecs}
                disabled={loading}
                className="btn-primary w-full max-w-md mx-auto py-4 text-base"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                {t.dashboard.tabs.recs.action}
              </button>
            </section>

            <AnimatePresence>
              {recResult && (recResult.recommendations?.length || 0) > 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold">{t.dashboard.tabs.recs.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{recResult.recommendations.length} recomendações geradas</p>
                    </div>
                    <ExportToolbar />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recResult.recommendations.map((rec, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="card-elevated p-4 space-y-3 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={cn(
                            "text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase whitespace-nowrap",
                            rec.type === 'Novo Conteúdo' ? "bg-blue-950/20 text-blue-500 border-blue-500/30" :
                            rec.type === 'Otimização' ? "bg-yellow-950/20 text-yellow-500 border-yellow-500/30" :
                            rec.type === 'Reciclagem' ? "bg-green-950/20 text-green-500 border-green-500/30" :
                            "bg-purple-950/20 text-purple-500 border-purple-500/30"
                          )}>
                            {rec.type}
                          </span>
                          <span className={cn(
                            "text-[9px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap",
                            rec.expectedImpact === 'Crítico' ? "bg-red-950/20 text-red-400" :
                            rec.expectedImpact === 'Alto' ? "bg-orange-950/20 text-orange-400" :
                            "bg-yellow-950/20 text-yellow-400"
                          )}>
                            {rec.expectedImpact}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold leading-tight">{rec.title}</h4>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{rec.reason}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : recResult ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-yellow-950/10 border border-yellow-500/20 rounded-lg p-6 text-center space-y-2"
                >
                  <p className="text-sm font-semibold">Sem recomendações disponíveis</p>
                  <p className="text-xs text-muted-foreground">Realize uma análise (Pesquisa, Gaps ou Keywords) primeiro para gerar recomendações.</p>
                </motion.div>
              ) : null}
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
            <section className="bg-primary/5 p-6 space-y-6 border border-primary/20 rounded-[40px]">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                <h3 className="text-sm font-semibold">{t.dashboard.tabs.editorial.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{t.dashboard.tabs.editorial.subtitle}</p>
              
              {actionMessage?.type === 'error' && (
                <div className="bg-red-950/20 border border-red-500/30 text-red-500 text-xs p-3 rounded-lg">
                  {actionMessage.text}
                </div>
              )}
              
              {actionMessage?.type === 'success' && (
                <div className="bg-green-950/20 border border-green-500/30 text-green-500 text-xs p-3 rounded-lg flex items-center gap-2">
                  <Check size={14} />
                  {actionMessage.text}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">
                    <Globe size={12} className="inline mr-1" />
                    Domínio (opcional)
                  </label>
                  <input 
                    type="text" 
                    className="input-field w-full" 
                    placeholder="Ex: seublog.com | Deixe vazio para usar o domínio principal"
                    value={editorialDomain}
                    onChange={(e) => setEditorialDomain(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">
                    <Calendar size={12} className="inline mr-1" />
                    Período do Calendário
                  </label>
                  <div className="flex gap-2">
                    {[2, 4, 8].map((weeks) => (
                      <button
                        key={weeks}
                        onClick={() => setEditorialPeriod(weeks as 2 | 4 | 8)}
                        className={cn(
                          "flex-1 px-3 py-2 rounded-lg text-xs font-semibold border transition-all",
                          editorialPeriod === weeks
                            ? "bg-primary text-white border-primary shadow-lg"
                            : "bg-muted border-border hover:bg-muted/80"
                        )}
                      >
                        {weeks} semanas
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handlePlanEditorial}
                disabled={loading}
                className="btn-primary w-full max-w-md mx-auto py-4 text-base"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Calendar size={20} />}
                {t.dashboard.tabs.editorial.action}
              </button>
            </section>

            <AnimatePresence>
              {editorialResult && (editorialResult.calendar?.length || 0) > 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold">{t.dashboard.tabs.editorial.planTitle}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{editorialResult.calendar.length} semanas planejadas</p>
                    </div>
                    <ExportToolbar />
                  </div>
                  
                  {editorialResult.calendar.map((week, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3 pb-3 border-b border-border">
                        <div className="bg-primary/20 p-2 rounded-lg">
                          <Calendar size={16} className="text-primary" />
                        </div>
                        <h4 className="text-sm font-semibold">{week.week}</h4>
                        <span className="text-xs text-muted-foreground ml-auto">{week.topics?.length || 0} tópicos</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(week.topics || []).map((topic, j) => (
                          <motion.div 
                            key={j}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (i * week.topics!.length + j) * 0.02 }}
                            className="card-elevated p-4 space-y-3 hover:shadow-md transition-shadow"
                          >
                            <div className="space-y-2">
                              <p className="text-sm font-bold leading-snug text-foreground">{topic.title}</p>
                              <div className="flex flex-wrap gap-2">
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                                  {topic.format}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                                  {topic.channel}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-2 border-t border-border">
                              <span className={cn(
                                "text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1",
                                topic.status === 'Planejado' ? "bg-blue-950/20 text-blue-400 border border-blue-500/30" :
                                topic.status === 'Em Produção' ? "bg-yellow-950/20 text-yellow-400 border border-yellow-500/30" :
                                "bg-green-950/20 text-green-400 border border-green-500/30"
                              )}>
                                <span className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  topic.status === 'Planejado' ? "bg-blue-400" :
                                  topic.status === 'Em Produção' ? "bg-yellow-400" :
                                  "bg-green-400"
                                )}></span>
                                {topic.status}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : editorialResult ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-yellow-950/10 border border-yellow-500/20 rounded-lg p-6 text-center space-y-2"
                >
                  <p className="text-sm font-semibold">Sem calendário disponível</p>
                  <p className="text-xs text-muted-foreground">Tente novamente ou gere uma análise (Pesquisa, Gaps ou Keywords) como base.</p>
                </motion.div>
              ) : null}
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
          <LandingPage
            onEnter={(tab) => {
              setActiveTab(tab ?? 'Pesquisa');
              setShowLanding(false);
            }}
            language={language}
            setLanguage={setLanguage}
          />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-background text-foreground pb-20 overflow-x-hidden"
        >
          <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-6" role="banner">
            <div className="flex justify-center">
              <nav className="flex items-center gap-10 px-8 h-14 rounded-full border border-border bg-background/80 backdrop-blur-md shadow-lg relative overflow-hidden transition-all duration-300">
                
                {/* Neon border beam effect - Inspired by Header-fernando */}
                <div className="absolute inset-0 rounded-full pointer-events-none overflow-hidden">
                  <div className="absolute inset-x-8 top-0 h-px">
                     <div className="w-full h-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-60 animate-pulse shadow-[0_0_15px_rgba(var(--primary),0.5)]"></div>
                  </div>
                  <div className="absolute inset-x-8 bottom-0 h-px">
                     <div className="w-full h-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-60 animate-pulse shadow-[0_0_15px_rgba(var(--primary),0.5)]"></div>
                  </div>
                </div>

                <div className="flex items-center gap-2 cursor-pointer group relative z-10" onClick={() => setShowLanding(true)}>
                  <img src="/contenthub-light.png" alt="Content Hub Light" className="h-6 w-auto logo-light" />
                  <img src="/contenthub-dark.png" alt="Content Hub Dark" className="h-6 w-auto logo-dark" />
                </div>
                
                <div className="flex items-center gap-3 relative z-10">
                  {/* Language Switch */}
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

                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-full border border-border/50 hover:bg-accent transition-all duration-200 bg-background/50"
                  >
                    {darkMode ? <Sun size={14} /> : <Moon size={14} />}
                  </button>

                  <div className="h-4 w-px bg-border/50 mx-1 hidden sm:block" />

                  <button
                    onClick={() => {
                       localStorage.removeItem('hub_persistent_state_v2');
                       window.location.reload();
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black tracking-widest text-red-500/70 hover:text-red-500 transition-all duration-200 uppercase"
                  >
                    Reset
                    <Trash2 size={12} />
                  </button>

                  <div className="h-4 w-px bg-border/50 mx-1 hidden sm:block" />

                  <button
                    onClick={() => setShowLanding(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black tracking-widest text-muted-foreground hover:text-foreground transition-all duration-200 uppercase"
                  >
                    {t.dashboard.logout}
                    <LogOut size={12} />
                  </button>
                </div>
              </nav>
            </div>
          </header>

          <main className="max-w-5xl mx-auto px-6 pt-24 space-y-8">
            {/* Navigation Tabs */}
            <nav className="flex flex-wrap gap-1.5 p-1.5 bg-muted/40 border border-border rounded-xl overflow-x-auto no-scrollbar">
              {tabs.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap",
                    activeTab === id 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </nav>

            {actionMessage && (
              <div
                className={cn(
                  "rounded-xl border px-4 py-3 text-sm font-medium",
                  actionMessage.type === 'error'
                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                )}
              >
                {actionMessage.text}
              </div>
            )}

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
                      className="space-y-12 pt-12 border-t border-border"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                            {t.dashboard.resultsArea}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <ExportToolbar />
                          <button onClick={copyToClipboard} className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors">
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? t.dashboard.copied : t.dashboard.exportJson}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <ResultCard title="Content Landscape" icon={<LayoutGrid size={18} />}>
                          <div className="space-y-6">
                            {(result.landscape || []).map((item, i) => (
                              <div key={i} className="space-y-3">
                                <p className="text-[10px] font-semibold text-primary">{item.site}</p>
                                <div className="flex flex-wrap gap-2">
                                  {item.themes.map((theme, j) => (
                                    <span key={j} className="text-[10px] font-medium bg-accent px-3 py-1 rounded-full border border-border text-muted-foreground">
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
                            {(result.gaps || []).map((gap, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                                {gap}
                              </li>
                            ))}
                          </ul>
                        </ResultCard>

                        <ResultCard title="Content Ideas" icon={<Lightbulb size={18} />}>
                          <div className="space-y-4">
                            {(result.ideas || []).map((idea, i) => (
                              <div key={i} className="p-4 rounded-xl bg-accent/50 border border-border space-y-2">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-semibold">{idea.title}</h4>
                                  <span className="text-[9px] uppercase font-semibold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">{idea.format}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">{idea.description}</p>
                              </div>
                            ))}
                          </div>
                        </ResultCard>

                        <ResultCard title="Strategic Insights" icon={<TrendingUp size={18} />}>
                          <div className="space-y-6">
                            {(result.insights || []).map((insight, i) => (
                              <div key={i} className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                                <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
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
    <div className="card-elevated p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          {icon}
        </div>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}
