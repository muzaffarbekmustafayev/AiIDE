import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import IdePage from './pages/IdePage';
import LandingPage from './pages/LandingPage';
import TerminalOnlyPage from './pages/TerminalOnlyPage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ide" element={<IdePage />} />
        <Route path="/terminal" element={<TerminalOnlyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;