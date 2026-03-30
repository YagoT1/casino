# Auditoría técnica profunda — Plataforma iGaming (estado actual)

Fecha: 2026-03-29

## 1) Análisis general del repositorio

### Hallazgos críticos

1. **No hay separación por capas de aplicación (Domain / Application / Infrastructure).**
   - El backend está organizado por módulos funcionales, pero la lógica de negocio se mezcla directamente con persistencia y transporte HTTP.
   - Impacto: difícil testear, alto acoplamiento, complejidad creciente al escalar.

2. **El repositorio no incluye pipeline de calidad mínima.**
   - No hay tests unitarios/integración/e2e ni CI/CD.
   - Impacto: riesgo alto de regresiones en wallet, pagos y juego.

3. **Configuración de entorno insegura para producción.**
   - Variables sensibles con defaults débiles y `synchronize: true` en ORM.
   - Impacto: drift de esquema, pérdida/corrupción de datos en despliegues.

4. **Observabilidad insuficiente.**
   - No hay trazabilidad distribuida, métricas de negocio ni health checks.
   - Impacto: incidentes difíciles de detectar y resolver bajo carga.

### Organización actual

- Separación física frontend/backend existe y es correcta para MVP.
- Faltan artefactos enterprise: `docs/adr`, `ops/`, `helm/terraform`, `tests/`, `migrations/` y políticas de branching/release.

---

## 2) Backend (NestJS) — evaluación profunda

### Lo que está bien

- Módulos funcionales por dominio (`auth`, `users`, `wallet`, `games`, `payments`, `bonuses`, `admin`).
- DTOs y `ValidationPipe` global habilitados.
- JWT + bcrypt + rate limiting básico.

### Problemas críticos detectados

1. **Control de acceso administrativo incompleto (IDOR / privilege escalation).**
   - `admin/*` sólo usa `JwtAuthGuard`, no hay guard de roles.
   - Cualquier usuario autenticado puede consultar usuarios, apuestas y balances.
   - Severidad: **Crítica**.

2. **Exposición de datos sensibles de usuario.**
   - Endpoint `/users/me` retorna entidad completa; incluye `passwordHash`.
   - Severidad: **Crítica**.

3. **Inconsistencia financiera por falta de transacciones ACID multi-operación.**
   - En `resolveBet` se debita, acredita y persiste bet en operaciones separadas sin transacción de BD.
   - Riesgo: wallet desincronizado frente a errores parciales o concurrencia.
   - Severidad: **Crítica**.

4. **Race condition en wallet (double-spend).**
   - `getBalance` + `insert` no se ejecutan con bloqueo transaccional (`SELECT ... FOR UPDATE`) ni idempotencia.
   - Bajo concurrencia, dos débitos simultáneos pueden pasar la validación.
   - Severidad: **Crítica**.

5. **`synchronize: true` activo en TypeORM.**
   - Inaceptable en producción; requiere migraciones versionadas.
   - Severidad: **Alta**.

6. **Admin endpoint de apuestas sin paginación/filtros.**
   - Riesgo de carga y latencia lineal al crecer datos.
   - Severidad: **Media**.

7. **Modelo de errores limitado para dominio financiero.**
   - No hay códigos de error de negocio ni correlación por request.
   - Severidad: **Media**.

### Estructura backend recomendada (escalable)

```text
backend/
  src/
    modules/
      auth/
      users/
      wallet/
      games/
      payments/
      bonuses/
      admin/
    core/
      domain/           # entidades/agregados + value objects
      application/      # casos de uso
      infrastructure/   # repositorios, ORM, clients externos
      shared/           # eventos, errores, utilidades
    interfaces/
      http/             # controllers + dto/request/response mappers
      events/           # consumers/producers (Redis Streams/Kafka)
    config/
    migrations/
    tests/
```

### Recomendaciones accionables inmediatas (backend)

- Implementar `RolesGuard` + decorador `@Roles('admin')` para `admin/*`.
- Introducir serializers (`ClassSerializerInterceptor` + `@Exclude`) o DTO de respuesta para ocultar `passwordHash`.
- Reescribir operaciones wallet/bet con `QueryRunner` y **transacción única**.
- Añadir `idempotency_key` en pagos/apuestas para tolerancia a reintentos.
- Migrar a `typeorm migrations` y desactivar `synchronize` fuera de local.
- Añadir paginación estándar (`limit`, `cursor`) en listados administrativos.

---

## 3) Frontend (Next.js) — evaluación profunda

### Hallazgos

1. **Token JWT en `localStorage` (alto riesgo XSS).**
   - Debe migrarse a cookie `HttpOnly`, `Secure`, `SameSite=Lax/Strict`.

2. **No hay arquitectura de estado global ni capa de datos robusta.**
   - Falta React Query/SWR con cache, retries, invalidación y deduplicación.

3. **Falta gestión de errores y UX transaccional.**
   - UI no muestra estados de carga/error finos para pagos/apuestas.

4. **No hay route protection del lado cliente/servidor.**
   - Dashboard/admin deberían requerir guardas (middleware).

5. **Escalabilidad de UI limitada.**
   - No hay design system, librería de componentes ni tokens maduros.

### Estructura frontend recomendada

```text
frontend/src/
  app/
    (public)/
    (auth)/
    (player)/dashboard
    (admin)/
  features/
    auth/
    wallet/
    games/
    payments/
  entities/
    user/
    transaction/
    bet/
  shared/
    api/
    ui/
    hooks/
    config/
    types/
```

### Recomendaciones accionables inmediatas (frontend)

- Sustituir `localStorage` por sesión en cookie HttpOnly gestionada por BFF/gateway.
- Introducir React Query para caché de balance/ledger y optimistic updates controladas.
- Definir `ApiError` tipado + toasts por operación crítica.
- Añadir middleware de Next para proteger rutas privadas y admin.

---

## 4) Base de datos — evaluación y propuesta

### Estado actual

Existe modelo base (`users`, `ledger_transactions`, `bets`, `games`, `payments`, `bonuses`) adecuado para MVP.

### Gaps para producción

- Faltan índices compuestos para consultas de historial y conciliación.
- Falta tabla de `wallet_accounts` (accounting explícito por moneda/tenant).
- Falta soporte multi-moneda y redondeo por currency exponent.
- Falta idempotencia en pagos/apuestas.
- Falta auditoría normativa (KYC/AML, device fingerprint, IP logs).

### Esquema recomendado (fase 2)

- `users`
- `wallet_accounts` (1..n por usuario/moneda)
- `ledger_entries` (append-only, doble partida opcional)
- `ledger_postings` (si se adopta doble partida real)
- `bets`
- `game_rounds`
- `payments`
- `payment_attempts`
- `bonuses`
- `bonus_wager_progress`
- `audit_logs`

### Reglas de consistencia recomendadas

- `CHECK amount > 0` y moneda obligatoria.
- Unique `idempotency_key` por operación.
- Balance derivado por ledger o snapshot materializado + reconciliación.

---

## 5) Seguridad

### Riesgos críticos

- Autorización por rol ausente en admin.
- Exposición potencial de `passwordHash` en respuestas.
- JWT en localStorage.
- CORS abierto sin política explícita por entorno.

### Controles recomendados

- RBAC + ABAC para recursos sensibles.
- Secret management (Vault/SSM), rotación de JWT keys (kid + JWKS).
- WAF + bot protection + antifraude básico por velocity rules.
- Hardening headers (`helmet`, CSP estricta, HSTS en gateway).
- Logs estructurados con masking de PII.

---

## 6) Escalabilidad

### Estado actual

- Redis presente en infraestructura pero no explotado en aplicación.
- No hay colas/event bus para tareas asincrónicas.

### Propuesta

1. **Corto plazo**: Redis para sesiones, rate limits por usuario/IP y cache de catálogo de juegos.
2. **Mediano plazo**: Event bus (Redis Streams o Kafka) para pagos, fraude, bonus, notificaciones.
3. **Largo plazo**: separar wallet/pagos como servicios dedicados con SLA y reconciliación independiente.

---

## 7) Roadmap técnico priorizado

## Corto plazo (0–6 semanas)

- [P0] RolesGuard admin + DTOs de salida sin secretos.
- [P0] Transacciones ACID en wallet/bets/pagos + idempotencia.
- [P0] Migraciones versionadas + desactivar `synchronize` en prod.
- [P1] Observabilidad mínima: health, logs JSON, métricas de negocio.
- [P1] Front con protección de rutas y manejo de errores robusto.

## Mediano plazo (6–16 semanas)

- [P0] Event-driven para pagos/bonus/fraude.
- [P1] Anti-fraude inicial (velocity, geo/IP heuristics, límites dinámicos).
- [P1] Backoffice real con filtros, paginación, export y auditoría.
- [P1] Test suite completa (unit, integration, e2e, carga).

## Largo plazo (4–12 meses)

- [P0] Separación en servicios críticos (wallet/payments/risk).
- [P0] Multi-región, DR, cifrado at-rest/by-field para PII.
- [P1] Cumplimiento regulatorio (KYC/AML, RGPD/PCI scope control).
- [P1] Data platform para BI, LTV, retención y detección de fraude avanzada.

---

## 8) Lista ejecutiva de problemas críticos (Top 10)

1. Admin sin RBAC.
2. Exposición de `passwordHash`.
3. Operaciones wallet sin transacción ACID.
4. Race conditions de saldo bajo concurrencia.
5. `synchronize: true` en ORM.
6. JWT en localStorage.
7. Falta de idempotencia en pagos/apuestas.
8. Sin pruebas automatizadas.
9. Sin observabilidad operativa.
10. Sin políticas de seguridad de cabeceras/CORS por entorno.

## 9) Mejoras inmediatas sugeridas (orden de ejecución)

1. Seguridad de acceso (RBAC + serialización segura).
2. Consistencia financiera (transacciones + idempotencia).
3. Operabilidad (migraciones, healthchecks, logs/métricas).
4. Escalabilidad frontend/backend (query cache, paginación, colas).
5. Hardening y compliance progresivo.
