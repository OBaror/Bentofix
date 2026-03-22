import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Plus, TriangleAlert as AlertTriangle, Clock, CircleCheck as CheckCircle2, Lock, TrendingUp, Eye, Image as ImageIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Database } from "@/integrations/supabase/types";

type Ticket = Database["public"]["Tables"]["tickets"]["Row"];

const statusConfig: Record<
  string,
  { label: string; className: string; dotClass: string }
> = {
  urgent: {
    label: "Urgent",
    className: "bg-red-500/15 text-red-500 border-red-500/25",
    dotClass: "bg-red-500",
  },
  en_cours: {
    label: "En cours",
    className: "bg-amber-500/15 text-amber-500 border-amber-500/25",
    dotClass: "bg-amber-500",
  },
  resolu: {
    label: "Résolu",
    className: "bg-emerald-500/15 text-emerald-500 border-emerald-500/25",
    dotClass: "bg-emerald-500",
  },
};

const categoryLabels: Record<string, string> = {
  plomberie: "Plomberie",
  electricite: "Électricité",
  serrurerie: "Serrurerie",
  peinture: "Peinture",
  chauffage: "Chauffage",
  autre: "Autre",
};

const mockChartData = [
  { month: "Jan", cost: 320 },
  { month: "Fév", cost: 450 },
  { month: "Mar", cost: 280 },
  { month: "Avr", cost: 520 },
  { month: "Mai", cost: 390 },
  { month: "Jun", cost: 610 },
];

const seedTickets: Omit<
  Database["public"]["Tables"]["tickets"]["Insert"],
  "user_id"
>[] = [
  {
    title: "Fuite d'eau - Cuisine",
    description:
      "Fuite importante sous l'évier de la cuisine. Le joint du siphon semble endommagé.",
    category: "plomberie",
    status: "urgent",
    is_emergency: true,
  },
  {
    title: "Panne de chauffage - Salon",
    description:
      "Le radiateur du salon ne chauffe plus depuis hier soir. Le thermostat affiche une erreur.",
    category: "chauffage",
    status: "urgent",
    is_emergency: true,
  },
  {
    title: "Ampoule cage d'escalier",
    description:
      "L'ampoule du 2ème étage est grillée. Besoin d'une intervention rapide.",
    category: "electricite",
    status: "en_cours",
    is_emergency: false,
  },
  {
    title: "Peinture hall d'entrée",
    description:
      "La peinture du hall d'entrée s'écaille sur le mur est. Surface estimée : 4m².",
    category: "peinture",
    status: "resolu",
    is_emergency: false,
  },
  {
    title: "Vitre fêlée - Chambre 2",
    description:
      "La vitre de la fenêtre de la chambre 2 est fêlée suite aux intempéries.",
    category: "autre",
    status: "urgent",
    is_emergency: true,
  },
];

export default function Dashboard() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const isPro = profile?.subscription_tier === "pro";

  useEffect(() => {
    const fetchAndSeed = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (!data || data.length === 0) {
        const rows = seedTickets.map((t) => ({ ...t, user_id: user.id }));
        const { data: seeded } = await supabase
          .from("tickets")
          .insert(rows)
          .select();
        setTickets(seeded || []);
      } else {
        setTickets(data);
      }
      setLoading(false);
    };
    fetchAndSeed();

    const channel = supabase
      .channel("tickets-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tickets" },
        () => {
          fetchAndSeed();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const urgentCount = tickets.filter((t) => t.status === "urgent").length;
  const enCoursCount = tickets.filter((t) => t.status === "en_cours").length;
  const resoluCount = tickets.filter((t) => t.status === "resolu").length;

  const stats = [
    {
      label: "Tickets Ouverts",
      value: urgentCount,
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
    {
      label: "En cours",
      value: enCoursCount,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      label: "Terminées",
      value: resoluCount,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Bonjour{profile?.full_name ? `, ${profile.full_name}` : ""} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {profile?.role === "proprietaire"
              ? "Tableau de bord propriétaire"
              : "Tableau de bord locataire"}
          </p>
        </div>
        <Button
          onClick={() => navigate("/tickets/new")}
          className="rounded-2xl h-11 px-5 font-medium hover-lift"
        >
          <Plus className="mr-2 h-4 w-4" />
          Signaler un problème
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`bg-card border ${s.border} rounded-2xl p-5 flex items-center gap-4`}
          >
            <div
              className={`h-12 w-12 rounded-2xl ${s.bg} flex items-center justify-center`}
            >
              <s.icon className={`h-6 w-6 ${s.color}`} />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Ticket List */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Derniers Tickets
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-muted/50 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">
              Aucun ticket pour le moment
            </p>
          ) : (
            <div className="space-y-2">
              {tickets.map((ticket) => {
                const cfg = statusConfig[ticket.status];
                return (
                  <div
                    key={ticket.id}
                    className="flex items-center gap-4 p-3 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                  >
                    {/* Photo thumbnail */}
                    <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 overflow-hidden">
                      {ticket.photo_url ? (
                        <img
                          src={ticket.photo_url}
                          alt=""
                          className="h-full w-full object-cover rounded-xl"
                        />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-muted-foreground/50" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {ticket.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {categoryLabels[ticket.category] || ticket.category} ·{" "}
                        {new Date(ticket.created_at).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                    </div>

                    <Badge
                      className={`${cfg.className} rounded-lg text-xs border shrink-0`}
                    >
                      {cfg.label}
                    </Badge>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 rounded-xl"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pro Widget - Cost Analysis */}
        <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Analyse des Coûts
            </h2>
            {!isPro && (
              <Badge className="bg-primary/15 text-primary border-primary/25 rounded-lg text-xs border">
                <Lock className="h-3 w-3 mr-1" />
                Pro
              </Badge>
            )}
          </div>

          <div className={!isPro ? "blur-sm pointer-events-none select-none" : ""}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mockChartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="month"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value: number) => [`${value}€`, "Coût"]}
                />
                <Bar
                  dataKey="cost"
                  fill="hsl(var(--primary))"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-muted-foreground">
                -12% vs mois précédent
              </span>
            </div>
          </div>

          {!isPro && (
            <div className="absolute inset-0 flex items-center justify-center bg-card/60 backdrop-blur-[2px] rounded-2xl">
              <Button
                onClick={() => navigate("/settings")}
                className="rounded-2xl font-medium"
              >
                <Lock className="mr-2 h-4 w-4" />
                Passer au Plan Pro
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Detail Sheet */}
      <Sheet
        open={!!selectedTicket}
        onOpenChange={(open) => !open && setSelectedTicket(null)}
      >
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{selectedTicket?.title}</SheetTitle>
          </SheetHeader>
          {selectedTicket && (
            <div className="mt-6 space-y-5">
              <div className="flex gap-2">
                <Badge
                  className={`${statusConfig[selectedTicket.status].className} rounded-lg text-xs border`}
                >
                  {statusConfig[selectedTicket.status].label}
                </Badge>
                {selectedTicket.is_emergency && (
                  <Badge className="bg-red-500/15 text-red-500 border-red-500/25 rounded-lg text-xs border">
                    Urgence
                  </Badge>
                )}
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Catégorie</p>
                <p className="text-sm text-foreground">
                  {categoryLabels[selectedTicket.category] ||
                    selectedTicket.category}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Date</p>
                <p className="text-sm text-foreground">
                  {new Date(selectedTicket.created_at).toLocaleDateString(
                    "fr-FR",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>

              {selectedTicket.description && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Description
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {selectedTicket.description}
                  </p>
                </div>
              )}

              {selectedTicket.photo_url && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Photo</p>
                  <img
                    src={selectedTicket.photo_url}
                    alt="Photo du ticket"
                    className="w-full rounded-xl border border-border"
                  />
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
