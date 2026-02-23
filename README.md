# Red Panda - Quick Run Guide

Simple guide to run the project locally.

## 📦 Prerequisites

- Docker + Docker Compose
- (Optional for manual run) Java 17, Maven, Node 20+, pnpm

## 🚀 Fastest way (Docker)

From the project root:

```bash
docker compose up --build
```

Open:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- Swagger: http://localhost:8080/api/swagger-ui.html

Stop everything:

```bash
docker compose down
```

## 🛠️ Run manually (without Docker)

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
pnpm install
cp .env.example .env
pnpm dev
```

## 🗄️ Database

Database file:

- `backend/src/main/resources/maplewood_school.sqlite`

Regenerate database data:

```bash
cd backend/src/main/resources
python populate_database.py
```

## ✅ Useful commands

- Backend tests: `cd backend && mvn test`
- Frontend lint: `cd frontend && pnpm lint`
- Frontend tests: `cd frontend && pnpm test`
