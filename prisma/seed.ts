import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const motDePasseHash = await bcrypt.hash("chorale2026", 10);

  const president = await prisma.membre.upsert({
    where: { email: "presidente@choralesaintpatrick.gn" },
    update: {},
    create: {
      nom: "Camara",
      prenom: "Aissatou",
      email: "presidente@choralesaintpatrick.gn",
      motDePasse: motDePasseHash,
      pupitre: "SOPRANO",
      roles: { create: [{ role: "PRESIDENT" }, { role: "CHORISTE" }] },
    },
  });

  const maitreChoeur = await prisma.membre.upsert({
    where: { email: "maitre@choralesaintpatrick.gn" },
    update: {},
    create: {
      nom: "Bangoura",
      prenom: "Jean",
      email: "maitre@choralesaintpatrick.gn",
      motDePasse: motDePasseHash,
      pupitre: "TENOR",
      roles: { create: [{ role: "MAITRE_CHOEUR" }] },
    },
  });

  await prisma.membre.upsert({
    where: { email: "choriste@choralesaintpatrick.gn" },
    update: {},
    create: {
      nom: "Diallo",
      prenom: "Marie",
      email: "choriste@choralesaintpatrick.gn",
      motDePasse: motDePasseHash,
      pupitre: "ALTO",
      roles: { create: [{ role: "CHORISTE" }] },
    },
  });

  const tagNoel = await prisma.tag.upsert({
    where: { nom: "Noël" },
    update: {},
    create: { nom: "Noël" },
  });

  const chant1 = await prisma.chant.create({
    data: {
      titre: "Venez, Divin Messie",
      compositeur: "Traditionnel",
      pupitreCible: "SOPRANO",
      tonalite: "Ré majeur",
      tags: { connect: [{ id: tagNoel.id }] },
    },
  });

  const chant2 = await prisma.chant.create({
    data: {
      titre: "Alléluia Pascal",
      compositeur: "Frère Pierre",
      pupitreCible: "TENOR",
    },
  });

  await prisma.activite.create({
    data: {
      titre: "Répétition générale",
      type: "REPETITION",
      dateDebut: new Date(),
      lieu: "Salle paroissiale Saint-Cyprien",
      description: "Préparation de la messe dominicale.",
    },
  });

  const dansDixJours = new Date();
  dansDixJours.setDate(dansDixJours.getDate() + 10);

  await prisma.prestation.create({
    data: {
      titre: "Messe dominicale",
      typeEvenement: "MESSE",
      date: dansDixJours,
      lieu: "Paroisse Saint-Cyprien",
      chants: {
        create: [
          { chantId: chant1.id, ordre: 1 },
          { chantId: chant2.id, ordre: 2 },
        ],
      },
    },
  });

  await prisma.document.create({
    data: {
      titre: "PV réunion du bureau — Janvier 2026",
      type: "PV_REUNION",
      fichierUrl: "#",
      uploadeParId: president.id,
    },
  });

  await prisma.planAction.create({
    data: {
      titre: "Organiser la retraite spirituelle annuelle",
      description: "Prévoir le lieu, le budget et l'intervenant.",
      statut: "EN_COURS",
      responsableId: maitreChoeur.id,
      dateEcheance: dansDixJours,
    },
  });

  console.log("Données de démonstration créées.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
