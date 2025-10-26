import React from 'react';
export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{ textAlign: 'center', color: '#4B5563', padding: 12 }}
    >
      <div aria-hidden="true" style={{ fontSize: 28, marginBottom: 6 }}>
        Ã°Å¸â€”â€šÃ¯Â¸Â
      </div>
      <h3>{title}</h3>
      <p>{description || 'AÃƒÂºn no hay productos disponibles'}</p>
    </div>
  );
}
