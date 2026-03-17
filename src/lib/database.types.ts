export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  telegram_username: string | null;
  is_verified: boolean;
  referral_code: string | null;
  referred_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  total_deposited: number;
  total_spent: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'order_payment' | 'refund' | 'bonus' | 'referral_bonus';
  amount: number;
  payment_method: string | null;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  reference_id: string | null;
  description: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  platform: string;
  service: string;
  target_url: string;
  urgency: 'standard' | 'priority' | 'urgent';
  status: 'pending' | 'processing' | 'in_progress' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  base_price: number;
  discount_percent: number;
  final_price: number;
  currency: string;
  notes: string | null;
  admin_notes: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  max_uses: number | null;
  used_count: number;
  min_order_amount: number;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  urgency: 'low' | 'normal' | 'high' | 'critical';
  status: 'new' | 'read' | 'replied' | 'resolved' | 'spam';
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string | null;
  order_id: string | null;
  rating: number;
  review_text: string | null;
  platform: string | null;
  service: string | null;
  is_verified: boolean;
  is_visible: boolean;
  admin_response: string | null;
  helpful_count: number;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  bonus_amount: number;
  status: 'pending' | 'credited' | 'expired';
  created_at: string;
  credited_at: string | null;
}
