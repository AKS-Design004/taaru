# TAARU — Contexte Projet

## Stack
- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind + PWA
- Backend: Spring Boot 3 + Java 17 + Spring Security + Hibernate + Flyway
- Base de données: PostgreSQL 16
- Cache: Redis 7
- Recherche: Typesense 26
- CI/CD: GitHub Actions
- Déploiement: Docker Compose + Nginx + Let's Encrypt (VPS OVH)

## Architecture
- Multi-module Maven: common, auth, provider, api
- Monorepo avec backend/ et frontend/
- 4 tables DB (users, refresh_tokens, providers + sous-tables)
- 18 endpoints REST, 8 routes Next.js

## Etat Actuel
- Tous les tests backend passent: 53 (26 unit + 27 intégration)
- Tests E2E Playwright: 29 prêts (frontend/tests/e2e/)
- Performances k6 dans tests/performance/
- CI/CD configuré (.github/workflows/)
- Docker Compose prod + Nginx prêts
- Déployé sur GitHub: https://github.com/AKS-Design004/taaru

## Changements Récents
- H2 en mode PostgreSQL pour les tests d'intégration (Testcontainers bloqué sur Windows)
- Seed programmatique dans @BeforeEach (check count) au lieu de @Sql
- JwtAuthenticationFilter: principal = userId.toString() (fix UUID crash)
- SecurityConfig: formLogin().disable() + AuthEntryPoint (401 json) + AccessDeniedHandler (403 json)
- CORS externalisé via taaru.cors.allowed-origins
- @JdbcTypeCode(SqlTypes.JSON) pour les colonnes JSONB (pricing, social_links)
- Port API changé de 8080 à 8081 (conflit Docker Desktop)
- Port PostgreSQL Docker changé de 5432 à 5433 (conflit PostgreSQL local)
- added spring-boot-starter-actuator, spring-retry, spring-boot-starter-aop

## Modifications Fichiers
- backend/api/src/main/resources/application.yml: PORT=8081, DATABASE_URL=localhost:5433
- backend/api/src/main/resources/db/migration/V3__create_providers_tables.sql: pricing JSONB
- backend/provider/src/main/java/com/taaru/provider/domain/entity/Provider.java: @JdbcTypeCode
- frontend/next.config.mjs: API_URL = localhost:8081
- frontend/package.json: ajout eslint + eslint-config-next
- docker-compose.yml: postgres port 5433:5432

## Prochaines Étapes
1. Configurer GitHub Secrets (DOCKER_USERNAME, DOCKER_PASSWORD, VPS_HOST, VPS_USER, VPS_SSH_KEY)
2. Déployer sur VPS OVH
3. Étape 7 — Maintenance: monitoring, logging, feedback utilisateurs
4. Remplir 10 vrais prestataires pour le MVP

## Commandes Utiles
```bash
# Backend
cd backend && mvn install -DskipTests && cd api && mvn spring-boot:run

# Frontend
cd frontend && npm run dev

# Docker
docker compose up -d

# Tests backend
cd backend && mvn verify -pl api -am
```
