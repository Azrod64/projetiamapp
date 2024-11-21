async function fetchUserData() {
    try {
      const response = await fetch('/.auth/me');
      const data = await response.json();
  
      const authSection = document.getElementById('auth-section');
      if (data && data.clientPrincipal) {
        const claims = data.clientPrincipal.claims;
  
        // Extraire les informations prénom et nom
        const surnameClaim = claims.find(claim => claim.typ === "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname");
        const givenNameClaim = claims.find(claim => claim.typ === "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname");
  
        const surname = surnameClaim ? surnameClaim.val : "Unknown";
        const givenName = givenNameClaim ? givenNameClaim.val : "Unknown";
  
        // Remplacer le bouton Login par "Bonjour <Prénom> <Nom>"
        authSection.innerHTML = `<span>Bonjour ${givenName} ${surname}!</span>`;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
  
  // Vérifier l'état de connexion au chargement de la page
  window.onload = fetchUserData;
  