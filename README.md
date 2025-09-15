# Open Ticket — República Open Beach

Serviço web para gerenciamento de ingressos (convites) de festas universitárias.

Stack principal: Next.js (App Router) + Clerk (OAuth Google) + Tailwind CSS (tema escuro) + Prisma (SQLite).

## Funcionalidades

- Login com Clerk (apenas Google — configure no dashboard do Clerk)
- Página inicial pública com listagem e busca de eventos
- Área do organizador (apenas usuários com papel `organizer`)
  - Criação de eventos
  - Geração de convites por e-mail com opção de “Apelido”
- Área do participante (usuário comum, logado)
  - Listagem dos seus convites
  - Visualização do convite com QR Code

## Rotas

- `/` — Lista e busca de próximos eventos (pública)
- `/sign-in` — Login com Clerk
- `/organizer` — Dashboard do organizador (protegida)
- `/organizer/events/new` — Criar evento (protegida)
- `/organizer/events/[id]/invites` — Gerar convites (protegida)
- `/organizer/check-in` — Checagem/validação de convites (protegida)
- `/tickets` — Meus convites (protegida)
- `/tickets/[code]` — Visualizar convite com QR (protegida)

## API

- `GET /api/events` — Lista eventos
- `POST /api/events` — Cria evento (organizador)
- `POST /api/events/[id]/invites` — Gera convites para um evento (organizador)
- `GET /api/invites` — Lista convites do usuário logado
- `GET /api/invites/[code]` — Consulta um convite por código (organizador)
- `POST /api/invites/[code]/use` — Marca o convite como utilizado (organizador)

Os dados são persistidos em SQLite via Prisma (arquivo `prisma/dev.db`).

## Autenticação e Papéis

- Autenticação: Clerk. Defina as chaves no `.env.local` usando o exemplo abaixo.
- Papel de organizador: por padrão, usuários com `publicMetadata.role = "organizer"` no Clerk têm acesso à área do organizador. Você também pode adicionar e-mails na lista `ORGANIZER_EMAILS` em `lib/auth.ts`.
- Desenvolvimento: para liberar o acesso do organizador para qualquer usuário logado, defina `DEV_ORGANIZER_ALLOW_ALL=true` no `.env.local`.

## Configuração

1. Crie um projeto no Clerk e ative apenas o provedor OAuth Google.
2. Copie `.env.local.example` para `.env.local` e preencha as chaves do Clerk:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

3. Banco de dados (SQLite via Prisma):

```
npx prisma migrate dev --name init
```

4. Instale dependências e rode o projeto:

```
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Tema escuro

- Suportado via `next-themes`. O botão no cabeçalho alterna entre claro/escuro.

## Observações

- Em produção, troque o `DATABASE_URL` por um banco gerenciado (Postgres, MySQL) e atualize `prisma/schema.prisma`, então rode novas migrações.
- Para leitura/validação de QR Code, considere assinar o payload (JWT) ou usar verificação via backend por código.
- A checagem por câmera usa a API `BarcodeDetector` do navegador (Chrome/Android). Caso não esteja disponível, utilize a entrada manual do código.
