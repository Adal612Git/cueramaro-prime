import React from 'react';
export default function DashboardPage() {
  return (
    <section style={{ maxWidth: 1200 }}>
      <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>Resumen general del negocio.</p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
          gap: 12,
        }}
      >
        <div
          style={{
            background: '#fff',
            padding: 16,
            borderRadius: 8,
            boxShadow: '0 1px 3px rgba(0,0,0,.08)',
          }}
        >
          <h3 style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}>Ventas del DÃ­a</h3>
          <p style={{ fontSize: 22, fontWeight: 700 }}>$12,450 MXN</p>
        </div>
        <div
          style={{
            background: '#fff',
            padding: 16,
            borderRadius: 8,
            boxShadow: '0 1px 3px rgba(0,0,0,.08)',
          }}
        >
          <h3 style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}>Inventario Total</h3>
          <p style={{ fontSize: 22, fontWeight: 700 }}>1,568 kg</p>
        </div>
        <div
          style={{
            background: '#fff',
            padding: 16,
            borderRadius: 8,
            boxShadow: '0 1px 3px rgba(0,0,0,.08)',
          }}
        >
          <h3 style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}>Clientes Activos</h3>
          <p style={{ fontSize: 22, fontWeight: 700 }}>47</p>
        </div>
      </div>
    </section>
  );
}
