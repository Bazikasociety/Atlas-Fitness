# Atlas Fitness — Site web de coaching sportif

Site complet de Yann Bazika — Atlas Fitness. Coach sportif personnel.

**Stack :** Next.js 14 · TypeScript · Tailwind CSS · Prisma v7 (SQLite/libsql) · Framer Motion · Stripe · Resend

---

## Démarrage rapide

### 1. Prérequis

- **Node.js** ≥ 20 (via NVM recommandé)
- **pnpm** ≥ 10

```bash
# Si Node.js via NVM :
export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"
```

### 2. Installation

```bash
cd "atlas-fitness-app"
pnpm install
```

### 3. Variables d'environnement

Le fichier `.env` est déjà configuré pour le développement local. Pour la production, complétez les clés Stripe et Resend :

```env
DATABASE_URL="file:./dev.db"
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_REMISE_EN_FORME=price_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
RESEND_API_KEY=re_...
ADMIN_EMAIL=societebazika@gmail.com
ADMIN_PASSWORD=atlas2024!
JWT_SECRET=atlas-fitness-super-secret-jwt-key-change-in-production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Base de données

```bash
# Applique les migrations existantes
pnpm prisma migrate dev

# Peuple avec 12 articles + données démo
pnpm prisma db seed
```

### 5. Lancer le serveur de développement

```bash
pnpm dev
```

→ Ouvrir [http://localhost:3000](http://localhost:3000)

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page complète (hero, coach, méthode, quiz, forfait, journal, contact) |
| `/quiz` | Quiz santé 8 questions basé sur OMS/INSEE (score /20) |
| `/journal` | Magazine d'articles style Nike Stories |
| `/journal/[slug]` | Article individuel avec layout éditorial |
| `/reserver` | Calendrier + formulaire + paiement Stripe |
| `/merci` | Confirmation après réservation |
| `/admin/login` | Connexion admin |
| `/admin` | Dashboard (clients, réservations, articles, quiz, stats, export Excel) |

---

## Configuration Stripe (paiement)

### Étape 1 — Créer un compte Stripe

→ [dashboard.stripe.com](https://dashboard.stripe.com) (mode test gratuit)

### Étape 2 — Récupérer les clés

Dans **Stripe Dashboard → Développeurs → Clés API** :
- `STRIPE_SECRET_KEY` = `sk_test_...`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_test_...`

### Étape 3 — Créer le produit

Stripe Dashboard → **Catalogue de produits → Créer un produit** :
- Nom : "Forfait Remise en Forme"
- Prix : **150€ / mois** (abonnement récurrent)
- Copiez le **Price ID** (`price_...`) → `STRIPE_PRICE_ID_REMISE_EN_FORME`

### Étape 4 — Configurer le webhook

```bash
# Installer Stripe CLI : https://stripe.com/docs/stripe-cli
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copiez le `whsec_...` affiché → `STRIPE_WEBHOOK_SECRET`

### Étape 5 — Tester un paiement

1. Allez sur `/reserver`
2. Sélectionnez "FORFAIT REMISE EN FORME — 150€/mois"
3. Remplissez le formulaire et confirmez
4. Sur la page Stripe Test : carte `4242 4242 4242 4242`, date future, CVC quelconque
5. Vérifiez `/admin` → le client apparaît avec statut "active"

---

## Configuration Resend (emails)

1. Créer un compte sur [resend.com](https://resend.com)
2. **Créer une clé API** → `RESEND_API_KEY`
3. Vérifier votre domaine d'envoi (ou utiliser `@resend.dev` en test)
4. Mettre à jour l'adresse `from: "Atlas Fitness <noreply@atlasfitness.fr>"` dans les routes API si votre domaine est différent

---

## Dashboard Admin

**URL :** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

**Mot de passe :** valeur de `ADMIN_PASSWORD` dans `.env` (défaut : `atlas2024!`)

**Onglets disponibles :**
- **Statistiques** — MRR, clients actifs, taux de conversion quiz→réservation
- **Clients** — table triable, notes éditables, statuts Stripe
- **Réservations** — liste avec changement de statut (en attente / confirmé / payé / annulé)
- **Journal** — CRUD articles (création markdown + aperçu)
- **Quiz** — guide d'accès aux données (export Excel)
- **Export Excel** (bouton en haut à droite) — 4 feuilles : clients actifs, prospects quiz, réservations, articles

---

## Assets visuels — Placeholders à remplacer

Les assets suivants sont en placeholder. **Remplacez simplement les fichiers dans `public/` sans modifier le code** :

| Fichier | Usage | Format recommandé |
|---------|-------|-------------------|
| `public/hero.mp4` | Vidéo hero background (muted/loop/autoplay) | MP4 H.264, 10-15s |
| `public/hero-fallback.jpg` | Image si vidéo indisponible | 1920×1080px |
| `public/yann-portrait.jpg` | Photo coach section "01 — LE COACH" | Portrait, haute résolution |

Les images d'articles utilisent des URLs Unsplash (modifiables dans l'admin).

---

## Commandes utiles

```bash
pnpm dev                        # Serveur de développement (port 3000)
pnpm build                      # Build de production
pnpm start                      # Serveur de production
pnpm lint                       # ESLint
pnpm prisma studio              # Interface DB visuelle (port 5555)
pnpm prisma migrate dev         # Nouvelle migration
pnpm prisma db seed             # Re-seeder la DB (⚠️ supprime les données existantes)
```
