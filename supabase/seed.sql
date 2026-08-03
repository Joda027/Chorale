-- Données de démonstration (répertoire, activités, prestations).
-- À exécuter après schema.sql : Supabase > SQL Editor > New query > coller > Run.
-- N'inclut pas de comptes membres : créez votre compte via la page /inscription.html
-- du site, puis rendez-vous admin avec la requête donnée dans le README.

insert into public.chants (id, titre, compositeur, pupitre_cible, tonalite) values
  ('11111111-1111-1111-1111-111111111111', 'Venez, Divin Messie', 'Traditionnel', 'SOPRANO', 'Ré majeur'),
  ('22222222-2222-2222-2222-222222222222', 'Alléluia Pascal', 'Frère Pierre', 'TENOR', null);

insert into public.tags (id, nom) values
  ('33333333-3333-3333-3333-333333333333', 'Noël');

insert into public.chants_tags (chant_id, tag_id) values
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333');

insert into public.activites (titre, type, date_debut, lieu, description) values
  ('Répétition générale', 'REPETITION', now(), 'Salle paroissiale Saint-Cyprien', 'Préparation de la messe dominicale.');

insert into public.prestations (id, titre, type_evenement, date, lieu) values
  ('44444444-4444-4444-4444-444444444444', 'Messe dominicale', 'MESSE', now() + interval '10 days', 'Paroisse Saint-Cyprien');

insert into public.prestations_chants (prestation_id, chant_id, ordre) values
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 1),
  ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 2);
