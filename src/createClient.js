import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ozlxtwgypizcyiioxbqh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96bHh0d2d5cGl6Y3lpaW94YnFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMyNDkzMzUsImV4cCI6MjAyODgyNTMzNX0.AkKTVQbMOJpGdOOvN_h1rmLUaxANNyQPmSyP_vZ_72k";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
