import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tvvlrhqaafeaknlzeral.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2dmxyaHFhYWZlYWtubHplcmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk5OTUwNjcsImV4cCI6MjA0NTU3MTA2N30.GLKz4hg_ocl4f0w7jshf3WPVZt9CegaeZ_aHeumNSNA'; // Use environment variable for security
 
if (!supabaseKey) {
    console.error("Supabase key is not set.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// // Testing Supabase Client
// console.log("Supabase initialized:", supabase);
