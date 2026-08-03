-- Schéma de la base de données Chorale Saint Patrick.
-- À exécuter dans Supabase : Dashboard > SQL Editor > New query > coller > Run.
-- (à faire une seule fois, avant d'utiliser le site)

-- Extension nécessaire pour gen_random_uuid()
create extension if not exists pgcrypto;

-- ===== Tables =====

create table public.profils (
  id uuid primary key references auth.users (id) on delete cascade,
  nom text not null,
  prenom text not null,
  telephone text,
  photo_url text,
  pupitre text check (pupitre in ('SOPRANO', 'ALTO', 'TENOR', 'BASSE')),
  statut text not null default 'ACTIF' check (statut in ('ACTIF', 'INACTIF')),
  date_adhesion timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roles_membres (
  id uuid primary key default gen_random_uuid(),
  profil_id uuid not null references public.profils (id) on delete cascade,
  role text not null check (
    role in (
      'ADMIN', 'CHORISTE', 'MAITRE_CHOEUR', 'PRESIDENT', 'SECRETAIRE_GENERAL',
      'TRESORIER', 'CHARGE_ORGANISATION', 'CHARGE_SPIRITUEL', 'CHARGE_DISCIPLINE'
    )
  ),
  date_debut timestamptz not null default now(),
  date_fin timestamptz
);

create table public.chants (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  compositeur text,
  pupitre_cible text check (pupitre_cible in ('SOPRANO', 'ALTO', 'TENOR', 'BASSE')),
  tonalite text,
  niveau_difficulte text,
  partition_url text,
  audio_url text,
  paroles text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  nom text not null unique
);

create table public.chants_tags (
  chant_id uuid not null references public.chants (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (chant_id, tag_id)
);

create table public.activites (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  type text not null check (type in ('REPETITION', 'RETRAITE', 'FORMATION', 'AUTRE')),
  date_debut timestamptz not null,
  date_fin timestamptz,
  lieu text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.prestations (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  type_evenement text not null check (
    type_evenement in ('MESSE', 'MARIAGE', 'FUNERAILLES', 'CONCERT', 'AUTRE')
  ),
  date timestamptz not null,
  lieu text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.prestations_chants (
  id uuid primary key default gen_random_uuid(),
  prestation_id uuid not null references public.prestations (id) on delete cascade,
  chant_id uuid not null references public.chants (id) on delete cascade,
  ordre int,
  unique (prestation_id, chant_id)
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  type text not null check (type in ('PV_REUNION', 'COMPTE_RENDU', 'COURRIER', 'AUTRE')),
  fichier_url text not null,
  date_document timestamptz not null default now(),
  uploade_par uuid not null references public.profils (id),
  created_at timestamptz not null default now()
);

create table public.plan_action (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  description text,
  objectif text,
  date_echeance timestamptz,
  statut text not null default 'A_FAIRE' check (
    statut in ('A_FAIRE', 'EN_COURS', 'TERMINE', 'ANNULE')
  ),
  responsable uuid references public.profils (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ===== Fonctions utilitaires pour les rôles =====

create or replace function public.est_admin(p_uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.roles_membres
    where profil_id = p_uid and role = 'ADMIN' and date_fin is null
  );
$$;

create or replace function public.est_membre_bureau(p_uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.est_admin(p_uid) or exists (
    select 1 from public.roles_membres
    where profil_id = p_uid
      and date_fin is null
      and role in (
        'PRESIDENT', 'SECRETAIRE_GENERAL', 'TRESORIER',
        'CHARGE_ORGANISATION', 'CHARGE_SPIRITUEL', 'CHARGE_DISCIPLINE'
      )
  );
$$;

-- ===== Création automatique du profil à l'inscription =====

create or replace function public.gerer_nouvel_utilisateur()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profils (id, nom, prenom)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nom', ''),
    coalesce(new.raw_user_meta_data ->> 'prenom', '')
  );

  insert into public.roles_membres (profil_id, role)
  values (new.id, 'CHORISTE');

  return new;
end;
$$;

create trigger sur_nouvel_utilisateur
  after insert on auth.users
  for each row execute function public.gerer_nouvel_utilisateur();

-- ===== Sécurité (Row Level Security) =====

alter table public.profils enable row level security;
alter table public.roles_membres enable row level security;
alter table public.chants enable row level security;
alter table public.tags enable row level security;
alter table public.chants_tags enable row level security;
alter table public.activites enable row level security;
alter table public.prestations enable row level security;
alter table public.prestations_chants enable row level security;
alter table public.documents enable row level security;
alter table public.plan_action enable row level security;

-- profils : lecture pour tout membre connecté, modification de son propre profil ou par un admin
create policy "profils_select" on public.profils
  for select to authenticated using (true);

create policy "profils_update" on public.profils
  for update to authenticated
  using (id = auth.uid() or public.est_admin(auth.uid()));

create policy "profils_update_admin_insert" on public.profils
  for insert to authenticated
  with check (public.est_admin(auth.uid()));

create policy "profils_delete_admin" on public.profils
  for delete to authenticated
  using (public.est_admin(auth.uid()));

-- roles_membres : lecture pour tout membre connecté, gestion réservée aux admins
create policy "roles_membres_select" on public.roles_membres
  for select to authenticated using (true);

create policy "roles_membres_gestion" on public.roles_membres
  for all to authenticated
  using (public.est_admin(auth.uid()))
  with check (public.est_admin(auth.uid()));

-- Contenu du répertoire / activités / prestations : lecture pour tout membre connecté,
-- écriture réservée aux admins (à ouvrir plus tard aux maîtres de chœur si besoin)
create policy "chants_select" on public.chants for select to authenticated using (true);
create policy "chants_gestion" on public.chants for all to authenticated
  using (public.est_admin(auth.uid())) with check (public.est_admin(auth.uid()));

create policy "tags_select" on public.tags for select to authenticated using (true);
create policy "tags_gestion" on public.tags for all to authenticated
  using (public.est_admin(auth.uid())) with check (public.est_admin(auth.uid()));

create policy "chants_tags_select" on public.chants_tags for select to authenticated using (true);
create policy "chants_tags_gestion" on public.chants_tags for all to authenticated
  using (public.est_admin(auth.uid())) with check (public.est_admin(auth.uid()));

create policy "activites_select" on public.activites for select to authenticated using (true);
create policy "activites_gestion" on public.activites for all to authenticated
  using (public.est_admin(auth.uid())) with check (public.est_admin(auth.uid()));

create policy "prestations_select" on public.prestations for select to authenticated using (true);
create policy "prestations_gestion" on public.prestations for all to authenticated
  using (public.est_admin(auth.uid())) with check (public.est_admin(auth.uid()));

create policy "prestations_chants_select" on public.prestations_chants for select to authenticated using (true);
create policy "prestations_chants_gestion" on public.prestations_chants for all to authenticated
  using (public.est_admin(auth.uid())) with check (public.est_admin(auth.uid()));

-- Archives et plan d'action : réservés aux membres du bureau (et admins)
create policy "documents_select_bureau" on public.documents
  for select to authenticated using (public.est_membre_bureau(auth.uid()));

create policy "documents_gestion_admin" on public.documents
  for all to authenticated
  using (public.est_admin(auth.uid())) with check (public.est_admin(auth.uid()));

create policy "plan_action_select_bureau" on public.plan_action
  for select to authenticated using (public.est_membre_bureau(auth.uid()));

create policy "plan_action_gestion_admin" on public.plan_action
  for all to authenticated
  using (public.est_admin(auth.uid())) with check (public.est_admin(auth.uid()));
