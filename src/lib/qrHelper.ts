import { supabase } from './supabase';

export const getQRCodeUrl = async (paymentMethod: string): Promise<string | null> => {
  const { data } = await supabase
    .from('payment_qr_codes')
    .select('qr_image_url')
    .eq('payment_method', paymentMethod)
    .eq('is_active', true)
    .single();
  
  return data?.qr_image_url || null;
};
