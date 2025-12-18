import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AlertBannerProps {
  title: string;
  message: string;
  severity: "warning" | "danger" | "info";
  onDismiss?: () => void;
}

const AlertBanner = ({ title, message, severity, onDismiss }: AlertBannerProps) => {
  const severityStyles = {
    warning: "bg-warning/20 border-warning/50 text-warning",
    danger: "bg-destructive/20 border-destructive/50 text-destructive animate-pulse",
    info: "bg-primary/20 border-primary/50 text-primary",
  };

  return (
    <div className={`rounded-xl p-4 border ${severityStyles[severity]} animate-slide-up`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{message}</p>
        </div>
        {onDismiss && (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onDismiss}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default AlertBanner;
