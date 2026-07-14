# TAARU — Contexte Projet

## Stack
- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind + PWA
- Backend: Spring Boot 3.3 + Java 17 + Spring Security + Hibernate + Flyway
- Base de données: PostgreSQL 16
- Cache: Redis 7
- Recherche: Typesense 26
- CI/CD: GitHub Actions
- Déploiement: Docker Compose + Nginx + Let's Encrypt (VPS OVH)
- Qualité: ArchUnit, JaCoCo (70% instruction / 60% branch), PMD, OWASP Dependency Check

## Architecture Backend — Multi-module Maven (11 modules)

### Modules et Graphe de Dépendances

```
common/     ← aucune dépendance inter-module (JPA, Web, Validation, Lombok)
auth/       ← common
provider/   ← common, auth
booking/    ← common (compile), provider+runtime (optionnel)
payment/    ← common (compile), booking+runtime (optionnel)
messaging/  ← common (compile)
notification/ ← common (compile)
search/     ← common (compile)
review/     ← common (compile)
admin/      ← common, auth, provider, booking, payment, messaging, notification, search, review
api/        ← TOUS les modules (Spring Boot executable, config cross-cutting)
```

**Règle absolue** : Aucun module ne dépend de `api/`. Aucun module ne dépend de `admin/` (sauf `api/`). Les dépendances entre modules domaine passent exclusivement par des interfaces dans `common/port/` et des événements dans `common/event/`.

### Convention de Packages (nouveaux modules)

```
src/main/java/com/taaru/{module}/
├── api/          → REST controllers
├── service/      → Business logic + implémentations des ports
├── dao/          → Spring Data JPA repositories (préfixe I, suffixe Repository)
├── dto/          → Request/Response DTOs (nom propre, sans suffixe)
├── entity/       → Entités JPA (suffixe Entity)
├── mapper/       → Mappers DTO ↔ Entity
├── event/        → Event handlers locaux (écouteurs @Async)
├── exception/    → Exceptions spécifiques au module
└── config/       → Configuration Spring du module
```

**Modules existants (auth, provider)** conservent leur structure `domain/{dto,entity,repository}/` + `service/` pour la stabilité. Les nouveaux modules suivent la convention ci-dessus.

### Architecture par Domaine

| Module | Responsabilité | Package racine |
|---|---|---|
| **common** | BaseEntity, ApiResponse, événements, ports, exceptions partagées | `com.taaru.common` |
| **auth** | Inscription, JWT avec refresh rotatif, RBAC (CLIENT/PROFESSIONAL/ADMIN) | `com.taaru.auth` |
| **provider** | Page pro, galerie, catégories, disponibilités, géolocalisation | `com.taaru.provider` |
| **booking** | Réservation, demande de devis, calendrier, statuts (PENDING_PAYMENT→CONFIRMED) | `com.taaru.booking` |
| **payment** | Strategy Pattern (Orange Money, Wave, Free Money, CB), abonnements, commission | `com.taaru.payment` |
| **messaging** | Messagerie instantanée, store IDs uniquement (senderId, receiverId, contextId) | `com.taaru.messaging` |
| **notification** | Web Push (VAPID), email (Resend), SMS, pure event-driven | `com.taaru.notification` |
| **search** | Indexation Typesense, requêtes full-text, facettes, géolocalisation | `com.taaru.search` |
| **review** | Avis (1-5), commentaire, modération, événement → provider recalcule note | `com.taaru.review` |
| **admin** | Dashboard, stats, gestion agrégée de tous les modules (dépend sur tout) | `com.taaru.admin` |
| **api** | Spring Boot main, SecurityConfig, GlobalExceptionHandler (cross-cutting) | `com.taaru.api` |

### Système d'Événements — Découplage Inter-Domaines

**Architecture** : `ApplicationEventPublisher` (Spring) + `@Async` pour le MVP.

**Contrat** : Les événements sont définis dans `common/event/` et portent TOUTES les données nécessaires aux consommateurs (pas de lookup vers le module source).

**Événements définis** :

```
common/event/
├── DomainEvent.java              Interface
├── AbstractDomainEvent.java      Classe de base
├── DomainEventPublisher.java     Interface du publisher (injectable partout)
├── SpringDomainEventPublisher.java → Adapter Spring (ApplicationEventPublisher)
├── config/AsyncEventConfig.java  @EnableAsync + ThreadPoolTaskExecutor (4-8 threads)
├── auth/
│   ├── UserRegisteredEvent.java   (userId, email, firstName, role)
│   └── UserDeletedEvent.java      (userId)
├── provider/
│   ├── ProviderCreatedEvent.java      (providerId, userId, businessName, categorySlug, city)
│   ├── ProviderUpdatedEvent.java      (providerId)
│   └── ProviderStatusChangedEvent.java (providerId, oldStatus, newStatus)
├── booking/
│   ├── BookingCreatedEvent.java         (bookingId, providerId, clientId, amount)
│   ├── BookingConfirmedEvent.java       (bookingId)
│   ├── BookingCancelledEvent.java       (bookingId, reason)
│   └── BookingPaymentRequiredEvent.java (bookingId, clientId, amount, currency)
├── payment/
│   ├── PaymentCompletedEvent.java (paymentId, bookingId, method, amount, transactionRef)
│   └── PaymentFailedEvent.java    (paymentId, bookingId, reason)
└── review/
    └── ReviewCreatedEvent.java    (reviewId, providerId, clientId, rating)
```

**Conditions de migration vers Kafka** (Phase 2) :
1. Volume > 1000 events/minute soutenu
2. Besoin de rejeu d'événements (replay)
3. Plus de 2 modules consommateurs par événement
4. Exigence de durabilité des messages (persistance Kafka)

### Ports Inter-Domaines (common/port/)

Interfaces définies dans `common` et implémentées par les modules domaine :

| Interface | Usage | Implémenté par |
|---|---|---|
| `IUserProfilePort` | lookup profil utilisateur (email, nom) | `auth` |
| `IProviderExistencePort` | vérifier existence/activité prestataire | `provider` |
| `IMediaPort` | upload / delete / presigned URL Cloudflare R2 | `common` (implémenté avec R2 SDK) |
| `INotificationPort` | envoyer email, SMS, push | `notification` |

### Architecture des Réservations et Paiements — Saga Choreography

Le workflow booking→payment est un **event-driven saga** sans orchestrateur central :

```
1. BookingService.createBooking() → status PENDING_PAYMENT
2. publish BookingPaymentRequiredEvent
3. PaymentService.listen() → processPayment() via Strategy (Orange Money / Wave / CB)
4a. Succès → publish PaymentCompletedEvent
    → BookingService.confirmBooking() → status CONFIRMED
    → NotificationService.sendConfirmation()
4b. Échec → publish PaymentFailedEvent
    → BookingService.markFailed() → status PAYMENT_FAILED
    → (utilisateur peut réessayer ou annuler)
```

**Compensation manuelle** (MVP) : Dashboard admin permet d'annuler/rembourser.
**Compensation automatisée** (Phase 2) : Saga orchestrée avec Kafka + State Machine (Spring Statemachine).

### Qualité et Tests

- **ArchUnit** : 15 règles vérifiées à chaque build (`mvn verify`)
  - Interdiction des dépendances entre modules non déclarées dans le graphe
  - Aucune entité JPA exposée en réponse HTTP
  - Aucun accès direct repository → controller
  - Conventions de nommage (préfixe I pour repos, suffixe Entity pour entités)
- **JaCoCo** : Couverture ≥ 70% instruction, ≥ 60% branche
- **PMD** : Priorité minimale 2, violation = échec
- **OWASP** : Fail sur CVSS ≥ 7
- **Tests actuels** : 55+ (26 unit + 27 intégration + 2+ ArchUnit)
- **CI** : GitHub Actions, PostgreSQL 16 service, cache Maven

## Etat Actuel
- Tous les tests backend passent
- Tests E2E Playwright: 29 prêts (frontend/tests/e2e/)
- Performances k6 dans tests/performance/
- CI/CD configuré (.github/workflows/)
- Docker Compose prod + Nginx prêts
- Déployé sur GitHub: https://github.com/AKS-Design004/taaru

## Prochaines Étapes
1. Rédiger le PRD à partir du brief analyste + architecture validée
2. Démarrer l'Inc 1 : Auth + Provider + Directory
3. Implémenter Booking (Inc 2)
4. Implémenter Payment + Messaging + Notification (Inc 3)
5. Configurer GitHub Secrets (DOCKER_USERNAME, DOCKER_PASSWORD, VPS_HOST, VPS_USER, VPS_SSH_KEY)
6. Déployer sur VPS OVH

## Commandes Utiles
```bash
# Backend (build complet + tests)
cd backend && mvn verify -pl api -am -B

# Backend (sans tests)
cd backend && mvn install -DskipTests && cd api && mvn spring-boot:run

# Frontend
cd frontend && npm run dev

# Docker
docker compose up -d
```
