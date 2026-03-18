import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Invoice from './Invoice';

interface UserTransactionsProps {
  isOpen: boolean;
  onClose: () => void;
  currency: { code: string; symbol: string; rate: number };
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  payment_method: string | null;
  description: string | null;
  proof_reference: string | null;
  proof_type: string | null;
  payment_amount_local: number | null;
  payment_currency: string | null;
  created_at: string;
  metadata: any;
}

interface InvoiceData {
  id: string;
  invoice_number: string;
  type: string;
  amount_usd: number;
  amount_credited: number;
  payment_method: string;
  payment_reference: string;
  payment_amount_local: number;
  payment_currency: string;
  issued_at: string;
}

export default function UserTransactions({ isOpen, onClose, currency }: UserTransactionsProps) {
  const { user, profile } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showInvoice, setShowInvoice] = useState<any>(null);

  useEffect(() => {
    if (isOpen && user) {
      fetchData();
    }
  }, [isOpen, user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    const [txResult, invResult] = await Promise.all([
      supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('issued_at', { ascending: false })
    ]);

    setTransactions(txResult.data || []);
    setInvoices(invResult.data || []);
    setLoading(false);
  };

  if (!isOpen) return null;

  const formatPrice = (amount: number) => {
    const converted = amount * currency.rate;
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-orange-500/20 text-orange-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-white/10 text-white/60';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit': return '💰';
      case 'bonus': return '🎁';
      case 'order_payment': return '🛒';
      case 'refund': return '↩️';
      case 'referral_bonus': return '👥';
      case 'withdrawal': return '📤';
      default: return '💳';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit': return 'Deposit';
      case 'bonus': return 'Bonus';
      case 'order_payment': return 'Order Payment';
      case 'refund': return 'Refund';
      case 'referral_bonus': return 'Referral Bonus';
      case 'withdrawal': return 'Withdrawal';
      default: return type;
    }
  };

  const isCredit = (type: string) => ['deposit', 'bonus', 'refund', 'referral_bonus'].includes(type);

  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'deposit', label: 'Deposits' },
    { id: 'order_payment', label: 'Payments' },
    { id: 'bonus', label: 'Bonuses' },
    { id: 'refund', label: 'Refunds' },
  ];

  const filteredTransactions = activeFilter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === activeFilter);

  // Find invoice for a transaction
  const findInvoice = (txId: string) => {
    return invoices.find(inv => inv.id === txId);
  };

  // Generate invoice data for viewing
  const viewInvoice = (tx: Transaction) => {
    const metadata = tx.metadata || {};
    
    setShowInvoice({
      invoiceNumber: `INV-${new Date(tx.created_at).getFullYear()}-${tx.id.slice(0, 6).toUpperCase()}`,
      issuedAt: tx.created_at,
      customerName: profile?.full_name || 'User',
      customerEmail: profile?.email || '',
      type: tx.type === 'order_payment' ? 'order' : 'deposit',
      amountUsd: metadata.base_amount || tx.amount,
      amountCredited: tx.amount,
      bonusAmount: (metadata.amount_bonus || 0) + (metadata.crypto_bonus || 0),
      paymentMethod: tx.payment_method || 'wallet',
      paymentReference: tx.proof_reference || '',
      paymentAmountLocal: tx.payment_amount_local || tx.amount,
      paymentCurrency: tx.payment_currency || 'USD'
    });
  };

  // Summary stats
  const totalDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const totalSpent = transactions.filter(t => t.type === 'order_payment' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const totalBonuses = transactions.filter(t => ['bonus', 'referral_bonus'].includes(t.type) && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const pendingDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'pending');

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

        <div className="relative bg-[#0D0D0D] border border-gold/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-gold/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif text-white">Transaction History</h2>
                <p className="text-white/60 text-sm">{transactions.length} transactions</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={fetchData} 
                  className="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/10"
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

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                <p className="text-green-400 text-lg font-semibold">{formatPrice(totalDeposits)}</p>
                <p className="text-green-400/60 text-xs">Deposited</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
                <p className="text-blue-400 text-lg font-semibold">{formatPrice(totalSpent)}</p>
                <p className="text-blue-400/60 text-xs">Spent</p>
              </div>
              <div className="bg-gold/10 border border-gold/20 rounded-lg p-3 text-center">
                <p className="text-gold text-lg font-semibold">{formatPrice(totalBonuses)}</p>
                <p className="text-gold/60 text-xs">Bonuses</p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {filterOptions.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all ${
                    activeFilter === filter.id
                      ? 'bg-gold text-black'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white/60">Loading transactions...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-4xl mb-4 block">📭</span>
                <p className="text-white/60">No transactions found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Pending Banner */}
                {pendingDeposits.length > 0 && activeFilter === 'all' && (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                      <p className="text-orange-400 font-medium">{pendingDeposits.length} deposit{pendingDeposits.length > 1 ? 's' : ''} awaiting verification</p>
                    </div>
                    <p className="text-orange-400/60 text-sm">Your payment is being verified. This usually takes 5-30 minutes.</p>
                  </div>
                )}

                {filteredTransactions.map(tx => (
                  <div
                    key={tx.id}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-gold/20 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-2xl">{getTypeIcon(tx.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-white font-medium">{getTypeLabel(tx.type)}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(tx.status)}`}>
                              {tx.status === 'pending' ? '⏳ Pending' : tx.status === 'completed' ? '✓ Completed' : tx.status === 'failed' ? '✗ Failed' : tx.status}
                            </span>
                          </div>
                          {tx.description && (
                            <p className="text-white/50 text-sm mt-1">{tx.description}</p>
                          )}
                          <p className="text-white/40 text-xs mt-1">{formatDate(tx.created_at)}</p>
                          
                          {/* Payment method */}
                          {tx.payment_method && (
                            <p className="text-white/50 text-xs mt-1 capitalize">
                              Via: {tx.payment_method.replace('_', ' ')}
                              {tx.payment_amount_local && tx.payment_currency && tx.payment_currency !== 'USD' && (
                                <span> • {tx.payment_currency === 'INR' ? '₹' : ''}{tx.payment_amount_local.toFixed(2)} {tx.payment_currency}</span>
                              )}
                            </p>
                          )}

                          {/* Proof reference */}
                          {tx.proof_reference && (
                            <p className="text-white/40 text-xs mt-1 font-mono">
                              {tx.proof_type === 'utr' ? 'UTR' : 'TxHash'}: {tx.proof_reference}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right flex-shrink-0">
                        <p className={`text-xl font-bold ${isCredit(tx.type) ? 'text-green-400' : 'text-red-400'}`}>
                          {isCredit(tx.type) ? '+' : '-'}{formatPrice(tx.amount)}
                        </p>
                        
                        {/* Invoice button for completed deposits and payments */}
                        {tx.status === 'completed' && ['deposit', 'order_payment'].includes(tx.type) && (
                          <button
                            onClick={() => viewInvoice(tx)}
                            className="mt-2 px-3 py-1 bg-white/10 text-white/70 text-xs rounded-lg hover:bg-white/20 flex items-center gap-1 ml-auto"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Invoice
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoice && (
        <Invoice
          data={showInvoice}
          onClose={() => setShowInvoice(null)}
        />
      )}
    </>
  );
}
