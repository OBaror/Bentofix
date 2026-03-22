import { ArrowLeft, LogIn, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import bentoFixIcon from "@/assets/bentofix-icon.svg";

export function PublicHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isAuth = location.pathname === "/auth";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        <button onClick={() => navigate("/")} className="flex items-center gap-2.5">
          <img src={bentoFixIcon} alt="BentoFix" className="h-8 w-8 rounded-lg" />
          <span className="text-foreground font-semibold text-lg tracking-tight">BentoFix</span>
        </button>

        <div className="flex items-center gap-2">
          {isAuth && (
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2 text-muted-foreground hover:text-foreground rounded-xl">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Accueil</span>
            </Button>
          )}
          {isHome && (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="gap-2 text-muted-foreground hover:text-foreground rounded-xl">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Connexion</span>
              </Button>
              <Button size="sm" onClick={() => navigate("/auth")} className="gap-2 rounded-xl">
                Commencer
                <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          )}
          <ThemeToggle collapsed />
        </div>
      </div>
    </header>
  );
}
