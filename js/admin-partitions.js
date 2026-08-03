const formulaire = document.getElementById("formulaire-partition");
const messageErreur = document.getElementById("message-erreur");
const boutonAjouter = document.getElementById("bouton-ajouter");

async function remplirListeChants() {
  const select = document.getElementById("partition-chant");
  const { data: chants } = await supabaseClient.from("chants").select("id, titre").order("titre");
  (chants || []).forEach((c) => {
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = c.titre;
    select.appendChild(option);
  });
}

async function chargerPartitions() {
  const corps = document.getElementById("corps-tableau-partitions");

  const { data: partitions, error } = await supabaseClient
    .from("partitions")
    .select("id, titre, protegee, code_acces")
    .order("titre", { ascending: true });

  if (error) {
    corps.innerHTML = `<tr><td colspan="4">Erreur de chargement.</td></tr>`;
    console.error(error);
    return;
  }

  if (!partitions || partitions.length === 0) {
    corps.innerHTML = `<tr><td colspan="4">Aucune partition enregistrée.</td></tr>`;
    return;
  }

  corps.innerHTML = partitions
    .map(
      (p) => `
        <tr>
          <td>${p.titre}</td>
          <td>${p.protegee ? "Protégée" : "Libre"}</td>
          <td>${p.protegee ? `<strong>${p.code_acces}</strong>` : "—"}</td>
          <td>
            <button class="bouton-danger" data-id="${p.id}" data-action="supprimer">Supprimer</button>
          </td>
        </tr>`,
    )
    .join("");

  corps.querySelectorAll('[data-action="supprimer"]').forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Supprimer cette partition ?")) return;
      const { error: erreurSuppr } = await supabaseClient.from("partitions").delete().eq("id", btn.dataset.id);
      if (erreurSuppr) {
        alert("Erreur lors de la suppression : " + erreurSuppr.message);
        return;
      }
      chargerPartitions();
    });
  });
}

formulaire.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageErreur.hidden = true;
  boutonAjouter.disabled = true;
  boutonAjouter.textContent = "Envoi en cours...";

  const titre = document.getElementById("partition-titre").value;
  const chantId = document.getElementById("partition-chant").value || null;
  const protegee = document.getElementById("partition-protegee").checked;
  const fichier = document.getElementById("partition-fichier").files[0];

  try {
    const chemin = `${Date.now()}-${fichier.name}`;
    const { error: erreurUpload } = await supabaseClient.storage.from("partitions").upload(chemin, fichier);
    if (erreurUpload) throw erreurUpload;

    const { data: urlPublique } = supabaseClient.storage.from("partitions").getPublicUrl(chemin);

    const { error: erreurInsert } = await supabaseClient.from("partitions").insert({
      titre,
      chant_id: chantId,
      chemin_fichier: urlPublique.publicUrl,
      protegee,
    });
    if (erreurInsert) throw erreurInsert;

    formulaire.reset();
    chargerPartitions();
  } catch (err) {
    messageErreur.textContent = err.message;
    messageErreur.hidden = false;
  } finally {
    boutonAjouter.disabled = false;
    boutonAjouter.textContent = "Ajouter";
  }
});

async function initialiser() {
  const acces = await exigerAdmin();
  if (!acces) return;
  remplirListeChants();
  chargerPartitions();
}

initialiser();
