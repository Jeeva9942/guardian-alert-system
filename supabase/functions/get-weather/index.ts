import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENWEATHER_API_KEY = 'e6ab33f5495e15dd65899f39a940c47e';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude } = await req.json();
    
    if (!latitude || !longitude) {
      return new Response(
        JSON.stringify({ error: 'Latitude and longitude are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching weather for coordinates: ${latitude}, ${longitude}`);

    // Fetch current weather
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    if (!weatherResponse.ok) {
      throw new Error(`Weather API error: ${weatherResponse.status}`);
    }
    
    const weatherData = await weatherResponse.json();

    // Fetch weather alerts using One Call API 3.0
    const oneCallResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&exclude=minutely,hourly`
    );

    let alerts: any[] = [];
    let forecast: any[] = [];
    
    if (oneCallResponse.ok) {
      const oneCallData = await oneCallResponse.json();
      alerts = oneCallData.alerts || [];
      forecast = oneCallData.daily?.slice(0, 5) || [];
    } else {
      // Fallback to 5-day forecast API
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&cnt=8`
      );
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        forecast = forecastData.list || [];
      }
    }

    // Construct response
    const response = {
      current: {
        temperature: Math.round(weatherData.main.temp),
        feels_like: Math.round(weatherData.main.feels_like),
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        visibility: Math.round((weatherData.visibility || 10000) / 1000),
        wind_speed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
        wind_direction: weatherData.wind.deg,
        weather: weatherData.weather[0].main,
        weather_description: weatherData.weather[0].description,
        weather_icon: weatherData.weather[0].icon,
        clouds: weatherData.clouds.all,
        location: weatherData.name,
        country: weatherData.sys.country,
        sunrise: weatherData.sys.sunrise,
        sunset: weatherData.sys.sunset,
      },
      alerts: alerts.map((alert: any) => ({
        event: alert.event,
        sender: alert.sender_name,
        start: alert.start,
        end: alert.end,
        description: alert.description,
        tags: alert.tags || [],
      })),
      forecast: forecast.slice(0, 5).map((day: any) => ({
        date: day.dt,
        temp_min: Math.round(day.temp?.min || day.main?.temp_min || day.main?.temp - 2),
        temp_max: Math.round(day.temp?.max || day.main?.temp_max || day.main?.temp + 2),
        weather: day.weather?.[0]?.main || 'Clear',
        weather_icon: day.weather?.[0]?.icon || '01d',
        humidity: day.humidity || day.main?.humidity,
        wind_speed: Math.round((day.wind_speed || day.wind?.speed || 0) * 3.6),
      })),
      timestamp: Date.now(),
    };

    console.log('Weather data fetched successfully:', response.current.location);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error fetching weather:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather data';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
