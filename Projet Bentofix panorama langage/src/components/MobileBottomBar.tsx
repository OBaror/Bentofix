import { LayoutDashboard, Ticket, Building2, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Tickets", url: "/tickets", icon: Ticket },
  { title: "Propriétés", url: "/properties", icon: Building2 },
  { title: "Paramètres", url: "/settings", icon: Settings },
];

export function MobileBottomBar() {
  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div className="flex items-center justify-around h-16 px-2 bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-lg shadow-black/10 dark:shadow-black/30">
        {items.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className="flex flex-col items-center gap-1 px-3 py-1.5 text-muted-foreground transition-colors duration-200"
            activeClassName="text-primary"
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.title}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
