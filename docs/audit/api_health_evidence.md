# Evidencia de Salud API

Objetivo: Capturar evidencia de que la API responde correctamente.

Comandos (salida cruda, sin editar):
```
# Health endpoint
curl -s -i http://localhost:3001/health

# Servicios en ejecución
docker compose -f infra/docker-compose.yml ps
```

Resultados esperados:
- Código HTTP 200 en `/health`.
- Servicios `postgres`, `redis`, `api`, `web` en `Up` y `healthy` donde aplique.

Observaciones:
- ...

