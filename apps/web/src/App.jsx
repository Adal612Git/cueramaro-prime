import React, { useState } from "react";
import "./App.css";

function App() {
  const [stats, setStats] = useState({
    inventario: 1568,
    ventas: 22890,
    clientes: 47,
    comprasPendientes: 4
  });

  const [ventas, setVentas] = useState([
    { id: 1, producto: "Res Premium", cantidad: 25, total: 1250, fecha: "2024-01-24" },
    { id: 2, producto: "Cerdo", cantidad: 15, total: 750, fecha: "2024-01-24" },
    { id: 3, producto: "Pollo", cantidad: 30, total: 900, fecha: "2024-01-24" }
  ]);

  const actualizarDatos = () => {
    setStats(prev => ({
      inventario: prev.inventario + Math.floor(Math.random() * 50),
      ventas: prev.ventas + Math.floor(Math.random() * 1000),
      clientes: prev.clientes + 1,
      comprasPendientes: Math.max(1, prev.comprasPendientes - 1)
    }));
  };

  const nuevaVenta = () => {
    const nueva = {
      id: ventas.length + 1,
      producto: "Producto " + (ventas.length + 1),
      cantidad: Math.floor(Math.random() * 50) + 5,
      total: Math.floor(Math.random() * 2000) + 500,
      fecha: new Date().toISOString().split('T')[0]
    };
    setVentas(prev => [nueva, ...prev]);
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">??</span>
            <div>
              <h1>Cuerámaro Prime</h1>
              <div className="version">Frontend PWA · v0.1.0</div>
            </div>
          </div>
          <div className="user-info">
            <div className="avatar">JA</div>
            <div className="user-details">
              <div className="user-name">Jefe de Almacén</div>
              <div className="user-status">Sesión activa</div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="main-layout">
        {/* SIDEBAR */}
        <nav className="sidebar">
          <div className="nav-section">
            <div className="nav-title">MENÚ PRINCIPAL</div>
            <a href="#" className="nav-item active">
              <span className="nav-icon">??</span>
              Dashboard
            </a>
            <a href="#" className="nav-item">
              <span className="nav-icon">??</span>
              Proveedores
            </a>
            <a href="#" className="nav-item">
              <span className="nav-icon">??</span>
              Compras
            </a>
            <a href="#" className="nav-item">
              <span className="nav-icon">??</span>
              Inventario
            </a>
            <a href="#" className="nav-item">
              <span className="nav-icon">??</span>
              Ventas POS
            </a>
            <a href="#" className="nav-item">
              <span className="nav-icon">??</span>
              Clientes
            </a>
            <a href="#" className="nav-item">
              <span className="nav-icon">??</span>
              Reportes
            </a>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className="content">
          {/* DASHBOARD HEADER */}
          <div className="dashboard-header">
            <div className="dashboard-title">
              <h2>Dashboard Principal</h2>
              <p>Resumen ejecutivo del negocio</p>
            </div>
            <div className="header-actions">
              <button className="btn btn-outline" onClick={actualizarDatos}>
                <span className="btn-icon">??</span>
                Actualizar
              </button>
              <button className="btn btn-primary" onClick={nuevaVenta}>
                <span className="btn-icon">?</span>
                Nueva Venta
              </button>
            </div>
          </div>

          {/* STATS GRID */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">??</div>
              <div className="stat-content">
                <div className="stat-value">{stats.inventario} kg</div>
                <div className="stat-label">Inventario Total</div>
                <div className="stat-trend positive">+5%</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">??</div>
              <div className="stat-content">
                <div className="stat-value">${stats.ventas.toLocaleString()}</div>
                <div className="stat-label">Ventas del Día</div>
                <div className="stat-trend positive">+12%</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">??</div>
              <div className="stat-content">
                <div className="stat-value">{stats.clientes}</div>
                <div className="stat-label">Clientes Activos</div>
                <div className="stat-trend positive">+3</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">??</div>
              <div className="stat-content">
                <div className="stat-value">{stats.comprasPendientes}</div>
                <div className="stat-label">Compras Pendientes</div>
                <div className="stat-trend negative">-1</div>
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="section">
            <div className="section-header">
              <h3>Ventas Recientes</h3>
              <button className="btn btn-primary" onClick={nuevaVenta}>
                <span className="btn-icon">??</span>
                Registrar Venta
              </button>
            </div>
            <div className="sales-list">
              {ventas.map(venta => (
                <div key={venta.id} className="sale-item">
                  <div className="sale-info">
                    <div className="sale-product">{venta.producto}</div>
                    <div className="sale-meta">{venta.cantidad} kg • {venta.fecha}</div>
                  </div>
                  <div className="sale-amount">${venta.total}</div>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="section">
            <div className="section-header">
              <h3>Acciones Rápidas</h3>
            </div>
            <div className="actions-grid">
              <button className="action-btn">
                <span className="action-icon">??</span>
                <span>Entrada Inventario</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">??</span>
                <span>Gestionar Proveedores</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">??</span>
                <span>Ver Reportes</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">??</span>
                <span>Clientes</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
