import type { Experiencia } from "@/types";

export const EXPERIENCIA: Experiencia[] = [
  {
    empresa: { pt: "Freelancer / Autônomo", en: "Freelance / Self-employed" },
    cargo: { pt: "RPA Developer", en: "RPA Developer" },
    periodo: { pt: "01/2026 — atual", en: "01/2026 — current" },
    local: { pt: "Sergipe — BR", en: "Sergipe — Brazil" },
    status: "current",
    descricao: {
      pt: "Projetos variados — tribunais, Holmes, portais estaduais e municipais.",
      en: "Diverse projects — courts, Holmes, state and municipal portals.",
    },
    bullets: {
      pt: [
        "Automações em portais de tribunais para captura de dados processuais",
        "Integrações com Holmes — orquestração de processos e workflows",
        "Coleta automatizada em portais estaduais e municipais",
      ],
      en: [
        "Court portal automations to capture case data",
        "Holmes integrations — process orchestration and workflows",
        "Automated data collection from state and municipal portals",
      ],
    },
    stack: ["Python", "Selenium", "Requests", "PyAutoGUI"],
  },
  {
    empresa: { pt: "Escritório contábil", en: "Accounting firm" },
    cargo: { pt: "RPA Developer", en: "RPA Developer" },
    periodo: { pt: "12/2025 — atual", en: "12/2025 — current" },
    local: { pt: "Sergipe — BR", en: "Sergipe — Brazil" },
    status: "current",
    descricao: {
      pt: "Automações fiscais e tributárias para escritórios contábeis.",
      en: "Tax and fiscal automations for accounting firms.",
    },
    bullets: {
      pt: [
        "Consulta automatizada de débitos na PGFN (Procuradoria-Geral da Fazenda Nacional)",
        "Emissão de Certidões Negativas de Débitos (CND) estaduais e municipais",
        "Consulta de CND FGTS (Caixa Econômica Federal) com extração via regex",
        "Integração com e-CAC (Receita Federal) usando certificados digitais A1",
        "Extração de dados de PDFs e HTML com regex patterns",
      ],
      en: [
        "Automated debt queries on PGFN (Brazilian Federal Treasury)",
        "Issuance of state and municipal Negative Debt Certificates (CND)",
        "FGTS CND queries (Federal Savings Bank) with regex extraction",
        "Integration with e-CAC (Federal Revenue) using A1 digital certificates",
        "PDF and HTML data extraction with regex patterns",
      ],
    },
    stack: ["Python", "Requests", "Selenium", "Certificate A1", "Regex"],
  },
  {
    empresa: { pt: "TI corporativa", en: "Corporate IT" },
    cargo: { pt: "RPA Developer", en: "RPA Developer" },
    periodo: { pt: "12/2024 — 12/2025", en: "12/2024 — 12/2025" },
    local: { pt: "Sergipe — BR", en: "Sergipe — Brazil" },
    status: "past",
    descricao: {
      pt: "Automação de fluxos internos de TI e segurança, integrando ferramentas corporativas.",
      en: "Automation of internal IT and security flows, integrating corporate tooling.",
    },
    bullets: {
      pt: [
        "Soluções em Python com Requests, Selenium e IMAP para extração de OTPs e códigos de autenticação por e-mail",
        "Integrações com Active Directory e Microsoft Dynamics",
        "Conexão com Assyst, Zabbix e Deskmanager para fluxos internos",
        "Manutenção e evolução de automações existentes — segurança e escalabilidade",
      ],
      en: [
        "Python solutions with Requests, Selenium and IMAP to extract OTPs and auth codes from email",
        "Integrations with Active Directory and Microsoft Dynamics",
        "Connections to Assyst, Zabbix and Deskmanager for internal flows",
        "Maintenance and evolution of existing automations — security and scalability",
      ],
    },
    stack: ["Python", "IMAP", "Selenium", "Active Directory", "MS Dynamics"],
  },
  {
    empresa: { pt: "Consultoria em automação", en: "Automation consultancy" },
    cargo: { pt: "RPA Developer", en: "RPA Developer" },
    periodo: { pt: "12/2024 — 12/2025", en: "12/2024 — 12/2025" },
    local: { pt: "Sergipe — BR", en: "Sergipe — Brazil" },
    status: "past",
    descricao: {
      pt: "Automações jurídicas para captura de dados em portais judiciais.",
      en: "Legal automations for data capture from judicial portals.",
    },
    bullets: {
      pt: [
        "Automações para portais ESAJ-SP, TJSE — captura de dados de processos",
        "Python + Django, Selenium, PyAutoGUI e Requests para web e APIs",
        "Mapeamento de processos, documentação técnica e identificação de oportunidades",
      ],
      en: [
        "Automations for ESAJ-SP and TJSE portals — case data capture",
        "Python + Django, Selenium, PyAutoGUI and Requests for web and APIs",
        "Process mapping, technical documentation and opportunity identification",
      ],
    },
    stack: ["Python", "Django", "Selenium", "PyAutoGUI", "Requests"],
  },
  {
    empresa: { pt: "Escritório de advocacia", en: "Law firm" },
    cargo: { pt: "Analista de Sistemas Jr.", en: "Jr. Systems Analyst" },
    periodo: { pt: "02/2023 — 11/2024", en: "02/2023 — 11/2024" },
    local: { pt: "Sergipe — BR", en: "Sergipe — Brazil" },
    status: "past",
    descricao: {
      pt: "Automações jurídicas integrando plataformas externas.",
      en: "Legal automations integrating external platforms.",
    },
    bullets: {
      pt: [
        "Desenvolvimento de automações jurídicas — eficiência operacional e cumprimento de prazos",
        "Liderança em testes e validações de soluções automatizadas",
        "Otimizações de automações existentes — confiabilidade e escalabilidade",
        "Integração de APIs com Novajus (Thomson Reuters), GCPJ, E-law, Citrix",
      ],
      en: [
        "Development of legal automations — operational efficiency and deadline compliance",
        "Leadership in testing and validation of automated solutions",
        "Optimization of existing automations — reliability and scalability",
        "API integration with Novajus (Thomson Reuters), GCPJ, E-law, Citrix",
      ],
    },
    stack: ["Python", "Novajus", "GCPJ", "E-law", "Citrix"],
  },
];
