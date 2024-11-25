async function fetchUserData() {
  try {
    const response = await fetch('/.auth/me');
    const data = await response.json();

    console.log("Données utilisateur :", data); // Vérifiez le contenu
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
