import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  variant?: "default" | "warning" | "danger" | "success";
  className?: string;
}

const StatCard = ({ title, value, icon: Icon, trend, variant = "default", className }: StatCardProps) => {
  const variantStyles = {
    default: "bg-card border-border",
    warning: "bg-warning/10 border-warning/30",
    danger: "bg-destructive/10 border-destructive/30",
    success: "bg-success/10 border-success/30",
  };

  const iconStyles = {
    default: "text-primary",
    warning: "text-warning",
    danger: "text-destructive",
    success: "text-success",
  };

  return (
    <div className={cn(
      "rounded-xl p-4 border shadow-card transition-all duration-200 hover:scale-[1.02] animate-fade-in",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          variant === "default" ? "bg-primary/10" : `bg-${variant}/20`
        )}>
          <Icon className={cn("w-5 h-5", iconStyles[variant])} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
