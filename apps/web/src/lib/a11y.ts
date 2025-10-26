import type { RefObject } from 'react';

export function trapFocus(containerRef: RefObject<HTMLElement | null>) {
  const container = containerRef.current;
  if (!container) return;

  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([type="hidden"]):not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ];
  const focusable = Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelectors.join(','))
  );

  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown);

  return () => container.removeEventListener('keydown', handleKeyDown);
}
