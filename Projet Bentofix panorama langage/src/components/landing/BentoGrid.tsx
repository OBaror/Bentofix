import { Activity, Camera, CreditCard, BarChart3, Shield, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Activity,
    title: "Suivi temps réel",
    description: "Visualisez l'état de chaque intervention en temps réel. Notifications instantanées à chaque mise à jour.",
    className: "md:col-span-2 md:row-span-1",
  },
  {
    icon: Camera,
    title: "Preuve visuelle",
    description: "Photos avant/après stockées via Supabase Storage. Historique complet et vérifiable.",
    className: "md:col-span-1 md:row-span-2",
  },
  {
    icon: CreditCard,
    title: "Paiements Stripe",
    description: "Facturez et encaissez directement. Abonnements et paiements ponctuels intégrés.",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    icon: BarChart3,
    title: "Dashboard analytique",
    description: "KPI en temps réel : délais, coûts, satisfaction.",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    icon: Shield,
    title: "Sécurité renforcée",
    description: "Chiffrement de bout en bout et authentification multi-facteurs.",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    icon: Zap,
    title: "Automatisations",
    description: "Assignation automatique, relances et rapports programmés.",
    className: "md:col-span-1 md:row-span-1",
  },
];

export function BentoGrid() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Une plateforme complète pour gérer la maintenance de vos biens immobiliers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <Card
              key={feature.title}
              className={`${feature.className} group border-border bg-card hover:border-primary/30 transition-all duration-300 hover-lift cursor-default`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <CardContent className="p-6 md:p-8 h-full flex flex-col">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
