import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import DashboardPage from './pages/DashboardPage';
import ProveedoresPage from './pages/ProveedoresPage';
import ComprasPage from './pages/ComprasPage';
import InventarioPage from './pages/InventarioPage';
import VentasPOSPage from './pages/VentasPOSPage';
import ClientesPage from './pages/ClientesPage';
import ReportesPage from './pages/ReportesPage';
import NuevaVentaPage from './pages/NuevaVentaPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/proveedores" element={<ProveedoresPage />} />
        <Route path="/compras" element={<ComprasPage />} />
        <Route path="/inventario" element={<InventarioPage />} />
        <Route path="/ventas-pos" element={<VentasPOSPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/reportes" element={<ReportesPage />} />
        <Route path="/ventas/nueva" element={<NuevaVentaPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
