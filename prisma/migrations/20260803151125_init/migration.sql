-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CHORISTE', 'MAITRE_CHOEUR', 'PRESIDENT', 'SECRETAIRE_GENERAL', 'TRESORIER', 'CHARGE_ORGANISATION', 'CHARGE_SPIRITUEL', 'CHARGE_DISCIPLINE');

-- CreateEnum
CREATE TYPE "Pupitre" AS ENUM ('SOPRANO', 'ALTO', 'TENOR', 'BASSE');

-- CreateEnum
CREATE TYPE "StatutMembre" AS ENUM ('ACTIF', 'INACTIF');

-- CreateEnum
CREATE TYPE "TypeActivite" AS ENUM ('REPETITION', 'RETRAITE', 'FORMATION', 'AUTRE');

-- CreateEnum
CREATE TYPE "TypeEvenement" AS ENUM ('MESSE', 'MARIAGE', 'FUNERAILLES', 'CONCERT', 'AUTRE');

-- CreateEnum
CREATE TYPE "TypeDocument" AS ENUM ('PV_REUNION', 'COMPTE_RENDU', 'COURRIER', 'AUTRE');

-- CreateEnum
CREATE TYPE "StatutAction" AS ENUM ('A_FAIRE', 'EN_COURS', 'TERMINE', 'ANNULE');

-- CreateEnum
CREATE TYPE "TypeTransaction" AS ENUM ('RECETTE', 'DEPENSE');

-- CreateTable
CREATE TABLE "Membre" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "motDePasse" TEXT NOT NULL,
    "photoUrl" TEXT,
    "pupitre" "Pupitre",
    "statut" "StatutMembre" NOT NULL DEFAULT 'ACTIF',
    "dateAdhesion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembreRole" (
    "id" TEXT NOT NULL,
    "membreId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateFin" TIMESTAMP(3),

    CONSTRAINT "MembreRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chant" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "compositeur" TEXT,
    "pupitreCible" "Pupitre",
    "tonalite" TEXT,
    "niveauDifficulte" TEXT,
    "partitionUrl" TEXT,
    "audioUrl" TEXT,
    "paroles" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activite" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "type" "TypeActivite" NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3),
    "lieu" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prestation" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "typeEvenement" "TypeEvenement" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "lieu" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prestation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrestationChant" (
    "id" TEXT NOT NULL,
    "prestationId" TEXT NOT NULL,
    "chantId" TEXT NOT NULL,
    "ordre" INTEGER,

    CONSTRAINT "PrestationChant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Presence" (
    "id" TEXT NOT NULL,
    "membreId" TEXT NOT NULL,
    "activiteId" TEXT,
    "prestationId" TEXT,
    "present" BOOLEAN NOT NULL DEFAULT true,
    "remarque" TEXT,

    CONSTRAINT "Presence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "type" "TypeDocument" NOT NULL,
    "fichierUrl" TEXT NOT NULL,
    "dateDocument" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadeParId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanAction" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "objectif" TEXT,
    "dateEcheance" TIMESTAMP(3),
    "statut" "StatutAction" NOT NULL DEFAULT 'A_FAIRE',
    "responsableId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "type" "TypeTransaction" NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "categorie" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creeParId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChantToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ChantToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Membre_email_key" ON "Membre"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MembreRole_membreId_role_dateDebut_key" ON "MembreRole"("membreId", "role", "dateDebut");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_nom_key" ON "Tag"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "PrestationChant_prestationId_chantId_key" ON "PrestationChant"("prestationId", "chantId");

-- CreateIndex
CREATE UNIQUE INDEX "Presence_membreId_activiteId_prestationId_key" ON "Presence"("membreId", "activiteId", "prestationId");

-- CreateIndex
CREATE INDEX "_ChantToTag_B_index" ON "_ChantToTag"("B");

-- AddForeignKey
ALTER TABLE "MembreRole" ADD CONSTRAINT "MembreRole_membreId_fkey" FOREIGN KEY ("membreId") REFERENCES "Membre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrestationChant" ADD CONSTRAINT "PrestationChant_prestationId_fkey" FOREIGN KEY ("prestationId") REFERENCES "Prestation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrestationChant" ADD CONSTRAINT "PrestationChant_chantId_fkey" FOREIGN KEY ("chantId") REFERENCES "Chant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presence" ADD CONSTRAINT "Presence_membreId_fkey" FOREIGN KEY ("membreId") REFERENCES "Membre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presence" ADD CONSTRAINT "Presence_activiteId_fkey" FOREIGN KEY ("activiteId") REFERENCES "Activite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presence" ADD CONSTRAINT "Presence_prestationId_fkey" FOREIGN KEY ("prestationId") REFERENCES "Prestation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploadeParId_fkey" FOREIGN KEY ("uploadeParId") REFERENCES "Membre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanAction" ADD CONSTRAINT "PlanAction_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "Membre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_creeParId_fkey" FOREIGN KEY ("creeParId") REFERENCES "Membre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChantToTag" ADD CONSTRAINT "_ChantToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Chant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChantToTag" ADD CONSTRAINT "_ChantToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

