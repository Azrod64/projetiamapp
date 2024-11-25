async function fetchUserData() {
  try {
    const response = await fetch('/.auth/me');
    const data = await response.json();

    const authSection = document.getElementById('auth-section');
    if (data && data.clientPrincipal) {
      const userDetails = data.clientPrincipal.userDetails;

      // Message de bienvenue
      authSection.innerHTML = `<p>Bonjour, ${userDetails}!</p>`;

      // Récupérer les groupes depuis l'API Graph
      const groups = await fetchUserGroups(data.clientPrincipal.accessToken);

      // Afficher les groupes
      if (groups.length > 0) {
        authSection.innerHTML += `<p>Vos groupes : ${groups.join(', ')}</p>`;
      } else {
        authSection.innerHTML += `<p>Aucun groupe trouvé.</p>`;
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur :', error);
  }
}

async function fetchUserGroups(accessToken) {
  try {
    const response = await fetch('https://graph.microsoft.com/v1.0/me/memberOf', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const data = await response.json();

    // Extraire les noms des groupes
    if (data.value && data.value.length > 0) {
      return data.value.map(group => group.displayName);
    }
    return [];
  } catch (error) {
    console.error('Erreur lors de la récupération des groupes :', error);
    return [];
  }
}

window.onload = fetchUserData;
