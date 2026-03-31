"use client";

import React from 'react';
import { AppProvider } from '@/lib/store';
import { Header } from '@/components/shared/header';
import { MainSidebar } from '@/components/main-sidebar';
import { Toaster } from '@/components/ui/sonner';
import { Calculator } from '@/components/shared/calculator';
import { SearchModal } from '@/components/shared/search-modal';
import { AdminLoginModal } from '@/components/admin/admin-login-modal';
import { AiChat } from '@/components/ai/ai-chat';
import { AiChatButton } from '@/components/ai/ai-chat-button';
import { SuggestionModal } from '@/components/shared/suggestion-modal';
import { SiteBanner } from '@/components/shared/site-banner';
import { useLocation } from 'react-router-dom';

export function RootLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AppProvider>
      <div className="min-h-screen bg-background font-sans antialiased">
        <SiteBanner />
        <Header />
        <MainSidebar />
        {children}
        <Toaster />
        <Calculator />
        <SearchModal />
        <AdminLoginModal />
        <AiChat />
        <AiChatButton />
        <SuggestionModal />
      </div>
    </AppProvider>
  );
}
