import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, DivIcon } from "leaflet";
import { MapPin, Shield, AlertTriangle, Navigation, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

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

const createCustomIcon = (type: string) => {
  const colors: Record<string, string> = {
    shelter: "#22c55e",
    danger: "#ef4444",
    hospital: "#3b82f6",
    police: "#f59e0b",
    user: "#6366f1",
  };

  return new DivIcon({
    className: "custom-marker",
    html: `<div style="
      background-color: ${colors[type] || colors.user};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
        ${type === "shelter" ? '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' : ''}
        ${type === "danger" ? '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>' : ''}
        ${type === "hospital" ? '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>' : ''}
        ${type === "police" ? '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' : ''}
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const userIcon = new DivIcon({
  className: "user-marker",
  html: `<div style="
    background-color: #6366f1;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 0 0 8px rgba(99, 102, 241, 0.3), 0 2px 8px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const LocationToCenter = ({ location }: { location: Location | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 15, { duration: 0.5 });
    }
  }, [location, map]);
  
  return null;
};

const DisasterMap = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [userPosition] = useState<[number, number]>([40.7128, -74.006]);

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
      case "danger": return "bg-destructive text-destructive-foreground";
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
      <div className="relative rounded-xl overflow-hidden border border-border bg-white aspect-[4/3]">
        <MapContainer
          center={userPosition}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* User Location Marker */}
          <Marker position={userPosition} icon={userIcon}>
            <Popup>
              <div className="text-center font-medium">Your Location</div>
            </Popup>
          </Marker>

          {/* Location Markers */}
          {filteredLocations.map((location) => (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={createCustomIcon(location.type)}
              eventHandlers={{
                click: () => setSelectedLocation(location),
              }}
            >
              <Popup>
                <div className="text-center">
                  <div className="font-medium">{location.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{location.type}</div>
                  <div className="text-xs text-blue-600">{location.distance}</div>
                </div>
              </Popup>
            </Marker>
          ))}

          <LocationToCenter location={selectedLocation} />
        </MapContainer>
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="bg-card rounded-xl p-4 border border-border animate-slide-up">
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
            <Button variant="outline" size="sm" onClick={() => setSelectedLocation(null)}>
              Close
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
