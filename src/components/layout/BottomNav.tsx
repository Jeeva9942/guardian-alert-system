import { Home, Map, Bell, Phone, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", icon: Home, label: "Home" },
  { id: "map", icon: Map, label: "Map" },
  { id: "sos", icon: Phone, label: "SOS" },
  { id: "alerts", icon: Bell, label: "Alerts" },
  { id: "settings", icon: Settings, label: "Settings" },
];

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 safe-area-pb">
      <div className="flex items-center justify-around py-2 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isSOS = item.id === "sos";
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200",
                isSOS 
                  ? "bg-gradient-danger text-destructive-foreground -mt-4 w-16 h-16 rounded-full shadow-danger-glow" 
                  : isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isSOS && "w-6 h-6")} />
              {!isSOS && (
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
