#!/bin/bash
set -e

echo "🚀 Configurando Escolha Difícil..."

# Backend
echo ""
echo "📦 Instalando dependências do backend..."
cd backend
npm install

echo ""
echo "🗄️  Configurando banco de dados..."
echo "  Lembre-se: PostgreSQL deve estar rodando"
echo "  Ajuste o DATABASE_URL em backend/.env se necessário"

npx prisma generate
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts

cd ..

# Frontend
echo ""
echo "📦 Instalando dependências do frontend..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Setup concluído!"
echo ""
echo "▶️  Para iniciar o projeto:"
echo ""
echo "   Terminal 1 (backend):"
echo "   cd backend && npm run dev"
echo ""
echo "   Terminal 2 (frontend):"
echo "   cd frontend && npm run dev"
echo ""
echo "   Acesse: http://localhost:3000"
