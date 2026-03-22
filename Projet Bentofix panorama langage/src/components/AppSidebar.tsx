import { Ticket, Building2, Settings, LogOut, LayoutDashboard, BarChart3, Lock } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import bentoFixIcon from "@/assets/bentofix-icon.png";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Mes Tickets", url: "/tickets", icon: Ticket },
  { title: "Mes Propriétés", url: "/properties", icon: Building2 },
  { title: "Statistiques", url: "/statistics", icon: BarChart3, proOnly: true },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();
  const collapsed = state === "collapsed";
  const isPro = profile?.subscription_tier === "pro";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="pt-6">
        <div className="px-4 mb-8">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2.5">
            <img src={bentoFixIcon} alt="BentoFix" className="h-8 w-8 shrink-0 rounded-lg" />
            {!collapsed && (
              <span className="text-foreground font-semibold text-lg tracking-tight">BentoFix</span>
            )}
          </button>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const locked = item.proOnly && !isPro;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={locked ? "#" : item.url}
                        onClick={(e) => { if (locked) e.preventDefault(); }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 ${locked ? "text-muted-foreground/50 cursor-not-allowed" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
                        activeClassName={locked ? "" : "bg-accent text-foreground font-medium"}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!collapsed && (
                          <span className="flex items-center gap-2">
                            {item.title}
                            {locked && <Lock className="h-3.5 w-3.5 text-muted-foreground/50" />}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-2">
        <ThemeToggle collapsed={collapsed} />
        <SidebarMenuButton asChild>
          <NavLink
            to="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground transition-colors duration-200 hover:text-foreground hover:bg-accent"
            activeClassName="bg-accent text-foreground font-medium"
          >
            <Settings className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Paramètres</span>}
          </NavLink>
        </SidebarMenuButton>
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Déconnexion</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
