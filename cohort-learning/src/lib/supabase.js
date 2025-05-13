import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://amhluyzcttjogagmlzce.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtaGx1eXpjdHRqb2dhZ21semNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNTI4NjUsImV4cCI6MjA2MjcyODg2NX0.JbjvolvTn_Yq-t94XFJpxpeU69QM2PhWlNw2xm6v-Io'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
