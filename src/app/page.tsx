import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Accueil() {
  const [prochainesPrestations, chantsCount, membresCount] =
    await Promise.all([
      prisma.prestation.findMany({
        where: { date: { gte: new Date() } },
        orderBy: { date: "asc" },
        take: 3,
      }),
      prisma.chant.count(),
      prisma.membre.count({ where: { statut: "ACTIF" } }),
    ]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-10">
      <section>
        <h1 className="text-3xl font-semibold">Chorale Saint Patrick</h1>
        <p className="text-gray-600 mt-1">
          Paroisse Saint-Cyprien — Archidiocèse de Conakry
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Choristes actifs</p>
          <p className="text-2xl font-semibold">{membresCount}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Chants au répertoire</p>
          <p className="text-2xl font-semibold">{chantsCount}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Prestations à venir</p>
          <p className="text-2xl font-semibold">
            {prochainesPrestations.length}
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Prochaines prestations</h2>
        {prochainesPrestations.length === 0 ? (
          <p className="text-gray-500">Aucune prestation programmée.</p>
        ) : (
          <ul className="space-y-2">
            {prochainesPrestations.map((prestation) => (
              <li
                key={prestation.id}
                className="rounded-lg border border-gray-200 p-4 flex justify-between"
              >
                <span className="font-medium">{prestation.titre}</span>
                <span className="text-gray-500">
                  {prestation.date.toLocaleDateString("fr-FR")}
                </span>
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/prestations"
          className="inline-block mt-3 text-sky-700 hover:underline"
        >
          Voir toutes les prestations →
        </Link>
      </section>
    </main>
  );
}
