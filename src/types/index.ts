export type Lang = "pt" | "en";

export type LocalizedString = Record<Lang, string>;
export type LocalizedList = Record<Lang, string[]>;

export interface Experiencia {
  empresa: LocalizedString;
  cargo: LocalizedString;
  periodo: LocalizedString;
  local: LocalizedString;
  status: "current" | "past";
  descricao: LocalizedString;
  bullets: LocalizedList;
  stack: string[];
}

export interface Formacao {
  curso: LocalizedString;
  instituicao: LocalizedString;
  periodo: string;
  tcc: {
    titulo: LocalizedString;
    nota: LocalizedString;
    desc: LocalizedString;
  };
}

export interface Certificacao {
  nome: LocalizedString;
  emissor: LocalizedString;
  tipo: string;
  url?: string;
}

export interface SkillGroup {
  titulo: string;
  items: string[];
}

export interface Pessoal {
  nome: string;
  ticker: string;
  cidade: LocalizedString;
  email: string;
  telefone: string;
  github: { handle: string; url: string };
  linkedin: { handle: string; url: string };
}

export interface Recorte {
  id: number;
  page: number;
  section: string;
  text: string;
  pdfUrl?: string;
}

export interface DiarioResultado {
  nome: string;
  dataBR: string;
  edicao: string;
  totalPaginas: number;
  runtime: string;
  recortes: Recorte[];
  modo: "live" | "mock";
  motivo?: "sem_edicao" | "erro_rede" | "erro_servidor" | "timeout";
}
