import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Currency, User } from '../types';
import { currencies } from '../data/platforms';

interface Order {
  id: string;
  platform: string;
  platformIcon: string;
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
  statusHistory: { status: string; timestamp: Date; note?: string }[];
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'payment' | 'refund' | 'bonus';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: Date;
  orderId?: string;
}

interface AppContextType {
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  
  // Currency
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  
  // Wallet
  balance: number;
  addFunds: (amount: number) => void;
  deductFunds: (amount: number) => boolean;
  
  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => string;
  updateOrderStatus: (orderId: string, status: Order['status'], note?: string) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
  
  // Transactions
  transactions: Transaction[];
  
  // Promo Codes
  appliedPromo: { code: string; discount: number; type: 'percent' | 'fixed' } | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  clearPromo: () => void;
  
  // UI State
  showAuth: boolean;
  setShowAuth: (show: boolean) => void;
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  cookieConsent: boolean;
  setCookieConsent: (consent: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Valid promo codes
const PROMO_CODES: { [key: string]: { discount: number; type: 'percent' | 'fixed'; minOrder?: number; maxUses?: number } } = {
  'WELCOME10': { discount: 10, type: 'percent' },
  'FIRST20': { discount: 20, type: 'percent', minOrder: 50 },
  'FLAT5': { discount: 5, type: 'fixed' },
  'VIP25': { discount: 25, type: 'percent', minOrder: 100 },
  'PDORQ50': { discount: 50, type: 'percent', minOrder: 200 },
  'SAVE15': { discount: 15, type: 'percent' },
  'NEWUSER': { discount: 30, type: 'percent' },
};

export function AppProvider({ children }: { children: ReactNode }) {
  // User state
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState(0);
  
  // Currency
  const [currency, setCurrency] = useState<Currency>(currencies[0]);
  
  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      title: 'Welcome to Pdorq!',
      message: 'Start by placing your first order and get exclusive discounts.',
      read: false,
      createdAt: new Date(),
    }
  ]);
  
  // Transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Promo
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; type: 'percent' | 'fixed' } | null>(null);
  
  // UI State
  const [showAuth, setShowAuth] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cookieConsent') === 'true';
    }
    return false;
  });

  // Save cookie consent to localStorage
  useEffect(() => {
    if (cookieConsent) {
      localStorage.setItem('cookieConsent', 'true');
    }
  }, [cookieConsent]);

  // Format price based on currency
  const formatPrice = (price: number): string => {
    const converted = price * currency.rate;
    if (currency.code === 'JPY') {
      return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  // Wallet functions
  const addFunds = (amount: number) => {
    setBalance(prev => prev + amount);
    setTransactions(prev => [{
      id: `TXN-${Date.now()}`,
      type: 'deposit',
      amount,
      description: 'Wallet top-up',
      status: 'completed',
      createdAt: new Date(),
    }, ...prev]);
    
    addNotification({
      type: 'success',
      title: 'Funds Added',
      message: `$${amount.toFixed(2)} has been added to your wallet.`,
    });
  };

  const deductFunds = (amount: number): boolean => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      return true;
    }
    return false;
  };

  // Order functions
  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>): string => {
    const orderId = `PDQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const now = new Date();
    
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: now,
      updatedAt: now,
      statusHistory: [{ status: 'pending', timestamp: now, note: 'Order placed' }],
    };
    
    setOrders(prev => [newOrder, ...prev]);
    
    // Add transaction
    setTransactions(prev => [{
      id: `TXN-${Date.now()}`,
      type: 'payment',
      amount: -orderData.finalPrice,
      description: `Order ${orderId} - ${orderData.service}`,
      status: 'completed',
      createdAt: now,
      orderId,
    }, ...prev]);
    
    // Add notification
    addNotification({
      type: 'success',
      title: 'Order Placed!',
      message: `Your order ${orderId} has been submitted successfully.`,
    });
    
    return orderId;
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], note?: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status,
          updatedAt: new Date(),
          statusHistory: [...order.statusHistory, { status, timestamp: new Date(), note }],
        };
      }
      return order;
    }));
  };

  // Notification functions
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    setNotifications(prev => [{
      ...notification,
      id: `NOTIF-${Date.now()}`,
      createdAt: new Date(),
      read: false,
    }, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Promo code functions
  const applyPromoCode = (code: string): { success: boolean; message: string } => {
    const upperCode = code.toUpperCase().trim();
    
    if (appliedPromo) {
      return { success: false, message: 'A promo code is already applied.' };
    }
    
    const promo = PROMO_CODES[upperCode];
    
    if (!promo) {
      return { success: false, message: 'Invalid promo code.' };
    }
    
    setAppliedPromo({ code: upperCode, discount: promo.discount, type: promo.type });
    
    addNotification({
      type: 'success',
      title: 'Promo Applied!',
      message: `${promo.type === 'percent' ? promo.discount + '%' : '$' + promo.discount} discount applied.`,
    });
    
    return { 
      success: true, 
      message: `${promo.type === 'percent' ? promo.discount + '% off' : '$' + promo.discount + ' off'} applied!` 
    };
  };

  const clearPromo = () => {
    setAppliedPromo(null);
  };

  const value: AppContextType = {
    user,
    setUser,
    isAuthenticated: user !== null,
    currency,
    setCurrency,
    formatPrice,
    balance,
    addFunds,
    deductFunds,
    orders,
    addOrder,
    updateOrderStatus,
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    unreadCount,
    transactions,
    appliedPromo,
    applyPromoCode,
    clearPromo,
    showAuth,
    setShowAuth,
    showChat,
    setShowChat,
    cookieConsent,
    setCookieConsent,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
