import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '../safety/ErrorBoundary';
import {
  Home,
  Truck,
  ShoppingCart,
  Package,
  Users,
  BarChart,
  Plus,
  RefreshCw,
  Beef,
} from 'lucide-react';

const navigation = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/proveedores', label: 'Proveedores', icon: Truck },
  { to: '/compras', label: 'Compras', icon: ShoppingCart },
  { to: '/inventario', label: 'Inventario', icon: Package },
  { to: '/ventas-pos', label: 'Ventas POS', icon: ShoppingCart },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/reportes', label: 'Reportes', icon: BarChart },
];

export default function AppLayout() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#f8fafc',
        color: '#0f172a',
        fontFamily: 'system-ui,Segoe UI,Roboto,Inter,sans-serif',
      }}
    >
      <header
        style={{
          background: '#1e40af',
          color: '#fff',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 18 }}
        >
          <Beef size={22} aria-hidden />
          <span>CuerÃ¡maro Prime</span>
          <span style={{ opacity: 0.8, fontSize: 14 }}>PWA Â· v1.0</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'rgba(255,255,255,.2)',
              color: '#fff',
              border: 'none',
              padding: '8px 12px',
              borderRadius: 6,
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={16} aria-hidden /> Actualizar
          </button>
          <button
            onClick={() => navigate('/ventas/nueva')}
            style={{
              background: '#f59e0b',
              color: '#fff',
              border: 'none',
              padding: '8px 12px',
              borderRadius: 6,
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            <Plus size={16} aria-hidden /> Nueva Venta
          </button>
        </div>
      </header>

      <div
        style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, padding: 24, flex: 1 }}
      >
        <nav
          aria-label="MenÃº principal"
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: 8,
            boxShadow: '0 1px 3px rgba(0,0,0,.08)',
            height: 'fit-content',
          }}
        >
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                color: isActive ? '#1e40af' : '#475569',
                background: isActive ? '#eff6ff' : 'transparent',
                fontWeight: isActive ? 600 : 400,
                marginBottom: 4,
              })}
            >
              <Icon size={18} aria-hidden />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <main role="main" style={{ minHeight: '60vh' }}>
          <ErrorBoundary>
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </ErrorBoundary>
        </main>
      </div>

      <footer
        role="contentinfo"
        style={{
          textAlign: 'center',
          padding: 16,
          color: '#64748b',
          fontSize: 14,
          borderTop: '1px solid #e2e8f0',
        }}
      >
        Â© 2025 CuerÃ¡maro Prime
      </footer>
    </div>
  );
}
