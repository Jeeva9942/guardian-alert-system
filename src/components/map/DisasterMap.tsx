import { useState } from "react";
import { MapPin, Shield, AlertTriangle, Navigation, Layers, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Location {
  id: string;
  name: string;
  type: "shelter" | "danger" | "hospital" | "police";
  lat: number;
  lng: number;
  distance: string;
}

const mockLocations: Location[] = [
  { id: "1", name: "Central Emergency Shelter", type: "shelter", lat: 40.7128, lng: -74.006, distance: "0.5 km" },
  { id: "2", name: "City Hospital", type: "hospital", lat: 40.715, lng: -74.009, distance: "1.2 km" },
  { id: "3", name: "Police Station #12", type: "police", lat: 40.711, lng: -74.003, distance: "0.8 km" },
  { id: "4", name: "Flood Zone A", type: "danger", lat: 40.718, lng: -74.001, distance: "2.1 km" },
  { id: "5", name: "Community Center", type: "shelter", lat: 40.708, lng: -74.012, distance: "1.5 km" },
];

const DisasterMap = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const filters = [
    { id: "all", label: "All", icon: Layers },
    { id: "shelter", label: "Shelters", icon: Shield },
    { id: "danger", label: "Danger", icon: AlertTriangle },
    { id: "hospital", label: "Medical", icon: MapPin },
  ];

  const filteredLocations = selectedFilter === "all" 
    ? mockLocations 
    : mockLocations.filter(loc => loc.type === selectedFilter);

  const getLocationStyle = (type: string) => {
    switch (type) {
      case "shelter": return "bg-success text-success-foreground";
      case "danger": return "bg-destructive text-destructive-foreground animate-pulse";
      case "hospital": return "bg-primary text-primary-foreground";
      case "police": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Filter Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={selectedFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter(filter.id)}
            className="flex-shrink-0"
          >
            <filter.icon className="w-4 h-4 mr-1" />
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Map Container */}
      <div className="relative rounded-xl overflow-hidden border border-border bg-card aspect-[4/3]">
        {/* Placeholder Map Background */}
        <div className="absolute inset-0 bg-gradient-dark">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
          
          {/* Mock Map Markers */}
          <div className="absolute inset-0 p-8">
            {filteredLocations.map((location, index) => (
              <button
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className={cn(
                  "absolute w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-125",
                  getLocationStyle(location.type),
                  selectedLocation?.id === location.id && "ring-2 ring-foreground scale-125"
                )}
                style={{
                  left: `${20 + (index * 15) % 60}%`,
                  top: `${15 + (index * 20) % 60}%`,
                }}
              >
                {location.type === "shelter" && <Shield className="w-4 h-4" />}
                {location.type === "danger" && <AlertTriangle className="w-4 h-4" />}
                {location.type === "hospital" && <MapPin className="w-4 h-4" />}
                {location.type === "police" && <Shield className="w-4 h-4" />}
              </button>
            ))}
            
            {/* User Location */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-primary rounded-full shadow-glow" />
              <div className="absolute inset-0 w-4 h-4 bg-primary rounded-full animate-ping opacity-75" />
            </div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <Button variant="glass" size="icon" className="h-8 w-8">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="glass" size="icon" className="h-8 w-8">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="glass" size="icon" className="h-8 w-8">
            <Navigation className="w-4 h-4" />
          </Button>
        </div>

        {/* Map Note */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="glass rounded-lg px-3 py-2 text-xs text-muted-foreground">
            📍 Add Mapbox API key for live map integration
          </div>
        </div>
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="glass rounded-xl p-4 animate-slide-up">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{selectedLocation.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{selectedLocation.type}</p>
            </div>
            <span className="text-sm text-primary font-medium">{selectedLocation.distance}</span>
          </div>
          <div className="flex gap-2 mt-3">
            <Button size="sm" className="flex-1">
              <Navigation className="w-4 h-4 mr-1" />
              Navigate
            </Button>
            <Button variant="outline" size="sm">
              Details
            </Button>
          </div>
        </div>
      )}

      {/* Location List */}
      <div className="space-y-2">
        <h3 className="font-semibold">Nearby Locations</h3>
        {filteredLocations.map((location) => (
          <button
            key={location.id}
            onClick={() => setSelectedLocation(location)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-all",
              selectedLocation?.id === location.id && "border-primary"
            )}
          >
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", getLocationStyle(location.type))}>
              {location.type === "shelter" && <Shield className="w-5 h-5" />}
              {location.type === "danger" && <AlertTriangle className="w-5 h-5" />}
              {location.type === "hospital" && <MapPin className="w-5 h-5" />}
              {location.type === "police" && <Shield className="w-5 h-5" />}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">{location.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{location.type}</p>
            </div>
            <span className="text-sm text-primary">{location.distance}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DisasterMap;
