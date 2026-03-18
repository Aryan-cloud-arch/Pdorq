import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { orderApi } from '../lib/api';
import type { Order } from '../lib/database.types';

interface OrderHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  orders?: any[];
  currency: { code: string; symbol: string; rate: number };
}

export default function OrderHistory({ isOpen, onClose, currency }: OrderHistoryProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      fetchOrders();
    }
  }, [isOpen, user]);

  const fetchOrders = async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    
    try {
      const data = await orderApi.getAll(user.id);
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    const converted = price * currency.rate;
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'processing': case 'in_progress': return 'text-yellow-400 bg-yellow-400/20';
      case 'failed': case 'cancelled': return 'text-red-400 bg-red-400/20';
      case 'refunded': return 'text-blue-400 bg-blue-400/20';
      case 'pending': return 'text-orange-400 bg-orange-400/20';
      default: return 'text-white/60 bg-white/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✓';
      case 'processing': case 'in_progress': return '⏳';
      case 'failed': case 'cancelled': return '✗';
      case 'refunded': return '↩';
      case 'pending': return '⏸';
      default: return '•';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[#0D0D0D] border border-gold/20 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gold/10 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-serif text-white">My Orders</h2>
            <p className="text-white/60 text-sm">
              {loading ? 'Loading...' : `${orders.length} order${orders.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={fetchOrders}
              className="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/10"
              title="Refresh"
            >
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button onClick={onClose} className="text-white/50 hover:text-white p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/60">Loading your orders...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-white/60 mb-4">{error}</p>
              <button 
                onClick={fetchOrders}
                className="px-4 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && orders.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <svg className="w-10 h-10 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-white text-lg mb-2">No Orders Yet</h3>
              <p className="text-white/50 text-sm mb-6">Your orders will appear here once you place them.</p>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-gold text-black font-medium rounded-lg hover:opacity-90"
              >
                Place Your First Order
              </button>
            </div>
          )}

          {/* Orders List */}
          {!loading && !error && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-gold/20 transition-all"
                >
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-gold font-mono text-sm">{order.order_number}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                          <span>{getStatusIcon(order.status)}</span>
                          <span className="capitalize">{order.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                      <p className="text-white/40 text-xs mt-1">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="text-right">
                      {order.discount_percent > 0 && (
                        <p className="text-white/40 text-xs line-through">{formatPrice(order.base_price)}</p>
                      )}
                      <p className="text-gold font-semibold">{formatPrice(order.final_price)}</p>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div>
                      <p className="text-white/50 text-xs uppercase">Platform</p>
                      <p className="text-white">{order.platform}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs uppercase">Service</p>
                      <p className="text-white">{order.service}</p>
                    </div>
                  </div>

                  {/* Target */}
                  <div className="mb-3">
                    <p className="text-white/50 text-xs uppercase">Target</p>
                    <p className="text-white/80 text-sm break-all bg-black/30 p-2 rounded mt-1">{order.target_url}</p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-white/50">Urgency:</span>
                      <span className={`capitalize ${
                        order.urgency === 'urgent' ? 'text-red-400' : 
                        order.urgency === 'priority' ? 'text-yellow-400' : 'text-white/70'
                      }`}>
                        {order.urgency}
                      </span>
                    </div>
                    {order.discount_percent > 0 && (
                      <span className="text-green-400">{order.discount_percent}% discount applied</span>
                    )}
                  </div>

                  {/* Admin Notes (if any) */}
                  {order.admin_notes && (
                    <div className="mt-3 p-2 bg-gold/10 border border-gold/20 rounded-lg">
                      <p className="text-gold text-xs uppercase mb-1">Note from Admin</p>
                      <p className="text-white/80 text-sm">{order.admin_notes}</p>
                    </div>
                  )}

                  {/* Completed/Started timestamps */}
                  {order.completed_at && (
                    <p className="text-green-400/70 text-xs mt-2">
                      ✓ Completed on {formatDate(order.completed_at)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
