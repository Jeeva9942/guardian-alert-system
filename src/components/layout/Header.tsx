import { Bell, Menu, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  alertCount: number;
  onMenuClick?: () => void;
  onAlertClick?: () => void;
}

const Header = ({ alertCount, onMenuClick, onAlertClick }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 safe-area-pt">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">SafeGuard</h1>
            <p className="text-xs text-muted-foreground">Disaster Management</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={onAlertClick}
          >
            <Bell className="w-5 h-5" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                {alertCount}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={onMenuClick}>
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
