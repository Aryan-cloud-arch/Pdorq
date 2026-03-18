import { supabase } from './supabase';

export interface Invoice {
  id: string;
  invoice_number: string;
  user_id: string;
  transaction_id: string;
  type: 'deposit' | 'order';
  amount_usd: number;
  amount_credited: number;
  payment_method: string;
  payment_reference: string;
  payment_amount_local: number;
  payment_currency: string;
  status: string;
  issued_at: string;
  metadata: Record<string, any>;
}

export const invoiceApi = {
  create: async (data: {
    user_id: string;
    transaction_id: string;
    type: 'deposit' | 'order';
    amount_usd: number;
    amount_credited: number;
    payment_method: string;
    payment_reference?: string;
    payment_amount_local?: number;
    payment_currency?: string;
    metadata?: Record<string, any>;
  }) => {
    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert(data)
      .select()
      .single();
    
    return { data: invoice, error };
  },

  getByUser: async (userId: string): Promise<Invoice[]> => {
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .order('issued_at', { ascending: false });
    
    return data || [];
  },

  getById: async (invoiceId: string): Promise<Invoice | null> => {
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();
    
    return data;
  },

  getByNumber: async (invoiceNumber: string): Promise<Invoice | null> => {
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .eq('invoice_number', invoiceNumber)
      .single();
    
    return data;
  }
};

// QR Code management for admin
export const qrCodeApi = {
  getAll: async () => {
    const { data } = await supabase
      .from('payment_qr_codes')
      .select('*')
      .order('payment_method');
    
    return data || [];
  },

  update: async (paymentMethod: string, qrImageUrl: string) => {
    const { error } = await supabase
      .from('payment_qr_codes')
      .update({ 
        qr_image_url: qrImageUrl, 
        updated_at: new Date().toISOString() 
      })
      .eq('payment_method', paymentMethod);
    
    return { error };
  },

  getByMethod: async (paymentMethod: string) => {
    const { data } = await supabase
      .from('payment_qr_codes')
      .select('qr_image_url')
      .eq('payment_method', paymentMethod)
      .eq('is_active', true)
      .single();
    
    return data?.qr_image_url || null;
  },

  // Upload QR image to Supabase Storage
  uploadQRImage: async (file: File, paymentMethod: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `qr-${paymentMethod}-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('payment-qr-codes')
      .upload(fileName, file, { upsert: true });
    
    if (error) return { url: null, error };
    
    const { data: { publicUrl } } = supabase.storage
      .from('payment-qr-codes')
      .getPublicUrl(fileName);
    
    return { url: publicUrl, error: null };
  }
};
