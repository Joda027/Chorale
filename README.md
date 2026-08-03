# Chorale Saint Patrick — Paroisse Saint-Cyprien (Archidiocèse de Conakry)

Application web de gestion pour la chorale : bureau, maîtres de chœur, choristes, répertoire de chants, activités, prestations, archives et plan d'action.

## Stack technique

- [Next.js 15](https://nextjs.org) (App Router) + TypeScript
- CSS classique séparé (styles globaux + modules CSS par composant, sans framework CSS)
- Prisma ORM + PostgreSQL (compatible [Supabase](https://supabase.com))
- NextAuth.js (authentification + rôles)
- Déployé sur [Netlify](https://netlify.com)

## Démarrer en local

1. Copier `.env.example` en `.env` et renseigner `DATABASE_URL` (voir ci-dessous) et `AUTH_SECRET` (une chaîne aléatoire, ex. générée par `openssl rand -hex 32`)
2. Installer les dépendances et appliquer les migrations :

```bash
npm install
npx prisma migrate deploy
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Déploiement (Netlify + Supabase)

### 1. Base de données Supabase

1. Dans le tableau de bord Supabase du projet : **Project Settings** → **Database** → **Connection string**
2. Choisir l'onglet **Connection pooling** (mode **Transaction**, port 6543) — c'est celui qu'il faut utiliser pour un hébergement type Netlify (fonctions serverless), pas la connexion directe
3. Copier l'URL et remplacer `[YOUR-PASSWORD]` par le mot de passe de la base
4. Créer les tables : dans Supabase, aller dans **SQL Editor** → **New query**, coller le contenu de [`prisma/migrations/20260803151125_init/migration.sql`](./prisma/migrations/20260803151125_init/migration.sql), puis **Run**
5. (Optionnel) Charger des données de démonstration : même procédure avec [`prisma/seed.sql`](./prisma/seed.sql) — crée 3 comptes administrateurs, un maître de chœur et un choriste (mot de passe : `chorale2026`)

### 2. Variables d'environnement sur Netlify

Dans le site Netlify : **Site configuration** → **Environment variables**, ajouter :

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | l'URL de connexion Supabase (étape précédente) |
| `AUTH_SECRET` | une chaîne aléatoire secrète (ex. `openssl rand -hex 32`) |

Puis redéployer le site (**Deploys** → **Trigger deploy**).

## Rôles

- **Choriste** : membre du pupitre, accès au répertoire et au planning
- **Maître de chœur** : gère le répertoire et les prestations
- **Membre du bureau** : président·e, secrétaire général·e, trésorier·ère, chargé·e d'organisation, chargé·e spirituel·le, chargé·e de discipline — accès aux archives, finances, discipline et plan d'action selon la fonction
- **Administrateur·rice** : 2 à 3 personnes avec contrôle total sur le site (accès à l'espace bureau et à toutes les fonctionnalités, indépendamment des autres rôles)
