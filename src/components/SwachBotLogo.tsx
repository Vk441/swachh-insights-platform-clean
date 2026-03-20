import { Recycle, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-sidebar-foreground hover:bg-sidebar-accent">
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

export function SwachBotLogo({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${collapsed ? 'justify-center' : 'px-2'}`}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary mx-auto">
        <Recycle className="h-5 w-5 text-primary-foreground" />
      </div>
      {!collapsed && <span className="font-display text-lg font-bold text-sidebar-foreground whitespace-nowrap">SwachBot</span>}
    </div>
  );
}
