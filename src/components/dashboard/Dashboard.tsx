import { AlertTriangle, CloudRain, Wind, Thermometer, Users, Shield, TrendingUp, Activity, MapPin, Bell, Clock, Droplets, Eye, Gauge, RefreshCw, Loader2, CloudSun, Cloud, CloudSnow, CloudLightning, Sun, CloudFog } from "lucide-react";
import StatCard from "./StatCard";
import AlertBanner from "./AlertBanner";
import QuickActions from "./QuickActions";
import { useState } from "react";
import { useWeather } from "@/hooks/useWeather";
import { Button } from "@/components/ui/button";

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

const getWeatherIcon = (weather: string) => {
  switch (weather.toLowerCase()) {
    case 'thunderstorm':
      return CloudLightning;
    case 'drizzle':
    case 'rain':
      return CloudRain;
    case 'snow':
      return CloudSnow;
    case 'mist':
    case 'fog':
    case 'haze':
      return CloudFog;
    case 'clouds':
      return Cloud;
    case 'clear':
      return Sun;
    default:
      return CloudSun;
  }
};

const getRiskLevel = (weather: string, windSpeed: number, alerts: any[]) => {
  if (alerts.length > 0) return { level: 'High', variant: 'danger' as const };
  if (weather.toLowerCase().includes('thunder') || weather.toLowerCase().includes('storm')) {
    return { level: 'High', variant: 'danger' as const };
  }
  if (windSpeed > 50 || weather.toLowerCase() === 'rain') {
    return { level: 'Moderate', variant: 'warning' as const };
  }
  return { level: 'Low', variant: 'success' as const };
};

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const [showAlert, setShowAlert] = useState(true);
  const { weather, loading, error, refresh } = useWeather();

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

  const risk = weather ? getRiskLevel(weather.current.weather, weather.current.wind_speed, weather.alerts) : { level: 'Unknown', variant: 'default' as const };
  const WeatherIconComponent = weather ? getWeatherIcon(weather.current.weather) : CloudSun;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Weather Alerts from API */}
      {weather?.alerts && weather.alerts.length > 0 && weather.alerts.map((alert, index) => (
        <AlertBanner
          key={index}
          title={alert.event}
          message={alert.description.slice(0, 150) + (alert.description.length > 150 ? '...' : '')}
          severity="danger"
          onDismiss={() => {}}
        />
      ))}

      {/* Default Alert Banner */}
      {showAlert && (!weather?.alerts || weather.alerts.length === 0) && (
        <AlertBanner
          title={loading ? "Loading Weather Data..." : weather ? `Weather: ${weather.current.weather_description}` : "Weather Alert"}
          message={loading ? "Fetching real-time weather information for your location." : weather ? `Current conditions in ${weather.current.location}, ${weather.current.country}` : "Unable to fetch weather data. Please check your connection."}
          severity={loading ? "info" : weather ? "info" : "warning"}
          onDismiss={() => setShowAlert(false)}
        />
      )}

      {/* Status Overview */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Current Status
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={refresh}
            disabled={loading}
            className="h-8 w-8 p-0"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 bg-destructive/10 rounded-xl text-destructive text-sm">
            {error}. <button onClick={refresh} className="underline">Retry</button>
          </div>
        ) : weather ? (
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              title="Risk Level"
              value={risk.level}
              icon={AlertTriangle}
              variant={risk.variant}
            />
            <StatCard
              title="Active Alerts"
              value={String(weather.alerts.length)}
              icon={AlertTriangle}
              variant={weather.alerts.length > 0 ? "danger" : "success"}
            />
            <StatCard
              title="Weather"
              value={weather.current.weather}
              icon={WeatherIconComponent}
              variant={weather.current.weather.toLowerCase().includes('rain') || weather.current.weather.toLowerCase().includes('storm') ? "warning" : "default"}
            />
            <StatCard
              title="Wind Speed"
              value={`${weather.current.wind_speed} km/h`}
              icon={Wind}
              variant={weather.current.wind_speed > 50 ? "warning" : "default"}
            />
          </div>
        ) : null}
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <QuickActions onActionClick={handleQuickAction} />
      </section>

      {/* Weather Insights */}
      <section className="bg-card rounded-xl p-4 border border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-primary" />
            Weather Insights
          </h2>
          {weather && (
            <span className="text-xs text-muted-foreground">
              {weather.current.location}, {weather.current.country}
            </span>
          )}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : weather ? (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Thermometer className="w-5 h-5 mx-auto text-primary mb-1" />
                <p className="text-xs text-muted-foreground">Temperature</p>
                <p className="font-semibold">{weather.current.temperature}°C</p>
                <p className="text-xs text-muted-foreground">Feels {weather.current.feels_like}°C</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Droplets className="w-5 h-5 mx-auto text-primary mb-1" />
                <p className="text-xs text-muted-foreground">Humidity</p>
                <p className="font-semibold">{weather.current.humidity}%</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Eye className="w-5 h-5 mx-auto text-primary mb-1" />
                <p className="text-xs text-muted-foreground">Visibility</p>
                <p className="font-semibold">{weather.current.visibility} km</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Gauge className="w-5 h-5 mx-auto text-primary mb-1" />
                <p className="text-xs text-muted-foreground">Pressure</p>
                <p className="font-semibold">{weather.current.pressure} hPa</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Cloud className="w-5 h-5 mx-auto text-primary mb-1" />
                <p className="text-xs text-muted-foreground">Cloud Cover</p>
                <p className="font-semibold">{weather.current.clouds}%</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Wind className="w-5 h-5 mx-auto text-primary mb-1" />
                <p className="text-xs text-muted-foreground">Wind</p>
                <p className="font-semibold">{weather.current.wind_speed} km/h</p>
              </div>
            </div>

            {/* Weather Description */}
            <div className="mt-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-foreground flex items-center gap-2 capitalize">
                <WeatherIconComponent className="w-4 h-4 text-primary" />
                {weather.current.weather_description}
              </p>
            </div>

            {/* Warning if severe weather */}
            {(weather.current.weather.toLowerCase().includes('rain') || 
              weather.current.weather.toLowerCase().includes('storm') ||
              weather.current.weather.toLowerCase().includes('thunder') ||
              weather.current.wind_speed > 40) && (
              <div className="mt-3 p-3 bg-warning/10 rounded-lg border border-warning/20">
                <p className="text-sm text-warning-foreground flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  {weather.current.weather.toLowerCase().includes('thunder') 
                    ? 'Thunderstorm detected - seek shelter immediately'
                    : weather.current.weather.toLowerCase().includes('rain')
                    ? 'Rain in your area - be cautious while traveling'
                    : weather.current.wind_speed > 40
                    ? 'High winds detected - avoid open areas'
                    : 'Weather conditions require caution'}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            Unable to load weather data
          </div>
        )}
      </section>

      {/* 5-Day Forecast */}
      {weather && weather.forecast.length > 0 && (
        <section className="bg-card rounded-xl p-4 border border-border">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-primary" />
            Forecast
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {weather.forecast.map((day, index) => {
              const ForecastIcon = getWeatherIcon(day.weather);
              const date = new Date(day.date * 1000);
              return (
                <div key={index} className="flex-shrink-0 text-center p-3 bg-muted/50 rounded-lg min-w-[80px]">
                  <p className="text-xs text-muted-foreground mb-1">
                    {index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <ForecastIcon className="w-6 h-6 mx-auto text-primary mb-1" />
                  <p className="text-xs font-medium">{day.temp_max}°</p>
                  <p className="text-xs text-muted-foreground">{day.temp_min}°</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

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
            { time: "Just now", event: weather ? `Weather: ${weather.current.weather_description}` : "Fetching weather...", type: "info" },
            { time: "2 min ago", event: "Location synced", type: "success" },
            { time: "15 min ago", event: "Weather data refreshed", type: "info" },
            { time: "1 hr ago", event: "Emergency contact verified", type: "success" },
            { time: "2 hr ago", event: "Shelter locations updated", type: "info" },
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
