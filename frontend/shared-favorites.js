// Chargement partagé des favoris sur TOUTES les pages (sidebar accessible partout)
(function () {
  window.userFavorites = window.userFavorites || [];

  function getApiBase() {
    if (!window.APP_CONFIG || !window.APP_CONFIG.API_BASE) return "";
    return String(window.APP_CONFIG.API_BASE).replace(/\/+$/, "");
  }

  function getAuthHeaders() {
    var token = String(localStorage.getItem("userToken") || "").trim();
    var headers = { "Content-Type": "application/json" };
    if (token) {
      headers.Authorization = "Bearer " + token;
    }
    return headers;
  }

  async function loadUserFavoritesShared() {
    try {
      var apiBase = getApiBase();
      var token = String(localStorage.getItem("userToken") || "").trim();
      if (!apiBase || !token) return;

      var response = await fetch(apiBase + "/user/favorites", {
        method: "GET",
        headers: getAuthHeaders()
      });
      var data = await response.json();
      if (data.success && Array.isArray(data.favorites)) {
        window.userFavorites = data.favorites;
        try {
          window.dispatchEvent(new CustomEvent('app:favorites-changed', { detail: { favorites: window.userFavorites } }));
        } catch (e) {}
      }
    } catch (err) {
      console.error("Erreur chargement favoris partagé:", err);
    }
  }

  // Charger les favoris au chargement de la page
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadUserFavoritesShared);
  } else {
    loadUserFavoritesShared();
  }

  // Rendre la fonction disponible globalement pour rafraîchir
  window.loadUserFavoritesShared = loadUserFavoritesShared;
})();
