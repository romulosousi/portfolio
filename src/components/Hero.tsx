import { ME } from "@/data/pessoal";
import { useT } from "@/hooks/useT";

export function Hero() {
  const { t, lang } = useT();
  return (
    <section id="sobre" className="relative border-b border-line">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none"></div>
      <div className="absolute inset-0 scanline pointer-events-none"></div>

      <div className="max-w-[1280px] mx-auto px-6 pt-14 pb-16 relative">
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <span className="w-1.5 h-1.5 rounded-full bg-green pulse-dot"></span>
          <span className="mono text-[11px] uppercase tracking-[0.12em] text-green">
            {t.online}
          </span>
          <span className="mono text-[11px] text-fg-2">
            / {t.role_full.toUpperCase()}
          </span>
          <span className="text-line-2 mono text-[11px]">·</span>
          <span className="mono text-[11px] text-fg-2">
            {ME.cidade[lang].toUpperCase()}
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <div className="mono text-[10px] uppercase tracking-[0.18em] text-fg-2 mb-4">
              <span className="text-green">[id]</span> {ME.ticker} &nbsp;·&nbsp;{" "}
              {t.ticker_role} &nbsp;·&nbsp; {t.ticker_lang}
            </div>
            <h1 className="font-sans tracking-[-0.025em] leading-[1.02] text-[56px] md:text-[80px] lg:text-[96px] font-medium pb-2">
              <span
                className="serif text-fg-0 font-normal"
                style={{ fontStyle: "italic" }}
              >
                Rômulo Souza
              </span>
              <br />
              <span className="text-fg-1">RPA Developer</span>{" "}
              <span className="text-green">· Python</span>
            </h1>
            <p className="font-sans text-[16px] text-fg-1 mt-7 max-w-[58ch] leading-[1.6]">
              {t.resumo} {t.hero_extra}
            </p>
            <div className="flex items-center gap-3 mt-9 flex-wrap">
              <a
                href="#experiencia"
                className="group inline-flex items-center gap-2.5 bg-green text-black px-5 h-10 rounded-[3px] mono text-[12px] uppercase tracking-[0.08em] font-semibold hover:bg-white transition-colors"
              >
                <span className="w-1.5 h-1.5 bg-black"></span>
                {t.cta_primary}
                <span className="text-green-deep group-hover:text-black/60">
                  →
                </span>
              </a>
              <a
                href="#contato"
                className="inline-flex items-center gap-2 px-5 h-10 rounded-[3px] mono text-[12px] uppercase tracking-[0.08em] text-fg-1 border border-line hover:border-fg-2 hover:text-fg-0 transition-colors"
              >
                {t.cta_secondary} <span className="text-fg-3">↗</span>
              </a>
              <a
                href="/curriculo.pdf"
                download="Romulo-Souza-CV.pdf"
                className="inline-flex items-center gap-2 px-5 h-10 rounded-[3px] mono text-[12px] uppercase tracking-[0.08em] text-fg-1 border border-line hover:border-green-dim hover:text-green transition-colors"
              >
                {t.cta_cv} <span className="text-fg-3">↓</span>
              </a>
              <span className="ml-2 mono text-[11px] text-fg-2 hidden md:inline">
                <span className="text-fg-3">$</span> {t.press_keys}{" "}
                <kbd className="px-1.5 py-0.5 bg-bg-2 border border-line rounded text-[10px]">
                  F1..F5
                </kbd>
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 hairline rounded-[4px] bg-bg-1 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="mono text-[10px] uppercase tracking-[0.12em] text-fg-2">
                {t.whoami}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green pulse-dot"></span>
                <span className="mono text-[10px] text-green uppercase">
                  {t.avail}
                </span>
              </div>
            </div>

            <div className="mb-3 hairline rounded-[4px] overflow-hidden bg-bg-2 aspect-square">
              <img
                src="/me.jpg?v=5"
                alt={ME.nome}
                width={1200}
                height={1200}
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1.5 mono text-[11px]">
              <Row label={t.name} value="Rômulo Souza" />
              <Row label={t.role} value={t.role_short} />
              <Row
                label={t.years}
                value={lang === "pt" ? "+ 3 anos em RPA" : "3+ yrs in RPA"}
              />
              <Row label={t.graduation} value={t.course_name} />
              <Row label={t.city} value={ME.cidade[lang]} />
              <Row label={t.en_label} value={t.en_value} />
            </div>

            <div className="mt-4 pt-3 border-t border-line flex items-center gap-2 mono text-[10px] text-fg-2">
              <span className="text-green">→</span>
              <a
                href={`mailto:${ME.email}`}
                className="hover:text-green transition-colors"
              >
                {ME.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-fg-2">{label}</span>
      <span className="text-fg-0">{value}</span>
    </div>
  );
}
