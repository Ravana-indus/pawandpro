ALTER TABLE public.order_items 
ADD COLUMN pet_listing_id UUID REFERENCES public.pet_listings(id) ON DELETE SET NULL;
