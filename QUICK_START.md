# ⚡ Quick Start - Content Hub AI

Comece em 5 minutos! Guia de onboarding rápido e direto.

---

## 🎬 Começar em 5 Minutos

### Pré-requisitos (verificar antes de começar)

```bash
# 1. Node.js >= v18
node --version       # Se não tiver: https://nodejs.org/

# 2. npm (incluso com Node.js)
npm --version

# 3. Git (para clonar repo)
git --version        # Se não tiver: https://git-scm.com/
```

---

### Passo 1: Obter API Key Gemini (2 min)

1. Acesse: https://ai.google.dev
2. Clique **"Get API Key"**
3. Clique **"Create new API key"**
4. Copie a chave gerada
5. Guarde com cuidado ⚠️

**Verifique:**
```bash
# Salve a chave em um lugar seguro
echo "VITE_GEMINI_API_KEY=sua_chave_aqui" > .env.local
```

---

### Passo 2: Clonar Repositório (1 min)

```bash
# Clone o projeto
git clone https://github.com/seu-usuario/content-hub-ai.git

# Entre na pasta
cd content-hub-ai

# Veja o conteúdo
ls -la
```

---

### Passo 3: Instalar Dependências (2 min)

```bash
# Instale pacotes
npm install

# Verificar se tudo instalou bem
npm list react    # Deve aparecer versão 19.0.0
```

---

### Passo 4: Configurar Variáveis (1 min)

```bash
# Crie arquivo .env na raiz do projeto
# (Se nunca fez antes, veja exemplo abaixo)

# Opção 1: Criar com editor
# Abra arquivo vazio e nomeie como .env

# Opção 2: Criar via terminal
# Windows PowerShell
New-Item .env

# macOS/Linux
touch .env

# Agora edite e adicione:
```

**Conteúdo do arquivo .env:**
```env
VITE_GEMINI_API_KEY=seu_key_aqui_sem_espacos
VITE_FIRECRAWL_API_KEY=opcional_por_enquanto
```

**⚠️ IMPORTANTE:**
- Não coloque .env em Git! (já está no .gitignore)
- Não compartilhe sua chave
- Regenere se algém acessou

---

### Passo 5: Rodar Aplicação (1 min)

```bash
# Inicie dev server
npm run dev

# Você verá algo como:
# ➜  Local:   http://localhost:5173/
# ➜  press h for help

# Clique no link ou abra no navegador:
# http://localhost:5173
```

✅ **Pronto!** A aplicação está rodando!

---

## 🎯 Seu Primeiro Teste (3 min)

### Teste 1: Landing Page

1. **Página inicial carrega?** ✅
   - Logo, hero section, features
   
2. **Botão "Acessar Plataforma" funciona?** ✅
   - Clique para ir ao dashboard

### Teste 2: Dashboard

1. **Digite domínio:**
   ```
   google.com
   ```

2. **Vá na aba "Pesquisa"**

3. **Digite um termo:**
   ```
   inteligência artificial
   ```

4. **Clique "Analisar"**

5. **Aguarde 8-12 segundos...**

6. **Resultado aparece?** ✅
   - Se SIM: Parabéns! Tudo funcionando
   - Se NÃO: Ver troubleshooting abaixo

---

## 🔧 Troubleshooting Rápido

### ❌ "Erro de API"

```
Error: Invalid API key
```

**Solução:**
```bash
1. Verificar .env tem a chave
2. Nem espaços antes/depois!
3. Regenerar chave em https://ai.google.dev
4. Reiniciar: npm run dev
```

---

### ❌ "Porta 5173 já em uso"

```
Error: Port 5173 already in use
```

**Solução:**
```bash
# Opção 1: Matar processo
# Windows
netstat -ano | findstr :5173
taskkill /PID [PID] /F

# macOS/Linux
lsof -i :5173
kill -9 [PID]

# Opção 2: Usar outra porta
npm run dev -- --port 3000
```

---

### ❌ "npm install falha"

**Solução:**
```bash
# Limpe cache
npm cache clean --force

# Delete pasta node_modules
rm -r node_modules      # macOS/Linux
rmdir /s node_modules   # Windows

# Reinstale
npm install
```

---

## 📝 Estrutura do Projeto (para familiarizar)

```
content-hub-ai/
├─ src/
│  ├─ App.tsx              ← Dashboard principal
│  ├─ main.tsx             ← Entry point
│  ├─ components/
│  │  ├─ LandingPage.tsx   ← Homepage
│  │  └─ ui/               ← Componentes reutilizáveis
│  └─ services/
│     ├─ geminiService.ts  ← Integração Gemini
│     └─ firecrawlService.ts
│
├─ public/
│  ├─ gemini-color.svg     ← Logos
│  └─ firecrawl-logo.svg
│
├─ .env                    ← API keys (não versionar!)
├─ vite.config.ts          ← Config build
├─ package.json            ← Dependências
└─ tsconfig.json           ← TypeScript config
```

---

## 🚀 Próximos Passos (depois de rodar)

### 1️⃣ Testar Todas as Abas (5 min)

```
Dashboard → 10 abas
├─ Pesquisa Competitiva ← Comece aqui
├─ Trends
├─ Brands
├─ Recycler
├─ Monitor Sitemap
├─ Auditoria SEO
├─ Keywords
├─ Gaps
├─ Recomendações
└─ Calendar Editorial
```

**Para cada aba:**
- Digite input
- Clique botão análise
- Espere resultado
- Experimente diferentes inputs

---

### 2️⃣ Ler Documentação Completa (20 min)

```
Arquivos no projeto:
├─ README.md              ← Overview geral
├─ README_ROBUSTO.md      ← Features em detalhe
├─ GUIA_USO.md            ← Como usar cada feature
├─ TECHNICAL_DOCS.md      ← Arquitetura (dev)
├─ FAQ_TROUBLESHOOTING.md ← Perguntas frequentes
└─ ROADMAP.md             ← Futuro da plataforma
```

---

### 3️⃣ Customizar para Seu Caso (15 min)

```typescript
// App.tsx - Adicione seu domínio padrão
const DEFAULT_DOMAIN = "seu-site.com"

// src/index.css - Mude cor primária
--primary: 22 100% 52%;  ← Seu brand color
```

---

### 4️⃣ Deployar (Opcional)

**Opção A: Vercel (1 clique, recomendado)**
```bash
# 1. Instale Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Siga instruções
# Vercel vai:
# - Clonar seu repo
# - Build automaticamente
# - Hospedar em HTTPS
# Resultado: https://seu-projeto.vercel.app
```

**Opção B: Docker**
```bash
# Build image
docker build -t content-hub-ai .

# Rodar container
docker run -p 3000:3000 -e VITE_GEMINI_API_KEY=sua_chave content-hub-ai
```

---

## 💡 Commands Úteis

```bash
# Desenvolvimento
npm run dev          # Inicia dev server (http://localhost:5173)
npm run build        # Build para produção
npm run preview      # Testa build localmente
npm run lint         # Verifica qualidade código

# Debugging
npm run dev          # Com hot reload automático (F5 para refresh)

# Limpeza
npm cache clean --force
rm -r node_modules && npm install
```

---

## 🎓 Próximo Estudo Recomendado

### Se quer mexer no código:

1. **Entender React Hooks** (30 min)
   - useState, useEffect
   - Como o App.tsx usa estados

2. **Ver como Gemini é chamado** (15 min)
   - Arquivo: `src/services/geminiService.ts`
   - Função: `generateRecs()`

3. **Adicionar novo prompt** (1 hora)
   - Clone função existente
   - Mude o prompt
   - Teste no dashboard

---

## 📚 Stack Explicado Em 30 Segundos

```
React 19 + TypeScript
├─ UI components (botões, cards, etc)
├─ State management (useState)
└─ Hooks for lifecycle

Vite
├─ Build tool super rápido
└─ Hot module reload (F5 auto-refresh)

Tailwind CSS
├─ Utilidades de styling
└─ Responsive design pronto

Gemini 2.0
├─ LLM para gerar análises
└─ Via API REST

Firecrawl
├─ Scraping de websites
└─ Extração de dados
```

---

## ❓ FAQs Rápidos

**P: Posso usar com seu próprio site/domínio?**
R: SIM! Digite qualquer domínio no input principal.

**P: Preciso de Firecrawl key?**
R: Não é obrigatório por enquanto. Gemini funciona sozinho.

**P: Como faço pra não expor minha API key?**
R: Use arquivo .env (não commite). Em produção, use secrets manager.

**P: Posso clonar e modificar livremente?**
R: SIM! Está em repo público. Respeite a licença.

**P: Histórico de análises é salvo?**
R: Atualmente é local (localStorage). Backend em roadmap.

---

## 🎉 Sucesso!

Você conseguiu! 🎊

### Próxima vez:
```bash
cd content-hub-ai
npm run dev
# Vá para http://localhost:5173
```

### Precisa de ajuda?
- 🐛 Bug report: GitHub Issues
- 📖 Mais info: Veja README_ROBUSTO.md
- 🤔 Dúvida técnica: Ver TECHNICAL_DOCS.md
- 🆘 Troubleshooting: FAQ_TROUBLESHOOTING.md

---

**Pronto para criar conteúdo incrível! 🚀**

*v1.0.0 | Março 2026*
