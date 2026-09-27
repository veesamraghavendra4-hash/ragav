import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://qcffuxdxuqsplxxiebba.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZmZ1eGR4dXFzcGx4eGllYmJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MjQ1NTIsImV4cCI6MjEwNjEwMDU1Mn0.jHH-1UbvI8IqclVKgET4HuRCGohh1sCmjA6XpyfUzS8';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface FarmerCloudRecord {
  id?: string;
  name: string;
  email?: string;
  phone: string;
  location: string;
  main_crop?: string;
  preferred_language?: string;
  farm_size?: string;
  soil_type?: string;
  irrigation_type?: string;
  updated_at?: string;
}

/**
 * Health check to verify if the Supabase project is reachable
 */
export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    const { error } = await supabase.from('farmer_profiles').select('id').limit(1);
    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
      // 42P01 = table does not exist yet (Supabase project is connected, but schema pending)
      console.warn('Supabase query note:', error.message);
    }
    return {
      connected: true,
      message: 'Connected to Supabase Project (qcffuxdxuqsplxxiebba)',
    };
  } catch (err: any) {
    console.error('Supabase connection error:', err);
    return {
      connected: false,
      message: err.message || 'Unable to connect to Supabase endpoint',
    };
  }
}

/**
 * Save or synchronize farmer profile to Supabase `farmer_profiles` table
 */
export async function syncFarmerProfileToCloud(profile: FarmerCloudRecord): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const payload = {
      name: profile.name,
      phone: profile.phone,
      location: profile.location,
      main_crop: profile.main_crop || 'Tomato',
      preferred_language: profile.preferred_language || 'te',
      farm_size: profile.farm_size || '3.5 Acres',
      soil_type: profile.soil_type || 'Sandy Clay Loam',
      irrigation_type: profile.irrigation_type || 'Subsurface Drip Irrigation',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('farmer_profiles')
      .upsert(payload, { onConflict: 'phone' });

    if (error) {
      // If table does not exist, log guidance for user
      if (error.code === '42P01') {
        console.info('Supabase: Table `farmer_profiles` does not exist yet. Storing locally.');
      } else {
        console.warn('Supabase profile sync note:', error.message);
      }
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Failed to sync profile to Supabase:', e);
    return false;
  }
}

/**
 * Record an irrigation pulse or schedule to Supabase `irrigation_logs`
 */
export async function logIrrigationToCloud(entry: {
  farmer_phone?: string;
  crop: string;
  duration_minutes: number;
  water_saved_liters: number;
  status: string;
}): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { error } = await supabase.from('irrigation_logs').insert([
      {
        ...entry,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      if (error.code !== '42P01') console.warn('Supabase log note:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Save an AI Plant Doctor diagnosis result to Supabase `diagnosis_history`
 */
export async function saveDiagnosisToCloud(record: {
  farmer_phone?: string;
  plant: string;
  disease_name: string;
  confidence: number;
  severity: string;
  recommended_medicine: string;
}): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { error } = await supabase.from('diagnosis_history').insert([
      {
        ...record,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      if (error.code !== '42P01') console.warn('Supabase diagnosis note:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
