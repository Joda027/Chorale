# Chorale Saint Patrick — Paroisse Saint-Cyprien (Archidiocèse de Conakry)

Site web de gestion pour la chorale : bureau, maîtres de chœur, choristes, répertoire de chants, activités, prestations, archives et plan d'action.

## Stack technique

- HTML / CSS / JavaScript classiques, **sans framework ni étape de build** — chaque page est un fichier `.html` autonome
- [Supabase](https://supabase.com) : base de données (PostgreSQL) + authentification, utilisés directement depuis le navigateur
- Hébergement statique sur [Netlify](https://netlify.com)

## Structure des fichiers

```
index.html              Accueil (avec carrousel photos, membres connectés)
visiteurs.html          Espace visiteurs : photos, musiques, partitions, infos (sans connexion)
connexion.html          Connexion
inscription.html        Création de compte
repertoire.html         Répertoire : Chants / Partitions / Musiques / Photos (onglets, membres)
choristes.html          Liste des choristes par pupitre
activites.html          Activités
prestations.html        Prestations
bureau/index.html       Espace bureau (protégé : président·e, secrétaire...)
bureau/archives.html    Archives du bureau
bureau/plan-action.html Plan d'action

admin/index.html        Espace administration (protégé : administrateur·rice uniquement)
admin/chants.html       Ajouter / modifier / supprimer les chants
admin/partitions.html   Ajouter / supprimer des partitions (avec protection par code)
admin/musiques.html     Ajouter / supprimer des musiques (audio)
admin/photos.html       Ajouter / supprimer les photos du carrousel
admin/infos.html        Modifier le texte et le contact de la page visiteurs

css/style.css           Tous les styles du site (menu latéral compris)
js/config.js            Clés de connexion Supabase (à renseigner)
js/supabase-client.js    Initialisation du client Supabase
js/layout.js             Menu latéral commun, gestion des rôles et des accès
js/page-*.js             Logique des pages publiques
js/admin-*.js            Logique des pages d'administration

supabase/schema.sql              Structure de base (tables + sécurité)
supabase/migration_002_repertoire.sql  Chants par partie de messe, partitions,
                                        musiques, photos, stockage des fichiers
supabase/migration_003_public.sql      Page visiteurs : infos publiques, accès
                                        sans connexion aux photos/musiques/partitions
supabase/seed.sql        Données de démonstration (répertoire, activités...)
```

## Mise en route (une seule fois)

### 1. Créer les tables dans Supabase

1. Dashboard Supabase → **SQL Editor** → **New query**
2. Collez le contenu de `supabase/schema.sql`, cliquez **Run**
3. Nouvelle requête → collez le contenu de `supabase/migration_002_repertoire.sql`, **Run**
   (crée aussi automatiquement les espaces de stockage des fichiers : partitions, musiques, photos)
4. Nouvelle requête → collez le contenu de `supabase/migration_003_public.sql`, **Run**
   (page visiteurs sans connexion)
5. (Optionnel) Faites de même avec `supabase/seed.sql` pour avoir des chants/activités de démonstration

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

Les rôles se gèrent pour l'instant directement dans Supabase (table `roles_membres`) — il n'y a pas d'interface pour ça dans le site.

## Répertoire et fichiers

Le répertoire (page `repertoire.html`) est organisé en 4 onglets :

- **Chants** : classés par partie de la messe (Entrée, Kyrie, Gloire, Psaume, Acclamation, Offertoire, Sanctus, Agneau de Dieu, Communion, Sortie)
- **Partitions** : fichiers téléchargeables (PDF, image...). Une partition peut être **protégée par un code** : l'administrateur·rice l'active dans `admin/partitions.html`, un code à 6 chiffres est généré automatiquement et visible uniquement par les admins. L'administrateur·rice communique ce code lui-même (téléphone, message...) à la personne autorisée, qui le saisit sur le site pour débloquer le téléchargement.
- **Musiques** : fichiers audio, écoutables et téléchargeables
- **Photos** : galerie des photos de la chorale (les mêmes défilent en carrousel sur l'accueil)

Toute la gestion (ajout, modification, suppression de chants/partitions/musiques/photos) se fait dans l'espace **Administration**, réservé aux administrateur·rice·s.

**Limite à connaître** : le code d'accès empêche un visiteur normal de voir le lien de téléchargement d'une partition protégée, mais ce n'est pas un chiffrement du fichier lui-même — une fois le lien obtenu (après avoir entré le bon code), rien n'empêche techniquement de le repartager. C'est un frein raisonnable pour un usage entre membres de confiance, pas une protection absolue.

### Page visiteurs (sans connexion)

La page `visiteurs.html` (lien "Visiteurs" dans le menu) est accessible sans créer de compte. Elle affiche :

- Un texte de présentation et les coordonnées de contact (modifiables dans `admin/infos.html`)
- Toutes les photos, toutes les musiques et toutes les partitions **non protégées**
- Les partitions protégées apparaissent aussi dans la liste, mais restent verrouillées derrière le code d'accès, même pour un visiteur

Le reste du site (chants classés par partie de messe, choristes, activités, prestations, bureau) reste réservé aux membres connectés.
