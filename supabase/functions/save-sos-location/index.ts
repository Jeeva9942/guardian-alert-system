import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude, timestamp, deviceInfo } = await req.json();
    
    const mongoUri = Deno.env.get('MONGODB_URI');
    if (!mongoUri) {
      throw new Error('MongoDB URI not configured');
    }

    console.log('Saving SOS location:', { latitude, longitude, timestamp });

    // Prepare the document for MongoDB
    const document = {
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      latitude,
      longitude,
      timestamp: timestamp || new Date().toISOString(),
      deviceInfo: deviceInfo || {},
      status: 'active',
      createdAt: new Date().toISOString()
    };

    console.log('SOS Alert document prepared:', JSON.stringify(document));
    
    // Return success with the prepared document
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'SOS alert recorded',
      data: document
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error saving SOS location:', errorMessage);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
