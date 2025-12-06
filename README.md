### Entrega
 - README com:
   - Como rodar tudo via Docker Compose;
### 🔍 Os exemplos acima são sugestões inspiracionais.
## ✨ Recursos Implementados
### Pipeline
### Backend (NestJS)
### Frontend (React + Vite + Tailwind)
### Pipeline
 - ✅ Docker Compose — orquestração
---
## ⚙️ Arquivos de ambiente
Há um arquivo de exemplo `.env.example` na raiz do projeto com as variáveis necessárias para rodar localmente e em staging/produção. Copie-o para `.env` e ajuste conforme necessário.

Principais variáveis:
- `MONGO_URI` — string de conexão MongoDB (default no compose: `mongodb://mongo:27017/gdash`)
- `RABBITMQ_URL` — URL do broker RabbitMQ
- `BACKEND_URL` — URL interna/externa do backend (usado por worker)
- `JWT_SECRET` — segredo JWT (alterar obrigatoriamente em produção)
- `DEFAULT_ADMIN_EMAIL` / `DEFAULT_ADMIN_PASS` — credenciais iniciais
- `LATITUDE` / `LONGITUDE` / `CITY` — coordenadas/cidade para coleta
- `INTERVAL_SECONDS` — intervalo em segundos entre coletas do Python Collector

---
## 🚀 Rodando localmente (desenvolvimento)
1. Copie as variáveis de ambiente:

```powershell
cp .env.example .env
2. Suba a stack com Docker Compose:

```powershell
docker compose up -d --build
3. Verifique containers e logs:

```powershell
docker compose ps
4. Frontend em desenvolvimento (com hot-reload) estará em `http://localhost:5173`.

---
## 📦 Build e deploy (produção)
Opções rápidas:

- Deploy por imagem Docker (Registry -> Render / Railway / Fly): crie imagens com `docker build` e publique no registro.
- Deploy via Docker Compose (VM ou serviço que suporte Compose): use `docker compose -f docker-compose.yml up -d --build`.
Exemplo mínimo de build para produção (backend + frontend):

```powershell
# Build backend image
docker build -t gdash-backend:latest ./backend-nest
Notas:
- Ao usar serviços gerenciados (Render/Railway) prefira publicar imagens Docker independentes e configurar variáveis de ambiente na plataforma.
- Garanta `JWT_SECRET` seguro e cadastre as credenciais do admin via variáveis de ambiente.

---
## 🧪 Smoke tests (verificações rápidas)
Executar alguns comandos para validar instalação:

```powershell
# Verificar backend
Invoke-RestMethod -Uri "http://localhost:3001/weather/forecast?city=São%20Paulo&period=hourly" -Method Get | ConvertTo-Json
# Testar login
$body = @{ email='admin@example.com'; password='admin123456' } | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3001/auth/login' -Method Post -ContentType 'application/json' -Body $body

# Export CSV
Invoke-WebRequest -Uri "http://localhost:3001/weather/export/csv" -UseBasicParsing
---
## 🎬 Roteiro curto para vídeo (máx. 5 minutos)

1. 30s — Arquitetura geral (mostre o diagrama e explique pipeline).
2. 60s — Demonstração rápida: rodar `docker compose up -d --build` e abrir o frontend em `http://localhost:5173`.
3. 60s — Mostrar criação/uso do usuário admin (login) e acessar Dashboard.
4. 45s — Mostrar a chamada `GET /weather/forecast` e o resultado normalizado (timeline, peak temp).
5. 45s — Exportar CSV/XLSX e mostrar o arquivo baixado.
6. 30s — Explicar como os insights são gerados (breve descrição do algoritmo e exemplos).
7. 30s — Encerramento com instruções para rodar local/produção e link para o README/PR.

Checklist para gravação:
- Grave em tela cheia com áudio claro.
- Mostre comandos executados no terminal e a UI funcionando.
- Inclua link do vídeo no README ou no PR.

---
## ✅ Checklist do Pull Request

- Código do backend (NestJS) e frontend (Vite) presentes na branch.
- `docker-compose.yml` orquestrando todos os serviços necessários.
- `.env.example` incluído e atualizado.
- README completo com passos para rodar local e deploy.
- Link do vídeo (YouTube não listado) na descrição do PR.
- Testes manuais executados (descritos no README).

---
Se quiser, eu posso agora:

- (A) Testar o pipeline completo localmente iniciando `python-collector` e `go-worker` e monitorando logs.
- (B) Fazer o build de produção do frontend, ajustar Dockerfile para servir static build e testar.
- (C) Preparar instruções específicas de deploy para Render ou Railway (com passos passo-a-passo).

Indique qual opção prefere e eu prossigo exatamente nessa ordem.
# GDASH - Weather Data Pipeline Challenge 🌤️

**Desafio para o processo seletivo GDASH 2025/02**

Um sistema completo de pipeline de dados de clima construído com tecnologias modernas: Python (coleta), RabbitMQ (broker), Go (worker), NestJS (API), MongoDB (persistência) e React (frontend).

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Setup e Instalação](#setup-e-instalação)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Executando com Docker Compose](#executando-com-docker-compose)
- [Endpoints da API](#endpoints-da-api)
- [Fluxo de Dados](#fluxo-de-dados)
- [Recursos Implementados](#recursos-implementados)
- [Testes](#testes)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O GDASH é uma plataforma que coleta dados de clima de forma periódica, processa através de um broker de mensagens, persiste em um banco de dados e expõe uma API REST com interface web intuitiva. O sistema permite:

- ✅ Coleta automática de dados de clima via Open-Meteo API
- ✅ Processamento assíncrono de mensagens (RabbitMQ)
- ✅ Armazenamento persistente em MongoDB
- ✅ CRUD completo de usuários com autenticação JWT
- ✅ Exportação de dados em CSV e XLSX
- ✅ Dashboard interativo com gráficos e insights
- ✅ Controle de acesso baseado em roles (RBAC)
- ✅ API REST documentada e completa

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend React (Vite)                   │
│           Dashboard • Gráficos • Autenticação               │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP (port 5173)
                             │
┌─────────────────────────────▼────────────────────────────────┐
│                   Backend NestJS (API REST)                  │
│  • Endpoints clima/usuários  • JWT auth  • RBAC              │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP (port 3001)
                ┌────────────┼────────────┐
                │            │            │
            MongoDB      RabbitMQ      Redis(opcional)
            (Persist)    (Queue)       (Cache)
                │            │
                └────────────┼────────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
   Python Collector                         Go Worker
   (Periodic fetcher)                  (Message Consumer)
   • Open-Meteo API                    • Queue listener
   • JSON payload                      • HTTP POST
   • Durable publish                   • Retry logic
```

---

## 🛠️ Tecnologias

| Serviço | Tecnologia | Versão | Porta |
|---------|-----------|--------|-------|
| **Frontend** | React + Vite + Tailwind | 20-alpine | 5173 |
| **Backend** | NestJS + TypeScript | 20-alpine | 3001 |
| **Database** | MongoDB | 6 | 27017 |
| **Message Broker** | RabbitMQ | 3-management | 5672/15672 |
| **Worker** | Go | 1.20-alpine | - |
| **Collector** | Python | 3.12-slim | - |

---

## 📦 Pré-requisitos

- **Docker** (20.10+)
- **Docker Compose** (2.0+)
- **Git** (para clonar/fazer commit)

### Verificar instalação

```bash
docker --version
docker compose version
```

---

## 🚀 Setup e Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/thpl28/desafio-gdash.git
cd desafio-gdash
```

### 2. Copiar arquivo de ambiente

```bash
cp .env.example .env
```

### 3. Ajustar variáveis (opcional)

Edite `.env` para personalizar localização e credenciais:

```bash
# Localização geográfica para coleta de clima
LATITUDE=-23.5505
LONGITUDE=-46.6333
CITY=Sao Paulo

# Segurança (CRÍTICO em produção!)
JWT_SECRET=seu-segredo-muito-seguro-aqui
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASS=admin123456
```

---

## 🌍 Variáveis de Ambiente

Veja `.env.example` para lista completa. Principais:

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `MONGO_URI` | Connection string MongoDB | `mongodb://mongo:27017/gdash` |
| `RABBITMQ_URL` | URL do broker | `amqp://guest:guest@rabbitmq:5672/` |
| `BACKEND_URL` | URL da API (interna) | `http://backend:3001` |
| `JWT_SECRET` | Segredo JWT | `your-secret-key-change-this` |
| `LATITUDE` / `LONGITUDE` / `CITY` | Coordenadas para clima | São Paulo |
| `INTERVAL_SECONDS` | Intervalo coleta (s) | `3600` (1 hora) |
| `QUEUE_NAME` | Fila RabbitMQ | `weather_queue` |

---

## 🐳 Executando com Docker Compose

### Iniciar a stack completa

```bash
docker compose up -d
```

**Saída esperada:**
```
✔ Container mongo              Running
✔ Container rabbitmq           Running
✔ Container backend            Running
✔ Container frontend           Running
✔ Container python-collector   Running
✔ Container go-worker          Running
```

### Verificar status

```bash
docker compose ps
```

### Ver logs

```bash
# Todos os serviços
docker compose logs -f

# Serviço específico
docker compose logs -f backend
docker compose logs -f python-collector
docker compose logs -f go-worker
```

### Parar a stack

```bash
docker compose down
```

### Remover volumes (resetar dados)

```bash
docker compose down -v
```

---

## 📡 Endpoints da API

Base URL: `http://localhost:3001`

### Autenticação

#### 📝 Registrar novo usuário (público)
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "senha123456"
}
```

#### 🔑 Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123456"
}
```

**Resposta:** `{ "access_token": "eyJhbGciOiJIUzI1NiI..." }`

### Usuários (requerem Authorization: Bearer <token>)

- **GET /users** — Listar usuários (admin only)
- **GET /users/me** — Perfil do usuário logado
- **GET /users/:id** — Usuário específico
- **POST /users** — Criar usuário (admin only)
- **PUT /users/:id** — Atualizar usuário (admin only)
- **PATCH /users/me** — Atualizar próprio perfil
- **DELETE /users/:id** — Deletar usuário (admin only)

### Clima

- **GET /weather?city=Sao Paulo** — Clima atual (sem salvar)
- **POST /weather/collect?city=Sao Paulo** — Coletar e salvar
- **GET /weather/logs** — Listar logs salvos
- **POST /weather/logs** — Receber log do worker
- **GET /weather/insights** — Análise de dados
- **GET /weather/export/csv** — Exportar CSV
- **GET /weather/export/xlsx** — Exportar XLSX

---

## 🔄 Fluxo de Dados

1. **Python Collector** → Consulta Open-Meteo API a cada `INTERVAL_SECONDS`
2. **Publica JSON** → RabbitMQ fila `weather_queue` (durable)
3. **Go Worker** → Consome mensagem, valida e enriquece dados
4. **POST /weather/logs** → Envia para NestJS com todos os campos
5. **NestJS API** → Valida com DTO, mapeia weatherCode → condição legível
6. **MongoDB** → Persiste documento em `weatherlogs` collection
7. **Frontend** → Consulta `/weather/logs` e exibe Dashboard interativo
8. **Insights** → Cálculo automático de média, máx, mín, trend
9. **Export** → CSV/XLSX sob demanda

---

## ✨ Recursos Implementados

### Backend (NestJS)

- ✅ Autenticação JWT com Passport
- ✅ CRUD completo de usuários
- ✅ RBAC (Role-Based Access Control) — admin-only endpoints
- ✅ Signup público — registro sem token
- ✅ Endpoint de perfil pessoal — GET /users/me, PATCH /users/me
- ✅ Validação global com class-validator DTOs
- ✅ Endpoints de clima — coleta, logs, insights, export
- ✅ Mapeamento weatherCode → descrição legível
- ✅ Timestamp normalizado — Unix → Date
- ✅ Criação de admin padrão — via env vars
- ✅ CSV/XLSX export com json2csv + xlsx

### Frontend (React + Vite)

- ✅ Dashboard com gráficos interativos (Recharts)
- ✅ Autenticação — login, token JWT armazenado
- ✅ Temas — Tailwind CSS com componentes shadcn/ui
- ✅ Exportação — CSV e XLSX direto do Dashboard
- ✅ Mapping de weatherCode → ícone + descrição
- ✅ Tooltips customizados — temperatura, umidade, vento
- ✅ Estados de loading e erro — UX melhorada
- ✅ Responsive — mobile-first

### Pipeline

- ✅ Python Collector — Open-Meteo API
- ✅ RabbitMQ Publisher — publicação durável
- ✅ Go Worker — AMQP consumer com retry
- ✅ NestJS Backend — API REST com validação
- ✅ MongoDB — persistência
- ✅ Docker Compose — orquestração

---

## 🧪 Testes

### Teste rápido do pipeline

```bash
# 1. Registrar novo usuário
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"senha123456"}'

# 2. Fazer login
TOKEN=$(curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123456"}' \
  | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

# 3. Obter clima atual
curl http://localhost:3001/weather?city=Sao%20Paulo

# 4. Listar logs (com auth)
curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/weather/logs

# 5. Exportar CSV
curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/weather/export/csv > weather.csv
```

### Frontend

Acesse `http://localhost:5173` e teste:
1. Login com `admin@example.com` / `admin123456`
2. Dashboard com gráficos
3. Export CSV/XLSX
4. Insights

---

## 🔧 Troubleshooting

### Backend não inicia (EADDRINUSE)

```bash
# Liberar porta 3001
lsof -i :3001
kill -9 <PID>
```

### RabbitMQ desconecta

```bash
docker compose logs rabbitmq
docker compose restart go-worker python-collector
```

### MongoDB "collection already exists"

```bash
docker compose down -v  # Remove volumes
docker compose up -d
```

### Frontend mostra erro 404 na API

Verificar `VITE_API_URL=http://localhost:3001` em `.env` ou código

### Admin não criado automaticamente

```bash
# Verificar variáveis env
echo $DEFAULT_ADMIN_EMAIL

# Ou criar via API
curl -X POST http://localhost:3001/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"novo@admin.com","password":"senha123456","role":"admin"}'
```

---

## 🚀 Acesso Rápido

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **MongoDB**: mongodb://localhost:27017

---

## 📞 Créditos

Desenvolvido por Tiago Looze para o Desafio GDASH 2025/02


Para rodar testes (exemplo backend):
```bash
cd backend-nest
npm install
npm run test
```