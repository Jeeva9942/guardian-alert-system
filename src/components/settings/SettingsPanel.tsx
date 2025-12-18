import { useState } from "react";
import { 
  User, Bell, MapPin, Shield, Wifi, WifiOff, 
  Phone, Users, ChevronRight, Moon, Volume2, Vibrate 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface SettingItem {
  id: string;
  icon: typeof User;
  label: string;
  description?: string;
  type: "toggle" | "link" | "status";
  value?: boolean;
}

const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    location: true,
    offlineMode: false,
    soundAlerts: true,
    vibration: true,
    darkMode: true,
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const settingSections = [
    {
      title: "Account",
      items: [
        { id: "profile", icon: User, label: "Profile", description: "Manage your profile", type: "link" as const },
        { id: "contacts", icon: Users, label: "Emergency Contacts", description: "3 contacts added", type: "link" as const },
      ]
    },
    {
      title: "Notifications",
      items: [
        { id: "notifications", icon: Bell, label: "Push Notifications", value: settings.notifications, type: "toggle" as const },
        { id: "sound", icon: Volume2, label: "Sound Alerts", value: settings.soundAlerts, type: "toggle" as const },
        { id: "vibration", icon: Vibrate, label: "Vibration", value: settings.vibration, type: "toggle" as const },
      ]
    },
    {
      title: "Privacy & Location",
      items: [
        { id: "location", icon: MapPin, label: "Location Services", description: "Required for SOS", value: settings.location, type: "toggle" as const },
        { id: "privacy", icon: Shield, label: "Privacy Settings", type: "link" as const },
      ]
    },
    {
      title: "Connectivity",
      items: [
        { id: "offline", icon: WifiOff, label: "Offline Mode", description: "Cache data for offline use", value: settings.offlineMode, type: "toggle" as const },
        { id: "sync", icon: Wifi, label: "Sync Status", description: isOnline ? "Connected" : "Offline", type: "status" as const },
      ]
    },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your preferences</p>
      </div>

      {/* Connection Status Banner */}
      <div className={cn(
        "rounded-xl p-4 border flex items-center gap-3",
        isOnline ? "bg-success/10 border-success/30" : "bg-warning/10 border-warning/30"
      )}>
        {isOnline ? (
          <Wifi className="w-5 h-5 text-success" />
        ) : (
          <WifiOff className="w-5 h-5 text-warning" />
        )}
        <div>
          <p className="font-medium">{isOnline ? "Online" : "Offline Mode"}</p>
          <p className="text-xs text-muted-foreground">
            {isOnline ? "All features available" : "Using cached data"}
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      {settingSections.map((section) => (
        <div key={section.title}>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            {section.title}
          </h3>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {section.items.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center gap-3 p-4",
                  index !== section.items.length - 1 && "border-b border-border"
                )}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.label}</p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  )}
                </div>
                {item.type === "toggle" && (
                  <Switch
                    checked={item.value}
                    onCheckedChange={() => toggleSetting(item.id as keyof typeof settings)}
                  />
                )}
                {item.type === "link" && (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
                {item.type === "status" && (
                  <span className={cn(
                    "text-sm font-medium",
                    isOnline ? "text-success" : "text-warning"
                  )}>
                    {item.description}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Emergency Info */}
      <div className="bg-destructive/10 rounded-xl p-4 border border-destructive/30">
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-destructive" />
          <div>
            <p className="font-semibold">Emergency Numbers</p>
            <p className="text-sm text-muted-foreground">911 • Local: +1-555-0123</p>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="text-center text-xs text-muted-foreground space-y-1 pt-4">
        <p>SafeGuard Disaster Management v1.0.0</p>
        <p>Last synced: Just now</p>
      </div>
    </div>
  );
};

export default SettingsPanel;
