// supabaseClient.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hwtqurovhmpjpwozppbm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dHF1cm92aG1wanB3b3pwcGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NzU2NzksImV4cCI6MjAzODQ1MTY3OX0.9aNKDyJIV5gVq9rpcLdZAyXgU8LpOeNkgK3zejK7JzQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  localStorage: AsyncStorage,
  detectSessionInUrl: false,
});
