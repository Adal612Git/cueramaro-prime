# Cuerámaro Prime — Web

Interfaz web construida con React + Vite para el catálogo y carrito de Cuerámaro Prime. Incluye componentes accesibles, badge de sincronización y pruebas automatizadas.

## Requisitos

- Node.js 20+
- pnpm 9+
- Navegadores de Playwright (`pnpm exec playwright install --with-deps` la primera vez)

## Scripts

```bash
pnpm install          # instala dependencias
pnpm dev              # servidor de desarrollo en http://localhost:5173
pnpm build            # compila a producción
pnpm preview          # sirve la build
pnpm test             # ejecuta la suite de Playwright (E2E + axe + snapshots + lighthouse)
```

## Reportes

- Resultados de las pruebas: `playwright-report/`
- Auditoría axe: `docs/audit/axe.json`
- Auditoría Lighthouse: `docs/audit/lighthouse.html`
- Capturas: `docs/screenshots/`

Las pruebas generan automáticamente los reportes en la carpeta `docs/audit`. Asegúrate de adjuntar estos archivos en cada entrega.
