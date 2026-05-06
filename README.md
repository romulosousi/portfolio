# Portfolio — Rômulo Souza

Portfólio pessoal de Rômulo Souza (RPA Developer · Python). Vite + React + TypeScript + Tailwind, com uma demo funcional que consulta o Diário Oficial do Município do Rio de Janeiro (DOM-RJ) através de uma Vercel Serverless Function.

## Stack

- **Vite 5** + **React 18** + **TypeScript** (estrito)
- **Tailwind CSS 3** com tokens nomeados (`bg-bg-0`, `text-fg-0`, `text-green`, `border-line`…) mapeados pra variáveis CSS em `:root`
- **Recharts** (gráficos)
- **Fontes locais** via `@fontsource/jetbrains-mono`, `@fontsource/geist-sans`, `@fontsource/instrument-serif` — sem requisição a Google Fonts em runtime
- **i18n PT/EN** com Context API próprio + persistência em `localStorage`
- **API serverless** (`api/diario-rio.ts`) em Node, com `mupdf` (binding WASM da MuPDF/Artifex) pra extração de texto — 3-5x mais rápido que pdf-parse e tolera PDFs com fontes não-padrão

## Estrutura

```
.
├── api/
│   └── diario-rio.ts       # Vercel Serverless Function (DOM-RJ)
├── public/                 # estáticos servidos como /
├── src/
│   ├── components/         # Header, Ticker, Hero, Demo, Experiencia, Formacao, Skills, Contato, Footer, SectionHead
│   ├── data/               # pessoal, experiencia, formacao, skills, mocks
│   ├── hooks/              # useT, useClock
│   ├── i18n/               # I18nContext + dicionários pt/en + tipos
│   ├── styles/globals.css  # :root vars + keyframes + reset
│   ├── types/              # tipos compartilhados (Lang, Experiencia, Formacao, ...)
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── tailwind.config.ts
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json             # configuração de funções
└── package.json
```

## Rodando local

Pré-requisitos: Node 18+ (recomendado 20 LTS).

```bash
npm install
npm run dev
```

A aplicação sobe em http://localhost:5173.

> A demo do DOM-RJ chama `/api/diario-rio`, que **não existe** no servidor de dev do Vite. Para testar a demo localmente com a função real, use `vercel dev`:
>
> ```bash
> npm i -g vercel
> vercel dev
> ```
>
> Sem isso, a demo cai automaticamente no modo offline (mock) — exatamente como faria em produção se a API estivesse fora do ar.

### Build de produção

```bash
npm run build       # compila TS + builda estáticos em dist/
npm run preview     # serve o dist/ localmente
```

## Deploy na Vercel

### Primeiro deploy

1. Suba este diretório pra um repositório novo no GitHub:

   ```bash
   git init
   git add .
   git commit -m "init: portfolio Vite + React + TS"
   git branch -M main
   git remote add origin git@github.com:romulosouza/portfolio.git
   git push -u origin main
   ```

2. Em https://vercel.com → **Add New → Project** → importe o repositório.
3. Vercel detecta Vite automaticamente. Confirme:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Clique em **Deploy**. O domínio inicial vem como `portfolio-xxxx.vercel.app`.

### Deploys seguintes

Cada `git push` na branch `main` dispara um deploy de produção. PRs ganham preview automático.

### Limites e custos

A function `api/diario-rio.ts` roda em **Vercel Hobby (free)** com `maxDuration: 10s` e `memory: 1024 MB`. Comportamento medido:

- **Parse via mupdf**: ~0.3-1s pra qualquer edição até ~300 págs. Não varia com qualidade do PDF.
- **Suplemento "Multas SMTR"** (~900 págs/dia, sem nomes pessoais): a function pula automaticamente.
- **Bottleneck restante**: download do PDF a partir do DOM-RJ (1-8s dependendo da rede do servidor → Rio).

Em dias muito ruins de rede o cliente cai automaticamente em **modo offline (mock)** com banner avisando. Cache CDN de 24h (`s-maxage=86400`) faz a 2ª requisição da mesma `(nome, data)` retornar em ms — então mesmo que a primeira chamada falhe, basta tentar de novo.

Pra eliminar 100% dos timeouts, use **Vercel Pro** (60s de timeout) — `vercel.json` já tem `maxDuration` configurável.

## Domínio customizado

1. No dashboard do projeto na Vercel → **Settings → Domains**.
2. Clique em **Add** e digite o domínio (ex: `romulosouza.dev`).
3. Vercel mostra os DNS records que precisam apontar pro projeto:
   - **Apex** (`romulosouza.dev`): `A` record → `76.76.21.21`
   - **www**: `CNAME` → `cname.vercel-dns.com`
4. Configure esses records no painel do registrador (Registro.br, Cloudflare, GoDaddy, etc.).
5. Aguarde a propagação DNS (~minutos a algumas horas). Vercel emite o cert SSL automático via Let's Encrypt.

## API: `/api/diario-rio`

```
GET /api/diario-rio?nome={nome}&data={YYYY-MM-DD}
```

Resposta de sucesso (`200`):

```json
{
  "nome": "João da Silva",
  "dataBR": "06/05/2026",
  "edicao": "Nº 32",
  "totalPaginas": 264,
  "runtime": "4.2s",
  "recortes": [
    {
      "id": 0,
      "page": 47,
      "section": "Diario Oficial da Prefeitura do Rio de Janeiro",
      "text": "...nomeia João da Silva para exercer o cargo...",
      "pdfUrl": "https://doweb.rio.rj.gov.br/portal/edicoes/download/14782"
    }
  ],
  "modo": "live"
}
```

**Normalização**: a busca ignora maiúsculas e diacríticos. `joão da silva`, `JOAO DA SILVA` e `João da Silva` retornam os mesmos resultados.

Resposta sem edição publicada (fim de semana / feriado): `motivo: "sem_edicao"` e `recortes: []`.

Erros: `400` (parâmetros inválidos), `502` (falha upstream), `405` (método ≠ GET).

Cache: respostas com edição válida ficam cacheadas no CDN da Vercel por 24h (`s-maxage=86400`).

## Licença

MIT.
