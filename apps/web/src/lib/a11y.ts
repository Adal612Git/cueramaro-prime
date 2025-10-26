export const srOnly: React.CSSProperties = {
  position: 'absolute',
  left: -10000,
  top: 'auto',
  width: 1,
  height: 1,
  overflow: 'hidden',
};

export function ariaBusy(busy: boolean) {
  return busy ? { 'aria-busy': 'true' } : { 'aria-busy': 'false' };
}

export function statusProps() {
  return { role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' };
}
