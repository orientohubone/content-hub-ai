# 📋 Documentação Técnica - Content Hub AI

Guia completo para desenvolvedores trabalhando no projeto.

---

## 🏗️ Arquitetura

### Camadas da Aplicação

```
┌─────────────────────────────────────┐
│        React Components (UI)         │ ← Landing Page, Dashboard Tabs
├─────────────────────────────────────┤
│      React State Management          │ ← useState hooks
├─────────────────────────────────────┤
│      Services Layer (API Calls)      │ ← geminiService, firecrawlService
├─────────────────────────────────────┤
│    External AI Services              │ ← Gemini, Firecrawl
└─────────────────────────────────────┘
```

---

## 🔧 Componentes Principais

### App.tsx (Dashboard)

**Responsabilidades:**
- Gerenciar estado global das análises
- Renderizar tabs do dashboard
- Controlar fluxo de dados entre abas
- Handle loading states e mensagens

**Estado gerenciado:**
```typescript
// Entrada
const [targetDomain, setTargetDomain] = useState('');
const [searchTerm, setSearchTerm] = useState('');

// Pesquisa Competitiva
const [result, setResult] = useState<AnalysisResult | null>(null);

// Trends
const [trendResult, setTrendResult] = useState<TrendResult | null>(null);
const [trendPeriod, setTrendPeriod] = useState('Semana');

// SEO
const [seoUrl, setSeoUrl] = useState('');
const [seoResult, setSeoResult] = useState<SEOAuditResult | null>(null);

// Keywords
const [keywordResult, setKeywordResult] = useState<KeywordResult | null>(null);

// Gaps
const [gapResult, setGapResult] = useState<GapResult | null>(null);

// Recomendações
const [recResult, setRecResult] = useState<RecResult | null>(null);
const [recsDomain, setRecsDomain] = useState('');

// Editorial
const [editorialResult, setEditorialResult] = useState<EditorialResult | null>(null);
const [editorialDomain, setEditorialDomain] = useState('');
const [editorialPeriod, setEditorialPeriod] = useState<2 | 4 | 8>(4);
```

**Funções principais:**
```typescript
const handleAnalyze = async ()              // Pesquisa competitiva
const handleFetchTrends = async ()          // Trends
const handleAnalyzeSEO = async ()           // SEO Audit
const handleFetchKeywords = async ()        // Keywords
const handleAnalyzeGaps = async ()          // Content Gaps
const handleGenerateRecs = async ()         // Recomendações
const handlePlanEditorial = async ()        // Editorial
const handleAnalyzeBranding = async ()      // Branding
const handleRecylerTransform = async ()     // Recycler
```

### LandingPage.tsx

**Responsabilidades:**
- Exibir landing page com hero section
- Showcase de features
- Como funciona
- AI section
- Call-to-actions

**Props:**
```typescript
interface LandingPageProps {
  onEnter: (tab?: LandingTab) => void;    // Callback ao entrar
  language: Language;                      // PT ou EN
  setLanguage: (lang: Language) => void;  // Mudar idioma
}
```

---

## 📡 Serviços de API

### geminiService.ts

**Configuração:**
```typescript
const DEFAULT_MODEL = "gemini-3-flash-preview";

function getGeminiApiKey(): string {
  // Priority: VITE_GEMINI_API_KEY > processo.env.GEMINI_API_KEY
}

export const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
```

**Funções exportadas:**

#### 1. analyzeCompetitors()
```typescript
async function analyzeCompetitors(
  userSite: string,
  searchTerms: string[],
  scrapedContent?: string
): Promise<AnalysisResult>
```

**Uso:**
```typescript
const analysis = await analyzeCompetitors(
  'meusite.com',
  ['marketing', 'seo'],
  'conteúdo opcional do site'
);

// Retorna
{
  landscape: [
    {
      site: 'concorrente.com',
      themes: ['marketing', 'growth', 'sales']
    }
  ],
  gaps: ['video marketing', 'webinars'],
  ideas: [
    {
      title: 'Como fazer marketing no TikTok',
      description: 'Guia prático',
      format: 'Blog Post'
    }
  ],
  insights: ['Mercado em alta', ...]
}
```

#### 2. fetchTrends()
```typescript
async function fetchTrends(
  period: string,               // 'Última hora' | 'Hoje' | 'Semana' | 'Mês'
  queries: string[]
): Promise<TrendResult>
```

**Exemplo:**
```typescript
const trends = await fetchTrends(
  'Semana',
  ['IA', 'marketing', 'redes sociais']
);

// Retorna
{
  trends: [
    {
      title: 'IA generativa em marketing',
      description: 'Tendência em alta',
      relevance: 85,
      source: 'TechCrunch',
      url: 'https://...'
    }
  ],
  summary: 'Uma tendência promissora...'
}
```

#### 3. fetchKeywords()
```typescript
async function fetchKeywords(
  domain: string,
  competitors: string[]
): Promise<KeywordResult>
```

**Retorna:**
```typescript
{
  keywords: [
    {
      term: 'marketing digital',
      volume: '10k-100k',
      difficulty: 65,
      intent: 'Informativo',
      competitors: ['site1.com', 'site2.com']
    }
  ],
  opportunities: ['long tail keywords', ...]
}
```

#### 4. analyzeGaps()
```typescript
async function analyzeGaps(
  domain: string,
  competitors: string[]
): Promise<GapResult>
```

---

### firecrawlService.ts

**Funções exportadas:**

#### 1. scrapeUrl()
```typescript
async function scrapeUrl(url: string): Promise<{
  data: {
    markdown?: string;
    content?: string;
    metadata?: Record<string, any>;
  };
}>
```

**Uso:**
```typescript
const result = await scrapeUrl('https://example.com');
const markdown = result.data.markdown;
const htmlContent = result.data.content;
```

#### 2. mapDomain()
```typescript
async function mapDomain(domain: string): Promise<{
  urls: Array<{
    url: string;
    title: string;
    lastModified?: string;
  }>;
  totalUrls: number;
  lastScanned: string;
}>
```

#### 3. extractStructured()
```typescript
async function extractStructured(url: string): Promise<{
  structured: Array<{
    type: string;
    content: Record<string, any>;
  }>;
}>
```

---

## 🎨 Componentes UI

### Button.tsx
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'hero' | 'hero-outline' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon';
  asChild?: boolean;
}
```

**Variantes:**
- `default`: Botão padrão
- `hero`: Grande, com sombra (calls-to-action principais)
- `hero-outline`: Outline hero
- `outline`: Com borda
- `ghost`: Sem fundo
- `secondary`: Cor secundária
- `destructive`: Vermelho (ações perigosas)
- `link`: Apenas texto

**Tamanhos:**
- `default`: 36px
- `sm`: 32px
- `lg`: 44px
- `xl`: 48px
- `icon`: Quadrado 36px

### Card.tsx
```typescript
<Card>
  <CardHeader>
    <h3>Título</h3>
  </CardHeader>
  <CardContent>
    Conteúdo
  </CardContent>
  <CardFooter>
    Rodapé opcional
  </CardFooter>
</Card>
```

### Badge.tsx
```typescript
<Badge variant="outline" className="text-primary">
  Label
</Badge>
```

---

## 🌐 Estado Global & Context

Atualmente usando `useState` hooks. Para futuras escalabilidades, considerar:

- Redux Toolkit
- Zustand
- Jotai
- TanStack Query (para caching)

**Padrão atual:**
```typescript
// Em App.tsx
const [state, setState] = useState(initialValue);

// Props drilling para componentes filhos
// Props callbacks para atualizações
```

---

## 🌍 Internacionalização (i18n)

Arquivo: `src/translations.ts`

**Estrutura:**
```typescript
export const translations = {
  en: { /* traduções em inglês */ },
  pt: { /* traduções em português */ }
};
```

**Usar traduções:**
```typescript
import { translations, Language } from './translations';

// Em um componente
const [language, setLanguage] = useState<Language>('pt');
const t = translations[language];

return <h1>{t.hero.title1}</h1>;
```

**Adicionar nova chave:**
1. Adicione em `translations.en`
2. Adicione em `translations.pt`
3. Use com `t.chave.subchave.etc`

---

## 🔐 Variáveis de Ambiente

### Necessárias

```env
VITE_GEMINI_API_KEY=string          # Chave Google Gemini
VITE_FIRECRAWL_API_KEY=string       # Chave Firecrawl
```

### Opcionais

```env
VITE_APP_ENV=development|production
VITE_API_TIMEOUT=30000              # Em ms
VITE_MAX_RETRIES=3
```

**Acesso em código:**
```typescript
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
```

---

## 📊 Normalização de Dados

### Padrão Geral

Cada serviço valida e normaliza dados antes de retornar:

```typescript
const normalizeSeoResult = (raw: any): SEOAuditResult => {
  const safe = raw && typeof raw === 'object' ? raw : {};
  
  return {
    url: typeof safe.url === 'string' ? safe.url : '',
    wordCount: Number.isFinite(Number(safe.wordCount)) ? Number(safe.wordCount) : 0,
    // ... mais campos
  };
};
```

**Benefícios:**
- Tipagem TypeScript garantida
- Fallbacks para valores inválidos
- Sem erros em runtime

---

## 🎬 Fluxo de Análise Completa

```
1. Usuário digita domínio → setTargetDomain()
2. Clica "Analisar" → handleAnalyze()
3. Valida entrada
4. Chama analyzeCompetitors()
5. Gemini processa
6. Normaliza resultado
7. setResult()
8. UI renderiza com animações
```

**Tempo estimado:** 8-12 segundos

---

## 🧪 Padrões de Teste

### Teste de serviço
```typescript
describe('analyzeCompetitors', () => {
  it('deve retornar landscape válido', async () => {
    const result = await analyzeCompetitors('test.com', ['keyword']);
    expect(result.landscape).toBeDefined();
  });
});
```

### Teste de componente
```typescript
describe('Button', () => {
  it('deve renderizar com variant hero', () => {
    const { getByText } = render(<Button variant="hero">Click</Button>);
    expect(getByText('Click')).toBeInTheDocument();
  });
});
```

---

## ⚡ Performance

### Otimizações atuais

- **Lazy loading**: LandingPage & Dashboard separados
- **Debouncing**: Input fields (não implementado ainda)
- **Memoization**: Componentes com `React.memo`
- **Code splitting**: Vite automático

### Melhorias futuras

```typescript
// Usar useMemo para computações pesadas
const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);

// Usar useCallback para funções
const handleClick = useCallback(() => {
  // lógica
}, [dependencies]);

// React.lazy para código splitting manual
const Dashboard = React.lazy(() => import('./Dashboard'));
```

---

## 🐛 Debug

### Console logs estruturados
```typescript
console.log('[ANALYZE] Starting...', { domain, terms });
console.error('[ERROR] API failed:', error);
```

### React DevTools Extensions
- React Developer Tools
- Redux DevTools (quando implementado)

### Vite Debug
```bash
DEBUG=* npm run dev
```

---

## 📈 Escalabilidade

### Quando estiver grande

1. **Separar App.tsx** em múltiplos arquivos
2. **Usar Context API ou Redux** para estado global
3. **Implementar React Router** para múltiplas páginas
4. **API Backend** para caching e processamento
5. **WebSockets** para real-time updates
6. **Testing** completo (Jest + React Testing Library)

---

## 🔗 Referências para Desenvolvedores

- [React Hooks Documentation](https://react.dev/reference/react)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Utilities](https://tailwindcss.com/docs/utility-first)
- [Framer Motion Guide](https://www.framer.com/motion/)
- [Vite Configuration](https://vitejs.dev/config/)

---

**Última atualização: Março 30, 2026**
