const LABELS_PUPITRE = {
  SOPRANO: "Soprano",
  ALTO: "Alto",
  TENOR: "Ténor",
  BASSE: "Basse",
};

const LABELS_ROLE = {
  ADMIN: "Administrateur·rice",
  CHORISTE: "Choriste",
  MAITRE_CHOEUR: "Maître de chœur",
  PRESIDENT: "Président·e",
  SECRETAIRE_GENERAL: "Secrétaire général·e",
  TRESORIER: "Trésorier·ère",
  CHARGE_ORGANISATION: "Chargé·e d'organisation",
  CHARGE_SPIRITUEL: "Chargé·e spirituel·le",
  CHARGE_DISCIPLINE: "Chargé·e de discipline",
};

async function chargerChoristes() {
  const conteneur = document.getElementById("groupes-pupitres");

  const { data: membres, error } = await supabaseClient
    .from("profils")
    .select("id, prenom, nom, pupitre, roles_membres(role, date_fin)")
    .eq("statut", "ACTIF")
    .order("nom", { ascending: true });

  if (error) {
    conteneur.innerHTML = `<p class="etat-vide">Erreur de chargement des choristes.</p>`;
    console.error(error);
    return;
  }

  if (!membres || membres.length === 0) {
    conteneur.innerHTML = `<p class="etat-vide">Aucun choriste enregistré.</p>`;
    return;
  }

  const parPupitre = {};
  for (const membre of membres) {
    const cle = membre.pupitre ?? "SANS_PUPITRE";
    parPupitre[cle] = parPupitre[cle] || [];
    parPupitre[cle].push(membre);
  }

  conteneur.innerHTML = Object.entries(parPupitre)
    .map(([pupitre, membresGroupe]) => {
      const items = membresGroupe
        .map((membre) => {
          const roles = (membre.roles_membres || []).filter((r) => !r.date_fin);
          const badges = roles
            .map(
              (r) =>
                `<span class="badge ${r.role === "ADMIN" ? "badge-admin" : "badge-gris"}">${LABELS_ROLE[r.role] ?? r.role}</span>`,
            )
            .join("");
          return `
            <li class="carte carte-ligne">
              <span>${membre.prenom} ${membre.nom}</span>
              <div class="badge-groupe">${badges}</div>
            </li>`;
        })
        .join("");

      return `
        <section>
          <h2 class="groupe-pupitre-titre">${LABELS_PUPITRE[pupitre] ?? "Sans pupitre assigné"}</h2>
          <ul class="liste-serree">${items}</ul>
        </section>`;
    })
    .join("");
}

chargerChoristes();
