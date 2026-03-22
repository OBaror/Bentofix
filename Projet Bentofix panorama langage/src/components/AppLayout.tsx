import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileBottomBar } from "@/components/MobileBottomBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import bentoFixIcon from "@/assets/bentofix-icon.svg";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <div className="hidden md:block">
          <AppSidebar />
        </div>

        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 md:px-6 sticky top-0 z-40 bg-background/80 backdrop-blur-xl">
            <div className="flex items-center">
              <SidebarTrigger className="hidden md:flex text-muted-foreground hover:text-foreground" />
              <button onClick={() => navigate("/dashboard")} className="md:hidden flex items-center gap-2">
                <img src={bentoFixIcon} alt="BentoFix" className="h-7 w-7 rounded-lg" />
                <span className="text-foreground font-semibold tracking-tight">BentoFix</span>
              </button>
            </div>
            <div className="md:hidden">
              <ThemeToggle collapsed />
            </div>
          </header>

          <main className="flex-1 pb-20 md:pb-0">
            {children}
          </main>
        </div>

        <MobileBottomBar />
      </div>
    </SidebarProvider>
  );
}
