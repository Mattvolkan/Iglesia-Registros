import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = 'https://kafcqbshsufdkwlnbysi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZmNxYnNoc3VmZGt3bG5ieXNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3MTMwNTYsImV4cCI6MjA0NzI4OTA1Nn0.mPaUGWn5tnsyR7zHRHodW7BYrZoGCdew2vFmQ8ZqwMw';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);