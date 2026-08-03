# Chorale Saint Patrick — Paroisse Saint-Cyprien (Archidiocèse de Conakry)

Site web de gestion pour la chorale : bureau, maîtres de chœur, choristes, répertoire de chants, activités, prestations, archives et plan d'action.

## Stack technique

- HTML / CSS / JavaScript classiques, **sans framework ni étape de build** — chaque page est un fichier `.html` autonome
- [Supabase](https://supabase.com) : base de données (PostgreSQL) + authentification, utilisés directement depuis le navigateur
- Hébergement statique sur [Netlify](https://netlify.com)

## Structure des fichiers

```
index.html              Accueil
connexion.html          Connexion
inscription.html        Création de compte
repertoire.html         Répertoire de chants
choristes.html          Liste des choristes par pupitre
activites.html          Activités
prestations.html        Prestations
bureau/index.html       Espace bureau (protégé)
bureau/archives.html    Archives du bureau (protégé)
bureau/plan-action.html Plan d'action (protégé)

css/style.css           Tous les styles du site
js/config.js            Clés de connexion Supabase (à renseigner)
js/supabase-client.js    Initialisation du client Supabase
js/layout.js             En-tête commun, gestion des rôles et des accès
js/page-*.js             Logique propre à chaque page

supabase/schema.sql      Structure de la base de données (tables + sécurité)
supabase/seed.sql        Données de démonstration (répertoire, activités...)
```

## Mise en route (une seule fois)

### 1. Créer les tables dans Supabase

1. Dashboard Supabase → **SQL Editor** → **New query**
2. Collez le contenu de `supabase/schema.sql`, cliquez **Run**
3. (Optionnel) Faites de même avec `supabase/seed.sql` pour avoir des chants/activités de démonstration

### 2. Renseigner les clés Supabase

Dans `js/config.js`, remplacez les deux valeurs par celles de votre projet (Dashboard Supabase → **Project Settings** → **API**) :

```js
const SUPABASE_URL = "https://votre-projet.supabase.co";
const SUPABASE_ANON_KEY = "votre-clé-anon-public";
```

Ces valeurs sont faites pour être publiques (utilisées côté navigateur) — ce n'est pas un mot de passe à cacher.

### 3. Créer votre compte et devenir administrateur·rice

1. Ouvrez `inscription.html` sur le site, créez votre compte (prénom, nom, email, mot de passe)
2. Si la confirmation par email est activée sur votre projet Supabase, confirmez via le lien reçu
3. Dans Supabase → **SQL Editor**, exécutez (en remplaçant l'email) :

```sql
insert into public.roles_membres (profil_id, role)
select id, 'ADMIN' from auth.users where email = 'votre-email@exemple.com';
```

Vous avez maintenant le contrôle total sur le site (accès à l'espace bureau, etc.). Répétez cette étape pour les 2-3 personnes qui doivent être administratrices.

## Déploiement sur Netlify

Ce site est 100% statique (aucune étape de build nécessaire) :

1. Connectez le dépôt GitHub à Netlify
2. Laissez la commande de build **vide** et le dossier de publication sur `.` (racine)
3. Déployez

## Tester en local

Ouvrir directement les fichiers `.html` dans un navigateur peut poser problème (certains navigateurs bloquent les requêtes réseau depuis `file://`). Utilisez plutôt un petit serveur local, par exemple :

```bash
npx serve .
```

puis ouvrez l'adresse affichée (ex. http://localhost:3000).

## Rôles

- **Choriste** : rôle par défaut à l'inscription, accès au répertoire et au planning
- **Maître de chœur** : gère le répertoire et les prestations
- **Membre du bureau** : président·e, secrétaire général·e, trésorier·ère, chargé·e d'organisation, chargé·e spirituel·le, chargé·e de discipline — accès aux archives et au plan d'action
- **Administrateur·rice** : 2 à 3 personnes avec contrôle total sur le site, quel que soit leur autre rôle

Les rôles se gèrent pour l'instant directement dans Supabase (table `roles_membres`) — il n'y a pas encore d'interface d'administration dans le site.
