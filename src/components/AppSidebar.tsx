import {
  LayoutDashboard, Route, Truck, Trash2, BarChart3,
  Bell, Settings,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { SwachBotLogo, ThemeToggle } from "@/components/SwachBotLogo";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Route Optimization", url: "/routes", icon: Route },
  { title: "Fleet Tracking", url: "/fleet", icon: Truck },
  { title: "Bin Management", url: "/bins", icon: Trash2 },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Alerts", url: "/alerts", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className={collapsed ? "p-2" : "p-4"}>
        <SwachBotLogo collapsed={collapsed} />
      </SidebarHeader>
      <Separator className="bg-sidebar-border" />
      <SidebarContent className={collapsed ? "px-0 py-2" : "px-2 py-2"}>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">Navigation</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url} tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end
                      className={`flex items-center rounded-lg py-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'}`}
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>
        {!collapsed && (
          <div className="mt-2 rounded-lg bg-sidebar-accent p-3">
            <p className="text-xs font-medium text-sidebar-foreground">Ahmedabad Municipal Corporation</p>
            <p className="text-xs text-sidebar-foreground/60">Operator: Admin User</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
