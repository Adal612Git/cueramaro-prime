import { colors } from '../design/tokens';

type PriceTagProps = {
  pricePerKg: number;
  currency?: 'MXN' | 'USD';
  size?: 'sm' | 'md' | 'lg';
  emphasis?: boolean;
};

const sizeToClass: Record<NonNullable<PriceTagProps['size']>, string> = {
  sm: 'price-tag price-tag--sm',
  md: 'price-tag price-tag--md',
  lg: 'price-tag price-tag--lg',
};

export default function PriceTag({
  pricePerKg,
  currency = 'MXN',
  size = 'md',
  emphasis = false,
}: PriceTagProps) {
  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <span
      className={sizeToClass[size]}
      style={{ color: emphasis ? colors.brand : colors.ink, fontWeight: emphasis ? 700 : 600 }}
    >
      {`${formatter.format(pricePerKg)}/kg`}
    </span>
  );
}
