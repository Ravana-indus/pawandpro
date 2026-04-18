-- RLS Policies

-- Profiles: Public read, owner update
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Pets: Owner CRUD, Vet Read
CREATE POLICY "Users can view own pets" 
  ON public.pets FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own pets" 
  ON public.pets FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own pets" 
  ON public.pets FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own pets" 
  ON public.pets FOR DELETE USING (auth.uid() = owner_id);

-- Vets can view pets they have appointments with
CREATE POLICY "Vets can view patient pets" 
  ON public.pets FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.appointments 
      WHERE appointments.pet_id = pets.id AND appointments.vet_id = auth.uid()
    )
  );

-- Products: Public read, Seller CRUD
CREATE POLICY "Products are viewable by everyone" 
  ON public.products FOR SELECT USING (true);

CREATE POLICY "Sellers can manage own products" 
  ON public.products FOR ALL USING (auth.uid() = seller_id);

-- Pet Listings: Public read, Seller CRUD
CREATE POLICY "Pet listings are viewable by everyone" 
  ON public.pet_listings FOR SELECT USING (true);

CREATE POLICY "Sellers can manage own pet listings" 
  ON public.pet_listings FOR ALL USING (auth.uid() = seller_id);

-- Veterinarian Details: Public read, Vet update
CREATE POLICY "Vet details are viewable by everyone" 
  ON public.veterinarian_details FOR SELECT USING (true);

CREATE POLICY "Vets can update own details" 
  ON public.veterinarian_details FOR UPDATE USING (auth.uid() = profile_id);

-- Appointments: Parent or Vet can view/update
CREATE POLICY "Involved parties can view appointments" 
  ON public.appointments FOR SELECT USING (auth.uid() = parent_id OR auth.uid() = vet_id);

CREATE POLICY "Parents can book appointments" 
  ON public.appointments FOR INSERT WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Involved parties can update appointments" 
  ON public.appointments FOR UPDATE USING (auth.uid() = parent_id OR auth.uid() = vet_id);

-- Orders: Buyer can view
CREATE POLICY "Buyers can view own orders" 
  ON public.orders FOR SELECT USING (auth.uid() = buyer_id);

-- Order Items: Buyer can view
CREATE POLICY "Buyers can view own order items" 
  ON public.order_items FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id AND orders.buyer_id = auth.uid()
    )
  );
