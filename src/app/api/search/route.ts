import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const supabase = await createClient();

    // Perform parallel searches
    const [productsRes, petsRes, vetsRes] = await Promise.all([
      supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(5),
      supabase
        .from('pet_listings')
        .select('*')
        .or(`name.ilike.%${query}%,breed.ilike.%${query}%,category.ilike.%${query}%`)
        .eq('status', 'Available')
        .limit(5),
      supabase
        .from('profiles')
        .select('*')
        .eq('role', 'VET')
        .or(`full_name.ilike.%${query}%,specialization.ilike.%${query}%`)
        .limit(5)
    ]);

    const results = [
      ... (productsRes.data || []).map(p => ({
        id: p.id,
        title: p.name,
        subtitle: p.category,
        image: (p.details as any)?.image,
        type: 'product',
        url: `/marketplace/product/${p.id}`
      })),
      ... (petsRes.data || []).map(p => ({
        id: p.id,
        title: p.name,
        subtitle: `${p.breed} • ${p.age}`,
        image: p.image_url,
        type: 'pet',
        url: `/breeders/pet/${p.id}`
      })),
      ... (vetsRes.data || []).map(v => ({
        id: v.id,
        title: v.full_name,
        subtitle: v.specialization,
        image: v.avatar_url,
        type: 'vet',
        url: `/veterinary/profile/${v.id}`
      }))
    ];

    return NextResponse.json({ results });

  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
