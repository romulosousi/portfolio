import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as mupdf from "mupdf";

const LISTING_URL =
  "https://doweb.rio.rj.gov.br/apifront/portal/edicoes/edicoes_from_data";
const DOWNLOAD_URL =
  "https://doweb.rio.rj.gov.br/portal/edicoes/download";

const UA =
  "Mozilla/5.0 (compatible; portfolio-rpa-bot/1.0; +https://romulosouza.dev)";

const FETCH_TIMEOUT_MS = 8000;
const MAX_RECORTES = 80;
// Soft deadline used to bail out of remaining work before the 10s Vercel
// Hobby hard timeout. Leaves ~1.5s for response serialization.
const SOFT_DEADLINE_MS = 8500;

interface ListingItem {
  id: string;
  data: string;
  // DOM-RJ retorna suplemento ora como string nomeada ("Multas SMTR", "")
  // ora como inteiro (1 / 0). Suportar ambos.
  suplemento: string | number;
  numero: string;
  paginas: string;
  tipo_edicao_nome?: string;
}

const isMainEdition = (it: ListingItem) =>
  it.suplemento === 0 ||
  it.suplemento === "" ||
  it.suplemento === "0" ||
  it.suplemento === null ||
  it.suplemento === undefined;

interface ListingResponse {
  erro: boolean;
  msg: string;
  itens: ListingItem[];
}

interface Recorte {
  id: number;
  page: number;
  section: string;
  text: string;
  pdfUrl?: string;
}

interface Resultado {
  nome: string;
  dataBR: string;
  edicao: string;
  totalPaginas: number;
  runtime: string;
  recortes: Recorte[];
  modo: "live";
  motivo?: "sem_edicao";
}

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

function fmtDataBR(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

async function fetchWithTimeout(url: string, init: RequestInit = {}) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      signal: ctrl.signal,
      headers: {
        "User-Agent": UA,
        Referer: "https://doweb.rio.rj.gov.br/",
        Accept: init.headers
          ? ((init.headers as Record<string, string>).Accept ?? "*/*")
          : "*/*",
        ...(init.headers as Record<string, string> | undefined),
      },
    });
  } finally {
    clearTimeout(id);
  }
}

// Mensagens do DOM-RJ que indicam "sem edição" para a data (domingo, feriado,
// recesso). Confirmado: em 2026-05-10 (domingo) o upstream devolve HTTP 200
// com {erro:true, msg:"Edição não existente!", itens:[]}. Tratamos como
// sem_edicao em vez de propagar como erro fatal.
const NO_EDITION_PATTERNS: RegExp[] = [
  // "Edição não existente!", "Edições não existem"
  /edi[cç](?:[aã]o|[oõ])e?s?\s+n[aã]o\s+exist/i,
  // "Não há edição", "Não existem edições", "Não foi encontrada edição"
  /n[aã]o\s+(?:h[aá]|existe|existem|foi|foram).{0,30}edi[cç]/i,
  // "Sem edição", "Sem publicação"
  /sem\s+(?:edi[cç]|publica[cç])/i,
  // "Nenhuma edição"
  /nenhuma\s+edi[cç]/i,
];

const isNoEditionMessage = (msg: string) =>
  NO_EDITION_PATTERNS.some((re) => re.test(msg));

async function fetchListing(data: string): Promise<ListingItem[]> {
  const r = await fetchWithTimeout(`${LISTING_URL}/${data}.json`, {
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  });
  if (!r.ok) throw new Error(`listing HTTP ${r.status}`);
  const json = (await r.json()) as ListingResponse;
  if (json.erro) {
    if (isNoEditionMessage(json.msg ?? "")) return [];
    throw new Error(`listing error: ${json.msg}`);
  }
  return json.itens ?? [];
}

async function fetchPdf(id: string): Promise<Buffer> {
  const r = await fetchWithTimeout(`${DOWNLOAD_URL}/${id}`);
  if (!r.ok) throw new Error(`pdf HTTP ${r.status}`);
  const ab = await r.arrayBuffer();
  return Buffer.from(ab);
}

function extractPagesText(buf: Buffer): {
  pages: string[];
  totalPages: number;
} {
  // mupdf é WASM nativo (MuPDF/Artifex) — 3-5x mais rápido que pdf-parse
  // (que usa pdf.js) e tolera PDFs com fontes não-padrão sem cuspir
  // warnings nem cair em fallbacks lentos.
  const doc = mupdf.Document.openDocument(buf, "application/pdf");
  try {
    const totalPages = doc.countPages();
    const pages: string[] = [];
    for (let i = 0; i < totalPages; i++) {
      const page = doc.loadPage(i);
      const st = page.toStructuredText("preserve-whitespace");
      try {
        pages.push(st.asText().replace(/\s+/g, " "));
      } finally {
        st.destroy();
        page.destroy();
      }
    }
    return { pages, totalPages };
  } finally {
    doc.destroy();
  }
}

// Detecta fim de sentença forte: ". " seguido de maiúscula, dígito ou aspas
// (início provável de novo ato/parágrafo no DOM-RJ). Filtra abreviações comuns
// como "Sr.", "art.", "n.", "nº.", "Dr." que não delimitam parágrafo.
const ABBREV = /\b(?:art|sr|sra|dr|dra|n[º°]?|cap|inc|al|p|fl|fls|pág|p[áa]g)\.?$/i;

function isSentenceBoundary(text: string, periodIdx: number): boolean {
  // text[periodIdx] === "."
  if (text[periodIdx + 1] !== " ") return false;
  const next = text[periodIdx + 2];
  if (!next) return false;
  if (!/[A-ZÀ-Ý0-9"]/.test(next)) return false;
  // Look back at the word before the period — skip abbreviations
  const lookBack = text.slice(Math.max(0, periodIdx - 12), periodIdx);
  if (ABBREV.test(lookBack)) return false;
  return true;
}

// Detecta fronteira de linha em listas tabulares do DOM-RJ. Suporta dois
// formatos comuns:
//   A) "\d{1,4}[ºo°] \d{4,}"  — listas de classificação tipo "287º 2477074"
//   B) "\d{5,7} <NOME EM CAIXA>"  — listas com ID puro tipo "30206 NORMA"
// Sem essa heurística os recortes pegavam dezenas de entradas vizinhas até
// bater no fim da página.
function isRowBoundary(text: string, i: number): boolean {
  if (text[i] !== " ") return false;
  let j = i + 1;
  const digitStart = j;
  while (j < text.length && /\d/.test(text[j])) j++;
  const digits = j - digitStart;
  if (digits === 0) return false;

  // Variante A: \d{1,4}[ºo°] \d{4,}
  if (
    digits <= 4 &&
    (text[j] === "º" || text[j] === "°" || text[j] === "o")
  ) {
    j += 1;
    if (text[j] !== " ") return false;
    while (j < text.length && text[j] === " ") j++;
    let idDigits = 0;
    while (j < text.length && /\d/.test(text[j])) {
      j++;
      idDigits++;
    }
    return idDigits >= 4;
  }

  // Variante B: \d{5,7} <CAP><CAP>+
  if (digits >= 5 && digits <= 7 && text[j] === " ") {
    j += 1;
    let upperLetters = 0;
    while (j < text.length && /[A-ZÀ-Ý]/.test(text[j])) {
      j++;
      upperLetters++;
    }
    return upperLetters >= 2;
  }

  return false;
}

// Detecta início de entidade em listas de gabinete/secretarias do DOM-RJ
// — sumários da edição que listam uma entidade administrativa por linha em
// formato `<Entidade Pessoa> <Próxima Entidade Pessoa>` sem fronteira de
// sentença ou número de ordem. Os "ato" para um nome listado é a entidade
// + a pessoa, então quebrar no início da próxima entidade dá um recorte
// limpo do tipo "Fundação X — SIGLA <Nome>".
const ENTITY_START =
  /^(?:Secretaria|Empresa|Funda[cç][aã]o|Instituto|Companhia|Subprefeitura|Coordenadoria|Centro|Ag[eê]ncia|Procuradoria|Tribunal|Departamento|Diretoria|Conselho|C[aâ]mara|Gabinete|Subsecretaria|Coordena[cç][aã]o|Superintend[eê]ncia|Controladoria|Divis[aã]o|N[uú]cleo|Prefeitura|PREFEITURA|SECRETARIA|EMPRESA|FUNDA[CÇ][AÃ]O)\b/;

function isEntityBoundary(text: string, i: number): boolean {
  if (text[i] !== " ") return false;
  // Should be preceded by a letter (end of person name), not punctuation
  if (i === 0 || !/[a-zA-Zà-ÿÀ-Ý]/.test(text[i - 1])) return false;
  return ENTITY_START.test(text.slice(i + 1, i + 30));
}

// Detecta início de registro tabular do tipo extrato de contrato / termo de
// compromisso, marcado por palavras-chave seguidas de `:`. Cada bloco no
// DOM-RJ começa com "Instrumento:" e isso é a fronteira mais limpa.
const RECORD_START = /^Instrumento\s*:/;

function isRecordBoundary(text: string, i: number): boolean {
  if (text[i] !== " ") return false;
  // Não quebra logo após pontuação interna (vírgula, dois-pontos, ponto-e-vírgula)
  if (i > 0 && /[,:;]/.test(text[i - 1])) return false;
  return RECORD_START.test(text.slice(i + 1, i + 16));
}

function extractParagraph(
  pageText: string,
  idx: number,
  nameLen: number
): { text: string; truncStart: boolean; truncEnd: boolean } {
  // Walk back from `idx` to find the start of the current paragraph/ato/row/entity/record.
  // Sem cap de chars: percorre até o início da página ou até achar fronteira.
  let start = 0;
  let foundStart = true;
  for (let i = idx - 2; i >= 0; i--) {
    if (pageText[i] === "." && isSentenceBoundary(pageText, i)) {
      start = i + 2; // skip ". "
      foundStart = true;
      break;
    }
    if (isRowBoundary(pageText, i)) {
      start = i + 1; // start AFTER the space, at "287º"
      foundStart = true;
      break;
    }
    if (isRecordBoundary(pageText, i)) {
      start = i + 1; // start AFTER the space, at "Instrumento:"
      foundStart = true;
      break;
    }
    if (isEntityBoundary(pageText, i)) {
      start = i + 1; // start AFTER the space, at "Secretaria"
      foundStart = true;
      break;
    }
  }

  // Walk forward from end-of-name to find the end of the paragraph/ato/row/entity/record.
  // Sem cap de chars: percorre até o fim da página ou até achar fronteira.
  const minEnd = idx + nameLen;
  let end = pageText.length;
  let foundEnd = true;
  for (let i = minEnd; i < pageText.length - 2; i++) {
    if (pageText[i] === "." && isSentenceBoundary(pageText, i)) {
      end = i + 1; // include the period itself
      foundEnd = true;
      break;
    }
    if (isRowBoundary(pageText, i)) {
      end = i; // end at the space (right before next row's number)
      foundEnd = true;
      break;
    }
    if (isRecordBoundary(pageText, i)) {
      end = i; // end at the space (right before next "Instrumento:")
      foundEnd = true;
      break;
    }
    if (isEntityBoundary(pageText, i)) {
      end = i; // end at the space (right before next entity)
      foundEnd = true;
      break;
    }
  }

  return {
    text: pageText.slice(start, end).trim(),
    truncStart: !foundStart,
    truncEnd: !foundEnd,
  };
}

function searchRecortes(
  pages: string[],
  nome: string,
  edicaoLabel: string,
  pdfUrl: string,
  startId: number
): Recorte[] {
  const target = norm(nome);
  if (!target) return [];
  const recortes: Recorte[] = [];
  let nextId = startId;

  for (let p = 0; p < pages.length; p++) {
    const pageText = pages[p];
    const pageN = norm(pageText);
    let from = 0;
    while (true) {
      const idx = pageN.indexOf(target, from);
      if (idx === -1) break;
      const { text, truncStart, truncEnd } = extractParagraph(
        pageText,
        idx,
        target.length
      );
      const prefix = truncStart ? "..." : "";
      const suffix = truncEnd ? "..." : "";
      recortes.push({
        id: nextId++,
        page: p + 1,
        section: edicaoLabel,
        text: `${prefix}${text}${suffix}`,
        pdfUrl,
      });
      from = idx + target.length;
      if (recortes.length >= MAX_RECORTES) return recortes;
    }
  }
  return recortes;
}

function isValidIsoDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const nome = String(req.query.nome ?? "").trim();
  const data = String(req.query.data ?? "").trim();

  if (!nome || nome.length < 2) {
    res.status(400).json({ error: "nome_invalido" });
    return;
  }
  if (!isValidIsoDate(data)) {
    res.status(400).json({ error: "data_invalida" });
    return;
  }

  const t0 = Date.now();
  const tlog = (msg: string) =>
    console.log(`[+${Date.now() - t0}ms] ${msg}`);

  try {
    tlog("start fetchListing");
    const itens = await fetchListing(data);
    tlog(`got listing: ${itens.length} editions`);
    if (itens.length === 0) {
      const runtime = `${((Date.now() - t0) / 1000).toFixed(1)}s`;
      const out: Resultado = {
        nome,
        dataBR: fmtDataBR(data),
        edicao: "—",
        totalPaginas: 0,
        runtime,
        recortes: [],
        modo: "live",
        motivo: "sem_edicao",
      };
      res.setHeader(
        "Cache-Control",
        "s-maxage=3600, stale-while-revalidate=86400"
      );
      res.status(200).json(out);
      return;
    }

    // Processa só as edições principais. DOM-RJ tem suplementos diários de
    // Multas SMTR (~900 págs sem nomes pessoais) que estouram o timeout de
    // 10s do Hobby. Edição principal sempre tem os atos com nomes.
    const ordered = itens.filter(isMainEdition);

    // Kick off all PDF downloads in parallel — saves serial network latency.
    const downloads = ordered.map((item) =>
      fetchPdf(item.id).then((buf) => ({ item, buf }))
    );

    let totalPaginas = 0;
    const allRecortes: Recorte[] = [];
    const edicaoLabels: string[] = [];

    for (const dl of downloads) {
      // Honor the soft deadline: skip remaining editions if we're close to
      // the 10s hard timeout. The first edition is always processed.
      if (
        edicaoLabels.length > 0 &&
        Date.now() - t0 > SOFT_DEADLINE_MS - 1500
      ) {
        break;
      }

      let item: ListingItem;
      let buf: Buffer;
      try {
        ({ item, buf } = await dl);
      } catch {
        continue;
      }
      tlog(`pdf downloaded: id=${item.id} size=${(buf.length / 1e6).toFixed(2)}MB`);

      const label = item.tipo_edicao_nome ?? `Nº ${item.numero}`;
      edicaoLabels.push(`Nº ${item.numero}`);

      const pdfUrl = `${DOWNLOAD_URL}/${item.id}`;
      const { pages, totalPages } = extractPagesText(buf);
      tlog(`mupdf parsed: ${totalPages} pages`);
      totalPaginas += totalPages;

      const found = searchRecortes(
        pages,
        nome,
        label,
        pdfUrl,
        allRecortes.length
      );
      allRecortes.push(...found);
      if (allRecortes.length >= MAX_RECORTES) break;
    }

    if (edicaoLabels.length === 0) {
      const runtime = `${((Date.now() - t0) / 1000).toFixed(1)}s`;
      res.setHeader(
        "Cache-Control",
        "s-maxage=3600, stale-while-revalidate=86400"
      );
      res.status(200).json({
        nome,
        dataBR: fmtDataBR(data),
        edicao: "—",
        totalPaginas: 0,
        runtime,
        recortes: [],
        modo: "live",
        motivo: "sem_edicao",
      } satisfies Resultado);
      return;
    }

    const runtime = `${((Date.now() - t0) / 1000).toFixed(1)}s`;
    const out: Resultado = {
      nome,
      dataBR: fmtDataBR(data),
      edicao: edicaoLabels.join(" + "),
      totalPaginas,
      runtime,
      recortes: allRecortes,
      modo: "live",
    };

    res.setHeader(
      "Cache-Control",
      "s-maxage=86400, stale-while-revalidate=604800"
    );
    res.status(200).json(out);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    res.status(502).json({ error: "upstream_failure", message });
  }
}
