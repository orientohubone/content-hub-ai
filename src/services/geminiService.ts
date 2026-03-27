import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

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

export async function analyzeCompetitors(userSite: string, searchTerms: string[]): Promise<AnalysisResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analise estrategicamente o conteúdo e o mercado para o domínio: ${userSite}
    Termos de pesquisa/foco: ${searchTerms.join(", ")}

    Gere um relatório detalhado em JSON com a seguinte estrutura:
    {
      "landscape": [
        { "site": "nome do site ou segmento", "themes": ["tema 1", "tema 2"] }
      ],
      "gaps": ["oportunidade de conteúdo não explorada", "nicho vazio"],
      "ideas": [
        { "title": "título da ideia de conteúdo", "description": "por que criar isso e qual o valor", "format": "blog/video/social" }
      ],
      "insights": ["insight estratégico de branding", "diferença de posicionamento"]
    }

    Responda apenas o JSON, sem markdown ou explicações.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        tools: [{ urlContext: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            landscape: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  site: { type: Type.STRING },
                  themes: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["site", "themes"]
              }
            },
            gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            ideas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  format: { type: Type.STRING }
                },
                required: ["title", "description", "format"]
              }
            },
            insights: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["landscape", "gaps", "ideas", "insights"]
        }
      }
    });

    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing competitors:", error);
    throw error;
  }
}

export async function fetchTrends(period: string, queries: string[]): Promise<TrendResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analise as tendências atuais para o período: ${period}
    Queries de pesquisa: ${queries.join(", ")}

    Gere um relatório de tendências em JSON com a seguinte estrutura:
    {
      "trends": [
        { 
          "title": "título da tendência", 
          "description": "descrição detalhada do que está acontecendo", 
          "relevance": 0.95, 
          "source": "fonte provável (ex: Google Trends, News)",
          "url": "url fictícia ou real de exemplo"
        }
      ],
      "summary": "resumo estratégico das tendências encontradas"
    }

    Responda apenas o JSON, sem markdown ou explicações.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        tools: [{ urlContext: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trends: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  relevance: { type: Type.NUMBER },
                  source: { type: Type.STRING },
                  url: { type: Type.STRING }
                },
                required: ["title", "description", "relevance"]
              }
            },
            summary: { type: Type.STRING }
          },
          required: ["trends", "summary"]
        }
      }
    });

    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching trends:", error);
    throw error;
  }
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

export async function fetchKeywords(domain: string, competitors: string[]): Promise<KeywordResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analise as palavras-chave para o domínio: ${domain}
    Concorrentes: ${competitors.join(", ")}

    Identifique as principais palavras-chave que os concorrentes estão ranqueando e o domínio alvo não (Keyword Gap).
    Gere um relatório em JSON com a seguinte estrutura:
    {
      "keywords": [
        { 
          "term": "palavra-chave", 
          "volume": "1.2k", 
          "difficulty": 45, 
          "intent": "Informativo",
          "competitors": ["concorrente1.com", "concorrente2.com"]
        }
      ],
      "opportunities": ["estratégia de conteúdo baseada em keywords", "nicho de busca pouco explorado"]
    }

    Responda apenas o JSON, sem markdown ou explicações.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        tools: [{ urlContext: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            keywords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  volume: { type: Type.STRING },
                  difficulty: { type: Type.NUMBER },
                  intent: { type: Type.STRING, enum: ["Informativo", "Transacional", "Navegacional", "Comercial"] },
                  competitors: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["term", "volume", "difficulty", "intent", "competitors"]
              }
            },
            opportunities: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["keywords", "opportunities"]
        }
      }
    });

    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching keywords:", error);
    throw error;
  }
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

export async function analyzeGaps(domain: string, competitors: string[]): Promise<GapResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analise as lacunas de conteúdo (Content Gaps) para o domínio: ${domain}
    Concorrentes: ${competitors.join(", ")}

    Identifique tópicos que os concorrentes cobrem bem, mas o domínio alvo não.
    Gere um relatório em JSON com a seguinte estrutura:
    {
      "gaps": [
        { 
          "topic": "tópico ou palavra-chave", 
          "competitorStrength": "High", 
          "opportunity": "descrição da oportunidade", 
          "priority": "High"
        }
      ],
      "summary": "resumo estratégico das lacunas encontradas"
    }

    Responda apenas o JSON, sem markdown ou explicações.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        tools: [{ urlContext: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            gaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  competitorStrength: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                  opportunity: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
                },
                required: ["topic", "competitorStrength", "opportunity", "priority"]
              }
            },
            summary: { type: Type.STRING }
          },
          required: ["gaps", "summary"]
        }
      }
    });

    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing gaps:", error);
    throw error;
  }
}

export async function generateRecs(domain: string, analysisData: any): Promise<RecResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Com base nos dados de análise fornecidos para o domínio ${domain}, gere recomendações personalizadas de conteúdo.
    Dados: ${JSON.stringify(analysisData)}

    Gere um relatório em JSON com a seguinte estrutura:
    {
      "recommendations": [
        { 
          "title": "título da recomendação", 
          "type": "Novo Conteúdo", 
          "reason": "por que esta recomendação é importante", 
          "expectedImpact": "impacto esperado (ex: aumento de tráfego orgânico)"
        }
      ]
    }

    Responda apenas o JSON, sem markdown ou explicações.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        tools: [{ urlContext: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["Novo Conteúdo", "Otimização", "Reciclagem"] },
                  reason: { type: Type.STRING },
                  expectedImpact: { type: Type.STRING }
                },
                required: ["title", "type", "reason", "expectedImpact"]
              }
            }
          },
          required: ["recommendations"]
        }
      }
    });

    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating recs:", error);
    throw error;
  }
}

export async function planEditorial(domain: string, topics: string[]): Promise<EditorialResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Crie um plano editorial de 4 semanas para o domínio ${domain} com base nos seguintes tópicos: ${topics.join(", ")}

    Gere um relatório em JSON com a seguinte estrutura:
    {
      "calendar": [
        { 
          "week": "Semana 1", 
          "topics": [
            { "title": "título do conteúdo", "format": "Blog Post", "channel": "Site", "status": "Planejado" }
          ]
        }
      ]
    }

    Responda apenas o JSON, sem markdown ou explicações.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        tools: [{ urlContext: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            calendar: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  week: { type: Type.STRING },
                  topics: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        format: { type: Type.STRING },
                        channel: { type: Type.STRING },
                        status: { type: Type.STRING, enum: ["Planejado", "Em Produção", "Concluído"] }
                      },
                      required: ["title", "format", "channel", "status"]
                    }
                  }
                },
                required: ["week", "topics"]
              }
            }
          },
          required: ["calendar"]
        }
      }
    });

    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error("Error planning editorial:", error);
    throw error;
  }
}

export async function analyzeSEO(url: string): Promise<SEOAuditResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Realize uma auditoria SEO e GEO (Generative Engine Optimization) completa para a URL: ${url}
    
    IMPORTANTE: Utilize a ferramenta urlContext para acessar o conteúdo REAL do site. NÃO invente informações. 
    Se não conseguir acessar dados específicos, indique como "Não detectado" ou forneça uma estimativa baseada no contexto geral do domínio.
    
    A análise deve ser robusta e cobrir:
    1. SEO On-page (Headings, Meta Tags, Word Count reais detectados)
    2. E-E-A-T (Experiência, Especialidade, Autoridade, Confiança baseada no conteúdo e autoridade do domínio)
    3. Page Speed e Métricas de Performance (análise técnica baseada na estrutura da página)
    4. Dados Estruturados (Schema.org) existentes e recomendações específicas
    5. GEO Parameters (como LLMs como Gemini, ChatGPT e Perplexity interpretam esta página e sua relevância para buscas generativas)
    6. Quality Score e Checklist de melhorias práticas e acionáveis

    Gere um relatório detalhado em JSON com a seguinte estrutura:
    {
      "url": "${url}",
      "wordCount": 1200,
      "headings": [{ "level": "H1", "text": "Título" }],
      "metaTags": [{ "name": "description", "content": "desc" }],
      "summary": "resumo da página",
      "checklist": [{ "criterion": "Mobile Friendly", "status": "good", "details": "ok" }],
      "improvements": ["melhoria 1"],
      "structuredData": { "existing": ["Article"], "toImplement": ["FAQPage"] },
      "pageSpeed": { "score": 85, "metrics": [{ "name": "LCP", "value": "2.1s", "status": "good" }] },
      "qualityScore": 9.2,
      "eeat": { "experience": "...", "expertise": "...", "authoritativeness": "...", "trustworthiness": "...", "overallScore": 8.5 },
      "geoParameters": [{ "parameter": "Citations", "status": "High", "recommendation": "..." }]
    }

    Responda apenas o JSON, sem markdown ou explicações.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        tools: [{ urlContext: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            url: { type: Type.STRING },
            wordCount: { type: Type.NUMBER },
            headings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  level: { type: Type.STRING },
                  text: { type: Type.STRING }
                },
                required: ["level", "text"]
              }
            },
            metaTags: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ["name", "content"]
              }
            },
            summary: { type: Type.STRING },
            checklist: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  criterion: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ["good", "regular", "poor"] },
                  details: { type: Type.STRING }
                },
                required: ["criterion", "status", "details"]
              }
            },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            structuredData: {
              type: Type.OBJECT,
              properties: {
                existing: { type: Type.ARRAY, items: { type: Type.STRING } },
                toImplement: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["existing", "toImplement"]
            },
            pageSpeed: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                metrics: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      value: { type: Type.STRING },
                      status: { type: Type.STRING, enum: ["good", "regular", "poor"] }
                    },
                    required: ["name", "value", "status"]
                  }
                }
              },
              required: ["score", "metrics"]
            },
            qualityScore: { type: Type.NUMBER },
            eeat: {
              type: Type.OBJECT,
              properties: {
                experience: { type: Type.STRING },
                expertise: { type: Type.STRING },
                authoritativeness: { type: Type.STRING },
                trustworthiness: { type: Type.STRING },
                overallScore: { type: Type.NUMBER }
              },
              required: ["experience", "expertise", "authoritativeness", "trustworthiness", "overallScore"]
            },
            geoParameters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  parameter: { type: Type.STRING },
                  status: { type: Type.STRING },
                  recommendation: { type: Type.STRING }
                },
                required: ["parameter", "status", "recommendation"]
              }
            }
          },
          required: ["url", "wordCount", "headings", "metaTags", "summary", "checklist", "improvements", "structuredData", "pageSpeed", "qualityScore", "eeat", "geoParameters"]
        }
      }
    });

    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing SEO:", error);
    throw error;
  }
}
