import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { orderApi } from '../lib/api';
import type { Order } from '../lib/database.types';
import type { Currency } from '../data/currencies';
import { currencies } from '../data/currencies';

export function useAppState() {
  const { user, profile, wallet, loading: authLoading, signOut, addFunds, refreshWallet } = useAuth();
  
  // UI State
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [showAuth, setShowAuth] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showLegal, setShowLegal] = useState<string | null>(null);
  
  // Data State
  const [orders, setOrders] = useState<Order[]>([]);
  const [currency, setCurrency] = useState<Currency>(currencies[0]);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Fetch orders when user logs in
  useEffect(() => {
    if (user) {
      orderApi.getAll(user.id).then(setOrders);
    } else {
      setOrders([]);
    }
  }, [user]);

  // Convert user data for components
  const appUser = profile ? {
    name: profile.full_name || 'User',
    email: profile.email,
    isVerified: profile.is_verified
  } : null;

  const balance = wallet?.balance || 0;

  // Navigation with login check
  const navigateToOrder = (platform?: string, service?: string) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    if (platform) setSelectedPlatform(platform);
    if (service) setSelectedService(service);
    setCurrentPage('order');
  };

  // Handle order submission
  const handleOrderSubmit = async (orderData: any) => {
    if (!user) return;
    
    const { data: newOrder, error } = await orderApi.create({
      user_id: user.id,
      platform: orderData.platform,
      service: orderData.service,
      target_url: orderData.targetUrl,
      urgency: orderData.urgency,
      base_price: orderData.basePrice,
      discount_percent: orderData.discountPercent,
      final_price: orderData.finalPrice,
      currency: currency.code,
      notes: orderData.notes
    });

    if (!error && newOrder) {
      setOrders(prev => [newOrder, ...prev]);
      await refreshWallet();
    }

    return { data: newOrder, error };
  };

  // Handle adding funds
  const handleAddFunds = async (amount: number, paymentMethod: string, bonus: number) => {
    const { error } = await addFunds(amount, paymentMethod, bonus);
    return { error };
  };

  return {
    // Auth
    user: appUser,
    isAuthenticated: !!user,
    userId: user?.id,
    authLoading,
    signOut,
    
    // Wallet
    balance,
    onAddFunds: handleAddFunds,
    refreshWallet,
    
    // Orders
    orders,
    onOrderSubmit: handleOrderSubmit,
    
    // Navigation
    currentPage,
    setCurrentPage,
    navigateToOrder,
    selectedPlatform,
    selectedService,
    setSelectedPlatform,
    setSelectedService,
    
    // Modals
    showAuth,
    setShowAuth,
    showSettings,
    setShowSettings,
    showWallet,
    setShowWallet,
    showOrders,
    setShowOrders,
    showLegal,
    setShowLegal,
    
    // Settings
    currency,
    setCurrency
  };
}
