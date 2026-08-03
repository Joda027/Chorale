-- Extension du répertoire : chants classés par partie de la messe,
-- partitions (protégées par code) et musiques (audio) téléchargeables,
-- photos de la chorale pour le carrousel de l'accueil.
-- À exécuter dans Supabase : SQL Editor > New query > coller > Run.
-- (à faire une seule fois, après schema.sql)

-- ===== Chants : classement par partie de la messe =====

alter table public.chants
  add column if not exists partie_messe text check (
    partie_messe in (
      'ENTREE', 'KYRIE', 'GLOIRE', 'PSAUME', 'ACCLAMATION',
      'OFFERTOIRE', 'SANCTUS', 'AGNEAU', 'COMMUNION', 'SORTIE', 'AUTRE'
    )
  );

-- ===== Partitions (protégées par code d'accès) =====

create table public.partitions (
  id uuid primary key default gen_random_uuid(),
  chant_id uuid references public.chants (id) on delete set null,
  titre text not null,
  chemin_fichier text not null,
  protegee boolean not null default false,
  code_acces text,
  created_at timestamptz not null default now()
);

-- Vue publique : masque le fichier des partitions protégées tant que le code n'a pas été vérifié
create view public.partitions_publiques as
  select
    id,
    chant_id,
    titre,
    protegee,
    case when protegee then null else chemin_fichier end as chemin_fichier
  from public.partitions;

-- Génère un code à 6 chiffres quand une partition passe en "protégée"
create or replace function public.generer_code_partition()
returns trigger
language plpgsql
as $$
begin
  if new.protegee and (new.code_acces is null or new.code_acces = '') then
    new.code_acces := lpad(floor(random() * 1000000)::text, 6, '0');
  end if;
  if not new.protegee then
    new.code_acces := null;
  end if;
  return new;
end;
$$;

create trigger avant_ecriture_partition
  before insert or update on public.partitions
  for each row execute function public.generer_code_partition();

-- Vérifie un code et renvoie le chemin du fichier si correct
create or replace function public.verifier_code_partition(p_id uuid, p_code text)
returns text
language sql
security definer
set search_path = public
as $$
  select chemin_fichier from public.partitions
  where id = p_id and protegee and code_acces = p_code;
$$;

-- ===== Musiques (audio) =====

create table public.musiques (
  id uuid primary key default gen_random_uuid(),
  chant_id uuid references public.chants (id) on delete set null,
  titre text not null,
  chemin_fichier text not null,
  created_at timestamptz not null default now()
);

-- ===== Photos de la chorale (carrousel accueil) =====

create table public.photos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  legende text,
  ordre int not null default 0,
  created_at timestamptz not null default now()
);

-- ===== Sécurité (RLS) =====

alter table public.partitions enable row level security;
alter table public.musiques enable row level security;
alter table public.photos enable row level security;

-- La table partitions elle-même (avec le fichier et le code en clair) n'est
-- lisible que par les admins ; tout le monde passe par la vue partitions_publiques
-- ou par verifier_code_partition().
create policy "partitions_select_admin" on public.partitions
  for select to authenticated using (public.est_admin(auth.uid()));

create policy "partitions_gestion_admin" on public.partitions
  for all to authenticated
  using (public.est_admin(auth.uid())) with check (public.est_admin(auth.uid()));

create policy "musiques_select" on public.musiques
  for select to authenticated using (true);

create policy "musiques_gestion_admin" on public.musiques
  for all to authenticated
  using (public.est_admin(auth.uid())) with check (public.est_admin(auth.uid()));

create policy "photos_select" on public.photos
  for select to authenticated using (true);

create policy "photos_gestion_admin" on public.photos
  for all to authenticated
  using (public.est_admin(auth.uid())) with check (public.est_admin(auth.uid()));

grant select on public.partitions_publiques to authenticated;

-- ===== Stockage des fichiers (buckets publics, écriture réservée aux admins) =====

insert into storage.buckets (id, name, public)
values ('partitions', 'partitions', true), ('musiques', 'musiques', true), ('photos', 'photos', true)
on conflict (id) do nothing;

create policy "stockage_lecture_admin" on storage.objects
  for select to authenticated using (
    bucket_id in ('partitions', 'musiques', 'photos') and public.est_admin(auth.uid())
  );

create policy "stockage_ecriture_admin" on storage.objects
  for insert to authenticated with check (
    bucket_id in ('partitions', 'musiques', 'photos') and public.est_admin(auth.uid())
  );

create policy "stockage_modification_admin" on storage.objects
  for update to authenticated using (
    bucket_id in ('partitions', 'musiques', 'photos') and public.est_admin(auth.uid())
  );

create policy "stockage_suppression_admin" on storage.objects
  for delete to authenticated using (
    bucket_id in ('partitions', 'musiques', 'photos') and public.est_admin(auth.uid())
  );
