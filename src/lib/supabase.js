import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-supabase-project') &&
    !supabaseAnonKey.includes('your-anon-key')
);

if (!isSupabaseConfigured) {
  console.warn(
    '⚠️ Supabase configuration is missing or placeholder. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

// Initialize Supabase Client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to log system events into DB or local storage
export const logSystemAction = async (userId, action, details = {}) => {
  try {
    if (supabase) {
      await supabase.from('system_logs').insert([
        {
          user_id: userId,
          action,
          details
        }
      ]);
    }
  } catch (err) {
    console.error('Failed to log system action:', err);
  }
};

// Helper for file uploads (Supabase Storage bucket: 'materials')
export const uploadMaterialFile = async (file, pathPrefix = 'uploads') => {
  if (!file) return null;

  if (isSupabaseConfigured && supabase) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${pathPrefix}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('materials')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('materials')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } else {
    // Fallback: Create Object URL or Data URL for preview mode
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }
};
