import { useState } from 'react';
import { Currency } from '../types';
import { formatPrice } from '../types';

interface Order {
  id: string;
  platform: string;
  service: string;
  target: string;
  status: 'pending' | 'processing' | 'in_progress' | 'completed' | 'failed' | 'refunded';
  urgency: 'standard' | 'priority' | 'urgent';
  price: number;
  discount: number;
  finalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  estimatedCompletion: string;
  notes?: string;
}

interface OrderHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  currency: Currency;
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400', icon: '⏳' },
  processing: { label: 'Processing', color: 'bg-blue-500/20 text-blue-400', icon: '🔄' },
  in_progress: { label: 'In Progress', color: 'bg-purple-500/20 text-purple-400', icon: '⚡' },
  completed: { label: 'Completed', color: 'bg-green-500/20 text-green-400', icon: '✓' },
  failed: { label: 'Failed', color: 'bg-red-500/20 text-red-400', icon: '✗' },
  refunded: { label: 'Refunded', color: 'bg-gray-500/20 text-gray-400', icon: '↩' },
};

// Demo orders for display
const demoOrders: Order[] = [
  {
    id: 'PDQ-X7K2M9',
    platform: 'Telegram',
    service: 'Channel Takedown',
    target: 't.me/scamchannel123',
    status: 'completed',
    urgency: 'priority',
    price: 199,
    discount: 85,
    finalPrice: 44.78,
    createdAt: new Date(Date.now() - 86400000 * 3),
    updatedAt: new Date(Date.now() - 86400000 * 2),
    estimatedCompletion: '2-24h',
  },
  {
    id: 'PDQ-A3B8N2',
    platform: 'Instagram',
    service: 'Account Takedown',
    target: '@fake_account_xyz',
    status: 'in_progress',
    urgency: 'urgent',
    price: 299,
    discount: 88,
    finalPrice: 71.76,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 3600000),
    estimatedCompletion: '24-96h',
  },
  {
    id: 'PDQ-P9Q1R5',
    platform: 'YouTube',
    service: 'Video Removal',
    target: 'youtube.com/watch?v=abc123',
    status: 'processing',
    urgency: 'standard',
    price: 129,
    discount: 78,
    finalPrice: 28.38,
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 3600000),
    estimatedCompletion: '12-48h',
  },
];

export default function OrderHistory({ isOpen, onClose, orders, currency }: OrderHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Use demo orders if no real orders
  const displayOrders = orders.length > 0 ? orders : demoOrders;

  const filteredOrders = displayOrders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['pending', 'processing', 'in_progress'].includes(order.status);
    if (filter === 'completed') return ['completed', 'failed', 'refunded'].includes(order.status);
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0D0D0D] rounded-2xl overflow-hidden border border-white/10">
        {/* Header */}
        <div className="sticky top-0 bg-[#0D0D0D] border-b border-white/10 px-6 py-5 flex items-center justify-between z-10">
          <div>
            <h2 className="font-cormorant text-2xl text-white">My Orders</h2>
            <p className="font-outfit text-white/50 text-sm mt-1">{displayOrders.length} total orders</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-white/5 flex gap-2 overflow-x-auto">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-outfit text-sm capitalize transition-colors whitespace-nowrap ${
                filter === f
                  ? 'bg-[#C5A572] text-[#0D0D0D]'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {f === 'all' ? 'All Orders' : f}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
          {selectedOrder ? (
            // Order Detail View
            <div className="p-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-outfit text-sm">Back to orders</span>
              </button>

              <div className="space-y-6">
                {/* Order Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-cormorant text-2xl text-white">{selectedOrder.id}</h3>
                    <p className="font-outfit text-white/50 text-sm mt-1">
                      Placed on {selectedOrder.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-outfit ${statusConfig[selectedOrder.status].color}`}>
                    {statusConfig[selectedOrder.status].icon} {statusConfig[selectedOrder.status].label}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="bg-white/5 rounded-xl p-5">
                  <div className="flex justify-between mb-3">
                    {['Pending', 'Processing', 'In Progress', 'Completed'].map((step, idx) => (
                      <div key={step} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          idx <= ['pending', 'processing', 'in_progress', 'completed'].indexOf(selectedOrder.status)
                            ? 'bg-[#C5A572] text-[#0D0D0D]'
                            : 'bg-white/10 text-white/40'
                        }`}>
                          {idx + 1}
                        </div>
                        <span className="font-outfit text-xs text-white/50 mt-2 hidden sm:block">{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#C5A572] rounded-full transition-all duration-500"
                      style={{ 
                        width: `${((['pending', 'processing', 'in_progress', 'completed'].indexOf(selectedOrder.status) + 1) / 4) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="font-outfit text-white/40 text-xs uppercase tracking-wider mb-1">Platform</p>
                    <p className="font-outfit text-white">{selectedOrder.platform}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="font-outfit text-white/40 text-xs uppercase tracking-wider mb-1">Service</p>
                    <p className="font-outfit text-white">{selectedOrder.service}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="font-outfit text-white/40 text-xs uppercase tracking-wider mb-1">Target</p>
                    <p className="font-outfit text-white text-sm break-all">{selectedOrder.target}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="font-outfit text-white/40 text-xs uppercase tracking-wider mb-1">Urgency</p>
                    <p className="font-outfit text-white capitalize">{selectedOrder.urgency}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="font-outfit text-white/40 text-xs uppercase tracking-wider mb-1">TAT</p>
                    <p className="font-outfit text-white">{selectedOrder.estimatedCompletion}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="font-outfit text-white/40 text-xs uppercase tracking-wider mb-1">Amount Paid</p>
                    <p className="font-outfit text-[#C5A572] font-medium">
                      {formatPrice(selectedOrder.finalPrice, currency)}
                      <span className="text-white/40 text-sm ml-2 line-through">
                        {formatPrice(selectedOrder.price, currency)}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 px-4 py-3 bg-white/5 text-white rounded-lg font-outfit text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Contact Support
                  </button>
                  {['pending', 'processing'].includes(selectedOrder.status) && (
                    <button className="flex-1 px-4 py-3 bg-red-500/20 text-red-400 rounded-lg font-outfit text-sm hover:bg-red-500/30 transition-colors">
                      Request Cancellation
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Orders List View
            <div className="p-6 space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="font-outfit text-white/70 mb-2">No orders found</h3>
                  <p className="font-outfit text-white/40 text-sm">
                    {filter !== 'all' ? 'Try changing the filter' : 'Place your first order to get started'}
                  </p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="w-full bg-white/5 rounded-xl p-4 sm:p-5 hover:bg-white/10 transition-colors text-left group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-outfit text-white font-medium">{order.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-outfit ${statusConfig[order.status].color}`}>
                            {statusConfig[order.status].label}
                          </span>
                        </div>
                        <p className="font-outfit text-white/50 text-sm">
                          {order.platform} • {order.service}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-outfit text-[#C5A572] font-medium">
                          {formatPrice(order.finalPrice, currency)}
                        </p>
                        <p className="font-outfit text-white/40 text-xs mt-1">
                          {order.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-outfit text-white/40 text-sm truncate max-w-[60%]">
                        {order.target}
                      </p>
                      <span className="font-outfit text-white/40 text-xs group-hover:text-[#C5A572] transition-colors flex items-center gap-1">
                        View details
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
