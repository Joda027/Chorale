import Link from "next/link";

export default function BureauPage() {
  return (
    <main className="page">
      <h1 className="page-title">Espace bureau</h1>
      <div className="grille-liens">
        <Link href="/bureau/archives" className="carte carte-lien">
          <p className="carte-titre">Archives</p>
          <p className="carte-info">
            PV de réunions, comptes-rendus, courriers
          </p>
        </Link>
        <Link href="/bureau/plan-action" className="carte carte-lien">
          <p className="carte-titre">Plan d&apos;action</p>
          <p className="carte-info">Objectifs, échéances et responsables</p>
        </Link>
      </div>
    </main>
  );
}
