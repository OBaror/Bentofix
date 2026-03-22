import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import bentoFixIcon from "@/assets/bentofix-icon.png";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-32 lg:py-40">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <img src={bentoFixIcon} alt="BentoFix" className="h-20 w-20 animate-fade-in" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-border bg-card text-xs text-muted-foreground font-medium animate-fade-in">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Nouveau : Intégration paiements Stripe
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Maintenance immobilière
          <br />
          <span className="text-primary">centralisée.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Réduisez vos délais de traitement de <span className="text-foreground font-medium">40%</span>. 
          Suivez chaque intervention, centralisez les preuves et automatisez vos paiements en un seul outil.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="rounded-xl px-8 h-12 text-base font-medium hover-lift group"
          >
            Commencer gratuitement
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button variant="outline" size="lg" className="rounded-xl px-8 h-12 text-base font-medium border-border hover:bg-accent">
            Voir la démo
          </Button>
        </div>
      </div>
    </section>
  );
}
