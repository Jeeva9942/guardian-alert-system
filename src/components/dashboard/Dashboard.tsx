import { AlertTriangle, CloudRain, Wind, Thermometer, Users, Shield, TrendingUp, Activity, MapPin, Bell, Clock, Droplets, Eye, Gauge } from "lucide-react";
import StatCard from "./StatCard";
import AlertBanner from "./AlertBanner";
import QuickActions from "./QuickActions";
import { useState } from "react";

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const [showAlert, setShowAlert] = useState(true);

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "emergency":
        onNavigate("sos");
        break;
      case "shelters":
        onNavigate("map");
        break;
      default:
        console.log("Action:", actionId);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Active Alert Banner */}
      {showAlert && (
        <AlertBanner
          title="Flash Flood Warning"
          message="Heavy rainfall expected in your area. Stay alert and be prepared to evacuate."
          severity="warning"
          onDismiss={() => setShowAlert(false)}
        />
      )}

      {/* Status Overview */}
      <section>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Current Status
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            title="Risk Level"
            value="Moderate"
            icon={AlertTriangle}
            variant="warning"
          />
          <StatCard
            title="Active Alerts"
            value="3"
            icon={AlertTriangle}
            variant="danger"
          />
          <StatCard
            title="Weather"
            value="Stormy"
            icon={CloudRain}
            variant="warning"
          />
          <StatCard
            title="Wind Speed"
            value="45 km/h"
            icon={Wind}
            variant="default"
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <QuickActions onActionClick={handleQuickAction} />
      </section>

      {/* Weather Insights */}
      <section className="bg-card rounded-xl p-4 border border-border">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <CloudRain className="w-5 h-5 text-primary" />
          Weather Insights
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Thermometer className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Temperature</p>
            <p className="font-semibold">24°C</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Droplets className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Humidity</p>
            <p className="font-semibold">78%</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Eye className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Visibility</p>
            <p className="font-semibold">5 km</p>
          </div>
        </div>
        <div className="mt-3 p-3 bg-warning/10 rounded-lg border border-warning/20">
          <p className="text-sm text-warning-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            Heavy rain expected in the next 2 hours
          </p>
        </div>
      </section>

      {/* Nearby Resources */}
      <section className="bg-card rounded-xl p-4 border border-border">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Nearby Resources
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-sm">Emergency Shelters</p>
                <p className="text-xs text-muted-foreground">5 within 2km radius</p>
              </div>
            </div>
            <span className="text-sm font-medium text-success">Available</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Medical Centers</p>
                <p className="text-xs text-muted-foreground">3 hospitals nearby</p>
              </div>
            </div>
            <span className="text-sm font-medium text-primary">Open 24/7</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg border border-warning/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                <Gauge className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-medium text-sm">Supply Stations</p>
                <p className="text-xs text-muted-foreground">Food & water distribution</p>
              </div>
            </div>
            <span className="text-sm font-medium text-warning">Limited</span>
          </div>
        </div>
      </section>

      {/* Disaster Statistics */}
      <section className="bg-card rounded-xl p-4 border border-border">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Area Statistics
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Evacuation Progress</span>
              <span className="font-medium">72%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-success rounded-full" style={{ width: "72%" }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Shelter Capacity</span>
              <span className="font-medium">45%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "45%" }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Emergency Response</span>
              <span className="font-medium">Active</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-warning rounded-full animate-pulse" style={{ width: "100%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="bg-card rounded-xl p-4 border border-border">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Safety Tips
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            Keep emergency supplies stocked and accessible
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            Know your evacuation routes and shelter locations
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            Stay connected with family and local authorities
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            Keep your phone charged and enable emergency alerts
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            Have a first aid kit ready with essential medications
          </li>
        </ul>
      </section>

      {/* Emergency Contacts Summary */}
      <section className="bg-card rounded-xl p-4 border border-border">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Emergency Contacts
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20 text-center">
            <p className="text-2xl font-bold text-destructive">911</p>
            <p className="text-xs text-muted-foreground">Emergency</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 text-center">
            <p className="text-2xl font-bold text-primary">112</p>
            <p className="text-xs text-muted-foreground">Local Disaster</p>
          </div>
          <div className="p-3 bg-success/10 rounded-lg border border-success/20 text-center">
            <p className="text-2xl font-bold text-success">108</p>
            <p className="text-xs text-muted-foreground">Ambulance</p>
          </div>
          <div className="p-3 bg-warning/10 rounded-lg border border-warning/20 text-center">
            <p className="text-2xl font-bold text-warning">101</p>
            <p className="text-xs text-muted-foreground">Fire Services</p>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-card rounded-xl p-4 border border-border">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Recent Activity
        </h2>
        <div className="space-y-3">
          {[
            { time: "2 min ago", event: "Weather alert updated", type: "info" },
            { time: "15 min ago", event: "Location synced", type: "success" },
            { time: "1 hr ago", event: "Emergency contact verified", type: "success" },
            { time: "2 hr ago", event: "Shelter locations updated", type: "info" },
            { time: "3 hr ago", event: "New evacuation route added", type: "warning" },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              <span className={`w-2 h-2 rounded-full ${
                item.type === "success" ? "bg-success" : 
                item.type === "warning" ? "bg-warning" : "bg-primary"
              }`} />
              <span className="flex-1 text-foreground">{item.event}</span>
              <span className="text-muted-foreground text-xs">{item.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
