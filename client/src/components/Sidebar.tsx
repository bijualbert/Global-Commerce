import { Link, useLocation } from "wouter";
import { LayoutDashboard, ShoppingBag, Workflow, Settings, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, href: "/" },
  { label: "Products", icon: ShoppingBag, href: "/products" },
  { label: "Automations", icon: Workflow, href: "/automations" },
  { label: "Regions", icon: Globe, href: "/regions" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 border-r border-border bg-card min-h-screen fixed left-0 top-0 z-30 hidden md:flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold font-display">GM</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight">Global</h1>
            <p className="text-xs text-muted-foreground font-medium">Commerce OS</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-primary/10 text-primary shadow-sm" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}>
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-4">
          <p className="text-xs font-semibold text-primary mb-1">Status: Operational</p>
          <p className="text-[10px] text-muted-foreground">System v2.4.0 • Updated 2m ago</p>
        </div>
      </div>
    </aside>
  );
}
