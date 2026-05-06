import { EXPERIENCIA } from "@/data/experiencia";
import { useT } from "@/hooks/useT";
import { SectionHead } from "./SectionHead";

export function Experiencia() {
  const { t, lang } = useT();
  return (
    <section id="experiencia" className="border-b border-line">
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <SectionHead
          idx="03"
          tag={t.exp_tag}
          title={
            <>
              {t.exp_title_a}{" "}
              <span className="serif text-green font-normal">
                {t.exp_title_b}
              </span>
            </>
          }
          sub={t.exp_sub}
        />

        <div className="space-y-px bg-line hairline rounded-[4px] overflow-hidden">
          {EXPERIENCIA.map((e, i) => (
            <div key={i} className="bg-bg-1 p-5 md:p-6">
              <div className="grid md:grid-cols-[180px_1fr] gap-4 md:gap-8">
                <div>
                  <div className="mono text-[10px] uppercase tracking-[0.1em] text-fg-2 mb-1">
                    {e.status === "current" && (
                      <span className="text-green">● {t.exp_current} · </span>
                    )}
                    {e.periodo[lang]}
                  </div>
                  <div className="mono text-[10px] uppercase tracking-[0.08em] text-fg-3">
                    {e.local[lang]}
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline justify-between flex-wrap gap-2 mb-1">
                    <div className="font-sans text-[20px] tracking-[-0.01em] text-fg-0">
                      {e.cargo[lang]}
                    </div>
                    <div className="mono text-[12px] text-green">
                      {e.empresa[lang]}
                    </div>
                  </div>
                  <p className="font-sans text-[14px] text-fg-1 leading-[1.55] mb-3">
                    {e.descricao[lang]}
                  </p>
                  <ul className="space-y-1.5 mb-4">
                    {e.bullets[lang].map((b, j) => (
                      <li
                        key={j}
                        className="flex gap-2.5 mono text-[12px] text-fg-1 leading-[1.55]"
                      >
                        <span className="text-green-dim mt-[2px]">→</span>
                        <span className="font-sans">{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {e.stack.map((s) => (
                      <span
                        key={s}
                        className="mono text-[10px] uppercase tracking-[0.06em] text-fg-1 bg-bg-3 border border-line px-1.5 py-0.5 rounded-[2px] whitespace-nowrap"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
