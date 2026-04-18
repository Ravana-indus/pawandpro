import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'kichukapp@gmail.com',
    password: 'Thenewpass1!'
  });
  if (error) { console.error('Login error:', error); return; }
  console.log('Logged in as:', data.user.id);
  
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({ buyer_id: data.user.id, total_amount: 100, status: 'Processing' })
    .select().single();
  console.log('Order error:', orderError);
}

test();
