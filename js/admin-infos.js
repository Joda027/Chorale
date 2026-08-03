const formulaire = document.getElementById("formulaire-infos");
const messageErreur = document.getElementById("message-erreur");
const messageInfo = document.getElementById("message-info");
const boutonEnregistrer = document.getElementById("bouton-enregistrer");

async function chargerInfos() {
  const { data: infos, error } = await supabaseClient
    .from("infos_publiques")
    .select("texte_presentation, contact_email, contact_telephone, adresse")
    .eq("id", 1)
    .single();

  if (error || !infos) return;

  document.getElementById("texte-presentation").value = infos.texte_presentation ?? "";
  document.getElementById("contact-email").value = infos.contact_email ?? "";
  document.getElementById("contact-telephone").value = infos.contact_telephone ?? "";
  document.getElementById("adresse").value = infos.adresse ?? "";
}

formulaire.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageErreur.hidden = true;
  messageInfo.hidden = true;
  boutonEnregistrer.disabled = true;

  const valeurs = {
    texte_presentation: document.getElementById("texte-presentation").value || null,
    contact_email: document.getElementById("contact-email").value || null,
    contact_telephone: document.getElementById("contact-telephone").value || null,
    adresse: document.getElementById("adresse").value || null,
  };

  const { error } = await supabaseClient.from("infos_publiques").update(valeurs).eq("id", 1);

  boutonEnregistrer.disabled = false;

  if (error) {
    messageErreur.textContent = error.message;
    messageErreur.hidden = false;
    return;
  }

  messageInfo.textContent = "Enregistré.";
  messageInfo.hidden = false;
});

async function initialiser() {
  const acces = await exigerAdmin();
  if (!acces) return;
  chargerInfos();
}

initialiser();
