import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CurrentWeather {
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  visibility: number;
  wind_speed: number;
  wind_direction: number;
  weather: string;
  weather_description: string;
  weather_icon: string;
  clouds: number;
  location: string;
  country: string;
  sunrise: number;
  sunset: number;
}

interface WeatherAlert {
  event: string;
  sender: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
}

interface ForecastDay {
  date: number;
  temp_min: number;
  temp_max: number;
  weather: string;
  weather_icon: string;
  humidity: number;
  wind_speed: number;
}

interface WeatherData {
  current: CurrentWeather;
  alerts: WeatherAlert[];
  forecast: ForecastDay[];
  timestamp: number;
}

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.functions.invoke('get-weather', {
        body: { latitude: lat, longitude: lon }
      });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setWeather(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  }, []);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        fetchWeather(latitude, longitude);
      },
      (err) => {
        console.error('Geolocation error:', err);
        // Default to Mumbai, India if geolocation fails
        const defaultLat = 19.076;
        const defaultLon = 72.8777;
        setLocation({ latitude: defaultLat, longitude: defaultLon });
        fetchWeather(defaultLat, defaultLon);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, [fetchWeather]);

  const refresh = useCallback(() => {
    if (location) {
      fetchWeather(location.latitude, location.longitude);
    } else {
      getLocation();
    }
  }, [location, fetchWeather, getLocation]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return { weather, loading, error, refresh, location };
};
