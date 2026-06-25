# Cahier des Charges — Site Web Réseau agrolide
### Version 1.0 — Juin 2025
### Destinataire : Agent de développement IA (Antigravity) — Exécution directe

---

## Table des matières

- [1. Synthèse exécutive & objectifs du site](#1-synthèse-exécutive--objectifs-du-site)
- [2. Arborescence du site & parcours utilisateurs](#2-arborescence-du-site--parcours-utilisateurs)
- [3. Spécifications fonctionnelles — module par module](#3-spécifications-fonctionnelles--module-par-module)
  - [M1 — Vitrine & Positionnement](#m1--vitrine--positionnement)
  - [M2 — Espace Membres](#m2--espace-membres)
  - [M3 — Annuaire Professionnel](#m3--annuaire-professionnel)
  - [M4 — Bibliothèque Numérique](#m4--bibliothèque-numérique)
  - [M5 — Formations & Webinaires](#m5--formations--webinaires)
  - [M6 — Événements & Communauté](#m6--événements--communauté)
  - [M7 — Agrobusiness & Consulting](#m7--agrobusiness--consulting)
  - [M8 — Collecte de Fonds & Partenariats](#m8--collecte-de-fonds--partenariats)
  - [M9 — Blog & Actualités](#m9--blog--actualités)
- [4. Modèle de données Supabase](#4-modèle-de-données-supabase)
- [5. Spécifications d'implémentation par brique technique](#5-spécifications-dimplémentation-par-brique-technique)
- [6. Design System synthétique](#6-design-system-synthétique)
- [7. Exigences non-fonctionnelles](#7-exigences-non-fonctionnelles)
- [8. Plan de développement par phases](#8-plan-de-développement-par-phases)
- [9. Hypothèses retenues & points à valider](#9-hypothèses-retenues--points-à-valider)

---

## 1. Synthèse exécutive & objectifs du site

### 1.1 Contexte

agrolide est une association continentale dont le siège est à Lomé (Togo), fondée pour briser quatre freins structurels à l'agriculture africaine : l'isolement professionnel des agronomes, le manque de documentation adaptée aux réalités locales, le déficit d'accompagnement entrepreneurial des agripreneurs, et la sous-valorisation des travaux de recherche agronomique africaine. Le réseau fédère quatre catégories de membres (Junior, Professionnel, Partenaire, Sénior) autour de trois domaines d'activité (Mobilisation & Réseautage, Formation & Insertion, Agrobusiness & Consulting).

Le site web est à la fois la **porte d'entrée publique** du réseau et le **cœur opérationnel privé** de sa communauté de membres. Il doit convaincre, convertir, fidéliser et faire travailler ensemble les acteurs de la chaîne agricole africaine.

### 1.2 Objectifs stratégiques du site

| # | Objectif | KPI cible MVP |
|---|----------|---------------|
| O1 | Convertir les visiteurs en membres adhérents | Taux de conversion page "Rejoindre" ≥ 5 % |
| O2 | Centraliser la valeur réseau pour les membres actifs | Connexion mensuelle ≥ 60 % des membres actifs |
| O3 | Valoriser les savoirs agronomiques africains | ≥ 50 documents téléchargés/mois dès M3 |
| O4 | Générer des revenus via cotisations et services | 100 membres payants en 6 mois post-lancement |
| O5 | Asseoir l'autorité SEO du réseau sur l'agriculture africaine | Top 5 sur 5 requêtes longue traîne en 12 mois |
| O6 | Positionner agrolide comme interlocuteur pour bailleurs/sponsors | ≥ 3 partenariats institutionnels en 12 mois |

### 1.3 Portée du V1

**Langue :** Français uniquement. L'architecture i18n (next-intl) est posée dès le V1 pour permettre le basculement en V2 sans refactorisation majeure.

**Public cible prioritaire :** Membres Professionnels (cible principale selon la charte éditoriale), puis Juniors, Partenaires et Séniors.

**Contexte de navigation :** Majorité d'utilisateurs sur smartphone en Afrique subsaharienne, connexions 3G variables, coût de la data élevé. Chaque décision technique doit intégrer cette contrainte : performance, légèreté, PWA installable.

### 1.4 Stack technique — non modifiable

La stack est entièrement arrêtée et s'applique sans alternative :

| Couche | Technologie |
|--------|-------------|
| DNS | Cloudflare DNS |
| Frontend | Next.js 15 (App Router) déployé sur Vercel |
| API & Middleware | Cloudflare Workers |
| Base de données | Supabase PostgreSQL + Auth + RLS + Realtime |
| Stockage fichiers | Cloudflare R2 |
| Emails transactionnels | Resend |
| Newsletter | Brevo |
| Cache & Rate Limiting | Upstash Redis |
| Monitoring | Sentry |
| Paiement | Stripe (carte) + CinetPay (Mobile Money) |
| Webinaires/Replays | YouTube (embed) |

---

## 2. Arborescence du site & parcours utilisateurs

### 2.1 Arborescence complète (Next.js App Router)

```
src/
├── app/
│   ├── (public)/                         # Pages sans authentification
│   │   ├── page.tsx                      # Accueil
│   │   ├── qui-sommes-nous/
│   │   │   └── page.tsx                  # Histoire, valeurs, gouvernance
│   │   ├── rejoindre/
│   │   │   ├── page.tsx                  # Présentation des 4 profils membres
│   │   │   └── succes/page.tsx           # Confirmation post-inscription
│   │   ├── blog/
│   │   │   ├── page.tsx                  # Liste articles (SSG + ISR 24h)
│   │   │   └── [slug]/page.tsx           # Article individuel (SSG)
│   │   ├── evenements/
│   │   │   ├── page.tsx                  # Calendrier public
│   │   │   └── [id]/page.tsx             # Détail événement
│   │   ├── formations/
│   │   │   ├── page.tsx                  # Catalogue public
│   │   │   └── [id]/page.tsx             # Détail formation
│   │   ├── webinaires/
│   │   │   └── page.tsx                  # Replays publics (YouTube embed)
│   │   ├── bibliotheque/
│   │   │   └── page.tsx                  # Aperçu catalogue (accès limité)
│   │   ├── annuaire/
│   │   │   └── page.tsx                  # Aperçu annuaire (profils masqués)
│   │   ├── agrobusiness/
│   │   │   ├── page.tsx                  # Présentation services
│   │   │   ├── incubation/page.tsx       # Programme incubation
│   │   │   └── agripreneurs/page.tsx     # Vitrine agripreneurs accompagnés
│   │   ├── partenaires/
│   │   │   └── page.tsx                  # Partenaires institutionnels
│   │   └── nous-soutenir/
│   │       └── page.tsx                  # Crowdfunding / don
│   │
│   ├── (auth)/                           # Pages d'authentification
│   │   ├── login/page.tsx
│   │   ├── inscription/page.tsx          # Formulaire + sélection catégorie + paiement
│   │   ├── reset-password/page.tsx
│   │   └── callback/page.tsx             # Supabase OAuth/magic link callback
│   │
│   ├── (membres)/                        # Zone privée — auth requise
│   │   ├── layout.tsx                    # Auth guard + Sidebar navigation
│   │   ├── dashboard/page.tsx            # Vue personnalisée par catégorie
│   │   ├── profil/
│   │   │   ├── page.tsx                  # Voir son profil
│   │   │   └── modifier/page.tsx         # Modifier son profil
│   │   ├── cotisation/page.tsx           # État abonnement + renouvellement
│   │   ├── messages/page.tsx             # Messagerie interne
│   │   ├── notifications/page.tsx        # Centre de notifications
│   │   ├── bibliotheque/
│   │   │   ├── page.tsx                  # Catalogue complet
│   │   │   ├── [id]/page.tsx             # Détail + téléchargement
│   │   │   └── deposer/page.tsx          # Dépôt de document (Pro/Senior)
│   │   ├── formations/
│   │   │   ├── page.tsx                  # Catalogue + mes inscriptions
│   │   │   ├── [id]/page.tsx             # Détail + inscription
│   │   │   └── mes-certificats/page.tsx
│   │   ├── webinaires/
│   │   │   ├── page.tsx                  # Sessions privées + replays membres
│   │   │   └── [id]/page.tsx
│   │   ├── evenements/
│   │   │   └── page.tsx                  # Événements + mes inscriptions
│   │   ├── annuaire/
│   │   │   ├── page.tsx                  # Annuaire complet consultable
│   │   │   └── [id]/page.tsx             # Fiche profil membre
│   │   ├── opportunites/page.tsx         # Offres d'emploi + appels à projets
│   │   ├── forum/
│   │   │   ├── page.tsx                  # Liste des discussions
│   │   │   ├── [id]/page.tsx             # Fil de discussion
│   │   │   └── nouveau/page.tsx          # Créer une discussion
│   │   └── services/
│   │       └── demande/page.tsx          # Demande de service agrobusiness
│   │
│   └── (admin)/                          # Zone admin — rôle admin requis
│       ├── layout.tsx                    # Admin guard
│       ├── dashboard/page.tsx
│       ├── membres/
│       │   ├── page.tsx                  # Liste + gestion membres
│       │   └── [id]/page.tsx             # Fiche membre admin
│       ├── contenus/
│       │   ├── articles/page.tsx
│       │   ├── documents/page.tsx
│       │   ├── formations/page.tsx
│       │   └── evenements/page.tsx
│       ├── paiements/page.tsx
│       └── analytics/page.tsx
│
├── components/                           # Composants React partagés
│   ├── ui/                               # shadcn/ui ou composants custom
│   ├── layout/                           # Header, Footer, Sidebar, Nav
│   ├── auth/                             # AuthGuard, LoginForm
│   ├── modules/                          # Composants spécifiques par module
│   └── shared/                           # Cards, Badges, Filters, etc.
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                     # Client Supabase navigateur
│   │   ├── server.ts                     # Client Supabase serveur (Server Components)
│   │   └── middleware.ts                 # Vérification session
│   ├── cloudflare/
│   │   └── api.ts                        # Fonctions fetch vers Workers
│   ├── utils/
│   │   ├── formatters.ts
│   │   └── validators.ts
│   └── i18n/                             # next-intl — structure posée en V1
│       ├── routing.ts
│       └── request.ts
│
├── messages/
│   └── fr.json                           # Toutes les chaînes V1 (prêt pour traduction)
│
├── middleware.ts                         # Next.js middleware — gestion sessions
└── types/
    ├── database.ts                       # Types générés Supabase
    └── index.ts
```

### 2.2 Rôles utilisateurs et matrice d'accès

| Rôle | Description | Défini par |
|------|-------------|------------|
| `visitor` | Non authentifié | Par défaut |
| `junior` | Membre Junior actif | `profiles.categorie` + `statut_adhesion = actif` |
| `professionnel` | Membre Professionnel actif | Idem |
| `partenaire` | Membre Partenaire actif (personne morale) | Idem |
| `senior` | Membre Sénior actif | Idem |
| `admin_content` | Gestionnaire de contenu | `profiles.role = admin_content` |
| `super_admin` | Administrateur général | `profiles.role = super_admin` |

**Hiérarchie des accès (chaque niveau inclut le précédent) :**
`visitor` < `junior` < `professionnel` = `senior` = `partenaire` < `admin_content` < `super_admin`

> Note : Professionnel, Sénior et Partenaire ont des accès équivalents sur les fonctionnalités communes, avec des différences sur leurs espaces dédiés (Partenaire a une vitrine entreprise, Sénior a un espace mentorat).

### 2.3 Parcours utilisateur : Visiteur → Membre

```
Page d'accueil
  └──> CTA "Rejoindre le réseau"
        └──> Page /rejoindre (présentation 4 profils + cotisations)
              └──> Sélection catégorie + CTA "S'inscrire"
                    └──> Page /inscription
                          ├── Formulaire (email, mot de passe, prénom, nom, pays, spécialité)
                          ├── Sélection catégorie confirmée
                          ├── Paiement cotisation (Stripe ou CinetPay)
                          └──> Email de confirmation Resend
                                └──> Page /rejoindre/succes + redirection /membres/dashboard
```

### 2.4 Parcours utilisateur : Membre authentifié (Professionnel)

```
/membres/dashboard
  ├──> /membres/annuaire          (rechercher un pair, prendre contact)
  ├──> /membres/bibliotheque      (télécharger une fiche, déposer un document)
  ├──> /membres/formations        (s'inscrire à une session, télécharger un certificat)
  ├──> /membres/webinaires        (rejoindre une session privée, voir un replay)
  ├──> /membres/forum             (poster dans une discussion, répondre)
  ├──> /membres/opportunites      (consulter les offres d'emploi/appels à projets)
  ├──> /membres/messages          (messagerie interne avec un pair de l'annuaire)
  └──> /membres/profil/modifier   (mettre à jour son profil annuaire)
```

### 2.5 Parcours utilisateur : Visiteur intéressé par l'incubation

```
Page d'accueil → /agrobusiness/incubation
  └──> Présentation programme
        └──> Formulaire de candidature (pré-inscription)
              └──> Email Resend → équipe agrolide
                    └──> Retour équipe + accompagnement hors-site
```

---

## 3. Spécifications fonctionnelles — Module par module

> Conventions : US = User Story ; RG = Règle de Gestion ; Accès = rôles minimum requis.

---

### M1 — Vitrine & Positionnement

**Objectif :** Convaincre le visiteur de la légitimité d'agrolide et le convertir en membre. C'est la porte d'entrée du réseau.

#### 3.1.1 Page d'accueil (`/`)

**Sections obligatoires (dans l'ordre de défilement) :**

1. **Hero** — accroche centrée sur le "paradoxe africain" (continent le plus fertile, le plus importateur). Titre H1 : *"Fédérer la chaîne agricole, pour conquérir la souveraineté alimentaire"*. CTA principal : *"Rejoindre le réseau"* (→ `/rejoindre`). CTA secondaire : *"Découvrir nos actions"* (scroll vers DAS). Image de fond : photo de terrain africain (uploadée par l'équipe, stockée R2).

2. **Le problème** — 4 blocs iconographiques représentant les 4 freins structurels (isolement professionnel, manque de documentation, déficit d'accompagnement, sous-valorisation de la recherche). Pas de texte long — une phrase courte et percutante par bloc.

3. **Notre réponse** — 3 cartes DAS (Mobilisation & Réseautage, Formation & Insertion, Agrobusiness & Consulting). Chaque carte : titre DAS, description 2 phrases, lien vers la section dédiée.

4. **Chiffres clés** — Compteurs animés au scroll : nombre de membres, pays représentés, documents en bibliothèque, formations disponibles. Les valeurs sont lues depuis Supabase via un Server Component (ISR 1h).

5. **Témoignages** — 3 citations de membres (texte + photo + nom + catégorie + pays). Données gérées depuis l'admin.

6. **Derniers articles de blog** — 3 articles récents (SSG + ISR 24h). Lien vers `/blog`.

7. **CTA final** — Bannière pleine largeur fond `#1b5e38` : *"Rejoignez le réseau continental de l'agriculture africaine."* + bouton `#f99e1d` *"Devenir membre"*.

**User stories M1 — Accueil :**

- US-001 : En tant que visiteur, je vois en moins de 3 secondes ce qu'est agrolide et pourquoi le rejoindre.
- US-002 : En tant que visiteur sur mobile, je peux scroller la page d'accueil sans gêne de mise en page (responsive, images optimisées WebP, lazy-load).
- US-003 : En tant que visiteur, je clique sur "Rejoindre le réseau" et j'arrive sur une page m'expliquant les 4 profils membres et leurs avantages.

**Règles de gestion M1 — Accueil :**

- RG-001 : Les chiffres clés sont des requêtes `COUNT(*)` Supabase côté serveur avec ISR 1h. Valeurs initiales hardcodées à 0 si Supabase est inaccessible (fallback).
- RG-002 : Le hero ne doit pas dépasser 100 Ko en poids total sur mobile (images R2 compressées WebP ≤ 80 Ko, lazy-load pour les sections sous le fold).
- RG-003 : La page d'accueil est entièrement SSG/ISR — aucun appel client-side bloquant au chargement initial.

#### 3.1.2 Page "Qui sommes-nous" (`/qui-sommes-nous`)

**Sections :**
1. Histoire du réseau (contexte, enquête de terrain, création de l'association).
2. Mission, Vision et Slogan.
3. 5 valeurs fondatrices en cartes (Solidarité, Leadership, Excellence, Innovation africaine, Impact).
4. Gouvernance (organigramme visuel — placeholder avec noms à compléter).
5. Les 3 DAS en détail (texte long, liens vers pages services).
6. CTA bas de page : "Rejoindre le réseau".

**Règle de gestion RG-004 :** Cette page est entièrement statique (SSG). Le contenu est géré en Markdown dans le CMS admin (champ `rich_text` en table `pages_statiques`).

#### 3.1.3 Page "Rejoindre le réseau" (`/rejoindre`)

**Contenu :**
1. Accroche : *"Votre réseau continental vous attend."*
2. 4 cartes profils membres côte à côte sur desktop, empilées sur mobile :

| Profil | Description synthèse | Cotisation | CTA |
|--------|---------------------|------------|-----|
| **Junior** | Étudiants, jeunes diplômés, passionnés | 5 000 FCFA/an *(hypothèse — voir §9)* | S'inscrire |
| **Professionnel** | Agronomes, chercheurs, consultants actifs | 15 000 FCFA/an *(hypothèse)* | S'inscrire |
| **Partenaire** | Entreprises, coopératives, institutions | 50 000 FCFA/an *(hypothèse)* | Contacter |
| **Sénior** | Mentors, experts, investisseurs bénévoles | Gratuit *(hypothèse — voir §9)* | Candidater |

3. Section "Avantages membres" : tableau comparatif des 4 catégories et leurs accès (annuaire, bibliothèque, formations privées, forum, etc.).
4. FAQ (5 questions minimum : durée d'engagement, renouvellement, remboursement, paiement Mobile Money, différence Junior/Professionnel).

**User stories :**
- US-004 : En tant que visiteur, je compare les 4 profils et clique sur le profil qui me correspond pour lancer mon inscription.
- US-005 : En tant que visiteur africain, je vois que je peux payer par Orange Money / MTN Mobile Money — pas seulement par carte bancaire.

**Règles de gestion :**
- RG-005 : Le CTA "Contacter" pour Partenaire ouvre un formulaire de contact (email → Resend → équipe agrolide) plutôt que le flow d'inscription automatique, car l'adhésion Partenaire nécessite une validation manuelle.
- RG-006 : Le CTA "Candidater" pour Sénior ouvre un formulaire de candidature (nom, spécialité, pays, biographie, motivations). L'activation du compte Sénior est manuelle par le super_admin.

---

### M2 — Espace Membres

**Objectif :** Tableau de bord personnalisé par catégorie, gestion du profil et de la cotisation.

#### 3.2.1 Authentification

**Flow inscription :**
1. Formulaire `/inscription` : prénom, nom, email, mot de passe (min. 8 caractères, 1 majuscule, 1 chiffre), pays (liste déroulante des pays africains en priorité), catégorie de membre.
2. Validation Zod côté Worker avant insertion Supabase.
3. Supabase Auth crée l'utilisateur + envoie email de vérification via Resend (template Resend personnalisé aux couleurs agrolide).
4. À la vérification email, le profil passe en `statut_adhesion = en_attente_paiement`.
5. Redirection vers la page de paiement de la cotisation.
6. Après paiement validé (webhook Stripe/CinetPay), `statut_adhesion = actif`.

**Flow connexion :**
- Email + mot de passe via Supabase Auth.
- Option "Mot de passe oublié" : magic link Resend.
- Session gérée par cookies HTTP-only via `@supabase/ssr`.
- Middleware Next.js (`middleware.ts`) vérifie la session à chaque requête vers `/(membres)/` et `/(admin)/`.

**Règles de gestion :**
- RG-007 : Un utilisateur avec `statut_adhesion = en_attente_paiement` peut se connecter mais ne voit qu'une page "Finaliser votre adhésion" avec le lien de paiement. Il n'a accès à aucune fonctionnalité membre.
- RG-008 : Un utilisateur avec `statut_adhesion = expire` peut se connecter et voit une bannière d'alerte avec CTA de renouvellement. Il conserve un accès lecture seule à son historique (formations suivies, certificats) mais perd l'accès aux contenus membres.
- RG-009 : La vérification d'email est obligatoire avant tout accès. Pas de bypass possible.
- RG-010 : Le rate limiting sur `/api/auth/login` est assuré par Upstash Redis : max 5 tentatives par IP par tranche de 15 minutes, puis blocage temporaire 30 minutes.

#### 3.2.2 Tableau de bord (`/membres/dashboard`)

Le dashboard est différencié par catégorie. Il affiche :

**Éléments communs à toutes catégories :**
- Bandeau de bienvenue personnalisé (prénom + badge catégorie couleur).
- Statut de cotisation (actif jusqu'au JJ/MM/AAAA + barre de progression de l'année).
- Raccourcis rapides vers les sections les plus utilisées (annuaire, bibliothèque, forum).
- Notifications récentes (Supabase Realtime).
- Derniers événements à venir (filtrés selon la catégorie).

**Spécificités par catégorie :**

| Catégorie | Bloc spécifique |
|-----------|----------------|
| Junior | "Mon parcours" : formations inscrites, prochaine session. Bloc "Mentor disponible" (lien vers Séniors de l'annuaire). |
| Professionnel | "Mes contributions" : documents déposés, nombre de vues. Bloc "Opportunités" : 3 dernières offres d'emploi. |
| Partenaire | "Ma fiche entreprise" : statut de la vitrine. "Candidatures reçues" (si program incubation). |
| Sénior | "Mon activité de mentorat" : mentorés actifs. "Mes webinaires" : prochain slot animé. |

**Règles de gestion :**
- RG-011 : Le dashboard est rendu en SSR (Server Component) avec les données de l'utilisateur connecté. Les données temps-réel (notifications, messages) sont hydratées côté client via Supabase Realtime (channel `user:{id}`).
- RG-012 : Si `statut_adhesion = expire`, le dashboard affiche une bannière rouge non-fermable en haut de page avec CTA "Renouveler ma cotisation".

#### 3.2.3 Gestion du profil (`/membres/profil`)

**Champs du profil membre :**

```
Informations personnelles :
  - Photo de profil (upload → R2, max 2 Mo, formats JPG/PNG/WebP)
  - Prénom, Nom
  - Pays de résidence (liste pays)
  - Ville
  - Biographie courte (max 500 caractères)
  - Lien LinkedIn (URL validée)
  - Site web personnel (URL optionnelle)

Informations professionnelles :
  - Spécialité principale (liste prédéfinie + champ libre)
  - Secteurs d'expertise (multi-sélection : productions végétales, élevage, agritech, etc.)
  - Niveau d'études (Bac+2, Bac+3, Master, Doctorat, Autre)
  - Organisation / Employeur actuel (optionnel)
  - Langues parlées (multi-sélection)

Paramètres annuaire :
  - Visible dans l'annuaire (toggle, défaut : OUI)
  - Ouvert aux prises de contact interne (toggle, défaut : OUI)

Paramètres notifications :
  - Recevoir la newsletter Brevo (toggle)
  - Notifications opportunités (toggle)
  - Notifications événements (toggle)
```

**Règles de gestion :**
- RG-013 : Le profil est visible dans l'annuaire uniquement si `annuaire_visible = true` ET `statut_adhesion = actif`.
- RG-014 : La photo de profil est redimensionnée à 400×400 px côté Worker avant stockage R2 (bibliothèque Sharp).
- RG-015 : Chaque modification du profil déclenche une mise à jour de la table `profiles` via un appel Worker POST `/api/membres/profil` (jamais d'appel direct Supabase depuis le client).

#### 3.2.4 Gestion cotisation (`/membres/cotisation`)

**Contenu :**
- Statut actuel (actif / expiré / en attente).
- Date d'expiration.
- Historique des paiements (tableau : date, montant, méthode, statut).
- Bouton "Renouveler" ou "Mettre à niveau" (changer de catégorie — payement différentiel).
- Lien vers les CGU et politique de remboursement.

**Règles de gestion :**
- RG-016 : La cotisation dure 12 mois calendaires à partir de la date de validation du paiement.
- RG-017 : Un email de rappel Resend est envoyé 30 jours avant expiration, puis 7 jours avant, puis le jour J.
- RG-018 : Le paiement Stripe est traité via une Checkout Session créée par le Worker `/api/paiements/checkout`. Le Worker CinetPay crée un lien de paiement Mobile Money. Aucune donnée de carte n'est traitée par le Worker — tout passe par les SDK Stripe/CinetPay.

---

### M3 — Annuaire Professionnel

**Objectif (DAS MRR) :** Cartographier et connecter les membres pour briser l'isolement professionnel.

#### 3.3.1 Accès public vs membres

| Fonctionnalité | Visiteur | Membre actif |
|----------------|----------|-------------|
| Voir que l'annuaire existe | ✅ | ✅ |
| Voir le nombre de membres et les pays | ✅ | ✅ |
| Voir les fiches profils complètes | ❌ (floutées) | ✅ |
| Rechercher par critères | ❌ | ✅ |
| Contacter un membre | ❌ | ✅ (si membre a activé le contact) |

**Page aperçu public (`/annuaire`) :** Affiche 6 cartes profils floutées + message "Rejoignez le réseau pour accéder à l'annuaire complet". CTA → `/rejoindre`.

#### 3.3.2 Annuaire membres (`/membres/annuaire`)

**Filtres de recherche (Server Actions ou fetch Worker) :**
- Pays (multi-sélection)
- Spécialité (multi-sélection depuis liste prédéfinie)
- Catégorie de membre (Junior, Professionnel, Partenaire, Sénior)
- Langue parlée
- Disponible pour du mentorat (toggle — Séniors uniquement)
- Recherche textuelle (prénom, nom, organisation)

**Affichage des résultats :**
- Cartes profils (photo, prénom + initiale nom, pays, spécialité, catégorie badge, bouton "Voir la fiche").
- Pagination : 20 profils par page (curseur Supabase, pas OFFSET pour performance).
- Vue carte interactive (optionnel V2 — marqueurs par pays).

**Fiche profil membre (`/membres/annuaire/[id]`) :**
- Photo, nom complet, pays, ville, spécialité, biographie, secteurs d'expertise, langues, LinkedIn.
- Badge catégorie coloré.
- Bouton "Envoyer un message" → ouvre la messagerie interne (si `ouvert_contact = true`).
- Bouton "Voir ses contributions" → liste ses documents déposés en bibliothèque.

**User stories :**
- US-006 : En tant que Membre Professionnel, je recherche un consultant en agritech au Sénégal et je le contacte via la messagerie interne en moins de 2 minutes.
- US-007 : En tant que Membre Junior, je cherche un mentor disponible pour m'accompagner sur un projet d'élevage.

**Règles de gestion :**
- RG-019 : La recherche full-text sur nom/biographie utilise `pg_trgm` de PostgreSQL via un index GIN (configurer via migration Supabase).
- RG-020 : Un membre peut masquer son profil de l'annuaire à tout moment via ses paramètres. Son profil disparaît dans les 5 minutes (invalidation cache Upstash Redis).
- RG-021 : Les Membres Partenaires (personnes morales) affichent le nom de l'organisation en priorité sur le nom d'une personne physique.

---

### M4 — Bibliothèque Numérique

**Objectif (DAS FIP) :** Valoriser les savoirs académiques, rendre accessible la connaissance agronomique adaptée aux réalités africaines.

#### 3.4.1 Catalogue public (`/bibliotheque`)

Affiche les 6 derniers documents publics + compteur total. Les documents membres sont signalés "Réservé aux membres" avec CTA d'adhésion.

#### 3.4.2 Bibliothèque membres (`/membres/bibliotheque`)

**Filtres :**
- Thématique (productions végétales, élevage, agritech, marché, financement, politique agricole, etc.)
- Type de document (Thèse, Mémoire, Fiche technique, Guide pratique, Article scientifique, Rapport)
- Pays (pays de l'étude ou de l'auteur)
- Filière (céréales, maraîchage, élevage bovin, pêche, transformation, etc.)
- Langue (français, anglais, autre)
- Accès (public / membres uniquement)
- Année de publication

**Fiche document (`/membres/bibliotheque/[id]`) :**
- Titre, auteur(s), type, date, résumé (max 500 caractères).
- Tags thématiques, pays concerné, filière.
- Bouton "Télécharger" → URL signée R2 (expiration 15 minutes).
- Compteur de téléchargements.
- Documents similaires (même thématique).

**Dépôt de document (`/membres/bibliotheque/deposer`) :**
- Accès : Professionnel, Sénior, Partenaire (pas Junior).
- Formulaire : titre, auteurs, type, résumé, thématique, pays, filière, langue, fichier PDF (max 50 Mo → R2 via upload signé).
- Statut après dépôt : `en_attente_validation` → email Resend à `admin_content`.
- Publication après validation manuelle admin.

**User stories :**
- US-008 : En tant que Membre Junior, je télécharge une fiche technique sur la culture du manioc en sols latéritiques du Togo.
- US-009 : En tant que Membre Professionnel chercheur, je dépose ma thèse de doctorat pour la rendre accessible aux praticiens du réseau.
- US-010 : En tant que visiteur, je vois qu'il existe une bibliothèque mais je ne peux pas télécharger sans adhérer.

**Règles de gestion :**
- RG-022 : Les fichiers déposés sont stockés sur Cloudflare R2 dans le bucket `agrolide-bibliotheque`. L'URL publique directe est désactivée. Tout téléchargement passe par un lien signé généré par le Worker `/api/bibliotheque/download/[id]` après vérification du rôle.
- RG-023 : Quota de téléchargement : Membres Juniors 20 documents/mois, Membres Professionnels/Séniors/Partenaires illimité. Suivi via Upstash Redis (compteur incrémental par `user_id` + reset mensuel via Cron Job Cloudflare).
- RG-024 : Un document en `statut = publie` avec `acces = public` est indexé par les moteurs de recherche (meta description = résumé tronqué à 160 caractères).
- RG-025 : La recherche plein texte sur titre et résumé utilise `to_tsvector` PostgreSQL avec dictionnaire français.

---

### M5 — Formations & Webinaires

**Objectif (DAS FIP) :** Centraliser les offres de montée en compétences, gérer inscriptions et certifications.

#### 3.5.1 Catalogue public (`/formations`, `/webinaires`)

- Formations certifiantes : titre, organisme, modalité (présentiel/distanciel), durée, prochaine session, prix, CTA "En savoir plus".
- Webinaires publics : titre, intervenant, date, durée, lien YouTube embed ou bouton "S'inscrire" (gratuit).
- CTA global : "Voir toutes les formations membres — Rejoindre le réseau".

#### 3.5.2 Espace formations membres (`/membres/formations`)

**Catalogue formations (avec filtres) :**
- Modalité (présentiel, distanciel, hybride)
- Thématique
- Niveau (débutant, intermédiaire, avancé)
- Statut (à venir, en cours, passée)
- Accès (publique gratuite, membres, payante)

**Fiche formation (`/membres/formations/[id]`) :**
- Titre, description complète, programme (accordion par module), intervenants (profil agrolide ou externe), prérequis.
- Prochaines sessions disponibles (dates, places restantes — compteur Supabase).
- Avis des participants (note 1-5 + texte, affiché après participation).
- Bouton "S'inscrire" → confirmation + email Resend.

**Gestion des inscriptions :**
- Tableau "Mes formations" : liste des formations inscrites, statut (à venir / en cours / terminée), lien "Rejoindre" (si distanciel — lien Zoom/Teams à afficher J-1).
- Téléchargement de certificat PDF (généré côté Worker, noms + date + cachet agrolide, template Jinja2 si Python worker — ou template HTML→PDF côté Worker) après marquage `statut_inscription = complete` par l'admin.

**Webinaires privés membres (`/membres/webinaires`) :**
- Sessions techniques réservées aux membres (embed YouTube Live ou lien plateforme).
- Replays des sessions passées (embed YouTube + résumé + fiche technique condensée téléchargeable).
- Distinction visuelle : badge vert "Membres" sur les sessions privées, badge gris "Public" sur les replays publics.

**User stories :**
- US-011 : En tant que Membre Junior, je m'inscris à un webinaire sur les techniques de compostage tropical et reçois un lien de rappel la veille.
- US-012 : En tant que Membre Professionnel, je télécharge mon certificat de participation à la formation "Business Plan Agrobusiness" après validation.

**Règles de gestion :**
- RG-026 : Les inscriptions sont limitées par session selon un champ `places_max`. Au-delà, l'inscription est impossible et un bouton "Me mettre sur liste d'attente" apparaît.
- RG-027 : Email Resend automatique envoyé à J-7 et J-1 avant chaque session inscrite.
- RG-028 : Les Membres Juniors ont accès aux webinaires publics gratuits et aux formations certifiantes payantes (tarif propre). Les sessions techniques privées sont accessibles à tous les membres actifs.
- RG-029 : Les replays YouTube sont embarqués via l'API YouTube embed — jamais stockés sur R2 (coût bande passante).
- RG-030 : Le certificat PDF est généré par le Worker `/api/formations/certificat/[inscription_id]`. Format A4 paysage, logo agrolide, nom complet du membre, titre de la formation, date, signature (image), numéro de certificat unique (UUID). Stocké en R2 et URL signée envoyée par email.

---

### M6 — Événements & Communauté

**Objectif (DAS MRR) :** Animer la communauté, favoriser les rencontres, centraliser les opportunités.

#### 3.6.1 Calendrier événements public (`/evenements`)

- Affichage en liste et/ou calendrier mensuel visuel (composant React léger, pas de dépendance lourde type FullCalendar).
- Filtres : pays, type (meet-up, webinaire, conférence, atelier), en ligne / présentiel.
- Chaque événement : titre, date, lieu (ville ou "En ligne"), description courte, CTA "S'inscrire" ou "En savoir plus".

#### 3.6.2 Événements membres

**Inscription en ligne :**
- Formulaire simple (nom, email pré-rempli, commentaire optionnel).
- Email de confirmation Resend avec détails de l'événement.
- Si présentiel : rappel J-3.

#### 3.6.3 Forum communautaire (`/membres/forum`)

**Structure :**
- Catégories prédéfinies : Réseau & communauté | Formation & savoirs | Entrepreneuriat agricole | Recherche & vulgarisation | Opportunités | Annonces.
- Chaque fil : titre, auteur (lien profil), date, nombre de réponses, badge catégorie.
- Dans un fil : messages chronologiques avec édition possible (auteur uniquement) dans les 24h.
- Réactions emoji (like minimum : 👍).

**Modération :**
- Signalement de message possible par tout membre.
- Les messages signalés passent en `statut = en_revue` et sont masqués jusqu'à décision admin.
- L'`admin_content` peut supprimer, masquer ou déplacer un fil.

#### 3.6.4 Espace opportunités (`/membres/opportunites`)

- Offres d'emploi (titre, employeur, pays, type contrat, date limite, lien candidature externe).
- Appels à projets (titre, bailleur, montant indicatif, date limite, lien officiel).
- Partenariats recherchés (postés par Membres Partenaires/Séniors).
- Filtres : type, pays, filière.
- Notification Realtime : nouvel item → badge rouge sur l'icône "Opportunités" dans la nav.

**User stories :**
- US-013 : En tant que Membre Junior, je vois un appel à projets de la FAO pour des agripreneurs de moins de 35 ans et je clique pour postuler directement sur le site de la FAO.
- US-014 : En tant que Membre Professionnel, je poste dans le forum une question sur la gestion des ravageurs du palmier à huile et reçois 3 réponses en 48h.

**Règles de gestion :**
- RG-031 : Toute opportunité postée par un membre (non admin) passe en `statut = en_attente_validation` avant publication.
- RG-032 : Les événements passés restent visibles dans l'historique (archivés, non supprimés).
- RG-033 : Le forum est accessible à tous les membres actifs (Junior inclus). La messagerie privée est limitée aux Membres Professionnels, Partenaires et Séniors (anti-spam).

---

### M7 — Agrobusiness & Consulting

**Objectif (DAS ACI) :** Présenter et commercialiser les services à forte valeur ajoutée du réseau.

#### 3.7.1 Pages publiques

**Page services (`/agrobusiness`) :**
- Présentation des 3 types de services : études de faisabilité et de marché, rédaction de business plans, conseil technique aux exploitations.
- Pour chaque service : description, livrables attendus, processus en 3 étapes (brief → proposition → livraison), formulaire de demande.
- Références (projets réalisés avec accord client).

**Programme incubation (`/agrobusiness/incubation`) :**
- Présentation complète du programme (durée, critères de sélection, ce que le réseau apporte).
- Conditions d'éligibilité (agripreneur africain, projet en phase idéation ou pré-amorçage, secteur agricole).
- Calendrier des prochaines promotions.
- Bouton "Déposer ma candidature" → formulaire de candidature.
- Vitrine des agripreneurs accompagnés (`/agrobusiness/agripreneurs`) : cartes success stories.

#### 3.7.2 Formulaire de demande de service

**Champs :**
- Prénom, Nom, Email, Pays, Organisation.
- Type de service souhaité (sélection unique).
- Description du besoin (textarea, max 1 000 caractères).
- Budget indicatif (liste : < 500 USD / 500–2 000 USD / 2 000–5 000 USD / > 5 000 USD / À discuter).
- Délai souhaité (date ou "flexible").
- Pièce jointe optionnelle (max 5 Mo → R2 bucket `agrolide-demandes`).

**Règle RG-034 :** La soumission du formulaire déclenche : (1) Email Resend à l'équipe agrolide avec tous les champs + lien pièce jointe signé R2. (2) Email de confirmation au demandeur. (3) Insertion en table `demandes_service` (statut = `nouveau`). Aucun paiement n'est déclenché à ce stade — la facturation est manuelle.

#### 3.7.3 Formulaire de candidature incubation

**Champs supplémentaires :**
- Nom du projet, secteur agricole, stade d'avancement (idée / prototype / pré-commercial).
- Problème adressé, solution proposée, marché cible, modèle économique envisagé (textarea).
- Avez-vous déjà reçu un financement ? (oui/non + montant si oui).
- CV ou présentation courte (PDF, max 5 Mo → R2).
- Motivation à rejoindre agrolide (textarea).

**Règle RG-035 :** Candidature insérée en table `candidatures_incubation` avec `statut = soumise`. Email Resend à l'équipe + accusé de réception au candidat. Sélection et réponse gérées manuellement par l'équipe.

---

### M8 — Collecte de Fonds & Partenariats

**Objectif (DAS MRR) :** Assurer la viabilité économique du réseau via crowdfunding et partenariats institutionnels.

#### 3.8.1 Page crowdfunding (`/nous-soutenir`)

**Sections :**
1. Pitch de la campagne : "Pourquoi soutenir agrolide ?" (2–3 paragraphes, impact concret, données chiffrées).
2. Objectif de collecte + barre de progression (montant collecté vs objectif — données Supabase, ISR 30 min).
3. Paliers de don (5 000 FCFA / 15 000 FCFA / 50 000 FCFA / Montant libre) avec description de l'impact de chaque palier.
4. Bouton "Soutenir agrolide" → paiement Stripe (carte) ou CinetPay (Mobile Money).
5. Liste des derniers soutiens (prénom, montant, date — optionnel selon paramètre de confidentialité du donateur).
6. Témoignages d'impact.

**Règle RG-036 :** Après paiement validé, insertion en table `contributions` + email de reçu Resend au donateur. La barre de progression est calculée en ISR 30 min depuis `SUM(montant)` sur contributions validées.

#### 3.8.2 Page partenaires (`/partenaires`)

- Logos partenaires institutionnels (affichés en grille responsive) — images R2.
- Pour chaque partenaire (si fiche disponible) : nom, description courte, lien web.
- Témoignages de partenaires (citation + photo + nom + titre).
- Formulaire de contact partenariat/sponsoring : raison sociale, secteur, nature de la collaboration envisagée, budget approximatif, email, message.

**Règle RG-037 :** La soumission du formulaire partenariat déclenche un email Resend à l'équipe + accusé de réception. Insertion en `contacts_partenariat` (statut = `nouveau`).

---

### M9 — Blog & Actualités

**Objectif :** Référencement naturel, rayonnement du réseau, démonstration d'expertise.

#### 3.9.1 Structure éditoriale (conforme charte)

**Types d'articles :**
- Article de fond (800–1 200 mots) — 2/mois
- Fiche technique vulgarisée (400–600 mots) — 2/mois
- Portrait / success story (600–800 mots) — 1/mois
- Retour sur événement (300–500 mots) — selon agenda

**Champs d'un article :**
- Titre (H1, max 70 caractères pour SEO)
- Slug (auto-généré depuis le titre, modifiable)
- Auteur (membre agrolide ou "Équipe agrolide")
- Date de publication
- Catégorie (correspondant aux 4 piliers éditoriaux)
- Tags (multi-valeur)
- Image à la Une (R2, format 1200×630 px recommandé — avec logo agrolide)
- Contenu (éditeur riche — **Tiptap** recommandé pour React/Next.js)
- Extrait / meta description (max 160 caractères — auto-généré ou manuel)
- CTA fin d'article (lien interne + texte du bouton — champ configurable)
- Statut (brouillon / planifié / publié)
- Accès (public / membres)

#### 3.9.2 Pages blog

**Liste articles (`/blog`) :**
- Grille de cartes (image, catégorie badge, titre, extrait, auteur, date, temps de lecture estimé).
- Filtres : catégorie, tag, auteur.
- Pagination 10 articles par page (ISR 24h).
- Barre de recherche (client-side sur les articles en cache ou Worker `/api/blog/search`).

**Article (`/blog/[slug]`) :**
- Rendu SSG avec ISR 24h.
- Table des matières auto-générée depuis les H2 (JS côté client).
- Partage social (boutons LinkedIn, WhatsApp — pas de trackers tiers).
- Articles similaires (même catégorie, 3 suggestions).
- CTA fin d'article configuré dans l'admin.
- Embed YouTube si webinaire associé.

**User stories :**
- US-015 : En tant que visiteur depuis LinkedIn, je lis un article sur les techniques d'irrigation en zone sahélienne et je clique sur "Télécharger la fiche technique complète" qui me demande de m'inscrire.
- US-016 : En tant que membre, je peux accéder aux articles réservés aux membres depuis mon dashboard.

**Règles de gestion :**
- RG-038 : Chaque article a une balise `<meta name="description">` et balises Open Graph complètes (og:title, og:description, og:image avec image à la Une, og:type = article).
- RG-039 : Le sitemap XML (`/sitemap.xml`) est généré dynamiquement par Next.js à partir de la table `articles` (slug + date de modification) — régénéré toutes les 24h.
- RG-040 : Le contenu des articles est stocké en JSON (format Tiptap) en base Supabase. Le rendu HTML est généré côté serveur par `@tiptap/html`.

---

## 4. Modèle de données Supabase

### 4.1 Types ENUM et tables de référence

```sql
-- Types énumérés
CREATE TYPE membre_categorie  AS ENUM ('junior', 'professionnel', 'partenaire', 'senior');
CREATE TYPE adhesion_statut   AS ENUM ('en_attente_paiement', 'actif', 'expire', 'suspendu');
CREATE TYPE role_plateforme   AS ENUM ('membre', 'admin_content', 'super_admin');
CREATE TYPE doc_type          AS ENUM ('these', 'memoire', 'fiche_technique', 'guide_pratique', 'article', 'rapport');
CREATE TYPE doc_acces         AS ENUM ('public', 'membres');
CREATE TYPE doc_statut        AS ENUM ('en_attente_validation', 'publie', 'rejete', 'archive');
CREATE TYPE formation_modalite AS ENUM ('presentiel', 'distanciel', 'hybride');
CREATE TYPE inscription_statut AS ENUM ('inscrit', 'en_attente', 'complete', 'annule');
CREATE TYPE evenement_type    AS ENUM ('meetup', 'webinaire', 'conference', 'atelier', 'autre');
CREATE TYPE paiement_methode  AS ENUM ('stripe', 'cinetpay');
CREATE TYPE paiement_statut   AS ENUM ('en_attente', 'valide', 'echoue', 'rembourse');
CREATE TYPE demande_statut    AS ENUM ('nouveau', 'en_cours', 'traite', 'clos');
CREATE TYPE opportunite_type  AS ENUM ('emploi', 'appel_a_projets', 'partenariat');
```

### 4.2 Tables principales

```sql
-- =====================================================
-- MEMBRES & AUTH
-- =====================================================

-- Extension de auth.users de Supabase
CREATE TABLE profiles (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  categorie           membre_categorie NOT NULL,
  statut_adhesion     adhesion_statut DEFAULT 'en_attente_paiement' NOT NULL,
  role_plateforme     role_plateforme DEFAULT 'membre' NOT NULL,
  prenom              TEXT NOT NULL,
  nom                 TEXT NOT NULL,
  email               TEXT NOT NULL UNIQUE,
  pays                TEXT NOT NULL,
  ville               TEXT,
  biographie          TEXT CHECK (char_length(biographie) <= 500),
  photo_url           TEXT,                    -- URL R2 signée (stockage)
  specialite          TEXT,
  secteurs_expertise  TEXT[],                  -- Array de tags
  niveau_etudes       TEXT,
  organisation        TEXT,
  linkedin_url        TEXT,
  site_web_url        TEXT,
  langues             TEXT[],
  annuaire_visible    BOOLEAN DEFAULT TRUE,
  ouvert_contact      BOOLEAN DEFAULT TRUE,
  newsletter_brevo    BOOLEAN DEFAULT TRUE,
  notif_opportunites  BOOLEAN DEFAULT TRUE,
  notif_evenements    BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Cotisations
CREATE TABLE cotisations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  membre_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  categorie       membre_categorie NOT NULL,
  montant_fcfa    INTEGER NOT NULL,
  methode         paiement_methode NOT NULL,
  statut          paiement_statut DEFAULT 'en_attente',
  provider_ref    TEXT,                        -- ID transaction Stripe/CinetPay
  date_debut      DATE,
  date_fin        DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Messages internes
CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expediteur_id   UUID NOT NULL REFERENCES profiles(id),
  destinataire_id UUID NOT NULL REFERENCES profiles(id),
  contenu         TEXT NOT NULL CHECK (char_length(contenu) <= 2000),
  lu              BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type            TEXT NOT NULL,               -- 'nouveau_message', 'evenement', 'opportunite', etc.
  contenu         TEXT NOT NULL,
  lien            TEXT,
  lu              BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ANNUAIRE (vue dérivée de profiles — voir §4.3)
-- =====================================================

-- =====================================================
-- BIBLIOTHÈQUE
-- =====================================================

CREATE TABLE documents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre           TEXT NOT NULL,
  auteurs         TEXT NOT NULL,
  type_doc        doc_type NOT NULL,
  acces           doc_acces DEFAULT 'membres' NOT NULL,
  statut          doc_statut DEFAULT 'en_attente_validation' NOT NULL,
  resume          TEXT CHECK (char_length(resume) <= 500),
  thematique      TEXT NOT NULL,
  pays            TEXT,
  filiere         TEXT,
  langue          TEXT DEFAULT 'fr',
  annee           INTEGER,
  fichier_r2_key  TEXT NOT NULL,               -- Clé objet R2 (ex: bibliotheque/uuid.pdf)
  taille_octets   BIGINT,
  nb_telechargements INTEGER DEFAULT 0,
  depose_par      UUID REFERENCES profiles(id),
  valide_par      UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  published_at    TIMESTAMPTZ
);

-- Téléchargements (log)
CREATE TABLE telechargements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id     UUID NOT NULL REFERENCES documents(id),
  membre_id       UUID NOT NULL REFERENCES profiles(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- FORMATIONS & WEBINAIRES
-- =====================================================

CREATE TABLE formations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre           TEXT NOT NULL,
  description     TEXT,
  programme_json  JSONB,                       -- [{module: "...", contenu: "..."}]
  modalite        formation_modalite NOT NULL,
  thematique      TEXT,
  niveau          TEXT,                        -- 'debutant', 'intermediaire', 'avance'
  acces           doc_acces DEFAULT 'membres',
  prix_fcfa       INTEGER DEFAULT 0,           -- 0 = gratuit
  intervenants    JSONB,                       -- [{nom, titre, photo_url}]
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sessions_formation (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id    UUID NOT NULL REFERENCES formations(id),
  date_debut      TIMESTAMPTZ NOT NULL,
  date_fin        TIMESTAMPTZ NOT NULL,
  lieu            TEXT,                        -- Ville ou "En ligne"
  lien_rejoindre  TEXT,                        -- Zoom/Teams pour J-1
  places_max      INTEGER,
  places_restantes INTEGER,
  statut          TEXT DEFAULT 'ouvert',       -- 'ouvert', 'complet', 'annule', 'termine'
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE inscriptions_formation (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID NOT NULL REFERENCES sessions_formation(id),
  membre_id       UUID NOT NULL REFERENCES profiles(id),
  statut          inscription_statut DEFAULT 'inscrit',
  certificat_r2_key TEXT,                      -- Clé R2 du PDF certificat
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, membre_id)
);

-- Avis formations
CREATE TABLE avis_formation (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id    UUID NOT NULL REFERENCES formations(id),
  membre_id       UUID NOT NULL REFERENCES profiles(id),
  note            INTEGER NOT NULL CHECK (note BETWEEN 1 AND 5),
  commentaire     TEXT CHECK (char_length(commentaire) <= 500),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(formation_id, membre_id)
);

-- Webinaires
CREATE TABLE webinaires (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre           TEXT NOT NULL,
  description     TEXT,
  date_heure      TIMESTAMPTZ NOT NULL,
  duree_minutes   INTEGER,
  intervenant     TEXT,
  youtube_id      TEXT,                        -- ID vidéo YouTube (embed)
  youtube_live_id TEXT,                        -- ID live YouTube (si direct)
  acces           doc_acces DEFAULT 'membres',
  fiche_resumee_id UUID REFERENCES documents(id), -- Fiche technique post-webinaire
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ÉVÉNEMENTS & COMMUNAUTÉ
-- =====================================================

CREATE TABLE evenements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre           TEXT NOT NULL,
  description     TEXT,
  type_evt        evenement_type NOT NULL,
  date_debut      TIMESTAMPTZ NOT NULL,
  date_fin        TIMESTAMPTZ,
  lieu            TEXT,
  pays            TEXT,
  en_ligne        BOOLEAN DEFAULT FALSE,
  lien_inscription TEXT,                       -- Lien externe ou interne
  places_max      INTEGER,
  image_url       TEXT,                        -- R2
  publie          BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE inscriptions_evenement (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evenement_id    UUID NOT NULL REFERENCES evenements(id),
  membre_id       UUID REFERENCES profiles(id),
  email_externe   TEXT,                        -- Pour les non-membres (visiteurs)
  prenom          TEXT,
  nom             TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Forum
CREATE TABLE forum_categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom             TEXT NOT NULL UNIQUE,
  ordre           INTEGER DEFAULT 0
);

CREATE TABLE forum_fils (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categorie_id    UUID NOT NULL REFERENCES forum_categories(id),
  titre           TEXT NOT NULL,
  auteur_id       UUID NOT NULL REFERENCES profiles(id),
  statut          TEXT DEFAULT 'ouvert',       -- 'ouvert', 'ferme', 'signale'
  nb_reponses     INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE forum_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fil_id          UUID NOT NULL REFERENCES forum_fils(id),
  auteur_id       UUID NOT NULL REFERENCES profiles(id),
  contenu         TEXT NOT NULL CHECK (char_length(contenu) <= 3000),
  statut          TEXT DEFAULT 'publie',       -- 'publie', 'en_revue', 'supprime'
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Opportunités
CREATE TABLE opportunites (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type_opp        opportunite_type NOT NULL,
  titre           TEXT NOT NULL,
  description     TEXT,
  organisation    TEXT,
  pays            TEXT,
  filiere         TEXT,
  date_limite     DATE,
  lien_externe    TEXT,
  poste_par       UUID REFERENCES profiles(id),
  statut          TEXT DEFAULT 'en_attente_validation',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AGROBUSINESS
-- =====================================================

CREATE TABLE demandes_service (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prenom          TEXT NOT NULL,
  nom             TEXT NOT NULL,
  email           TEXT NOT NULL,
  pays            TEXT,
  organisation    TEXT,
  type_service    TEXT NOT NULL,
  description     TEXT NOT NULL,
  budget_tranche  TEXT,
  delai           TEXT,
  fichier_r2_key  TEXT,
  statut          demande_statut DEFAULT 'nouveau',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE candidatures_incubation (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prenom          TEXT NOT NULL,
  nom             TEXT NOT NULL,
  email           TEXT NOT NULL,
  pays            TEXT,
  nom_projet      TEXT NOT NULL,
  secteur         TEXT,
  stade           TEXT,
  probleme        TEXT,
  solution        TEXT,
  marche_cible    TEXT,
  modele_eco      TEXT,
  financement_recu BOOLEAN DEFAULT FALSE,
  montant_financement TEXT,
  cv_r2_key       TEXT,
  motivation      TEXT,
  statut          TEXT DEFAULT 'soumise',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Vitrine agripreneurs
CREATE TABLE agripreneurs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom             TEXT NOT NULL,
  projet          TEXT NOT NULL,
  pays            TEXT,
  secteur         TEXT,
  description     TEXT,
  photo_url       TEXT,
  lien_web        TEXT,
  temoignage      TEXT,
  publie          BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- COLLECTE DE FONDS
-- =====================================================

CREATE TABLE contributions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prenom          TEXT,
  email           TEXT NOT NULL,
  montant_fcfa    INTEGER NOT NULL,
  methode         paiement_methode NOT NULL,
  provider_ref    TEXT,
  statut          paiement_statut DEFAULT 'en_attente',
  anonyme         BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE campagnes_financement (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre           TEXT NOT NULL,
  description     TEXT,
  objectif_fcfa   BIGINT NOT NULL,
  date_debut      DATE,
  date_fin        DATE,
  active          BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Partenaires
CREATE TABLE partenaires (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom             TEXT NOT NULL,
  logo_url        TEXT,
  site_web        TEXT,
  description     TEXT,
  temoignage      TEXT,
  contact_nom     TEXT,
  contact_titre   TEXT,
  ordre           INTEGER DEFAULT 0,
  publie          BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BLOG
-- =====================================================

CREATE TABLE articles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  auteur_id       UUID REFERENCES profiles(id),
  auteur_externe  TEXT,                        -- Si auteur non-membre
  categorie       TEXT NOT NULL,               -- Pilier éditorial
  tags            TEXT[],
  image_une_url   TEXT,
  contenu_json    JSONB NOT NULL,              -- Format Tiptap JSON
  extrait         TEXT CHECK (char_length(extrait) <= 160),
  cta_texte       TEXT,
  cta_lien        TEXT,
  acces           doc_acces DEFAULT 'public',
  statut          TEXT DEFAULT 'brouillon',    -- 'brouillon', 'planifie', 'publie'
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Pages statiques (contenu CMS)
CREATE TABLE pages_statiques (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT NOT NULL UNIQUE,        -- 'accueil', 'qui-sommes-nous', etc.
  titre           TEXT,
  contenu_json    JSONB,
  meta_description TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Témoignages page d'accueil
CREATE TABLE temoignages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prenom          TEXT NOT NULL,
  nom             TEXT,
  categorie       membre_categorie,
  pays            TEXT,
  photo_url       TEXT,
  citation        TEXT NOT NULL,
  ordre           INTEGER DEFAULT 0,
  publie          BOOLEAN DEFAULT TRUE
);
```

### 4.3 Politiques RLS (Row Level Security)

**Principe :** Toutes les tables ont RLS activé. Les Workers authentifient via le JWT Supabase (header `Authorization: Bearer <token>`). Les politiques RLS constituent la deuxième ligne de défense.

```sql
-- =====================================================
-- TABLE: profiles
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Lecture : chaque membre lit son propre profil ; 
-- les membres actifs lisent les profils annuaire_visible = true et actifs
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_select_annuaire" ON profiles
  FOR SELECT USING (
    annuaire_visible = TRUE
    AND statut_adhesion = 'actif'
    AND EXISTS (
      SELECT 1 FROM profiles p2
      WHERE p2.id = auth.uid()
      AND p2.statut_adhesion = 'actif'
    )
  );

-- Mise à jour : chaque membre met à jour son propre profil uniquement
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role_plateforme = 'membre'); -- Ne peut pas s'auto-promouvoir admin

-- Super admin : lecture et écriture totale
CREATE POLICY "profiles_admin_all" ON profiles
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role_plateforme = 'super_admin')
  );

-- =====================================================
-- TABLE: documents
-- =====================================================
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Lecture publique des documents publiés à accès public
CREATE POLICY "documents_select_public" ON documents
  FOR SELECT USING (statut = 'publie' AND acces = 'public');

-- Lecture membres actifs : tous documents publiés
CREATE POLICY "documents_select_membres" ON documents
  FOR SELECT USING (
    statut = 'publie'
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND statut_adhesion = 'actif'
    )
  );

-- Dépôt : membres actifs non-Junior
CREATE POLICY "documents_insert_membres" ON documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND statut_adhesion = 'actif'
      AND categorie IN ('professionnel', 'partenaire', 'senior')
    )
  );

-- Admin : lecture et écriture totale
CREATE POLICY "documents_admin_all" ON documents
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role_plateforme IN ('admin_content', 'super_admin'))
  );

-- =====================================================
-- TABLE: messages
-- =====================================================
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Lecture : expéditeur ou destinataire uniquement
CREATE POLICY "messages_select_own" ON messages
  FOR SELECT USING (auth.uid() = expediteur_id OR auth.uid() = destinataire_id);

-- Insertion : membre actif Professionnel/Partenaire/Sénior
CREATE POLICY "messages_insert_membres" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = expediteur_id
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND statut_adhesion = 'actif'
      AND categorie IN ('professionnel', 'partenaire', 'senior')
    )
  );

-- Mise à jour : destinataire peut marquer comme lu
CREATE POLICY "messages_update_destinataire" ON messages
  FOR UPDATE USING (auth.uid() = destinataire_id)
  WITH CHECK (auth.uid() = destinataire_id);

-- =====================================================
-- TABLE: forum_messages
-- =====================================================
ALTER TABLE forum_messages ENABLE ROW LEVEL SECURITY;

-- Lecture : membres actifs (tous les messages publiés)
CREATE POLICY "forum_select_membres" ON forum_messages
  FOR SELECT USING (
    statut = 'publie'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND statut_adhesion = 'actif')
  );

-- Insertion : membres actifs
CREATE POLICY "forum_insert_membres" ON forum_messages
  FOR INSERT WITH CHECK (
    auth.uid() = auteur_id
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND statut_adhesion = 'actif')
  );

-- Mise à jour : auteur uniquement dans les 24h
CREATE POLICY "forum_update_own" ON forum_messages
  FOR UPDATE USING (
    auth.uid() = auteur_id
    AND created_at > NOW() - INTERVAL '24 hours'
  );

-- =====================================================
-- TABLE: cotisations
-- =====================================================
ALTER TABLE cotisations ENABLE ROW LEVEL SECURITY;

-- Lecture : membre lit ses propres cotisations
CREATE POLICY "cotisations_select_own" ON cotisations
  FOR SELECT USING (auth.uid() = membre_id);

-- Insertion : uniquement via le Worker (service role)
-- => Pas de politique INSERT pour les rôles utilisateur
-- Le Worker utilise le service_role_key Supabase (non exposé au client)

-- =====================================================
-- Tables entièrement gérées par le Worker (service role) :
-- contributions, demandes_service, candidatures_incubation,
-- inscriptions_formation, inscriptions_evenement, notifications
-- => RLS activé mais pas de policy SELECT/INSERT pour auth.uid()
-- => Accès uniquement via service_role dans le Worker
-- =====================================================
```

### 4.4 Triggers et fonctions PostgreSQL utiles

```sql
-- Trigger : mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer à toutes les tables avec updated_at
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- (idem pour articles, forum_messages, etc.)

-- Trigger : décrémenter places_restantes à l'inscription formation
CREATE OR REPLACE FUNCTION decrement_places()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE sessions_formation
  SET places_restantes = places_restantes - 1
  WHERE id = NEW.session_id AND places_restantes > 0;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_inscription_places
  AFTER INSERT ON inscriptions_formation
  FOR EACH ROW EXECUTE FUNCTION decrement_places();

-- Trigger : incrémenter nb_reponses dans forum_fils
CREATE OR REPLACE FUNCTION increment_nb_reponses()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE forum_fils
  SET nb_reponses = nb_reponses + 1,
      last_activity_at = NOW()
  WHERE id = NEW.fil_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_forum_reponses
  AFTER INSERT ON forum_messages
  FOR EACH ROW EXECUTE FUNCTION increment_nb_reponses();
```

### 4.5 Index de performance

```sql
-- Recherche annuaire
CREATE INDEX idx_profiles_categorie ON profiles(categorie);
CREATE INDEX idx_profiles_pays ON profiles(pays);
CREATE INDEX idx_profiles_annuaire ON profiles(annuaire_visible, statut_adhesion);
CREATE INDEX idx_profiles_search ON profiles USING GIN (to_tsvector('french', prenom || ' ' || nom || ' ' || COALESCE(specialite, '') || ' ' || COALESCE(organisation, '')));

-- Bibliothèque
CREATE INDEX idx_documents_statut_acces ON documents(statut, acces);
CREATE INDEX idx_documents_thematique ON documents(thematique);
CREATE INDEX idx_documents_pays ON documents(pays);
CREATE INDEX idx_documents_search ON documents USING GIN (to_tsvector('french', titre || ' ' || COALESCE(resume, '')));

-- Blog
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_statut_published ON articles(statut, published_at DESC);
CREATE INDEX idx_articles_categorie ON articles(categorie);

-- Forum
CREATE INDEX idx_forum_fils_last_activity ON forum_fils(last_activity_at DESC);
CREATE INDEX idx_forum_messages_fil ON forum_messages(fil_id, created_at);

-- Notifications
CREATE INDEX idx_notifications_user_lu ON notifications(user_id, lu, created_at DESC);

-- Cotisations
CREATE INDEX idx_cotisations_membre ON cotisations(membre_id, statut);
```
---

## 5. Spécifications d'implémentation par brique technique

### 5.1 Frontend — Next.js 15 / Vercel

#### Configuration de base

```javascript
// next.config.ts
import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  experimental: { ppr: true },         // Partial Prerendering (Next.js 15)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: 'img.youtube.com' }
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // i18n sera géré par next-intl (middleware) — pas de config i18n native Next.js
}
export default nextConfig
```

#### Middleware Next.js (`src/middleware.ts`)

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Routes membres : vérifier session
  if (pathname.startsWith('/membres') || pathname.startsWith('/admin')) {
    const supabase = createServerClient(/* config */)
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.redirect(new URL('/login?redirect=' + pathname, request.url))
    }

    // Routes admin : vérifier le rôle
    if (pathname.startsWith('/admin')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role_plateforme')
        .eq('id', session.user.id)
        .single()

      if (!profile || !['admin_content', 'super_admin'].includes(profile.role_plateforme)) {
        return NextResponse.redirect(new URL('/membres/dashboard', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/membres/:path*', '/admin/:path*']
}
```

#### PWA (Progressive Web App)

Utiliser le package `next-pwa` (version compatible Next.js 15) ou `@ducanh2912/next-pwa`.

```javascript
// Fichier public/manifest.json
{
  "name": "agrolide — Réseau agricole africain",
  "short_name": "agrolide",
  "description": "Fédérer la chaîne agricole, pour conquérir la souveraineté alimentaire",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1b5e38",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

**Service Worker :** Stratégie "Network First" pour les pages dynamiques, "Cache First" pour les assets statiques (CSS, JS, icônes). Permet la navigation hors-ligne sur les pages visitées précédemment — critique en contexte mobile africain.

#### Architecture i18n (posée en V1, activée en V2)

```
src/messages/
  fr.json          # V1 : toutes les chaînes en français
  en.json          # V2 : à remplir lors de la traduction

src/lib/i18n/
  routing.ts       # const routing = defineRouting({ locales: ['fr'], defaultLocale: 'fr' })
  request.ts       # getRequestConfig : retourne les messages selon locale
```

En V2, activer `locales: ['fr', 'en']` + middleware next-intl pour router `/en/*`.

#### Performance mobile — règles impératives

- Toutes les images : composant `<Image>` Next.js (optimisation WebP/AVIF automatique). Format cible mobile : ≤ 80 Ko par image above the fold.
- Fonts : `next/font/google` avec `display: 'swap'` pour Urbanist et Libre Baskerville. Préchargement des variantes Bold/SemiBold (Urbanist) et Regular (Libre Baskerville).
- Icônes : bibliothèque légère (`lucide-react` ou SVG inline — pas d'icon font).
- Animations : CSS uniquement (pas de librairie JS d'animation lourde). `@media (prefers-reduced-motion: reduce)` respecté.
- Aucun polyfill inutile : target navigateurs modernes (Chrome 90+, Safari 14+, Firefox 90+).
- Bundle size budget : Page d'accueil JS initial ≤ 150 Ko (gzip). Page dashboard ≤ 200 Ko.

---

### 5.2 API — Cloudflare Workers

#### Structure du Worker

```
workers/
├── src/
│   ├── index.ts               # Router principal (Hono.js recommandé)
│   ├── middleware/
│   │   ├── auth.ts            # Vérification JWT Supabase
│   │   ├── rbac.ts            # Vérification rôle/catégorie
│   │   ├── rateLimiter.ts     # Upstash Redis rate limiting
│   │   └── validator.ts       # Validation Zod des payloads
│   ├── routes/
│   │   ├── auth.ts            # /api/auth/*
│   │   ├── membres.ts         # /api/membres/*
│   │   ├── annuaire.ts        # /api/annuaire/*
│   │   ├── bibliotheque.ts    # /api/bibliotheque/*
│   │   ├── formations.ts      # /api/formations/*
│   │   ├── evenements.ts      # /api/evenements/*
│   │   ├── forum.ts           # /api/forum/*
│   │   ├── opportunites.ts    # /api/opportunites/*
│   │   ├── agrobusiness.ts    # /api/agrobusiness/*
│   │   ├── paiements.ts       # /api/paiements/* (webhooks Stripe + CinetPay)
│   │   ├── emails.ts          # /api/emails/* (triggers Resend)
│   │   ├── blog.ts            # /api/blog/*
│   │   └── fonds.ts           # /api/fonds/*
│   └── crons/
│       ├── expiration.ts      # Cron quotidien : cotisations expirées → statut 'expire'
│       ├── rappels.ts         # Cron quotidien : emails rappel cotisation/formation
│       └── redis-reset.ts     # Cron mensuel : reset compteurs téléchargements
└── wrangler.toml
```

**Framework recommandé :** Hono.js (léger, natif Cloudflare Workers, TypeScript, middleware chainable).

#### Middleware Auth

```typescript
// middleware/auth.ts
import { createClient } from '@supabase/supabase-js'

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Non authentifié' }, 401)
  }

  const token = authHeader.replace('Bearer ', '')
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return c.json({ error: 'Token invalide' }, 401)
  }

  // Charger le profil depuis Supabase (service role pour RLS bypass)
  const supabaseAdmin = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY)
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id, categorie, statut_adhesion, role_plateforme')
    .eq('id', user.id)
    .single()

  c.set('user', user)
  c.set('profile', profile)
  await next()
}
```

#### Middleware RBAC

```typescript
// middleware/rbac.ts
export function requireRole(...roles: string[]) {
  return async (c: Context, next: Next) => {
    const profile = c.get('profile')
    if (!profile) return c.json({ error: 'Profil introuvable' }, 403)

    const hasRole = roles.includes(profile.role_plateforme)
      || roles.includes(profile.categorie)
    if (!hasRole) return c.json({ error: 'Accès refusé' }, 403)

    // Vérifier statut adhésion (sauf admin)
    if (!['admin_content', 'super_admin'].includes(profile.role_plateforme)) {
      if (profile.statut_adhesion !== 'actif') {
        return c.json({ error: 'Adhésion inactive' }, 403)
      }
    }
    await next()
  }
}

// Usage : app.get('/api/bibliotheque/download/:id', authMiddleware, requireRole('junior', 'professionnel', 'partenaire', 'senior'), handler)
```

#### Routes critiques

```
GET    /api/annuaire                    → Liste membres (filtres querystring) — auth + actif
GET    /api/annuaire/:id                → Fiche profil — auth + actif
GET    /api/bibliotheque                → Liste documents — public (filtre statut/acces)
GET    /api/bibliotheque/download/:id   → URL signée R2 — auth + actif (quota Redis)
POST   /api/bibliotheque/deposer        → Upload R2 + insertion DB — Pro/Partenaire/Senior
GET    /api/formations                  → Catalogue formations — public
POST   /api/formations/:id/inscrire     → Inscription session — auth + actif
GET    /api/formations/certificat/:id   → Générer/récupérer certificat PDF — auth + complete
POST   /api/membres/profil              → Update profil — auth
GET    /api/membres/dashboard           → Données dashboard personnalisées — auth + actif
POST   /api/paiements/checkout          → Créer Stripe Checkout Session
POST   /api/paiements/stripe/webhook    → Webhook Stripe (signature vérifiée)
POST   /api/paiements/cinetpay/webhook  → Webhook CinetPay (signature vérifiée)
POST   /api/agrobusiness/demande        → Soumettre demande service (public)
POST   /api/agrobusiness/incubation     → Soumettre candidature (public)
POST   /api/forum/fils                  → Créer fil — auth + actif
POST   /api/forum/fils/:id/messages     → Poster message — auth + actif
GET    /api/opportunites                → Liste opportunités publiées — auth + actif
POST   /api/opportunites                → Soumettre opportunité — auth + actif (→ validation)
POST   /api/fonds/don                   → Créer paiement don (Stripe/CinetPay) — public
```

#### Webhooks paiement

```typescript
// routes/paiements.ts — Webhook Stripe
app.post('/api/paiements/stripe/webhook', async (c) => {
  const body = await c.req.text()
  const sig = c.req.header('stripe-signature')!
  const event = stripe.webhooks.constructEvent(body, sig, c.env.STRIPE_WEBHOOK_SECRET)

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { membre_id, type } = session.metadata // 'cotisation' ou 'don' ou 'formation'

    if (type === 'cotisation') {
      // 1. Calculer date_debut et date_fin (+ 365 jours)
      // 2. Insérer cotisation avec statut = 'valide'
      // 3. Mettre à jour profiles.statut_adhesion = 'actif'
      // 4. Envoyer email Resend de confirmation
    }
  }
  return c.json({ received: true })
})
```

#### Cron Jobs (wrangler.toml)

```toml
[triggers]
crons = [
  "0 6 * * *",    # Quotidien 6h UTC : vérification expirations cotisations
  "0 8 * * *",    # Quotidien 8h UTC : envoi rappels (J-30, J-7, J-0)
  "0 0 1 * *"     # 1er de chaque mois 0h UTC : reset compteurs téléchargements Redis
]
```

---

### 5.3 Supabase — Configuration détaillée

#### Variables d'environnement (`.env.local` et Vercel)

```
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
# Ne jamais exposer côté client :
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
```

#### Auth Supabase — Configuration

- Activer **Email** (+ confirmation obligatoire).
- Désactiver Phone (non utilisé en V1).
- URL de redirection autorisée : `https://agrolide.com/callback` (et `http://localhost:3000/callback` en dev).
- Template email de confirmation : personnalisé aux couleurs agrolide via l'interface Supabase (logo + couleur `#1b5e38`). Expédié via **Resend** (connecter Resend comme SMTP custom dans les paramètres Supabase Auth → Custom SMTP).
- JWT expiration : 3 600 secondes (1h). Refresh token : 30 jours.

#### Realtime — Canaux activés

```typescript
// Notifications utilisateur (côté client — composant NotificationBell)
const channel = supabase
  .channel(`notifications:${userId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    // Afficher badge + toast notification
  })
  .subscribe()

// Forum — nouveau message dans un fil ouvert
const forumChannel = supabase
  .channel(`forum:fil:${filId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'forum_messages',
    filter: `fil_id=eq.${filId}`
  }, (payload) => {
    // Ajouter le message au fil en temps réel
  })
  .subscribe()
```

#### Migrations — Ordre d'exécution

```
001_types_enum.sql
002_tables_membres.sql          (profiles, cotisations, messages, notifications)
003_tables_bibliotheque.sql     (documents, telechargements)
004_tables_formations.sql       (formations, sessions, inscriptions, avis, webinaires)
005_tables_evenements.sql       (evenements, inscriptions, forum_categories, forum_fils, forum_messages, opportunites)
006_tables_agrobusiness.sql     (demandes_service, candidatures_incubation, agripreneurs)
007_tables_fonds.sql            (contributions, campagnes_financement, partenaires)
008_tables_blog.sql             (articles, pages_statiques, temoignages)
009_rls_policies.sql
010_indexes.sql
011_triggers_functions.sql
012_seed_categories_forum.sql   (insérer les 6 catégories de forum prédéfinies)
013_seed_admin.sql              (créer le super_admin initial)
```

---

### 5.4 Cloudflare R2 — Configuration

**Buckets à créer :**

| Bucket | Contenu | Accès public |
|--------|---------|-------------|
| `agrolide-bibliotheque` | PDF documents bibliothèque | ❌ (URLs signées uniquement) |
| `agrolide-profils` | Photos de profil membres | ✅ (CDN public) |
| `agrolide-media` | Images blog, événements, agripreneurs | ✅ (CDN public) |
| `agrolide-demandes` | Pièces jointes demandes de service | ❌ (URLs signées) |
| `agrolide-certificats` | Certificats PDF formations | ❌ (URLs signées) |
| `agrolide-sauvegardes` | Dumps Supabase automatiques | ❌ (accès privé) |

**Génération d'URL signée (Worker) :**

```typescript
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

// Générer URL signée valable 15 minutes
const signedUrl = await getSignedUrl(r2, new GetObjectCommand({
  Bucket: 'agrolide-bibliotheque',
  Key: document.fichier_r2_key,
}), { expiresIn: 900 })
```

**Upload depuis le client :** Utiliser des URLs pré-signées PUT générées par le Worker (le client uploade directement sur R2 — le Worker ne sert pas de proxy pour les fichiers volumineux). Taille max par fichier : 50 Mo (bibliothèque) / 2 Mo (photos profil) / 5 Mo (pièces jointes).

---

### 5.5 Resend — Templates email

**Adresse expéditrice :** `reseau@agrolide.com` (domaine à configurer via Cloudflare DNS + DKIM Resend).

**Templates à créer (React Email recommandé) :**

| ID template | Déclencheur | Contenu clé |
|-------------|-------------|------------|
| `welcome` | Inscription validée + paiement OK | Bienvenue, catégorie, lien tableau de bord, date d'expiration cotisation |
| `verify-email` | Après inscription | Lien de vérification email (valable 24h) |
| `reset-password` | Demande reset | Lien magic link (valable 1h) |
| `cotisation-confirmation` | Paiement cotisation OK | Montant, méthode, période de validité, numéro de transaction |
| `cotisation-rappel-30j` | Cron J-30 avant expiration | Date expiration, lien renouvellement, bénéfices rappelés |
| `cotisation-rappel-7j` | Cron J-7 avant expiration | Urgence douce, lien renouvellement direct |
| `cotisation-expiration` | Cron J-0 | Compte expiré, lien renouvellement |
| `inscription-formation` | Inscription session | Titre formation, date, lieu/lien, contacts |
| `rappel-formation-7j` | Cron J-7 | Rappel formation imminente |
| `rappel-formation-1j` | Cron J-1 | Lien de connexion (si distanciel), programme |
| `certificat-disponible` | Validation inscription_statut = complete | Lien téléchargement certificat (URL signée R2 valable 7 jours) |
| `nouveau-document-valide` | Publication document bibliothèque | Notification au déposant : document publié |
| `demande-service-accusé` | Soumission formulaire service | Accusé de réception, délai de réponse (hypothèse : 5 jours ouvrés) |
| `don-confirmation` | Paiement don OK | Montant, reçu, message de remerciement |
| `partenariat-contact` | Formulaire partenariat | Accusé de réception équipe + forward à l'équipe |
| `opportunite-soumise` | Soumission opportunité | En attente de validation, délai estimé |

**Design template :** Fond blanc, logo agrolide en header (image R2 public), couleur H1 `#1b5e38`, bouton CTA fond `#50a853` texte blanc, footer avec liens de désinscription newsletter.

---

### 5.6 Upstash Redis — Usages

**Connexion :** Via `@upstash/redis` (REST API compatible Cloudflare Workers — pas de WebSocket).

```typescript
import { Redis } from '@upstash/redis'
const redis = new Redis({
  url: env.UPSTASH_REDIS_URL,
  token: env.UPSTASH_REDIS_TOKEN,
})
```

**Clés Redis et leur usage :**

| Clé | Type | Usage | TTL |
|-----|------|-------|-----|
| `rate:login:{ip}` | Counter | Tentatives login par IP | 900s (15 min) |
| `rate:api:{ip}` | Counter | Appels API globaux par IP | 60s |
| `dl:user:{id}:month:{YYYY-MM}` | Counter | Téléchargements documents (quota Junior) | Fin du mois (reset Cron) |
| `session:user:{id}` | String | Cache profil utilisateur (éviter requête Supabase à chaque appel Worker) | 300s (5 min) |
| `stats:home` | Hash | Chiffres clés page accueil (nb membres, pays, docs) | 3600s |
| `annuaire:search:{hash}` | String | Cache résultats recherche annuaire | 300s |
| `spam:form:{ip}:{form}` | Counter | Anti-spam formulaires (incubation, service, partenariat) | 86400s (24h) |

**Rate limiting — seuils :**
- Login : 5 tentatives / 15 min / IP → blocage 30 min
- API globale : 100 req / min / IP → 429 Too Many Requests
- Formulaires publics (incubation, service) : 3 soumissions / 24h / IP

---

### 5.7 Sentry — Configuration

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,              // 10 % des transactions en prod
  replaysSessionSampleRate: 0.05,     // 5 % des sessions (Session Replay)
  replaysOnErrorSampleRate: 1.0,      // 100 % des sessions avec erreur
  integrations: [Sentry.replayIntegration()],
  // Ne jamais capturer les données personnelles
  beforeSend(event) {
    if (event.user) {
      delete event.user.email
      delete event.user.ip_address
    }
    return event
  }
})
```

**Alertes à configurer :**
- Taux d'erreur > 1 % → alerte Slack/email équipe.
- Erreur Worker (paiement) → alerte immédiate (priorité haute).
- Erreur 500 page membres → alerte dans les 5 min.
- Core Web Vitals LCP > 3s → rapport hebdomadaire.

---

### 5.8 Newsletter Brevo

**Segmentation listes :**
- Liste `agrolide-juniors` : membres Juniors actifs
- Liste `agrolide-professionnels` : membres Professionnels actifs
- Liste `agrolide-partenaires-seniors` : Partenaires + Séniors actifs
- Liste `agrolide-visiteurs` : abonnés newsletter non-membres (formulaire opt-in pied de page)

**Automatisation Brevo :**
- Ajout automatique à la liste correspondante lors de l'activation du compte (webhook Worker → API Brevo).
- Suppression automatique de la liste lors de l'expiration de la cotisation ou de la désinscription.

**Newsletter mensuelle :** Rédigée manuellement dans Brevo (hors scope du site web). Le site expose uniquement le formulaire d'opt-in.

---

## 6. Design System synthétique

### 6.1 Palette de couleurs

```css
:root {
  /* Verts — identité agricole et institutionnelle */
  --color-vert-profond:    #1b5e38;  /* Fonds, titres, éléments institutionnels */
  --color-vert-principal:  #50a853;  /* Logo, boutons, accents de marque */
  --color-vert-olive:      #878e2c;  /* Variations, arrière-plans secondaires */

  /* Orange/Jaune — accents, CTA, impact */
  --color-orange-accent:   #f99e1d;  /* CTA principal, mise en avant, alertes positives */
  --color-jaune-dore:      #fcb726;  /* Highlights, touches lumineuses */

  /* Neutres */
  --color-blanc:           #ffffff;
  --color-gris-clair:      #f5f5f5;  /* Fonds de sections alternées */
  --color-gris-moyen:      #e0e0e0;  /* Bordures, séparateurs */
  --color-gris-texte:      #4a4a4a;  /* Texte courant */
  --color-noir:            #1a1a1a;  /* Titres sur fond clair */

  /* Sémantiques */
  --color-succes:          #50a853;  /* = vert principal */
  --color-erreur:          #d32f2f;
  --color-alerte:          #f99e1d;  /* = orange accent */
  --color-info:            #1565c0;
}
```

### 6.2 Typographie

```css
/* Google Fonts — charger via next/font/google */

/* Titres et intertitres — Urbanist SemiBold / Bold */
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@600;700&display=swap');

/* Corps de texte — Libre Baskerville Regular / Italic */
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;1,400&display=swap');

/* Scale typographique (mobile-first) */
:root {
  --text-xs:   0.75rem;   /* 12px — labels, badges */
  --text-sm:   0.875rem;  /* 14px — textes secondaires */
  --text-base: 1rem;      /* 16px — corps de texte courant */
  --text-lg:   1.125rem;  /* 18px — introductions, chapô */
  --text-xl:   1.25rem;   /* 20px — sous-titres */
  --text-2xl:  1.5rem;    /* 24px — H3 */
  --text-3xl:  1.875rem;  /* 30px — H2 */
  --text-4xl:  2.25rem;   /* 36px — H1 mobile */
  --text-5xl:  3rem;      /* 48px — H1 desktop hero */
}

/* Application */
h1, h2, h3, h4 { font-family: 'Urbanist', sans-serif; color: var(--color-noir); }
h1 { font-size: var(--text-4xl); font-weight: 700; }
h2 { font-size: var(--text-3xl); font-weight: 700; }
h3 { font-size: var(--text-2xl); font-weight: 600; }

body, p, li, td { font-family: 'Libre Baskerville', serif; font-size: var(--text-base); color: var(--color-gris-texte); line-height: 1.7; }

/* Desktop — augmenter les titres */
@media (min-width: 1024px) {
  h1 { font-size: var(--text-5xl); }
}
```

### 6.3 Composants clés

**Boutons :**

```css
/* Bouton primaire (CTA principal — vert) */
.btn-primary {
  background: var(--color-vert-principal);
  color: white;
  font-family: 'Urbanist', sans-serif;
  font-weight: 700;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  min-height: 48px;    /* Accessibilité touch mobile — zone tactile ≥ 48px */
}
.btn-primary:hover { background: var(--color-vert-profond); }

/* Bouton accent (CTA d'impact — orange) */
.btn-accent {
  background: var(--color-orange-accent);
  color: white;
  /* ... même base que primary */
}
.btn-accent:hover { background: var(--color-jaune-dore); }

/* Bouton secondaire (outline) */
.btn-outline {
  background: transparent;
  border: 2px solid var(--color-vert-principal);
  color: var(--color-vert-principal);
  /* ... */
}
```

**Badges catégorie membres :**

```
Junior      → fond #e8f5e9, texte #1b5e38 (vert léger)
Professionnel → fond #1b5e38, texte white (vert profond)
Partenaire  → fond #878e2c, texte white (vert olive)
Sénior      → fond #fcb726, texte #1a1a1a (jaune doré)
```

**Cards :**
- Fond blanc, ombre légère (`box-shadow: 0 2px 8px rgba(0,0,0,0.08)`), radius 12px.
- Image (si présente) : ratio 16/9, `object-fit: cover`.
- Padding interne : 1.25rem (mobile) / 1.5rem (desktop).
- Hover : légère remontée (`transform: translateY(-2px)`, transition 0.2s).

**Navigation mobile (bottom bar) :**
Pour la zone membres, une navigation bottom-bar mobile avec 5 icônes max (Dashboard, Annuaire, Bibliothèque, Formations, Profil). Visiblité uniquement sur `max-width: 768px`. Sur desktop : sidebar gauche collapsible.

**Formulaires :**
- Labels : Urbanist SemiBold 14px, couleur `#1a1a1a`.
- Inputs : border 1px `#e0e0e0`, radius 6px, focus border `#50a853` (vert principal), padding 0.75rem 1rem.
- Messages d'erreur : texte rouge (`#d32f2f`), icône warning, affichés sous le champ.
- Hauteur minimale input : 48px (touch target mobile).

### 6.4 Responsive — Breakpoints

```css
/* Mobile first — styles de base pour 320px+ */
/* Tablet */
@media (min-width: 768px)  { /* grilles 2 colonnes, navigation sidebar visible */ }
/* Desktop */
@media (min-width: 1024px) { /* grilles 3-4 colonnes, hero plein écran */ }
/* Large desktop */
@media (min-width: 1280px) { /* max-width conteneur 1200px centré */ }
```

**Grilles recommandées :**
- Page d'accueil hero : 1 colonne mobile, 2 colonnes desktop (texte + image).
- Cartes (membres, documents, articles) : 1 col mobile / 2 col tablet / 3 col desktop.
- Cartes profils (annuaire) : 1 col mobile / 2 col tablet / 4 col desktop.
- Dashboard : 1 col mobile / 2 col desktop.

---

## 7. Exigences non-fonctionnelles

### 7.1 Performance

**Objectifs Core Web Vitals (mesurés sur mobile 3G lente) :**

| Métrique | Cible |
|----------|-------|
| LCP (Largest Contentful Paint) | ≤ 2,5 s |
| FID / INP (Interaction to Next Paint) | ≤ 200 ms |
| CLS (Cumulative Layout Shift) | ≤ 0,1 |
| TTFB (Time to First Byte) — pages SSG | ≤ 200 ms (Vercel Edge) |
| Taille page d'accueil (mobile, compressée) | ≤ 500 Ko |

**Mesures à mettre en place :**
- `next/image` pour toutes les images (optimisation automatique WebP/AVIF, lazy-load, placeholder blur).
- Fonts avec `display: 'swap'` et préchargement des fichiers critiques.
- Code splitting automatique (Next.js App Router) + dynamic imports pour les composants lourds (éditeur Tiptap, cartes interactives).
- Headers Cache-Control Vercel/Cloudflare : assets statiques `max-age=31536000, immutable`.
- R2 avec CDN Cloudflare : latence minimale pour les images médias (buckets `agrolide-profils` et `agrolide-media`).

### 7.2 Sécurité

**Headers HTTP (via `next.config.ts` et Cloudflare Workers) :**

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.youtube.com; img-src 'self' data: https://*.r2.cloudflarestorage.com https://img.youtube.com; frame-src https://www.youtube.com; connect-src 'self' https://*.supabase.co https://*.upstash.io;
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

**Protections spécifiques :**
- Toutes les mutations passent par le Worker (jamais d'appel direct Supabase avec `service_role_key` depuis le client).
- Validation Zod sur tous les payloads d'entrée dans le Worker (côté serveur — ne jamais faire confiance au client).
- Upload de fichiers : vérification du Content-Type réel (magic bytes) côté Worker avant stockage R2. Refus des types non-autorisés.
- Injections SQL : Supabase ORM + requêtes paramétrées (jamais de concaténation de chaînes SQL).
- XSS : Tiptap génère du HTML sanitisé. `@tiptap/html` utilise DOMPurify côté serveur pour le rendu.
- CSRF : Non applicable (JWT stateless — pas de cookies de session applicatifs). Les cookies Supabase sont `httpOnly, secure, sameSite=strict`.

### 7.3 Protection des données (RGPD / conformité Africa)

**Base légale de traitement :** Contrat (cotisation membre) pour les données de profil ; consentement pour la newsletter Brevo.

**Engagements à afficher dans les CGU et la Politique de confidentialité :**
- Données collectées : liste exhaustive par module.
- Durée de conservation : profils membres 3 ans après expiration de la dernière cotisation ; logs de paiement 10 ans (obligation comptable).
- Droits des membres : accès, rectification, effacement (droit à l'oubli — déclenche suppression `auth.users` + anonymisation `profiles`), portabilité (export JSON des données personnelles).
- Hébergement : Vercel (US/EU), Cloudflare (CDN global), Supabase (EU — choisir région EU lors de la création du projet Supabase).
- Pas de partage de données personnelles avec des tiers sans consentement explicite.
- Cookies : uniquement les cookies techniques de session Supabase + cookie de consentement. Pas de cookie publicitaire. Bannière de consentement simple (pas de tracking — pas de besoin de bandeau RGPD complexe).

**Procédure droit à l'oubli :**
```
Demande membre → formulaire /membres/profil/supprimer-mon-compte
  → Confirmation par email (lien valable 24h)
  → Worker : suppression auth.users (cascade → profiles)
  → Anonymisation des messages (auteur = "Membre anonyme")
  → Suppression photo R2
  → Email de confirmation de clôture
```

### 7.4 SEO

**Balises meta et Open Graph — implémentation Next.js :**

```typescript
// app/layout.tsx — métadonnées globales
export const metadata: Metadata = {
  metadataBase: new URL('https://agrolide.com'),
  title: { default: 'agrolide — Réseau agricole africain', template: '%s | agrolide' },
  description: 'Fédérer la chaîne agricole africaine pour conquérir la souveraineté alimentaire. Annuaire, bibliothèque, formations et accompagnement pour agronomes, chercheurs et agripreneurs.',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'agrolide',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://agrolide.com' },
}
```

**Pages prioritaires pour le SEO :**
- Page d'accueil (H1 : "Réseau professionnel agricole africain").
- `/blog/[slug]` : chaque article = page SEO dédiée (balises complètes, structured data Article JSON-LD).
- `/bibliotheque` : documents publics indexés (balises title = titre du document).
- `/formations` : catalogue public.
- `/agrobusiness/incubation` : page pilier sur l'incubation agricole africaine.

**Fichiers techniques :**
- `/sitemap.xml` : généré dynamiquement (Next.js `app/sitemap.ts`), toutes les pages publiques + articles publiés + documents publics.
- `/robots.txt` : interdire `/admin/*`, `/membres/*`, `/callback`, `/_next/`.
- Schema JSON-LD : `Organization` sur la page d'accueil, `Article` sur les pages blog, `Course` sur les formations.

### 7.5 Accessibilité

**Cible : WCAG 2.1 niveau AA**

- Ratio de contraste : texte courant sur fond blanc ≥ 4,5:1 (vérifier `#4a4a4a` / blanc = OK ; `#50a853` / blanc = **à vérifier** — préférer du texte blanc sur fond vert pour les badges).
- Navigation clavier complète (focus visible sur tous les éléments interactifs, ordre de tabulation logique).
- Tous les éléments interactifs ont un attribut `aria-label` ou texte visible.
- Images : attribut `alt` descriptif systématique (conforme charte éditoriale).
- Formulaires : `<label>` associé à chaque `<input>` via `htmlFor`/`id`. Messages d'erreur liés au champ via `aria-describedby`.
- Navigation skip link : `<a href="#main-content" className="sr-only focus:not-sr-only">Aller au contenu principal</a>`.
- Modales : focus trap pendant l'ouverture, fermeture par Echap.
- Composants React : utiliser Radix UI (headless, accessible par défaut) pour les menus déroulants, dialogues, accordéons, et onglets.

---

## 8. Plan de développement par phases

### Phase 1 — MVP (Semaines 1 à 8)

**Objectif :** Lancer le site avec les fonctionnalités essentielles pour convertir les premiers membres et démontrer la valeur du réseau.

**Modules livrés :**

| Semaine | Livrable |
|---------|----------|
| S1–S2 | Initialisation projet (Next.js 15, Supabase, Cloudflare Workers), migrations DB, design system de base, layout global (header, footer, navigation), PWA manifest |
| S3 | M1 Vitrine : accueil, qui-sommes-nous, rejoindre (sans paiement en ligne — paiement manuel en option de secours) |
| S4 | M2 Auth : inscription, connexion, reset-password, vérification email, callback Supabase |
| S5 | M2 Membres : dashboard basique, profil (lecture + modification), cotisation (statut) |
| S6 | M3 Annuaire : liste membres filtrée (pays, spécialité), fiche profil, pas de messagerie |
| S7 | M9 Blog : liste articles + page article, admin blog basique (créer/modifier/publier) |
| S8 | Paiement cotisation (Stripe + CinetPay), webhooks, emails Resend (welcome, confirmation, rappels) + déploiement production Vercel + Sentry |

**Critères d'acceptance MVP :**
- [ ] Un visiteur peut s'inscrire, payer sa cotisation et accéder à son dashboard en < 5 minutes.
- [ ] Le site est navigable sur mobile 3G (LCP ≤ 3s).
- [ ] Le blog affiche 3 articles de test.
- [ ] L'annuaire affiche les profils des membres inscrits.
- [ ] Les emails Resend (welcome, confirmation) sont envoyés et reçus.
- [ ] Le super_admin peut valider les comptes en attente depuis l'interface admin.

### Phase 2 — V2 (Semaines 9 à 16)

**Objectif :** Activer la valeur cœur du réseau (bibliothèque, formations, communauté) et les revenus complémentaires (services).

| Semaine | Livrable |
|---------|----------|
| S9–S10 | M4 Bibliothèque : catalogue, filtres, téléchargement (URLs signées R2), dépôt, validation admin, quotas Redis |
| S11–S12 | M5 Formations & Webinaires : catalogue, inscriptions, sessions, rappels email, replays YouTube embed |
| S13 | M6 Événements : calendrier public, inscriptions, notifications |
| S14 | M6 Forum : catégories, fils, messages, modération |
| S15 | M7 Agrobusiness : pages publiques services, formulaire demande, candidature incubation, vitrine agripreneurs |
| S16 | M6 Opportunités : liste, soumission, validation admin. Messagerie interne membres (Pro/Partenaire/Sénior). Tests E2E (Playwright) + audit performance Lighthouse |

**Critères d'acceptance V2 :**
- [ ] Un membre peut télécharger un document en moins de 30 secondes (URL signée R2).
- [ ] Un membre peut s'inscrire à une formation et recevoir le rappel J-1 automatiquement.
- [ ] Le forum permet la création et la réponse à un fil en moins de 2 clics.
- [ ] La génération de certificat PDF fonctionne (template + stockage R2 + email).

### Phase 3 — V3 (Semaines 17 à 24)

**Objectif :** Internationalisation, monétisation avancée, analytics et fonctionnalités premium.

| Semaine | Livrable |
|---------|----------|
| S17–S18 | M8 Collecte de fonds : page crowdfunding, barre de progression, dons Stripe/CinetPay, page partenaires, formulaire partenariat |
| S19–S20 | i18n : activation next-intl EN, traduction de toutes les chaînes `messages/en.json`, URL `/en/*`, bascule de langue |
| S21–S22 | Certificats formation avancés (numéro unique, QR code de vérification → page publique `/verifier/[numero]`). Admin analytics (tableau de bord KPIs : membres actifs, revenu cotisations, téléchargements, trafic). |
| S23 | Performance : optimisation Core Web Vitals, audit SEO complet (Search Console, sitemap étendu). Vue cartographique annuaire (Leaflet/MapLibre — marqueurs par pays). |
| S24 | Préparation potentielle V4 : IA (suggestions bibliothèque, matching annuaire) — architecture Workers `/api/ai/*` posée mais non implémentée |

---

## 9. Hypothèses retenues & points à valider

> Ces hypothèses ont été formulées pour permettre la rédaction complète de ce cahier des charges sans bloquer sur des informations manquantes. **Chaque hypothèse doit être confirmée ou corrigée par le porteur de projet avant le démarrage du développement.**

### H1 — Cotisations annuelles (CRITIQUE)

**Hypothèse retenue :**
- Membre Junior : **5 000 FCFA/an** (~7,50 €)
- Membre Professionnel : **15 000 FCFA/an** (~23 €)
- Membre Partenaire : **50 000 FCFA/an** (~75 €)
- Membre Sénior : **Gratuit** (contribution bénévole — pas de cotisation financière)

**À valider :** Confirmez ou corrigez ces montants. L'ensemble du flow paiement, les templates Resend et les paramètres Stripe/CinetPay seront configurés à partir de ces valeurs.

---

### H2 — Paiement Mobile Money (CRITIQUE)

**Hypothèse retenue :** CinetPay est utilisé comme passerelle Mobile Money (Orange Money, MTN Mobile Money, Moov Money, Wave). CinetPay couvre les marchés prioritaires (Côte d'Ivoire, Sénégal, Togo, Burkina Faso, Mali, Cameroun).

**À valider :** (a) Confirmez CinetPay comme choix. (b) Le réseau a-t-il déjà un compte marchand CinetPay actif ? (c) Des pays prioritaires sont-ils absents de la couverture CinetPay ?

---

### H3 — Domaine web

**Hypothèse retenue :** Le site sera accessible à `https://agrolide.com` (ou `agrolide.africa`).

**À valider :** Confirmez le nom de domaine définitif. Cela impacte la configuration Cloudflare DNS, les URLs de callback Supabase Auth et les templates Resend.

---

### H4 — Adhésion Sénior

**Hypothèse retenue :** L'adhésion Sénior est gratuite (bénévole) mais nécessite une validation manuelle par le super_admin (formulaire de candidature + délibération).

**À valider :** Ce process manuel est-il acceptable ? Souhaitez-vous une cotisation symbolique (ex. 2 000 FCFA) pour formellement officialiser l'adhésion ?

---

### H5 — Adhésion Partenaire

**Hypothèse retenue :** L'adhésion Partenaire (personne morale) nécessite un contact préalable (formulaire "Nous contacter") et une validation manuelle avant création du compte, en raison du montant plus élevé et de la nature institutionnelle.

**À valider :** Souhaitez-vous un flow d'inscription automatique pour les Partenaires (comme Junior/Professionnel) ou maintenir la validation manuelle ?

---

### H6 — Contenu initial

**Hypothèse retenue :** Au lancement (MVP), le site sera peuplé avec :
- 3 articles de blog (à fournir par l'équipe)
- 10 fiches techniques (à fournir par l'équipe)
- 2 formations au catalogue
- 1 webinaire replay (YouTube ID à fournir)
- Les profils des membres fondateurs (biographies à fournir)
- La photo de la page "Qui sommes-nous" et l'organigramme (à fournir)

**À valider :** Confirmez la disponibilité de ces contenus pour la semaine S3 (démarrage intégration frontend). Sans contenus, les pages seront livrées avec des placeholders.

---

### H7 — Langues V1

**Hypothèse retenue :** V1 exclusivement en français. Les chaînes de traduction sont toutes externalisées dans `messages/fr.json` dès le V1 pour faciliter la traduction V2 en anglais.

**À valider :** Confirmez. Si l'arabe est envisagé (V3+), signalez-le dès maintenant — l'architecture RTL (direction droite-gauche) impacte le design system.

---

### H8 — Modération forum

**Hypothèse retenue :** La modération du forum est assurée a posteriori par l'`admin_content` (pas de modération pré-publication). Un membre peut signaler un message, qui passe alors en `statut = en_revue` et est masqué automatiquement jusqu'à décision admin.

**À valider :** Préférez-vous une modération pré-publication (tout message soumis attend validation admin avant d'être visible) ? Cette option ralentit l'animation communautaire mais réduit le risque de contenu inapproprié.

---

### H9 — Génération de certificats PDF

**Hypothèse retenue :** Les certificats de formation sont générés par le Cloudflare Worker en utilisant une API de génération HTML→PDF (Puppeteer ou `@html-pdf-node/html-pdf` — à évaluer selon la compatibilité Cloudflare Workers). Le template est un HTML statique aux couleurs agrolide.

**À valider :** Avez-vous un template de certificat existant (logo, mise en page) à respecter ? Si oui, fournissez un fichier de référence.

---

### H10 — Messagerie interne

**Hypothèse retenue :** La messagerie interne est limitée aux membres Professionnels, Partenaires et Séniors (pas Junior) pour réduire le risque de spam. Les messages sont conservés indéfiniment (pas de purge automatique).

**À valider :** Souhaitez-vous inclure les Membres Juniors dans la messagerie interne ?

---

### H11 — Quota de téléchargements bibliothèque

**Hypothèse retenue :** Membres Juniors : 20 téléchargements/mois. Membres Professionnels, Partenaires, Séniors : illimité.

**À valider :** Ces seuils vous conviennent-ils ? Un quota trop bas sur les Juniors pourrait être perçu comme décourageant.

---

### H12 — Programme d'incubation

**Hypothèse retenue :** Le programme d'incubation est géré entièrement hors-plateforme (sélection, accompagnement, suivi). Le site expose uniquement la page de présentation et le formulaire de candidature. La vitrine des agripreneurs accompagnés est renseignée manuellement par l'admin.

**À valider :** Souhaitez-vous un espace de suivi de l'incubation dans la plateforme (espace incubé avec documents partagés, jalons, messagerie dédiée) dès le V2 ?

---

*— Fin du cahier des charges agrolide v1.0 —*
*Document rédigé pour exécution directe par l'agent de développement Antigravity.*
*Toute modification de la stack technique, des hypothèses retenues ou de l'ordre des phases doit être communiquée au rédacteur avant démarrage de l'implémentation.*
