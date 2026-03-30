# Evaluación de arquitectura y plan de escalado (fintech/iGaming)

## Resumen ejecutivo

El repositorio ya tiene una base útil de MVP (separación frontend/backend, módulos de dominio y ledger), pero **todavía no está listo para producción** en iGaming: faltan garantías financieras de concurrencia, controles de seguridad por rol, estrategia operativa (migraciones/observabilidad), y una capa de frontend preparada para crecimiento funcional.

---

## 1) Análisis general del repositorio

## Fortalezas actuales

- Separación de capas de entrega: `frontend`, `backend`, `docker`, `scripts`.
- Dominio iGaming representado con módulos claros.
- Onboarding básico con seed y compose.

## Deuda técnica detectada

1. Arquitectura por módulo, pero sin separación explícita **domain/application/infrastructure**.
2. Falta de pipeline de calidad automatizado (unit/integration/e2e/load).
3. Ausencia de convención de contratos de API versionados y error model estandarizado.
4. Estado de producción no definido (runbooks, SLO/SLA, incident management).

---

## 2) Backend (NestJS)

## Evaluación de controllers/services/DTOs

- **Controllers**: claros para MVP, pero con mezcla de concerns en algunos endpoints (admin y lectura masiva).
- **Services**: concentran lógica de negocio, aunque todavía sin patrón de casos de uso explícito ni transacciones en flujos compuestos.
- **DTOs**: validación de entrada presente; falta normalizar DTOs de salida (response contracts).

## Malas prácticas / riesgos

1. Sin transacciones ACID en operaciones críticas multi-paso (wallet + apuestas + pagos).
2. Sin idempotencia de comandos financieros (`deposit`, `withdraw`, `play`).
3. Sin paginación/cursor en endpoints administrativos de alto volumen.
4. Falta segmentación por bounded context en carpetas internas de cada módulo.

## Estructura escalable propuesta

```text
backend/src/
  core/
    domain/
    application/
    infrastructure/
    shared/
  modules/
    auth/
    users/
    wallet/
    games/
    payments/
    bonuses/
    admin/
  interfaces/
    http/
    events/
  persistence/
    migrations/
    seeds/
  observability/
```

---

## 3) Frontend (Next.js)

## Evaluación actual

- Páginas clave existen (home, auth, dashboard, juegos, admin).
- Componentización inicial correcta para MVP, pero muy acoplada a páginas.
- Sin estado global de servidor (cache/invalidation/retry).

## Riesgos de escalabilidad

1. Client data layer mínima: falta React Query/SWR.
2. Falta middleware de autorización por área (`player`/`admin`).
3. UX transaccional incompleta (no hay estados robustos de error/reintento).
4. Diseño no tokenizado para evolución de marca/skins (casino whitelabel).

## Estructura recomendada

```text
frontend/src/
  app/
  features/
    auth/
    wallet/
    games/
    payments/
    admin/
  entities/
  shared/
    api/
    ui/
    hooks/
    config/
    types/
```

---

## 4) Base de datos

## Estado

Existe un modelo inicial razonable para MVP: usuarios, ledger, apuestas, juegos, pagos, bonos.

## Recomendación de esquema (siguiente iteración)

- `users`
- `wallet_accounts` (moneda + estado por cuenta)
- `ledger_transactions` (append-only)
- `ledger_transaction_lines` (si se adopta doble entrada)
- `bets`
- `game_rounds`
- `payments`
- `payment_attempts`
- `bonuses`
- `bonus_progress`

## Reglas clave

- `idempotency_key` único por comando financiero.
- Índices por `(user_id, created_at)` para historial.
- Constraints estrictos de signo/tipo de movimiento.

---

## 5) Seguridad

## Vulnerabilidades principales

1. Riesgo de sobreexposición de datos si se retorna entidad sin mapper.
2. Gestión de token en cliente aún vulnerable a XSS si se usa `localStorage`.
3. Falta hardening de gateway por entorno (CSP/HSTS/headers).
4. Falta antifraude inicial (velocity + device/IP heuristics).

## Recomendaciones

- RBAC + política por recurso.
- Sesión en cookie HttpOnly/Secure + rotación.
- Sanitización y serialización de salida por contrato.
- Auditoría de seguridad continua y logging con masking.

---

## 6) Escalabilidad

## Preparación actual

- Redis existe en infraestructura pero uso funcional limitado.
- No hay pipeline event-driven para operaciones asincrónicas.

## Estrategia propuesta

- Corto plazo: cache de catálogo, rate limits por IP/usuario, session store.
- Mediano plazo: Redis Streams/Kafka para pagos, bonus, antifraude y notificaciones.
- Largo plazo: extraer wallet/payments/risk como servicios independientes.

---

## 7) Roadmap técnico priorizado

## Corto plazo (MVP hardening, 2–6 semanas)

1. RBAC estricto y serialización segura.
2. Transacciones ACID + idempotencia.
3. Migraciones DB y observabilidad mínima.
4. Middleware frontend de acceso y errores transaccionales.

## Mediano plazo (6–16 semanas)

1. Event-driven y colas de dominio.
2. Backoffice con paginación/filtros/auditoría.
3. Testing completo (unit/integration/e2e/load).

## Largo plazo (4–12 meses)

1. Separación de servicios críticos.
2. Multi-región y resiliencia avanzada.
3. Compliance regulatorio y antifraude evolucionado.

---

## 8) Lista de problemas críticos (prioridad)

1. Concurrencia financiera sin garantías ACID completas.
2. Idempotencia ausente en comandos monetarios.
3. Operabilidad incompleta (migraciones, métricas, tracing).
4. Seguridad de sesión/frontend mejorable.
5. Escalabilidad de datos sin estrategia de partición/retención.

## Mejoras inmediatas recomendadas

- Aplicar transacciones + lock de cuenta por operación de débito.
- Añadir `idempotency-key` en API y persistir deduplicación.
- Establecer response DTOs para evitar fuga de campos sensibles.
- Integrar React Query + estrategia de errores/reintentos.
- Definir SLO de latencia y tasa de error por dominio.
