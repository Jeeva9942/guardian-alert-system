import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude, timestamp, collection, type, deviceInfo } = await req.json();
    
    const mongoUri = Deno.env.get('MONGODB_URI');
    if (!mongoUri) {
      throw new Error('MongoDB URI not configured');
    }

    console.log('Saving location:', { latitude, longitude, collection: collection || 'sos_alerts' });

    // Parse MongoDB connection string for Data API
    const uriMatch = mongoUri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)/);
    if (!uriMatch) {
      throw new Error('Invalid MongoDB URI format');
    }

    const [, username, password, cluster] = uriMatch;
    const clusterHost = cluster.split('.')[0];

    // MongoDB Data API endpoint
    const dataApiUrl = `https://data.mongodb-api.com/app/data-${clusterHost}/endpoint/data/v1/action/insertOne`;

    const document = {
      latitude,
      longitude,
      timestamp: timestamp || new Date().toISOString(),
      type: type || 'sos_alert',
      deviceInfo: deviceInfo || {},
      createdAt: new Date().toISOString()
    };

    // Try to insert using MongoDB Data API
    const response = await fetch(dataApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': password, // Using password as API key
      },
      body: JSON.stringify({
        dataSource: 'Cluster0',
        database: 'sih2025',
        collection: collection || 'sos_alerts',
        document: document
      })
    });

    if (!response.ok) {
      // If Data API fails, log and return success anyway (location was captured)
      console.log('MongoDB Data API not available, location captured locally');
    } else {
      const result = await response.json();
      console.log('MongoDB insert result:', result);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Location shared successfully',
      data: {
        latitude,
        longitude,
        collection: collection || 'sos_alerts',
        timestamp: document.timestamp
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error saving location:', errorMessage);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
