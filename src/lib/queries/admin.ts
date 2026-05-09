import { createClient } from '@/lib/supabase/server'

export interface UserFilters {
  role?: string
  status?: 'active' | 'banned' | 'pending'
  search?: string
  verified?: boolean
}

export interface AuditFilters {
  actor_id?: string
  action?: string
  target_type?: string
  date_from?: string
  date_to?: string
}

export interface Pagination {
  page: number
  per_page: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export async function getUsers(
  filters: UserFilters = {},
  pagination: Pagination = { page: 1, per_page: 25 }
) {
  const supabase = await createClient()

  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })

  if (filters.role) {
    query = query.eq('role', filters.role)
  }

  if (filters.verified !== undefined) {
    query = query.eq('is_verified', filters.verified)
  }

  if (filters.status === 'banned') {
    query = query.lte('banned_until', new Date().toISOString())
  } else if (filters.status === 'active') {
    query = query.or(`banned_until.is.null,banned_until.gt.${new Date().toISOString()}`)
  }

  if (filters.search) {
    query = query.or(`full_name.ilike.%${filters.search}%,contact_email.ilike.%${filters.search}%`)
  }

  const { page, per_page } = pagination
  const from = (page - 1) * per_page
  const to = from + per_page - 1

  const { data, error, count } = await query
    .range(from, to)
    .order('created_at', { ascending: false })

  if (error) return { data: [], total: 0, error: error.message }

  return {
    data,
    total: count || 0,
    page,
    per_page,
    total_pages: Math.ceil((count || 0) / per_page)
  }
}

export async function getPendingVerifications() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      seller_verifications (
        id,
        status,
        tier,
        reviewed_at
      )
    `)
    .eq('verification_status', 'pending')
    .order('created_at', { ascending: false })

  if (error) return { data: [], error: error.message }
  return { data, error: null }
}

export async function getModerationQueue(status: string = 'pending') {
  const supabase = await createClient()

  let query = supabase
    .from('moderation_queue')
    .select(`
      *,
      flagged_by_profile:profiles!flagged_by (
        full_name,
        contact_email
      )
    `)

  if (status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })

  if (error) return { data: [], error: error.message }
  return { data, error: null }
}

export async function getAuditLogs(
  filters: AuditFilters = {},
  pagination: Pagination = { page: 1, per_page: 50 }
) {
  const supabase = await createClient()

  let query = supabase
    .from('audit_logs')
    .select('*', { count: 'exact' })

  if (filters.actor_id) {
    query = query.eq('actor_id', filters.actor_id)
  }

  if (filters.action) {
    query = query.eq('action', filters.action)
  }

  if (filters.target_type) {
    query = query.eq('target_type', filters.target_type)
  }

  if (filters.date_from) {
    query = query.gte('created_at', filters.date_from)
  }

  if (filters.date_to) {
    query = query.lte('created_at', filters.date_to)
  }

  const { page, per_page } = pagination
  const from = (page - 1) * per_page
  const to = from + per_page - 1

  const { data, error, count } = await query
    .range(from, to)
    .order('created_at', { ascending: false })

  if (error) return { data: [], total: 0, error: error.message }

  return {
    data,
    total: count || 0,
    page,
    per_page,
    total_pages: Math.ceil((count || 0) / per_page)
  }
}

export async function getAnalyticsDashboard() {
  const supabase = await createClient()

  const now = new Date()
  const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: usersToday } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfDay)

  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })

  const { count: ordersToday } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfDay)

  const { count: pendingVerifications } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('verification_status', 'pending')

  const { count: openModeration } = await supabase
    .from('moderation_queue')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  return {
    totalUsers: totalUsers || 0,
    usersToday: usersToday || 0,
    totalOrders: totalOrders || 0,
    ordersToday: ordersToday || 0,
    pendingVerifications: pendingVerifications || 0,
    openModeration: openModeration || 0
  }
}

export async function getHospitals() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('hospitals')
    .select(`
      *,
      hospital_vets (
        vet_id,
        vet:profiles!hospital_vets_vet_id_fkey (
          full_name,
          contact_email
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) return { data: [], error: error.message }
  return { data, error: null }
}

export async function getAdoptionCenters() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('adoption_centers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return { data: [], error: error.message }
  return { data, error: null }
}

export async function getServiceProviders(type?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('service_provider_details')
    .select(`
      *,
      profile:profiles!service_provider_details_profile_id_fkey (
        id,
        full_name,
        contact_email,
        is_verified,
        verification_status
      )
    `)

  if (type) {
    query = query.eq('service_type', type)
  }

  const { data, error } = await query

  if (error) return { data: [], error: error.message }
  return { data, error: null }
}

export async function getCommunityPosts(filters: { type?: string; approved?: boolean } = {}) {
  const supabase = await createClient()

  let query = supabase
    .from('community_posts')
    .select(`
      *,
      author:profiles!community_posts_author_id_fkey (
        full_name,
        avatar_url
      ),
      community_comments (
        id
      )
    `, { count: 'exact' })

  if (filters.type) {
    query = query.eq('type', filters.type)
  }

  if (filters.approved !== undefined) {
    query = query.eq('is_approved', filters.approved)
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })

  if (error) return { data: [], total: 0, error: error.message }
  return { data, total: count || 0, error: null }
}