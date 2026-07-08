# UX Bible — agrolide.org
## Version 1.0 — Parcours de conversion & Expérience utilisateur
### Complémentaire à l'UI Bible v2.0 — À lire avant toute implémentation d'interface

---

## 0. Instructions d'utilisation avec Antigravity

**Commence chaque session UX dans Antigravity avec ce bloc :**

> "Avant de commencer, lis les fichiers `ui-bible-agrolide.md` ET `ux-bible-agrolide.md` dans ce dossier. L'UI Bible définit comment ça ressemble. L'UX Bible définit comment ça fonctionne. Toute décision d'interface doit respecter les deux documents simultanément."

**Règle absolue :** L'UX Bible a priorité sur toute "intuition" de l'agent. Si Antigravity propose un pattern non décrit ici, il doit le signaler et attendre validation avant d'implémenter.

---

## 1. Ordre de priorité de conversion

L'ordre suivant définit toutes les décisions de hiérarchisation dans l'interface. Chaque fois qu'un choix doit être fait (quoi montrer en premier, à qui parler, quel CTA mettre en avant), cet ordre s'applique.

```
1er  →  Membre Professionnel    (agronome, ingénieur, chercheur, consultant actif)
2ème →  Membre Partenaire       (entreprise, coopérative, ONG, institution)
3ème →  Membre Sénior           (expert, mentor, investisseur bénévole)
4ème →  Membre Junior           (étudiant, jeune diplômé)
```

**Ce que cela implique concrètement :**
- Le texte du hero s'adresse d'abord aux Professionnels
- La page `/rejoindre` met en avant la carte Professionnel en premier
- Les témoignages prioritaires sont ceux de Membres Professionnels
- Les statistiques mises en avant (annuaire, bibliothèque, formations) sont celles qui intéressent les Professionnels
- Le Partenaire a un parcours spécifique distinct (formulaire de contact, pas d'inscription directe)

---

## 2. Personas détaillés

### Persona 1 — Le Professionnel (cible prioritaire)

```
Prénom fictif : Kofi
Âge : 34 ans
Localisation : Accra, Ghana (ou Lomé, Abidjan, Dakar, Yaoundé)
Métier : Ingénieur agronome, 7 ans d'expérience, consultant indépendant
Appareil : Smartphone Android 70%, laptop 30%
Connexion : 4G mobile, parfois instable
Langue : Français (et/ou anglais)

MOTIVATIONS :
→ Élargir son réseau professionnel au-delà de son pays
→ Trouver des partenaires pour des projets agricoles
→ Accéder à des ressources techniques adaptées aux sols africains
→ Être visible auprès des recruteurs et bailleurs
→ Partager son expertise et bâtir sa réputation

FREINS PRINCIPAUX :
→ "J'ai déjà essayé d'autres réseaux — ils sont morts au bout de 3 mois"
→ "Encore une cotisation pour rien de concret"
→ "Je n'ai pas le temps de naviguer sur un site compliqué"
→ "Comment je sais si les autres membres sont vraiment actifs ?"

OBJECTION PRINCIPALE : "Prouve-moi la valeur avant que je paye."

CE QUI LE CONVAINC :
→ Voir des noms et profils de membres réels (crédibilité)
→ Un témoignage d'un pair qu'il aurait pu connaître
→ Un extrait concret de la bibliothèque (fiche technique visible)
→ Le nombre exact de membres dans son pays ou sa spécialité
→ La possibilité de payer par Mobile Money

DURÉE DE DÉCISION : 48 à 72 heures (retour 2-3 fois sur le site avant paiement)
```

### Persona 2 — Le Partenaire (2ème priorité)

```
Prénom fictif : Directeur Ahmed / DG Marie-Claire
Structure : Coopérative agricole de 200 membres (Côte d'Ivoire) ou PME agritech (Sénégal)
Âge : 42 ans
Appareil : Laptop en semaine, smartphone le weekend

MOTIVATIONS :
→ Accéder à un vivier de talents agronomes pour recrutement
→ Gagner en visibilité auprès des professionnels du secteur
→ Trouver des partenaires pour appels à projets
→ Bénéficier de l'expertise-réseau pour des études de marché

FREINS PRINCIPAUX :
→ "C'est quoi concrètement la différence avec LinkedIn ?"
→ "Qui décide ? Qui valide ?" (besoin de légitimité institutionnelle)
→ "50 000 FCFA, c'est beaucoup pour une association pas encore connue"
→ "Je veux parler à quelqu'un avant de m'engager"

OBJECTION PRINCIPALE : "Je ne signe pas sans avoir parlé à un responsable."

CE QUI LE CONVAINC :
→ Un formulaire de contact (pas un formulaire d'inscription standard)
→ Un délai de réponse garanti affiché (ex. "Nous répondons sous 48h")
→ Des logos de partenaires reconnus (si disponibles)
→ Une page dédiée aux avantages Partenaire (ROI explicite)
→ La possibilité de payer par virement bancaire ou facture

DURÉE DE DÉCISION : 1 à 3 semaines (processus de validation interne)
```

### Persona 3 — Le Sénior (3ème priorité)

```
Prénom fictif : Professeur Mamadou / Dr. Céleste
Profil : Chercheur retraité (62 ans) ou Expert international actif (50 ans)
Localisation : Souvent diaspora (France, Canada) ou capitale africaine

MOTIVATIONS :
→ Transmettre son expertise aux jeunes générations
→ Rester actif et connecté à l'écosystème agricole africain
→ Être reconnu et valorisé pour son parcours
→ Contribuer à un projet qui a du sens

FREINS PRINCIPAUX :
→ "Est-ce que ma contribution sera vraiment utile ?"
→ "Je n'ai pas le temps de gérer une plateforme complexe"
→ "Gratuit mais est-ce sérieux ?"

CE QUI LE CONVAINC :
→ Un formulaire de candidature qui valorise son parcours
→ Une section "nos Séniors" qui montre comment ils contribuent
→ Un processus de sélection visible (crédibilité de l'espace Sénior)
→ Un premier échange humain après candidature
```

### Persona 4 — Le Junior (4ème priorité)

```
Prénom fictif : Aminata, 23 ans, étudiante en agronomie (Lomé)
Appareil : Smartphone Android exclusivement
Connexion : 3G variable, data comptée au centime

MOTIVATIONS :
→ Trouver un stage, une alternance, un premier emploi
→ Accéder à des thèses et mémoires pour ses recherches
→ Rencontrer des professionnels qui peuvent la mentorer
→ Élargir son réseau avant l'entrée dans la vie active

FREINS PRINCIPAUX :
→ "5 000 FCFA c'est mon budget repas de la semaine"
→ "Je vais m'inscrire plus tard quand j'aurai un travail"
→ Le site qui ne charge pas sur connexion lente

CE QUI LE CONVAINC :
→ Des témoignages de Juniors qui ont trouvé un emploi/stage
→ Un accès rapide à la bibliothèque (valeur immédiate)
→ Le paiement par Mobile Money (Orange Money, Flooz)
→ Un design mobile ultra-rapide (chargement < 3s sur 3G)
```

---

## 3. Parcours de conversion prioritaire — Visiteur → Professionnel payant

### 3.1 Vue d'ensemble du parcours (7 étapes)

```
ÉTAPE 1 : Découverte         → Page d'accueil (premier contact)
ÉTAPE 2 : Compréhension      → Ce qu'est agrolide (valeur perçue)
ÉTAPE 3 : Identification     → "C'est fait pour moi" (page Rejoindre)
ÉTAPE 4 : Décision           → Surmonter les objections (preuve sociale)
ÉTAPE 5 : Inscription        → Formulaire (friction minimale)
ÉTAPE 6 : Paiement           → Cotisation (friction critique)
ÉTAPE 7 : Activation         → Premier accès et onboarding

Durée totale estimée : 3 à 7 jours pour un Professionnel
(Retours multiples sur le site avant paiement — c'est normal)
```

### 3.2 ÉTAPE 1 — Découverte (Page d'accueil)

**Objectif UX :** Faire en sorte que Kofi comprenne en moins de 5 secondes ce qu'est agrolide et pourquoi ça le concerne.

**Les 5 premières secondes sont critiques :**
```
Ce que Kofi voit en premier → H1 + sous-titre + CTA
Ce qu'il doit penser → "C'est un réseau professionnel agricole africain. Je suis agricole et professionnel et africain."
Ce qu'il ne doit PAS penser → "Encore une ONG" ou "C'est pour les agriculteurs de village"
```

**Règles pour le hero :**
- Le H1 doit contenir les mots **"réseau"** et **"africain"** et **"agricole"**
- Le sous-titre doit mentionner au moins un rôle concret (agronome, chercheur, consultant) — pas juste "acteurs de la chaîne"
- Le CTA principal est **"Rejoindre le réseau"** (action claire)
- Le CTA secondaire est **"Découvrir nos actions"** (pour les indécis)
- **Ne pas** mettre "Connexion" comme CTA dans le hero — c'est pour les membres existants, pas pour convertir

**Contenu prioritaire above the fold (visible sans scroll) :**
```
1. Logo agrolide (confiance)
2. H1 avec la promesse principale
3. Sous-titre qui nomme le cible
4. 2 CTAs
5. La photo (preuve d'authenticité humaine)
```

**Signaux de confiance à intégrer dans la page d'accueil :**

Le Professionnel cherche des preuves avant de faire confiance. Voici les signaux par ordre d'efficacité :

```
Niveau 1 (confiance immédiate) :
→ Nombre de membres actifs (chiffre réel ou estimé réaliste)
→ Nombre de pays représentés
→ Témoignages avec photo + nom + spécialité + pays réels

Niveau 2 (confiance approfondie) :
→ Logos de partenaires institutionnels (si disponibles)
→ Mention du siège à Lomé + statut associatif officiel
→ Noms des fondateurs visibles (pas anonyme)

Niveau 3 (confiance décisive) :
→ Un extrait réel de la bibliothèque (document visible en aperçu)
→ Un fil forum récent avec de vraies questions/réponses
→ Une liste partielle de membres réels (avec leur accord)
```

**Règle UX critique — Ne pas bloquer le scroll :**
Le Professionnel doit pouvoir scroller librement sans popups, sans chatbots intempestifs, sans bannières cookies qui bloquent la vue.

### 3.3 ÉTAPE 2 — Compréhension (section "Notre raison d'être")

**Objectif UX :** Kofi se reconnaît dans les 4 freins décrits. Il pense "c'est exactement mon problème."

**Règle de rédaction pour cette section :**
- Écrire à la 2ème personne du pluriel : "vous évoluez", "vos expertises", "votre réseau"
- Nommer des situations concrètes, pas des concepts abstraits
- Éviter le jargon associatif : pas de "synergie", "mutualisation des acquis", "parties prenantes"

**Texte de référence pour les 4 freins (microcopy validé) :**
```
Frein 01 — Isolement professionnel
Titre : "Vous avancez seul, alors que les solutions existent ailleurs"
Texte : "Il n'existe quasiment pas de réseaux solides dédiés aux agronomes africains. 
Chacun travaille dans son coin, sans accès aux expériences et compétences des pairs."

Frein 02 — Documentation inadaptée
Titre : "Les ressources techniques ne parlent pas de vos sols"
Texte : "La quasi-totalité des guides disponibles a été conçue pour des contextes 
occidentaux. Vos contraintes spécifiques — sols tropicaux, marchés informels, 
ressources limitées — sont ignorées."

Frein 03 — Déficit d'accompagnement
Titre : "Vos projets manquent de soutien pour se concrétiser"
Texte : "Mentorat de qualité, accès au financement, compétences entrepreneuriales : 
autant d'éléments qui font défaut aux agripreneurs africains qui veulent aller plus loin."

Frein 04 — Recherche sous-valorisée
Titre : "Les savoirs scientifiques n'atteignent pas le terrain"
Texte : "Des milliers de thèses et mémoires sont produits chaque année dans les 
universités africaines sans jamais être traduits en pratiques concrètes pour les producteurs."
```

### 3.4 ÉTAPE 3 — Identification (Page `/rejoindre`)

**Objectif UX :** Kofi doit penser "la carte Professionnel, c'est exactement moi."

**Structure de la page `/rejoindre` :**

```
Accroche H1 : "Trouvez votre place dans le réseau agrolide"
(Pas "Rejoignez-nous" — trop générique)

Sous-titre : "Choisissez le profil qui correspond à votre situation."
```

**Ordre des 4 cartes profils (conforme à la priorité de conversion) :**
```
1. Professionnel  (mise en avant — card légèrement plus grande ou badge "Le plus populaire")
2. Partenaire     (CTA différent : "Nous contacter" pas "S'inscrire")
3. Sénior         (CTA : "Candidater" — processus de sélection)
4. Junior         (Standard)
```

**Contenu de la carte Professionnel :**
```
Badge : "Le plus populaire"
Titre : Membre Professionnel
Public : "Agronomes, ingénieurs agricoles, chercheurs, consultants et entrepreneurs actifs dans le secteur"

Ce que vous obtenez :
✓ Profil dans l'annuaire continental
✓ Bibliothèque numérique (accès illimité)
✓ Sessions techniques privées
✓ Forum professionnel
✓ Messagerie interne
✓ Opportunités d'emploi & appels à projets
✓ Participation aux événements réseau

Cotisation : 15 000 FCFA / an
Soit 1 250 FCFA par mois

CTA : "S'inscrire comme Professionnel"
Sous le CTA : "Paiement par Mobile Money ou carte bancaire"
```

**Règle UX sur le prix :**
- Toujours afficher le prix ANNUEL ET le ramener au mensuel (1 250 FCFA/mois est moins intimidant que 15 000 FCFA/an)
- Mentionner Mobile Money sous chaque CTA payant (rassure les utilisateurs africains)
- Ne pas cacher le prix — l'afficher clairement évite la déception à l'étape paiement

**Tableau comparatif avantages :**
Le tableau doit répondre aux vraies questions du Professionnel. Colonnes : Junior / Professionnel / Partenaire / Sénior. Lignes dans cet ordre de priorité :

```
1. Profil dans l'annuaire          Junior: ✓  Pro: ✓  Part: ✓  Sén: ✓
2. Bibliothèque numérique         Junior: 20 docs/mois  Pro: Illimité  Part: Illimité  Sén: Illimité
3. Messagerie interne             Junior: ✗  Pro: ✓  Part: ✓  Sén: ✓
4. Sessions techniques privées    Junior: ✓  Pro: ✓  Part: ✓  Sén: ✓
5. Forum communautaire            Junior: ✓  Pro: ✓  Part: ✓  Sén: ✓
6. Opportunités d'emploi          Junior: ✓  Pro: ✓  Part: ✓  Sén: ✓
7. Dépôt de documents             Junior: ✗  Pro: ✓  Part: ✓  Sén: ✓
8. Vitrine partenaire             Junior: ✗  Pro: ✗  Part: ✓  Sén: ✗
9. Espace mentorat                Junior: ✗  Pro: ✗  Part: ✗  Sén: ✓
```

### 3.5 ÉTAPE 4 — Décision (Surmonter les objections)

**Objectif UX :** Neutraliser les 3 objections principales du Professionnel.

**Objection 1 : "Encore un réseau qui va mourir dans 3 mois"**
Réponse dans l'interface :
```
→ Afficher la date de création de l'association
→ Afficher le statut officiel (association déclarée, siège à Lomé)
→ Mettre un témoignage de membre qui souligne la longévité ou la sérieux
→ Page "Qui sommes-nous" accessible en 1 clic depuis n'importe où
```

**Objection 2 : "Comment je sais si les membres sont vraiment actifs ?"**
Réponse dans l'interface :
```
→ Sur la page d'accueil : afficher "X membres connectés ce mois-ci" (si données dispo)
→ Sur la page annuaire public : montrer la distribution géographique réelle (carte ou liste de pays)
→ Sur /rejoindre : afficher "Rejoignez 500+ professionnels de 12 pays africains"
```

**Objection 3 : "Prouve-moi la valeur avant que je paye"**
C'est l'objection la plus importante. La solution est le **"Freemium Preview"** :

```
RÈGLE UX — Freemium Preview :
Avant de s'inscrire, le visiteur doit pouvoir voir UNE démonstration concrète 
de la valeur du réseau. Pas juste des promesses — quelque chose de tangible.

Implémentation sur la page d'accueil :
→ Section "Aperçu de l'annuaire" : 6 cartes profils floutées + compteur réel
→ Section "Extrait de la bibliothèque" : 3 documents avec titre visible + résumé tronqué
→ Ces aperçus ont un overlay avec : "Accédez à l'intégralité en rejoignant le réseau"
   + CTA "Rejoindre" (vert, pas orange — on ne force pas la conversion ici)

L'idée : frustrer positivement. Il voit qu'il y a quelque chose de valeur, 
il ne peut pas y accéder, il veut y accéder.
```

### 3.6 ÉTAPE 5 — Inscription (Formulaire)

**Objectif UX :** Rendre l'inscription aussi simple et rapide que possible. Chaque champ en trop = abandons.

**Principe : Progressive disclosure (divulgation progressive)**
Ne pas demander toutes les informations en une seule fois. Séparer en 2 étapes :

```
ÉTAPE A — L'essentiel pour créer le compte (2 minutes max) :
→ Prénom *
→ Nom *
→ Email *
→ Mot de passe * (avec indicateur de force visible)
→ Pays * (select — pays africains en tête de liste)
→ Catégorie de membre * (pré-sélectionnée selon le CTA cliqué)
→ Checkbox CGU *

ÉTAPE B — Le profil (peut être fait APRÈS le paiement) :
→ Spécialité
→ Secteurs d'expertise
→ Organisation
→ Photo de profil
→ Biographie

RÈGLE : L'étape B n'est PAS obligatoire à l'inscription.
Elle est demandée lors du premier accès au dashboard (onboarding).
```

**Règles de formulaire :**

```
→ Labels au-dessus des champs (jamais placeholder-as-label)
→ Validation en temps réel (pas seulement à la soumission)
→ Message d'erreur sous le champ concerné (pas une alerte en haut de page)
→ Indicateur de progression visible (Étape 1/2 ou barre de progression)
→ Bouton de soumission toujours visible (pas besoin de scroller)
→ Champs optionnels clairement marqués "(optionnel)"
→ Sélecteur de pays : pays africains groupés en haut, séparés par un divider
→ Mot de passe : icône "voir/masquer" + indicateur de force (faible/moyen/fort)
```

**Microcopy du formulaire d'inscription :**
```
Titre de la page : "Créer mon compte agrolide"
Sous-titre : "Quelques informations pour personnaliser votre expérience."

Placeholder email : "votre@email.com"
Placeholder mot de passe : "Au moins 8 caractères"
Label pays : "Pays de résidence"
Label catégorie : "Votre profil membre"

CTA principal : "Créer mon compte →"
(PAS "Soumettre", PAS "Enregistrer", PAS "Valider")

Texte sous le CTA : "Vous recevrez un email de confirmation. 
La cotisation sera demandée à l'étape suivante."

Lien connexion : "Déjà membre ? Connectez-vous"
```

**Gestion des erreurs — Microcopy :**
```
Email déjà utilisé :
❌ "Erreur : cet email existe déjà"
✅ "Un compte existe déjà avec cet email. Connectez-vous →"

Mot de passe trop court :
❌ "Mot de passe invalide"
✅ "Ajoutez encore X caractère(s) pour sécuriser votre compte"

Champ obligatoire vide :
❌ "Ce champ est requis"
✅ "Merci de renseigner votre [prénom/pays/etc.]"
```

### 3.7 ÉTAPE 6 — Paiement (Friction critique)

C'est l'étape avec le plus fort taux d'abandon. Chaque friction supplémentaire = membres perdus.

**Principes UX pour le paiement :**

```
PRINCIPE 1 — Mobile Money en premier
L'ordre d'affichage des méthodes de paiement :
  1. Mobile Money (Orange Money, MTN, Moov, Wave)  ← PREMIER
  2. Carte bancaire (Visa, Mastercard)

Raison : 70% des membres cibles utilisent le Mobile Money comme 
méthode de paiement principale en Afrique de l'Ouest.
```

```
PRINCIPE 2 — Afficher le total avant de cliquer "Payer"
Structure de la page de paiement :

┌─────────────────────────────────────┐
│  Récapitulatif de votre adhésion   │
│                                     │
│  Membre Professionnel               │
│  Période : [date] → [date + 365j]  │
│                                     │
│  Cotisation annuelle : 15 000 FCFA │
│  TVA : incluse                      │
│  ─────────────────────────────────  │
│  TOTAL : 15 000 FCFA               │
│                                     │
│  Choisissez votre mode de paiement │
│  ┌──────────────┐ ┌──────────────┐ │
│  │ Mobile Money │ │    Carte     │ │
│  │   (Orange,   │ │  bancaire    │ │
│  │  MTN, Moov) │ │              │ │
│  └──────────────┘ └──────────────┘ │
│                                     │
│  🔒 Paiement 100% sécurisé         │
│  Vous pouvez annuler à tout moment │
└─────────────────────────────────────┘
```

```
PRINCIPE 3 — Rassurer sur la sécurité
Afficher sous le bouton "Payer" :
→ Icône cadenas + "Paiement 100% sécurisé"
→ "Vos données bancaires ne sont pas stockées sur nos serveurs"
→ "En cas de problème, contactez-nous : reseau@agrolide.org"
```

```
PRINCIPE 4 — Ne pas rompre le flow
→ Pas de redirection externe qui semble louche
→ L'URL reste agrolide.org pendant tout le process
→ Si redirection vers Stripe/CinetPay, afficher "Vous êtes redirigé vers 
  notre partenaire de paiement sécurisé [Stripe/CinetPay]" avant la redirection
```

```
PRINCIPE 5 — Page de succès claire
Après paiement validé, afficher IMMÉDIATEMENT (pas d'attente) :

Titre : "Bienvenue dans le réseau agrolide, [Prénom] ! 🎉"
Corps : "Votre adhésion Professionnel est active jusqu'au [date].
         Un email de confirmation a été envoyé à [email]."
CTA unique : "Accéder à mon tableau de bord →"

Ne pas : "Transaction traitée. Veuillez patienter." → trop froid
```

**Gestion des erreurs de paiement :**
```
Paiement refusé carte :
"Votre paiement n'a pas pu être traité. Vérifiez les informations 
de votre carte ou essayez avec Mobile Money."
→ Bouton "Essayer avec Mobile Money"
→ Bouton "Réessayer avec une autre carte"

Timeout Mobile Money :
"La transaction a expiré. Pas d'inquiétude — aucun montant 
n'a été débité. Réessayez en vous assurant d'avoir du crédit 
suffisant."
→ Bouton "Relancer le paiement"
```

### 3.8 ÉTAPE 7 — Activation (Onboarding premier accès)

**Objectif UX :** Kofi vient de payer. Il est motivé. Il faut qu'il vive une expérience immédiate de valeur dans les 5 premières minutes.

**Séquence d'onboarding après paiement :**

```
ÉCRAN 1 — Bienvenue (3 secondes, puis auto-redirect)
"Bienvenue, [Prénom] ! Votre compte est actif."
Animation légère (confetti ou checkmark animé — 1 seule fois)
→ Redirect automatique vers l'écran 2

ÉCRAN 2 — Compléter son profil (optionnel mais encouragé)
Titre : "Votre profil est votre carte de visite dans le réseau"
Sous-titre : "Complétez-le maintenant pour apparaître dans l'annuaire 
et être trouvé par vos futurs partenaires."

Barre de progression : "Profil complété à 30%"

Champs à remplir (les plus importants en premier) :
→ Photo de profil (upload simple)
→ Spécialité principale
→ Secteurs d'expertise (multi-select, 6 options max visibles)
→ Biographie (textarea, compteur de caractères visible)

Boutons : "Compléter maintenant" (primary) + "Plus tard" (text link)
(Les deux mènent au dashboard — on ne force pas)

ÉCRAN 3 — Dashboard avec guidage contextuel
Si le profil est incomplet : bannière discrète en haut (pas intrusive)
"Votre profil est complété à 30%. Finissez-le pour être visible dans l'annuaire."
→ Lien "Compléter mon profil"

3 raccourcis mis en avant selon la catégorie :
Pour un Professionnel :
1. "Explorer l'annuaire" (trouver des pairs)
2. "Parcourir la bibliothèque" (accéder aux ressources)
3. "Voir les opportunités" (offres d'emploi)
```

**Règle UX — Ne jamais laisser un état vide sans guidage :**
```
Dashboard vide (nouveau membre, 0 connexions, 0 téléchargements) :
→ Ne PAS afficher "Vous n'avez aucune activité"
→ Afficher "Commencez par explorer l'annuaire → " + 
  "3 membres récents qui pourraient vous intéresser" (suggestions auto)
```

---

## 4. Parcours Partenaire — Spécificités

### 4.1 Pourquoi un parcours distinct

Le Partenaire (entreprise, coopérative, ONG) ne peut pas s'inscrire comme un individu. Sa décision d'adhésion implique souvent plusieurs personnes en interne. Il a besoin de parler à quelqu'un avant de s'engager.

### 4.2 Flux Partenaire

```
Page /rejoindre → Clic sur "Nous contacter" (carte Partenaire)
  ↓
Formulaire de contact Partenaire (modal ou page dédiée) :
  → Raison sociale *
  → Secteur d'activité *
  → Nom du contact *
  → Fonction *
  → Email professionnel *
  → Pays *
  → Nature de la collaboration envisagée (select) :
      - Adhésion Partenaire
      - Sponsoring événement
      - Partenariat institutionnel
      - Autre
  → Message (textarea, optionnel)
  → CTA : "Envoyer ma demande"
  ↓
Page de confirmation :
  "Votre demande a bien été reçue. Notre équipe vous contactera 
   sous 48 heures ouvrées pour discuter de votre adhésion."
  ↓
Email Resend automatique à l'équipe agrolide + accusé de réception au contact
```

**Règle UX Partenaire :** Ne jamais diriger un Partenaire vers le flow d'inscription standard. Il doit toujours passer par un formulaire de contact. L'adhésion est validée manuellement par l'équipe.

---

## 5. Règles de Microcopy globales

### 5.1 Ton et voix (conforme à la charte éditoriale)

```
FAIRE :
→ Vouvoiement systématique ("vous", "votre", "vos")
→ Phrases courtes (max 20 mots par phrase dans l'interface)
→ Verbes d'action ("Accéder", "Rejoindre", "Télécharger", "Explorer")
→ Concret et spécifique ("12 pays" plutôt que "plusieurs pays")
→ Bienveillant sans être familier
→ Africain sans stéréotype (pas de "votre continent" de manière condescendante)

NE PAS FAIRE :
→ "Cliquez ici" (non-descriptif)
→ "Soumettre" (froid, administratif)
→ "Erreur" seul sans explication
→ "Veuillez patienter" (anxiogène)
→ "Cette fonctionnalité n'est pas disponible" (sans alternative)
→ "Accès refusé" (brutal)
→ Majuscules excessives sur les CTA ("REJOINDRE LE RÉSEAU" → non)
```

### 5.2 Labels de CTA par contexte

```
CONTEXTE                    BON CTA                     MAUVAIS CTA
─────────────────────────────────────────────────────────────────────
Rejoindre le réseau    → "Rejoindre le réseau"        "S'inscrire"
Payer la cotisation    → "Finaliser mon adhésion"      "Payer maintenant"
Voir un document       → "Accéder au document"         "Télécharger"
Trouver un membre      → "Explorer l'annuaire"         "Rechercher"
Poser une question     → "Rejoindre la discussion"     "Commenter"
Se déconnecter         → "Me déconnecter"              "Logout"
Renouveler cotisation  → "Renouveler mon adhésion"     "Payer"
Soumettre un document  → "Proposer ce document"        "Soumettre"
Candidater incubation  → "Déposer ma candidature"      "Envoyer"
```

### 5.3 Messages d'état vide

```
PAGE                   MESSAGE ÉTAT VIDE
────────────────────────────────────────────────────────────────────
Annuaire (0 résultat)  "Aucun membre ne correspond à votre recherche.
                        Essayez avec des critères moins restrictifs."
                        [Bouton : "Réinitialiser les filtres"]

Forum (0 fil)          "Aucune discussion dans cette catégorie.
                        Soyez le premier à lancer un sujet !"
                        [Bouton : "Créer une discussion"]

Bibliothèque (0 doc)   "Aucun document ne correspond à vos filtres.
                        Vous pouvez proposer un document au réseau."
                        [Bouton : "Proposer un document"]

Messages (0 message)   "Votre messagerie est vide.
                        Trouvez un pair dans l'annuaire et engagez 
                        une conversation professionnelle."
                        [Bouton : "Explorer l'annuaire"]

Dashboard (nouveau)    "Bienvenue ! Votre espace membre est prêt.
                        Commencez par compléter votre profil pour 
                        apparaître dans l'annuaire."
                        [Bouton : "Compléter mon profil"]

Opportunités (0 offre) "Aucune opportunité pour le moment.
                        Activez les notifications pour être alerté 
                        dès qu'une offre correspond à votre profil."
                        [Bouton : "Activer les alertes"]
```

### 5.4 Messages de succès

```
ACTION                 MESSAGE DE SUCCÈS
─────────────────────────────────────────────────────────────────────
Inscription réussie  → "Votre compte a été créé ! Vérifiez votre 
                        email pour activer votre adhésion."

Paiement validé      → "Bienvenue dans le réseau agrolide, [Prénom] !
                        Votre adhésion est active jusqu'au [date]."

Profil mis à jour    → "Votre profil a été mis à jour."
                        (Pas de "succès !" — sobre)

Document déposé      → "Votre document a été transmis à notre équipe.
                        Nous le publierons dans les 48h après vérification."

Message envoyé       → "Votre message a été envoyé à [Prénom]."

Inscription formation → "Vous êtes inscrit(e) à [Titre formation].
                         Un email de confirmation vous a été envoyé."
```

### 5.5 Messages de chargement

```
ACTION                 MESSAGE DE CHARGEMENT
─────────────────────────────────────────────────────────────────────
Recherche annuaire   → (Spinner discret — pas de texte)
Chargement doc PDF   → "Préparation du document..."
Génération certificat → "Génération de votre certificat..."
Paiement en cours    → "Traitement de votre paiement..."
                        (Ne jamais laisser un écran vide pendant un paiement)
Upload fichier       → Barre de progression % + "Upload en cours..."
```

---

## 6. Règles de navigation mobile (Afrique-first)

### 6.1 Principes fondamentaux

```
RÈGLE 1 — Zone de frappe
Tout élément interactif : min 48×48px (zone tactile, pas visuelle)
Écart entre deux éléments cliquables : min 8px

RÈGLE 2 — Pouce-first
Les actions principales en bas de l'écran (zone du pouce)
La navigation principale en bottom bar (zone membres)
Jamais d'action critique cachée dans un coin supérieur gauche

RÈGLE 3 — Performance perçue
Afficher le contenu dès que possible (skeleton loaders)
Ne jamais bloquer l'interface pendant un chargement réseau
Garder les interactions fluides même si le data n'est pas arrivé

RÈGLE 4 — Économie de données
Images lazy-loaded par défaut (attribut loading="lazy")
Pas d'autoplay vidéo
Pas de webfont au-delà de 2 familles
Placeholder blur avant chargement image

RÈGLE 5 — Offline gracieux
Si pas de connexion : message clair + dernières données en cache
"Vous êtes hors ligne. Voici les derniers contenus chargés."
```

### 6.2 Navigation mobile zone membres

```
Bottom navigation bar (5 items max) :
┌────────────────────────────────────────────────┐
│  🏠        👥        📚        💬        👤   │
│ Accueil  Annuaire  Biblio   Forum   Profil   │
└────────────────────────────────────────────────┘

Badge rouge sur 💬 si nouveaux messages
Badge rouge sur 🏠 si nouvelles notifications

Toutes les autres sections (Formations, Événements, etc.) 
sont accessibles depuis le menu "Accueil" du dashboard 
ou via les raccourcis de la section correspondante.
```

### 6.3 Formulaires sur mobile

```
→ Un seul champ visible à la fois sur mobile (si possible)
→ Le clavier ne doit pas masquer le champ actif (scroll automatique)
→ Type d'input adapté au contenu :
   - Email → type="email" (clavier @)
   - Téléphone → type="tel" (clavier numérique)
   - Montant → type="number" (clavier numérique)
   - Recherche → type="search" (bouton loupe)
→ Bouton de soumission : width: 100% sur mobile
→ Labels toujours visibles (même avec clavier ouvert)
```

---

## 7. Architecture de l'information — Hiérarchie des pages

### 7.1 Principe de 3 clics

Un utilisateur doit pouvoir atteindre n'importe quelle fonctionnalité principale en 3 clics maximum depuis le dashboard.

```
Dashboard → Annuaire → Profil d'un membre     (3 clics)
Dashboard → Bibliothèque → Document spécifique (3 clics)
Dashboard → Forum → Fil de discussion         (3 clics)
Dashboard → Formations → Inscription          (3 clics)
```

### 7.2 Hiérarchie de contenu sur chaque page

```
Pour chaque page, le contenu doit suivre cet ordre :
1. Ce que c'est (titre H1 + sous-titre)
2. Ce que l'utilisateur peut faire (actions principales)
3. Le contenu principal
4. Les actions secondaires
5. Les actions tertiaires (en bas ou en sidebar)
```

### 7.3 Breadcrumb obligatoire

Sur toutes les pages de profondeur ≥ 2 :
```
Membres > Bibliothèque > Gestion durable des sols tropicaux
Membres > Annuaire > Kofi Mensah
Membres > Formations > Business Plan Agrobusiness > Inscription
```

---

## 8. Patterns de confiance et crédibilité

### 8.1 Trust signals par page

```
PAGE D'ACCUEIL :
→ Nombre de membres (avec le mot "actifs" — pas juste "membres")
→ Nombre de pays représentés
→ Statut officiel de l'association (mention discrète dans le footer)
→ 3 témoignages avec photo réelle, prénom, pays, spécialité
→ Date de fondation (montre la longévité)

PAGE /REJOINDRE :
→ "Rejoignez 500+ professionnels de 12 pays africains"
→ "Paiement sécurisé par [Stripe] et [CinetPay]"
→ "Vous pouvez annuler votre adhésion à tout moment"
→ FAQ avec les vraies questions des membres

PAGE /INSCRIPTION :
→ "Vos données sont protégées et ne seront jamais vendues"
→ "Confirmation par email dans les 2 minutes"
→ Mention CGU + lien (obligatoire et visible)

PAGE PAIEMENT :
→ Icône cadenas + "Paiement 100% sécurisé"
→ Logos Stripe et CinetPay (reconnaissance visuelle)
→ "Aucune donnée bancaire stockée sur nos serveurs"
→ Email de contact visible en cas de problème
```

### 8.2 Cohérence des prix

```
RÈGLE : Le prix ne doit JAMAIS surprendre l'utilisateur.

→ Afficher le prix dès la page /rejoindre
→ Rappeler le prix sur la page /inscription (récapitulatif)
→ Confirmer le prix sur la page de paiement
→ Confirmer le montant débité dans l'email de confirmation

Jamais de "prix sur demande" pour les catégories Junior et Professionnel.
```

---

## 9. UX des emails transactionnels

### 9.1 Principes

```
→ Objet clair et personnel : "[Prénom], votre adhésion agrolide est confirmée"
   (Pas : "Confirmation de transaction #84729")
→ Un seul CTA par email
→ Texte simple, sans HTML complexe (meilleure délivrabilité)
→ Toujours inclure une alternative texte brut
→ Expéditeur : "Le réseau agrolide <reseau@agrolide.org>"
   (Pas : "noreply@agrolide.org")
```

### 9.2 Email de bienvenue — Structure exacte

```
Objet : "[Prénom], bienvenue dans le réseau agrolide !"

Contenu :

Bonjour [Prénom],

Votre adhésion [Catégorie] est maintenant active.

Voici vos prochaines étapes :

1. Complétez votre profil pour apparaître dans l'annuaire
   → [Compléter mon profil]

2. Explorez la bibliothèque numérique
   → [Parcourir les ressources]

3. Découvrez l'annuaire et connectez-vous avec vos pairs
   → [Explorer l'annuaire]

Votre adhésion est valable jusqu'au [date].

Si vous avez des questions, répondez simplement à cet email.

L'équipe agrolide
Lomé, Togo
---
Vous recevez cet email car vous avez rejoint le réseau agrolide.
[Se désabonner des communications marketing] (ne s'applique pas aux emails transactionnels)
```

---

## 10. Prompt maître UX pour Antigravity

```
Tu vas implémenter l'expérience utilisateur du site agrolide.org en suivant l'UX Bible.
Lis les fichiers ui-bible-agrolide.md ET ux-bible-agrolide.md avant de commencer.

PRINCIPES UX FONDAMENTAUX À RESPECTER :

1. CONVERSION PRIORITAIRE : Professionnel > Partenaire > Sénior > Junior
   Chaque interface doit d'abord parler au Professionnel agricole africain.

2. MOBILE MONEY EN PREMIER : Sur toutes les pages de paiement, 
   Mobile Money apparaît avant la carte bancaire.

3. FRICTION MINIMALE : Formulaires en 2 étapes maximum.
   Ne demander que ce qui est strictement nécessaire à chaque étape.

4. FREEMIUM PREVIEW : Avant inscription, le visiteur doit voir 
   un aperçu concret (annuaire flouté, bibliothèque partielle).

5. ÉTATS VIDES GUIDÉS : Jamais de page vide sans message 
   et sans action suggérée. Utiliser les textes de l'UX Bible §5.3.

6. MICROCOPY VALIDÉ : Utiliser exactement les libellés de CTA, 
   messages d'erreur et de succès définis en §5.

7. 3 CLICS MAXIMUM : Toute fonctionnalité principale accessible 
   en 3 clics depuis le dashboard.

8. CONFIANCE : Afficher les trust signals définis en §8.1 
   sur chaque page correspondante.

CONTEXTE UTILISATEUR :
- 60%+ d'utilisateurs sur mobile Android, connexion 3G variable
- Afrique de l'Ouest francophone principalement
- Professionnels agricoles : exigeants, peu de temps, besoin de preuve

Pour cette session, voici ce que tu vas implémenter : [DÉCRIRE LA TÂCHE ICI]
```

---

*— Fin de l'UX Bible agrolide v1.0 —*
*À placer dans le dossier racine du projet agrolide.org*
*À lire conjointement avec ui-bible-agrolide.md*
*Référencer dans chaque session Antigravity avant toute génération d'interface*
