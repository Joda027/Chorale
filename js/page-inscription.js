const formulaire = document.getElementById("formulaire-inscription");
const messageErreur = document.getElementById("message-erreur");
const messageInfo = document.getElementById("message-info");
const boutonInscription = document.getElementById("bouton-inscription");

formulaire.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageErreur.hidden = true;
  messageInfo.hidden = true;
  boutonInscription.disabled = true;
  boutonInscription.textContent = "Création...";

  const prenom = document.getElementById("prenom").value;
  const nom = document.getElementById("nom").value;
  const email = document.getElementById("email").value;
  const motDePasse = document.getElementById("mot-de-passe").value;

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password: motDePasse,
    options: { data: { prenom, nom } },
  });

  boutonInscription.disabled = false;
  boutonInscription.textContent = "Créer mon compte";

  if (error) {
    messageErreur.textContent = error.message;
    messageErreur.hidden = false;
    return;
  }

  if (data.session) {
    window.location.href = "/index.html";
    return;
  }

  messageInfo.textContent =
    "Compte créé. Vérifiez votre boîte mail pour confirmer votre adresse avant de vous connecter.";
  messageInfo.hidden = false;
  formulaire.reset();
});
