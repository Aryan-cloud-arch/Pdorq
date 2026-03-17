import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  isAdmin, 
  adminOrdersApi, 
  adminUsersApi, 
  adminTransactionsApi, 
  adminPromoApi,
  adminContactApi 
} from '../lib/adminApi';
import type { Order, Profile, Transaction, PromoCode } from '../lib/database.types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'overview' | 'orders' | 'users' | 'transactions' | 'promos' | 'messages';

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const { user } = useAuth();
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<(Profile & { wallet?: any })[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  
  // Stats
  const [orderStats, setOrderStats] = useState({ total: 0, pending: 0, processing: 0, completed: 0, revenue: 0 });
  const [userStats, setUserStats] = useState({ total: 0, newToday: 0, totalBalance: 0, totalDeposited: 0 });
  const [txStats, setTxStats] = useState({ totalDeposits: 0, totalPayments: 0, totalRefunds: 0, pendingCount: 0 });

  // Modal states
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [newPromo, setNewPromo] = useState({ code: '', discount_type: 'percent' as const, discount_value: 10, max_uses: 100 });

  useEffect(() => {
    if (isOpen && user) {
      checkAdmin();
    }
  }, [isOpen, user]);

  const checkAdmin = async () => {
    if (!user) return;
    const admin = await isAdmin(user.id);
    setIsAdminUser(admin);
    if (admin) {
      loadAllData();
    }
    setLoading(false);
  };

  const loadAllData = async () => {
    const [ordersData, usersData, txData, promosData, msgsData, oStats, uStats, tStats] = await Promise.all([
      adminOrdersApi.getAll(),
      adminUsersApi.getAll(),
      adminTransactionsApi.getAll(),
      adminPromoApi.getAll(),
      adminContactApi.getAll(),
      adminOrdersApi.getStats(),
      adminUsersApi.getStats(),
      adminTransactionsApi.getStats()
    ]);

    setOrders(ordersData);
    setUsers(usersData);
    setTransactions(txData);
    setPromos(promosData);
    setMessages(msgsData);
    setOrderStats(oStats);
    setUserStats(uStats);
    setTxStats(tStats);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    await adminOrdersApi.updateStatus(orderId, status);
    loadAllData();
  };

  const handleRefundOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to refund this order?')) {
      await adminOrdersApi.refund(orderId);
      loadAllData();
    }
  };

  const handleApproveTransaction = async (txId: string) => {
    await adminTransactionsApi.approve(txId);
    loadAllData();
  };

  const handleRejectTransaction = async (txId: string) => {
    await adminTransactionsApi.reject(txId);
    loadAllData();
  };

  const handleCreatePromo = async () => {
    if (!newPromo.code) return;
    await adminPromoApi.create(newPromo);
    setShowPromoModal(false);
    setNewPromo({ code: '', discount_type: 'percent', discount_value: 10, max_uses: 100 });
    loadAllData();
  };

  const handleTogglePromo = async (promoId: string, isActive: boolean) => {
    await adminPromoApi.toggleActive(promoId, isActive);
    loadAllData();
  };

  const handleDeletePromo = async (promoId: string) => {
    if (confirm('Delete this promo code?')) {
      await adminPromoApi.delete(promoId);
      loadAllData();
    }
  };

  const handleAddBalance = async (userId: string) => {
    const amount = prompt('Enter amount to add:');
    if (amount && !isNaN(Number(amount))) {
      await adminUsersApi.addBalance(userId, Number(amount), 'Admin bonus');
      loadAllData();
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#0D0D0D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdminUser) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#0D0D0D] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl text-white mb-2">Access Denied</h2>
          <p className="text-white/60 mb-4">You don't have admin privileges.</p>
          <button onClick={onClose} className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      processing: 'bg-blue-500/20 text-blue-400',
      in_progress: 'bg-blue-500/20 text-blue-400',
      completed: 'bg-green-500/20 text-green-400',
      failed: 'bg-red-500/20 text-red-400',
      cancelled: 'bg-red-500/20 text-red-400',
      refunded: 'bg-purple-500/20 text-purple-400'
    };
    return colors[status] || 'bg-white/10 text-white/60';
  };

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'orders', label: 'Orders', count: orderStats.pending + orderStats.processing },
    { id: 'users', label: 'Users', count: userStats.total },
    { id: 'transactions', label: 'Transactions', count: txStats.pendingCount },
    { id: 'promos', label: 'Promos', count: promos.length },
    { id: 'messages', label: 'Messages', count: messages.filter(m => m.status === 'new').length }
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-[#0D0D0D] overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b border-gold/10 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="text-gold">◆</span>
          <h1 className="text-white text-lg font-serif">Admin Dashboard</h1>
        </div>
        <button onClick={onClose} className="text-white/60 hover:text-white p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10 overflow-x-auto">
        <div className="flex px-4 sm:px-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.id 
                  ? 'text-gold border-gold' 
                  : 'text-white/60 border-transparent hover:text-white'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-gold/20 text-gold">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100vh-8rem)] overflow-y-auto p-4 sm:p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white/50 text-xs uppercase">Total Orders</p>
                <p className="text-2xl text-white font-semibold">{orderStats.total}</p>
                <p className="text-yellow-400 text-xs mt-1">{orderStats.pending} pending</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white/50 text-xs uppercase">Revenue</p>
                <p className="text-2xl text-gold font-semibold">${orderStats.revenue.toFixed(2)}</p>
                <p className="text-green-400 text-xs mt-1">{orderStats.completed} completed</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white/50 text-xs uppercase">Total Users</p>
                <p className="text-2xl text-white font-semibold">{userStats.total}</p>
                <p className="text-blue-400 text-xs mt-1">+{userStats.newToday} today</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white/50 text-xs uppercase">Total Deposits</p>
                <p className="text-2xl text-green-400 font-semibold">${userStats.totalDeposited.toFixed(2)}</p>
                <p className="text-white/50 text-xs mt-1">${userStats.totalBalance.toFixed(2)} in wallets</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-white font-medium mb-4">Recent Orders</h3>
              <div className="space-y-2">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-gold text-sm font-mono">{order.order_number}</p>
                      <p className="text-white/60 text-xs">{order.platform} - {order.service}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <p className="text-white text-sm mt-1">${order.final_price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-gold font-mono">{order.order_number}</p>
                    <p className="text-white/60 text-xs">{formatDate(order.created_at)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-3">
                  <div>
                    <p className="text-white/50 text-xs">Platform</p>
                    <p className="text-white">{order.platform}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Service</p>
                    <p className="text-white">{order.service}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Amount</p>
                    <p className="text-gold">${order.final_price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Urgency</p>
                    <p className="text-white capitalize">{order.urgency}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-white/50 text-xs">Target</p>
                  <p className="text-white text-sm break-all">{order.target_url}</p>
                </div>

                {order.notes && (
                  <div className="mb-3 p-2 bg-white/5 rounded">
                    <p className="text-white/50 text-xs">Notes</p>
                    <p className="text-white/80 text-sm">{order.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                      className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-xs rounded-lg hover:bg-blue-500/30"
                    >
                      Start Processing
                    </button>
                  )}
                  {order.status === 'processing' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'in_progress')}
                      className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-lg hover:bg-yellow-500/30"
                    >
                      Mark In Progress
                    </button>
                  )}
                  {['processing', 'in_progress'].includes(order.status) && (
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                      className="px-3 py-1.5 bg-green-500/20 text-green-400 text-xs rounded-lg hover:bg-green-500/30"
                    >
                      Mark Completed
                    </button>
                  )}
                  {!['completed', 'refunded', 'cancelled'].includes(order.status) && (
                    <>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'failed')}
                        className="px-3 py-1.5 bg-red-500/20 text-red-400 text-xs rounded-lg hover:bg-red-500/30"
                      >
                        Mark Failed
                      </button>
                      <button
                        onClick={() => handleRefundOrder(order.id)}
                        className="px-3 py-1.5 bg-purple-500/20 text-purple-400 text-xs rounded-lg hover:bg-purple-500/30"
                      >
                        Refund
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-3">
            {users.map(u => (
              <div key={u.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-medium">
                    {u.full_name?.[0] || u.email[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white">{u.full_name || 'No name'}</p>
                    <p className="text-white/60 text-sm">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-gold font-semibold">${u.wallet?.balance?.toFixed(2) || '0.00'}</p>
                    <p className="text-white/50 text-xs">Balance</p>
                  </div>
                  <button
                    onClick={() => handleAddBalance(u.id)}
                    className="px-3 py-1.5 bg-gold/20 text-gold text-xs rounded-lg hover:bg-gold/30"
                  >
                    Add Balance
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-3">
            {transactions.map(tx => (
              <div key={tx.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-white capitalize">{tx.type.replace('_', ' ')}</p>
                  <p className="text-white/60 text-xs">{formatDate(tx.created_at)}</p>
                  {tx.description && <p className="text-white/50 text-xs mt-1">{tx.description}</p>}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-semibold ${['deposit', 'bonus', 'refund'].includes(tx.type) ? 'text-green-400' : 'text-red-400'}`}>
                      {['deposit', 'bonus', 'refund'].includes(tx.type) ? '+' : '-'}${tx.amount.toFixed(2)}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </div>
                  {tx.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveTransaction(tx.id)}
                        className="px-3 py-1.5 bg-green-500/20 text-green-400 text-xs rounded-lg"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectTransaction(tx.id)}
                        className="px-3 py-1.5 bg-red-500/20 text-red-400 text-xs rounded-lg"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Promos Tab */}
        {activeTab === 'promos' && (
          <div className="space-y-4">
            <button
              onClick={() => setShowPromoModal(true)}
              className="px-4 py-2 bg-gold text-black font-medium rounded-lg hover:opacity-90"
            >
              + Create Promo Code
            </button>

            <div className="space-y-3">
              {promos.map(promo => (
                <div key={promo.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-gold font-mono text-lg">{promo.code}</p>
                    <p className="text-white/60 text-sm">
                      {promo.discount_type === 'percent' ? `${promo.discount_value}% off` : `$${promo.discount_value} off`}
                    </p>
                    <p className="text-white/50 text-xs mt-1">
                      Used: {promo.used_count}/{promo.max_uses || '∞'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePromo(promo.id, !promo.is_active)}
                      className={`px-3 py-1.5 text-xs rounded-lg ${
                        promo.is_active 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {promo.is_active ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => handleDeletePromo(promo.id)}
                      className="px-3 py-1.5 bg-red-500/20 text-red-400 text-xs rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Create Promo Modal */}
            {showPromoModal && (
              <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/80" onClick={() => setShowPromoModal(false)} />
                <div className="relative bg-[#1A1A1A] border border-gold/20 rounded-xl p-6 w-full max-w-md">
                  <h3 className="text-white text-lg mb-4">Create Promo Code</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Code (e.g., SAVE20)"
                      value={newPromo.code}
                      onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        value={newPromo.discount_type}
                        onChange={(e) => setNewPromo({ ...newPromo, discount_type: e.target.value as 'percent' | 'fixed' })}
                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                      >
                        <option value="percent">Percent</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Value"
                        value={newPromo.discount_value}
                        onChange={(e) => setNewPromo({ ...newPromo, discount_value: Number(e.target.value) })}
                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <input
                      type="number"
                      placeholder="Max uses (leave empty for unlimited)"
                      value={newPromo.max_uses || ''}
                      onChange={(e) => setNewPromo({ ...newPromo, max_uses: Number(e.target.value) || 0 })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowPromoModal(false)}
                        className="flex-1 py-2 border border-white/20 text-white rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreatePromo}
                        className="flex-1 py-2 bg-gold text-black font-medium rounded-lg"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="text-white">{msg.name}</p>
                    <p className="text-white/60 text-xs">{msg.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    msg.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                    msg.status === 'replied' ? 'bg-green-500/20 text-green-400' :
                    'bg-white/10 text-white/60'
                  }`}>
                    {msg.status}
                  </span>
                </div>
                {msg.subject && <p className="text-white/80 text-sm mb-1">{msg.subject}</p>}
                <p className="text-white/60 text-sm">{msg.message}</p>
                <p className="text-white/40 text-xs mt-2">{formatDate(msg.created_at)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
