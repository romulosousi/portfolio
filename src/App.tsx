import { Contato } from "@/components/Contato";
import { Demo } from "@/components/Demo";
import { Experiencia } from "@/components/Experiencia";
import { Footer } from "@/components/Footer";
import { Formacao } from "@/components/Formacao";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Skills } from "@/components/Skills";
import { Ticker } from "@/components/Ticker";
import { I18nProvider } from "@/i18n";

export default function App() {
  return (
    <I18nProvider>
      <div className="bg-bg-0 text-fg-0 min-h-screen">
        <Header />
        <Ticker />
        <Hero />
        <Demo />
        <Experiencia />
        <Formacao />
        <Skills />
        <Contato />
        <Footer />
      </div>
    </I18nProvider>
  );
}
