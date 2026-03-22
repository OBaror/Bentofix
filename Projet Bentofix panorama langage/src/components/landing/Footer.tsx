import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <Separator className="mb-10" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">B</span>
            </div>
            <span className="text-foreground font-semibold tracking-tight">BentoFix</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-foreground transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-foreground transition-colors">CGU</a>
          </div>

          <p className="text-xs text-muted-foreground">
            BentoFix Architectural Ledger © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
