import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Checking exam_packages...");
  const { data: pkgs, error: err } = await supabase.from('exam_packages').select('*');
  console.log("Error:", err);
  console.log("Packages count:", pkgs ? pkgs.length : 0);
  if (pkgs && pkgs.length > 0) {
    console.log("First package:", pkgs[0]);
  }
}

check();
