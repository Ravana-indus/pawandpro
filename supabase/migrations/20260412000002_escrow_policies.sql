-- Allow buyers to create orders
CREATE POLICY "Buyers can insert own orders" 
  ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Allow buyers to update pet listing status to 'Pending'
CREATE POLICY "Buyers can reserve pet listings" 
  ON public.pet_listings FOR UPDATE USING (status = 'Available') WITH CHECK (status = 'Pending');
