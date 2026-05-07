(function () {
  function injectSidebarStyles() {
    if (document.getElementById("ib-sidebar-style")) {
      return;
    }

    var style = document.createElement("style");
    style.id = "ib-sidebar-style";
    style.textContent = ""
      + ".sidebar-profile-card{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px;padding:10px 12px;margin:12px 0 10px;border-radius:20px;text-decoration:none;color:#fff;background:linear-gradient(180deg,rgba(71,85,105,.42),rgba(30,41,59,.78));border:1px solid rgba(255,255,255,.16);box-shadow:0 12px 20px rgba(2,6,23,.18),inset 0 1px 0 rgba(255,255,255,.08);backdrop-filter:blur(12px);transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}"
      + ".sidebar-profile-card:hover{transform:translateY(-1px);border-color:rgba(255,255,255,.24);box-shadow:0 16px 26px rgba(2,6,23,.22),inset 0 1px 0 rgba(255,255,255,.1)}"
      + ".sidebar-profile-avatar{width:44px;height:44px;border-radius:999px;display:grid;place-items:center;background:linear-gradient(135deg,#8fd3ff,#60a5fa);color:#0f172a;font-size:15px;font-weight:900;box-shadow:inset 0 0 0 3px rgba(255,255,255,.22)}"
      + ".sidebar-profile-copy{display:grid;gap:2px;min-width:0}"
      + ".sidebar-profile-name{font-size:14px;font-weight:800;line-height:1.15;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}"
      + ".sidebar-profile-role{font-size:12px;font-weight:600;line-height:1.2;color:rgba(255,255,255,.8);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"
      + ".sidebar-profile-action{width:40px;height:40px;border-radius:14px;display:grid;place-items:center;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.9);font-size:14px}"
      + ".sidebar-profile-card:focus-visible{outline:2px solid rgba(125,211,252,.92);outline-offset:3px}"
      + ".sidebar-profile-compact .sidebar-profile-card{margin:12px 0 10px}"
      + "@media (max-width:1080px){.sidebar-profile-card{margin:12px 0 10px}}";
      ".ib-sidebar .sidebar-bottom{display:grid;gap:12px;}" +
      ".ib-sidebar .lang{background:rgba(255,255,255,0.08);padding:10px;border-radius:10px;}" +
      ".ib-sidebar .lang-title{margin-bottom:8px;font-size:13px;font-weight:700;}" +
      ".ib-sidebar #langSelect,.ib-sidebar .lang-select,.ib-sidebar .sidebar-lang{width:100%;background:rgba(17,24,39,0.9);color:#ffffff;border:1px solid rgba(255,255,255,0.25);border-radius:8px;padding:10px;font-size:12px;font-weight:700;}" +
      ".ib-sidebar[data-sidebar-role='user']{padding:20px !important;gap:14px !important;}" +
      ".ib-sidebar[data-sidebar-role='user'] .sidebar-logo,.ib-sidebar[data-sidebar-role='user'] .logo{margin-bottom:10px;}" +
      ".ib-sidebar[data-sidebar-role='user'] nav a,.ib-sidebar[data-sidebar-role='user'] #sideNav a,.ib-sidebar[data-sidebar-role='user'] .sidebar-nav a{padding:10px 12px !important;margin:5px 0 !important;font-size:15px !important;line-height:1.2 !important;}" +
      ".ib-sidebar[data-sidebar-role='user'] #openReportsOverlay{font-size:14px !important;}" +
      ".ib-sidebar[data-sidebar-role='user'] #openReportsOverlay span{white-space:nowrap !important;overflow:visible !important;text-overflow:clip !important;}" +
      ".ib-sidebar[data-sidebar-role='user'] .lang{padding:8px;}" +
      ".ib-sidebar[data-sidebar-role='user'] .lang-title{margin-bottom:6px;font-size:12px;}" +
      ".ib-sidebar[data-sidebar-role='user'] #langSelect,.ib-sidebar[data-sidebar-role='user'] .lang-select,.ib-sidebar[data-sidebar-role='user'] .sidebar-lang{padding:8px;font-size:11px;}" +
      ".ib-sidebar[data-sidebar-role='admin']{padding:22px !important;gap:18px !important;}" +
      ".ib-sidebar[data-sidebar-role='admin'] .sidebar-logo,.ib-sidebar[data-sidebar-role='admin'] .logo{margin-bottom:12px !important;}" +
      ".ib-sidebar[data-sidebar-role='admin'] nav a,.ib-sidebar[data-sidebar-role='admin'] #sideNav a,.ib-sidebar[data-sidebar-role='admin'] .sidebar-nav a{padding:11px 13px !important;margin:7px 0 !important;line-height:1.2 !important;}" +
      ".ib-sidebar[data-sidebar-role='admin'] .lang{padding:9px !important;}" +
      "@media (max-width:1080px){.ib-sidebar{position:static;width:100%;min-height:auto;}}";
    document.head.appendChild(style);
  }

  function detectRole(page) {
    var role = (localStorage.getItem("userRole") || "").toLowerCase();
    if (role === "admin" || role === "user") {
      return role;
    }

    var adminPages = ["index", "ajouter-objet", "objets", "localisations", "parametres", "notifications-admin"];
    var userPages = ["user", "mesobjet", "localisations-user", "parametres-user", "notifications-user"];

    if (adminPages.indexOf(page) >= 0 || page.indexOf("admin") >= 0) {
      return "admin";
    }
    if (userPages.indexOf(page) >= 0 || page.indexOf("user") >= 0) {
      return "user";
    }
    return "guest";
  }

  function markActiveLink(root, page) {
    var links = root.querySelectorAll("nav a[href]");
    for (var i = 0; i < links.length; i += 1) {
      var href = (links[i].getAttribute("href") || "").toLowerCase();
      var targetPage = href.split("#")[0].replace(".html", "");
      if (targetPage && targetPage === page) {
        links[i].classList.add("bg-emerald-700", "text-white", "shadow-lg", "nav-active", "active");
      }
    }
  }

  function activateLink(link, root) {
    if (!link) {
      return;
    }

    var links = root.querySelectorAll("nav a[href]");
    for (var i = 0; i < links.length; i += 1) {
      links[i].classList.remove("bg-emerald-700", "text-white", "shadow-lg", "nav-active", "active");
    }
    link.classList.add("bg-emerald-700", "text-white", "shadow-lg", "nav-active", "active");
  }

  function parseStoredArray(key) {
    try {
      var raw = localStorage.getItem(key);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function hasStoredValue(key) {
    try {
      return localStorage.getItem(key) !== null;
    } catch (e) {
      return false;
    }
  }

  function currentFavoritesUserId() {
    return String(localStorage.getItem("userId") || "").trim();
  }

  function scopedFavoritesKey(userId) {
    return "userFavorites:" + String(userId || "anonymous");
  }

  function favoriteIdFromItem(item) {
    if (!item || typeof item !== "object") {
      return "";
    }
    return String(item.id || item.object_id || item.code || "").trim();
  }

  function normalizeFavoriteItem(item) {
    var id = favoriteIdFromItem(item);
    if (!id) {
      return null;
    }

    var addedAt = String((item && (item.addedAt || item.added_at || item.date)) || "").trim();
    if (!addedAt) {
      addedAt = new Date().toISOString();
    }

    return {
      id: id,
      name: String((item && (item.name || item.nom || item.title)) || id).trim() || id,
      type: String((item && (item.type || item.category || item.categorie)) || "").trim(),
      location: String((item && (item.location || item.localisation || item.room || item.salle)) || "").trim(),
      status: String((item && (item.status || item.etat)) || "").trim(),
      details: String((item && (item.description || item.detail || item.details || item.note)) || "").trim(),
      addedAt: addedAt
    };
  }

  function normalizeFavoritesList(list) {
    var source = Array.isArray(list) ? list : [];
    var next = [];
    var seen = {};

    for (var i = 0; i < source.length; i += 1) {
      var item = normalizeFavoriteItem(source[i]);
      if (!item || seen[item.id]) {
        continue;
      }
      seen[item.id] = true;
      next.push(item);
    }

    return next;
  }

  function syncFavoritesCache(list) {
    var next = normalizeFavoritesList(list);
    var userId = currentFavoritesUserId();

    try {
      window.userFavorites = next;
    } catch (e) {
      // ignore
    }

    try {
      localStorage.setItem(scopedFavoritesKey(userId), JSON.stringify(next));
      localStorage.setItem("userFavorites", JSON.stringify(next));
      localStorage.setItem("userFavoritesOwner", userId || "anonymous");
    } catch (e) {
      // ignore
    }

    try {
      window.dispatchEvent(new CustomEvent("app:favorites-changed", { detail: { favorites: next } }));
    } catch (e) {
      // ignore
    }

    return next;
  }

  function readFavoritesCache() {
    var userId = currentFavoritesUserId();
    var scopedKey = scopedFavoritesKey(userId);

    if (hasStoredValue(scopedKey)) {
      return normalizeFavoritesList(parseStoredArray(scopedKey));
    }

    var ownerId = String(localStorage.getItem("userFavoritesOwner") || "").trim();
    if (!userId || ownerId === userId) {
      return normalizeFavoritesList(parseStoredArray("userFavorites"));
    }

    return [];
  }

  function resetLegacyFavoritesCacheForCurrentUser() {
    var userId = currentFavoritesUserId();
    if (!userId) {
      return;
    }

    var ownerId = String(localStorage.getItem("userFavoritesOwner") || "").trim();
    var scopedKey = scopedFavoritesKey(userId);

    try {
      if (!ownerId) {
        if (hasStoredValue(scopedKey)) {
          localStorage.setItem("userFavorites", JSON.stringify(parseStoredArray(scopedKey)));
        } else {
          localStorage.setItem("userFavorites", JSON.stringify([]));
        }
        localStorage.setItem("userFavoritesOwner", userId);
        return;
      }

      if (ownerId !== userId) {
        localStorage.setItem("userFavorites", JSON.stringify([]));
        localStorage.setItem("userFavoritesOwner", userId);
      }
    } catch (e) {
      // ignore
    }
  }

  function bindOverlayActiveBehavior(root) {
    var overlayIds = ["openHistoryOverlay", "openAdminReportsOverlay", "openFavoritesOverlay", "openReportsOverlay"];
    for (var i = 0; i < overlayIds.length; i += 1) {
      var trigger = root.querySelector("#" + overlayIds[i]);
      if (!trigger) {
        continue;
      }
      trigger.addEventListener("click", function () {
        activateLink(this, root);
      });
    }
  }

  function initUnifiedUserFavoritesOverlay(sidebarRoot) {
    if (window.__ibUnifiedFavoritesOverlayReady) {
      return;
    }
    window.__ibUnifiedFavoritesOverlayReady = true;
    resetLegacyFavoritesCacheForCurrentUser();

    try {
      if (!Array.isArray(window.userFavorites) || !window.userFavorites.length) {
        window.userFavorites = readFavoritesCache();
      }
    } catch (e) {
      // ignore
    }

    function esc(value) {
      return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function parseJson(key) {
      try {
        var raw = localStorage.getItem(key);
        var parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }

    function getApiBase() {
      if (!window.APP_CONFIG || !window.APP_CONFIG.API_BASE) {
        return "";
      }
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

    function notifyFavorites(message, type) {
      var safeMessage = String(message || "").trim() || "Impossible de retirer le favori.";
      if (typeof window.showAppToast === "function") {
        window.showAppToast(safeMessage, type || "error", "Favoris");
        return;
      }
      if (typeof window.showToast === "function") {
        window.showToast(safeMessage, type || "error");
        return;
      }
      window.alert(safeMessage);
    }

    function normalizeFavorite(item) {
      var base = normalizeFavoriteItem(item);
      if (!base) {
        return null;
      }
      var id = base.id;
      var name = base.name;
      var type = base.type || "Non specifie";
      var location = base.location || "Non specifie";
      var status = base.status || "Non specifie";
      var details = base.details || "Aucun detail disponible.";
      var addedAt = base.addedAt || null;
      var addedLabel = "-";
      if (addedAt) {
        var d = new Date(addedAt);
        if (!Number.isNaN(d.getTime())) {
          addedLabel = d.toLocaleDateString("fr-FR");
        }
      }
      return {
        id: id,
        name: name,
        type: type,
        location: location,
        status: status,
        details: details,
        addedLabel: addedLabel,
        raw: item || {}
      };
    }

    function getFavorites() {
      var list = [];
      try {
        if (window && Array.isArray(window.userFavorites)) {
          for (var i = 0; i < window.userFavorites.length; i += 1) {
            var normalizedWindowFavorite = normalizeFavorite(window.userFavorites[i]);
            if (normalizedWindowFavorite) {
              list.push(normalizedWindowFavorite);
            }
          }
          return list;
        }
      } catch (e) {
        // ignore
      }

      var source = readFavoritesCache();
      for (var j = 0; j < source.length; j += 1) {
        var normalizedSourceFavorite = normalizeFavorite(source[j]);
        if (normalizedSourceFavorite) {
          list.push(normalizedSourceFavorite);
        }
      }
      return list;
    }

    function removeFavoriteById(id) {
      // If the app exposes server-backed userFavorites, call backend API to remove
      var safeId = String(id || "").trim();
      if (!safeId) {
        return Promise.reject(new Error("ID de favori manquant"));
      }
      var token = String(localStorage.getItem("userToken") || "").trim();
      var apiBase = getApiBase();
      if (token && apiBase) {
        return fetch(apiBase + "/user/favorites/" + encodeURIComponent(safeId), {
          method: "DELETE",
          headers: getAuthHeaders()
        }).then(function (resp) {
          return resp.json().catch(function () { return {}; }).then(function (data) {
            if (!resp.ok || (data && data.success === false)) {
              var errorMessage = String((data && (data.detail || data.message)) || "Impossible de retirer le favori.");
              throw new Error(errorMessage);
            }
            return data;
          });
        }).then(function (data) {
          var next = [];
          if (data && Array.isArray(data.favorites)) {
            next = data.favorites;
          } else if (window && Array.isArray(window.userFavorites)) {
            next = window.userFavorites.filter(function (it) { return favoriteIdFromItem(it) !== safeId; });
          } else {
            var source = readFavoritesCache();
            for (var i = 0; i < source.length; i += 1) {
              var item = source[i] || {};
              var itemId = favoriteIdFromItem(item);
              if (itemId !== safeId) next.push(item);
            }
          }
          return syncFavoritesCache(next);
        });
      }

      var source = readFavoritesCache();
      var next = [];
      for (var i = 0; i < source.length; i += 1) {
        var item = source[i] || {};
        var itemId = favoriteIdFromItem(item);
        if (itemId !== safeId) {
          next.push(item);
        }
      }
      return Promise.resolve(syncFavoritesCache(next));
    }

    window.__ibFavoritesStore = {
      getFavorites: getFavorites,
      getFavoritesRaw: readFavoritesCache,
      setFavorites: syncFavoritesCache,
      removeFavoriteById: removeFavoriteById
    };

    function ensureStyle() {
      if (document.getElementById("ib-favorites-overlay-style")) {
        return;
      }
      var style = document.createElement("style");
      style.id = "ib-favorites-overlay-style";
      style.textContent =
        ".ib-fav-overlay{position:fixed;inset:0;z-index:2600;display:grid;place-items:center;}" +
        ".ib-fav-overlay[hidden]{display:none;}" +
        ".ib-fav-backdrop{position:absolute;inset:0;background:rgba(2,6,23,0.68);backdrop-filter:blur(4px);}" +
        ".ib-fav-panel{position:relative;width:min(760px,calc(100vw - 24px));max-height:calc(100vh - 42px);overflow:hidden;border-radius:14px;border:1px solid rgba(148,163,184,0.35);background:rgba(248,250,252,0.95);box-shadow:0 18px 36px rgba(2,6,23,0.35);}" +
        ".ib-fav-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border-bottom:1px solid #e2e8f0;background:rgba(241,245,249,0.9);color:#0f172a;}" +
        ".ib-fav-title{margin:0;font-size:16px;font-weight:800;}" +
        ".ib-fav-close{border:1px solid #cbd5e1;width:30px;height:30px;border-radius:999px;background:#fff;color:#0f172a;font-size:15px;cursor:pointer;}" +
        ".ib-fav-body{display:block;height:min(52vh,420px);overflow:auto;padding:8px 10px;background:rgba(248,250,252,0.92);}" +
        ".ib-fav-table{width:100%;border-collapse:collapse;}" +
        ".ib-fav-table thead th{text-align:left;padding:8px 10px;font-size:12px;font-weight:800;color:#0f172a;text-decoration:underline;text-underline-offset:3px;border-bottom:1px solid #e2e8f0;white-space:nowrap;}" +
        ".ib-fav-table tbody td{padding:8px 10px;font-size:12px;color:#0f172a;border-bottom:1px solid #f1f5f9;vertical-align:middle;}" +
        ".ib-fav-remove{border:1px solid #fecaca;background:#fff;color:#be123c;padding:6px 9px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;white-space:nowrap;}" +
        ".ib-fav-remove i{margin-right:6px;}" +
        ".ib-fav-empty{padding:20px;border:1px dashed #cbd5e1;border-radius:12px;color:#64748b;text-align:center;background:#fff;}" +
        "@media (max-width:900px){.ib-fav-panel{width:min(100vw - 12px,760px);} .ib-fav-body{height:min(56vh,430px);} .ib-fav-table thead th,.ib-fav-table tbody td{padding:7px 5px;font-size:11px;}}";
      document.head.appendChild(style);
    }

    function ensureOverlayShell() {
      var shell = document.getElementById("ibFavoritesOverlay");
      if (shell) {
        return shell;
      }
      ensureStyle();
      shell = document.createElement("div");
      shell.id = "ibFavoritesOverlay";
      shell.className = "ib-fav-overlay";
      shell.hidden = true;
      shell.innerHTML =
        '<div class="ib-fav-backdrop" id="ibFavBackdrop"></div>' +
        '<section class="ib-fav-panel" role="dialog" aria-modal="true" aria-labelledby="ibFavTitle">' +
          '<header class="ib-fav-head">' +
            '<div><h3 class="ib-fav-title" id="ibFavTitle">Mes favoris</h3></div>' +
            '<button type="button" class="ib-fav-close" id="ibFavClose" aria-label="Fermer">x</button>' +
          '</header>' +
          '<div class="ib-fav-body" id="ibFavList"></div>' +
        '</section>';
      document.body.appendChild(shell);

      function closeOverlay() {
        shell.hidden = true;
        document.body.style.overflow = "";
      }
      document.getElementById("ibFavBackdrop").addEventListener("click", closeOverlay);
      document.getElementById("ibFavClose").addEventListener("click", closeOverlay);
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !shell.hidden) {
          closeOverlay();
        }
      });

      return shell;
    }

    function renderFavoritesOverlay() {
      var listRoot = document.getElementById("ibFavList");
      if (!listRoot) {
        return;
      }

      var favorites = getFavorites();
      if (!favorites.length) {
        listRoot.innerHTML = '<div class="ib-fav-empty">Aucun favori pour le moment.</div>';
        return;
      }

      var rows = "";
      for (var i = 0; i < favorites.length; i += 1) {
        var fav = favorites[i];
        rows +=
          '<tr>' +
            '<td>' + esc(fav.name) + '</td>' +
            '<td>' + esc(fav.type) + '</td>' +
            '<td>' + esc(fav.location) + '</td>' +
            '<td>' + esc(fav.addedLabel) + '</td>' +
            '<td><button type="button" class="ib-fav-remove" data-fav-remove="' + esc(fav.id) + '"><i class="fas fa-heart-crack"></i>Retirer</button></td>' +
          '</tr>';
      }
      listRoot.innerHTML =
        '<table class="ib-fav-table">' +
          '<thead><tr><th>Nom</th><th>Type</th><th>Localisation</th><th>Date d\'ajout</th><th>Retirer des favoris</th></tr></thead>' +
          '<tbody>' + rows + '</tbody>' +
        '</table>';
    }

    function openFavoritesOverlay() {
      var shell = ensureOverlayShell();
      renderFavoritesOverlay();
      shell.hidden = false;
      document.body.style.overflow = "hidden";
    }

    function handleFavoritesTrigger(event, trigger) {
      event.preventDefault();
      event.stopPropagation();
      if (event.stopImmediatePropagation) {
        event.stopImmediatePropagation();
      }
      activateLink(trigger, sidebarRoot);
      openFavoritesOverlay();
    }

    var directTrigger = sidebarRoot.querySelector("#openFavoritesOverlay");
    if (directTrigger) {
      directTrigger.onclick = function (event) {
        handleFavoritesTrigger(event, directTrigger);
      };
      directTrigger.addEventListener("click", function (event) {
        handleFavoritesTrigger(event, directTrigger);
      }, true);
    }

    document.addEventListener("click", function (event) {
      var removeBtn = event.target.closest("[data-fav-remove]");
      if (removeBtn) {
        event.preventDefault();
        event.stopPropagation();
        if (event.stopImmediatePropagation) {
          event.stopImmediatePropagation();
        }

        var removeId = String(removeBtn.getAttribute("data-fav-remove") || "");
        removeFavoriteById(removeId).then(function () {
          renderFavoritesOverlay();
        }).catch(function (err) {
          console.error("Erreur suppression favori:", err);
          notifyFavorites(err && err.message ? err.message : "Impossible de retirer le favori.", "error");
        });
        return;
      }

      var favTrigger = event.target.closest("#openFavoritesOverlay");
      if (!favTrigger) {
        return;
      }
      handleFavoritesTrigger(event, favTrigger);
    }, true);
  }

  function initUnifiedUserReportsOverlay(sidebarRoot) {
    if (window.__ibUnifiedReportsOverlayReady) {
      return;
    }
    window.__ibUnifiedReportsOverlayReady = true;

    function esc(value) {
      return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function parseJson(key) {
      try {
        var raw = localStorage.getItem(key);
        var parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }

    function writeJson(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }

    function getReporterInfo() {
      var displayName = String(localStorage.getItem("userDisplayName") || "").trim();
      var email = String(localStorage.getItem("userEmail") || "").trim();
      var userId = String(localStorage.getItem("userId") || "").trim();
      var fallbackName = email ? email.split("@")[0] : "Utilisateur";
      return {
        reporterName: displayName || fallbackName,
        reporterEmail: email,
        reporterId: userId
      };
    }

    function notify(message, type, title) {
      if (typeof window.showAppToast === "function") {
        window.showAppToast(message, type || "info", title || "Signalement");
        return;
      }
      if (typeof window.showToast === "function") {
        window.showToast(message, type || "info");
        return;
      }
      window.alert(message);
    }

    var reportThingOptionsCache = [];
    var reportThingOptionsPromise = null;
    var reportThingOptionsLoadedAt = 0;
    var reportComposerState = {
      selectedThingId: ""
    };

    function getApiBase() {
      if (!window.APP_CONFIG || !window.APP_CONFIG.API_BASE) {
        return "";
      }
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

    function toFiniteNumber(value) {
      var parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    function getReportSearchPayload() {
      return {
        search_query: "",
        user_room: String(localStorage.getItem("user_room") || "").trim(),
        user_x: toFiniteNumber(localStorage.getItem("user_x")),
        user_y: toFiniteNumber(localStorage.getItem("user_y")),
        user_z: toFiniteNumber(localStorage.getItem("user_z"))
      };
    }

    function getThingLocationLabel(location) {
      if (location && typeof location === "object") {
        return String(location.room || location.name || "").trim();
      }
      return String(location || "").trim();
    }

    function normalizeThingType(value) {
      return String(value || "").trim() || "Non specifie";
    }

    function extractSelectableThings(items) {
      var list = Array.isArray(items) ? items : [];
      var seen = {};
      var options = [];

      for (var i = 0; i < list.length; i += 1) {
        var item = list[i] || {};
        var id = String(item.id || item._id || "").trim();
        if (!id || seen[id]) {
          continue;
        }
        seen[id] = true;
        options.push({
          id: id,
          name: String(item.name || "Objet sans nom").trim() || "Objet sans nom",
          objectType: normalizeThingType(item.type || item["@type"] || ""),
          location: getThingLocationLabel(item.location),
          availability: String(item.availability || item.status || "").trim()
        });
      }

      options.sort(function (left, right) {
        var leftKey = (left.objectType + " " + left.name).toLowerCase();
        var rightKey = (right.objectType + " " + right.name).toLowerCase();
        if (leftKey < rightKey) return -1;
        if (leftKey > rightKey) return 1;
        return 0;
      });
      return options;
    }

    async function fetchSelectableThings(forceRefresh) {
      var cacheIsFresh = reportThingOptionsCache.length && (Date.now() - reportThingOptionsLoadedAt) < 60000;
      if (!forceRefresh && cacheIsFresh) {
        return reportThingOptionsCache.slice();
      }
      if (reportThingOptionsPromise) {
        return reportThingOptionsPromise;
      }

      var apiBase = getApiBase();
      if (!apiBase) {
        reportThingOptionsCache = [];
        reportThingOptionsLoadedAt = Date.now();
        return [];
      }

      reportThingOptionsPromise = fetch(apiBase + "/things/search", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(getReportSearchPayload())
      }).then(function (response) {
        if (!response.ok) {
          throw new Error("report_things_fetch_failed");
        }
        return response.json().catch(function () {
          return [];
        });
      }).then(function (items) {
        reportThingOptionsCache = extractSelectableThings(items);
        reportThingOptionsLoadedAt = Date.now();
        return reportThingOptionsCache.slice();
      }).catch(function () {
        reportThingOptionsCache = [];
        reportThingOptionsLoadedAt = Date.now();
        return [];
      }).finally(function () {
        reportThingOptionsPromise = null;
      });

      return reportThingOptionsPromise;
    }

    function findSelectableThingById(thingId) {
      var safeId = String(thingId || "").trim();
      if (!safeId) {
        return null;
      }
      for (var i = 0; i < reportThingOptionsCache.length; i += 1) {
        if (String(reportThingOptionsCache[i] && reportThingOptionsCache[i].id || "").trim() === safeId) {
          return reportThingOptionsCache[i];
        }
      }
      return null;
    }

    function formatSelectableThingLabel(thing) {
      var objectType = String(thing && thing.objectType || "").trim();
      var objectName = String(thing && thing.name || "Objet sans nom").trim() || "Objet sans nom";
      var location = String(thing && thing.location || "").trim();
      var parts = [];
      if (objectType) {
        parts.push(objectType);
      }
      parts.push(objectName);
      if (location) {
        parts.push(location);
      }
      return parts.join(" - ");
    }

    function syncReportComposerControls() {
      var objectSelect = document.getElementById("ibSidebarReportObject");
      var objectHelp = document.getElementById("ibSidebarReportObjectHelp");
      var submitBtn = document.querySelector("[data-submit-report]");

      if (!objectSelect) {
        return;
      }

      if (!reportThingOptionsCache.some(function (thing) { return thing.id === reportComposerState.selectedThingId; })) {
        reportComposerState.selectedThingId = "";
      }

      var objectOptions = ['<option value="">Choisir un objet</option>'];
      for (var i = 0; i < reportThingOptionsCache.length; i += 1) {
        objectOptions.push(
          '<option value="' + esc(reportThingOptionsCache[i].id) + '">' + esc(formatSelectableThingLabel(reportThingOptionsCache[i])) + "</option>"
        );
      }

      objectSelect.innerHTML = objectOptions.join("");
      objectSelect.disabled = !reportThingOptionsCache.length;
      objectSelect.value = reportComposerState.selectedThingId;

      if (objectHelp) {
        if (!reportThingOptionsCache.length) {
          objectHelp.textContent = "Aucun objet disponible pour le moment.";
        } else {
          objectHelp.textContent = "Choisissez directement l'objet par son type, son nom et sa localisation.";
        }
      }

      if (submitBtn) {
        submitBtn.disabled = !reportThingOptionsCache.length;
      }
    }

    async function hydrateReportComposer(forceRefresh) {
      var objectSelect = document.getElementById("ibSidebarReportObject");

      if (objectSelect) {
        objectSelect.innerHTML = '<option value="">Chargement des objets...</option>';
        objectSelect.disabled = true;
      }

      await fetchSelectableThings(forceRefresh);
      syncReportComposerControls();
    }

    function ensureStyle() {
      if (document.getElementById("ib-report-overlay-style")) {
        return;
      }
      var style = document.createElement("style");
      style.id = "ib-report-overlay-style";
      style.textContent =
        ".ib-report-overlay{position:fixed;inset:0;z-index:2650;display:grid;place-items:center;}" +
        ".ib-report-overlay[hidden]{display:none;}" +
        ".ib-report-backdrop{position:absolute;inset:0;background:rgba(2,6,23,0.68);backdrop-filter:blur(4px);}" +
        ".ib-report-panel{position:relative;width:min(760px,calc(100vw - 24px));max-height:calc(100vh - 42px);overflow:auto;border-radius:16px;border:1px solid rgba(148,163,184,0.35);background:rgba(248,250,252,0.98);box-shadow:0 18px 36px rgba(2,6,23,0.35);}" +
        ".ib-report-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 16px;border-bottom:1px solid #e2e8f0;background:rgba(241,245,249,0.96);color:#0f172a;}" +
        ".ib-report-title{margin:0;font-size:18px;font-weight:800;}" +
        ".ib-report-close{border:1px solid #cbd5e1;width:32px;height:32px;border-radius:999px;background:#fff;color:#0f172a;font-size:16px;cursor:pointer;}" +
        ".ib-report-body{padding:16px;background:rgba(248,250,252,0.94);}" +
        ".ib-report-form{display:grid;gap:14px;}" +
        ".ib-report-card{background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:14px;}" +
        ".ib-report-label{display:block;margin:0 0 8px;font-size:13px;font-weight:800;color:#475569;text-transform:uppercase;}" +
        ".ib-report-input,.ib-report-select,.ib-report-textarea{width:100%;border:1px solid #cbd5e1;border-radius:10px;padding:11px 13px;background:#fff;color:#0f172a;font:inherit;outline:none;}" +
        ".ib-report-textarea{resize:vertical;min-height:120px;}" +
        ".ib-report-help{margin:8px 0 0;font-size:12px;color:#64748b;line-height:1.45;}" +
        ".ib-report-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:10px;}" +
        ".ib-report-btn{border:none;border-radius:10px;padding:11px 16px;font-size:14px;font-weight:800;cursor:pointer;}" +
        ".ib-report-btn.secondary{background:#e2e8f0;color:#0f172a;}" +
        ".ib-report-btn.light{background:#fff;color:#0f172a;border:1px solid #cbd5e1;}" +
        ".ib-report-btn.primary{background:linear-gradient(135deg,#dc2626,#991b1b);color:#fff;}" +
        ".ib-report-empty{padding:20px;border:1px dashed #cbd5e1;border-radius:12px;color:#64748b;text-align:center;background:#fff;}" +
        ".ib-report-list{display:grid;gap:12px;}" +
        ".ib-report-item{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:14px;}" +
        ".ib-report-row{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;}" +
        ".ib-report-name{margin:0;color:#0f172a;font-size:15px;font-weight:800;}" +
        ".ib-report-sub{margin:5px 0 0;color:#64748b;font-size:12px;}" +
        ".ib-report-status{display:inline-block;margin-top:8px;padding:4px 9px;border-radius:999px;font-size:11px;font-weight:800;}" +
        ".ib-report-status.pending{background:#fef3c7;color:#92400e;}" +
        ".ib-report-status.done{background:#dcfce7;color:#166534;}" +
        ".ib-report-status.rejected{background:#fee2e2;color:#b91c1c;}" +
        ".ib-report-text{margin:8px 0 0;color:#334155;font-size:13px;line-height:1.5;}" +
        ".ib-report-remove{border:none;background:#fee2e2;color:#b91c1c;padding:7px 10px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;white-space:nowrap;}" +
        "@media (max-width:900px){.ib-report-panel{width:min(100vw - 12px,760px);} .ib-report-actions{justify-content:stretch;} .ib-report-btn{width:100%;}}";
      document.head.appendChild(style);
    }

    function ensureOverlayShell() {
      var shell = document.getElementById("ibReportsOverlay");
      if (shell) {
        return shell;
      }
      ensureStyle();
      shell = document.createElement("div");
      shell.id = "ibReportsOverlay";
      shell.className = "ib-report-overlay";
      shell.hidden = true;
      shell.innerHTML =
        '<div class="ib-report-backdrop" id="ibReportBackdrop"></div>' +
        '<section class="ib-report-panel" role="dialog" aria-modal="true" aria-labelledby="ibReportTitle">' +
          '<header class="ib-report-head">' +
            '<h3 class="ib-report-title" id="ibReportTitle">Signaler un problème</h3>' +
            '<button type="button" class="ib-report-close" id="ibReportClose" aria-label="Fermer">x</button>' +
          '</header>' +
          '<div class="ib-report-body" id="ibReportBody"></div>' +
        '</section>';
      document.body.appendChild(shell);

      function closeOverlay() {
        shell.hidden = true;
        document.body.style.overflow = "";
      }

      document.getElementById("ibReportBackdrop").addEventListener("click", closeOverlay);
      document.getElementById("ibReportClose").addEventListener("click", closeOverlay);
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !shell.hidden) {
          closeOverlay();
        }
      });

      shell.addEventListener("click", function (event) {
        var closeBtn = event.target.closest("[data-close-report-overlay]");
        if (closeBtn) {
          event.preventDefault();
          closeOverlay();
          return;
        }

        var openListBtn = event.target.closest("[data-open-report-list]");
        if (openListBtn) {
          event.preventDefault();
          openReportsList();
          return;
        }

        var openFormBtn = event.target.closest("[data-open-report-form]");
        if (openFormBtn) {
          event.preventDefault();
          openReportComposer();
          return;
        }

        var submitBtn = event.target.closest("[data-submit-report]");
        if (submitBtn) {
          event.preventDefault();
          submitSidebarReport();
          return;
        }

        var removeBtn = event.target.closest("[data-remove-report]");
        if (removeBtn) {
          event.preventDefault();
          var idx = Number(removeBtn.getAttribute("data-remove-report"));
          var reports = parseJson("userReports");
          if (Number.isInteger(idx) && idx >= 0 && idx < reports.length) {
            reports.splice(idx, 1);
            writeJson("userReports", reports);
            try {
              window.dispatchEvent(new CustomEvent("app:reports-changed", { detail: { reports: reports } }));
            } catch (e) {
              // ignore
            }
          }
          openReportsList();
          notify("Signalement supprimé", "success", "Suppression");
        }
      });

      shell.addEventListener("change", function (event) {
        var target = event.target;
        if (!target || !target.id) {
          return;
        }

        if (target.id === "ibSidebarReportObject") {
          reportComposerState.selectedThingId = String(target.value || "").trim();
          syncReportComposerControls();
        }
      });

      return shell;
    }

    function openOverlay(title, html) {
      var shell = ensureOverlayShell();
      document.getElementById("ibReportTitle").textContent = title;
      document.getElementById("ibReportBody").innerHTML = html;
      shell.hidden = false;
      document.body.style.overflow = "hidden";
    }

    function statusClass(value) {
      var txt = String(value || "").toLowerCase();
      if (txt.indexOf("trait") >= 0 || txt.indexOf("resolu") >= 0 || txt.indexOf("accepte") >= 0) return "done";
      if (txt.indexOf("refus") >= 0 || txt.indexOf("rejet") >= 0) return "rejected";
      return "pending";
    }

    function formatReportStatusLabel(value) {
      var txt = String(value || "").trim();
      if (!txt || txt.toLowerCase() === "signale") {
        return "En attente";
      }
      return txt;
    }

    function openReportComposer() {
      reportComposerState = {
        selectedThingId: ""
      };

      var html =
        '<div class="ib-report-form">' +
          '<div class="ib-report-card">' +
            '<label class="ib-report-label" for="ibSidebarReportObject">Objet concerné</label>' +
            '<select id="ibSidebarReportObject" class="ib-report-select" disabled>' +
              '<option value="">Chargement des objets...</option>' +
            '</select>' +
            '<p class="ib-report-help" id="ibSidebarReportObjectHelp">Choisissez directement l\'objet avec son type, son nom et sa localisation.</p>' +
          '</div>' +
          '<div class="ib-report-card">' +
            '<label class="ib-report-label" for="ibSidebarReportProblemType">Type de problème</label>' +
            '<select id="ibSidebarReportProblemType" class="ib-report-select">' +
              '<option value="Objet endommagé">Objet endommagé</option>' +
              '<option value="Position incorrecte">Position incorrecte</option>' +
              '<option value="Information manquante">Information manquante</option>' +
              '<option value="Autre">Autre</option>' +
            '</select>' +
          '</div>' +
          '<div class="ib-report-card">' +
            '<label class="ib-report-label" for="ibSidebarReportDesc">Description du problème</label>' +
            '<textarea id="ibSidebarReportDesc" class="ib-report-textarea" maxlength="500" placeholder="Décrivez ici le problème rencontré..."></textarea>' +
            '<p class="ib-report-help">Maximum 500 caractères.</p>' +
          '</div>' +
          '<div class="ib-report-actions">' +
            '<button type="button" class="ib-report-btn light" data-open-report-list>Voir mes signalements</button>' +
            '<button type="button" class="ib-report-btn secondary" data-close-report-overlay>Annuler</button>' +
            '<button type="button" class="ib-report-btn primary" data-submit-report>Envoyer le signalement</button>' +
          '</div>' +
        '</div>';
      openOverlay("Signaler un problème", html);
      hydrateReportComposer(false);
    }

    function openReportsList() {
      var apiBase = getApiBase();
      if (!apiBase) {
        notify("Impossible de charger les signalements", "error", "Erreur");
        return;
      }

      // Afficher "Chargement..." en attendant
      openOverlay(
        "Mes signalements",
        '<div class="ib-report-form">' +
          '<div class="ib-report-empty">Chargement des signalements...</div>' +
        '</div>'
      );

      // Appeler l'API pour récupérer les signalements
      fetch(apiBase + "/problem-reports", {
        method: "GET",
        headers: getAuthHeaders()
      })
      .then(function(response) {
        if (!response.ok) throw new Error("API error");
        return response.json();
      })
      .then(function(data) {
        var reports = data.reports || [];
        if (!reports.length) {
          openOverlay(
            "Mes signalements",
            '<div class="ib-report-form">' +
              '<div class="ib-report-empty">Aucun signalement pour le moment.</div>' +
              '<div class="ib-report-actions">' +
                '<button type="button" class="ib-report-btn primary" data-open-report-form>Nouveau signalement</button>' +
              '</div>' +
            '</div>'
          );
          return;
        }

        var cards = "";
        for (var i = 0; i < reports.length; i += 1) {
          var rep = reports[i] || {};
          var date = rep.created_at ? new Date(rep.created_at).toLocaleDateString("fr-FR") : (rep.date || "-");
          var name = String(rep.thing_name || "Signalement").trim() || "Signalement";
          var type = String(rep.problem_type || "Non spécifié").trim() || "Non spécifié";
          var location = String(rep.thing_location || "").trim();
          var objectType = String(rep.thing_type || "").trim();
          var status = formatReportStatusLabel(rep.status);
          var subtitle = "<strong>Problème:</strong> " + esc(type);
          if (location) {
            subtitle += " • <strong>Position:</strong> " + esc(location);
          }
          subtitle += " • " + esc(date);
          if (objectType) {
            subtitle += " • <strong>Type d'objet:</strong> " + esc(objectType);
          }
          cards +=
            '<div class="ib-report-item">' +
              '<div class="ib-report-row">' +
                '<div>' +
                  '<p class="ib-report-name">' + esc(name) + '</p>' +
                  '<p class="ib-report-sub">' + subtitle + '</p>' +
                  '<span class="ib-report-status ' + statusClass(status) + '">' + esc(status) + '</span>' +
                  '<p class="ib-report-text">' + esc(String(rep.description || "Description non fournie")) + '</p>' +
                '</div>' +
              '</div>' +
            '</div>';
        }

        openOverlay(
          "Mes signalements",
          '<div class="ib-report-form">' +
            '<div class="ib-report-list">' + cards + '</div>' +
            '<div class="ib-report-actions">' +
              '<button type="button" class="ib-report-btn primary" data-open-report-form>Nouveau signalement</button>' +
            '</div>' +
          '</div>'
        );
      })
      .catch(function(err) {
        console.error("Erreur chargement signalements:", err);
        notify("Erreur lors du chargement des signalements", "error", "Erreur");
      });
    }

    function submitSidebarReport() {
      var objectInput = document.getElementById("ibSidebarReportObject");
      var problemTypeInput = document.getElementById("ibSidebarReportProblemType");
      var descInput = document.getElementById("ibSidebarReportDesc");
      var selectedThingId = String(objectInput && objectInput.value || "").trim();
      var problemType = String(problemTypeInput && problemTypeInput.value || "").trim();
      var description = String(descInput && descInput.value || "").trim();
      var selectedThing = findSelectableThingById(selectedThingId);

      if (!selectedThing) {
        notify("Veuillez sélectionner l'objet concerné.", "error", "Validation");
        return;
      }
      if (!problemType) {
        notify("Veuillez sélectionner le type de problème.", "error", "Validation");
        return;
      }
      if (!description) {
        notify("Veuillez décrire le problème.", "error", "Validation");
        return;
      }

      var apiBase = getApiBase();
      if (!apiBase) {
        notify("Impossible d'envoyer le signalement", "error", "Erreur");
        return;
      }

      // Appeler l'API pour soumettre le signalement
      fetch(apiBase + "/problem-report", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          thing_id: selectedThingId,
          thing_name: selectedThing.name || "Objet",
          problem_type: problemType,
          description: description
        })
      })
      .then(function(response) {
        if (!response.ok) throw new Error("API error");
        return response.json();
      })
      .then(function(data) {
        if (data.success) {
          notify(data.message || "Problème signalé avec succès", "success", "Signalement envoyé");
          openReportsList();
        } else {
          notify(data.detail || "Erreur lors du signalement", "error", "Erreur");
        }
      })
      .catch(function(err) {
        console.error("Erreur envoi signalement:", err);
        notify("Erreur lors du signalement", "error", "Erreur");
      });
    }

    function handleReportsTrigger(event, trigger) {
      event.preventDefault();
      event.stopPropagation();
      if (event.stopImmediatePropagation) {
        event.stopImmediatePropagation();
      }
      activateLink(trigger, sidebarRoot);
      openReportComposer();
    }

    var directTrigger = sidebarRoot.querySelector("#openReportsOverlay");
    if (directTrigger) {
      directTrigger.onclick = function (event) {
        handleReportsTrigger(event, directTrigger);
      };
      directTrigger.addEventListener("click", function (event) {
        handleReportsTrigger(event, directTrigger);
      }, true);
    }

    document.addEventListener("click", function (event) {
      var reportsTrigger = event.target.closest("#openReportsOverlay");
      if (!reportsTrigger) {
        return;
      }
      handleReportsTrigger(event, reportsTrigger);
    }, true);
  }

  function patchUserHistoryLink(root, page) {
    var historyLink = root.querySelector("a[data-history-link='true']");
    var sideNav = root.querySelector("#sideNav") || root.querySelector("nav");

    if (!historyLink && sideNav) {
      var favoritesLink = sideNav.querySelector("#openFavoritesOverlay");
      historyLink = document.createElement("a");
      historyLink.setAttribute("href", "user.html#history");
      historyLink.setAttribute("data-history-link", "true");
      historyLink.innerHTML = '<i class="fas fa-clock-rotate-left"></i><span data-key="nav_history">Historique</span>';

      if (favoritesLink && favoritesLink.parentNode === sideNav) {
        sideNav.insertBefore(historyLink, favoritesLink);
      } else {
        sideNav.appendChild(historyLink);
      }
    }

    if (!historyLink) {
      return;
    }

    if (page === "user" || page === "localisations-user") {
      historyLink.setAttribute("href", "#");
      historyLink.setAttribute("id", "openHistoryOverlay");
    }
  }

  var path = (window.location.pathname.split("/").pop() || "").toLowerCase();
  var page = (path.replace(".html", "") || "index").toLowerCase();
  var role = detectRole(page);

  if (role !== "admin" && role !== "user") {
    return;
  }

  var request = new XMLHttpRequest();
  request.open("GET", "sidebar.html", false);
  request.send(null);

  if (request.status < 200 || request.status >= 300) {
    return;
  }

  var parser = new DOMParser();
  var source = parser.parseFromString(request.responseText, "text/html");
  var templateId = role === "admin" ? "sidebar-admin-template" : "sidebar-user-template";
  var template = source.getElementById(templateId);

  if (!template || !template.content || !template.content.firstElementChild) {
    return;
  }

  var node = template.content.firstElementChild.cloneNode(true);
  injectSidebarStyles();
  if (role === "user") {
    patchUserHistoryLink(node, page);
  }
  markActiveLink(node, page);
  bindOverlayActiveBehavior(node);
  if (role === "user") {
    initUnifiedUserFavoritesOverlay(node);
    initUnifiedUserReportsOverlay(node);
  }

  // Load user favorites from API on all pages (needed before overlay init)
  if (role === "user") {
    (function initSharedFavorites() {
      function getApiBase() {
        if (!window.APP_CONFIG || !window.APP_CONFIG.API_BASE) return "";
        return String(window.APP_CONFIG.API_BASE).replace(/\/+$/, "");
      }
      function getAuthHeaders() {
        var token = String(localStorage.getItem("userToken") || "").trim();
        var headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = "Bearer " + token;
        return headers;
      }
      var apiBase = getApiBase();
      var token = String(localStorage.getItem("userToken") || "").trim();
      if (apiBase && token) {
        fetch(apiBase + "/user/favorites", {
          method: "GET",
          headers: getAuthHeaders()
        }).then(function (resp) { return resp.json(); }).then(function (data) {
          if (data.success && Array.isArray(data.favorites)) {
            syncFavoritesCache(data.favorites);
            console.log("[sidebar-loader] Loaded " + data.favorites.length + " favorites");
          }
        }).catch(function (err) { console.error("[sidebar-loader] Error loading favorites:", err); });
      }
    })();
  }

  var currentScript = document.currentScript;
  if (currentScript && currentScript.parentNode) {
    currentScript.parentNode.insertBefore(node, currentScript);
  }
})();
