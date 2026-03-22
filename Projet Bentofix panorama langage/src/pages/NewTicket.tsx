import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { AlertTriangle, Camera, ArrowLeft } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type TicketCategory = Database["public"]["Enums"]["ticket_category"];

const categories: { value: TicketCategory; label: string }[] = [
  { value: "plomberie", label: "🔧 Plomberie" },
  { value: "electricite", label: "⚡ Électricité" },
  { value: "serrurerie", label: "🔑 Serrurerie" },
  { value: "peinture", label: "🎨 Peinture" },
  { value: "chauffage", label: "🔥 Chauffage" },
  { value: "autre", label: "📋 Autre" },
];

export default function NewTicket() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TicketCategory>("autre");
  const [isEmergency, setIsEmergency] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La photo ne doit pas dépasser 5 Mo");
        return;
      }
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      let photoUrl: string | null = null;

      if (photo) {
        const ext = photo.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("ticket-photos")
          .upload(path, photo);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("ticket-photos")
          .getPublicUrl(path);
        photoUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("tickets").insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        category,
        is_emergency: isEmergency,
        status: isEmergency ? "urgent" : "en_cours",
        photo_url: photoUrl,
      });

      if (error) throw error;
      toast.success("Incident signalé avec succès !");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm">Retour</span>
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-2">Signaler un incident</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Décrivez le problème rencontré et nous le traiterons rapidement.
      </p>

      {/* Emergency Banner */}
      {isEmergency && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-400">Emergency Incident Protocol</p>
            <p className="text-xs text-red-400/70 mt-1">
              Ce ticket sera marqué comme urgent et traité en priorité.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'incident *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Fuite d'eau sous l'évier"
              required
              maxLength={100}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez le problème en détail..."
              maxLength={1000}
              className="rounded-xl min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Catégorie *</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as TicketCategory)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Preuve visuelle</Label>
            <div className="relative">
              {photoPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-border">
                  <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                    className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-lg p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-2 p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Cliquez pour ajouter une photo</span>
                  <span className="text-xs text-muted-foreground/60">Max 5 Mo • JPG, PNG</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-accent/30">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <div>
                <p className="text-sm font-medium text-foreground">Urgence</p>
                <p className="text-xs text-muted-foreground">Marquer comme incident critique</p>
              </div>
            </div>
            <Switch checked={isEmergency} onCheckedChange={setIsEmergency} />
          </div>
        </div>

        <Button type="submit" className="w-full rounded-xl h-12 text-base font-medium hover-lift" disabled={loading}>
          {loading ? "Envoi en cours..." : "Envoyer le signalement"}
        </Button>
      </form>
    </div>
  );
}
