import { useContext } from "react";
import { I18nContext } from "@/i18n/I18nContext";

export const useT = () => useContext(I18nContext);
