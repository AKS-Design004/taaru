# PRD — TAARU Plateforme Mise en Relation Prestataires/Clients

**Version** : 1.0.0  
**Statut** : Approuvé  
**Auteur** : PM (John)  
**Date** : 2026-07-14  

---

## 1. Vision

TAARU est la plateforme de référence au Sénégal pour la mise en relation entre clients et prestataires dans les secteurs de la mode, la couture, la beauté et l'événementiel — accessible via une PWA Mobile First.

## 2. Personas

### Aminata — Cliente Particulière
- 28 ans, Dakar, cherche une coiffeuse pour son mariage
- Veut comparer les prestataires, lire les avis, réserver en ligne
- Utilise son téléphone principalement, se méfie des paiements en ligne

### Ousmane — Styliste Professionnel
- 35 ans, Possède un atelier de confection
- Veux une vitrine pro pour ses réalisations
- A besoin de recevoir des demandes de devis et gérer son agenda

### Mme Diallo — Wedding Planner
- 42 ans, Entreprise d'événementiel
- Veut référencer son équipe (traiteurs, photographes, DJ)
- A besoin d'un tableau de bord pour suivre ses réservations

### Ibra — Administrateur Plateforme
- Gère les utilisateurs, les abonnements, la modération
- Supervise les statistiques et la monétisation

## 3. Périmètre

### Inclus (Phase 1)
- Application Web PWA Mobile First (responsive desktop + mobile)
- Backend Spring Boot 11 modules
- 3 incréments incrémentaux
- CI/CD avec GitHub Actions

### Exclus
- Applications natives Android/iOS (Phase 2)
- Marketplace de produits physiques (Phase 3)
- IA / Recommandation intelligente (Phase 3)

## 4. Découpage en 3 Incréments

### Incrément 1 — Fondations (Semaines 1-4)

| Feature | Priorité | Dépendances |
|---|---|---|
| Authentification (register/login/logout/refresh token) | P0 | Aucune |
| RBAC (CLIENT/PROFESSIONAL/ADMIN) | P0 | Auth |
| Profil prestataire (CRUD + galerie photos) | P0 | Auth |
| Catégories hiérarchiques (Mode, Couture, Beauté, Événementiel) | P0 | Aucune |
| Annuaire public (liste, filtre par ville/catégorie) | P0 | Provider |
| Fiche prestataire publique détaillée | P0 | Provider |
| Inscription séparée client vs pro | P0 | Auth |
| Page d'accueil (prestataires vedettes, catégories) | P1 | Provider |

**Critères d'acceptation Inc 1 :**
- Un utilisateur peut s'inscrire, se connecter, refresh son token
- Un prestataire peut créer/modifier sa page pro
- Un visiteur peut parcourir l'annuaire et voir les fiches détaillées
- Tests : 11 unitaires Auth + 9 Provider + 27 intégration API

### Incrément 2 — Recherche & Avis (Semaines 5-7)

| Feature | Priorité | Dépendances |
|---|---|---|
| Moteur de recherche intelligent (Typesense) | P0 | Inc 1 |
| Indexation automatique des prestataires | P0 | Search, Provider |
| Filtres full-text (métier, ville, quartier, prix, popularité) | P0 | Search |
| Géolocalisation proximité | P0 | Search |
| Système d'avis et notation (1-5) | P0 | Review, Provider |
| Modération des avis | P1 | Review, Admin |
| Comparateur de prestataires | P1 | Search |

**Critères d'acceptation Inc 2 :**
- La recherche retourne des résultats pertinents < 200ms
- Les prestataires sont automatiquement ré-indexés après modification
- Un client peut laisser un avis noté
- La note moyenne du prestataire se met à jour automatiquement

### Incrément 3 — Réservation, Paiement & Messagerie (Semaines 8-12)

| Feature | Priorité | Dépendances |
|---|---|---|
| Réservation avec calendrier | P0 | Inc 1, Inc 2 |
| Demande de devis | P0 | Booking |
| Workflow statuts (PENDING→CONFIRMED→CANCELLED) | P0 | Booking |
| Paiement Mobile Money (Orange Money, Wave) | P0 | Payment, Booking |
| Paiement par carte (Visa, Mastercard) | P1 | Payment |
| Messagerie client-prestataire | P0 | Messaging |
| Notifications (Web Push, email, in-app) | P0 | Notification |
| Abonnements prestataire (Free vs Premium) | P1 | Payment, Admin |
| Tableau de bord prestataire (stats, visites, réservations) | P1 | Admin |
| Dashboard admin | P1 | Admin |
| Commission sur réservation | P2 | Payment, Booking |

## 5. Contraintes Techniques

| # | Contrainte | Origine |
|---|---|---|
| 1 | Aucune entité JPA exposée en réponse HTTP | Architecture |
| 2 | Aucune logique métier dans les controllers | Architecture |
| 3 | Communication inter-domaine par événements uniquement | Architecture |
| 4 | JWT access 15min + refresh rotatif 7 jours | Sécurité |
| 5 | Rate limiting sur endpoints critiques (auth, booking) | Sécurité |
| 6 | Upload validé côté serveur (type MIME, taille, signature) | Sécurité |
| 7 | RBAC strict : CLIENT / PROFESSIONAL / ADMIN | Architecture |
| 8 | Couverture tests ≥ 80% services métier | Qualité |
| 9 | ArchUnit bloque tout commit violant le graphe de dépendances | Qualité |
| 10 | JaCoCo ≥ 70% instruction, ≥ 60% branche | Qualité |

## 6. Architecture Technique

### Backend
- 11 modules Maven : `common`, `auth`, `provider`, `booking`, `payment`, `messaging`, `notification`, `search`, `review`, `admin`, `api`
- Package racine : `com.taaru.{module}`
- Ports inter-domaines dans `common/port/`
- Événements métier dans `common/event/` avec `ApplicationEventPublisher` + `@Async`
- Versionning API : `/api/v1/...`

### Frontend
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- PWA avec manifest.json + Service Worker
- Mobile First, responsive desktop
- Pages : Accueil, Catégories, Annuaire, Fiche Prestataire, Connexion, Profil
- Dashboard pro et client en routes protégées

### Data
- PostgreSQL 16 (relationnel)
- Redis 7 (cache, sessions, rate limiting)
- Typesense 26 (recherche full-text)
- Cloudflare R2 (médias images/vidéos)

## 7. API — Design Contract

### Format Standard (toutes les réponses)

```json
{
  "success": true,
  "message": "Opération réussie",
  "data": {},
  "timestamp": "2026-07-14T12:00:00Z"
}
```

### Endpoints par Domaine

**Auth** : `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/logout`  
**Users** : `GET /api/users/me`, `PUT /api/users/me`, `PUT /api/users/me/password`  
**Provider** : `GET /api/providers`, `GET /api/providers/{id}`, `POST /api/providers`, `PUT /api/providers/me`, `POST /api/providers/{id}/photos`  
**Search** : `GET /api/search?q=&city=&category=&lat=&lng=` (Inc 2)  
**Review** : `GET /api/reviews/{providerId}`, `POST /api/reviews` (Inc 2)  
**Booking** : `POST /api/bookings`, `GET /api/bookings`, `PUT /api/bookings/{id}/status` (Inc 3)  
**Payment** : `POST /api/payments/pay`, `POST /api/payments/callback/{method}` (Inc 3)  
**Messaging** : `GET /api/messages/{conversationId}`, `POST /api/messages` (Inc 3)  
**Admin** : `GET /api/admin/stats`, `GET /api/admin/users`, `PUT /api/admin/providers/{id}/status` (Inc 3)  
**Notification** : `POST /api/notifications/subscribe` (Inc 3)

## 8. Modèle Économique

### Abonnements Prestataire

| Formule | Prix | Fonctionnalités |
|---|---|---|
| **Free** | Gratuit | Profil basique, 5 photos, pas de statistiques |
| **Premium** | À définir | Profil prioritaire, galerie illimitée, stats, mise en avant |

### Commission
- Prélevée sur chaque réservation confirmée et payée (Inc 3)
- Pourcentage : à définir selon négociation avec les partenaires paiement

### Publicités
- Prestataires sponsorisés dans les résultats de recherche (Inc 3)

## 9. Spécifications Non Fonctionnelles

| NFR | Cible | Mesure |
|---|---|---|
| Temps de réponse API | < 500ms (95e percentile) | k6, Micrometer |
| Recherche | < 200ms | Typesense benchmarks |
| Disponibilité | 99.5% (uptime mensuel) | Uptime Kuma |
| Couverture tests unitaires | ≥ 80% services métier | JaCoCo |
| Sécurité | Aucune vulnérabilité OWASP Top 10 | OWASP Dependency Check |
| SEO | Lighthouse ≥ 90 (desktop) | Lighthouse CI |
| PWA | Score ≥ 80 (Lighthouse PWA) | Lighthouse CI |

## 10. Contraintes de Sécurité

- **OWASP Top 10** : Validation de toutes les entrées, paramétrage des requêtes SQL, CSP headers
- **JWT** : Access token 15 min, refresh token rotatif 7 jours, stocké en httpOnly cookie
- **Rate Limiting** : 5 tentatives/min auth, 30 requêtes/min API
- **Upload** : Validation MIME côté serveur, limite 10MB par fichier, scan antivirus
- **CORS** : Domaines autorisés via configuration, pas de `*` en production
- **Headers** : HSTS, X-Frame-Options, X-Content-Type-Options, CSP

## 11. Glossaire

| Terme | Définition |
|---|---|
| PWA | Progressive Web Application — application web installable |
| RBAC | Role-Based Access Control — contrôle d'accès par rôle |
| Provider | Prestataire de services (mode, beauté, événementiel) |
| Client | Particulier ou entreprise cherchant un prestataire |
| Saga | Pattern de coordination de transactions distribuées |
| Typesense | Moteur de recherche open-source full-text |

## 12. Logs de Décisions

| Date | Décision | Justification |
|---|---|---|
| 2026-07-14 | Architecture 11 modules Maven | Découplage domaine strict, testabilité, évolutivité |
| 2026-07-14 | Events Spring + @Async (MVP) | Simplicité, pas de surcharge Kafka pour le volume MVP |
| 2026-07-14 | Pas de domain Directory | Read model = Search (Typesense) |
| 2026-07-14 | Package convention | `api/`, `service/`, `dao/`, `dto/`, `entity/`, `mapper/` pour nouveaux modules |
| 2026-07-14 | ArchUnit en CI | Bloque les violations de dépendances dès le premier commit |

---

**Prochaine étape** : Sprint planning Incrément 1 — décomposition en stories techniques.
