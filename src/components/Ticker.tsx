import { useT } from "@/hooks/useT";

export function Ticker() {
  const { t, lang } = useT();
  const items = [
    { k: t.t_stack, v: "REQUESTS/SELENIUM/PYAUTOGUI", cls: "text-fg-0" },
    { k: t.t_status, v: t.t_status_v, cls: "text-green" },
    { k: t.t_exp, v: t.t_exp_v, cls: "text-fg-0" },
    {
      k: t.t_form,
      v:
        lang === "pt"
          ? "CIÊNCIA DA COMPUTAÇÃO / UNIT 2025.2"
          : "COMPUTER SCIENCE / UNIT 2025.2",
      cls: "text-fg-0",
    },
    { k: t.t_focus, v: t.t_focus_v, cls: "text-green" },
    { k: t.t_domain, v: t.t_domain_v, cls: "text-fg-0" },
    { k: t.t_certs, v: "GIT · GCP×2", cls: "text-fg-0" },
    {
      k: t.t_local,
      v: lang === "pt" ? "ARACAJU — SE" : "ARACAJU — BR",
      cls: "text-fg-0",
    },
  ];
  const row = items.concat(items);
  return (
    <div className="border-y border-line bg-bg-1 overflow-hidden">
      <div className="ticker-track flex gap-0 py-1.5 whitespace-nowrap mono text-[11px] tnum">
        {row.map((it, i) => (
          <span key={i} className="flex items-center gap-1.5 px-2">
            <span className="text-fg-2">{it.k}</span>
            <span className={it.cls}>{it.v}</span>
            <span className="text-line-2">│</span>
          </span>
        ))}
      </div>
    </div>
  );
}
