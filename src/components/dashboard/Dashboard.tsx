import { AlertTriangle, CloudRain, Wind, Thermometer, Users, Shield } from "lucide-react";
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
        </ul>
      </section>

      {/* Recent Activity */}
      <section className="bg-card rounded-xl p-4 border border-border">
        <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { time: "2 min ago", event: "Weather alert updated", type: "info" },
            { time: "15 min ago", event: "Location synced", type: "success" },
            { time: "1 hr ago", event: "Emergency contact verified", type: "success" },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              <span className={`w-2 h-2 rounded-full ${
                item.type === "success" ? "bg-success" : "bg-primary"
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
