import { supabase } from './supabase';
import type { Profile, Wallet, Transaction, Order, PromoCode, ContactMessage } from './database.types';

// ============================================
// PROFILE API
// ============================================
export const profileApi = {
  get: async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  },

  update: async (userId: string, updates: Partial<Profile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    
    return { data, error };
  },

  getByReferralCode: async (code: string): Promise<Profile | null> => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('referral_code', code)
      .single();
    
    return data;
  }
};

// ============================================
// WALLET API
// ============================================
export const walletApi = {
  get: async (userId: string): Promise<Wallet | null> => {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching wallet:', error);
      return null;
    }
    return data;
  },

  addFunds: async (userId: string, amount: number, paymentMethod: string, bonus: number = 0) => {
    const totalAmount = amount + bonus;
    
    // Create transaction
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'deposit',
        amount: totalAmount,
        payment_method: paymentMethod,
        status: 'completed',
        description: bonus > 0 ? `Deposit $${amount} + Bonus $${bonus.toFixed(2)}` : `Deposit $${amount}`,
        metadata: { base_amount: amount, bonus_amount: bonus }
      })
      .select()
      .single();
    
    return { data: transaction, error };
  },

  deductFunds: async (userId: string, amount: number, orderId: string) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'order_payment',
        amount: amount,
        status: 'completed',
        reference_id: orderId,
        description: `Payment for order`
      })
      .select()
      .single();
    
    return { data, error };
  }
};

// ============================================
// TRANSACTIONS API
// ============================================
export const transactionApi = {
  getAll: async (userId: string): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
    return data || [];
  },

  getRecent: async (userId: string, limit: number = 10): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) return [];
    return data || [];
  }
};

// ============================================
// ORDERS API
// ============================================
export const orderApi = {
  create: async (orderData: {
    user_id: string;
    platform: string;
    service: string;
    target_url: string;
    urgency: 'standard' | 'priority' | 'urgent';
    base_price: number;
    discount_percent: number;
    final_price: number;
    currency: string;
    notes?: string;
  }): Promise<{ data: Order | null; error: any }> => {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();
    
    return { data, error };
  },

  getAll: async (userId: string): Promise<Order[]> => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
    return data || [];
  },

  getById: async (orderId: string): Promise<Order | null> => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    
    if (error) return null;
    return data;
  },

  getByOrderNumber: async (orderNumber: string): Promise<Order | null> => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single();
    
    return data;
  },

  cancel: async (orderId: string) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();
    
    return { data, error };
  }
};

// ============================================
// PROMO CODES API
// ============================================
export const promoApi = {
  validate: async (code: string, userId: string): Promise<{ valid: boolean; promo: PromoCode | null; error?: string }> => {
    // Get promo code
    const { data: promo } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();
    
    if (!promo) {
      return { valid: false, promo: null, error: 'Invalid promo code' };
    }

    // Check if expired
    if (promo.valid_until && new Date(promo.valid_until) < new Date()) {
      return { valid: false, promo: null, error: 'Promo code has expired' };
    }

    // Check max uses
    if (promo.max_uses && promo.used_count >= promo.max_uses) {
      return { valid: false, promo: null, error: 'Promo code usage limit reached' };
    }

    // Check if user already used
    const { data: usage } = await supabase
      .from('promo_code_usage')
      .select('id')
      .eq('promo_code_id', promo.id)
      .eq('user_id', userId)
      .single();
    
    if (usage) {
      return { valid: false, promo: null, error: 'You have already used this promo code' };
    }

    return { valid: true, promo };
  },

  use: async (promoId: string, userId: string, orderId: string) => {
    // Record usage
    await supabase.from('promo_code_usage').insert({
      promo_code_id: promoId,
      user_id: userId,
      order_id: orderId
    });

    // Increment used count
    await supabase.rpc('increment_promo_usage', { promo_id: promoId });
  }
};

// ============================================
// CONTACT API
// ============================================
export const contactApi = {
  send: async (message: {
    user_id?: string;
    name: string;
    email: string;
    subject?: string;
    message: string;
    urgency?: 'low' | 'normal' | 'high' | 'critical';
  }): Promise<{ data: ContactMessage | null; error: any }> => {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert(message)
      .select()
      .single();
    
    return { data, error };
  },

  getMyMessages: async (userId: string): Promise<ContactMessage[]> => {
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return data || [];
  }
};

// ============================================
// REFERRAL API
// ============================================
export const referralApi = {
  applyReferralCode: async (referralCode: string, newUserId: string) => {
    // Find referrer
    const referrer = await profileApi.getByReferralCode(referralCode);
    if (!referrer) return { error: 'Invalid referral code' };

    // Update new user's referred_by
    await supabase
      .from('profiles')
      .update({ referred_by: referrer.id })
      .eq('id', newUserId);

    // Create referral record
    const { error } = await supabase.from('referrals').insert({
      referrer_id: referrer.id,
      referred_id: newUserId,
      referral_code: referralCode,
      status: 'pending'
    });

    return { error };
  },

  getMyReferrals: async (userId: string) => {
    const { data } = await supabase
      .from('referrals')
      .select(`
        *,
        referred:profiles!referred_id(email, full_name, created_at)
      `)
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false });
    
    return data || [];
  },

  creditReferralBonus: async (referralId: string, amount: number) => {
    const { data: referral } = await supabase
      .from('referrals')
      .select('*')
      .eq('id', referralId)
      .single();
    
    if (!referral) return { error: 'Referral not found' };

    // Add bonus to referrer's wallet
    await supabase.from('transactions').insert({
      user_id: referral.referrer_id,
      type: 'referral_bonus',
      amount: amount,
      status: 'completed',
      description: 'Referral bonus'
    });

    // Update referral status
    await supabase
      .from('referrals')
      .update({ 
        status: 'credited', 
        bonus_amount: amount,
        credited_at: new Date().toISOString()
      })
      .eq('id', referralId);

    return { success: true };
  }
};
