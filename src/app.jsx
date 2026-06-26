//import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import LoginPage              from './components/LoginPage';
import ETourneyDashboard      from './components/ETourneyDashboard';
import TournamentsPage        from './components/TournamentsPage';
import TeamsPage              from './components/TeamsPage';
import PaymentsPage           from './components/PaymentsPage';
import UsersPage              from './components/UsersPage';
import SettingsPage           from './components/SettingsPage';
import UserDashboard          from './components/UserDashboard';
import HomePage               from './components/HomePage';
import RegisterPage           from './components/RegisterPage';
import TournamentBracketPage  from './components/TournamentBracketPage';

axios.defaults.baseURL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";
const token = localStorage.getItem('auth_token');
if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

const getUser  = () => JSON.parse(localStorage.getItem('auth_user') || 'null');
const getRole  = () => getUser()?.role ?? null;
const isLogged = () => !!localStorage.getItem('auth_token');

// ── Guards ────────────────────────────────────────────────────────────────────

const PrivateRoute = ({ children }) =>
  isLogged() ? children : <Navigate to="/login" replace />;

const StaffRoute = ({ children }) => {
  if (!isLogged()) return <Navigate to="/login" replace />;
  const role = getRole();
  if (role === 'user' || role === 'peserta') return <Navigate to="/home" replace />;
  return children;
};

const AdminOnlyRoute = ({ children }) => {
  if (!isLogged()) return <Navigate to="/login" replace />;
  const role = getRole();
  if (role === 'user' || role === 'peserta') return <Navigate to="/home" replace />;
  if (role === 'panitia') return <Navigate to="/dashboard" replace />;
  return children;
};

// Logic: Jika belum login tampilkan HomePage, jika sudah login redirect ke dashboard masing-masing
const RootRedirect = () => {
  if (!isLogged()) return <HomePage />; 
  const role = getRole();
  return (role === 'user' || role === 'peserta')
    ? <Navigate to="/home" replace />
    : <Navigate to="/dashboard" replace />;
};

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rute Publik */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin & Panitia */}
        <Route path="/dashboard"   element={<StaffRoute><ETourneyDashboard /></StaffRoute>} />
        <Route path="/tournaments" element={<StaffRoute><TournamentsPage /></StaffRoute>} />
        <Route path="/teams"       element={<StaffRoute><TeamsPage /></StaffRoute>} />
        <Route path="/payments"    element={<StaffRoute><PaymentsPage /></StaffRoute>} />

        {/* Hanya Admin */}
        <Route path="/users"    element={<AdminOnlyRoute><UsersPage /></AdminOnlyRoute>} />
        <Route path="/settings" element={<AdminOnlyRoute><SettingsPage /></AdminOnlyRoute>} />

        {/* User biasa (Peserta) */}
        <Route path="/home" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />

        {/* Bracket Turnamen — accessible oleh semua user yang sudah login */}
        <Route path="/tournaments/:id/bracket" element={<PrivateRoute><TournamentBracketPage /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);