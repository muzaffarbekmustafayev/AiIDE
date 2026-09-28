import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import IdePage from './pages/IdePage';
import LandingPage from './pages/LandingPage';
import TerminalOnlyPage from './pages/TerminalOnlyPage';
import { DocsPage } from './pages/DocsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Helper to scroll to top on page navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ide" element={<IdePage />} />
        <Route path="/terminal" element={<TerminalOnlyPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
