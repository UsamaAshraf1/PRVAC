// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = "https://extxevnaptlabayxqmzh.supabase.co/"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4dHhldm5hcHRsYWJheXhxbXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NTYzMjUsImV4cCI6MjA5MjMzMjMyNX0.3RlVVA26q8jKAKM7dEPVS_0uoLFEzh3Bzlp1B-jCQ3U"

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)