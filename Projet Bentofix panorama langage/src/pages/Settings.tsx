import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Crown, User, Mail, Shield, Sparkles, ExternalLink, Loader2 } from "lucide-react";
import bentoFixIcon from "@/assets/bentofix-icon.png";

export default function Settings() {
  const { user, profile } = useAuth();
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [managingPortal, setManagingPortal] = useState(false);

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      setSubscribed(data.subscribed);
      setSubscriptionEnd(data.subscription_end);
    } catch {
      // Silent fail - user just isn't subscribed
    } finally {
      setCheckingSubscription(false);
    }
  };

  useEffect(() => {
    checkSubscription();
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      toast.success("Bienvenue dans le Plan Pro ! 🎉");
      checkSubscription();
    }
  }, []);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la redirection vers le paiement");
    } finally {
      setUpgrading(false);
    }
  };

  const handleManageSubscription = async () => {
    setManagingPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'ouverture du portail");
    } finally {
      setManagingPortal(false);
    }
  };

  const roleLabel = profile?.role === "proprietaire" ? "Propriétaire" : "Locataire";

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground text-sm mt-1">Gérez votre profil et votre abonnement</p>
      </div>

      {/* Profile Card */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <User className="h-5 w-5 text-primary" /> Profil
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/30 border border-border">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/30 border border-border">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{profile?.full_name || "—"}</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/30 border border-border">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{roleLabel}</span>
            <Badge variant="secondary" className="ml-auto rounded-lg text-xs">
              {roleLabel}
            </Badge>
          </div>
        </div>
      </div>

      {/* Subscription Card */}
      <div className={`border rounded-xl p-6 space-y-4 ${subscribed ? "bg-primary/5 border-primary/30" : "bg-card border-border"}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Crown className={`h-5 w-5 ${subscribed ? "text-primary" : "text-muted-foreground"}`} />
            Abonnement
          </h2>
          <Badge className={`rounded-lg text-xs border ${subscribed ? "bg-primary/20 text-primary border-primary/30" : "bg-muted text-muted-foreground border-border"}`}>
            {checkingSubscription ? "..." : subscribed ? "Plan Pro" : "Plan Gratuit"}
          </Badge>
        </div>

        {checkingSubscription ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Vérification de l'abonnement...
          </div>
        ) : subscribed ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <Sparkles className="h-4 w-4" />
              Vous bénéficiez du Plan Pro
            </div>
            {subscriptionEnd && (
              <p className="text-xs text-muted-foreground">
                Renouvellement le {new Date(subscriptionEnd).toLocaleDateString("fr-FR")}
              </p>
            )}
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="p-2 rounded-lg bg-accent/30 border border-border">✅ Biens illimités</div>
              <div className="p-2 rounded-lg bg-accent/30 border border-border">✅ Dashboard analytique</div>
              <div className="p-2 rounded-lg bg-accent/30 border border-border">✅ Rapports PDF</div>
              <div className="p-2 rounded-lg bg-accent/30 border border-border">✅ Support 24/7</div>
            </div>
            <Button
              variant="outline"
              onClick={handleManageSubscription}
              disabled={managingPortal}
              className="w-full rounded-xl"
            >
              {managingPortal ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ExternalLink className="h-4 w-4 mr-2" />}
              Gérer l'abonnement
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Passez au Plan Pro pour débloquer toutes les fonctionnalités.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="p-2 rounded-lg bg-accent/30 border border-border">1 bien maximum</div>
              <div className="p-2 rounded-lg bg-accent/30 border border-border">Stockage limité</div>
            </div>
            <Button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="w-full rounded-xl h-12 text-base font-medium"
            >
              {upgrading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Crown className="h-5 w-5 mr-2" />}
              Passer au Plan Pro — 29€/mois
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
