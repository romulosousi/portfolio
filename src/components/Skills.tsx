import { buildSkills } from "@/data/skills";
import { useT } from "@/hooks/useT";
import { SectionHead } from "./SectionHead";

export function Skills() {
  const { t } = useT();
  const groups = buildSkills(t);
  return (
    <section id="skills" className="border-b border-line">
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <SectionHead
          idx="05"
          tag={t.sk_tag}
          title={
            <>
              {t.sk_title_a}{" "}
              <span className="serif text-green font-normal">
                {t.sk_title_b}
              </span>
            </>
          }
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-line hairline rounded-[4px] overflow-hidden">
          {groups.map((g, i) => {
            // Última célula expande pra preencher o resto da linha — evita
            // os "buracos" cinza quando o nº de grupos não é múltiplo
            // exato do nº de colunas.
            const isLast = i === groups.length - 1;
            const lgRem = groups.length % 3;
            const mdRem = groups.length % 2;
            const cls = [
              "bg-bg-1 p-5",
              isLast && mdRem === 1 ? "md:col-span-2" : "",
              isLast && lgRem === 1 ? "lg:col-span-3" : "",
              isLast && lgRem === 2 ? "lg:col-span-2" : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div key={g.titulo} className={cls}>
                <div className="flex items-center justify-between mb-3">
                  <span className="mono text-[10px] uppercase tracking-[0.12em] text-fg-2">
                    {g.titulo}
                  </span>
                  <span className="mono text-[10px] text-fg-3">
                    {g.items.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {g.items.map((it) => (
                    <span
                      key={it}
                      className="mono text-[11px] text-fg-1 border border-line bg-bg-0 px-2 py-1 rounded-[2px] hover:border-green-dim hover:text-green transition-colors cursor-default whitespace-nowrap"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
