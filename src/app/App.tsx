import { useEffect, useState } from "react";
import { Nav, type Page } from "./components/Nav";
import { Footer } from "./components/Footer";
import { QuickReach } from "./components/QuickReach";
import { Home } from "./components/pages/Home";
import { About } from "./components/pages/About";
import { Services } from "./components/pages/Services";
import { ContractVehicles } from "./components/pages/ContractVehicles";
import { Contact } from "./components/pages/Contact";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (p: Page, opts?: { category?: string }) => {
    setCategory(opts?.category);
    setPage(p);
  };

  useEffect(() => {
    if (!category) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, category]);

  return (
    <div className="min-h-screen bg-paper text-ink font-sans">
      <Nav page={page} setPage={navigate} open={menuOpen} setOpen={setMenuOpen} />
      <main key={page}>
        {page === "home" && <Home setPage={navigate} />}
        {page === "about" && <About setPage={navigate} />}
        {page === "services" && <Services activeCategory={category} setPage={navigate} />}
        {page === "contract" && <ContractVehicles />}
        {page === "contact" && <Contact />}
      </main>
      <QuickReach setPage={navigate} />
      <Footer setPage={navigate} />
    </div>
  );
}
