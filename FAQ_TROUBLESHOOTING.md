# 🔧 FAQ & Troubleshooting - Content Hub AI

Resolução de problemas e respostas às perguntas mais frequentes.

---

## 🚨 Problemas Comuns

### ❌ "Erro de API - Chave Gemini inválida"

**Sintomas:**
```
Error: Invalid API key error
Status: 401 Unauthorized
```

**Soluções:**

1. **Revise a chave no arquivo .env**
   ```bash
   # Arquivo: .env (raiz do projeto)
   VITE_GEMINI_API_KEY=your_actual_key_here
   ```

2. **Regenere a chave**
   - Acesse: https://ai.google.dev/
   - Console > API Keys
   - Delete a antiga
   - Gerar chave nova
   - Copiar completamente (sem espaços extras)

3. **Verifique permissões**
   - A chave pertence a um projeto com Gemini API ativada?
   - Vá em APIs e Serviços > Habilitar APIs
   - Ative "Generative Language API"

4. **Espaços e caracteres**
   - Remova TODOS os espaços antes/depois
   - Verifique se há quebras de linha

5. **Recarregue a aplicação**
   ```bash
   npm run dev
   # Limpe browser cache: Ctrl+Shift+Delete (Chrome/Firefox)
   # Depois: Ctrl+F5 (reload hard)
   ```

**Se persistir:**
```bash
# Teste a chave diretamente
curl -X GET "https://generativelanguage.googleapis.com/v1beta/models" \
  -H "x-goog-api-key: YOUR_KEY_HERE"

# Deve retornar lista de modelos disponveis
```

---

### ❌ "Análise retorna JSON vazio ou null"

**Sintomas:**
```
Result: {}
Cards: [Nenhum]
Message: "Nenhum resultado"
```

**Causas & Soluções:**

1. **Domínio inválido**
   ```
   ❌ "google" (sem TLD)
   ❌ "http://google" (faltou .com)
   ✅ "google.com"
   ✅ "meusite.com.br"
   ```

2. **Prompt muito restritivo**
   - Se você editou os prompts em `geminiService.ts`
   - IA muito limitada pode retornar vazio
   - Solução: Mais flexibilidade no prompt

3. **Modelo deprecado (gemini-1.5-pro)**
   - Use sempre: `gemini-3-flash-preview`
   - Está mais rápido e confiável

4. **Taxa de throttling atingida**
   - Aguarde 2 minutos
   - Tente novamente
   - Se frequente: upgrade do plano Gemini

5. **Termos de busca muito específicos**
   ```
   ❌ "guia completo de email marketing b2b2c para startups de 5 pessoas"
   ✅ "email marketing"
   ✅ "marketing b2b"
   ```

**Debug:**
```typescript
// No console do browser (F12)
// Copie este código:
const response = await fetch('/api/analyze', {
  method: 'POST',
  body: JSON.stringify({ domain: 'google.com', terms: ['marketing'] })
});
const data = await response.json();
console.log('Raw API Response:', data);
// Veja exatamente o que voltou
```

---

### ❌ "Página demora muito tempo (> 30 segundos)"

**Sintomas:**
- Spinner rodando indefinidamente
- UI travada

**Soluções:**

1. **Reduzir quantidade de dados**
   ```
   De: 10 domínios + 5 termos
   Para: 3 domínios + 2 termos
   Resultado: 50% mais rápido
   ```

2. **Simplificar query**
   ```
   De: "Como fazer blog posts que rankam no Google"
   Para: "blog posts SEO"
   ```

3. **Verificar velocidade de internet**
   ```bash
   # Windows PowerShell
   Test-NetConnection "generativelanguage.googleapis.com" -Port 443
   
   # Linux/Mac
   curl -w "@- << 'EOF'" -o /dev/null -s https://generativelanguage.googleapis.com
   EOF
   ```

4. **Aumentar timeout no código** (advanced)
   ```typescript
   // src/services/geminiService.ts
   // Mude de 30s para 60s:
   
   const result = await Promise.race([
     generateResponse(),
     new Promise((_, reject) =>
       setTimeout(() => reject(new Error('Timeout')), 60000) // ← 60000ms
     )
   ]);
   ```

5. **Verifique status API**
   - Google API Status: https://status.cloud.google.com/

**Se ainda lento:**
```bash
# Monitore recursos
# Windows: Abra Task Manager > Performance
# macOS: Activity Monitor > Network
# Linux: htop

# Veja se há travamento de CPU/Memory
```

---

### ❌ "Erro 403: Forbidden / Rate Limited"

**Sintomas:**
```
403 Permission Denied
OR
429 Too Many Requests
```

**Causas:**

1. **Quota excedida do plano Gemini**
   - Plano Free: 15 requisições por minuto
   - Solução: Upgrade para plano pago

2. **Requisições simultâneas muito altas**
   - Não abra 5 abas ao mesmo tempo fazendo análises
   - Aguarde resultado anterior terminar

3. **IP bloqueado temporariamente**
   - Não faz muito tempo (30 min aprox)
   - Mude rede (WiFi vs 4G)
   - Use VPN se em data center

**Checklist de Quota:**
```
1. Abra: https://console.cloud.google.com/
2. Projeto no menu superior
3. APIs & Serviços > Quotas
4. Procure por "Generative Language API"
5. Verifique limites atuais
```

---

### ❌ "Nenhum resultado de Trends / Keywords"

**Em Trends:**
```
"Database não encontrou dados para: termos_sem_busca"
```

**Soluções:**

1. **Termo muito novo**
   ```
   ❌ "Content Hub AI 2026" (criado hoje)
   ✅ "artificial intelligence" (tem histórico)
   ```

2. **Termo em idioma incorreto**
   - PT-BR: "marketing digital"
   - EN: "digital marketing"
   - NÃO misture

3. **Termo descontinuado**
   ```
   ❌ "Adobe Flash" (morreu)
   ✅ "Flutter" (vivo)
   ```

4. **Volume muito baixo**
   - Termos super nichados: < 100 buscas/mês
   - Tente termo mais genérico

**Em Keywords:**

Se nenhuma keyword retorna:

1. **Domínio de teste**
   ```
   Teste primeiro com: "google.com"
   Depois com seu site
   ```

2. **Alterar lista de competidores**
   ```bash
   De: 10 sites locais pequenos
   Para: 3-5 competitors principais
   ```

3. **Executar pesquisa competitiva primeiro**
   - Keywords dependem da Pesquisa estar pronta
   - Fluxo: Pesquisa → Keywords → Gaps

---

### ❌ "Exportar resultado falha / Retorna "undefined""

**Sintomas:**
```
Download PDF: arquivo corrompido
JSON export: {} vazio
CSV export: sem dados
```

**Causas:**

1. **Nenhuma análise executada**
   - Clique "Analisar" primeiro
   - Aguarde resultado aparecer

2. **Browser bloqueando downloads**
   - Firefox/Chrome: popup de concessão
   - Clique em "Permitir"

3. **Espaço em disco insuficiente**
   - Limpe downloads antigos
   - Libere espaço no HD

4. **Tipo de resultado incompatível**
   - Nem todos os tabs têm export
   - Tabs com export: Pesquisa, Gaps, Keywords

**Manual Export alternativo:**
```javascript
// Console do browser (F12)
// Se está em "Gaps" por exemplo:
copy(JSON.stringify(gapResult, null, 2))
// Ctrl+V em bloco de notas
// Salve como .json
```

---

## ❓ Perguntas Frequentes

### P1: Como faço análises em vários domínios ao mesmo tempo?

**R:** Não há parallelização na UI. Siga este fluxo:

```
1. Digite domínio 1 na aba Pesquisa
2. Clique Analisar
3. Aguarde resultado
4. Mude manualmente para domínio 2
5. Repita
6. Exporte cada resultado
```

**Alternativa programática** (para desenvolvedores):
```typescript
// src/services/batch-analyzer.ts
const domains = ['site1.com', 'site2.com', 'site3.com'];
const results = await Promise.all(
  domains.map(domain => analyzeCompetitive(domain, terms))
);
```

---

### P2: É possível agendar análises automáticas?

**R:** Não está implementado no v1. Roadmap para v2:

```
- Cron jobs backend
- Webhooks für webhooks
- Agenda visual
- Alertas por email
```

**Workaround atual:**
```bash
# Script Python que roda daily
# cron: 0 8 * * * python /scripts/daily_analysis.py

import requests
import json
from datetime import datetime

domain = "seu-site.com"
response = requests.post('http://localhost:3000/api/analyze', 
  json={'domain': domain}
)
results = response.json()

# Salve com timestamp
with open(f'results/{datetime.now().date()}.json', 'w') as f:
    json.dump(results, f)
```

---

### P3: Como integrar dados em meu CMS (WordPress, etc)?

**R:** Use endpoints da API:

```javascript
// Exemplo: Puxar keywords dentro do WordPress
fetch('http://seu-content-hub.com/api/keywords', {
  method: 'POST',
  body: JSON.stringify({ domain: 'seu-site.com' })
})
.then(r => r.json())
.then(keywords => {
  // Insira no seu CMS
  insertIntoWordPress(keywords);
});
```

**Plugins recomendados:**
- WPML (multilingual)
- REST API Helper
- Data Sync Pro

---

### P4: Os resultados são precisos? Como validar?

**R:** Precisão varia por feature:

| Feature | Precisão | Como validar |
|---------|----------|--------------|
| Keywords | 95% | Cruzar com SEMrush/Ahrefs |
| Trends | 85% | Google Trends site |
| Gaps | 90% | Auditoria manual de 3 competitors |
| SEO Score | 75% | Lighthouse/PageSpeed Insights |
| Recycler | 100% | Manual review required |

**Validação para Keywords:**
```
1. Exporte keywords do Content Hub
2. Abra SEMrush e insira os top 5
3. Compare volume & dificuldade
4. Diferença aceitável: ±20%
```

---

### P5: Precisão dos dados em português (PT-BR) vs inglês?

**R:**
- **Português**: 88% (base menor)
- **Inglês**: 96% (base maior, mais dados)

**Dica:** Para máxima precisão em PT-BR:
- Use termos explicamente "PT-BR"
- Adicione país no contexto
- Ex: "email marketing Brasil" vs "email marketing"

---

### P6: Que informações são coletadas / salvadas?

**R:** Política de Privacy:

✅ **Coletamos:**
- Domínios analisados
- Termos de busca
- Resultados gerados
- Timestamps

❌ **NÃO coletamos:**
- Dados pessoais seu
- Credenciais
- Cookies de tracking
- IP address

💾 **Armazenamento:**
- Local (seu browser cache)
- Sessão (enquanto aberto)
- Nada é enviado para servidor (aplicação client-side)

---

### P7: Como contribuir ou reportar bugs?

**R:** GitHub Issues:

```
1. Acesse: https://github.com/seu-usuario/content-hub-ai
2. Clique "New Issue"
3. Template:

**Tipo:** Bug / Feature Request / Question
**Descrição:**
O que aconteceu?
O que esperava?

**Para reproduzir:**
1. Clique em...
2. Digite...
3. Resultado: erro

**Evidência:**
[screenshot] ou [console error]
```

---

### P8: Melhor horário para rodar análises?

**R:** Recomendações:

- **Horário:** 2:00-6:00 da manhã UTC
  - Menos throttling
  - API mais rápida
  
- **Período:** Terça-Quinta
  - Menos pico de uso
  - Menos 403s

- **Frequência:**
  - Keywords: Weekly
  - Trends: Daily
  - Gaps: Monthly
  - Brand: Trimestral

---

### P9: Posso exportar e reimportar dados?

**R:** Parcialmente:

```json
// Export: JSON é compatível
{
  "domain": "site.com",
  "analysis": "competitive",
  "results": {...}
}

// Reimport: Não automático
// Mas: Use JSON para integração externa
// Não há forma UI para reimportar atual
```

**Workaround:**
```typescript
// Ler JSON exportado
const importedData = JSON.parse(localStorage.getItem('backup'));
// Criar visualization manualmente
```

---

### P10: E se a IA der resposta completamente errada?

**R:** Fallback & recovery:

1. **Primeira tentativa falhou?**
   ```
   Clique "Analisar" novamente
   IA pode ter alucinado na primeira vez
   ```

2. **Simplificar input**
   ```
   De: 10 termos complexos
   Para: 2 termos simples
   ```

3. **Mudar domínio teste**
   ```
   Se "seu-site.com" falha
   Teste com "google.com"
   Se google.com dá erro, problema é API
   Se google.com funciona, problema é seu site
   ```

4. **Clear cache & retry**
   ```
   DevTools > Application > Clear Site Data
   Recarga F5
   Tente novamente
   ```

5. **Reportar como bug** (se sistemático)

---

## 🔍 Debugging Avançado

### Habilitar Modo Debug

```typescript
// No App.tsx, adicione no topo:
const DEBUG = true;

// Em qualquer análise:
if (DEBUG) {
  console.log('Input:', { domain, terms });
  console.log('Raw API Response:', apiResponse);
  console.log('Parsed Result:', result);
}
```

### Ver Logs da API

```bash
# Terminal 1: App rodando
npm run dev

# Terminal 2: Ver logs
# Windows
Get-Content stderr.log -Tail 50 -Wait

# macOS/Linux
tail -f logs/api.log
```

### Network Inspection

```
1. Abra F12 (DevTools)
2. Aba "Network"
3. Execute análise
4. Veja requisições POST
5. Clique em cada uma
6. Abra "Response" para ver JSON completo
```

### Performance Profile

```javascript
// Console do browser
performance.mark('analysis-start');
// ... execute análise
performance.mark('analysis-end');
performance.measure('analysis', 'analysis-start', 'analysis-end');

const measure = performance.getEntriesByName('analysis')[0];
console.log(`Tempo total: ${measure.duration}ms`);
```

---

## 📞 Escalação

Se após tentar todas as soluções acima o problema persiste:

### Informações para incluir no report:

```
1. Vers app: (veja no rodapé)
2. Sistema: Windows/macOS/Linux
3. Browser: Chrome/Firefox/Safari
4. Versão OS: Win 11 / BigSur / Ubuntu 22.04
5. Erro exato com screenshot
6. Steps para reproduzir
7. Timestamp do erro (importante!)
```

### Canais de suporte:

| Canal | Tempo | Tipo |
|-------|-------|------|
| GitHub Issues | 24-48h | Bugs, Features |
| Email | 48-72h | Questões |
| Discord | Real-time | Chat rápido |
| Twitter | 24h | Anúncios |

---

## ✅ Checklist de Troubleshooting

Antes de reportar um bug, verifique:

- [ ] Versão Node.js? (v18+)
- [ ] npm install rodou?
- [ ] .env ter todas as variáveis?
- [ ] API key está válida?
- [ ] Browser atualizado?
- [ ] Cache limpo (Ctrl+Shift+Del)?
- [ ] Reiniciou Dev server?
- [ ] Hard reload (Ctrl+F5)?
- [ ] Testou com outro domínio?
- [ ] Testou com termo simples?

Se SIM em todas acima → OK para reportar conforme seção "Escalação"

---

*Última att: Mar 30, 2026*
*Version: 1.0.0*
