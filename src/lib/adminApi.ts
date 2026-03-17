import { supabase } from './supabase';
import type { Profile, Wallet, Transaction, Order, PromoCode } from './database.types';

// Check if user is admin
export const isAdmin = async (userId: string): Promise<boolean> => {
  const { data } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', userId)
    .single();
  
  // Add your admin emails here
  const adminEmails = ['admin@pdorq.com', 'pdorq@gmail.com'];
  return adminEmails.includes(data?.email || '');
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

  updateStatus: async (orderId: string, status: string, adminNotes?: string) => {
    const updates: any = { 
      status, 
      updated_at: new Date().toISOString() 
    };
    
    if (status === 'in_progress') {
      updates.started_at = new Date().toISOString();
    }
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }
    if (adminNotes) {
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
    // Get order details
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

  getStats: async () => {
    const { data: orders } = await supabase.from('orders').select('status, final_price');
    
    const stats = {
      total: orders?.length || 0,
      pending: orders?.filter(o => o.status === 'pending').length || 0,
      processing: orders?.filter(o => ['processing', 'in_progress'].includes(o.status)).length || 0,
      completed: orders?.filter(o => o.status === 'completed').length || 0,
      revenue: orders?.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.final_price, 0) || 0
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

  getStats: async () => {
    const { data: profiles } = await supabase.from('profiles').select('created_at');
    const { data: wallets } = await supabase.from('wallets').select('balance, total_deposited');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      total: profiles?.length || 0,
      newToday: profiles?.filter(p => new Date(p.created_at) >= today).length || 0,
      totalBalance: wallets?.reduce((sum, w) => sum + (w.balance || 0), 0) || 0,
      totalDeposited: wallets?.reduce((sum, w) => sum + (w.total_deposited || 0), 0) || 0
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
      description: description
    });
    
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
    const { data } = await supabase.from('transactions').select('type, amount, status');
    
    const completed = data?.filter(t => t.status === 'completed') || [];
    
    return {
      totalDeposits: completed.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0),
      totalPayments: completed.filter(t => t.type === 'order_payment').reduce((sum, t) => sum + t.amount, 0),
      totalRefunds: completed.filter(t => t.type === 'refund').reduce((sum, t) => sum + t.amount, 0),
      pendingCount: data?.filter(t => t.status === 'pending').length || 0
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
        code: promo.code.toUpperCase(),
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
  }
};
