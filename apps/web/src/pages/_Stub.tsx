import React from 'react';
type Props = { name: string };
export default function Stub({ name }: Props) {
  return (
    <section>
      <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>{name}</h1>
      <p style={{ color: '#6b7280' }}>MÃ³dulo de {name} (stub navegable).</p>
    </section>
  );
}
