import type { Certificacao, Formacao } from "@/types";

export const FORMACAO: Formacao = {
  curso: {
    pt: "Bacharelado em Ciências da Computação",
    en: "Bachelor of Computer Science",
  },
  instituicao: {
    pt: "Universidade Tiradentes (UNIT)",
    en: "Tiradentes University (UNIT)",
  },
  periodo: "2021 — 2025.2",
  tcc: {
    titulo: {
      pt: "Impactos Tecnológicos e Legais do Uso de RPAs no Setor Jurídico Brasileiro",
      en: "Technological and Legal Impacts of RPA Use in the Brazilian Legal Sector",
    },
    nota: { pt: "10,0", en: "10.0" },
    desc: {
      pt: "Estudo exploratório e descritivo sobre os efeitos da automação robótica de processos no sistema jurídico nacional — desafios legais, LGPD, responsabilidade civil e benefícios operacionais.",
      en: "Exploratory and descriptive study on the effects of robotic process automation in Brazil's legal system — legal challenges, LGPD compliance, civil liability and operational benefits.",
    },
  },
};

export const CERTIFICACOES: Certificacao[] = [
  {
    nome: {
      pt: "Git e GitHub do básico ao avançado",
      en: "Git and GitHub from basic to advanced",
    },
    emissor: {
      pt: "c/ gist e GitHub Pages",
      en: "with gist and GitHub Pages",
    },
    tipo: "CERT",
  },
  {
    nome: {
      pt: "Cloud Computing Fundamentals — Locales",
      en: "Cloud Computing Fundamentals — Locales",
    },
    emissor: { pt: "Google Cloud", en: "Google Cloud" },
    tipo: "GCP",
  },
  {
    nome: {
      pt: "Infrastructure in Google Cloud — Locales",
      en: "Infrastructure in Google Cloud — Locales",
    },
    emissor: { pt: "Google Cloud", en: "Google Cloud" },
    tipo: "GCP",
  },
];
