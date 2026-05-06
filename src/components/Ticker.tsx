import { useT } from "@/hooks/useT";

export function Ticker() {
  const { t } = useT();
  const items = [
    { k: "LANG", v: "PYTHON · DJANGO · FASTAPI · GIT · GITHUB", cls: "text-fg-0" },
    { k: t.t_status, v: t.t_status_v, cls: "text-green" },
    { k: "AUTO", v: "SELENIUM · PYAUTOGUI · REQUESTS · IMAP", cls: "text-fg-0" },
    { k: "DATA", v: "PANDAS · OPENPYXL · REGEX · APIs REST", cls: "text-fg-0" },
    {
      k: "INFRA",
      v: "DOCKER · COMPOSE · K8S · LINUX · ACTIONS · NGINX · REDIS",
      cls: "text-fg-0",
    },
    { k: t.t_focus, v: t.t_focus_v, cls: "text-green" },
    { k: "DOM", v: "RPA · WEBSCRAPING", cls: "text-fg-0" },
  ];
  // Duplica a lista pra animação fluida (translate de 0 → -50% volta pro
  // mesmo ponto visual, desde que as duas metades sejam idênticas).
  // O segundo bloco é aria-hidden pra não ser lido por screen readers.
  return (
    <div className="border-y border-line bg-bg-1 overflow-hidden">
      <div className="ticker-track flex py-1.5 whitespace-nowrap mono text-[11px] tnum">
        <div className="flex shrink-0">
          {items.map((it, i) => (
            <span key={`a-${i}`} className="flex items-center gap-1.5 px-2">
              <span className="text-fg-2">{it.k}</span>
              <span className={it.cls}>{it.v}</span>
              <span className="text-line-2">│</span>
            </span>
          ))}
        </div>
        <div className="flex shrink-0" aria-hidden="true">
          {items.map((it, i) => (
            <span key={`b-${i}`} className="flex items-center gap-1.5 px-2">
              <span className="text-fg-2">{it.k}</span>
              <span className={it.cls}>{it.v}</span>
              <span className="text-line-2">│</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
