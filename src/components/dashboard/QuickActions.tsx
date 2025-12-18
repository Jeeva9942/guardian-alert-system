import { Phone, MapPin, Users, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  icon: typeof Phone;
  label: string;
  color: string;
  bgColor: string;
}

const actions: QuickAction[] = [
  { id: "emergency", icon: Phone, label: "Emergency", color: "text-destructive", bgColor: "bg-destructive/10" },
  { id: "shelters", icon: MapPin, label: "Shelters", color: "text-success", bgColor: "bg-success/10" },
  { id: "family", icon: Users, label: "Family", color: "text-primary", bgColor: "bg-primary/10" },
  { id: "guides", icon: FileText, label: "Guides", color: "text-warning", bgColor: "bg-warning/10" },
];

interface QuickActionsProps {
  onActionClick: (actionId: string) => void;
}

const QuickActions = ({ onActionClick }: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onActionClick(action.id)}
          className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-200 hover:scale-105 animate-fade-in"
        >
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", action.bgColor)}>
            <action.icon className={cn("w-6 h-6", action.color)} />
          </div>
          <span className="text-xs font-medium text-muted-foreground">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
