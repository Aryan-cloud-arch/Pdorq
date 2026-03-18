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

type Tab = 'overview' | 'pending' | 'orders' | 'users' | 'transactions' | 'promos' | 'messages';

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const { user } = useAuth();
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  
  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<(Profile & { wallet?: any })[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingDeposits, setPendingDeposits] = useState<Transaction[]>([]);
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  
  // Stats
  const [orderStats, setOrderStats] = useState<any>({});
  const [userStats, setUserStats] = useState<any>({});
  const [txStats, setTxStats] = useState<any>({});

  // Modal states
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [showAddBalanceModal, setShowAddBalanceModal] = useState<string | null>(null);
  const [addBalanceAmount, setAddBalanceAmount] = useState('');
  const [addBalanceNote, setAddBalanceNote] = useState('');
  const [newPromo, setNewPromo] = useState({ code: '', discount_type: 'percent' as const, discount_value: 10, max_uses: 100 });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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
      const [ordersData, usersData, txData, pendingData, promosData, msgsData, oStats, uStats, tStats] = await Promise.all([
        adminOrdersApi.getAll(),
        adminUsersApi.getAll(),
        adminTransactionsApi.getAll(),
        adminTransactionsApi.getPendingDeposits(),
        adminPromoApi.getAll(),
        adminContactApi.getAll(),
        adminOrdersApi.getStats(),
        adminUsersApi.getStats(),
        adminTransactionsApi.getStats()
      ]);

      setOrders(ordersData);
      setUsers(usersData);
      setTransactions(txData);
      setPendingDeposits(pendingData);
      setPromos(promosData);
      setMessages(msgsData);
      setOrderStats(oStats);
      setUserStats(uStats);
      setTxStats(tStats);
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
    setLoading(false);
  };

  // Approve deposit
  const handleApproveDeposit = async (tx: Transaction) => {
    setActionLoading(tx.id);
    const { error } = await adminTransactionsApi.approve(tx.id);
    if (error) {
      alert('Failed to approve: ' + error.message);
    } else {
      alert('✅ Deposit approved! User balance updated.');
    }
    setActionLoading(null);
    loadAllData();
  };

  // Reject deposit
  const handleRejectDeposit = async (tx: Transaction) => {
    if (!confirm('Reject this deposit? User will NOT receive funds.')) return;
    setActionLoading(tx.id);
    await adminTransactionsApi.reject(tx.id);
    setActionLoading(null);
    loadAllData();
  };

  // Order actions
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    setActionLoading(orderId);
    await adminOrdersApi.updateStatus(orderId, status);
    setActionLoading(null);
    loadAllData();
  };

  const handleRefundOrder = async (orderId: string) => {
    if (!confirm('Refund this order? Amount will be credited back to user.')) return;
    setActionLoading(orderId);
    await adminOrdersApi.refund(orderId);
    setActionLoading(null);
    loadAllData();
  };

  // User actions
  const handleVerifyUser = async (userId: string, currentStatus: boolean) => {
    setActionLoading(userId);
    const { error } = await adminUsersApi.updateVerification(userId, !currentStatus);
    if (error) {
      alert('Failed: ' + error.message);
    }
    setActionLoading(null);
    loadAllData();
  };

  const handleAddBalance = async (userId: string) => {
    const amount = parseFloat(addBalanceAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Enter valid amount');
      return;
    }
    setActionLoading(userId);
    await adminUsersApi.addBalance(userId, amount, addBalanceNote || 'Admin bonus');
    setShowAddBalanceModal(null);
    setAddBalanceAmount('');
    setAddBalanceNote('');
    setActionLoading(null);
    loadAllData();
  };

  // Promo actions
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
    if (!confirm('Delete this promo code?')) return;
    await adminPromoApi.delete(promoId);
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
            <span className="text-4xl">🚫</span>
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
      refunded: 'bg-purple-500/20 text-purple-400',
    };
    return colors[status] || 'bg-white/10 text-white/60';
  };

  const getUserEmail = (userId: string) => {
    const u = users.find(u => u.id === userId);
    return u?.email || userId.slice(0, 8) + '...';
  };

  const tabs: { id: Tab; label: string; count?: number; urgent?: boolean }[] = [
    { id: 'pending', label: '🔔 Pending Deposits', count: pendingDeposits.length, urgent: pendingDeposits.length > 0 },
    { id: 'overview', label: '📊 Overview' },
    { id: 'orders', label: '📦 Orders', count: orderStats.pending || 0 },
    { id: 'users', label: '👥 Users', count: userStats.total || 0 },
    { id: 'transactions', label: '💳 All Transactions' },
    { id: 'promos', label: '🎟️ Promos' },
    { id: 'messages', label: '💬 Messages' }
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
            disabled={loading}
            className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10 disabled:opacity-50"
          >
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button onClick={onClose} className="p-2 text-white/60 hover:text-white">
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
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                  tab.urgent ? 'bg-red-500 text-white animate-pulse' : 'bg-gold/20 text-gold'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        
        {/* ==================== PENDING DEPOSITS TAB ==================== */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-lg font-medium">Pending Payment Verifications</h2>
              <span className="text-gold">{pendingDeposits.length} awaiting action</span>
            </div>

            {pendingDeposits.length === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-xl">
                <span className="text-4xl mb-4 block">✅</span>
                <p className="text-white/60">No pending deposits to verify!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingDeposits.map(tx => (
                  <div key={tx.id} className="bg-white/5 border-2 border-orange-500/50 rounded-xl p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-orange-400 animate-pulse">●</span>
                          <span className="text-white font-medium">New Deposit Request</span>
                        </div>
                        <p className="text-white/50 text-sm mt-1">{formatDate(tx.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 text-2xl font-bold">+${tx.amount.toFixed(2)}</p>
                        <p className="text-white/50 text-xs">to be credited</p>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="bg-black/30 rounded-lg p-3 mb-4">
                      <p className="text-white/50 text-xs uppercase mb-1">User</p>
                      <p className="text-white">{getUserEmail(tx.user_id)}</p>
                    </div>

                    {/* Payment Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-black/30 rounded-lg p-3">
                        <p className="text-white/50 text-xs uppercase mb-1">Payment Method</p>
                        <p className="text-white capitalize">{tx.payment_method?.replace('_', ' ') || 'Unknown'}</p>
                      </div>
                      <div className="bg-black/30 rounded-lg p-3">
                        <p className="text-white/50 text-xs uppercase mb-1">Amount Paid</p>
                        <p className="text-white">
                          {tx.payment_currency === 'INR' ? '₹' : '$'}
                          {tx.payment_amount_local?.toFixed(2) || tx.amount.toFixed(2)} {tx.payment_currency || 'USD'}
                        </p>
                      </div>
                    </div>

                    {/* Proof Reference */}
                    {tx.proof_reference && (
                      <div className="bg-black/30 rounded-lg p-3 mb-4">
                        <p className="text-white/50 text-xs uppercase mb-1">
                          {tx.proof_type === 'utr' ? 'UTR Number' : 'Transaction Hash'}
                        </p>
                        <p className="text-gold font-mono text-sm break-all">{tx.proof_reference}</p>
                      </div>
                    )}

                    {/* Screenshot */}
                    {tx.proof_screenshot_url && (
                      <div className="mb-4">
                        <p className="text-white/50 text-xs uppercase mb-2">Payment Screenshot</p>
                        <a 
                          href={tx.proof_screenshot_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <img 
                            src={tx.proof_screenshot_url} 
                            alt="Payment Proof" 
                            className="max-w-xs rounded-lg border border-white/20 hover:border-gold/50 transition-all"
                          />
                        </a>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-white/10">
                      <button
                        onClick={() => handleApproveDeposit(tx)}
                        disabled={actionLoading === tx.id}
                        className="flex-1 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {actionLoading === tx.id ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>✓ Approve & Credit ${tx.amount.toFixed(2)}</>
                        )}
                      </button>
                      <button
                        onClick={() => handleRejectDeposit(tx)}
                        disabled={actionLoading === tx.id}
                        className="px-6 py-3 bg-red-500/20 text-red-400 font-medium rounded-lg hover:bg-red-500/30 disabled:opacity-50"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== OVERVIEW TAB ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 rounded-xl p-4">
                <p className="text-green-400/70 text-xs uppercase">Revenue</p>
                <p className="text-2xl text-green-400 font-semibold">${orderStats.revenue?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                <p className="text-blue-400/70 text-xs uppercase">Orders</p>
                <p className="text-2xl text-blue-400 font-semibold">{orderStats.total || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                <p className="text-purple-400/70 text-xs uppercase">Users</p>
                <p className="text-2xl text-purple-400 font-semibold">{userStats.total || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/20 rounded-xl p-4">
                <p className="text-orange-400/70 text-xs uppercase">Pending</p>
                <p className="text-2xl text-orange-400 font-semibold">{txStats.pendingCount || 0}</p>
                <p className="text-orange-400/50 text-xs">${txStats.pendingAmount?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== ORDERS TAB ==================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12 text-white/40">No orders yet</div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex flex-wrap justify-between gap-3 mb-3">
                    <div>
                      <p className="text-gold font-mono">{order.order_number}</p>
                      <p className="text-white/50 text-xs">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <p className="text-gold mt-1">${order.final_price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-sm text-white/70 mb-3">
                    <p><strong>User:</strong> {getUserEmail(order.user_id)}</p>
                    <p><strong>Service:</strong> {order.platform} - {order.service}</p>
                    <p><strong>Target:</strong> <span className="text-white/50 break-all">{order.target_url}</span></p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {order.status === 'pending' && (
                      <button onClick={() => handleUpdateOrderStatus(order.id, 'processing')} className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-xs rounded-lg">
                        Start Processing
                      </button>
                    )}
                    {['processing', 'in_progress'].includes(order.status) && (
                      <button onClick={() => handleUpdateOrderStatus(order.id, 'completed')} className="px-3 py-1.5 bg-green-500/20 text-green-400 text-xs rounded-lg">
                        Mark Completed
                      </button>
                    )}
                    {!['completed', 'refunded'].includes(order.status) && (
                      <button onClick={() => handleRefundOrder(order.id)} className="px-3 py-1.5 bg-purple-500/20 text-purple-400 text-xs rounded-lg">
                        Refund
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ==================== USERS TAB ==================== */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {users.map(u => (
              <div key={u.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                      {u.full_name?.[0] || u.email[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white">{u.full_name || 'No name'}</p>
                        {u.is_verified && (
                          <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">✓</span>
                        )}
                      </div>
                      <p className="text-white/50 text-sm">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-gold font-semibold">${u.wallet?.balance?.toFixed(2) || '0.00'}</p>
                      <p className="text-white/40 text-xs">Balance</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => setShowAddBalanceModal(u.id)}
                        className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded hover:bg-green-500/30"
                      >
                        + Add
                      </button>
                      <button
                        onClick={() => handleVerifyUser(u.id, u.is_verified)}
                        disabled={actionLoading === u.id}
                        className={`px-3 py-1 text-xs rounded ${
                          u.is_verified 
                            ? 'bg-orange-500/20 text-orange-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {actionLoading === u.id ? '...' : u.is_verified ? 'Unverify' : 'Verify'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==================== TRANSACTIONS TAB ==================== */}
        {activeTab === 'transactions' && (
          <div className="space-y-2">
            {transactions.map(tx => (
              <div key={tx.id} className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-white capitalize">{tx.type.replace('_', ' ')}</p>
                  <p className="text-white/40 text-xs">{getUserEmail(tx.user_id)} • {formatDate(tx.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${['deposit', 'bonus', 'refund'].includes(tx.type) ? 'text-green-400' : 'text-red-400'}`}>
                    {['deposit', 'bonus', 'refund'].includes(tx.type) ? '+' : '-'}${tx.amount.toFixed(2)}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(tx.status)}`}>{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==================== PROMOS TAB ==================== */}
        {activeTab === 'promos' && (
          <div className="space-y-4">
            <button onClick={() => setShowPromoModal(true)} className="px-4 py-2 bg-gold text-black rounded-lg">
              + Create Promo
            </button>
            {promos.map(promo => (
              <div key={promo.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-gold font-mono text-xl">{promo.code}</p>
                  <p className="text-white/60">{promo.discount_type === 'percent' ? `${promo.discount_value}%` : `$${promo.discount_value}`} off</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleTogglePromo(promo.id, !promo.is_active)} className={`px-3 py-1.5 rounded ${promo.is_active ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/50'}`}>
                    {promo.is_active ? 'Active' : 'Inactive'}
                  </button>
                  <button onClick={() => handleDeletePromo(promo.id)} className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==================== MESSAGES TAB ==================== */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-white/40">No messages</div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex justify-between mb-2">
                    <p className="text-white">{msg.name} ({msg.email})</p>
                    <span className={`px-2 py-0.5 rounded text-xs ${msg.status === 'new' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                      {msg.status}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ==================== MODALS ==================== */}
      
      {/* Add Balance Modal */}
      {showAddBalanceModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowAddBalanceModal(null)} />
          <div className="relative bg-[#1A1A1A] border border-gold/20 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-white text-lg mb-4">Add Balance</h3>
            <input
              type="number"
              placeholder="Amount ($)"
              value={addBalanceAmount}
              onChange={(e) => setAddBalanceAmount(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white mb-3"
            />
            <input
              type="text"
              placeholder="Note (optional)"
              value={addBalanceNote}
              onChange={(e) => setAddBalanceNote(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowAddBalanceModal(null)} className="flex-1 py-3 border border-white/20 text-white rounded-lg">
                Cancel
              </button>
              <button onClick={() => handleAddBalance(showAddBalanceModal)} className="flex-1 py-3 bg-green-500 text-white rounded-lg">
                Add ${addBalanceAmount || '0'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Promo Modal */}
      {showPromoModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowPromoModal(false)} />
          <div className="relative bg-[#1A1A1A] border border-gold/20 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-white text-lg mb-4">Create Promo Code</h3>
            <input
              type="text"
              placeholder="Code (e.g., SAVE20)"
              value={newPromo.code}
              onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white mb-3"
            />
            <div className="grid grid-cols-2 gap-3 mb-3">
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
            <div className="flex gap-3">
              <button onClick={() => setShowPromoModal(false)} className="flex-1 py-3 border border-white/20 text-white rounded-lg">
                Cancel
              </button>
              <button onClick={handleCreatePromo} className="flex-1 py-3 bg-gold text-black rounded-lg">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
