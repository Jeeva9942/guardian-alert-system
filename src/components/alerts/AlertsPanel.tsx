import { useState } from "react";
import { Bell, AlertTriangle, CloudRain, Wind, Flame, Check, Clock, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  title: string;
  message: string;
  type: "warning" | "danger" | "info";
  icon: typeof AlertTriangle;
  time: string;
  isRead: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    title: "Flash Flood Warning",
    message: "Heavy rainfall expected. Avoid low-lying areas and stay indoors.",
    type: "danger",
    icon: CloudRain,
    time: "5 min ago",
    isRead: false,
  },
  {
    id: "2",
    title: "High Wind Advisory",
    message: "Wind speeds up to 60 km/h expected. Secure loose objects.",
    type: "warning",
    icon: Wind,
    time: "1 hr ago",
    isRead: false,
  },
  {
    id: "3",
    title: "Fire Risk Alert",
    message: "Elevated fire risk in northern region. Exercise caution.",
    type: "warning",
    icon: Flame,
    time: "3 hrs ago",
    isRead: true,
  },
  {
    id: "4",
    title: "Shelter Update",
    message: "New emergency shelter opened at Central Community Center.",
    type: "info",
    icon: Bell,
    time: "5 hrs ago",
    isRead: true,
  },
];

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isRead: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, isRead: true })));
  };

  const filteredAlerts = filter === "unread" 
    ? alerts.filter(a => !a.isRead) 
    : alerts;

  const unreadCount = alerts.filter(a => !a.isRead).length;

  const getAlertStyle = (type: string, isRead: boolean) => {
    const baseStyle = isRead ? "opacity-60" : "";
    switch (type) {
      case "danger": return `border-destructive/50 bg-destructive/10 ${baseStyle}`;
      case "warning": return `border-warning/50 bg-warning/10 ${baseStyle}`;
      default: return `border-primary/50 bg-primary/10 ${baseStyle}`;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "danger": return "text-destructive";
      case "warning": return "text-warning";
      default: return "text-primary";
    }
  };

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Alerts
          </h2>
          <p className="text-sm text-muted-foreground">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            <Check className="w-4 h-4 mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All ({alerts.length})
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("unread")}
        >
          Unread ({unreadCount})
        </Button>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No alerts to display</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <button
              key={alert.id}
              onClick={() => markAsRead(alert.id)}
              className={cn(
                "w-full text-left rounded-xl p-4 border transition-all hover:scale-[1.01]",
                getAlertStyle(alert.type, alert.isRead)
              )}
            >
              <div className="flex gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  alert.type === "danger" ? "bg-destructive/20" : 
                  alert.type === "warning" ? "bg-warning/20" : "bg-primary/20"
                )}>
                  <alert.icon className={cn("w-5 h-5", getIconColor(alert.type))} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground">{alert.title}</h3>
                    {!alert.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {alert.time}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Settings Link */}
      <div className="pt-4">
        <Button variant="outline" className="w-full">
          <Filter className="w-4 h-4 mr-2" />
          Notification Settings
        </Button>
      </div>
    </div>
  );
};

export default AlertsPanel;
