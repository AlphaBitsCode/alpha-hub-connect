
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pzsqfxqqnalaiunrzerw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6c3FmeHFxbmFsYWl1bnJ6ZXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MjE4MDAsImV4cCI6MjA1MTM5NzgwMH0.FvY3NEHLRhreKEUWg0kRFqckdZyMLSycQr7nTJfvIdg";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
