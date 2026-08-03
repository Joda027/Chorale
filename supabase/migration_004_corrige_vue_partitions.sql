-- Corrige l'avertissement de sécurité Supabase sur la vue partitions_publiques
-- (« Security Definer View ») en la remplaçant par une fonction équivalente.
-- Le comportement pour les utilisateurs du site ne change pas : cette fonction
-- masque toujours le fichier des partitions protégées, exactement comme le
-- faisait la vue.
-- À exécuter après migration_003_public.sql : SQL Editor > New query > coller > Run.

drop view if exists public.partitions_publiques;

create or replace function public.obtenir_partitions_publiques()
returns table (
  id uuid,
  chant_id uuid,
  titre text,
  protegee boolean,
  chemin_fichier text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    id,
    chant_id,
    titre,
    protegee,
    case when protegee then null else chemin_fichier end as chemin_fichier
  from public.partitions;
$$;

grant execute on function public.obtenir_partitions_publiques() to anon, authenticated;
