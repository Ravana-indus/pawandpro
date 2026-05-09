-- =============================================================================
-- PART A: Update existing table RLS policies with admin/staff override
-- =============================================================================

-- profiles: Add admin override
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles"
  ON public.profiles FOR ALL
  USING (private.is_admin());

DROP POLICY IF EXISTS "Marketplace staff can view all profiles" ON public.profiles;
CREATE POLICY "Marketplace staff can view all profiles"
  ON public.profiles FOR SELECT
  USING (private.is_marketplace_staff());

-- pets: Add admin override for support visibility
DROP POLICY IF EXISTS "Admins can view all pets" ON public.pets;
CREATE POLICY "Admins can view all pets"
  ON public.pets FOR SELECT
  USING (private.is_admin());

DROP POLICY IF EXISTS "Staff can manage pets for moderation" ON public.pets;
CREATE POLICY "Staff can manage pets for moderation"
  ON public.pets FOR ALL
  USING (private.has_permission('manage_marketplace'));

-- products: Add staff moderate policy
DROP POLICY IF EXISTS "Staff can moderate products" ON public.products;
CREATE POLICY "Staff can moderate products"
  ON public.products FOR ALL
  USING (private.has_permission('manage_marketplace'));

-- pet_listings: Add staff moderate policy
DROP POLICY IF EXISTS "Staff can moderate listings" ON public.pet_listings;
CREATE POLICY "Staff can moderate listings"
  ON public.pet_listings FOR ALL
  USING (private.has_permission('moderate_content'));

-- orders: Add admin/staff view
DROP POLICY IF EXISTS "Staff can view all orders" ON public.orders;
CREATE POLICY "Staff can view all orders"
  ON public.orders FOR SELECT
  USING (private.is_marketplace_staff());

DROP POLICY IF EXISTS "Staff can manage orders" ON public.orders;
CREATE POLICY "Staff can manage orders"
  ON public.orders FOR UPDATE
  USING (private.has_permission('manage_marketplace'));

-- order_items: Staff can view
DROP POLICY IF EXISTS "Staff can view all order items" ON public.order_items;
CREATE POLICY "Staff can view all order items"
  ON public.order_items FOR SELECT
  USING (private.is_marketplace_staff());

-- appointments: Staff can view (keep for backward compat)
DROP POLICY IF EXISTS "Staff can view all appointments" ON public.appointments;
CREATE POLICY "Staff can view all appointments"
  ON public.appointments FOR SELECT
  USING (private.is_marketplace_staff());

-- =============================================================================
-- PART B: Add RLS policies to new tables
-- =============================================================================

-- hospitals: Admin full access, public read verified
DROP POLICY IF EXISTS "Hospitals viewable by everyone" ON public.hospitals;
CREATE POLICY "Hospitals viewable by everyone"
  ON public.hospitals FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage hospitals" ON public.hospitals;
CREATE POLICY "Admins can manage hospitals"
  ON public.hospitals FOR ALL
  USING (private.is_admin());

-- hospital_vets: Admin full access
DROP POLICY IF EXISTS "Admins can manage hospital_vets" ON public.hospital_vets;
CREATE POLICY "Admins can manage hospital_vets"
  ON public.hospital_vets FOR ALL
  USING (private.is_admin());

-- adoption_centers: Admin full access, owner CRUD, public read
DROP POLICY IF EXISTS "Adoption centers viewable by everyone" ON public.adoption_centers;
CREATE POLICY "Adoption centers viewable by everyone"
  ON public.adoption_centers FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Adoption center owners can manage own" ON public.adoption_centers;
CREATE POLICY "Adoption center owners can manage own"
  ON public.adoption_centers FOR ALL
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Admins can manage adoption centers" ON public.adoption_centers;
CREATE POLICY "Admins can manage adoption centers"
  ON public.adoption_centers FOR ALL
  USING (private.is_admin());

-- seller_verifications: Admin/staff full access, seller view own
DROP POLICY IF EXISTS "Sellers can view own verifications" ON public.seller_verifications;
CREATE POLICY "Sellers can view own verifications"
  ON public.seller_verifications FOR SELECT
  USING (auth.uid() = seller_id OR private.has_permission('verify_sellers'));

DROP POLICY IF EXISTS "Staff can manage verifications" ON public.seller_verifications;
CREATE POLICY "Staff can manage verifications"
  ON public.seller_verifications FOR ALL
  USING (private.has_permission('verify_sellers'));

-- service_provider_details: Public read, provider update own, admin full
DROP POLICY IF EXISTS "Service providers viewable by everyone" ON public.service_provider_details;
CREATE POLICY "Service providers viewable by everyone"
  ON public.service_provider_details FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Providers can update own details" ON public.service_provider_details;
CREATE POLICY "Providers can update own details"
  ON public.service_provider_details FOR UPDATE
  USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Admins can manage service providers" ON public.service_provider_details;
CREATE POLICY "Admins can manage service providers"
  ON public.service_provider_details FOR ALL
  USING (private.is_admin());

-- service_bookings: Involved parties + admin/staff
DROP POLICY IF EXISTS "Service bookings viewable by involved parties and staff" ON public.service_bookings;
CREATE POLICY "Service bookings viewable by involved parties and staff"
  ON public.service_bookings FOR SELECT
  USING (auth.uid() = customer_id OR auth.uid() = provider_id OR private.is_marketplace_staff());

DROP POLICY IF EXISTS "Service bookings insertable by customers" ON public.service_bookings;
CREATE POLICY "Service bookings insertable by customers"
  ON public.service_bookings FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Service bookings updatable by involved parties and staff" ON public.service_bookings;
CREATE POLICY "Service bookings updatable by involved parties and staff"
  ON public.service_bookings FOR UPDATE
  USING (auth.uid() = customer_id OR auth.uid() = provider_id OR private.is_marketplace_staff());

-- community_posts: Public read approved, author CRUD, admin full
DROP POLICY IF EXISTS "Community posts viewable by everyone" ON public.community_posts;
CREATE POLICY "Community posts viewable by everyone"
  ON public.community_posts FOR SELECT
  USING (is_approved = true OR auth.uid() = author_id OR private.is_admin());

DROP POLICY IF EXISTS "Authors can manage own posts" ON public.community_posts;
CREATE POLICY "Authors can manage own posts"
  ON public.community_posts FOR ALL
  USING (auth.uid() = author_id OR private.is_admin());

-- community_comments: Similar pattern
DROP POLICY IF EXISTS "Community comments viewable by everyone" ON public.community_comments;
CREATE POLICY "Community comments viewable by everyone"
  ON public.community_comments FOR SELECT
  USING (is_approved = true OR auth.uid() = author_id OR private.is_admin());

DROP POLICY IF EXISTS "Authors can manage own comments" ON public.community_comments;
CREATE POLICY "Authors can manage own comments"
  ON public.community_comments FOR ALL
  USING (auth.uid() = author_id OR private.is_admin());

-- moderation_queue: Admin/staff full access
DROP POLICY IF EXISTS "Staff can manage moderation queue" ON public.moderation_queue;
CREATE POLICY "Staff can manage moderation queue"
  ON public.moderation_queue FOR ALL
  USING (private.has_permission('moderate_content'));