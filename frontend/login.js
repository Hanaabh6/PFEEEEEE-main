const API_BASE = window.APP_CONFIG.API_BASE;
const tr = window.getTranslationText || function (_key, fallback) { return fallback; };

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
    const res = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            // 0. NETTOYER COMPLÈTEMENT localStorage avant de stocker les nouvelles données
            localStorage.removeItem("user_room");
            localStorage.removeItem("user_x");
            localStorage.removeItem("user_y");
            localStorage.removeItem("user_z");
            localStorage.removeItem("userToken");
            localStorage.removeItem("userRole");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userId");
            localStorage.removeItem("userDisplayName");
            
            // 1. On stocke le rôle et le token pour les utiliser plus tard
            localStorage.setItem("userRole", data.role);
            localStorage.setItem("userToken", data.access_token);
            localStorage.setItem("userEmail", data.email);
            localStorage.setItem("userId", data.user_id || "");
            if (data.display_name) {
                localStorage.setItem("userDisplayName", data.display_name);
                if (data.user_id) {
                    localStorage.setItem(`userDisplayName:${data.user_id}`, data.display_name);
                }
            } else {
                localStorage.removeItem("userDisplayName");
            }

            // 2. Charger la localisation de l'utilisateur
            if (data.localisation && typeof data.localisation === "object") {
                localStorage.setItem("user_room", String(data.localisation.room || ""));
                localStorage.setItem("user_x", String(data.localisation.x || 0));
                localStorage.setItem("user_y", String(data.localisation.y || 0));
                localStorage.setItem("user_z", String(data.localisation.z || 0));
            } else {
                localStorage.removeItem("user_room");
                localStorage.removeItem("user_x");
                localStorage.removeItem("user_y");
                localStorage.removeItem("user_z");
            }

            // 3. REDIRECTION LOGIQUE
            // Si c'est un admin -> index.html (Gestion complète)
            // Sinon (user) -> user.html
            if (data.role === "admin") {
                window.location.href = "index.html"; 
            } else {
                window.location.href = "user.html"; 
            }

        } else {
            alert("Erreur : " + (data.detail || tr("error_loading", "Erreur lors du chargement")));
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
        alert(tr("error_network", "Erreur réseau"));
    }
});
