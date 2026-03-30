# Content Hub AI 🚀

**Plataforma inteligente de análise competitiva, trends e estratégia de conteúdo com IA nativa**

> Uma solução completa que combina pesquisa competitiva, análise de tendências, auditoria SEO, geração automática de calendários editoriais e reciclagem de conteúdo — tudo alimentado por **Google Gemini 2.0** e **Firecrawl**.

---

## 📋 Visão Geral

**Content Hub AI** é uma plataforma SaaS moderna que transforma dados brutos em estratégia de conteúdo acionável em minutos. Utilize-a para:

- ✅ **Análise Competitiva**: Mapeie concorrentes e identifique lacunas de conteúdo
- ✅ **Radar de Trends**: Detecte tendências emergentes com análise semântica
- ✅ **Brand Intelligence**: Monitore menções de marca e extraia identidade visual
- ✅ **Auditoria SEO**: Diagnóstico técnico completo com Core Web Vitals
- ✅ **Keyword Research**: Descubra oportunidades com volume e dificuldade
- ✅ **Content Gaps**: Identifique exatamente o que está faltando
- ✅ **Recomendações IA**: Planos de ação priorizados por ROI
- ✅ **Calendário Editorial**: 4 semanas de conteúdo estratégico
- ✅ **Reciclador de Conteúdo**: Transforme artigos em carrosséis prontos
- ✅ **Monitor de Sitemap**: Detecte automaticamente novos conteúdos

---

## 🎯 Funcionalidades Principais

### 1️⃣ **Pesquisa Competitiva** (`Pesquisa`)
Analise qualquer domínio e mapeie sua estratégia competitiva.

**O que você obtém:**
- Landscape do mercado com 3-5 concorrentes principais
- Identificação de gaps de conteúdo
- 5 ideias táticas de conteúdo (título, descrição, formato)
- Insights estratégicos de alto nível

**Como funciona:**
```javascript
// Uso na aplicação
const result = await analyzeCompetitors(
  'seublog.com',                    // seu domínio
  ['tema1', 'tema2'],               // termos de busca
  'conteúdo do site'                // contexto opcional
);
```

---

### 2️⃣ **Radar de Trends** (`Trends`)
Detecte tendências em tempo real do seu nicho de mercado.

**Períodos suportados:**
- Última hora
- Hoje
- Semana
- Mês

**Retorno:**
- Lista de trends com relevância 1-100
- Fonte e URL oficial
- Resumo estratégico das oportunidades

---

### 3️⃣ **Brand Intelligence** (`Brands`)
Extraia e analise a identidade visual e presença de marcas.

**Análise:**
- Paleta de cores detectada
- Tipografia utilizada
- Logos identificados
- Elemento tipográfico
- Resumo executivo da marca

---

### 4️⃣ **Reciclador de Conteúdo** (`Recycler`)
Transforme artigos em carrosséis prontos para redes sociais.

**Configurações:**
- Contagem de slides: 5, 8 ou 10
- Estilos: Educacional, Provocativo, Storytelling, Data-driven

**Saída:**
- Carrosséis estruturados e prontos para publicação

---

### 5️⃣ **Monitor de Sitemap** (`Watch`)
Detecte automaticamente novos conteúdos publicados por concorrentes.

**Monitoramento:**
- URLs adicionadas por domínio
- Data de publicação
- Títulos detectados
- Total de URLs no sitemap

---

### 6️⃣ **Auditoria SEO** (`SEO`)
Diagnóstico técnico profundo de qualquer página.

**Métricas coletadas:**
- Quality Score (0-100)
- Page Speed Score (0-100)
- EEAT Score (0-10)
- Word count da página
- Estrutura de headings
- Meta tags
- Dados estruturados
- Core Web Vitals
- Recomendações de otimização
- Parâmetros geográficos

---

### 7️⃣ **Keywords Estratégicas** (`Keywords`)
Descubra palavras-chave de alto impacto.

**Para cada keyword:**
- Volume de busca
- Dificuldade (0-100)
- Intenção (Informativo, Transacional, Navegacional, Comercial)
- Concorrentes ranqueando

**Oportunidades:**
- Sugestões de gaps de keywords

---

### 8️⃣ **Content Gaps** (`Gaps`)
Análise estratégica de lacunas de conteúdo.

**Para cada gap:**
- Tópico identificado
- Força dos concorrentes (High, Medium, Low)
- Oportunidade (acionável)
- Prioridade (High, Medium, Low)
- Resumo executivo

---

### 9️⃣ **Recomendações IA** (`Recs`)
Planos de ação priorizados por impacto.

**Tipos de recomendação:**
- **Novo Conteúdo**: Criar novos assets
- **Otimização**: Melhorar conteúdo existente
- **Reciclagem**: Reutilizar conteúdo

**Impacto esperado:**
- Crítico (quick wins imediatos)
- Alto (valor a longo prazo)
- Médio (ações de suporte)

**Configurações:**
- Define domínio específico ou usa o principal
- Baseado em Pesquisa, Gaps e Keywords

---

### 🔟 **Calendário Editorial** (`Editorial`)
Transforma insights em plano de execução de 4 semanas.

**Configurações:**
- Período: 2, 4 ou 8 semanas
- Domínio (opcional)

**Para cada tópico:**
- Título otimizado
- Formato (Blog Post, Video, Infográfico, Guia, Webinar, Podcast, Social Series)
- Canal de distribuição (Blog, YouTube, LinkedIn, Instagram, TikTok, Newsletter)
- Status (Planejado, Em Produção, Concluído)

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| React | 19.0.0 | Framework UI |
| Vite | 6.2.0 | Build tool & dev server |
| TypeScript | 5.8.2 | Tipagem estática |
| Tailwind CSS | 4.1.14 | Styling |
| Framer Motion | 12.23.24 | Animações |
| Lucide React | 0.546.0 | Ícones |

### Backend & Serviços
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| Google Gemini AI | 2.0 | IA nativa para análises |
| Firecrawl | Latest | Web scraping e extração de dados |
| Node.js | 18+ | Runtime |

### Desenvolvimento
| Ferramenta | Versão | Uso |
|-----------|--------|-----|
| TypeScript | 5.8.2 | Linting |
| Autoprefixer | 10.4.21 | CSS prefixes |
| ESLint | (viaTSC) | Linting |

---

## 📦 Pré-requisitos

- **Node.js** 18.0 ou superior
- **NPM** 9.0 ou superior (ou Yarn/PNPM)
- Chave de API do **Google Gemini**
- Chave de API do **Firecrawl** (opcional, para scraping)

---

## 🚀 Instalação & Setup

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/content-hub-ai.git
cd content-hub-ai
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# API Keys
VITE_GEMINI_API_KEY=seu_gemini_api_key_aqui
VITE_FIRECRAWL_API_KEY=seu_firecrawl_api_key_aqui

# Configuração da aplicação
VITE_APP_ENV=development
VITE_API_TIMEOUT=30000
```

> ⚠️ **Importante**: Nunca commit as credenciais no repositório. Use `.gitignore` para ignorer `.env.local`.

### 4. Verificar instalação

```bash
npm run lint
```

### 5. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em:
- **Local**: http://localhost:3000
- **Network**: http://seu-ip:3000

---

## 📂 Estrutura de Pastas

```
content-hub-ai/
├── src/
│   ├── components/
│   │   ├── LandingPage.tsx          # Página de destino (hero, features)
│   │   ├── LogoCloud.tsx            # Cloud de logos das funcionalidades
│   │   └── ui/                      # Componentes reutilizáveis
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── progress.tsx
│   │       ├── separator.tsx
│   │       └── InfiniteSlider.tsx
│   ├── services/
│   │   ├── geminiService.ts         # Integração com Google Gemini
│   │   └── firecrawlService.ts      # Integração com Firecrawl
│   ├── App.tsx                      # Dashboard principal e tabs
│   ├── main.tsx                     # Entry point
│   ├── index.css                    # Estilos globais
│   └── translations.ts              # i18n (PT & EN)
├── public/
│   ├── gemini-color.svg             # Logo Gemini
│   ├── firecrawl-logo.svg           # Logo Firecrawl
│   ├── contenthub-light.png         # Logo content hub (light)
│   ├── contenthub-dark.png          # Logo content hub (dark)
│   └── content.favicon.png
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

---

## 🏃 Scripts Disponíveis

```bash
# Development
npm run dev              # Inicia servidor com hot reload

# Build
npm run build            # Cria build otimizado para produção
npm run preview          # Visualiza build local

# Maintenance
npm run lint             # Verifica tipos TypeScript
npm run clean            # Remove pasta dist

# Combinados
npm run build && npm run preview
```

---

## 🔌 Integração com Apis Externas

### Google Gemini 2.0

Usamos Gemini para todas as análises com IA:

```typescript
import { ai } from './services/geminiService';

const response = await ai.models.generateContent({
  model: 'gemini-3-flash-preview',
  contents: [{
    role: 'user',
    parts: [{
      text: 'seu prompt aqui'
    }]
  }],
  config: {
    responseMimeType: 'application/json'
  }
});
```

**Endpoints utilizados:**
- Análise de Competidores
- Detecção de Trends
- SEO Audit
- Keyword Research
- Content Gap Analysis
- Recomendações estratégicas
- Planejamento Editorial

### Firecrawl

Para scraping e extração de conteúdo:

```typescript
const result = await scrapeUrl(url);
// result.data.markdown, result.data.content
```

---

## 🎨 Temas & Personalização

### Dark Mode
Ativa tema escuro automaticamente baseado em preferência do sistema.

### Múltiplas Linguagens
- 🇧🇷 Português (PT)
- 🇺🇸 English (EN)

Trocar idioma na barra de navegação.

### Cores Primárias
Definidas no `src/index.css`:

```css
--primary: 22 100% 52%;           /* Laranja #FF4D00 */
--primary-foreground: 0 0% 100%;  /* Branco */
```

---

## 🔍 Serviços Principais

### geminiService.ts

Funções disponíveis:

```typescript
// Análise Competitiva
analyzeCompetitors(domain, searchTerms, scrapedContent?): AnalysisResult

// Trends
fetchTrends(period, queries): TrendResult

// Keywords
fetchKeywords(domain, competitors): KeywordResult

// Content Gaps
analyzeGaps(domain, competitors): GapResult

// Recomendações
generateRecs(domain, analysisData): RecResult

// Calendário Editorial
planEditorial(domain, topics, weeks): EditorialResult

// Branding
analyzeBranding(urls): BrandingResult

// SEO Audit
analyzeSEO(url, content?): SEOAuditResult
```

### firecrawlService.ts

Funções disponíveis:

```typescript
// Scraping completo
scrapeUrl(url): ScrapedContent

// Mapeamento de domínio
mapDomain(domain): DomainMapping

// Dados estruturados
extractStructured(url): StructuredData
```

---

## 📊 Estruturas de Dados

### AnalysisResult
```typescript
{
  landscape: Array<{
    site: string;
    themes: string[];
  }>;
  gaps: string[];
  ideas: Array<{
    title: string;
    description: string;
    format: string;
  }>;
  insights: string[];
}
```

### RecResult
```typescript
{
  recommendations: Array<{
    title: string;
    type: 'Novo Conteúdo' | 'Otimização' | 'Reciclagem';
    reason: string;
    expectedImpact: 'Crítico' | 'Alto' | 'Médio';
  }>;
}
```

### EditorialResult
```typescript
{
  calendar: Array<{
    week: string;
    topics: Array<{
      title: string;
      format: string;
      channel: string;
      status: 'Planejado' | 'Em Produção' | 'Concluído';
    }>;
  }>;
}
```

---

## 🐛 Troubleshooting

### Erro: "VITE_GEMINI_API_KEY não definida"
**Solução**: Crie `.env.local` com sua chave de API do Gemini.

```bash
echo "VITE_GEMINI_API_KEY=seu_key" > .env.local
```

### Erro: "Cannot find module 'react'"
**Solução**: Reinstale dependências.

```bash
rm -rf node_modules package-lock.json
npm install
```

### Porta 3000 já em uso
**Solução**: Use outra porta.

```bash
npm run dev -- --port 3001
```

### Build falha com erro TypeScript
**Solução**: Execute verificação de tipos.

```bash
npm run lint
```

### Scraping retorna 403/418
**Solução**: Verifique se Firecrawl está ativo e configurado.

```typescript
// Debug Firecrawl
console.log(process.env.VITE_FIRECRAWL_API_KEY);
```

---

## 🚀 Deploy

### Vercel (Recomendado)

```bash
npm i -g vercel
vercel
```

Variáveis de ambiente no Vercel Dashboard:
- `VITE_GEMINI_API_KEY`
- `VITE_FIRECRAWL_API_KEY`

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "preview"]
```

```bash
docker build -t content-hub-ai .
docker run -p 3000:3000 -e VITE_GEMINI_API_KEY=xxx content-hub-ai
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

---

## 🤝 Contribuição

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Distribuído sob a licença MIT. Ver `LICENSE` para mais detalhes.

---

## 👨‍💻 Desenvolvimento

### Estrutura de Commits

```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: formata código
refactor: reorganiza código
perf: melhora performance
test: adiciona testes
```

### Code Style

- TypeScript com tipos explícitos
- Componentes funcionais com Hooks
- Tailwind CSS para styling
- Sem espaços mágicos, use constantes

---

## 📞 Suporte

- **GitHub Issues**: [Abrir issue](https://github.com/seu-usuario/content-hub-ai/issues)
- **Email**: support@contenthub-ai.com
- **Documentação**: [Veja docs/](./docs/)

---

## 🎯 Roadmap

- [ ] Integração com Google Analytics
- [ ] Export para PDF/Excel
- [ ] Agendamento de análises automáticas
- [ ] Webhook para notificações
- [ ] API pública REST
- [ ] Dashboard analytics
- [ ] Multi-tenant support
- [ ] SSO (Google, GitHub, Microsoft)

---

## 📈 Performance

**Métricas aproximadas:**
- Análise competitiva: 8-12 segundos
- Forecast de trends: 5-8 segundos
- SEO Audit: 10-15 segundos
- Calendário Editorial: 12-18 segundos

*Dependente da velocidade da conexão e dos serviços externos.*

---

## 🔒 Segurança

- Variáveis de ambiente nunca expostas
- Sem dados sensíveis em localStorage
- HTTPS em produção
- Rate limiting nas APIs externas
- Validação de entrada em todos os endpoints

---

## 📚 Referências

- [Google Gemini Docs](https://ai.google.dev)
- [Firecrawl Docs](https://www.firecrawl.dev)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

**Construído com ❤️ para estrategistas de conteúdo.**

*Última atualização: Março 30, 2026*
