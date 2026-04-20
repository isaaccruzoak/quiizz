# 🤔 Escolha Difícil — A ou B?

Sistema de entretenimento interativo onde usuários respondem perguntas do tipo "Você prefere A ou B?" e veem em tempo real como outros votaram.

## ✨ Funcionalidades

- **Jogo principal** — pergunta aleatória com duas opções, vote e veja as porcentagens
- **Resultados visuais** — barras animadas mostrando % de cada opção após o voto
- **Ranking** — as perguntas mais votadas da plataforma
- **Em Alta** — perguntas com mais engajamento recente
- **Criar perguntas** — qualquer pessoa pode criar novos dilemas
- **Autenticação JWT** — login/registro para salvar histórico
- **Histórico pessoal** — todas as perguntas respondidas (requer login)
- **Dark mode** — alterna entre tema claro e escuro
- **Compartilhamento** — botão de share nativo ou cópia para clipboard
- **Design responsivo** — funciona perfeitamente em mobile

## 🛠 Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14 + TypeScript |
| Estilização | Tailwind CSS |
| Animações | Framer Motion |
| Estado global | Zustand |
| Backend | Node.js + Express + TypeScript |
| ORM | Prisma |
| Banco de dados | PostgreSQL 16 |
| Autenticação | JWT (jsonwebtoken + bcryptjs) |
| Validação | express-validator |

## 📁 Estrutura do Projeto

```
quiz/
├── frontend/                    # App Next.js
│   └── src/
│       ├── app/                 # Páginas (App Router)
│       │   ├── page.tsx         # Home (jogo principal)
│       │   ├── login/           # Tela de login
│       │   ├── register/        # Tela de registro
│       │   ├── history/         # Histórico do usuário
│       │   ├── create/          # Criar pergunta
│       │   └── ranking/         # Ranking e trending
│       ├── components/          # Componentes reutilizáveis
│       ├── lib/                 # Configuração da API (axios)
│       ├── store/               # Estado global (Zustand)
│       └── types/               # TypeScript types
│
├── backend/                     # API Express
│   ├── prisma/
│   │   ├── schema.prisma        # Schema do banco
│   │   └── seed.ts              # 15 perguntas iniciais
│   └── src/
│       ├── controllers/         # Handlers das requisições
│       ├── services/            # Lógica de negócio
│       ├── middlewares/         # Auth, validação
│       ├── routes/              # Definição das rotas
│       └── app.ts               # Entry point
│
└── docker-compose.yml           # PostgreSQL via Docker
```

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose

### 1. Iniciar o banco de dados

```bash
docker-compose up -d
```

### 2. Configurar e iniciar o Backend

```bash
cd backend
npm install
cp .env.example .env       # já configurado para Docker local
npx prisma generate
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts # popula com 15 perguntas
npm run dev
```

O backend estará disponível em `http://localhost:3001`

### 3. Configurar e iniciar o Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

## 🌐 API Endpoints

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Criar conta |
| POST | `/api/auth/login` | Fazer login |
| GET | `/api/auth/profile` | Perfil do usuário (auth) |

### Perguntas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/questions/random` | Pergunta aleatória |
| GET | `/api/questions/trending` | Perguntas em alta |
| GET | `/api/questions/ranking` | Ranking paginado |
| GET | `/api/questions/history` | Histórico do usuário (auth) |
| GET | `/api/questions/:id` | Pergunta específica |
| POST | `/api/questions` | Criar pergunta |

### Votos
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/votes` | Registrar voto (A ou B) |

## 🔐 Segurança

- Senhas hasheadas com `bcryptjs` (salt 12)
- Autenticação via JWT com expiração de 7 dias
- Rate limiting: 200 req/15min por IP
- Helmet para headers de segurança
- CORS configurado para o domínio do frontend
- Validação de entrada em todas as rotas com `express-validator`
- Um usuário só pode votar uma vez por pergunta

## 🚢 Deploy

### Variáveis de ambiente para produção

**Backend:**
```env
DATABASE_URL="postgresql://user:password@host:5432/escolha_dificil"
JWT_SECRET="uma-chave-secreta-muito-forte"
PORT=3001
NODE_ENV="production"
FRONTEND_URL="https://seu-dominio.com"
```

**Frontend:**
```env
NEXT_PUBLIC_API_URL=https://api.seu-dominio.com
```

### Build de produção

```bash
# Backend
cd backend && npm run build && npm start

# Frontend
cd frontend && npm run build && npm start
```

Serviços recomendados: **Railway** (backend + DB) + **Vercel** (frontend)

## 📸 Fluxo da Aplicação

1. Frontend requisita `GET /api/questions/random`
2. Usuário clica em A ou B
3. Frontend envia `POST /api/votes` com `{ questionId, choice }`
4. Backend valida, salva o voto, calcula %
5. Resultado retornado e exibido com animações

---

Desenvolvido com ❤️ como projeto de portfólio full stack.
