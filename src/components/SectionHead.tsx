import type { ReactNode } from "react";

interface Props {
  tag: string;
  title: ReactNode;
  sub?: string;
  idx: string;
}

export function SectionHead({ tag, title, sub, idx }: Props) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
      <div>
        <div className="mono text-[10px] uppercase tracking-[0.18em] text-fg-2 mb-2">
          <span className="text-green">[{idx}]</span> {tag}
        </div>
        <h2 className="font-sans text-[34px] tracking-[-0.02em] font-medium leading-[1.05]">
          {title}
        </h2>
        {sub && (
          <p className="font-sans text-[14px] text-fg-1 mt-2 max-w-[60ch] leading-[1.55]">
            {sub}
          </p>
        )}
      </div>
      <div className="mono text-[10px] uppercase tracking-[0.14em] text-fg-3 hidden md:block">
        ─────────────────
      </div>
    </div>
  );
}
