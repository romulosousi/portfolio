import { useEffect, useRef, useState } from "react";
import { MOCK_CADERNOS, MOCK_TRECHOS } from "@/data/mocks";
import { useT } from "@/hooks/useT";
import type { DiarioResultado, Recorte } from "@/types";
import { SectionHead } from "./SectionHead";

interface LogEntry {
  id: string;
  time: string;
  texto: string;
  tipo: "ok" | "info" | "muted" | "err";
}

const fmtDataBR = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const escapeRegex = (s: string) =>
  s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function highlightName(text: string, nome: string): string {
  if (!nome.trim()) return text;
  const re = new RegExp(escapeRegex(nome), "gi");
  return text.replace(
    re,
    (match) =>
      `<mark style="background:rgba(61,255,142,0.18);color:var(--green);padding:0 2px;border-radius:2px;">${match}</mark>`
  );
}

function buildMockResult(nome: string, data: string, lang: "pt" | "en"): DiarioResultado {
  const dataBR = fmtDataBR(data);
  const edicao = `Nº ${70 + (parseInt(data.replace(/-/g, ""), 10) % 30)}`;
  const totalPaginas = 80 + ((nome.length * 3) % 60);
  const trechos = MOCK_TRECHOS[lang];
  const qtd = 2 + (nome.length % 3);
  const recortes: Recorte[] = [];
  for (let i = 0; i < qtd; i++) {
    const tr = trechos[i % trechos.length]
      .replace(/\{NOME\}/g, nome)
      .replace("{NN}", String(100 + i * 7));
    recortes.push({
      id: i,
      page: 12 + i * 9 + (nome.length % 5),
      section: MOCK_CADERNOS[i % MOCK_CADERNOS.length],
      text: tr,
    });
  }
  return {
    nome,
    dataBR,
    edicao,
    totalPaginas,
    runtime: "3,1s",
    recortes,
    modo: "mock",
  };
}

export function Demo() {
  const { t, lang } = useT();
  const [nome, setNome] = useState("João Souza");
  const [data, setData] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [running, setRunning] = useState(false);
  const [resultado, setResultado] = useState<DiarioResultado | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const log = (texto: string, tipo: LogEntry["tipo"] = "info") => {
    const time = new Date().toLocaleTimeString("pt-BR", { hour12: false });
    setLogs((prev) => [
      ...prev,
      {
        time,
        texto,
        tipo,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      },
    ]);
  };

  const executar = async () => {
    if (!nome.trim()) return;
    setRunning(true);
    setLogs([]);
    setResultado(null);

    const dataBR = fmtDataBR(data);
    const t0 = Date.now();

    log(
      `init worker.dom_rj_search pid=${Math.floor(Math.random() * 9000 + 1000)}`,
      "ok"
    );

    const url = `/api/diario-rio?nome=${encodeURIComponent(
      nome
    )}&data=${encodeURIComponent(data)}`;

    const controller = new AbortController();
    const clientTimeout = window.setTimeout(() => controller.abort(), 60000);
    const fetchPromise = fetch(url, { signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return (await r.json()) as DiarioResultado;
      })
      .finally(() => window.clearTimeout(clientTimeout));

    await sleep(280);
    log(`config: nome="${nome}" data=${dataBR}`, "muted");
    await sleep(320);
    log("conectando ao DOM-RJ (doweb.rio.rj.gov.br)...", "info");
    await sleep(380);
    log("baixando edição (~5-8MB) — pode levar até ~20s", "muted");

    // While the fetch is in-flight, keep the terminal alive with periodic
    // progress logs every ~3s. They stop the moment the real fetch resolves.
    let resolved = false;
    let stage = 0;
    const progressMessages = [
      "  ↳ aguardando bytes do servidor DOM-RJ...",
      "  ↳ baixando... 50%",
      "  ↳ extraindo texto via mupdf (WASM)...",
      "  ↳ buscando ocorrências por página...",
      "  ↳ quase lá — finalizando recortes",
      "  ↳ serializando resposta...",
    ];
    const progressTimer = window.setInterval(() => {
      if (resolved) return;
      const msg = progressMessages[Math.min(stage, progressMessages.length - 1)];
      log(msg, "muted");
      stage += 1;
    }, 3000);

    let real: DiarioResultado | null = null;
    let fetchErr: Error | null = null;
    try {
      real = await fetchPromise;
    } catch (e) {
      fetchErr = e instanceof Error ? e : new Error(String(e));
    } finally {
      resolved = true;
      window.clearInterval(progressTimer);
    }

    if (!real || fetchErr) {
      await sleep(220);
      log(
        `falha na API: ${fetchErr?.message ?? "resposta inválida"}`,
        "err"
      );
      await sleep(180);
      log(t.demo_offline_notice, "info");
      const mock = buildMockResult(nome, data, lang);
      await sleep(220);
      log(`${mock.recortes.length} ocorrência(s) encontrada(s) [mock]`, "ok");
      await sleep(120);
      const elapsed = ((Date.now() - t0) / 1000)
        .toFixed(1)
        .replace(".", lang === "pt" ? "," : ".");
      log(`done [${elapsed}s] ✓`, "ok");
      setResultado({ ...mock, runtime: `${elapsed}s` });
      setRunning(false);
      return;
    }

    await sleep(160);
    if (real.motivo === "sem_edicao") {
      log("nenhuma edição publicada nessa data", "info");
      log(`done [${real.runtime}] ✓`, "ok");
      setResultado(real);
      setRunning(false);
      return;
    }

    log(`200 OK · ${real.edicao}`, "ok");
    await sleep(180);
    log(
      `${real.totalPaginas} ${
        lang === "pt" ? "páginas analisadas" : "pages scanned"
      }`,
      "ok"
    );
    await sleep(180);
    log(`buscando ocorrências de "${nome}"...`, "info");
    await sleep(160);
    log(`${real.recortes.length} ocorrência(s) encontrada(s)`, "ok");
    await sleep(140);
    log(`done [${real.runtime}] ✓`, "ok");

    setResultado(real);
    setRunning(false);
  };

  const isOffline = resultado?.modo === "mock";

  return (
    <section id="demo" className="border-b border-line">
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <SectionHead
          idx="02"
          tag={t.demo_tag}
          title={
            <>
              {t.demo_title_a}{" "}
              <span className="serif text-green font-normal">
                {t.demo_title_b}
              </span>
            </>
          }
          sub={t.demo_sub}
        />

        <div className="grid lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 hairline rounded-[4px] bg-bg-1">
            <div className="flex items-center justify-between px-4 h-9 border-b border-line">
              <span className="mono text-[10px] uppercase tracking-[0.12em] text-fg-2">
                {t.demo_params}
              </span>
              <span className="mono text-[10px] text-green">
                ● {t.demo_ready}
              </span>
            </div>
            <div className="p-4 space-y-4">
              <label className="block">
                <div className="mono text-[10px] uppercase tracking-[0.1em] text-fg-2 mb-1.5">
                  {t.demo_name}
                </div>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder={t.demo_name_ph}
                  className="field w-full px-3 h-10 mono text-[13px]"
                />
              </label>

              <label className="block">
                <div className="mono text-[10px] uppercase tracking-[0.1em] text-fg-2 mb-1.5">
                  {t.demo_date}
                </div>
                <input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="field w-full px-3 h-10 mono text-[13px] tnum"
                />
              </label>

              <button
                onClick={executar}
                disabled={running || !nome.trim()}
                className="w-full h-11 rounded-[3px] mono text-[12px] uppercase tracking-[0.1em] font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed bg-green text-black hover:bg-white"
              >
                {running ? (
                  <>
                    <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full spin"></span>
                    {t.demo_running}
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 bg-black"></span>
                    {t.demo_run}
                    <span className="opacity-50">↵</span>
                  </>
                )}
              </button>

              <div className="pt-3 border-t border-line mono text-[10px] text-fg-2 flex items-center justify-between">
                <span>{t.demo_source}</span>
                <span className={isOffline ? "text-amber" : "text-green"}>
                  {isOffline ? t.demo_mock : t.demo_live}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="hairline rounded-[4px] bg-[#06080a] overflow-hidden">
              <div className="flex items-center justify-between px-4 h-9 border-b border-line bg-bg-1">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#3a3f47]"></span>
                    <span className="w-2 h-2 rounded-full bg-[#3a3f47]"></span>
                    <span className="w-2 h-2 rounded-full bg-green-dim"></span>
                  </div>
                  <span className="mono text-[10px] uppercase tracking-[0.1em] text-fg-2 ml-2">
                    /var/log/worker.dom_rj.log
                  </span>
                </div>
                <span className="mono text-[10px] text-fg-2">tail -f</span>
              </div>
              <div
                ref={terminalRef}
                className="term-scroll p-4 mono text-[12px] leading-[1.75] text-fg-1 overflow-y-auto"
                style={{ minHeight: 260, maxHeight: 320 }}
              >
                {logs.length === 0 && !running && (
                  <div className="text-fg-3">
                    <span className="text-green-dim">$</span>{" "}
                    {t.demo_log_wait}
                    <span className="cursor inline-block w-1.5 h-3.5 bg-green align-middle ml-1"></span>
                  </div>
                )}
                {logs.map((e) => (
                  <div key={e.id} className="log-line">
                    <span className="text-fg-3">[{e.time}]</span>{" "}
                    <span
                      className={
                        e.tipo === "ok"
                          ? "text-green"
                          : e.tipo === "info"
                            ? "text-blue"
                            : e.tipo === "err"
                              ? "text-red"
                              : "text-fg-3"
                      }
                    >
                      {e.tipo === "ok"
                        ? "✓"
                        : e.tipo === "info"
                          ? "→"
                          : e.tipo === "err"
                            ? "✗"
                            : "·"}
                    </span>{" "}
                    <span
                      className={
                        e.tipo === "muted" ? "text-fg-2" : "text-fg-0"
                      }
                    >
                      {e.texto}
                    </span>
                  </div>
                ))}
                {running && (
                  <span className="cursor inline-block w-1.5 h-3.5 bg-green align-middle ml-1"></span>
                )}
              </div>
            </div>

            {resultado && <DemoResultado resultado={resultado} />}
          </div>
        </div>
      </div>
    </section>
  );
}

const PAGE_SIZE = 5;

function DemoResultado({ resultado }: { resultado: DiarioResultado }) {
  const { t } = useT();
  const [page, setPage] = useState(1);
  const isOffline = resultado.modo === "mock";

  // Reset paginação quando a busca muda (novo resultado).
  useEffect(() => {
    setPage(1);
  }, [resultado]);

  if (resultado.motivo === "sem_edicao") {
    return (
      <div className="hairline rounded-[4px] bg-bg-1 p-6 mono text-[12px] text-fg-2">
        <span className="text-amber mr-2">⚠</span>
        {t.demo_no_edition}
      </div>
    );
  }

  const cards: Array<{
    l: string;
    v: string;
    green?: boolean;
    accent?: boolean;
  }> = [
    {
      l: t.demo_res_found,
      v: String(resultado.recortes.length),
      green: true,
    },
    { l: t.demo_res_pages, v: String(resultado.totalPaginas) },
    { l: t.demo_res_edition, v: resultado.edicao, accent: true },
    { l: t.demo_res_runtime, v: resultado.runtime },
  ];

  return (
    <>
      {isOffline && (
        <div className="hairline rounded-[4px] bg-bg-1 px-4 py-2.5 mono text-[11px] text-amber">
          <span className="mr-2">⚠</span>
          {t.demo_offline_notice}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 hairline rounded-[4px] overflow-hidden bg-bg-1">
        {cards.map((m, i) => (
          <div
            key={i}
            className={`px-4 py-4 ${i > 0 ? "border-l border-line" : ""}`}
          >
            <div className="mono text-[10px] uppercase tracking-[0.1em] text-fg-2 mb-2">
              {m.l}
            </div>
            <div
              className={`mono tnum text-[18px] ${
                m.green
                  ? "text-green"
                  : m.accent
                    ? "text-fg-0"
                    : "text-fg-1"
              }`}
            >
              {m.v}
            </div>
          </div>
        ))}
      </div>

      {resultado.recortes.length === 0 ? (
        <div className="hairline rounded-[4px] bg-bg-1 p-6 mono text-[12px] text-fg-2 text-center">
          {t.demo_no_results}
        </div>
      ) : (
        (() => {
          const totalPages = Math.max(
            1,
            Math.ceil(resultado.recortes.length / PAGE_SIZE)
          );
          const safePage = Math.min(page, totalPages);
          const sliceStart = (safePage - 1) * PAGE_SIZE;
          const sliceEnd = sliceStart + PAGE_SIZE;
          const visible = resultado.recortes.slice(sliceStart, sliceEnd);
          const showRange = `${sliceStart + 1}-${Math.min(sliceEnd, resultado.recortes.length)}`;
          return (
            <div className="hairline rounded-[4px] bg-bg-1">
              <div className="flex items-center justify-between px-4 h-9 border-b border-line">
                <div className="flex items-center gap-3">
                  <span className="mono text-[10px] uppercase tracking-[0.12em] text-fg-2">
                    recortes.json
                  </span>
                  <span className="mono text-[10px] text-fg-3">·</span>
                  <span className="mono text-[10px] text-fg-1">
                    "{resultado.nome}"
                  </span>
                  <span className="mono text-[10px] text-fg-3">
                    {resultado.dataBR}
                  </span>
                </div>
                <div className="mono text-[10px] text-green tnum">
                  {showRange} / {resultado.recortes.length}
                </div>
              </div>
              <div className="divide-y divide-line">
                {visible.map((r) => (
                  <div key={r.id} className="px-4 py-3.5 row-hover">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
                      <div className="flex items-center gap-3 mono text-[10px] uppercase tracking-[0.08em] text-fg-2">
                        <span className="text-green">
                          {t.demo_clip_page} {r.page}
                        </span>
                        <span className="text-fg-3">·</span>
                        <span>
                          {t.demo_clip_section}:{" "}
                          <span className="text-fg-1 normal-case tracking-normal">
                            {r.section}
                          </span>
                        </span>
                      </div>
                      {r.pdfUrl ? (
                        <a
                          href={r.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mono text-[10px] uppercase tracking-[0.08em] text-fg-2 hover:text-green transition-colors"
                        >
                          {t.demo_open_pdf} ↗
                        </a>
                      ) : (
                        <span className="mono text-[10px] uppercase tracking-[0.08em] text-fg-3 cursor-not-allowed">
                          {t.demo_open_pdf} ↗
                        </span>
                      )}
                    </div>
                    <p
                      className="font-sans text-[14px] text-fg-0 leading-[1.55]"
                      dangerouslySetInnerHTML={{
                        __html: highlightName(r.text, resultado.nome),
                      }}
                    />
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 h-10 border-t border-line mono text-[11px]">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="flex items-center gap-1.5 px-2 h-7 rounded-[3px] uppercase tracking-[0.08em] text-fg-1 hover:text-green hover:bg-bg-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-fg-1"
                  >
                    <span aria-hidden>←</span>
                    <span>{t.pag_prev}</span>
                  </button>
                  <span className="text-fg-2 tnum">
                    {t.pag_page}{" "}
                    <span className="text-fg-0">{safePage}</span> {t.pag_of}{" "}
                    <span className="text-fg-0">{totalPages}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className="flex items-center gap-1.5 px-2 h-7 rounded-[3px] uppercase tracking-[0.08em] text-fg-1 hover:text-green hover:bg-bg-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-fg-1"
                  >
                    <span>{t.pag_next}</span>
                    <span aria-hidden>→</span>
                  </button>
                </div>
              )}
            </div>
          );
        })()
      )}
    </>
  );
}
