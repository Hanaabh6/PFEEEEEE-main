const API_BASE = window.APP_CONFIG.API_BASE;
const tr = window.getTranslationText || function (_key, fallback) { return fallback; };

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const confirm = document.getElementById("registerConfirm").value;

  if (password !== confirm) {
    alert(tr("reset_error_mismatch", "Les mots de passe ne correspondent pas."));
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      alert(tr("success_saved", "Enregistré avec succès"));
      window.location.href = "login.html";
    } else {
      alert(data.detail || tr("error_loading", "Erreur lors du chargement"));
      console.log(data);
    }
  } catch (error) {
    console.error("Erreur reseau:", error);
    alert(tr("error_network", "Erreur réseau"));
  }
});
