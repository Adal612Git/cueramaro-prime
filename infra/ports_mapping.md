# Mapeo de Puertos — Cuerámaro Prime

- PostgreSQL: host `55432` -> container `5432`
- Redis:     host `6380`  -> container `6379`
- API (Nest): host `3001` -> container `3001`
- Web (Vite): host `5173` -> container `5173`

Notas:
- Se evita conflicto con `6379` en host reasignando Redis a `6380`.
- Los servicios internos se conectan por nombre de servicio (p.ej. `redis:6379`).

