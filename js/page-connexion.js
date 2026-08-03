const formulaire = document.getElementById("formulaire-connexion");
const messageErreur = document.getElementById("message-erreur");
const boutonConnexion = document.getElementById("bouton-connexion");

formulaire.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageErreur.hidden = true;
  boutonConnexion.disabled = true;
  boutonConnexion.textContent = "Connexion...";

  const email = document.getElementById("email").value;
  const motDePasse = document.getElementById("mot-de-passe").value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password: motDePasse,
  });

  if (error) {
    messageErreur.textContent = "Identifiants incorrects.";
    messageErreur.hidden = false;
    boutonConnexion.disabled = false;
    boutonConnexion.textContent = "Se connecter";
    return;
  }

  const params = new URLSearchParams(window.location.search);
  window.location.href = params.get("retour") || "/index.html";
});
