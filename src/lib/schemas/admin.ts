import { z } from 'zod'

export const userRoleSchema = z.enum([
  'CUSTOMER', 'BREEDER', 'INDIVIDUAL_SELLER', 'VET',
  'ADOPTION_PROVIDER', 'GROOMER', 'PET_TRAINER', 'TRANSPORTER',
  'SUPER_ADMIN', 'ADMIN', 'MARKETPLACE_STAFF', 'PARENT', 'SELLER'
])

export const updateUserSchema = z.object({
  full_name: z.string().min(1, 'Name is required').max(100),
  contact_email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  role: userRoleSchema,
  is_verified: z.boolean(),
  verification_status: z.string().optional(),
})

export const banUserSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().min(1, 'Reason is required'),
  durationDays: z.number().int().min(1).max(365).optional(),
})

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  brand: z.string().optional(),
  category: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  stock_quantity: z.number().int().min(0),
  seller_id: z.string().uuid().optional(),
  details: z.record(z.any()).optional(),
})

export const listingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  species: z.enum(['Dog', 'Cat', 'Bird', 'Fish', 'Small Pet', 'Reptile']),
  breed: z.string().optional(),
  sex: z.enum(['Male', 'Female']).optional(),
  age: z.string().optional(),
  price: z.number().positive(),
  seller_id: z.string().uuid().optional(),
  type: z.enum(['Buy', 'Adopt', 'Rehome']),
  status: z.enum(['Available', 'Pending', 'Sold']).optional(),
  certification_tier: z.enum(['Gold', 'Silver', 'Verified', 'Shelter']).optional(),
  image_url: z.string().url().optional(),
})

export const orderStatusSchema = z.enum([
  'Processing', 'In Transit', 'Delivered', 'Cancelled'
])

export const hospitalSchema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  license_number: z.string().optional(),
  admin_id: z.string().uuid().optional(),
  is_verified: z.boolean().optional(),
})

export const adoptionCenterSchema = z.object({
  name: z.string().min(1),
  type: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  license_number: z.string().optional(),
  owner_id: z.string().uuid().optional(),
  is_verified: z.boolean().optional(),
})

export const postSchema = z.object({
  title: z.string().max(200).optional().nullable(),
  content: z.string().optional().nullable(),
  type: z.string().optional(),
  is_approved: z.boolean().optional(),
  is_pinned: z.boolean().optional(),
})

export const moderationActionSchema = z.object({
  itemId: z.string().uuid(),
  action: z.enum(['dismiss', 'review', 'remove']),
  notes: z.string().optional(),
})

export const verificationActionSchema = z.object({
  sellerId: z.string().uuid(),
  status: z.enum(['approved', 'rejected']),
  tier: z.enum(['Gold', 'Silver', 'Verified', 'Shelter']).optional(),
  notes: z.string().optional(),
})