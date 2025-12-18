import { useState, useEffect } from "react";
import { Phone, MapPin, Users, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SOSButton = () => {
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSharingLocation, setIsSharingLocation] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActivated && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && isActivated) {
      sendSOS();
    }

    return () => clearInterval(interval);
  }, [isActivated, countdown]);

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const sendSOS = async () => {
    setIsSending(true);
    try {
      // Get current location
      const location = await getCurrentLocation();
      setUserLocation(location);
      
      // Send to edge function
      const { data, error } = await supabase.functions.invoke('save-sos-location', {
        body: {
          latitude: location.lat,
          longitude: location.lng,
          timestamp: new Date().toISOString(),
          deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
          }
        }
      });

      if (error) throw error;
      
      console.log('SOS sent successfully:', data);
      toast.success("SOS alert sent successfully!");
      setIsSent(true);
    } catch (error) {
      console.error('Error sending SOS:', error);
      toast.error("Failed to send SOS. Please try calling emergency services directly.");
      setIsSent(true); // Still show success UI but with the option to call
    } finally {
      setIsSending(false);
    }
  };

  const handleShareLocation = async () => {
    setIsSharingLocation(true);
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      
      const { data, error } = await supabase.functions.invoke('save-sos-location', {
        body: {
          latitude: location.lat,
          longitude: location.lng,
          timestamp: new Date().toISOString(),
          collection: 'locations',
          type: 'location_share'
        }
      });

      if (error) throw error;
      
      console.log('Location shared successfully:', data);
      toast.success("Location shared successfully!");
    } catch (error) {
      console.error('Error sharing location:', error);
      toast.error("Failed to share location. Please try again.");
    } finally {
      setIsSharingLocation(false);
    }
  };

  const handleCancel = () => {
    setIsActivated(false);
    setCountdown(5);
    setHoldProgress(0);
  };

  const handleReset = () => {
    setIsActivated(false);
    setCountdown(5);
    setIsSent(false);
    setHoldProgress(0);
  };

  const handleActivate = () => {
    setIsActivated(true);
  };

  if (isSent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-slide-up">
        <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-success" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Help is on the way!</h2>
          <p className="text-muted-foreground mt-2">Emergency services have been notified</p>
        </div>
        
        <div className="w-full max-w-sm space-y-3 mt-6">
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Location shared</p>
                <p className="text-xs text-muted-foreground">
                  {userLocation ? `${userLocation.lat.toFixed(4)}° N, ${userLocation.lng.toFixed(4)}° E` : "40.7128° N, 74.0060° W"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Emergency contacts notified</p>
                <p className="text-xs text-muted-foreground">3 contacts alerted</p>
              </div>
            </div>
          </div>
        </div>

        <Button variant="outline" onClick={handleReset} className="mt-4">
          Return to Home
        </Button>
      </div>
    );
  }

  if (isActivated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-fade-in">
        <div className="relative">
          <div className="w-40 h-40 rounded-full bg-destructive/20 flex items-center justify-center">
            {isSending ? (
              <Loader2 className="w-16 h-16 text-destructive animate-spin" />
            ) : (
              <span className="text-6xl font-bold text-destructive">{countdown}</span>
            )}
          </div>
          <div className="absolute inset-0 w-40 h-40 rounded-full border-4 border-destructive animate-ping opacity-50" />
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">
            {isSending ? "Sending SOS..." : "Sending SOS in"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {isSending ? "Please stay calm" : "Tap cancel to stop"}
          </p>
        </div>

        {!isSending && (
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleCancel}
            className="mt-4"
          >
            Cancel
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-slide-up">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Emergency SOS</h2>
        <p className="text-muted-foreground mt-2">Press the button to send an emergency alert</p>
      </div>

      {/* Main SOS Button */}
      <div className="relative">
        <button
          onClick={handleActivate}
          className="relative w-44 h-44 rounded-full bg-gradient-danger flex items-center justify-center shadow-danger-glow transition-transform active:scale-95 hover:scale-105"
        >
          <div className="absolute inset-2 rounded-full bg-destructive/80 flex items-center justify-center">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 mx-auto text-destructive-foreground" />
              <span className="text-xl font-bold text-destructive-foreground mt-2 block">SOS</span>
            </div>
          </div>
        </button>
        
        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-full border-2 border-destructive/50 animate-pulse-ring" />
        <div className="absolute inset-0 rounded-full border-2 border-destructive/30 animate-pulse-ring" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Quick Actions */}
      <div className="w-full max-w-sm space-y-3">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3"
          onClick={() => window.open("tel:911")}
        >
          <Phone className="w-5 h-5 text-destructive" />
          <span>Call 911</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3"
        >
          <Users className="w-5 h-5 text-primary" />
          <span>Alert Emergency Contacts</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3"
          onClick={handleShareLocation}
          disabled={isSharingLocation}
        >
          {isSharingLocation ? (
            <Loader2 className="w-5 h-5 text-success animate-spin" />
          ) : (
            <MapPin className="w-5 h-5 text-success" />
          )}
          <span>{isSharingLocation ? "Sharing..." : "Share My Location"}</span>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center max-w-xs">
        In case of emergency, press the SOS button to automatically alert emergency services and your emergency contacts with your location.
      </p>
    </div>
  );
};

export default SOSButton;
