# Gate 0 — Checklist de Aceptación

Objetivo: Verificación mínima para aprobación de Marco Silva.

## Requisitos previos
- [ ] Docker Desktop instalado y en ejecución
- [ ] Puertos libres: 55432, 6380, 3001, 5173

Comandos de verificación (outputs crudos):
```
# Docker activo
docker info

# Puertos (Windows)
netstat -ano | findstr ":55432 :6380 :3001 :5173"
```

## Infraestructura
- [ ] Existe `infra/docker-compose.yml` válido
- [ ] `.env.example` con placeholders correctos

Evidencias:
```
ls -la infra/
cat infra/docker-compose.yml
cat .env.example
```

## Levantamiento
- [ ] `docker compose up -d --build` sin errores
- [ ] 3+ servicios Up/healthy (postgres, redis, api, web)

Comandos:
```
docker compose -f infra/docker-compose.yml up -d --build
docker compose -f infra/docker-compose.yml ps
```

## Healthchecks
- [ ] API `/health` responde 200
- [ ] Frontend sirve HTML

Comandos:
```
curl -s -i http://localhost:3001/health
curl -s http://localhost:5173 | head -n 50
```

## Seguridad
- [ ] Secrets NO están hardcodeados en el repositorio
- [ ] GitHub Secrets configurados (UI o `gh`)

Comandos / evidencias:
```
# Si usa GitHub CLI
gh auth status
gh secret list -R <owner>/<repo>
```

## Criterios de rechazo
- [ ] Algún servicio no healthy después de 2 minutos
- [ ] Conflictos de puertos no resueltos
- [ ] Evidencias incompletas o editadas
- [ ] Health checks no funcionales

---
Notas:
- Mantener formato de texto plano en evidencias.
- No incluir valores reales de secrets en reportes.
