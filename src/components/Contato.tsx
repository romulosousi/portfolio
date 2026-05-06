import { ME } from "@/data/pessoal";
import { useT } from "@/hooks/useT";

export function Contato() {
  const { t, lang } = useT();
  const items: Array<{
    l: string;
    v: string;
    href: string;
    external?: boolean;
  }> = [
    {
      l: t.contact_phone,
      v: ME.telefone,
      href: `tel:${ME.telefone.replace(/\D/g, "")}`,
    },
    { l: t.contact_email, v: ME.email, href: `mailto:${ME.email}` },
    { l: t.contact_local, v: ME.cidade[lang], href: "#" },
    {
      l: t.contact_github,
      v: ME.github.handle,
      href: ME.github.url,
      external: true,
    },
    {
      l: t.contact_linkedin,
      v: ME.linkedin.handle,
      href: ME.linkedin.url,
      external: true,
    },
  ];
  return (
    <section id="contato">
      <div className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <div className="mono text-[10px] uppercase tracking-[0.18em] text-fg-2 mb-4">
              <span className="text-green">[06]</span> {t.contact_tag}
            </div>
            <h2 className="font-sans tracking-[-0.025em] leading-[0.96] text-[56px] md:text-[80px] font-medium">
              {t.contact_title_a}{" "}
              <span className="serif text-green font-normal">
                {t.contact_title_b}
              </span>
            </h2>
            <p className="font-sans text-[15px] text-fg-1 mt-6 max-w-[55ch] leading-[1.6]">
              {t.contact_sub}
            </p>
            <div className="mt-8">
              <a
                href={`mailto:${ME.email}`}
                className="inline-flex items-center gap-3 mono text-[14px] text-fg-0 border border-line bg-bg-1 px-5 h-12 rounded-[3px] hover:border-green-dim hover:text-green transition-colors group"
              >
                <span className="text-green">→</span>
                {ME.email}
                <span className="text-fg-3 group-hover:text-green">↗</span>
              </a>
            </div>
          </div>
          <div className="lg:col-span-5 space-y-2">
            {items.map((it) => (
              <a
                key={it.l}
                href={it.href}
                {...(it.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="flex items-center justify-between border-b border-line py-2.5 mono text-[12px] uppercase tracking-[0.06em] text-fg-1 hover:text-green transition-colors group"
              >
                <span className="text-fg-2">{it.l}</span>
                <span className="flex items-center gap-2 normal-case tracking-normal">
                  {it.v}
                  <span className="text-fg-3 group-hover:text-green">↗</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
