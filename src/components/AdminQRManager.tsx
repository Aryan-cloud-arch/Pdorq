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

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('payment-qr-codes')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        setMessage('❌ Upload failed: ' + uploadError.message);
        setUploading(null);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment-qr-codes')
        .getPublicUrl(fileName);

      // Update database
      const { error: dbError } = await supabase
        .from('payment_qr_codes')
        .update({ 
          qr_image_url: publicUrl, 
          updated_at: new Date().toISOString() 
        })
        .eq('payment_method', paymentMethod);

      if (dbError) {
        setMessage('❌ Database update failed: ' + dbError.message);
      } else {
        setMessage('✅ QR code uploaded successfully!');
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
    setMessage('✅ QR code removed');
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return <div className="text-center py-8 text-white/60">Loading QR codes...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-lg font-medium mb-2">📱 Payment QR Code Manager</h2>
        <p className="text-white/60 text-sm">Upload QR codes for each payment method. Users will see these when adding funds.</p>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.startsWith('✅') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {qrCodes.map((qr) => {
          const method = methodNames[qr.payment_method] || { name: qr.payment_method, icon: '💳' };

          return (
            <div key={qr.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-gold/20 transition-all">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{method.icon}</span>
                <div>
                  <p className="text-white font-medium">{method.name}</p>
                  <p className="text-white/40 text-xs">
                    {qr.qr_image_url ? '✅ QR uploaded' : '⚠️ No QR'}
                  </p>
                </div>
              </div>

              {/* QR Preview */}
              <div className="aspect-square bg-white/5 rounded-xl mb-4 flex items-center justify-center overflow-hidden border-2 border-dashed border-white/10">
                {qr.qr_image_url ? (
                  <img 
                    src={qr.qr_image_url} 
                    alt={`${method.name} QR`} 
                    className="w-full h-full object-contain p-3 bg-white rounded-lg"
                  />
                ) : (
                  <div className="text-center text-white/30 p-4">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">No QR uploaded</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-2">
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
                  <span className={`block w-full py-3 text-center rounded-xl text-sm font-medium cursor-pointer transition-all ${
                    uploading === qr.payment_method
                      ? 'bg-gold/50 text-black cursor-wait'
                      : 'bg-gold text-black hover:opacity-90'
                  }`}>
                    {uploading === qr.payment_method 
                      ? '⏳ Uploading...' 
                      : qr.qr_image_url ? '🔄 Replace QR Code' : '📤 Upload QR Code'
                    }
                  </span>
                </label>

                {qr.qr_image_url && (
                  <button
                    onClick={() => handleRemove(qr.payment_method)}
                    className="w-full py-2 bg-red-500/20 text-red-400 text-sm rounded-xl hover:bg-red-500/30 transition-all"
                  >
                    🗑️ Remove QR
                  </button>
                )}
              </div>

              {qr.updated_at && qr.qr_image_url && (
                <p className="text-white/30 text-xs text-center mt-3">
                  Last updated: {new Date(qr.updated_at).toLocaleDateString()}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
