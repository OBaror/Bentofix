import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const plans = [
  {
    name: "Gratuit",
    price: "0€",
    period: "/mois",
    description: "Idéal pour démarrer avec un bien.",
    features: [
      "1 bien immobilier",
      "5 tickets / mois",
      "Stockage limité (100 Mo)",
      "Notifications email",
    ],
    cta: "Commencer",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "29€",
    period: "/mois",
    description: "Pour les gestionnaires professionnels.",
    features: [
      "Biens illimités",
      "Tickets illimités",
      "Dashboard analytique",
      "Rapports PDF automatisés",
      "Paiements Stripe intégrés",
      "Support prioritaire 24/7",
    ],
    cta: "Essai gratuit 14 jours",
    highlighted: true,
  },
];

export function PricingSection() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
            Tarification simple
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Pas de frais cachés. Évoluez quand vous êtes prêt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative border-border bg-card transition-all duration-300 hover-lift ${
                plan.highlighted ? "border-primary/50 shadow-lg shadow-primary/5" : ""
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    Populaire
                  </span>
                </div>
              )}
              <CardHeader className="pb-2 pt-8">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full rounded-xl h-11 font-medium ${
                    plan.highlighted
                      ? "hover-lift"
                      : "bg-accent text-foreground hover:bg-accent/80"
                  }`}
                  variant={plan.highlighted ? "default" : "secondary"}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
