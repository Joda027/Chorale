import Link from "next/link";

export default function BureauPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Espace bureau</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/bureau/archives"
          className="rounded-lg border border-gray-200 p-4 hover:border-sky-400"
        >
          <p className="font-medium">Archives</p>
          <p className="text-sm text-gray-500">
            PV de réunions, comptes-rendus, courriers
          </p>
        </Link>
        <Link
          href="/bureau/plan-action"
          className="rounded-lg border border-gray-200 p-4 hover:border-sky-400"
        >
          <p className="font-medium">Plan d&apos;action</p>
          <p className="text-sm text-gray-500">
            Objectifs, échéances et responsables
          </p>
        </Link>
      </div>
    </main>
  );
}
