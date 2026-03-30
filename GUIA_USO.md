# 📚 Guia de Uso - Content Hub AI

Instruções práticas para cada funcionalidade da plataforma.

---

## 🎯 Começar

### 1. Acessar a Plataforma

1. Abra: `http://localhost:3000`
2. Na landing page, clique em **"Acessar Plataforma"** ou **"Ver Funcionalidades"**
3. Defina o **domínio principal** (seu blog/site)
4. Escolha a **aba** que deseja usar

### 2. Requisitos

- ✅ Chave do Google Gemini configurada
- ✅ Conexão estável com internet
- ✅ JavaScript ativado
- ✅ Navegador moderno (Chrome, Firefox, Safari, Edge)

---

## 📖 Guia por Feature

### 🔍 **1. Pesquisa Competitiva** (Aba: Pesquisa)

**O que faz:**
Mapeia seu mercado, identifica concorrentes e encontra lacunas de conteúdo.

**Como usar:**

1. **Defina o domínio principal**
   ```
   Ex: meusite.com / meusite.com.br
   ```

2. **Digite termos de busca**
   ```
   Ex: marketing digital, growth hacking, email marketing
   ```

3. **Adicione os termos** clicando no ícone `+` ou pressione Enter

4. **Clique em "Analisar"**

5. **Aguarde 8-12 segundos**

6. **Visualize resultados:**
   - **Content Landscape**: Concorrentes e seus temas
   - **Gap Opportunities**: O que está faltando
   - **Ideias de Conteúdo**: 5 artigos acionáveis
   - **Insights Estratégicos**: Alto nível

**Dicas:**
- Use 2-3 termos principais (não mais que 5)
- Termos específicos geram melhores resultados
- Tópicos bem definidos = análise mais profunda

**Exemplo real:**
```
Domínio: conteudoparatodos.com
Termos: copywriting, marketing de conteúdo, funnel de vendas

Resultado: Identifica 5 concorrentes, 4 gaps (ex: "copywriting persuasivo")
```

---

### 🔥 **2. Radar de Trends** (Aba: Trends)

**O que faz:**
Detecta tendências emergentes em tempo real no seu nicho.

**Como usar:**

1. **Selecione o período**
   - Última hora: Ultrarrecente
   - Hoje: Atualizado
   - Semana: Tendências consolidadas
   - Mês: Padrões mais sólidos

2. **Digite query de busca**
   ```
   Ex: inteligência artificial, redes sociais, e-commerce
   ```

3. **Adicione múltiplas queries** se desejar

4. **Clique em "Buscar Trends"**

5. **Analise a seção "Insights Estratégicos"**

**Saída esperada:**
```
Semana: AI em marketting
├─ ChatGPT 4.5 Marketing Automation (Relevância: 92%)
├─ AI Copywriting Tools 2026 (Relevância: 88%)
└─ Prompt Engineering para Vendas (Relevância: 85%)

Resumo: Oportunidade de criar guia completo sobre AI para marketing
```

**Dicas:**
- Use **"Semana"** para balanceamento perfeito
- Multiplas queries = análise consolidada
- Guarde resultados para planejamento editorial

---

### 🎨 **3. Brand Intelligence** (Aba: Brands)

**O que faz:**
Extrai cores, tipografia e identidade visual de marcas (suas e de concorrentes).

**Como usar:**

1. **Digite URLs de marcas**
   ```
   Ex: https://siteA.com
       https://siteB.com
       https://seu-site.com
   ```

2. **Clique em "Analisar Branding"**

3. **Aguarde 10-15 segundos**

4. **Visualize:**
   - Paleta de cores (com hex codes)
   - Tipografia principal e secundária
   - Logos detectados
   - Elementos tipográficos
   - Resumo da identidade

**Exemplo de saída:**
```json
{
  "colors": [
    { "color": "#FF4D00", "label": "Primary Orange" },
    { "color": "#FFFFFF", "label": "White" },
    { "color": "#1F2937", "label": "Dark Gray" }
  ],
  "fonts": [
    { "font": "Inter", "usage": "Body text" },
    { "font": "Playfair", "usage": "Headings" }
  ]
}
```

**Dicas:**
- Compare 3-5 concorrentes de uma vez
- Use para refrescar identidade visual
- Identifique tendências visuais do setor

---

### ♻️ **4. Reciclador de Conteúdo** (Aba: Recycler)

**O que faz:**
Transforma um artigo em carrosséis prontos para redes sociais (TikTok, Instagram, LinkedIn).

**Como usar:**

1. **Cole a URL do artigo**
   ```
   Ex: https://seu-blog.com/artigo-sobre-seo.html
   ```

2. **Selecione quantidade de slides**
   - 5 slides: Resumido
   - 8 slides: Balanceado (recomendado)
   - 10 slides: Completo

3. **Escolha o estilo**
   - **Educacional**: Informativo e estruturado
   - **Provocativo**: Intrigante e controverso
   - **Storytelling**: Narrativo e emocional
   - **Data-driven**: Com números e insights

4. **Clique em "Transformar Conteúdo"**

5. **Copie o carrossel formatado**

**Exemplo de transformação:**

```
Artigo: "10 Estratégias de SEO para 2026"

Carrossel (8 slides):
├─ Slide 1: Título chamativo
├─ Slide 2-3: Estratégia 1 com infográfico
├─ Slide 4-5: Estratégia 2 com dados
├─ Slide 6-7: Estratégia 3 com case
└─ Slide 8: Call-to-action
```

**Dicas:**
- Use **"Balanceado"** para maioria dos casos
- Escolha estilo baseado no seu público
- Gere 3 versões com estilos diferentes

---

### 👁️ **5. Monitor de Sitemap** (Aba: Watch)

**O que faz:**
Detecta automaticamente novos conteúdos publicados por concorrentes.

**Como usar:**

1. **Digite domínios para monitorar**
   ```
   Ex: concorrente1.com
       concorrente2.com
       influencer.com
   ```

2. **Clique em "Monitorar Sitemaps"**

3. **Analise resultados:**
   - URLs novas adicionadas
   - Data de publicação detectada
   - Títulos dos artigos
   - Total de URLs no sitemap

**Saída esperada:**
```
Concorrente A: https://sitemapA.com/sitemap.xml
├─ Total de URLs: 285
├─ Novas (últimas 7 dias):
│  ├─ Como fazer email marketing eficaz (05/03)
│  ├─ Ferramentas de automação 2026 (04/03)
│  └─ ROI de content marketing (03/03)
└─ Última verificação: agora

Integração com editorial: Já foi publicado? Se não, é uma oportunidade!
```

**Dicas:**
- Configure alertas semanais de monitoring
- Compare com seu próprio sitemap
- Torne parte do seu fluxo editorial

---

### 📊 **6. Auditoria SEO** (Aba: SEO)

**O que faz:**
Diagnóstico técnico profundo: métricas, Core Web Vitals, estrutura on-page.

**Como usar:**

1. **Digite a URL a auditar**
   ```
   Ex: https://seu-site.com/artigo-principal
   ```

2. **Clique em "Analisar SEO"**

3. **Aguarde 10-15 segundos**

4. **Visualize painel com:**

   **📈 Scores:**
   - Quality Score (0-100)
   - Page Speed (0-100)
   - EEAT Score (0-10)

   **📋 Análise Detalhada:**
   - Estrutura de headings
   - Meta tags
   - Dados estruturados JSON-LD
   - Core Web Vitals
   - Recomendações de otimização

5. **Implement recomendações prioritárias**

**Exemplo de checklist:**
```
✅ H1 presente e único
✅ Meta description entre 150-160 chars
❌ Imagens sem ALT attribute - Corrigir!
⚠️ Page speed < 50 - Otimizar recursos
```

**Dicas:**
- Audite artigos pilar mensalmente
- Compare antes/depois de otimizações
- Use para competir melhor no ranking

---

### 🔑 **7. Keywords Estratégicas** (Aba: Keywords)

**O que faz:**
Identifica high-intent keywords com volume, dificuldade e intenção de busca.

**Como usar:**

1. **Defina seu domínio**
2. **Liste até 10 domínios de concorrentes**
3. **Clique em "Buscar Keywords"**

4. **Analise tabela:**
   - **Termo**: A palavra-chave
   - **Volume**: Buscas/mês
   - **Dificuldade**: 0-100 (0=fácil, 100=impossível)
   - **Intenção**: Tipo de busca
   - **Concorrentes**: Quem está ranqueando

5. **Fixe oportunidades prioritárias**

**Exemplo de resultado:**
```csv
Termo,Volume,Dificuldade,Intenção,Concorrentes
email marketing automático,8k,62,Transacional,"[site1, site2, site3]"
como fazer email marketing,15k,48,Informativo,"[site1, site4]"
ferramentas email marketing,12k,71,Comercial,"[site1, site2, site3, site5]"
```

**Dicas:**
- Priorize: Volume alto + Dificuldade média (40-60)
- Mix: 70% informativo, 30% transacional
- Crie clusters de keywords relacionadas

---

### 🧩 **8. Content Gaps** (Aba: Gaps)

**O que faz:**
Análise estratégica de lacunas: o que concorrentes têm e você não.

**Como usar:**

1. **Seu domínio principal** (automático)
2. **Domínios de 3-5 concorrentes principais**
3. **Clique em "Analisar Gaps"**

4. **Para cada gap visualize:**
   - Tópico (ex: "Video marketing")
   - Força do concorrente (High/Medium/Low)
   - Oportunidade acionável
   - Prioridade (High/Medium/Low)

5. **Resumo executivo** com estratégia consolidada

**Exemplo de gap:**
```
Tópico: TikTok Marketing Strategy
├─ Força dos concorrentes: High (3 posts/mês)
├─ Seu conteúdo: Nenhum
├─ Oportunidade: Criar 5-part series sobre crescimento em TikTok
└─ Prioridade: High (tendência 2026)
```

**Dicas:**
- Foque em gaps HIGH x HIGH (alto potencial)
- Ignorar gaps LOW x LOW (pouca oportunidade)
- Monthly gaps review para atualizar estratégia

---

### 💡 **9. Recomendações IA** (Aba: Recs)

**O que faz:**
Planos de ação priorizados por ROI esperado.

**Como usar:**

1. **Configure domínio** (opcional; usa principal se vazio)
2. **Requisito**: Ter executado análises anteriores (Pesquisa, Gaps, Keywords)
3. **Clique em "Gerar Recomendações"**

4. **Visualize cards com:**
   - Tipo: Novo Conteúdo / Otimização / Reciclagem
   - Impacto: Crítico / Alto / Médio
   - Título acionável
   - Razão estratégica

**Exemplo de saída:**
```
[Novo Conteúdo] - Crítico
├─ Título: "Guia de Automação de Email Marketing 2026"
├─ Razão: 8k buscas/mês, dificuldade média, 0 concorrentes locais
└─ Impacto: Crítico

[Otimização] - Alto
├─ Título: "Atualizar meta descriptions de artigos principais"
├─ Razão: +15-20% CTR esperado
└─ Impacto: Alto

[Reciclagem] - Médio
├─ Título: "Gerar 10 posts TikTok do webinar recente"
├─ Razão: Conteúdo existe, apenas redistribuir
└─ Impacto: Médio
```

**Dicas:**
- Foque em recomendações **Críticas** primeiro
- Distribuia Críticas + Altas para máximo ROI
- Revise mensalmente após implementar

---

### 📅 **10. Calendário Editorial** (Aba: Editorial)

**O que faz:**
Transforma insights em plano de execução de 2-8 semanas.

**Como usar:**

1. **Configure domínio** (opcional)

2. **Selecione período**
   - 2 semanas: Sprint rápido
   - 4 semanas: Padrão recomendado
   - 8 semanas: Planning completo

3. **Clique em "Gerar Plano Editorial"**

4. **Visualize por semana:**
   - Tópicos agendados
   - Formato de conteúdo
   - Canal de distribuição
   - Status (Planejado / Em Produção / Concluído)

**Exemplo de calendário (4 semanas):**
```
SEMANA 1 (Mar 31 - Apr 6)
├─ "Email Automation Hacks" - Blog Post - Blog - Planejado
├─ "5 Tools Para Email" - Infográfico - LinkedIn - Planejado
└─ "Email Case Study" - Video - YouTube - Planejado

SEMANA 2 (Apr 7 - Apr 13)
├─ "Advanced Segmentation" - Guia - Blog - Planejado
├─ "Email Templates" - Social Series - Instagram - Em Produção
└─ "Webinar: Email ROI" - Webinar - YouTube - Concluído

... (semanas 3-4)
```

**Dicas:**
- Mix: 50% Blog, 25% Video/Webinar, 25% Social
- Editorial review semanal
- Ajuste conforme performance observada

---

## ⚙️ Fluxo Completo Recomendado

**Semana 1: Análise Profunda**
1. Execute Pesquisa Competitiva
2. Analise Keywords principais
3. Identifique Gaps
4. Revise Brand identity

**Semana 2: Planning**
1. Gere Recomendações
2. Crie Calendário Editorial (4 semanas)
3. Defina principais tópicos
4. Aloque recursos

**Semana 3-4: Execução**
1. Implemente recomendações Críticas
2. Monitore novos conteúdos de concorrentes
3. Audite SEO de artigos principais
4. Recicle top performers

**Mês seguinte: Review & Iterate**
1. Revise performance
2. Re-execute análises (trends mudam!)
3. Adapte estratégia
4. Repita ciclo

---

## 🎯 Casos de Uso

### Caso 1: Novo Blog
```
Meta: Ranquear em 30 dias na categoria "Marketing Digital"

1. Pesquisa Competitiva → Identificar 5 concorrentes
2. Keywords → Top 10 palavras-chave atacáveis
3. Gaps → Encontrar 3 oportunidades principais
4. Editorial → Plano de 30 dias com 12 artigos
5. Recs → Priorizar pelos impactos
```

### Caso 2: Refrescar Conteúdo Existente
```
Meta: +40% de tráfego orgânico trimestral

1. SEO Audit → Auditar 20 artigos principais
2. Recycler → Reutilizar em TikTok/Instagram
3. Gaps → Encontrar lacunas não cobertas
4. Recs → Reoptimizar top 10
```

### Caso 3: Lançar Novo Tópico
```
Meta: Entrar no tópico "IA para Marketting"

1. Trends → Analisar tendência
2. Keywords → Encontrar 20 keywords relacionadas
3. Gaps → Ver como concorrentes abordam
4. Editorial → Criar série de 8 artigos
5. Branding → Adaptar visual para novo tópico
```

---

## 🆘 Troubleshooting de Uso

### "Análise retorna erro"
- ✅ Verifique conexão internet
- ✅ Chave Gemini está válida?
- ✅ Tente domínio conhecido (google.com)

### "Leva muito tempo"
- ℹ️ Normal: 8-18 segundos
- 💡 Menos de 3 termos = mais rápido
- 🔄 Se > 30s, recarregue página

### "Não tá ranqueando"
- Foco em keywords de dificuldade 40-60
- Mix 70% content, 30% promotion
- Paciência: ranking leva 4-12 semanas

### "Como exportar resultados?"
- Clique "Exportar" no canto superior direito
- Formatos: PDF, JSON, CSV

---

## 📞 Perguntas Frequentes

**P: Posso usar dados de Sites em Português e Inglês misturado?**
A: Sim, mas recomendamos manter consistência. A IA detecta automaticamente.

**P: Com que frequência devo re-executar análises?**
A: Keywords/Gaps: Mensal. Trends: Semanal. SEO: Trimestral.

**P: Posso monitorar 50 concorrentes?**
A: Recomendam up to 10 concorrentes. Mais lentidão.

**P: Os dados são salvos?**
A: Localmente no seu dispositivo. Use Exportar para backup.

**P: Há limite de análises por dia?**
A: Não há limite. Limitado apenas pela sua API de Gemini.

---

**Pronto para começar? Acesse a plataforma agora! 🚀**

*Última atualização: Março 30, 2026*
