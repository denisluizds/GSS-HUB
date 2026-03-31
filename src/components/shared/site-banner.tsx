"use client";

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/lib/hooks';
import { Banner } from '@/lib/types';
import { getBanners } from '@/lib/data';
import { X, Bell, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function SiteBanner() {
  const { isBannerVisible, setBannerVisible } = useAppContext();
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      const b = await getBanners();
      const activeBanners = b.filter(banner => banner.isActive);
      setBanners(activeBanners);
      if (activeBanners.length === 0) {
        setBannerVisible(false);
      }
    };
    fetchBanners();
  }, [setBannerVisible]);

  if (banners.length === 0 || !isBannerVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="fixed top-0 left-0 w-full bg-primary text-white z-[45] overflow-hidden shadow-lg border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center animate-pulse">
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black tracking-tight leading-tight">
                {banners[0].message}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs font-bold bg-white/10 hover:bg-white/20 border-none text-white rounded-full px-4"
            >
              Saiba mais
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:bg-white/10 text-white rounded-full"
              onClick={() => setBannerVisible(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Animated background element */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      </motion.div>
    </AnimatePresence>
  );
}
