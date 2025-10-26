//  ðŸ›¡ï¸ UTILIDADES DE FORMATEO - SIN DEPENDENCIAS EXTERNAS

/**
 * Formatea nÃºmeros como moneda MXN
 */
export const formatPeso = (amount: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formatea nÃºmeros como peso en kg
 */
export const formatKg = (weight: number): string => {
  return (
    new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(weight) + ' kg'
  );
};

/**
 * Formatea fechas en espaÃ±ol
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};
