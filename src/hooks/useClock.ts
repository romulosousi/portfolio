import { useEffect, useState } from "react";

export function useClock() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export const fmtTime = (d: Date) =>
  d.toLocaleTimeString("pt-BR", { hour12: false });

export const fmtDate = (d: Date) =>
  d
    .toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
