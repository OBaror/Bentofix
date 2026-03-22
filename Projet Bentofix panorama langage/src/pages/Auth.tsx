import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { PublicHeader } from "@/components/PublicHeader";
import bentoFixIcon from "@/assets/bentofix-icon.svg";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"locataire" | "proprietaire">("locataire");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Connexion réussie !");
        navigate("/dashboard");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, role },
            emailRedirectTo: undefined,
          },
        });
        if (error) throw error;
        toast.success("Compte créé avec succès !");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img src={bentoFixIcon} alt="BentoFix" className="h-16 w-16 mb-4" />
          <h1 className="text-2xl font-bold text-foreground">BentoFix</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isLogin ? "Connectez-vous à votre compte" : "Créez votre compte"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jean Dupont"
                  required={!isLogin}
                  className="rounded-xl"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="rounded-xl"
              />
            </div>

            {!isLogin && (
              <div className="space-y-3">
                <Label>Vous êtes :</Label>
                <RadioGroup value={role} onValueChange={(v) => setRole(v as "locataire" | "proprietaire")}>
                  <div className="flex items-center space-x-2 p-3 rounded-xl border border-border hover:bg-accent transition-colors">
                    <RadioGroupItem value="locataire" id="locataire" />
                    <Label htmlFor="locataire" className="cursor-pointer flex-1">
                      <span className="font-medium">Locataire</span>
                      <p className="text-xs text-muted-foreground">Signalez des incidents et suivez les réparations</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-xl border border-border hover:bg-accent transition-colors">
                    <RadioGroupItem value="proprietaire" id="proprietaire" />
                    <Label htmlFor="proprietaire" className="cursor-pointer flex-1">
                      <span className="font-medium">Propriétaire / Gestionnaire</span>
                      <p className="text-xs text-muted-foreground">Gérez vos biens et traitez les demandes</p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            <Button type="submit" className="w-full rounded-xl h-11" disabled={loading}>
              {loading ? "Chargement..." : isLogin ? "Se connecter" : "Créer un compte"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
