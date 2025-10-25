import React, { useState, useEffect } from 'react';

export function DashboardStats() {
  const [stats, setStats] = useState(null);
  const [alertas, setAlertas] = useState(null);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(setStats);
    
    fetch('/api/dashboard/alertas')
      .then(res => res.json())
      .then(setAlertas);
  }, []);

  if (!stats) return <div>Cargando datos en vivo...</div>;

  return (
    <div className="stats-grid">
      <div className="stat-card primary">
        <div className="stat-title">Inventario (kg)</div>
        <div className="stat-value">{stats.inventarioKg} kg</div>
        <div className="stat-note">+5% vs ayer</div>
      </div>
      <div className="stat-card secondary">
        <div className="stat-title">Ventas del día</div>
        <div className="stat-value">\</div>
        <div className="stat-note">{stats.ventasCount} transacciones</div>
      </div>
      <div className="stat-card success">
        <div className="stat-title">Clientes activos</div>
        <div className="stat-value">{stats.clientesActivos}</div>
        <div className="stat-note">{stats.cxcVencidas} pendientes</div>
      </div>
      <div className="stat-card warning">
        <div className="stat-title">Compras por recepcionar</div>
        <div className="stat-value">{stats.comprasPendientes}</div>
        <div className="stat-note">285 kg estimados</div>
      </div>

      {alertas && (
        <>
          <div className="stat-card" style={{borderLeftColor: 'var(--danger)'}}>
            <div className="stat-title">Alertas</div>
            <p style={{fontSize: '0.85rem', color: 'var(--neutral-dark)'}}>
              {alertas.alertas.map((alerta, idx) => <div key={idx}>• {alerta}</div>)}
            </p>
            <button className="btn btn-outline">Ver todas</button>
          </div>
          <div className="stat-card" style={{borderLeftColor: 'var(--secondary)'}}>
            <div className="stat-title">Actividad reciente</div>
            <p style={{fontSize: '0.85rem', color: 'var(--neutral-dark)'}}>
              {alertas.actividad.map((act, idx) => <div key={idx}>• {act}</div>)}
            </p>
            <button className="btn btn-outline">Ver historial</button>
          </div>
        </>
      )}
    </div>
  );
}