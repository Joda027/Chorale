const formulaire = document.getElementById("formulaire-musique");
const messageErreur = document.getElementById("message-erreur");
const boutonAjouter = document.getElementById("bouton-ajouter");

async function remplirListeChants() {
  const select = document.getElementById("musique-chant");
  const { data: chants } = await supabaseClient.from("chants").select("id, titre").order("titre");
  (chants || []).forEach((c) => {
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = c.titre;
    select.appendChild(option);
  });
}

async function chargerMusiques() {
  const corps = document.getElementById("corps-tableau-musiques");

  const { data: musiques, error } = await supabaseClient
    .from("musiques")
    .select("id, titre")
    .order("titre", { ascending: true });

  if (error) {
    corps.innerHTML = `<tr><td colspan="2">Erreur de chargement.</td></tr>`;
    console.error(error);
    return;
  }

  if (!musiques || musiques.length === 0) {
    corps.innerHTML = `<tr><td colspan="2">Aucune musique enregistrée.</td></tr>`;
    return;
  }

  corps.innerHTML = musiques
    .map(
      (m) => `
        <tr>
          <td>${m.titre}</td>
          <td><button class="bouton-danger" data-id="${m.id}" data-action="supprimer">Supprimer</button></td>
        </tr>`,
    )
    .join("");

  corps.querySelectorAll('[data-action="supprimer"]').forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Supprimer cette musique ?")) return;
      const { error: erreurSuppr } = await supabaseClient.from("musiques").delete().eq("id", btn.dataset.id);
      if (erreurSuppr) {
        alert("Erreur lors de la suppression : " + erreurSuppr.message);
        return;
      }
      chargerMusiques();
    });
  });
}

formulaire.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageErreur.hidden = true;
  boutonAjouter.disabled = true;
  boutonAjouter.textContent = "Envoi en cours...";

  const titre = document.getElementById("musique-titre").value;
  const chantId = document.getElementById("musique-chant").value || null;
  const fichier = document.getElementById("musique-fichier").files[0];

  try {
    const chemin = `${Date.now()}-${fichier.name}`;
    const { error: erreurUpload } = await supabaseClient.storage.from("musiques").upload(chemin, fichier);
    if (erreurUpload) throw erreurUpload;

    const { data: urlPublique } = supabaseClient.storage.from("musiques").getPublicUrl(chemin);

    const { error: erreurInsert } = await supabaseClient.from("musiques").insert({
      titre,
      chant_id: chantId,
      chemin_fichier: urlPublique.publicUrl,
    });
    if (erreurInsert) throw erreurInsert;

    formulaire.reset();
    chargerMusiques();
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
  chargerMusiques();
}

initialiser();
