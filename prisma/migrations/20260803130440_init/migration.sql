-- CreateTable
CREATE TABLE "Membre" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "motDePasse" TEXT NOT NULL,
    "photoUrl" TEXT,
    "pupitre" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'ACTIF',
    "dateAdhesion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MembreRole" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "membreId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "dateDebut" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateFin" DATETIME,
    CONSTRAINT "MembreRole_membreId_fkey" FOREIGN KEY ("membreId") REFERENCES "Membre" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Chant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titre" TEXT NOT NULL,
    "compositeur" TEXT,
    "pupitreCible" TEXT,
    "tonalite" TEXT,
    "niveauDifficulte" TEXT,
    "partitionUrl" TEXT,
    "audioUrl" TEXT,
    "paroles" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Activite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titre" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "dateDebut" DATETIME NOT NULL,
    "dateFin" DATETIME,
    "lieu" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Prestation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titre" TEXT NOT NULL,
    "typeEvenement" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "lieu" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PrestationChant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "prestationId" TEXT NOT NULL,
    "chantId" TEXT NOT NULL,
    "ordre" INTEGER,
    CONSTRAINT "PrestationChant_prestationId_fkey" FOREIGN KEY ("prestationId") REFERENCES "Prestation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PrestationChant_chantId_fkey" FOREIGN KEY ("chantId") REFERENCES "Chant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Presence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "membreId" TEXT NOT NULL,
    "activiteId" TEXT,
    "prestationId" TEXT,
    "present" BOOLEAN NOT NULL DEFAULT true,
    "remarque" TEXT,
    CONSTRAINT "Presence_membreId_fkey" FOREIGN KEY ("membreId") REFERENCES "Membre" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Presence_activiteId_fkey" FOREIGN KEY ("activiteId") REFERENCES "Activite" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Presence_prestationId_fkey" FOREIGN KEY ("prestationId") REFERENCES "Prestation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titre" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "fichierUrl" TEXT NOT NULL,
    "dateDocument" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadeParId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Document_uploadeParId_fkey" FOREIGN KEY ("uploadeParId") REFERENCES "Membre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlanAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "objectif" TEXT,
    "dateEcheance" DATETIME,
    "statut" TEXT NOT NULL DEFAULT 'A_FAIRE',
    "responsableId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PlanAction_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "Membre" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "montant" REAL NOT NULL,
    "description" TEXT,
    "categorie" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creeParId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_creeParId_fkey" FOREIGN KEY ("creeParId") REFERENCES "Membre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ChantToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ChantToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Chant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ChantToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
CREATE UNIQUE INDEX "_ChantToTag_AB_unique" ON "_ChantToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ChantToTag_B_index" ON "_ChantToTag"("B");
