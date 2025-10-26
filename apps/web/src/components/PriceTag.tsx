import React from 'react';
import { colors, type as typeScale } from '../design/tokens';

export type PriceTagProps = {
  pricePerKg: number;
  currency?: 'MXN' | 'USD';
  size?: 'sm' | 'md' | 'lg';
  emphasis?: boolean;
};

export function PriceTag({
  pricePerKg,
  currency = 'MXN',
  size = 'md',
  emphasis = true,
}: PriceTagProps) {
  const symbol = currency === 'USD' ? 'US$' : '$';
  const fontSize = size === 'sm' ? typeScale.h3 : size === 'lg' ? typeScale.h2 : typeScale.price;
  const color = emphasis ? colors.brand : colors.ink;
  const weight = emphasis ? 700 : 600;
  const display = `${symbol}${pricePerKg}/kg`;
  return (
    <div
      style={{ marginTop: 4, color, fontWeight: 700, fontSize }}
      aria-label={`Precio por kilo: ${display}`}
    >
      {display}
    </div>
  );
}
