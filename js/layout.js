const ROLES_BUREAU = [
  "PRESIDENT",
  "SECRETAIRE_GENERAL",
  "TRESORIER",
  "CHARGE_ORGANISATION",
  "CHARGE_SPIRITUEL",
  "CHARGE_DISCIPLINE",
];

function estAdmin(roles) {
  return roles.includes("ADMIN");
}

function estMembreDuBureau(roles) {
  return estAdmin(roles) || roles.some((r) => ROLES_BUREAU.includes(r));
}

async function chargerRolesUtilisateur(userId) {
  const { data, error } = await supabaseClient
    .from("roles_membres")
    .select("role")
    .eq("profil_id", userId)
    .is("date_fin", null);

  if (error) {
    console.error("Erreur chargement des rôles :", error);
    return [];
  }
  return data.map((r) => r.role);
}

const LIENS_NAV = [
  { href: "/index.html", label: "Accueil" },
  { href: "/visiteurs.html", label: "Visiteurs" },
  { href: "/repertoire.html", label: "Répertoire" },
  { href: "/choristes.html", label: "Choristes" },
  { href: "/activites.html", label: "Activités" },
  { href: "/prestations.html", label: "Prestations" },
];

async function initEntete() {
  const conteneur = document.getElementById("entete");
  if (!conteneur) return;

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  let nomAffiche = "";
  let roles = [];

  if (session) {
    const { data: profil } = await supabaseClient
      .from("profils")
      .select("prenom, nom")
      .eq("id", session.user.id)
      .single();
    nomAffiche = profil ? `${profil.prenom} ${profil.nom}` : session.user.email;
    roles = await chargerRolesUtilisateur(session.user.id);
  }

  const liens = [...LIENS_NAV];
  if (estMembreDuBureau(roles)) {
    liens.push({ href: "/bureau/index.html", label: "Bureau" });
  }
  if (estAdmin(roles)) {
    liens.push({ href: "/admin/index.html", label: "Administration" });
  }

  const navHtml = liens
    .map((l) => `<a href="${l.href}">${l.label}</a>`)
    .join("");

  const compteHtml = session
    ? `<div class="barre-laterale-compte-connecte">
         <span class="barre-laterale-nom">${nomAffiche}</span>
         <button id="bouton-deconnexion" class="lien-deconnexion">Se déconnecter</button>
       </div>`
    : `<a href="/connexion.html" class="lien-deconnexion">Se connecter</a>`;

  conteneur.innerHTML = `
    <a href="/index.html" class="barre-laterale-marque">
      <img src="/public/logo.png" alt="Logo de la Chorale Saint Patrick" class="barre-laterale-logo" />
      <span class="barre-laterale-titre">Chorale Saint Patrick</span>
    </a>
    <nav class="barre-laterale-nav">${navHtml}</nav>
    <div class="barre-laterale-compte">${compteHtml}</div>
  `;

  const boutonDeconnexion = document.getElementById("bouton-deconnexion");
  if (boutonDeconnexion) {
    boutonDeconnexion.addEventListener("click", async () => {
      await supabaseClient.auth.signOut();
      window.location.href = "/connexion.html";
    });
  }
}

async function exigerConnexion() {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (!session) {
    const retour = encodeURIComponent(window.location.pathname);
    window.location.href = `/connexion.html?retour=${retour}`;
    return null;
  }
  return session;
}

async function exigerBureau() {
  const session = await exigerConnexion();
  if (!session) return null;

  const roles = await chargerRolesUtilisateur(session.user.id);
  if (!estMembreDuBureau(roles)) {
    window.location.href = "/index.html";
    return null;
  }
  return { session, roles };
}

async function exigerAdmin() {
  const session = await exigerConnexion();
  if (!session) return null;

  const roles = await chargerRolesUtilisateur(session.user.id);
  if (!estAdmin(roles)) {
    window.location.href = "/index.html";
    return null;
  }
  return { session, roles };
}

document.addEventListener("DOMContentLoaded", initEntete);
