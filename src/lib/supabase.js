import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://xdnbvysxfoxiwvbfoizs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkbmJ2eXN4Zm94aXd2YmZvaXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODQ4NTEsImV4cCI6MjA5Mzk2MDg1MX0.4sEfbQo5jOmkb_AIN4tuTP5BLeU2XjXR74G_sxL7fa0'
)
