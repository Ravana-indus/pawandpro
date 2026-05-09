import { createServerClient } from '@supabase/ssr'
import { Database } from './src/types/supabase'

const client = createServerClient<Database>('url', 'key', {
  cookies: {
    getAll() { return [] },
    setAll() {}
  }
})

async function test() {
  const { data } = await client.from('orders').select('*')
  const { data: data2 } = await client.from('pet_listings').select('*')
}
