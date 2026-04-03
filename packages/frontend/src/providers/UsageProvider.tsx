'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface UsageStatus {
  usageCount: number;
  dailyLimit: number;
  isLimitReached: boolean;
}

interface UsageContextType extends UsageStatus {
  refreshUsage: () => Promise<void>;
}

const UsageContext = createContext<UsageContextType | undefined>(undefined);

export const UsageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<UsageStatus>({
    usageCount: 0,
    dailyLimit: 10,
    isLimitReached: false,
  });

  const refreshUsage = async () => {
    try {
      const response = await fetch('/api/usage/status');
      if (response.ok) {
        const data = await response.json();
        setStatus({
          usageCount: data.usageCount,
          dailyLimit: data.dailyLimit,
          isLimitReached: data.isLimitReached,
        });
      }
    } catch (error) {
      console.error('Failed to fetch usage status:', error);
    }
  };

  useEffect(() => {
    refreshUsage();
  }, []);

  return (
    <UsageContext.Provider value={{ ...status, refreshUsage }}>
      {children}
    </UsageContext.Provider>
  );
};

export const useUsageLimit = () => {
  const context = useContext(UsageContext);
  if (context === undefined) {
    throw new Error('useUsageLimit must be used within a UsageProvider');
  }
  return context;
};
