import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Use environment variables if available, fallback to direct values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://imrubrygajmjxqvoogyr.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltcnVicnlnYWptanhxdm9vZ3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMjc4NzIsImV4cCI6MjA2NjYwMzg3Mn0.KjcZuU5vvQRWfF0gH8GsB3bASVkapO8RfZFr2lkovls';

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };