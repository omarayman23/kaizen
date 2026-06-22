import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { QuickReach } from "./components/QuickReach";
import { Home } from "./components/pages/Home";
import { About } from "./components/pages/About";
import { Services } from "./components/pages/Services";
import { ContractVehicles } from "./components/pages/ContractVehicles";
import { Contact } from "./components/pages/Contact";
import { useRoute } from "./useRoute";

// This app's scroll container is the <body> (the html/body height:100% +
// overflow setup makes the body itself scroll, not the window), so a plain
// window.scrollTo is a no-op. Reset every candidate to guarantee the top.
function scrollToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export default function App() {
  const { page, category, navigate } = useRoute();
  const [menuOpen, setMenuOpen] = useState(false);

  // On first load / refresh, don't restore the previous scroll position —
  // always begin at the top.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    scrollToTop();
  }, []);

  const renderPage = () => {
    switch (page) {
      case "home":
        return <Home setPage={navigate} />;
      case "about":
        return <About setPage={navigate} />;
      case "services":
        return <Services activeCategory={category} setPage={navigate} />;
      case "contract":
        return <ContractVehicles />;
      case "contact":
        return <Contact />;
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-paper text-ink font-sans">
        <Nav page={page} setPage={navigate} open={menuOpen} setOpen={setMenuOpen} />

        {/* mode="wait": the current page fully fades out, THEN we snap to the
            top (onExitComplete), THEN the next page fades up from there. */}
        <AnimatePresence
          mode="wait"
          onExitComplete={() => {
            // When deep-linking to a capability, Services scrolls to the box
            // itself — don't clobber it by snapping to the top.
            if (page === "services" && category) return;
            scrollToTop();
          }}
        >
          <motion.main
            key={`${page}:${category ?? ""}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {renderPage()}
          </motion.main>
        </AnimatePresence>

        <QuickReach setPage={navigate} />
        <Footer setPage={navigate} />
      </div>
    </MotionConfig>
  );
}
