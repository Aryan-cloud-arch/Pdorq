import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
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

type Tab = 'pending' | 'overview' | 'orders' | 'users' | 'transactions' | 'promos' | 'messages';

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
  const [showUserDetailModal, setShowUserDetailModal] = useState<string | null>(null);
  const [showTransactionDetailModal, setShowTransactionDetailModal] = useState<Transaction | null>(null);
  const [userDetailData, setUserDetailData] = useState<any>(null);
  
  // Form states
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
      // Fetch all data
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      const { data: walletsData } = await supabase
        .from('wallets')
        .select('*');
      
      const { data: txData } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      const { data: promosData } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });
      
      const { data: msgsData } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      // Combine users with wallets
      const usersWithWallets = (profilesData || []).map(profile => ({
        ...profile,
        wallet: walletsData?.find(w => w.user_id === profile.id)
      }));

      // Filter pending deposits
      const pending = (txData || []).filter(t => t.type === 'deposit' && t.status === 'pending');

      setOrders(ordersData || []);
      setUsers(usersWithWallets);
      setTransactions(txData || []);
      setPendingDeposits(pending);
      setPromos(promosData || []);
      setMessages(msgsData || []);

      // Calculate stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      setOrderStats({
        total: ordersData?.length || 0,
        pending: ordersData?.filter(o => o.status === 'pending').length || 0,
        processing: ordersData?.filter(o => ['processing', 'in_progress'].includes(o.status)).length || 0,
        completed: ordersData?.filter(o => o.status === 'completed').length || 0,
        revenue: ordersData?.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.final_price, 0) || 0
      });

      setUserStats({
        total: profilesData?.length || 0,
        verified: profilesData?.filter(p => p.is_verified).length || 0,
        totalBalance: walletsData?.reduce((sum, w) => sum + (w.balance || 0), 0) || 0,
        totalDeposited: walletsData?.reduce((sum, w) => sum + (w.total_deposited || 0), 0) || 0
      });

      setTxStats({
        pendingCount: pending.length,
        pendingAmount: pending.reduce((sum, t) => sum + t.amount, 0)
      });

    } catch (err) {
      console.error('Error loading admin data:', err);
    }
    setLoading(false);
  };

  // Get user info helper
  const getUser = (userId: string) => users.find(u => u.id === userId);
  const getUserEmail = (userId: string) => getUser(userId)?.email || userId.slice(0, 8) + '...';
  const getUserName = (userId: string) => getUser(userId)?.full_name || 'Unknown';

  // Approve deposit
  const handleApproveDeposit = async (tx: Transaction) => {
    setActionLoading(tx.id);
    
    const { error } = await supabase
      .from('transactions')
      .update({ 
        status: 'completed',
        verified_at: new Date().toISOString()
      })
      .eq('id', tx.id);
    
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
    
    await supabase
      .from('transactions')
      .update({ status: 'failed' })
      .eq('id', tx.id);
    
    setActionLoading(null);
    loadAllData();
  };

  // Order actions
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    setActionLoading(orderId);
    
    const updates: any = { 
      status, 
      updated_at: new Date().toISOString() 
    };
    
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }
    
    await supabase.from('orders').update(updates).eq('id', orderId);
    
    setActionLoading(null);
    loadAllData();
  };

  const handleRefundOrder = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    if (!confirm(`Refund $${order.final_price.toFixed(2)} to user?`)) return;
    
    setActionLoading(orderId);
    
    // Create refund transaction
    await supabase.from('transactions').insert({
      user_id: order.user_id,
      type: 'refund',
      amount: order.final_price,
      status: 'completed',
      description: `Refund for order ${order.order_number}`
    });
    
    // Update order status
    await supabase.from('orders').update({ status: 'refunded' }).eq('id', orderId);
    
    setActionLoading(null);
    loadAllData();
  };

  // User actions
  const handleVerifyUser = async (userId: string, currentStatus: boolean) => {
    setActionLoading(userId);
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        is_verified: !currentStatus, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Verify error:', error);
      alert('Failed to update verification: ' + error.message);
    }
    
    setActionLoading(null);
    loadAllData();
  };

  const handleViewUserDetail = async (userId: string) => {
    setShowUserDetailModal(userId);
    
    // Fetch user's orders and transactions
    const { data: userOrders } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    const { data: userTx } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    const userProfile = users.find(u => u.id === userId);
    
    setUserDetailData({
      profile: userProfile,
      orders: userOrders || [],
      transactions: userTx || []
    });
  };

  const handleAddBalance = async (userId: string) => {
    const amount = parseFloat(addBalanceAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Enter valid amount');
      return;
    }
    
    setActionLoading(userId);
    
    const { error } = await supabase.from('transactions').insert({
      user_id: userId,
      type: 'bonus',
      amount: amount,
      status: 'completed',
      description: addBalanceNote || 'Admin bonus'
    });
    
    if (error) {
      alert('Failed: ' + error.message);
    }
    
    setShowAddBalanceModal(null);
    setAddBalanceAmount('');
    setAddBalanceNote('');
    setActionLoading(null);
    loadAllData();
  };

  const handleDeductBalance = async (userId: string) => {
    const amount = prompt('Enter amount to deduct:');
    if (!amount || isNaN(Number(amount))) return;
    
    const reason = prompt('Reason for deduction:') || 'Admin deduction';
    
    await supabase.from('transactions').insert({
      user_id: userId,
      type: 'withdrawal',
      amount: Number(amount),
      status: 'completed',
      description: reason
    });
    
    loadAllData();
  };

  // Promo actions
  const handleCreatePromo = async () => {
    if (!newPromo.code.trim()) return;
    
    await supabase.from('promo_codes').insert({
      code: newPromo.code.toUpperCase().trim(),
      discount_type: newPromo.discount_type,
      discount_value: newPromo.discount_value,
      max_uses: newPromo.max_uses || null,
      is_active: true
    });
    
    setShowPromoModal(false);
    setNewPromo({ code: '', discount_type: 'percent', discount_value: 10, max_uses: 100 });
    loadAllData();
  };

  const handleTogglePromo = async (promoId: string, isActive: boolean) => {
    await supabase.from('promo_codes').update({ is_active: isActive }).eq('id', promoId);
    loadAllData();
  };

  const handleDeletePromo = async (promoId: string) => {
    if (!confirm('Delete this promo code?')) return;
    await supabase.from('promo_codes').delete().eq('id', promoId);
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

  const formatFullDate = (date: string) => new Date(date).toLocaleString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
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
            <p className="text-white/40 text-xs">Full Control Panel</p>
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
              <h2 className="text-white text-lg font-medium">🔔 Pending Payment Verifications</h2>
              <span className="text-gold">{pendingDeposits.length} awaiting action</span>
            </div>

            {pendingDeposits.length === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-xl">
                <span className="text-6xl mb-4 block">✅</span>
                <p className="text-white text-xl mb-2">All Clear!</p>
                <p className="text-white/60">No pending deposits to verify.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingDeposits.map(tx => {
                  const txUser = getUser(tx.user_id);
                  const metadata = tx.metadata as any || {};
                  
                  return (
                    <div key={tx.id} className="bg-gradient-to-r from-orange-500/10 to-transparent border-2 border-orange-500/50 rounded-2xl p-6">
                      {/* Header */}
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></span>
                            <span className="text-orange-400 font-medium">PENDING VERIFICATION</span>
                          </div>
                          <p className="text-white/50 text-sm">{formatFullDate(tx.created_at)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 text-3xl font-bold">+${tx.amount.toFixed(2)}</p>
                          <p className="text-white/50 text-sm">Total to credit</p>
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="bg-black/40 rounded-xl p-4 mb-4">
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-2">👤 User Information</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <p className="text-white/50 text-xs">Name</p>
                            <p className="text-white font-medium">{txUser?.full_name || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-white/50 text-xs">Email</p>
                            <p className="text-white font-medium">{txUser?.email || 'Unknown'}</p>
                          </div>
                          <div>
                            <p className="text-white/50 text-xs">Current Balance</p>
                            <p className="text-gold font-medium">${txUser?.wallet?.balance?.toFixed(2) || '0.00'}</p>
                          </div>
                          <div>
                            <p className="text-white/50 text-xs">User ID</p>
                            <p className="text-white/70 font-mono text-xs">{tx.user_id}</p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Details */}
                      <div className="bg-black/40 rounded-xl p-4 mb-4">
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-2">💳 Payment Details</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <p className="text-white/50 text-xs">Payment Method</p>
                            <p className="text-white font-medium capitalize">{tx.payment_method?.replace('_', ' ') || 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="text-white/50 text-xs">Amount Paid by User</p>
                            <p className="text-white font-medium">
                              {tx.payment_currency === 'INR' ? '₹' : '$'}
                              {tx.payment_amount_local?.toFixed(2) || tx.amount.toFixed(2)} 
                              {tx.payment_currency && ` ${tx.payment_currency}`}
                            </p>
                          </div>
                          {metadata.base_amount && (
                            <>
                              <div>
                                <p className="text-white/50 text-xs">Base Amount</p>
                                <p className="text-white">${metadata.base_amount?.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-white/50 text-xs">Bonus Added</p>
                                <p className="text-green-400">+${((metadata.amount_bonus || 0) + (metadata.crypto_bonus || 0)).toFixed(2)}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Payment Proof - UTR/Transaction Hash */}
                      <div className="bg-black/40 rounded-xl p-4 mb-4">
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-2">
                          🔐 Payment Proof ({tx.proof_type === 'utr' ? 'UTR Number' : 'Transaction Hash'})
                        </p>
                        {tx.proof_reference ? (
                          <div className="bg-gold/10 border border-gold/30 rounded-lg p-3">
                            <p className="text-gold font-mono text-lg break-all select-all">{tx.proof_reference}</p>
                          </div>
                        ) : (
                          <p className="text-red-400">⚠️ No proof provided</p>
                        )}
                      </div>

                      {/* Screenshot */}
                      {tx.proof_screenshot_url && (
                        <div className="bg-black/40 rounded-xl p-4 mb-4">
                          <p className="text-white/50 text-xs uppercase tracking-wider mb-2">📸 Payment Screenshot</p>
                          <a 
                            href={tx.proof_screenshot_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <img 
                              src={tx.proof_screenshot_url} 
                              alt="Payment Proof" 
                              className="max-w-full sm:max-w-md rounded-lg border-2 border-white/20 hover:border-gold transition-all cursor-zoom-in"
                            />
                            <p className="text-white/50 text-xs mt-2">Click to view full size</p>
                          </a>
                        </div>
                      )}

                      {/* Description */}
                      {tx.description && (
                        <div className="bg-black/40 rounded-xl p-4 mb-4">
                          <p className="text-white/50 text-xs uppercase tracking-wider mb-2">📝 Description</p>
                          <p className="text-white/80">{tx.description}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                        <button
                          onClick={() => handleApproveDeposit(tx)}
                          disabled={actionLoading === tx.id}
                          className="flex-1 py-4 bg-green-500 text-white text-lg font-bold rounded-xl hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                        >
                          {actionLoading === tx.id ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>✓ APPROVE & Credit ${tx.amount.toFixed(2)}</>
                          )}
                        </button>
                        <button
                          onClick={() => handleRejectDeposit(tx)}
                          disabled={actionLoading === tx.id}
                          className="sm:w-auto px-8 py-4 bg-red-500/20 text-red-400 font-bold rounded-xl hover:bg-red-500/30 disabled:opacity-50 transition-all"
                        >
                          ✗ REJECT
                        </button>
                      </div>
                    </div>
                  );
                })}
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
                <p className="text-2xl text-orange-400 font-semibold">${txStats.pendingAmount?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
            
            {/* Recent activity */}
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-white font-medium mb-4">Recent Transactions</h3>
              <div className="space-y-2">
                {transactions.slice(0, 10).map(tx => (
                  <div 
                    key={tx.id} 
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10"
                    onClick={() => setShowTransactionDetailModal(tx)}
                  >
                    <div>
                      <p className="text-white capitalize">{tx.type.replace('_', ' ')}</p>
                      <p className="text-white/50 text-xs">{getUserEmail(tx.user_id)}</p>
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
                  <div className="text-sm text-white/70 mb-3 space-y-1">
                    <p><span className="text-white/50">User:</span> {getUserEmail(order.user_id)}</p>
                    <p><span className="text-white/50">Service:</span> {order.platform} - {order.service}</p>
                    <p><span className="text-white/50">Target:</span> <span className="text-white/50 break-all">{order.target_url}</span></p>
                    {order.notes && <p><span className="text-white/50">Notes:</span> {order.notes}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => handleUpdateOrderStatus(order.id, 'processing')} 
                        disabled={actionLoading === order.id}
                        className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-xs rounded-lg hover:bg-blue-500/30 disabled:opacity-50"
                      >
                        Start Processing
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button 
                        onClick={() => handleUpdateOrderStatus(order.id, 'in_progress')} 
                        disabled={actionLoading === order.id}
                        className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-lg hover:bg-yellow-500/30 disabled:opacity-50"
                      >
                        Mark In Progress
                      </button>
                    )}
                    {['processing', 'in_progress'].includes(order.status) && (
                      <button 
                        onClick={() => handleUpdateOrderStatus(order.id, 'completed')} 
                        disabled={actionLoading === order.id}
                        className="px-3 py-1.5 bg-green-500/20 text-green-400 text-xs rounded-lg hover:bg-green-500/30 disabled:opacity-50"
                      >
                        ✓ Mark Completed
                      </button>
                    )}
                    {!['completed', 'refunded'].includes(order.status) && (
                      <>
                        <button 
                          onClick={() => handleUpdateOrderStatus(order.id, 'failed')} 
                          disabled={actionLoading === order.id}
                          className="px-3 py-1.5 bg-red-500/20 text-red-400 text-xs rounded-lg hover:bg-red-500/30 disabled:opacity-50"
                        >
                          Mark Failed
                        </button>
                        <button 
                          onClick={() => handleRefundOrder(order.id)} 
                          disabled={actionLoading === order.id}
                          className="px-3 py-1.5 bg-purple-500/20 text-purple-400 text-xs rounded-lg hover:bg-purple-500/30 disabled:opacity-50"
                        >
                          Refund
                        </button>
                      </>
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
            <p className="text-white/60 text-sm">{users.length} total users</p>
            {users.map(u => (
              <div key={u.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold text-lg font-medium">
                      {u.full_name?.[0]?.toUpperCase() || u.email[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{u.full_name || 'No name'}</p>
                        {u.is_verified && (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">✓ Verified</span>
                        )}
                      </div>
                      <p className="text-white/60 text-sm">{u.email}</p>
                      <p className="text-white/40 text-xs">Joined: {formatDate(u.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gold text-2xl font-semibold">${u.wallet?.balance?.toFixed(2) || '0.00'}</p>
                    <p className="text-white/40 text-xs">Balance</p>
                  </div>
                </div>
                
                {/* User Actions */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleViewUserDetail(u.id)}
                    className="px-4 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20"
                  >
                    👁️ View Details
                  </button>
                  <button
                    onClick={() => setShowAddBalanceModal(u.id)}
                    className="px-4 py-2 bg-green-500/20 text-green-400 text-sm rounded-lg hover:bg-green-500/30"
                  >
                    + Add Balance
                  </button>
                  <button
                    onClick={() => handleDeductBalance(u.id)}
                    className="px-4 py-2 bg-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/30"
                  >
                    - Deduct
                  </button>
                  <button
                    onClick={() => handleVerifyUser(u.id, u.is_verified)}
                    disabled={actionLoading === u.id}
                    className={`px-4 py-2 text-sm rounded-lg disabled:opacity-50 ${
                      u.is_verified 
                        ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' 
                        : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                    }`}
                  >
                    {actionLoading === u.id ? '...' : u.is_verified ? '✗ Unverify' : '✓ Verify'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==================== TRANSACTIONS TAB ==================== */}
        {activeTab === 'transactions' && (
          <div className="space-y-2">
            <p className="text-white/60 text-sm mb-4">{transactions.length} total transactions • Click to view details</p>
            {transactions.map(tx => (
              <div 
                key={tx.id} 
                onClick={() => setShowTransactionDetailModal(tx)}
                className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:border-gold/30 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white capitalize font-medium">{tx.type.replace('_', ' ')}</p>
                    <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(tx.status)}`}>{tx.status}</span>
                  </div>
                  <p className="text-white/50 text-sm">{getUserEmail(tx.user_id)}</p>
                  <p className="text-white/40 text-xs">{formatDate(tx.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-semibold ${['deposit', 'bonus', 'refund'].includes(tx.type) ? 'text-green-400' : 'text-red-400'}`}>
                    {['deposit', 'bonus', 'refund'].includes(tx.type) ? '+' : '-'}${tx.amount.toFixed(2)}
                  </p>
                  {tx.payment_method && (
                    <p className="text-white/50 text-xs capitalize">{tx.payment_method.replace('_', ' ')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==================== PROMOS TAB ==================== */}
        {activeTab === 'promos' && (
          <div className="space-y-4">
            <button onClick={() => setShowPromoModal(true)} className="px-4 py-2 bg-gold text-black font-medium rounded-lg">
              + Create Promo Code
            </button>
            {promos.map(promo => (
              <div key={promo.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-gold font-mono text-xl">{promo.code}</p>
                  <p className="text-white/60">{promo.discount_type === 'percent' ? `${promo.discount_value}%` : `$${promo.discount_value}`} off</p>
                  <p className="text-white/40 text-xs">Used: {promo.used_count || 0} / {promo.max_uses || '∞'}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleTogglePromo(promo.id, !promo.is_active)} 
                    className={`px-3 py-1.5 rounded ${promo.is_active ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/50'}`}
                  >
                    {promo.is_active ? '✓ Active' : 'Inactive'}
                  </button>
                  <button 
                    onClick={() => handleDeletePromo(promo.id)} 
                    className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {promos.length === 0 && (
              <p className="text-white/40 text-center py-8">No promo codes yet</p>
            )}
          </div>
        )}

        {/* ==================== MESSAGES TAB ==================== */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-white/40">No messages yet</div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex justify-between mb-2">
                    <div>
                      <p className="text-white font-medium">{msg.name}</p>
                      <p className="text-white/60 text-sm">{msg.email}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-xs ${msg.status === 'new' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                        {msg.status}
                      </span>
                      <p className="text-white/40 text-xs mt-1">{formatDate(msg.created_at)}</p>
                    </div>
                  </div>
                  {msg.subject && <p className="text-gold text-sm mb-2">{msg.subject}</p>}
                  <p className="text-white/80 bg-black/30 p-3 rounded-lg">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ==================== MODALS ==================== */}
      
      {/* User Detail Modal */}
      {showUserDetailModal && userDetailData && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90" onClick={() => { setShowUserDetailModal(null); setUserDetailData(null); }} />
          <div className="relative bg-[#1A1A1A] border border-gold/20 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-white text-lg">User Details</h3>
              <button onClick={() => { setShowUserDetailModal(null); setUserDetailData(null); }} className="text-white/60 hover:text-white">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Profile */}
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="text-gold text-sm uppercase tracking-wider mb-3">Profile</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-white/50">Name:</span> <span className="text-white">{userDetailData.profile?.full_name || 'N/A'}</span></div>
                  <div><span className="text-white/50">Email:</span> <span className="text-white">{userDetailData.profile?.email}</span></div>
                  <div><span className="text-white/50">Balance:</span> <span className="text-gold">${userDetailData.profile?.wallet?.balance?.toFixed(2) || '0.00'}</span></div>
                  <div><span className="text-white/50">Verified:</span> <span className={userDetailData.profile?.is_verified ? 'text-green-400' : 'text-red-400'}>{userDetailData.profile?.is_verified ? 'Yes' : 'No'}</span></div>
                  <div><span className="text-white/50">Joined:</span> <span className="text-white">{formatDate(userDetailData.profile?.created_at)}</span></div>
                  <div><span className="text-white/50">Referral Code:</span> <span className="text-white font-mono">{userDetailData.profile?.referral_code || 'N/A'}</span></div>
                </div>
              </div>
              
              {/* Orders */}
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="text-gold text-sm uppercase tracking-wider mb-3">Orders ({userDetailData.orders?.length || 0})</h4>
                {userDetailData.orders?.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {userDetailData.orders.map((o: any) => (
                      <div key={o.id} className="flex justify-between p-2 bg-black/30 rounded text-sm">
                        <span className="text-gold font-mono">{o.order_number}</span>
                        <span className="text-white">{o.platform}</span>
                        <span className={getStatusColor(o.status) + ' px-2 rounded'}>{o.status}</span>
                        <span className="text-white">${o.final_price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/40 text-sm">No orders</p>
                )}
              </div>
              
              {/* Transactions */}
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="text-gold text-sm uppercase tracking-wider mb-3">Transactions ({userDetailData.transactions?.length || 0})</h4>
                {userDetailData.transactions?.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {userDetailData.transactions.map((t: any) => (
                      <div key={t.id} className="flex justify-between p-2 bg-black/30 rounded text-sm">
                        <span className="text-white capitalize">{t.type.replace('_', ' ')}</span>
                        <span className={getStatusColor(t.status) + ' px-2 rounded'}>{t.status}</span>
                        <span className={['deposit', 'bonus', 'refund'].includes(t.type) ? 'text-green-400' : 'text-red-400'}>
                          {['deposit', 'bonus', 'refund'].includes(t.type) ? '+' : '-'}${t.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/40 text-sm">No transactions</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {showTransactionDetailModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90" onClick={() => setShowTransactionDetailModal(null)} />
          <div className="relative bg-[#1A1A1A] border border-gold/20 rounded-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-white text-lg">Transaction Details</h3>
              <button onClick={() => setShowTransactionDetailModal(null)} className="text-white/60 hover:text-white">✕</button>
            </div>
            
            <div className="space-y-4">
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <p className={`text-3xl font-bold ${['deposit', 'bonus', 'refund'].includes(showTransactionDetailModal.type) ? 'text-green-400' : 'text-red-400'}`}>
                  {['deposit', 'bonus', 'refund'].includes(showTransactionDetailModal.type) ? '+' : '-'}${showTransactionDetailModal.amount.toFixed(2)}
                </p>
                <p className="text-white/60 capitalize">{showTransactionDetailModal.type.replace('_', ' ')}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-white/50 text-xs">Status</p>
                  <span className={`${getStatusColor(showTransactionDetailModal.status)} px-2 py-1 rounded text-xs`}>
                    {showTransactionDetailModal.status}
                  </span>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-white/50 text-xs">User</p>
                  <p className="text-white text-xs">{getUserEmail(showTransactionDetailModal.user_id)}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-white/50 text-xs">Payment Method</p>
                  <p className="text-white capitalize">{showTransactionDetailModal.payment_method?.replace('_', ' ') || 'N/A'}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-white/50 text-xs">Date</p>
                  <p className="text-white text-xs">{formatFullDate(showTransactionDetailModal.created_at)}</p>
                </div>
              </div>

              {showTransactionDetailModal.proof_reference && (
                <div className="bg-gold/10 border border-gold/30 p-3 rounded-lg">
                  <p className="text-gold text-xs uppercase mb-1">
                    {showTransactionDetailModal.proof_type === 'utr' ? 'UTR Number' : 'Transaction Hash'}
                  </p>
                  <p className="text-gold font-mono break-all">{showTransactionDetailModal.proof_reference}</p>
                </div>
              )}

              {showTransactionDetailModal.proof_screenshot_url && (
                <div>
                  <p className="text-white/50 text-xs mb-2">Payment Screenshot</p>
                  <a href={showTransactionDetailModal.proof_screenshot_url} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={showTransactionDetailModal.proof_screenshot_url} 
                      alt="Proof" 
                      className="max-w-full rounded-lg border border-white/20"
                    />
                  </a>
                </div>
              )}

              {showTransactionDetailModal.description && (
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-white/50 text-xs">Description</p>
                  <p className="text-white">{showTransactionDetailModal.description}</p>
                </div>
              )}

              {showTransactionDetailModal.status === 'pending' && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => { handleApproveDeposit(showTransactionDetailModal); setShowTransactionDetailModal(null); }}
                    className="flex-1 py-3 bg-green-500 text-white font-semibold rounded-lg"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => { handleRejectDeposit(showTransactionDetailModal); setShowTransactionDetailModal(null); }}
                    className="flex-1 py-3 bg-red-500/20 text-red-400 font-semibold rounded-lg"
                  >
                    ✗ Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Balance Modal */}
      {showAddBalanceModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowAddBalanceModal(null)} />
          <div className="relative bg-[#1A1A1A] border border-gold/20 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-white text-lg mb-4">Add Balance to User</h3>
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
              <button 
                onClick={() => handleAddBalance(showAddBalanceModal)} 
                disabled={actionLoading === showAddBalanceModal}
                className="flex-1 py-3 bg-green-500 text-white font-semibold rounded-lg disabled:opacity-50"
              >
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
            <input
              type="number"
              placeholder="Max uses (empty = unlimited)"
              value={newPromo.max_uses || ''}
              onChange={(e) => setNewPromo({ ...newPromo, max_uses: Number(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowPromoModal(false)} className="flex-1 py-3 border border-white/20 text-white rounded-lg">
                Cancel
              </button>
              <button onClick={handleCreatePromo} className="flex-1 py-3 bg-gold text-black font-semibold rounded-lg">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
