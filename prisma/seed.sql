-- Données de démonstration pour la Chorale Saint Patrick.
-- À exécuter dans Supabase : Dashboard > SQL Editor > New query > coller > Run
-- (à faire une seule fois, après avoir appliqué la migration dans prisma/migrations/)
--
-- Comptes créés (mot de passe pour tous : chorale2026) :
--   presidente@choralesaintpatrick.gn   (Présidente + Administratrice)
--   admin2@choralesaintpatrick.gn       (Administratrice)
--   admin3@choralesaintpatrick.gn       (Administrateur)
--   maitre@choralesaintpatrick.gn       (Maître de chœur)
--   choriste@choralesaintpatrick.gn     (Choriste)

INSERT INTO public."Activite" (id, titre, type, "dateDebut", "dateFin", lieu, description, "createdAt", "updatedAt") VALUES ('cmsddbqdq000fig7dt7p7bbbd', 'Répétition générale', 'REPETITION', '2026-08-03 15:12:38.22', NULL, 'Salle paroissiale Saint-Cyprien', 'Préparation de la messe dominicale.', '2026-08-03 15:12:38.222', '2026-08-03 15:12:38.222');

INSERT INTO public."Chant" (id, titre, compositeur, "pupitreCible", tonalite, "niveauDifficulte", "partitionUrl", "audioUrl", paroles, "createdAt", "updatedAt") VALUES ('cmsddbqdg000dig7da8sydjvd', 'Venez, Divin Messie', 'Traditionnel', 'SOPRANO', 'Ré majeur', NULL, NULL, NULL, NULL, '2026-08-03 15:12:38.212', '2026-08-03 15:12:38.212');
INSERT INTO public."Chant" (id, titre, compositeur, "pupitreCible", tonalite, "niveauDifficulte", "partitionUrl", "audioUrl", paroles, "createdAt", "updatedAt") VALUES ('cmsddbqdm000eig7dxhi2dctl', 'Alléluia Pascal', 'Frère Pierre', 'TENOR', NULL, NULL, NULL, NULL, NULL, '2026-08-03 15:12:38.218', '2026-08-03 15:12:38.218');

INSERT INTO public."Membre" (id, nom, prenom, email, telephone, "motDePasse", "photoUrl", pupitre, statut, "dateAdhesion", "createdAt", "updatedAt") VALUES ('cmsddbqag0000ig7d65vka7v6', 'Camara', 'Aissatou', 'presidente@choralesaintpatrick.gn', NULL, '$2b$10$656Kvd5/0yQXpPjB62P6Pe6cYMyWJsJAK8TCDABpe2u.P5MXmPhey', NULL, 'SOPRANO', 'ACTIF', '2026-08-03 15:12:38.104', '2026-08-03 15:12:38.104', '2026-08-03 15:12:38.104');
INSERT INTO public."Membre" (id, nom, prenom, email, telephone, "motDePasse", "photoUrl", pupitre, statut, "dateAdhesion", "createdAt", "updatedAt") VALUES ('cmsddbqbk0004ig7d6kqqdxde', 'Sylla', 'Fatoumata', 'admin2@choralesaintpatrick.gn', NULL, '$2b$10$656Kvd5/0yQXpPjB62P6Pe6cYMyWJsJAK8TCDABpe2u.P5MXmPhey', NULL, NULL, 'ACTIF', '2026-08-03 15:12:38.144', '2026-08-03 15:12:38.144', '2026-08-03 15:12:38.144');
INSERT INTO public."Membre" (id, nom, prenom, email, telephone, "motDePasse", "photoUrl", pupitre, statut, "dateAdhesion", "createdAt", "updatedAt") VALUES ('cmsddbqci0006ig7d64c0bu8t', 'Keita', 'Ibrahima', 'admin3@choralesaintpatrick.gn', NULL, '$2b$10$656Kvd5/0yQXpPjB62P6Pe6cYMyWJsJAK8TCDABpe2u.P5MXmPhey', NULL, NULL, 'ACTIF', '2026-08-03 15:12:38.178', '2026-08-03 15:12:38.178', '2026-08-03 15:12:38.178');
INSERT INTO public."Membre" (id, nom, prenom, email, telephone, "motDePasse", "photoUrl", pupitre, statut, "dateAdhesion", "createdAt", "updatedAt") VALUES ('cmsddbqcv0008ig7dv6kwz3yc', 'Bangoura', 'Jean', 'maitre@choralesaintpatrick.gn', NULL, '$2b$10$656Kvd5/0yQXpPjB62P6Pe6cYMyWJsJAK8TCDABpe2u.P5MXmPhey', NULL, 'TENOR', 'ACTIF', '2026-08-03 15:12:38.191', '2026-08-03 15:12:38.191', '2026-08-03 15:12:38.191');
INSERT INTO public."Membre" (id, nom, prenom, email, telephone, "motDePasse", "photoUrl", pupitre, statut, "dateAdhesion", "createdAt", "updatedAt") VALUES ('cmsddbqd1000aig7ddxdsd4of', 'Diallo', 'Marie', 'choriste@choralesaintpatrick.gn', NULL, '$2b$10$656Kvd5/0yQXpPjB62P6Pe6cYMyWJsJAK8TCDABpe2u.P5MXmPhey', NULL, 'ALTO', 'ACTIF', '2026-08-03 15:12:38.197', '2026-08-03 15:12:38.197', '2026-08-03 15:12:38.197');

INSERT INTO public."Document" (id, titre, type, "fichierUrl", "dateDocument", "uploadeParId", "createdAt") VALUES ('cmsddbqe3000jig7d32d38j2f', 'PV réunion du bureau — Janvier 2026', 'PV_REUNION', '#', '2026-08-03 15:12:38.235', 'cmsddbqag0000ig7d65vka7v6', '2026-08-03 15:12:38.235');

INSERT INTO public."MembreRole" (id, "membreId", role, "dateDebut", "dateFin") VALUES ('cmsddbqaj0001ig7d4t55e7td', 'cmsddbqag0000ig7d65vka7v6', 'ADMIN', '2026-08-03 15:12:38.104', NULL);
INSERT INTO public."MembreRole" (id, "membreId", role, "dateDebut", "dateFin") VALUES ('cmsddbqaj0002ig7dmtg4widw', 'cmsddbqag0000ig7d65vka7v6', 'PRESIDENT', '2026-08-03 15:12:38.104', NULL);
INSERT INTO public."MembreRole" (id, "membreId", role, "dateDebut", "dateFin") VALUES ('cmsddbqaj0003ig7dsn0j9otb', 'cmsddbqag0000ig7d65vka7v6', 'CHORISTE', '2026-08-03 15:12:38.104', NULL);
INSERT INTO public."MembreRole" (id, "membreId", role, "dateDebut", "dateFin") VALUES ('cmsddbqbl0005ig7dbv1zkwxm', 'cmsddbqbk0004ig7d6kqqdxde', 'ADMIN', '2026-08-03 15:12:38.144', NULL);
INSERT INTO public."MembreRole" (id, "membreId", role, "dateDebut", "dateFin") VALUES ('cmsddbqcj0007ig7dysewaz38', 'cmsddbqci0006ig7d64c0bu8t', 'ADMIN', '2026-08-03 15:12:38.178', NULL);
INSERT INTO public."MembreRole" (id, "membreId", role, "dateDebut", "dateFin") VALUES ('cmsddbqcv0009ig7dqc6lyb5m', 'cmsddbqcv0008ig7dv6kwz3yc', 'MAITRE_CHOEUR', '2026-08-03 15:12:38.191', NULL);
INSERT INTO public."MembreRole" (id, "membreId", role, "dateDebut", "dateFin") VALUES ('cmsddbqd1000big7dz7qns2ik', 'cmsddbqd1000aig7ddxdsd4of', 'CHORISTE', '2026-08-03 15:12:38.197', NULL);

INSERT INTO public."PlanAction" (id, titre, description, objectif, "dateEcheance", statut, "responsableId", "createdAt", "updatedAt") VALUES ('cmsddbqe6000kig7df6ctxpcr', 'Organiser la retraite spirituelle annuelle', 'Prévoir le lieu, le budget et l''intervenant.', NULL, '2026-08-13 15:12:38.228', 'EN_COURS', 'cmsddbqcv0008ig7dv6kwz3yc', '2026-08-03 15:12:38.238', '2026-08-03 15:12:38.238');

INSERT INTO public."Prestation" (id, titre, "typeEvenement", date, lieu, description, "createdAt", "updatedAt") VALUES ('cmsddbqdy000gig7dhq33k9u0', 'Messe dominicale', 'MESSE', '2026-08-13 15:12:38.228', 'Paroisse Saint-Cyprien', NULL, '2026-08-03 15:12:38.23', '2026-08-03 15:12:38.23');

INSERT INTO public."PrestationChant" (id, "prestationId", "chantId", ordre) VALUES ('cmsddbqdz000hig7dpndxt5ap', 'cmsddbqdy000gig7dhq33k9u0', 'cmsddbqdg000dig7da8sydjvd', 1);
INSERT INTO public."PrestationChant" (id, "prestationId", "chantId", ordre) VALUES ('cmsddbqdz000iig7d82m6lyvn', 'cmsddbqdy000gig7dhq33k9u0', 'cmsddbqdm000eig7dxhi2dctl', 2);

INSERT INTO public."Tag" (id, nom) VALUES ('cmsddbqda000cig7d863hi43c', 'Noël');

INSERT INTO public."_ChantToTag" ("A", "B") VALUES ('cmsddbqdg000dig7da8sydjvd', 'cmsddbqda000cig7d863hi43c');
