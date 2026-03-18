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
  
  // Filter states
  const [orderFilter, setOrderFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  
  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<(Profile & { wallet?: any })[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  
  // Stats
  const [orderStats, setOrderStats] = useState({ total: 0, pending: 0, processing: 0, completed: 0, failed: 0, refunded: 0, todayOrders: 0, revenue: 0, todayRevenue: 0 });
  const [userStats, setUserStats] = useState({ total: 0, verified: 0, newToday: 0, totalBalance: 0, totalDeposited: 0, totalSpent: 0 });
  const [txStats, setTxStats] = useState({ totalDeposits: 0, totalPayments: 0, totalRefunds: 0, totalBonuses: 0, pendingCount: 0, todayDeposits: 0, todayPayments: 0 });
  const [promoStats, setPromoStats] = useState({ total: 0, active: 0, totalUsed: 0 });
  const [msgStats, setMsgStats] = useState({ total: 0, new: 0, replied: 0, todayMessages: 0 });

  // Modal states
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [showAddBalanceModal, setShowAddBalanceModal] = useState<string | null>(null);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState<Order | null>(null);
  const [showUserDetailModal, setShowUserDetailModal] = useState<string | null>(null);
  const [userDetail, setUserDetail] = useState<any>(null);
  
  // Form states
  const [newPromo, setNewPromo] = useState({ code: '', discount_type: 'percent' as const, discount_value: 10, max_uses: 100 });
  const [addBalanceAmount, setAddBalanceAmount] = useState('');
  const [addBalanceNote, setAddBalanceNote] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [replyText, setReplyText] = useState('');

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
    setLoading(true);
    try {
      const [ordersData, usersData, txData, promosData, msgsData, oStats, uStats, tStats, pStats, mStats] = await Promise.all([
        adminOrdersApi.getAll(),
        adminUsersApi.getAll(),
        adminTransactionsApi.getAll(),
        adminPromoApi.getAll(),
        adminContactApi.getAll(),
        adminOrdersApi.getStats(),
        adminUsersApi.getStats(),
        adminTransactionsApi.getStats(),
        adminPromoApi.getStats(),
        adminContactApi.getStats()
      ]);

      setOrders(ordersData);
      setUsers(usersData);
      setTransactions(txData);
      setPromos(promosData);
      setMessages(msgsData);
      setOrderStats(oStats);
      setUserStats(uStats);
      setTxStats(tStats);
      setPromoStats(pStats);
      setMsgStats(mStats);
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
    setLoading(false);
  };

  // Order Actions
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    await adminOrdersApi.updateStatus(orderId, status, adminNotes || undefined);
    setAdminNotes('');
    setShowOrderDetailModal(null);
    loadAllData();
  };

  const handleRefundOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to refund this order? Amount will be credited back to user wallet.')) {
      await adminOrdersApi.refund(orderId);
      setShowOrderDetailModal(null);
      loadAllData();
    }
  };

  // User Actions
  const handleAddBalance = async (userId: string) => {
    const amount = parseFloat(addBalanceAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    await adminUsersApi.addBalance(userId, amount, addBalanceNote || 'Admin bonus');
    setShowAddBalanceModal(null);
    setAddBalanceAmount('');
    setAddBalanceNote('');
    loadAllData();
  };

  const handleDeductBalance = async (userId: string) => {
    const amount = prompt('Enter amount to deduct:');
    if (amount && !isNaN(Number(amount))) {
      const note = prompt('Reason for deduction:') || 'Admin deduction';
      await adminUsersApi.deductBalance(userId, Number(amount), note);
      loadAllData();
    }
  };

  const handleVerifyUser = async (userId: string, isVerified: boolean) => {
    await adminUsersApi.updateVerification(userId, isVerified);
    loadAllData();
  };

  const handleViewUser = async (userId: string) => {
    const data = await adminUsersApi.getById(userId);
    setUserDetail(data);
    setShowUserDetailModal(userId);
  };

  // Transaction Actions
  const handleApproveTransaction = async (txId: string) => {
    await adminTransactionsApi.approve(txId);
    loadAllData();
  };

  const handleRejectTransaction = async (txId: string) => {
    if (confirm('Reject this transaction?')) {
      await adminTransactionsApi.reject(txId);
      loadAllData();
    }
  };

  // Promo Actions
  const handleCreatePromo = async () => {
    if (!newPromo.code.trim()) return;
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

  // Message Actions
  const handleReplyMessage = async (messageId: string) => {
    if (!replyText.trim()) return;
    await adminContactApi.reply(messageId, replyText);
    setReplyText('');
    loadAllData();
  };

  const handleMarkMessageRead = async (messageId: string) => {
    await adminContactApi.updateStatus(messageId, 'read');
    loadAllData();
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdminUser) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#0D0D0D] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl text-white mb-2">Access Denied</h2>
          <p className="text-white/60 mb-6">You don't have admin privileges.</p>
          <button onClick={onClose} className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20">
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
      pending: 'bg-orange-500/20 text-orange-400',
      processing: 'bg-blue-500/20 text-blue-400',
      in_progress: 'bg-yellow-500/20 text-yellow-400',
      completed: 'bg-green-500/20 text-green-400',
      failed: 'bg-red-500/20 text-red-400',
      cancelled: 'bg-gray-500/20 text-gray-400',
      refunded: 'bg-purple-500/20 text-purple-400',
      new: 'bg-blue-500/20 text-blue-400',
      read: 'bg-gray-500/20 text-gray-400',
      replied: 'bg-green-500/20 text-green-400'
    };
    return colors[status] || 'bg-white/10 text-white/60';
  };

  // Filter orders
  const filteredOrders = orderFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === orderFilter);

  // Filter users
  const filteredUsers = userSearch 
    ? users.filter(u => 
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(userSearch.toLowerCase())
      )
    : users;

  const tabs: { id: Tab; label: string; count?: number; color?: string }[] = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'orders', label: '📦 Orders', count: orderStats.pending + orderStats.processing, color: 'bg-orange-500' },
    { id: 'users', label: '👥 Users', count: userStats.newToday, color: 'bg-blue-500' },
    { id: 'transactions', label: '💳 Transactions', count: txStats.pendingCount, color: 'bg-yellow-500' },
    { id: 'promos', label: '🎟️ Promos', count: promoStats.active, color: 'bg-green-500' },
    { id: 'messages', label: '💬 Messages', count: msgStats.new, color: 'bg-red-500' }
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-[#0D0D0D] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-gold/20 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 bg-[#0A0A0A]">
        <div className="flex items-center gap-3">
          <span className="text-gold text-xl">◆</span>
          <div>
            <h1 className="text-white text-lg font-serif">Admin Dashboard</h1>
            <p className="text-white/40 text-xs">kronoscontrolofficial@gmail.com</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={loadAllData}
            className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10"
            title="Refresh"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button onClick={onClose} className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10 overflow-x-auto flex-shrink-0 bg-[#0A0A0A]">
        <div className="flex px-4 sm:px-6 min-w-max">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'text-gold border-gold' 
                  : 'text-white/60 border-transparent hover:text-white'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${tab.color || 'bg-gold/20'} text-white`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        
        {/* ==================== OVERVIEW TAB ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 rounded-xl p-4">
                <p className="text-green-400/70 text-xs uppercase tracking-wider">Revenue</p>
                <p className="text-2xl sm:text-3xl text-green-400 font-semibold">${orderStats.revenue.toFixed(2)}</p>
                <p className="text-green-400/50 text-xs mt-1">+${orderStats.todayRevenue.toFixed(2)} today</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                <p className="text-blue-400/70 text-xs uppercase tracking-wider">Total Orders</p>
                <p className="text-2xl sm:text-3xl text-blue-400 font-semibold">{orderStats.total}</p>
                <p className="text-blue-400/50 text-xs mt-1">+{orderStats.todayOrders} today</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                <p className="text-purple-400/70 text-xs uppercase tracking-wider">Users</p>
                <p className="text-2xl sm:text-3xl text-purple-400 font-semibold">{userStats.total}</p>
                <p className="text-purple-400/50 text-xs mt-1">+{userStats.newToday} today</p>
              </div>
              <div className="bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 rounded-xl p-4">
                <p className="text-gold/70 text-xs uppercase tracking-wider">Deposits</p>
                <p className="text-2xl sm:text-3xl text-gold font-semibold">${userStats.totalDeposited.toFixed(2)}</p>
                <p className="text-gold/50 text-xs mt-1">${userStats.totalBalance.toFixed(2)} in wallets</p>
              </div>
            </div>

            {/* Order Status Breakdown */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-white font-medium mb-4">Order Status</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {[
                  { label: 'Pending', count: orderStats.pending, color: 'text-orange-400' },
                  { label: 'Processing', count: orderStats.processing, color: 'text-blue-400' },
                  { label: 'Completed', count: orderStats.completed, color: 'text-green-400' },
                  { label: 'Failed', count: orderStats.failed, color: 'text-red-400' },
                  { label: 'Refunded', count: orderStats.refunded, color: 'text-purple-400' },
                  { label: 'Total', count: orderStats.total, color: 'text-white' }
                ].map(item => (
                  <div key={item.label} className="text-center p-3 bg-white/5 rounded-lg">
                    <p className={`text-2xl font-semibold ${item.color}`}>{item.count}</p>
                    <p className="text-white/50 text-xs">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-gold text-xs hover:underline">
                    View All →
                  </button>
                </div>
                <div className="space-y-2">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-gold text-sm font-mono">{order.order_number}</p>
                        <p className="text-white/50 text-xs">{order.platform} • {order.service}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <p className="text-white text-sm mt-1">${order.final_price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-white/40 text-center py-4">No orders yet</p>
                  )}
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Recent Users</h3>
                  <button onClick={() => setActiveTab('users')} className="text-gold text-xs hover:underline">
                    View All →
                  </button>
                </div>
                <div className="space-y-2">
                  {users.slice(0, 5).map(u => (
                    <div key={u.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-sm">
                          {u.full_name?.[0] || u.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-sm">{u.full_name || 'No name'}</p>
                          <p className="text-white/50 text-xs">{u.email}</p>
                        </div>
                      </div>
                      <p className="text-gold">${u.wallet?.balance?.toFixed(2) || '0.00'}</p>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <p className="text-white/40 text-center py-4">No users yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== ORDERS TAB ==================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'processing', 'in_progress', 'completed', 'failed', 'refunded'].map(status => (
                <button
                  key={status}
                  onClick={() => setOrderFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-all ${
                    orderFilter === status 
                      ? 'bg-gold text-black' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {status === 'all' ? 'All Orders' : status.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Orders List */}
            <div className="space-y-3">
              {filteredOrders.map(order => (
                <div key={order.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-gold/20 transition-all">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-gold font-mono">{order.order_number}</p>
                        <span className={`px-2 py-0.5 rounded text-xs capitalize ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-white/50 text-xs mt-1">{formatDate(order.created_at)}</p>
                    </div>
                    <p className="text-gold text-lg font-semibold">${order.final_price.toFixed(2)}</p>
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
                      <p className="text-white/50 text-xs">Urgency</p>
                      <p className="text-white capitalize">{order.urgency}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs">Discount</p>
                      <p className="text-green-400">{order.discount_percent}% OFF</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-white/50 text-xs">Target</p>
                    <p className="text-white text-sm break-all bg-black/30 p-2 rounded mt-1">{order.target_url}</p>
                  </div>

                  {order.notes && (
                    <div className="mb-3 p-2 bg-white/5 rounded">
                      <p className="text-white/50 text-xs">User Notes</p>
                      <p className="text-white/80 text-sm">{order.notes}</p>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                        className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-xs rounded-lg hover:bg-blue-500/30"
                      >
                        ▶ Start Processing
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'in_progress')}
                        className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-lg hover:bg-yellow-500/30"
                      >
                        ⏳ Mark In Progress
                      </button>
                    )}
                    {['processing', 'in_progress'].includes(order.status) && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                        className="px-3 py-1.5 bg-green-500/20 text-green-400 text-xs rounded-lg hover:bg-green-500/30"
                      >
                        ✓ Mark Completed
                      </button>
                    )}
                    {!['completed', 'refunded', 'cancelled'].includes(order.status) && (
                      <>
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'failed')}
                          className="px-3 py-1.5 bg-red-500/20 text-red-400 text-xs rounded-lg hover:bg-red-500/30"
                        >
                          ✗ Mark Failed
                        </button>
                        <button
                          onClick={() => handleRefundOrder(order.id)}
                          className="px-3 py-1.5 bg-purple-500/20 text-purple-400 text-xs rounded-lg hover:bg-purple-500/30"
                        >
                          ↩ Refund
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setShowOrderDetailModal(order)}
                      className="px-3 py-1.5 bg-white/10 text-white text-xs rounded-lg hover:bg-white/20 ml-auto"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
              {filteredOrders.length === 0 && (
                <div className="text-center py-12 text-white/40">
                  No orders found
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== USERS TAB ==================== */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search by email or name..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50"
            />

            {/* Users List */}
            <div className="space-y-3">
              {filteredUsers.map(u => (
                <div key={u.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-gold/20 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold text-lg font-medium">
                        {u.full_name?.[0] || u.email[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium">{u.full_name || 'No name'}</p>
                          {u.is_verified && (
                            <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">✓ Verified</span>
                          )}
                        </div>
                        <p className="text-white/60 text-sm">{u.email}</p>
                        <p className="text-white/40 text-xs">Joined {formatDate(u.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-gold text-xl font-semibold">${u.wallet?.balance?.toFixed(2) || '0.00'}</p>
                        <p className="text-white/50 text-xs">Balance</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => setShowAddBalanceModal(u.id)}
                          className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded hover:bg-green-500/30"
                        >
                          + Add
                        </button>
                        <button
                          onClick={() => handleDeductBalance(u.id)}
                          className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded hover:bg-red-500/30"
                        >
                          - Deduct
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/10">
                    <button
                      onClick={() => handleViewUser(u.id)}
                      className="px-3 py-1.5 bg-white/10 text-white text-xs rounded-lg hover:bg-white/20"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleVerifyUser(u.id, !u.is_verified)}
                      className={`px-3 py-1.5 text-xs rounded-lg ${
                        u.is_verified 
                          ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' 
                          : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      }`}
                    >
                      {u.is_verified ? 'Remove Verification' : 'Verify User'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TRANSACTIONS TAB ==================== */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                <p className="text-green-400 text-lg font-semibold">${txStats.totalDeposits.toFixed(2)}</p>
                <p className="text-green-400/60 text-xs">Total Deposits</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
                <p className="text-blue-400 text-lg font-semibold">${txStats.totalPayments.toFixed(2)}</p>
                <p className="text-blue-400/60 text-xs">Total Payments</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-center">
                <p className="text-purple-400 text-lg font-semibold">${txStats.totalRefunds.toFixed(2)}</p>
                <p className="text-purple-400/60 text-xs">Total Refunds</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
                <p className="text-yellow-400 text-lg font-semibold">{txStats.pendingCount}</p>
                <p className="text-yellow-400/60 text-xs">Pending</p>
              </div>
            </div>

            {/* Transactions List */}
            <div className="space-y-2">
              {transactions.map(tx => (
                <div key={tx.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-white capitalize font-medium">{tx.type.replace('_', ' ')}</p>
                    <p className="text-white/50 text-xs">{formatDate(tx.created_at)}</p>
                    {tx.description && <p className="text-white/40 text-xs mt-1">{tx.description}</p>}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${
                        ['deposit', 'bonus', 'refund', 'referral_bonus'].includes(tx.type) 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {['deposit', 'bonus', 'refund', 'referral_bonus'].includes(tx.type) ? '+' : '-'}
                        ${tx.amount.toFixed(2)}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </div>
                    {tx.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveTransaction(tx.id)}
                          className="px-3 py-1.5 bg-green-500/20 text-green-400 text-xs rounded-lg hover:bg-green-500/30"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleRejectTransaction(tx.id)}
                          className="px-3 py-1.5 bg-red-500/20 text-red-400 text-xs rounded-lg hover:bg-red-500/30"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== PROMOS TAB ==================== */}
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
                    <p className="text-gold font-mono text-xl">{promo.code}</p>
                    <p className="text-white/60 text-sm">
                      {promo.discount_type === 'percent' ? `${promo.discount_value}% off` : `$${promo.discount_value} off`}
                    </p>
                    <p className="text-white/40 text-xs mt-1">
                      Used: {promo.used_count}/{promo.max_uses || '∞'} • Created {formatDate(promo.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePromo(promo.id, !promo.is_active)}
                      className={`px-4 py-2 text-sm rounded-lg ${
                        promo.is_active 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {promo.is_active ? '✓ Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => handleDeletePromo(promo.id)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {promos.length === 0 && (
                <div className="text-center py-12 text-white/40">
                  No promo codes yet
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== MESSAGES TAB ==================== */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium">{msg.name}</p>
                      <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(msg.status)}`}>
                        {msg.status}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm">{msg.email}</p>
                  </div>
                  <p className="text-white/40 text-xs">{formatDate(msg.created_at)}</p>
                </div>
                {msg.subject && <p className="text-gold text-sm mb-2">{msg.subject}</p>}
                <p className="text-white/80 bg-black/30 p-3 rounded-lg">{msg.message}</p>
                
                {msg.admin_reply && (
                  <div className="mt-3 p-3 bg-gold/10 border border-gold/20 rounded-lg">
                    <p className="text-gold text-xs mb-1">Your Reply:</p>
                    <p className="text-white/80 text-sm">{msg.admin_reply}</p>
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  {msg.status === 'new' && (
                    <button
                      onClick={() => handleMarkMessageRead(msg.id)}
                      className="px-3 py-1.5 bg-white/10 text-white text-xs rounded-lg hover:bg-white/20"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center py-12 text-white/40">
                No messages yet
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==================== MODALS ==================== */}

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
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30"
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={newPromo.discount_type}
                  onChange={(e) => setNewPromo({ ...newPromo, discount_type: e.target.value as 'percent' | 'fixed' })}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                >
                  <option value="percent">Percent %</option>
                  <option value="fixed">Fixed $</option>
                </select>
                <input
                  type="number"
                  placeholder="Value"
                  value={newPromo.discount_value}
                  onChange={(e) => setNewPromo({ ...newPromo, discount_value: Number(e.target.value) })}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                />
              </div>
              <input
                type="number"
                placeholder="Max uses (empty = unlimited)"
                value={newPromo.max_uses || ''}
                onChange={(e) => setNewPromo({ ...newPromo, max_uses: Number(e.target.value) || 0 })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPromoModal(false)}
                  className="flex-1 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePromo}
                  className="flex-1 py-3 bg-gold text-black font-medium rounded-lg hover:opacity-90"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Balance Modal */}
      {showAddBalanceModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowAddBalanceModal(null)} />
          <div className="relative bg-[#1A1A1A] border border-gold/20 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-white text-lg mb-4">Add Balance</h3>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Amount ($)"
                value={addBalanceAmount}
                onChange={(e) => setAddBalanceAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30"
              />
              <input
                type="text"
                placeholder="Note (optional)"
                value={addBalanceNote}
                onChange={(e) => setAddBalanceNote(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddBalanceModal(null)}
                  className="flex-1 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddBalance(showAddBalanceModal)}
                  className="flex-1 py-3 bg-green-500 text-white font-medium rounded-lg hover:opacity-90"
                >
                  Add ${addBalanceAmount || '0'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
