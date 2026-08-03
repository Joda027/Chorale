const LABELS_TYPE = {
  PV_REUNION: "PV de réunion",
  COMPTE_RENDU: "Compte-rendu",
  COURRIER: "Courrier",
  AUTRE: "Autre",
};

async function chargerArchives() {
  const acces = await exigerBureau();
  if (!acces) return;

  const liste = document.getElementById("liste-documents");

  const { data: documents, error } = await supabaseClient
    .from("documents")
    .select("id, titre, type, fichier_url, date_document, uploade_par:profils(prenom, nom)")
    .order("date_document", { ascending: false });

  if (error) {
    liste.innerHTML = `<p class="etat-vide">Erreur de chargement des archives.</p>`;
    console.error(error);
    return;
  }

  if (!documents || documents.length === 0) {
    liste.innerHTML = `<p class="etat-vide">Aucun document archivé.</p>`;
    return;
  }

  liste.innerHTML = documents
    .map(
      (doc) => `
        <li class="carte carte-ligne">
          <div>
            <a href="${doc.fichier_url}" class="carte-titre lien-texte">${doc.titre}</a>
            <p class="carte-info">
              ${LABELS_TYPE[doc.type] ?? doc.type} — déposé par ${doc.uploade_par?.prenom ?? ""} ${doc.uploade_par?.nom ?? ""}
            </p>
          </div>
          <span class="carte-info">${new Date(doc.date_document).toLocaleDateString("fr-FR")}</span>
        </li>`,
    )
    .join("");
}

chargerArchives();
