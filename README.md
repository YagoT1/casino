# Casino Online MVP Avanzado

Plataforma iGaming full stack orientada a escalado, con backend NestJS modular, frontend Next.js y stack dockerizado.

## Arquitectura

- **API Gateway**: Nginx como entrypoint (`/api` al backend y web al frontend).
- **Backend modular (NestJS)**:
  - `auth` (JWT, +18, bcrypt)
  - `users`
  - `wallet` (ledger inmutable)
  - `games` (slot + blackjack)
  - `payments` (MercadoPago mock)
  - `bonuses` (welcome bonus + rollover)
  - `admin`
- **Persistencia**:
  - PostgreSQL (entidades relacionales)
  - Redis (listo para sesiones/cache)
- **Event-driven ready**: metadata/reference IDs en ledger para acoplar pub/sub.

## Estructura

- `/frontend`
- `/backend`
- `/docker`
- `/scripts`

## Ejecución rápida

```bash
./scripts/setup.sh
cd docker && docker compose up --build
```

App: http://localhost:8080  
API directa: http://localhost:4000/api

## Credenciales de prueba

- Admin: `admin@casino.dev` / `Admin1234!`
- Player: `player@casino.dev` / `Player1234!`

## Flujos principales

1. Login/Register (`/login`, `/register`)
2. Dashboard (`/dashboard`) con balance ledger y acciones depositar/retirar
3. Juegos (`/games/slot-machine`, `/games/blackjack`) con apuesta y payout conectados al wallet
4. Admin (`/admin`) con usuarios y balances

## Modelo de datos principal

- `users`
- `ledger_transactions`
- `bets`
- `games`
- `payments`
- `bonuses`

El balance se calcula siempre por agregación del ledger (créditos - débitos), sin saldo hardcodeado.
