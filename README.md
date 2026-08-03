# Chorale Saint Patrick — Paroisse Saint-Cyprien (Archidiocèse de Conakry)

Application web de gestion pour la chorale : bureau, maîtres de chœur, choristes, répertoire de chants, activités, prestations, archives et plan d'action.

## Stack technique

- [Next.js 15](https://nextjs.org) (App Router) + TypeScript
- CSS classique séparé (styles globaux + modules CSS par composant, sans framework CSS)
- Prisma ORM + SQLite (dev) — migrable vers PostgreSQL en production
- NextAuth.js (authentification + rôles)

## Démarrer en local

```bash
npm install
npx prisma migrate dev
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Rôles

- **Choriste** : membre du pupitre, accès au répertoire et au planning
- **Maître de chœur** : gère le répertoire et les prestations
- **Membre du bureau** : président·e, secrétaire général·e, trésorier·ère, chargé·e d'organisation, chargé·e spirituel·le, chargé·e de discipline — accès aux archives, finances, discipline et plan d'action selon la fonction
- **Administrateur·rice** : 2 à 3 personnes avec contrôle total sur le site (accès à l'espace bureau et à toutes les fonctionnalités, indépendamment des autres rôles)
