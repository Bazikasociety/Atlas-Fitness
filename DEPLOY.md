# Déploiement — Atlas Fitness sur Vercel

---

## 1. Prérequis

- Compte [Vercel](https://vercel.com) (gratuit)
- Clés Stripe production (`sk_live_...`, `pk_live_...`)
- Clé Resend configurée avec votre domaine
- Domaine personnalisé (optionnel mais recommandé)

---

## 2. Base de données en production

SQLite local **ne fonctionne pas sur Vercel** (système de fichiers éphémère). Deux options :

### Option A — Turso (recommandé, gratuit jusqu'à 500 DB)

```bash
# Installer Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Créer une DB
turso db create atlas-fitness

# Récupérer l'URL et le token
turso db show atlas-fitness --url   # → libsql://atlas-fitness-xxx.turso.io
turso db tokens create atlas-fitness  # → eyJhbGc...
```

Mettre à jour `.env` :
```env
DATABASE_URL="libsql://atlas-fitness-xxx.turso.io?authToken=eyJhbGc..."
```

Puis migrer vers Turso :
```bash
# Exporter votre DB locale
pnpm prisma migrate deploy

# Pousser les données (optionnel — rerunner le seed sur la prod DB)
DATABASE_URL="libsql://..." pnpm prisma db seed
```

### Option B — PlanetScale / Supabase

Adaptez le `prisma/schema.prisma` pour le provider correspondant.

---

## 3. Déployer sur Vercel

### Via CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Via interface web

1. Aller sur [vercel.com/new](https://vercel.com/new)
2. Importer le repository GitHub/GitLab
3. **Root Directory** : `atlas-fitness-app`
4. Framework : **Next.js** (détecté automatiquement)
5. Ajouter les variables d'environnement (voir section suivante)
6. Déployer

---

## 4. Variables d'environnement Vercel

Dans **Project Settings → Environment Variables**, ajouter :

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | URL libsql (Turso) ou autre DB |
| `STRIPE_SECRET_KEY` | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (du webhook Vercel — voir étape 5) |
| `STRIPE_PRICE_ID_REMISE_EN_FORME` | `price_...` (mode live) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` |
| `RESEND_API_KEY` | `re_...` |
| `ADMIN_EMAIL` | `societebazika@gmail.com` |
| `ADMIN_PASSWORD` | Mot de passe fort |
| `JWT_SECRET` | Chaîne aléatoire 32+ caractères |
| `NEXT_PUBLIC_SITE_URL` | `https://votre-domaine.com` |

---

## 5. Webhook Stripe production

Dans **Stripe Dashboard → Développeurs → Webhooks → Ajouter un endpoint** :

- **URL** : `https://votre-domaine.com/api/webhooks/stripe`
- **Événements à écouter** :
  - `checkout.session.completed`
  - `invoice.paid`
  - `customer.subscription.deleted`
  - `customer.subscription.updated`

Copiez le **Signing secret** (`whsec_...`) → `STRIPE_WEBHOOK_SECRET` dans Vercel

---

## 6. Domaine personnalisé

Dans **Vercel → Project → Settings → Domains** :
1. Ajouter votre domaine (`atlasfitness.fr` ou `www.atlasfitness.fr`)
2. Configurer les DNS chez votre registrar (A record ou CNAME vers Vercel)
3. Le certificat SSL est automatique

---

## 7. Checklist avant mise en ligne

- [ ] Clés Stripe **mode live** (pas test)
- [ ] Webhook Stripe configuré avec l'URL de production
- [ ] `NEXT_PUBLIC_SITE_URL` = URL de production exacte
- [ ] `ADMIN_PASSWORD` changé (pas `atlas2024!`)
- [ ] `JWT_SECRET` = chaîne aléatoire forte
- [ ] Base de données cloud configurée (Turso ou autre)
- [ ] Emails Resend testés depuis la production
- [ ] `yann-portrait.jpg` uploadé dans `public/`
- [ ] Vidéo `hero.mp4` uploadée (ou service CDN configuré)
- [ ] Test complet du flow : réservation → Stripe → email → admin
