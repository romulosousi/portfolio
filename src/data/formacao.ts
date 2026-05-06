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
      pt: "Django Web Framework e Django Rest Framework (DRF)",
      en: "Django Web Framework and Django Rest Framework (DRF)",
    },
    emissor: { pt: "Udemy", en: "Udemy" },
    tipo: "CERT",
    url: "https://udemy-certificate.s3.amazonaws.com/pdf/UC-beb20879-e5f9-439f-913d-ec5ba0ff2946.pdf",
  },
  {
    nome: {
      pt: "Java 2022 COMPLETO: Do Zero ao Profissional + Projetos!",
      en: "Java 2022 COMPLETE: From Zero to Professional + Projects!",
    },
    emissor: { pt: "Udemy", en: "Udemy" },
    tipo: "CERT",
    url: "https://udemy-certificate.s3.amazonaws.com/pdf/UC-4b8b5d20-6ae0-4f3b-b817-fa300a9d2fdf.pdf",
  },
  {
    nome: {
      pt: "Git e GitHub do básico ao avançado (c/ gist e GitHub Pages)",
      en: "Git and GitHub from basic to advanced (with gist and GitHub Pages)",
    },
    emissor: { pt: "Udemy", en: "Udemy" },
    tipo: "CERT",
    url: "https://udemy-certificate.s3.amazonaws.com/pdf/UC-f378aed7-102e-4e20-9777-a9f6e661575f.pdf",
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
