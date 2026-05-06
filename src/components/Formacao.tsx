import { CERTIFICACOES, FORMACAO } from "@/data/formacao";
import { useT } from "@/hooks/useT";
import { SectionHead } from "./SectionHead";

export function Formacao() {
  const { t, lang } = useT();
  return (
    <section id="formacao" className="border-b border-line">
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <SectionHead
          idx="04"
          tag={t.edu_tag}
          title={
            <>
              {t.edu_title_a}{" "}
              <span className="serif text-green font-normal">
                {t.edu_title_b}
              </span>
            </>
          }
        />

        <div className="grid lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 hairline rounded-[4px] bg-bg-1">
            <div className="flex items-center justify-between px-5 h-9 border-b border-line">
              <span className="mono text-[10px] uppercase tracking-[0.12em] text-fg-2">
                {t.edu_panel}
              </span>
              <span className="mono text-[10px] text-green">
                ● {t.edu_done}
              </span>
            </div>
            <div className="p-5">
              <div className="flex items-baseline justify-between flex-wrap gap-2 mb-1">
                <div className="font-sans text-[22px] tracking-[-0.01em] text-fg-0">
                  {FORMACAO.curso[lang]}
                </div>
                <div className="mono text-[11px] text-fg-2">
                  {FORMACAO.periodo}
                </div>
              </div>
              <div className="mono text-[12px] text-green mb-5">
                {FORMACAO.instituicao[lang]}
              </div>

              <div className="hairline rounded-[4px] p-4 bg-bg-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="mono text-[10px] uppercase tracking-[0.12em] text-fg-2">
                    {t.edu_tcc_panel}
                  </div>
                  <div className="mono text-[12px] text-green tnum">
                    {t.edu_grade} {FORMACAO.tcc.nota[lang]}
                  </div>
                </div>
                <div className="font-sans text-[16px] text-fg-0 leading-[1.4] mb-3 serif italic">
                  "{FORMACAO.tcc.titulo[lang]}"
                </div>
                <p className="font-sans text-[13px] text-fg-1 leading-[1.6]">
                  {FORMACAO.tcc.desc[lang]}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 hairline rounded-[4px] bg-bg-1">
            <div className="flex items-center justify-between px-5 h-9 border-b border-line">
              <span className="mono text-[10px] uppercase tracking-[0.12em] text-fg-2">
                {t.edu_certs_panel}
              </span>
              <span className="mono text-[10px] text-fg-2 tnum">
                {CERTIFICACOES.length} {t.edu_files}
              </span>
            </div>
            <div className="divide-y divide-line">
              {CERTIFICACOES.map((c, i) => {
                const inner = (
                  <div className="flex items-start gap-3">
                    <span className="mono text-[10px] uppercase tracking-[0.06em] px-1.5 py-0.5 rounded-[2px] bg-bg-3 border border-line text-green mt-0.5">
                      {c.tipo}
                    </span>
                    <div className="flex-1">
                      <div className="font-sans text-[14px] text-fg-0 leading-[1.4] group-hover:text-green transition-colors">
                        {c.nome[lang]}
                      </div>
                      <div className="mono text-[11px] text-fg-2 mt-1">
                        {c.emissor[lang]}
                      </div>
                    </div>
                    {c.url && (
                      <span className="mono text-[10px] text-fg-3 group-hover:text-green transition-colors mt-0.5">
                        ↗
                      </span>
                    )}
                  </div>
                );
                return c.url ? (
                  <a
                    key={i}
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-5 py-4 row-hover group"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={i} className="px-5 py-4 row-hover group">
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
