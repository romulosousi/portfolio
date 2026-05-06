import { useT } from "@/hooks/useT";

export function Footer() {
  const { t } = useT();
  return (
    <div className="border-t border-line">
      <div className="max-w-[1280px] mx-auto px-6 h-11 flex items-center justify-between mono text-[10px] uppercase tracking-[0.1em] text-fg-3 gap-4">
        <span>© 2026 RÔMULO SOUZA</span>
        <span className="hidden sm:inline">{t.footer_built}</span>
        <span className="text-green">● ONLINE</span>
      </div>
    </div>
  );
}
