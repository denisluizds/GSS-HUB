import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RootLayout } from './app/layout';
import Home from './app/page';
import { PageWrapper } from './components/page-wrapper';
import { MatrizDashboard } from './components/matriz/MatrizDashboard';
import { FlowBuilder } from './components/matriz/FlowBuilder';
import { AvisosHub } from './components/AvisosHub';

import AdminPanel from './components/admin/AdminPanel';

// Simple placeholder components for other pages
const PoliciesPage = () => <PageWrapper><h1 className="text-3xl font-black">Políticas e Procedimentos</h1><p className="mt-4 text-muted-foreground italic">Em desenvolvimento...</p></PageWrapper>;
const LearningPage = () => <PageWrapper><h1 className="text-3xl font-black">Fast Learning</h1><p className="mt-4 text-muted-foreground italic">Em desenvolvimento...</p></PageWrapper>;

function App() {
  return (
    <Router>
      <RootLayout>
        <Routes>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/avisos" element={<PageWrapper><AvisosHub /></PageWrapper>} />
          <Route path="/matriz" element={<PageWrapper><Home /></PageWrapper>} /> {/* Home also contains FlowEngine */}
          <Route path="/politicas" element={<PoliciesPage />} />
          <Route path="/fast-learning" element={<LearningPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<PageWrapper><AdminPanel /></PageWrapper>} />
          <Route path="/admin/dashboard" element={<PageWrapper><AdminPanel /></PageWrapper>} />
          <Route path="/admin/fluxos" element={<PageWrapper><AdminPanel /></PageWrapper>} />
          <Route path="/admin/config" element={<PageWrapper><AdminPanel /></PageWrapper>} />
        </Routes>
      </RootLayout>
    </Router>
  );
}

export default App;
