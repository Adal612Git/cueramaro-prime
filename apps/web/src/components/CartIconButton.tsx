import { colors } from '../design/tokens';

export type CartIconButtonProps = {
  count: number;
  onClick: () => void;
};

export default function CartIconButton({ count, onClick }: CartIconButtonProps) {
  return (
    <button
      type="button"
      className="cart-icon-button"
      onClick={onClick}
      aria-label={`Abrir carrito (${count})`}
    >
      <span className="cart-icon-button__icon" aria-hidden="true">
        🛒
      </span>
      <span className="cart-icon-button__count" style={{ backgroundColor: colors.brand, color: '#fff' }}>
        {count}
      </span>
    </button>
  );
}
