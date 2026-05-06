import { ME } from "@/data/pessoal";
import { fmtDate, fmtTime, useClock } from "@/hooks/useClock";
import { useT } from "@/hooks/useT";
import type { Lang } from "@/types";

function LangSwitch() {
  const { lang, setLang } = useT();
  const btn = (target: Lang, label: string, extra: string) => (
    <button
      onClick={() => setLang(target)}
      className={`h-6 px-2 transition-colors ${extra} ${
        lang === target
          ? "bg-green text-black"
          : "text-fg-2 hover:text-fg-0 hover:bg-bg-2"
      }`}
      aria-label={target === "pt" ? "Português" : "English"}
    >
      {label}
    </button>
  );
  return (
    <div className="flex items-center border border-line rounded-[3px] overflow-hidden mono text-[10px] uppercase tracking-[0.08em]">
      {btn("pt", "PT", "")}
      {btn("en", "EN", "border-l border-line")}
    </div>
  );
}

export function Header() {
  const now = useClock();
  const { t } = useT();
  const navItems: ReadonlyArray<readonly [string, string, string]> = [
    ["F1", t.nav_demo, "#demo"],
    ["F2", t.nav_exp, "#experiencia"],
    ["F3", t.nav_edu, "#formacao"],
    ["F4", t.nav_skills, "#skills"],
    ["F5", t.nav_contact, "#contato"],
  ];
  return (
    <header className="sticky top-0 z-30 bg-bg-0/90 backdrop-blur border-b border-line">
      <div className="max-w-[1280px] mx-auto px-6 h-11 flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-[3px] bg-green text-black flex items-center justify-center text-[11px] font-bold mono">
            RS
          </div>
          <span className="mono text-[12px] tracking-[0.02em] text-fg-0">
            {ME.ticker}&lt;GO&gt;
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-0 ml-auto mono text-[11px] uppercase tracking-[0.08em]">
          {navItems.map(([k, l, h]) => (
            <a
              key={k}
              href={h}
              className="group flex items-center gap-1.5 px-3 h-11 border-l border-line text-fg-1 hover:text-green hover:bg-bg-1 transition-colors"
            >
              <span className="text-fg-3 group-hover:text-green-dim">{k}</span>
              <span>{l}</span>
            </a>
          ))}
        </nav>
        <div className="ml-auto md:ml-0 flex items-center gap-3 mono text-[11px] text-fg-2 tnum">
          <LangSwitch />
          <span className="hidden sm:inline">{fmtDate(now)}</span>
          <span className="text-fg-0">{fmtTime(now)}</span>
          <span className="hidden sm:inline">BRT</span>
        </div>
      </div>
    </header>
  );
}
