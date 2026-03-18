import { useState, useEffect } from 'react';
import { qrCodeApi } from '../lib/invoiceApi';
import { paymentMethods } from '../lib/paymentConfig';

interface QRCode {
  id: string;
  payment_method: string;
  qr_image_url: string | null;
  is_active: boolean;
  updated_at: string;
}

export default function AdminQRManager() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    loadQRCodes();
  }, []);

  const loadQRCodes = async () => {
    const data = await qrCodeApi.getAll();
    setQrCodes(data);
    setLoading(false);
  };

  const handleUpload = async (paymentMethod: string, file: File) => {
    setUploading(paymentMethod);
    
    const { url, error } = await qrCodeApi.uploadQRImage(file, paymentMethod);
    
    if (url && !error) {
      await qrCodeApi.update(paymentMethod, url);
      await loadQRCodes();
    }
    
    setUploading(null);
  };

  const getMethodName = (methodId: string) => {
    return paymentMethods.find(m => m.id === methodId)?.name || methodId;
  };

  const getMethodIcon = (methodId: string) => {
    return paymentMethods.find(m => m.id === methodId)?.icon || '💳';
  };

  if (loading) {
    return <div className="text-white/60 text-center py-8">Loading QR codes...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white font-medium mb-4">Payment QR Codes</h3>
      <p className="text-white/60 text-sm mb-4">Upload QR codes for each payment method. Users will see these when making payments.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {qrCodes.map((qr) => (
          <div key={qr.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{getMethodIcon(qr.payment_method)}</span>
              <span className="text-white font-medium">{getMethodName(qr.payment_method)}</span>
            </div>
            
            {/* QR Preview */}
            <div className="aspect-square bg-white/10 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
              {qr.qr_image_url ? (
                <img src={qr.qr_image_url} alt="QR Code" className="w-full h-full object-contain p-2 bg-white" />
              ) : (
                <div className="text-center text-white/40">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="text-xs">No QR uploaded</p>
                </div>
              )}
            </div>

            {/* Upload Button */}
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
              <span className={`block w-full py-2 text-center rounded-lg text-sm cursor-pointer transition-all ${
                uploading === qr.payment_method
                  ? 'bg-gold/50 text-black'
                  : 'bg-gold/20 text-gold hover:bg-gold/30'
              }`}>
                {uploading === qr.payment_method ? 'Uploading...' : qr.qr_image_url ? 'Replace QR' : 'Upload QR'}
              </span>
            </label>

            {qr.updated_at && qr.qr_image_url && (
              <p className="text-white/40 text-xs mt-2 text-center">
                Updated: {new Date(qr.updated_at).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
