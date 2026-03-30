import { GoogleGenAI } from "@google/genai";

function getGeminiApiKey(): string {
  const meta = import.meta.env as any;
  const fromViteMeta = (meta?.VITE_GEMINI_API_KEY as string) || (meta?.GEMINI_API_KEY as string) || "";
  const fromDefinedProcess = (globalThis as any)?.process?.env?.GEMINI_API_KEY as string | undefined;
  return (fromViteMeta || fromDefinedProcess || "").trim();
}

export const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });

export interface AnalysisResult {
  landscape: {
    site: string;
    themes: string[];
  }[];
  gaps: string[];
  ideas: {
    title: string;
    description: string;
    format: string;
  }[];
  insights: string[];
}

export interface TrendResult {
  trends: {
    title: string;
    description: string;
    relevance: number;
    source?: string;
    url?: string;
  }[];
  summary: string;
}

export interface SEOAuditResult {
  url: string;
  wordCount: number;
  headings: { level: string; text: string }[];
  metaTags: { name: string; content: string }[];
  summary: string;
  checklist: {
    criterion: string;
    status: 'good' | 'regular' | 'poor';
    details: string;
  }[];
  improvements: string[];
  structuredData: {
    existing: string[];
    toImplement: string[];
  };
  pageSpeed: {
    score: number;
    metrics: { name: string; value: string; status: 'good' | 'regular' | 'poor' }[];
  };
  qualityScore: number;
  eeat: {
    experience: string;
    expertise: string;
    authoritativeness: string;
    trustworthiness: string;
    overallScore: number;
  };
  geoParameters: {
    parameter: string;
    status: string;
    recommendation: string;
  }[];
}

export interface KeywordResult {
  keywords: {
    term: string;
    volume: string;
    difficulty: number;
    intent: 'Informativo' | 'Transacional' | 'Navegacional' | 'Comercial';
    competitors: string[];
  }[];
  opportunities: string[];
}

export interface GapResult {
  gaps: {
    topic: string;
    competitorStrength: 'High' | 'Medium' | 'Low';
    opportunity: string;
    priority: 'High' | 'Medium' | 'Low';
  }[];
  summary: string;
}

export interface RecResult {
  recommendations: {
    title: string;
    type: 'Novo Conteúdo' | 'Otimização' | 'Reciclagem';
    reason: string;
    expectedImpact: string;
  }[];
}

export interface EditorialResult {
  calendar: {
    week: string;
    topics: {
      title: string;
      format: string;
      channel: string;
      status: 'Planejado' | 'Em Produção' | 'Concluído';
    }[];
  }[];
}

export interface BrandingResult {
  colors: { color: string; label: string }[];
  fonts: { font: string; usage: string }[];
  logos: { url: string; type: string }[];
  typography: { element: string; size: string; weight: string }[];
  summary: string;
}

const DEFAULT_MODEL = "gemini-3-flash-preview";

function cleanJson(text: string) {
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function analyzeCompetitors(userSite: string, searchTerms: string[], scrapedContent?: string): Promise<AnalysisResult> {
  const prompt = `
    AJA COMO UM ESTRATEGISTA DE CONTEÚDO E SEO EXPERIENTE.
    
    1. ANALISE o domínio principal: ${userSite}
    2. USE a ferramenta "googleSearch" exaustivamente para identificar concorrentes diretos e indiretos para estes termos: ${searchTerms.join(", ")}.
    3. COMPARE o inventário de ${userSite} com o mercado.
    
    ESTRUTURA DE RESPOSTA OBRIGATÓRIA (JSON):
    - "landscape": Liste 3-5 concorrentes IDENTIFICADOS NA BUSCA e seus principais tópicos de conteúdo.
    - "gaps": Liste pelo menos 4 tópicos que os concorrentes dominam mas ${userSite} não.
    - "ideas": Proponha 5 ideias de conteúdos táticos (título, descrição, formato como 'Blog Post', 'E-book', etc).
    - "insights": 3 notas estratégicas de alto nível.
    
    CONTEÚDO DO SITE (contexto): ${scrapedContent || "Vazio"}
    
    Responda EXCLUSIVAMENTE com o JSON puro seguindo a interface AnalysisResult.
  `;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} } as any],
        responseMimeType: "application/json"
      }
    });
    return cleanJson(response.text);
  } catch (error) {
    console.error("Error in analyzeCompetitors:", error);
    throw error;
  }
}

export async function fetchTrends(period: string, queries: string[]): Promise<TrendResult> {
  const prompt = `
    ANÁLISE DE TREND RADAR (TIKTOK, GOOGLE, NEWS):
    Período: ${period}
    Queries/Tópicos: ${queries.join(", ")}
    
    OBJETIVO: Mapeie tendências, notícias e tópicos quentes que estão surgindo em tempo real usando Google Search.
    
    INSTRUÇÕES:
    - "trends": Liste as tendências identificadas (título, descrição, relevância de 1-100, fonte e URL oficial se houver).
    - "summary": Um resumo estratégico em português sobre as oportunidades no período escolhido.
    
    Responda EXCLUSIVAMENTE em JSON no formato do TrendResult.
  `;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} } as any],
        responseMimeType: "application/json"
      }
    });
    return cleanJson(response.text);
  } catch (error) {
    console.error("Error in fetchTrends:", error);
    throw error;
  }
}

export async function fetchKeywords(domain: string, competitors: string[]): Promise<KeywordResult> {
  const prompt = `
    KEYWORD GAP ANALYSIS:
    Domínio principal: ${domain}
    Concorrentes/Brand URLs: ${competitors.join(", ")}
    
    OBJETIVO: Identificar palavras-chave (SEO) com alto volume e intenção que o domínio principal está ignorando, mas os concorrentes estão ranqueando.
    
    INSTRUÇÕES:
    - Liste termos específicos, volume aproximado, dificuldade (0-100), intenção da busca e quais concorrentes estão usando.
    - Proponha oportunidades estratégicas.
    
    Responda EXCLUSIVAMENTE em JSON no formato do KeywordResult.
  `;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} } as any],
        responseMimeType: "application/json"
      }
    });
    return cleanJson(response.text);
  } catch (error) {
    console.error("Error in fetchKeywords:", error);
    throw error;
  }
}

export async function analyzeGaps(domain: string, competitors: string[]): Promise<GapResult> {
  const prompt = `
    CONTENT GAP ANALYSIS:
    Domínio: ${domain}
    Concorrentes: ${competitors.join(", ")}
    Identifique lacunas estratégicas de conteúdo.
    Responda apenas com o JSON puro seguindo a estrutura de GapResult.
  `;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} } as any],
        responseMimeType: "application/json"
      }
    });
    return cleanJson(response.text);
  } catch (error) {
    console.error("Error in analyzeGaps:", error);
    throw error;
  }
}

export async function generateRecs(domain: string, analysisData: any): Promise<RecResult> {
  const prompt = `
    IA CONTENT RECOMMENDATIONS:
    Domínio: ${domain}
    Dados base: ${JSON.stringify(analysisData)}
    Gere recomendações de Novo Conteúdo, Otimização ou Reciclagem.
    Responda apenas com o JSON puro seguindo a estrutura de RecResult.
  `;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });
    return cleanJson(response.text);
  } catch (error) {
    console.error("Error in generateRecs:", error);
    throw error;
  }
}

export async function planEditorial(domain: string, topics: string[]): Promise<EditorialResult> {
  const prompt = `
    SMART EDITORIAL PLAN (4 WEEKS):
    Domínio: ${domain}
    Tópicos: ${topics.join(", ")}
    Responda apenas com o JSON puro seguindo a estrutura de EditorialResult.
  `;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });
    return cleanJson(response.text);
  } catch (error) {
    console.error("Error in planEditorial:", error);
    throw error;
  }
}

export async function analyzeSEO(url: string, content?: string): Promise<SEOAuditResult> {
  const prompt = `
    SEO & GEO ADVANCED AUDIT:
    URL: ${url}
    CONTEÚDO: ${content || "Analisar estrutura geral do domínio."}
    Realize auditoria On-page, EEAT, Performance e GEO.
    Responda apenas com o JSON puro seguindo a estrutura de SEOAuditResult.
  `;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });
    return cleanJson(response.text);
  } catch (error) {
    console.error("Error in analyzeSEO:", error);
    throw error;
  }
}

export async function analyzeBranding(domain: string, content: string): Promise<BrandingResult> {
  const prompt = `
    VISUAL IDENTITY EXTRACTION:
    Domínio: ${domain}
    CONTEÚDO: ${content}
    Identifique cores (hex), fontes, logos e estilo.
    Responda apenas com o JSON puro seguindo a estrutura de BrandingResult.
  `;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });
    return cleanJson(response.text);
  } catch (error) {
    console.error("Error in analyzeBranding:", error);
    throw error;
  }
}
