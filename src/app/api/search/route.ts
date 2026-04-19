import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  try {
    const supabase = await createClient();

    // Use anon client for public search
    const [productsRes, petsRes, vetsRes] = await Promise.all([
      supabase.from('products').select('*').ilike('name', `%${q}%`).limit(5),
      supabase.from('pet_listings').select('*').ilike('name', `%${q}%`).limit(5),
      supabase.from('profiles').select('*, details:veterinarian_details(*)').eq('role', 'VET').ilike('full_name', `%${q}%`).limit(5)
    ]);

    const results = [
      ... ((productsRes.data as any[]) || []).map((p: any) => ({
        id: p.id,
        title: p.name,
        subtitle: p.category,
        image: p.details?.image,
        type: 'product',
        url: `/marketplace/product/${p.id}`
      })),
      ... ((petsRes.data as any[]) || []).map((p: any) => ({
        id: p.id,
        title: p.name,
        subtitle: `${p.breed || 'Mixed'} ${p.species}`,
        image: p.image_url,
        type: 'pet',
        url: `/breeders/pet/${p.id}`
      })),
      ... ((vetsRes.data as any[]) || []).map((v: any) => ({
        id: v.id,
        title: `Dr. ${v.full_name}`,
        subtitle: v.details?.[0]?.specialization || 'Veterinarian',
        image: v.avatar_url,
        type: 'vet',
        url: `/veterinary/profile/${v.id}`
      }))
    ];

    return NextResponse.json({ results });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
