async function fetchUserData() {
  try {
    const response = await fetch('/.auth/me');
    const data = await response.json();

    const authSection = document.getElementById('auth-section');
    if (data && data.clientPrincipal) {
      const userDetails = data.clientPrincipal.userDetails;

      // Afficher un message de bienvenue
      authSection.innerHTML = `<p>Bonjour, ${userDetails}!</p>`;

      // Appeler les différentes données disponibles via Microsoft Graph
      const userInfo = await fetchGraphData(data.clientPrincipal.accessToken, "https://graph.microsoft.com/v1.0/me");
      const groups = await fetchGraphData(data.clientPrincipal.accessToken, "https://graph.microsoft.com/v1.0/me/memberOf");
      const photo = await fetchGraphPhoto(data.clientPrincipal.accessToken);

      // Afficher les informations utilisateur
      authSection.innerHTML += `<h2>Informations utilisateur :</h2>`;
      authSection.innerHTML += `<pre>${JSON.stringify(userInfo, null, 2)}</pre>`;

      // Afficher les groupes
      if (groups.value && groups.value.length > 0) {
        authSection.innerHTML += `<h2>Groupes :</h2>`;
        authSection.innerHTML += `<ul>${groups.value.map(group => `<li>${group.displayName}</li>`).join("")}</ul>`;
      } else {
        authSection.innerHTML += `<p>Aucun groupe trouvé.</p>`;
      }

      // Afficher la photo de profil (si disponible)
      if (photo) {
        const img = document.createElement("img");
        img.src = photo;
        img.alt = "Photo de profil";
        img.style.width = "100px";
        authSection.appendChild(img);
      }
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données utilisateur :", error);
  }
}

async function fetchGraphData(accessToken, endpoint) {
  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de la récupération des données depuis ${endpoint} :`, error);
    return {};
  }
}

async function fetchGraphPhoto(accessToken) {
  try {
    const response = await fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    if (response.ok) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération de la photo :", error);
    return null;
  }
}

// Vérifier les données utilisateur au chargement de la page
window.onload = fetchUserData;
