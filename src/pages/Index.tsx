import { useState } from "react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import Dashboard from "@/components/dashboard/Dashboard";
import DisasterMap from "@/components/map/DisasterMap";
import SOSButton from "@/components/sos/SOSButton";
import AlertsPanel from "@/components/alerts/AlertsPanel";
import SettingsPanel from "@/components/settings/SettingsPanel";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const alertCount = 3;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onNavigate={handleTabChange} />;
      case "map":
        return <DisasterMap />;
      case "sos":
        return <SOSButton />;
      case "alerts":
        return <AlertsPanel />;
      case "settings":
        return <SettingsPanel />;
      default:
        return <Dashboard onNavigate={handleTabChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        alertCount={alertCount} 
        onAlertClick={() => setActiveTab("alerts")}
      />
      
      <main className="pt-20 pb-24 px-4 max-w-lg mx-auto">
        {renderContent()}
      </main>
      
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;
