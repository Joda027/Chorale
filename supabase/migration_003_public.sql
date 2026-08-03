-- Page visiteurs (accessible sans connexion) : informations publiques
-- (présentation, contact) + accès public aux photos, musiques et
-- partitions non protégées.
-- À exécuter après migration_002_repertoire.sql : SQL Editor > New query > coller > Run.
-- (Ce script peut être relancé sans risque.)

create table if not exists public.infos_publiques (
  id smallint primary key default 1 check (id = 1),
  texte_presentation text,
  contact_email text,
  contact_telephone text,
  adresse text,
  updated_at timestamptz not null default now()
);

insert into public.infos_publiques (id, texte_presentation)
values (1, 'Bienvenue sur le site de la Chorale Saint Patrick, Paroisse Saint-Cyprien, Archidiocèse de Conakry.')
on conflict (id) do nothing;

alter table public.infos_publiques enable row level security;

drop policy if exists "infos_publiques_select" on public.infos_publiques;
create policy "infos_publiques_select" on public.infos_publiques
  for select to anon, authenticated using (true);

drop policy if exists "infos_publiques_gestion_admin" on public.infos_publiques;
create policy "infos_publiques_gestion_admin" on public.infos_publiques
  for all to authenticated
  using (public.est_admin((select auth.uid()))) with check (public.est_admin((select auth.uid())));

-- Ouvre l'accès en lecture (photos, musiques) aux visiteurs non connectés,
-- en plus des membres.

drop policy if exists "photos_select" on public.photos;
create policy "photos_select" on public.photos
  for select to anon, authenticated using (true);

drop policy if exists "musiques_select" on public.musiques;
create policy "musiques_select" on public.musiques
  for select to anon, authenticated using (true);

-- L'accès des visiteurs aux partitions non protégées passe par la fonction
-- obtenir_partitions_publiques (voir migration_004), pas par une table directe.

-- S'assure que les visiteurs non connectés peuvent aussi vérifier un code de partition
grant execute on function public.verifier_code_partition(uuid, text) to anon, authenticated;
