import React, { useState, useEffect, createContext, useContext } from 'react';
import { AgentSession, RecordedCase, OperationalFlow, User, UserRole } from './types';
import { INITIAL_FLOWS } from './mock-data';

interface AppContextType {
  session: AgentSession | null;
  startSession: (data: AgentSession) => void;
  updateSession: (data: Partial<AgentSession>) => void;
  endSession: () => void;
  flows: OperationalFlow[];
  cases: RecordedCase[];
  addCase: (newCase: RecordedCase) => void;
  saveFlow: (flow: OperationalFlow) => void;
  deleteFlow: (id: string) => void;
  
  // User Management
  currentUser: User | null;
  users: User[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addUser: (user: User) => void;
  deleteUser: (id: string) => void;
  isAdmin: boolean; // Helper for backward compatibility or easy checks
  
  // UI States
  calculatorState: 'closed' | 'open' | 'minimized';
  setCalculatorState: (state: 'closed' | 'open' | 'minimized') => void;
  chatState: 'closed' | 'open' | 'minimized';
  setChatState: (state: 'closed' | 'open' | 'minimized') => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isAdminLoginOpen: boolean;
  setAdminLoginOpen: (open: boolean) => void;
  isSuggestionOpen: boolean;
  setSuggestionOpen: (open: boolean) => void;
  isBannerVisible: boolean;
  setBannerVisible: (visible: boolean) => void;
  theme: 'light' | 'dark' | 'indigo';
  setTheme: (theme: 'light' | 'dark' | 'indigo') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AgentSession | null>(null);
  const [flows, setFlows] = useState<OperationalFlow[]>(INITIAL_FLOWS);
  const [cases, setCases] = useState<RecordedCase[]>([]);
  
  // User Management
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // UI States
  const [calculatorState, setCalculatorState] = useState<'closed' | 'open' | 'minimized'>('closed');
  const [chatState, setChatState] = useState<'closed' | 'open' | 'minimized'>('closed');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isAdminLoginOpen, setAdminLoginOpen] = useState(false);
  const [isSuggestionOpen, setSuggestionOpen] = useState(false);
  const [isBannerVisible, setBannerVisible] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark' | 'indigo'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('gss_theme') as 'light' | 'dark' | 'indigo';
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark', 'theme-indigo');
    if (theme === 'indigo') {
      document.documentElement.classList.add('theme-indigo');
    } else {
      document.documentElement.classList.add(theme);
    }
    localStorage.setItem('gss_theme', theme);
  }, [theme]);

  useEffect(() => {
    // Load Users
    const savedUsers = localStorage.getItem('gss_users');
    let currentUsers: User[] = [];
    if (savedUsers) {
      try {
        currentUsers = JSON.parse(savedUsers);
      } catch (e) {
        console.error("Error parsing users", e);
      }
    }

    // Ensure default users exist
    const defaultAdmin: User = {
      id: '1',
      username: 'admin',
      password: 'admin',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    const admGss: User = {
      id: '2',
      username: 'admgss',
      password: 'GSS2026',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    const administrador: User = {
      id: '3',
      username: 'administrador',
      password: 'GSS2026',
      role: 'admin',
      createdAt: new Date().toISOString()
    };

    if (currentUsers.length === 0) {
      currentUsers = [defaultAdmin, admGss, administrador];
    } else {
      // Check if admgss exists, if not add it
      if (!currentUsers.find(u => u.username === 'admgss')) {
        currentUsers.push(admGss);
      }
      // Check if administrador exists, if not add it
      if (!currentUsers.find(u => u.username === 'administrador')) {
        currentUsers.push(administrador);
      }
    }
    
    setUsers(currentUsers);
    localStorage.setItem('gss_users', JSON.stringify(currentUsers));

    const savedFlows = localStorage.getItem('gss_flows');
    if (savedFlows) {
      try {
        setFlows(JSON.parse(savedFlows));
      } catch (e) {
        console.error("Error parsing flows", e);
      }
    }

    const savedCases = localStorage.getItem('gss_cases');
    if (savedCases) {
      try {
        setCases(JSON.parse(savedCases));
      } catch (e) {
        console.error("Error parsing cases", e);
      }
    }

    const activeSession = sessionStorage.getItem('gss_session');
    if (activeSession) {
      try {
        setSession(JSON.parse(activeSession));
      } catch (e) {
        console.error("Error parsing session", e);
      }
    }

    const savedUser = sessionStorage.getItem('gss_current_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing current user", e);
      }
    }
  }, []);

  const startSession = (data: AgentSession) => {
    setSession(data);
    sessionStorage.setItem('gss_session', JSON.stringify(data));
  };

  const updateSession = (data: Partial<AgentSession>) => {
    if (!session) return;
    const updated = { ...session, ...data };
    setSession(updated);
    sessionStorage.setItem('gss_session', JSON.stringify(updated));
  };

  const endSession = () => {
    setSession(null);
    sessionStorage.removeItem('gss_session');
  };

  const addCase = (newCase: RecordedCase) => {
    const updated = [newCase, ...cases];
    setCases(updated);
    localStorage.setItem('gss_cases', JSON.stringify(updated));
  };

  const saveFlow = (flow: OperationalFlow) => {
    setFlows(prev => {
      const exists = prev.find(f => f.id === flow.id);
      let updated;
      if (exists) {
        updated = prev.map(f => f.id === flow.id ? flow : f);
      } else {
        updated = [...prev, flow];
      }
      localStorage.setItem('gss_flows', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteFlow = (id: string) => {
    setFlows(prev => {
      const updated = prev.filter(f => f.id !== id);
      localStorage.setItem('gss_flows', JSON.stringify(updated));
      return updated;
    });
  };

  // User Management Implementation
  const login = (username: string, password: string) => {
    // Check for master admin password for backward compatibility
    if (username === 'admin' && password === 'GSS2026') {
      const masterAdmin: User = {
        id: 'master',
        username: 'admin',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      setCurrentUser(masterAdmin);
      sessionStorage.setItem('gss_current_user', JSON.stringify(masterAdmin));
      return true;
    }

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      sessionStorage.setItem('gss_current_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('gss_current_user');
  };

  const addUser = (user: User) => {
    const updated = [...users, user];
    setUsers(updated);
    localStorage.setItem('gss_users', JSON.stringify(updated));
  };

  const deleteUser = (id: string) => {
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    localStorage.setItem('gss_users', JSON.stringify(updated));
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AppContext.Provider value={{ 
      session, startSession, updateSession, endSession, 
      flows, cases, addCase, saveFlow, deleteFlow,
      currentUser, users, login, logout, addUser, deleteUser, isAdmin,
      calculatorState, setCalculatorState,
      chatState, setChatState,
      isSidebarOpen, setSidebarOpen,
      isSearchOpen, setSearchOpen,
      isAdminLoginOpen, setAdminLoginOpen,
      isSuggestionOpen, setSuggestionOpen,
      isBannerVisible, setBannerVisible,
      theme, setTheme
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
