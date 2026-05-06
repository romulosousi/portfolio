import type { Lang } from "@/types";

export const MOCK_CADERNOS = [
  "Atos do Prefeito",
  "Secretaria Municipal de Fazenda",
  "Diversos",
  "Editais e Avisos",
];

export const MOCK_TRECHOS: Record<Lang, string[]> = {
  pt: [
    "...nomeia {NOME} para exercer o cargo em comissão de Assessor II, símbolo CC-3, da Secretaria Municipal...",
    "...torna sem efeito a designação de {NOME}, matrícula nº 78.{NN}/4, publicada no D.O. RIO de...",
    "...autoriza o pagamento de diárias a {NOME}, em razão de deslocamento a serviço para a cidade de...",
    "...intima-se {NOME} a comparecer no prazo de 10 (dez) dias úteis para apresentar defesa no processo administrativo nº...",
  ],
  en: [
    "...appoints {NOME} to the commissioned position of Advisor II, symbol CC-3, of the Municipal Secretariat...",
    "...renders void the designation of {NOME}, registration no. 78.{NN}/4, published in D.O. RIO of...",
    "...authorizes per diem payment to {NOME}, due to official travel to the city of...",
    "...{NOME} is summoned to appear within 10 (ten) business days to present a defense in administrative process no...",
  ],
};
