import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { ME } from "../src/data/pessoal";
import { EXPERIENCIA } from "../src/data/experiencia";
import { FORMACAO, CERTIFICACOES } from "../src/data/formacao";
import { pt } from "../src/i18n/pt";

const CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const SKILL_GROUPS: { titulo: string; items: string[] }[] = [
  { titulo: pt.sk_g1, items: ["Python", "Java", "Django", "FastAPI", "Git", "GitHub"] },
  { titulo: pt.sk_g2, items: ["Selenium", "PyAutoGUI", "Requests", "IMAP"] },
  { titulo: pt.sk_g3, items: ["Pandas", "OpenPyXL", "Regex", "APIs REST"] },
  {
    titulo: pt.sk_g7,
    items: ["Docker", "Docker Compose", "Kubernetes", "Linux", "GitHub Actions", "Nginx", "Redis"],
  },
  { titulo: pt.sk_g5, items: pt.sk_domain_items },
];

const updatedAt = (() => {
  const d = new Date();
  const meses = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
  ];
  return `${meses[d.getMonth()]} de ${d.getFullYear()}`;
})();

const githubHandle = ME.github.handle.replace(/^https?:\/\//, "");
const linkedinHandle = ME.linkedin.handle.replace(/^https?:\/\//, "");
const siteHost = "romulo-rpa.vercel.app";

const expHtml = EXPERIENCIA.map((e) => `
  <article class="job">
    <header class="job-head">
      <h3>${escape(e.cargo.pt)}</h3>
      <span class="period">${escape(e.periodo.pt)}</span>
    </header>
    <div class="company">${escape(e.empresa.pt)} · ${escape(e.local.pt)}</div>
    <p class="job-desc">${escape(e.descricao.pt)}</p>
    <ul>${e.bullets.pt.map((b) => `<li>${escape(b)}</li>`).join("")}</ul>
    <div class="stack">STACK: ${e.stack.map((s) => escape(s.toUpperCase())).join(" · ")}</div>
  </article>
`).join("\n");

const certHtml = CERTIFICACOES.map((c) => `
  <div class="cert">
    <span class="cert-name">${escape(c.nome.pt)}</span>
    <span class="cert-issuer">${escape(c.emissor.pt)}</span>
  </div>
`).join("\n");

const skillsHtml = SKILL_GROUPS.map((g) => `
  <div class="skill-row">
    <span class="skill-label">${escape(g.titulo.toUpperCase())}</span>
    <span class="skill-items">${g.items.map((i) => escape(i)).join(" · ")}</span>
  </div>
`).join("\n");

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>Currículo — ${escape(ME.nome)}</title>
<style>
  :root {
    --green: #10b981;
    --green-bg: #ecfdf5;
    --ink: #0a0a0a;
    --muted: #525252;
    --hairline: #d4d4d4;
  }
  * { box-sizing: border-box; }
  @page { size: A4; margin: 13mm 16mm; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    color: var(--ink);
    font-size: 9.8pt;
    line-height: 1.45;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .mono { font-family: ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace; }
  header.top { margin-bottom: 10pt; }
  h1 {
    font-size: 26pt;
    font-weight: 800;
    margin: 0 0 2pt 0;
    letter-spacing: -0.02em;
    line-height: 1.05;
  }
  .role {
    font-family: ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace;
    font-size: 9.5pt;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--ink);
    margin-bottom: 8pt;
  }
  .role .accent { color: var(--green); }
  .contact {
    font-family: ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace;
    font-size: 8.5pt;
    color: var(--muted);
    line-height: 1.7;
    border-bottom: 1.5pt solid var(--ink);
    padding-bottom: 10pt;
  }
  .contact .sep { color: var(--hairline); padding: 0 4pt; }
  section { margin-top: 9pt; }
  h2 {
    font-family: ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace;
    font-size: 8.5pt;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--green);
    margin: 0 0 4pt 0;
    padding-bottom: 3pt;
    border-bottom: 0.5pt solid var(--hairline);
    font-weight: 700;
  }
  .resumo p { margin: 0; }
  article.job { margin-bottom: 7pt; page-break-inside: avoid; }
  .job-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12pt;
  }
  .job-head h3 {
    font-size: 11pt;
    font-weight: 700;
    margin: 0;
  }
  .job-head .period {
    font-family: ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace;
    font-size: 8.5pt;
    color: var(--muted);
    white-space: nowrap;
  }
  .company {
    color: var(--green);
    font-size: 9.5pt;
    margin: 1pt 0 4pt 0;
  }
  .job-desc { margin: 2pt 0 4pt 0; color: var(--ink); }
  article.job ul {
    margin: 2pt 0 4pt 0;
    padding-left: 14pt;
  }
  article.job li { margin: 0; padding: 0; }
  .stack {
    font-family: ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace;
    font-size: 8pt;
    color: var(--muted);
    letter-spacing: 0.04em;
    margin-top: 3pt;
  }
  .formacao-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .formacao-head h3 { font-size: 11pt; font-weight: 700; margin: 0; }
  .formacao-head .period {
    font-family: ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace;
    font-size: 8.5pt;
    color: var(--muted);
  }
  .instituicao { color: var(--green); font-size: 9.5pt; margin: 1pt 0 6pt 0; }
  .tcc {
    background: var(--green-bg);
    border-left: 2pt solid var(--green);
    padding: 7pt 10pt;
    margin-top: 4pt;
  }
  .tcc-label {
    font-family: ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace;
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted);
    margin-bottom: 3pt;
  }
  .tcc-label strong { color: var(--ink); }
  .tcc-titulo { font-weight: 700; margin-bottom: 2pt; }
  .cert {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border-bottom: 0.5pt solid var(--hairline);
    padding: 3pt 0;
  }
  .cert-issuer {
    font-family: ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace;
    font-size: 8.5pt;
    color: var(--muted);
  }
  .skill-row {
    display: grid;
    grid-template-columns: 170pt 1fr;
    align-items: baseline;
    border-bottom: 0.5pt solid var(--hairline);
    padding: 3.5pt 0;
  }
  .skill-label {
    font-family: ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace;
    font-size: 8.5pt;
    color: var(--muted);
    letter-spacing: 0.06em;
  }
  footer.foot {
    margin-top: 9pt;
    padding-top: 6pt;
    border-top: 0.5pt solid var(--hairline);
    text-align: center;
    font-family: ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace;
    font-size: 7.5pt;
    color: var(--muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
</style>
</head>
<body>
  <header class="top">
    <h1>${escape(ME.nome)}</h1>
    <div class="role">${escape(pt.role_short.toUpperCase())} · <span class="accent">PYTHON</span></div>
    <div class="contact">
      ${escape(ME.email)}<span class="sep">·</span>
      ${escape(ME.telefone)}<span class="sep">·</span>
      ${escape(ME.cidade.pt)}<span class="sep">·</span>
      ${escape(githubHandle)}<span class="sep">·</span>
      ${escape(linkedinHandle)}
    </div>
  </header>

  <section class="resumo">
    <h2>Resumo</h2>
    <p>${escape(pt.resumo)} ${escape(pt.hero_extra)}</p>
  </section>

  <section>
    <h2>Experiência Profissional</h2>
    ${expHtml}
  </section>

  <section>
    <h2>Formação Acadêmica</h2>
    <div class="formacao-head">
      <h3>${escape(FORMACAO.curso.pt)}</h3>
      <span class="period">${escape(FORMACAO.periodo)}</span>
    </div>
    <div class="instituicao">${escape(FORMACAO.instituicao.pt)}</div>
    <div class="tcc">
      <div class="tcc-label">Trabalho de Conclusão · Nota <strong>${escape(FORMACAO.tcc.nota.pt)}</strong></div>
      <div class="tcc-titulo">"${escape(FORMACAO.tcc.titulo.pt)}"</div>
      <div>${escape(FORMACAO.tcc.desc.pt)}</div>
    </div>
  </section>

  <section>
    <h2>Certificações</h2>
    ${certHtml}
  </section>

  <section>
    <h2>Habilidades Técnicas</h2>
    ${skillsHtml}
  </section>

  <footer class="foot">
    ${siteHost} · Atualizado em ${updatedAt}
  </footer>
</body>
</html>`;

const tmp = mkdtempSync(join(tmpdir(), "cv-"));
const htmlPath = join(tmp, "cv.html");
const outPath = resolve("public/curriculo.pdf");

writeFileSync(htmlPath, html, "utf8");

console.log("Rendering PDF via Chrome headless...");
execFileSync(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    `--print-to-pdf=${outPath}`,
    `file://${htmlPath}`,
  ],
  { stdio: "inherit" },
);

rmSync(tmp, { recursive: true, force: true });
console.log(`✓ ${outPath}`);
