import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ collapsed = false }: { collapsed?: boolean }) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size={collapsed ? "icon" : "default"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl w-full"
    >
      <Sun className="h-5 w-5 shrink-0 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 shrink-0 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
      {!collapsed && <span>Thème</span>}
    </Button>
  );
}
