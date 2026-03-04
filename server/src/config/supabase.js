import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';

dotenv.config(); // Load your .env file

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SERVICE_KEY

// Create the single instance
export const supabase = createClient(supabaseUrl, supabaseKey)