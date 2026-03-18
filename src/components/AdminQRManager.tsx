import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface QRCode {
  id: string;
  payment_method: string;
  qr_image_url: string | null;
  is_active: boolean;
  updated_at: string;
}

const methodNames: Record<string, { name: string; icon: string }> = {
  upi: { name: 'UPI', icon: '⚡' },
  btc: { name: 'Bitcoin', icon: '₿' },
  eth: { name: 'Ethereum', icon: 'Ξ' },
  usdt_trc20: { name: 'USDT TRC20', icon: '₮' },
  usdt_erc20: { name: 'USDT ERC20', icon: '₮' },
};

export default function AdminQRManager() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => { loadQRCodes(); }, []);

  const loadQRCodes = async () => {
    const { data } = await supabase
      .from('payment_qr_codes')
      .select('*')
      .order('payment_method');
    setQrCodes(data || []);
    setLoading(false);
  };

  const handleUpload = async (paymentMethod: string, file: File) => {
    setUploading(paymentMethod);
    setMessage('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `qr-${paymentMethod}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-qr-codes')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        setMessage('❌ Upload failed: ' + uploadError.message);
        setUploading(null);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('payment-qr-codes')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('payment_qr_codes')
        .update({ qr_image_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('payment_method', paymentMethod);

      if (dbError) {
        setMessage('❌ DB update failed: ' + dbError.message);
      } else {
        setMessage('✅ QR code uploaded!');
        await loadQRCodes();
      }
    } catch (err) {
      setMessage('❌ Something went wrong');
    }

    setUploading(null);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleRemove = async (paymentMethod: string) => {
    if (!confirm('Remove this QR code?')) return;
    await supabase
      .from('payment_qr_codes')
      .update({ qr_image_url: null, updated_at: new Date().toISOString() })
      .eq('payment_method', paymentMethod);
    await loadQRCodes();
    setMessage('✅ QR removed');
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <div className="text-center py-8 text-white/60">Loading...</div>;

  return (
    <div className="pb-20">
      <div className="mb-6">
        <h2 className="text-white text-lg font-medium mb-2">📱 Payment QR Code Manager</h2>
        <p className="text-white/60 text-sm">Upload QR codes for each payment method. Users will see these when adding funds.</p>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${message.startsWith('✅') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        {qrCodes.map((qr) => {
          const method = methodNames[qr.payment_method] || { name: qr.payment_method, icon: '💳' };

          return (
            <div key={qr.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{method.icon}</span>
                <div className="flex-1">
                  <p className="text-white font-medium text-lg">{method.name}</p>
                  <p className="text-white/40 text-xs">
                    {qr.qr_image_url ? '✅ QR uploaded' : '⚠️ No QR uploaded yet'}
                  </p>
                </div>
                {qr.qr_image_url && (
                  <button
                    onClick={() => handleRemove(qr.payment_method)}
                    className="px-3 py-1.5 bg-red-500/20 text-red-400 text-xs rounded-lg hover:bg-red-500/30"
                  >
                    🗑️ Remove
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {/* QR Preview */}
                <div className="w-full sm:w-48 aspect-square bg-white/5 rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed border-white/10 flex-shrink-0">
                  {qr.qr_image_url ? (
                    <img src={qr.qr_image_url} alt={`${method.name} QR`} className="w-full h-full object-contain p-2 bg-white rounded-lg" />
                  ) : (
                    <div className="text-center text-white/30 p-4">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs">No QR</p>
                    </div>
                  )}
                </div>

                {/* Upload */}
                <div className="flex-1 w-full">
                  <label className="block w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(qr.payment_method, file);
                      }}
                      className="hidden"
                    />
                    <span className={`block w-full py-4 text-center rounded-xl text-sm font-medium cursor-pointer transition-all border-2 border-dashed ${
                      uploading === qr.payment_method
                        ? 'bg-gold/20 border-gold/50 text-gold cursor-wait'
                        : 'bg-white/5 border-white/20 text-white hover:border-gold/50 hover:bg-gold/5'
                    }`}>
                      {uploading === qr.payment_method 
                        ? '⏳ Uploading...' 
                        : qr.qr_image_url 
                          ? '🔄 Click to Replace QR Code' 
                          : '📤 Click to Upload QR Code'
                      }
                    </span>
                  </label>
                  <p className="text-white/30 text-xs mt-2">Supports PNG, JPG, WEBP. Max 2MB recommended.</p>
                  {qr.updated_at && qr.qr_image_url && (
                    <p className="text-white/30 text-xs mt-1">Last updated: {new Date(qr.updated_at).toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
