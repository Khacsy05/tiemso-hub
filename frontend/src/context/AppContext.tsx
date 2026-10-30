import React, { createContext, useContext, useState, useEffect } from 'react';
import { POPULAR_BANKS } from '../constants/banks';

export interface ShopProfile {
  shopName: string;
  tagline: string;
  hotline: string;
  address: string;
  bankBin: string;
  bankName: string;
  accountNo: string;
  accountName: string;
  wifiSSID: string;
  wifiPassword: string;
}

const DEFAULT_PROFILE: ShopProfile = {
  shopName: 'Tiệm Cà Phê Số',
  tagline: 'Cà phê nguyên chất & Đồ uống healthy',
  hotline: '0988 123 456',
  address: '123 Đường Cầu Giấy, Cầu Giấy, Hà Nội',
  bankBin: '970436', // Vietcombank
  bankName: 'Vietcombank',
  accountNo: '1029384756',
  accountName: 'NGUYEN VAN A',
  wifiSSID: 'TiemSo_Coffee_5G',
  wifiPassword: 'tiemso@coffee2026'
};

interface AppContextType {
  profile: ShopProfile;
  updateProfile: (data: Partial<ShopProfile>) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  coffeeModalOpen: boolean;
  setCoffeeModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ShopProfile>(DEFAULT_PROFILE);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coffeeModalOpen, setCoffeeModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tiemso_profile');
      if (saved) {
        setProfile(prev => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const updateProfile = (data: Partial<ShopProfile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...data };
      if (data.bankBin && !data.bankName) {
        const bank = POPULAR_BANKS.find(b => b.bin === data.bankBin);
        if (bank) updated.bankName = bank.shortName;
      }
      try {
        localStorage.setItem('tiemso_profile', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        mobileMenuOpen,
        setMobileMenuOpen,
        coffeeModalOpen,
        setCoffeeModalOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
