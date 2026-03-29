#!/usr/bin/env bash
set -euo pipefail

cp -n backend/.env.example backend/.env || true
cp -n frontend/.env.example frontend/.env.local || true

echo "Instalando dependencias backend..."
(cd backend && npm install)

echo "Instalando dependencias frontend..."
(cd frontend && npm install)

echo "Levantando infraestructura base..."
(cd docker && docker compose up -d postgres redis)

echo "Ejecutando seed..."
(cd backend && npm run seed)

echo "Setup completado."
