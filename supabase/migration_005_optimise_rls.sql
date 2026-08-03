-- Corrige l'avertissement de performance Supabase (« Auth RLS Initialization
-- Plan ») : remplace auth.uid() par (select auth.uid()) dans toutes les
-- règles de sécurité, pour qu'il soit calculé une seule fois par requête
-- plutôt qu'une fois par ligne.
-- Aucun changement de comportement pour les utilisateurs du site.
-- À exécuter après migration_004_corrige_vue_partitions.sql :
-- SQL Editor > New query > coller > Run.

-- ===== profils =====

drop policy if exists "profils_update" on public.profils;
create policy "profils_update" on public.profils
  for update to authenticated
  using (id = (select auth.uid()) or public.est_admin((select auth.uid())));

drop policy if exists "profils_update_admin_insert" on public.profils;
create policy "profils_update_admin_insert" on public.profils
  for insert to authenticated
  with check (public.est_admin((select auth.uid())));

drop policy if exists "profils_delete_admin" on public.profils;
create policy "profils_delete_admin" on public.profils
  for delete to authenticated
  using (public.est_admin((select auth.uid())));

-- ===== roles_membres =====

drop policy if exists "roles_membres_gestion" on public.roles_membres;
create policy "roles_membres_gestion" on public.roles_membres
  for all to authenticated
  using (public.est_admin((select auth.uid())))
  with check (public.est_admin((select auth.uid())));

-- ===== chants / tags / chants_tags / activites / prestations / prestations_chants =====

drop policy if exists "chants_gestion" on public.chants;
create policy "chants_gestion" on public.chants for all to authenticated
  using (public.est_admin((select auth.uid()))) with check (public.est_admin((select auth.uid())));

drop policy if exists "tags_gestion" on public.tags;
create policy "tags_gestion" on public.tags for all to authenticated
  using (public.est_admin((select auth.uid()))) with check (public.est_admin((select auth.uid())));

drop policy if exists "chants_tags_gestion" on public.chants_tags;
create policy "chants_tags_gestion" on public.chants_tags for all to authenticated
  using (public.est_admin((select auth.uid()))) with check (public.est_admin((select auth.uid())));

drop policy if exists "activites_gestion" on public.activites;
create policy "activites_gestion" on public.activites for all to authenticated
  using (public.est_admin((select auth.uid()))) with check (public.est_admin((select auth.uid())));

drop policy if exists "prestations_gestion" on public.prestations;
create policy "prestations_gestion" on public.prestations for all to authenticated
  using (public.est_admin((select auth.uid()))) with check (public.est_admin((select auth.uid())));

drop policy if exists "prestations_chants_gestion" on public.prestations_chants;
create policy "prestations_chants_gestion" on public.prestations_chants for all to authenticated
  using (public.est_admin((select auth.uid()))) with check (public.est_admin((select auth.uid())));

-- ===== documents / plan_action (bureau) =====

drop policy if exists "documents_select_bureau" on public.documents;
create policy "documents_select_bureau" on public.documents
  for select to authenticated using (public.est_membre_bureau((select auth.uid())));

drop policy if exists "documents_gestion_admin" on public.documents;
create policy "documents_gestion_admin" on public.documents
  for all to authenticated
  using (public.est_admin((select auth.uid()))) with check (public.est_admin((select auth.uid())));

drop policy if exists "plan_action_select_bureau" on public.plan_action;
create policy "plan_action_select_bureau" on public.plan_action
  for select to authenticated using (public.est_membre_bureau((select auth.uid())));

drop policy if exists "plan_action_gestion_admin" on public.plan_action;
create policy "plan_action_gestion_admin" on public.plan_action
  for all to authenticated
  using (public.est_admin((select auth.uid()))) with check (public.est_admin((select auth.uid())));

-- ===== partitions / musiques / photos =====

drop policy if exists "partitions_select_admin" on public.partitions;
create policy "partitions_select_admin" on public.partitions
  for select to authenticated using (public.est_admin((select auth.uid())));

drop policy if exists "partitions_gestion_admin" on public.partitions;
create policy "partitions_gestion_admin" on public.partitions
  for all to authenticated
  using (public.est_admin((select auth.uid()))) with check (public.est_admin((select auth.uid())));

drop policy if exists "musiques_gestion_admin" on public.musiques;
create policy "musiques_gestion_admin" on public.musiques
  for all to authenticated
  using (public.est_admin((select auth.uid()))) with check (public.est_admin((select auth.uid())));

drop policy if exists "photos_gestion_admin" on public.photos;
create policy "photos_gestion_admin" on public.photos
  for all to authenticated
  using (public.est_admin((select auth.uid()))) with check (public.est_admin((select auth.uid())));

-- ===== stockage (storage.objects) =====

drop policy if exists "stockage_lecture_admin" on storage.objects;
create policy "stockage_lecture_admin" on storage.objects
  for select to authenticated using (
    bucket_id in ('partitions', 'musiques', 'photos') and public.est_admin((select auth.uid()))
  );

drop policy if exists "stockage_ecriture_admin" on storage.objects;
create policy "stockage_ecriture_admin" on storage.objects
  for insert to authenticated with check (
    bucket_id in ('partitions', 'musiques', 'photos') and public.est_admin((select auth.uid()))
  );

drop policy if exists "stockage_modification_admin" on storage.objects;
create policy "stockage_modification_admin" on storage.objects
  for update to authenticated using (
    bucket_id in ('partitions', 'musiques', 'photos') and public.est_admin((select auth.uid()))
  );

drop policy if exists "stockage_suppression_admin" on storage.objects;
create policy "stockage_suppression_admin" on storage.objects
  for delete to authenticated using (
    bucket_id in ('partitions', 'musiques', 'photos') and public.est_admin((select auth.uid()))
  );

-- ===== infos_publiques =====

drop policy if exists "infos_publiques_gestion_admin" on public.infos_publiques;
create policy "infos_publiques_gestion_admin" on public.infos_publiques
  for all to authenticated
  using (public.est_admin((select auth.uid()))) with check (public.est_admin((select auth.uid())));
