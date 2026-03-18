import { supabase } from './supabase';
import type { Profile, Wallet, Transaction, Order, PromoCode } from './database.types';

// ============================================
// ADMIN CHECK - ONLY THIS EMAIL IS ADMIN
// ============================================
const ADMIN_EMAILS = ['kronoscontrolofficial@gmail.com'];

export const isAdmin = async (userId: string): Promise<boolean> => {
  const { data } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', userId)
    .single();
  
  return ADMIN_EMAILS.includes(data?.email?.toLowerCase() || '');
};

// ============================================
// ADMIN ORDERS API
// ============================================
export const adminOrdersApi = {
  getAll: async (): Promise<Order[]> => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
    return data || [];
  },

  getByStatus: async (status: string): Promise<Order[]> => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    return data || [];
  },

  updateStatus: async (orderId: string, status: string, adminNotes?: string) => {
    const updates: any = { 
      status, 
      updated_at: new Date().toISOString() 
    };
    
    if (status === 'processing' || status === 'in_progress') {
      updates.started_at = new Date().toISOString();
    }
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }
    if (adminNotes !== undefined) {
      updates.admin_notes = adminNotes;
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();
    
    return { data, error };
  },

  refund: async (orderId: string) => {
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    
    if (!order) return { error: 'Order not found' };

    // Create refund transaction
    await supabase.from('transactions').insert({
      user_id: order.user_id,
      type: 'refund',
      amount: order.final_price,
      status: 'completed',
      reference_id: orderId,
      description: `Refund for order ${order.order_number}`
    });

    // Update order status
    await supabase
      .from('orders')
      .update({ status: 'refunded', updated_at: new Date().toISOString() })
      .eq('id', orderId);

    return { success: true };
  },

  delete: async (orderId: string) => {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);
    
    return { error };
  },

  getStats: async () => {
    const { data: orders } = await supabase.from('orders').select('status, final_price, created_at');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const stats = {
      total: orders?.length || 0,
      pending: orders?.filter(o => o.status === 'pending').length || 0,
      processing: orders?.filter(o => ['processing', 'in_progress'].includes(o.status)).length || 0,
      completed: orders?.filter(o => o.status === 'completed').length || 0,
      failed: orders?.filter(o => o.status === 'failed').length || 0,
      refunded: orders?.filter(o => o.status === 'refunded').length || 0,
      todayOrders: orders?.filter(o => new Date(o.created_at) >= today).length || 0,
      revenue: orders?.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.final_price, 0) || 0,
      todayRevenue: orders?.filter(o => o.status === 'completed' && new Date(o.created_at) >= today).reduce((sum, o) => sum + o.final_price, 0) || 0
    };
    
    return stats;
  }
};

// ============================================
// ADMIN USERS API
// ============================================
export const adminUsersApi = {
  getAll: async (): Promise<(Profile & { wallet?: Wallet })[]> => {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    const { data: wallets } = await supabase
      .from('wallets')
      .select('*');
    
    const users = (profiles || []).map(profile => ({
      ...profile,
      wallet: wallets?.find(w => w.user_id === profile.id)
    }));
    
    return users;
  },

  getById: async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    const { data: wallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return { profile, wallet, orders, transactions };
  },

  getStats: async () => {
    const { data: profiles } = await supabase.from('profiles').select('created_at, is_verified');
    const { data: wallets } = await supabase.from('wallets').select('balance, total_deposited, total_spent');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      total: profiles?.length || 0,
      verified: profiles?.filter(p => p.is_verified).length || 0,
      newToday: profiles?.filter(p => new Date(p.created_at) >= today).length || 0,
      totalBalance: wallets?.reduce((sum, w) => sum + (w.balance || 0), 0) || 0,
      totalDeposited: wallets?.reduce((sum, w) => sum + (w.total_deposited || 0), 0) || 0,
      totalSpent: wallets?.reduce((sum, w) => sum + (w.total_spent || 0), 0) || 0
    };
  },

  updateVerification: async (userId: string, isVerified: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_verified: isVerified, updated_at: new Date().toISOString() })
      .eq('id', userId);
    
    return { error };
  },

  addBalance: async (userId: string, amount: number, description: string) => {
    const { error } = await supabase.from('transactions').insert({
      user_id: userId,
      type: 'bonus',
      amount: amount,
      status: 'completed',
      description: description || 'Admin bonus'
    });
    
    return { error };
  },

  deductBalance: async (userId: string, amount: number, description: string) => {
    const { error } = await supabase.from('transactions').insert({
      user_id: userId,
      type: 'withdrawal',
      amount: amount,
      status: 'completed',
      description: description || 'Admin deduction'
    });
    
    return { error };
  },

  updateProfile: async (userId: string, updates: Partial<Profile>) => {
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId);
    
    return { error };
  },

  deleteUser: async (userId: string) => {
    // Delete in order: transactions, orders, wallet, profile
    await supabase.from('transactions').delete().eq('user_id', userId);
    await supabase.from('orders').delete().eq('user_id', userId);
    await supabase.from('wallets').delete().eq('user_id', userId);
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    
    return { error };
  }
};

// ============================================
// ADMIN TRANSACTIONS API
// ============================================
export const adminTransactionsApi = {
  getAll: async (): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) return [];
    return data || [];
  },

  getByType: async (type: string): Promise<Transaction[]> => {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });
    
    return data || [];
  },

  getPending: async (): Promise<Transaction[]> => {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    return data || [];
  },

  approve: async (transactionId: string) => {
    const { error } = await supabase
      .from('transactions')
      .update({ status: 'completed' })
      .eq('id', transactionId);
    
    return { error };
  },

  reject: async (transactionId: string) => {
    const { error } = await supabase
      .from('transactions')
      .update({ status: 'failed' })
      .eq('id', transactionId);
    
    return { error };
  },

  getStats: async () => {
    const { data } = await supabase.from('transactions').select('type, amount, status, created_at');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const completed = data?.filter(t => t.status === 'completed') || [];
    const todayTx = completed.filter(t => new Date(t.created_at) >= today);
    
    return {
      totalDeposits: completed.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0),
      totalPayments: completed.filter(t => t.type === 'order_payment').reduce((sum, t) => sum + t.amount, 0),
      totalRefunds: completed.filter(t => t.type === 'refund').reduce((sum, t) => sum + t.amount, 0),
      totalBonuses: completed.filter(t => t.type === 'bonus').reduce((sum, t) => sum + t.amount, 0),
      pendingCount: data?.filter(t => t.status === 'pending').length || 0,
      todayDeposits: todayTx.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0),
      todayPayments: todayTx.filter(t => t.type === 'order_payment').reduce((sum, t) => sum + t.amount, 0)
    };
  }
};

// ============================================
// ADMIN PROMO CODES API
// ============================================
export const adminPromoApi = {
  getAll: async (): Promise<PromoCode[]> => {
    const { data } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false });
    
    return data || [];
  },

  create: async (promo: {
    code: string;
    discount_type: 'percent' | 'fixed';
    discount_value: number;
    max_uses?: number;
    min_order_amount?: number;
    valid_until?: string;
  }) => {
    const { data, error } = await supabase
      .from('promo_codes')
      .insert({
        ...promo,
        code: promo.code.toUpperCase().trim(),
        is_active: true
      })
      .select()
      .single();
    
    return { data, error };
  },

  update: async (promoId: string, updates: Partial<PromoCode>) => {
    const { error } = await supabase
      .from('promo_codes')
      .update(updates)
      .eq('id', promoId);
    
    return { error };
  },

  toggleActive: async (promoId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('promo_codes')
      .update({ is_active: isActive })
      .eq('id', promoId);
    
    return { error };
  },

  delete: async (promoId: string) => {
    const { error } = await supabase
      .from('promo_codes')
      .delete()
      .eq('id', promoId);
    
    return { error };
  },

  getStats: async () => {
    const { data } = await supabase.from('promo_codes').select('is_active, used_count, discount_value, discount_type');
    
    return {
      total: data?.length || 0,
      active: data?.filter(p => p.is_active).length || 0,
      totalUsed: data?.reduce((sum, p) => sum + (p.used_count || 0), 0) || 0
    };
  }
};

// ============================================
// ADMIN CONTACT MESSAGES API
// ============================================
export const adminContactApi = {
  getAll: async () => {
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    return data || [];
  },

  getByStatus: async (status: string) => {
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    return data || [];
  },

  updateStatus: async (messageId: string, status: string) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', messageId);
    
    return { error };
  },

  reply: async (messageId: string, reply: string) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ 
        admin_reply: reply, 
        status: 'replied',
        replied_at: new Date().toISOString()
      })
      .eq('id', messageId);
    
    return { error };
  },

  delete: async (messageId: string) => {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', messageId);
    
    return { error };
  },

  getStats: async () => {
    const { data } = await supabase.from('contact_messages').select('status, created_at');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      total: data?.length || 0,
      new: data?.filter(m => m.status === 'new').length || 0,
      replied: data?.filter(m => m.status === 'replied').length || 0,
      todayMessages: data?.filter(m => new Date(m.created_at) >= today).length || 0
    };
  }
};

// ============================================
// ADMIN REVIEWS API
// ============================================
export const adminReviewsApi = {
  getAll: async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    
    return data || [];
  },

  approve: async (reviewId: string) => {
    const { error } = await supabase
      .from('reviews')
      .update({ is_visible: true, is_verified: true })
      .eq('id', reviewId);
    
    return { error };
  },

  hide: async (reviewId: string) => {
    const { error } = await supabase
      .from('reviews')
      .update({ is_visible: false })
      .eq('id', reviewId);
    
    return { error };
  },

  addResponse: async (reviewId: string, response: string) => {
    const { error } = await supabase
      .from('reviews')
      .update({ admin_response: response })
      .eq('id', reviewId);
    
    return { error };
  },

  delete: async (reviewId: string) => {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);
    
    return { error };
  }
};

// ============================================
// ADMIN REFERRALS API
// ============================================
export const adminReferralsApi = {
  getAll: async () => {
    const { data } = await supabase
      .from('referrals')
      .select('*')
      .order('created_at', { ascending: false });
    
    return data || [];
  },

  creditBonus: async (referralId: string, amount: number) => {
    const { data: referral } = await supabase
      .from('referrals')
      .select('*')
      .eq('id', referralId)
      .single();
    
    if (!referral) return { error: 'Referral not found' };

    // Add bonus to referrer
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
  },

  getStats: async () => {
    const { data } = await supabase.from('referrals').select('status, bonus_amount');
    
    return {
      total: data?.length || 0,
      credited: data?.filter(r => r.status === 'credited').length || 0,
      totalBonusPaid: data?.filter(r => r.status === 'credited').reduce((sum, r) => sum + (r.bonus_amount || 0), 0) || 0
    };
  }
};
