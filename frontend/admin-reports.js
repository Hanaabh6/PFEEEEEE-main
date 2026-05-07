(function () {
  var reportsCache = [];

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>\"']/g, function (ch) {
      if (ch === "&") return "&amp;";
      if (ch === "<") return "&lt;";
      if (ch === ">") return "&gt;";
      if (ch === "\"") return "&quot;";
      return "&#39;";
    });
  }

  function getApiBase() {
    if (!window.APP_CONFIG || !window.APP_CONFIG.API_BASE) return "";
    return String(window.APP_CONFIG.API_BASE).replace(/\/+$/, "");
  }

  function getAuthHeaders() {
    var headers = { "Content-Type": "application/json" };
    var token = String(localStorage.getItem("userToken") || "").trim();
    if (token) {
      headers.Authorization = "Bearer " + token;
    }
    return headers;
  }

  function notify(message, type, title) {
    if (typeof window.showAppToast === "function") {
      window.showAppToast(message, type || "info", title || "Signalements");
      return;
    }
    if (typeof window.showToast === "function") {
      window.showToast(message, type || "info");
      return;
    }
    if (typeof window.alert === "function") {
      window.alert(message);
    }
  }

  function formatDate(value) {
    if (!value) return "-";
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return escapeHtml(value);
    return escapeHtml(date.toLocaleDateString("fr-FR"));
  }

  function formatStatusLabel(status) {
    var value = String(status || "").trim();
    var normalized = value.toLowerCase();
    if (!value || normalized === "signale") return "En attente";
    return value;
  }

  function getStatusBadgeStyle(status) {
    var normalized = String(status || "").toLowerCase();
    if (
      normalized.indexOf("resolu") >= 0 ||
      normalized.indexOf("remis en service") >= 0 ||
      normalized.indexOf("accepte") >= 0 ||
      normalized.indexOf("trait") >= 0
    ) {
      return "background:#dcfce7;color:#166534;";
    }
    if (normalized.indexOf("refus") >= 0 || normalized.indexOf("rejet") >= 0) {
      return "background:#fee2e2;color:#b91c1c;";
    }
    return "background:#fef3c7;color:#92400e;";
  }

  function canReactivateReport(report) {
    var decision = String(report && report.decision ? report.decision : "").toLowerCase();
    var status = String(report && report.status ? report.status : "").toLowerCase();
    if (decision === "reactivate") return false;
    if (decision === "accept") return true;
    return status.indexOf("panne") >= 0 && status.indexOf("remis en service") < 0;
  }

  function buildActionButtons(report) {
    var reportId = String(report && (report.report_id || report.id) ? (report.report_id || report.id) : "").trim();
    if (!reportId) return "";

    var decision = String(report && report.decision ? report.decision : "").toLowerCase();
    var status = String(report && report.status ? report.status : "").toLowerCase();
    var isResolvedState = decision === "reactivate" || status.indexOf("resolu") >= 0 || status.indexOf("remis en service") >= 0;
    var isAcceptedState = decision === "accept" || status.indexOf("accepte") >= 0 || status.indexOf("panne") >= 0;
    var isRejectedState = decision === "reject" || status.indexOf("refus") >= 0 || status.indexOf("rejet") >= 0;
    var actions = [];

    if (!isAcceptedState && !isResolvedState) {
      actions.push(
        "<button type='button' onclick=\"window.adminReviewReport('" + escapeHtml(reportId) + "', 'accept')\" style='background:#dcfce7;color:#166534;border:none;padding:6px 10px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700;'>Accepter</button>"
      );
    }
    if (!isRejectedState && !isAcceptedState && !isResolvedState) {
      actions.push(
        "<button type='button' onclick=\"window.adminReviewReport('" + escapeHtml(reportId) + "', 'reject')\" style='background:#fee2e2;color:#b91c1c;border:none;padding:6px 10px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700;'>Refuser</button>"
      );
    }
    if (canReactivateReport(report)) {
      actions.push(
        "<button type='button' onclick=\"window.adminReactivateReport('" + escapeHtml(reportId) + "')\" style='background:#d1fae5;color:#065f46;border:none;padding:6px 10px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700;'>Remettre en service</button>"
      );
    }

    if (!actions.length) {
      return "<span style='color:#64748b;font-size:12px;font-weight:700;'>Aucune action</span>";
    }

    return "<div style='display:flex;gap:6px;flex-wrap:wrap;'>" + actions.join("") + "</div>";
  }

  function renderReportsHtml() {
    var rows = reportsCache.map(function (report) {
      var thingName = escapeHtml(report && report.thing_name ? report.thing_name : "Objet non precise");
      var thingType = escapeHtml(report && report.thing_type ? report.thing_type : "Non specifie");
      var position = escapeHtml(report && report.thing_location ? report.thing_location : "Position non definie");
      var problemType = escapeHtml(report && report.problem_type ? report.problem_type : "Non specifie");
      var description = escapeHtml(report && report.description ? report.description : "Description non fournie");
      var reporter = escapeHtml(report && report.email ? report.email : "Utilisateur inconnu");
      var reportStatus = formatStatusLabel(report && report.status ? report.status : "");
      var objectState = [];
      if (report && report.thing_status) objectState.push(String(report.thing_status));
      if (report && report.thing_maintenance_state) objectState.push(String(report.thing_maintenance_state));
      var objectStateText = objectState.length
        ? "<div style='margin-top:4px;font-size:12px;font-weight:600;color:#64748b;'>Etat objet: " + escapeHtml(objectState.join(" - ")) + "</div>"
        : "";

      return "" +
        "<tr style='border-bottom:1px solid #e2e8f0;'>" +
          "<td style='padding:10px;color:#0f172a;font-weight:700;'>" +
            thingName +
            "<div style='margin-top:4px;font-size:12px;font-weight:600;color:#64748b;'>Type d'objet: " + thingType + "</div>" +
            "<div style='margin-top:4px;font-size:12px;font-weight:600;color:#64748b;'>Signale par: " + reporter + "</div>" +
            objectStateText +
          "</td>" +
          "<td style='padding:10px;color:#475569;'>" + position + "</td>" +
          "<td style='padding:10px;color:#475569;'>" + problemType + "</td>" +
          "<td style='padding:10px;color:#334155;max-width:360px;'>" + description + "</td>" +
          "<td style='padding:10px;color:#64748b;white-space:nowrap;'>" + formatDate(report && report.created_at ? report.created_at : report && report.date ? report.date : "") + "</td>" +
          "<td style='padding:10px;'><span style='display:inline-block;padding:4px 8px;border-radius:999px;font-size:11px;font-weight:700;" + getStatusBadgeStyle(reportStatus) + "'>" + escapeHtml(reportStatus) + "</span></td>" +
          "<td style='padding:10px;'>" + buildActionButtons(report) + "</td>" +
        "</tr>";
    }).join("");

    if (!rows) {
      rows =
        "<tr>" +
          "<td colspan='7' style='padding:18px;color:#64748b;text-align:center;font-weight:600;'>Aucun signalement pour le moment.</td>" +
        "</tr>";
    }

    return "" +
      "<div class='p-2'>" +
        "<p style='margin:0 0 10px 0;color:#334155;font-weight:700;'>Demandes de signalement utilisateur</p>" +
        "<div style='overflow-x:auto;'>" +
          "<table style='width:100%;border-collapse:collapse;'>" +
            "<thead>" +
              "<tr style='border-bottom:1px solid #cbd5e1;'>" +
                "<th style='text-align:left;padding:10px;font-size:12px;color:#64748b;text-transform:uppercase;'>Objet</th>" +
                "<th style='text-align:left;padding:10px;font-size:12px;color:#64748b;text-transform:uppercase;'>Position</th>" +
                "<th style='text-align:left;padding:10px;font-size:12px;color:#64748b;text-transform:uppercase;'>Type</th>" +
                "<th style='text-align:left;padding:10px;font-size:12px;color:#64748b;text-transform:uppercase;'>Probleme</th>" +
                "<th style='text-align:left;padding:10px;font-size:12px;color:#64748b;text-transform:uppercase;'>Date</th>" +
                "<th style='text-align:left;padding:10px;font-size:12px;color:#64748b;text-transform:uppercase;'>Statut</th>" +
                "<th style='text-align:left;padding:10px;font-size:12px;color:#64748b;text-transform:uppercase;'>Action</th>" +
              "</tr>" +
            "</thead>" +
            "<tbody>" + rows + "</tbody>" +
          "</table>" +
        "</div>" +
      "</div>";
  }

  function openOverlay(title, html) {
    if (typeof window.openOverlay === "function") {
      window.openOverlay(title, html);
      return true;
    }

    var infoOverlay = document.getElementById("infoOverlay");
    var overlayTitle = document.getElementById("overlayTitle");
    var overlayBody = document.getElementById("overlayBody");
    if (!infoOverlay || !overlayTitle || !overlayBody) return false;

    overlayTitle.textContent = title;
    overlayBody.innerHTML = html;
    infoOverlay.hidden = false;
    infoOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    return true;
  }

  function parseNotificationReport(notification) {
    var item = notification || {};
    var metadata = item && item.metadata && typeof item.metadata === "object" ? item.metadata : {};
    if (String(metadata.action || "").trim().toLowerCase() !== "problem_report") {
      return null;
    }

    var title = String(item.title || "").trim();
    var titleThingName = title.replace(/^Nouveau signalement:\s*/i, "").trim();
    var message = String(item.message || "").trim();
    var lines = message ? message.split(/\r?\n/) : [];
    var firstLine = String(lines[0] || "").trim();
    var description = lines.length > 1 ? lines.slice(1).join(" ").trim() : message;
    var problemType = String(metadata.problem_type || "").trim();
    if (!problemType && firstLine) {
      var dashIndex = firstLine.lastIndexOf(" - ");
      if (dashIndex >= 0) {
        problemType = firstLine.slice(dashIndex + 3).trim();
      }
    }

    return {
      id: String(metadata.report_id || "").trim(),
      report_id: String(metadata.report_id || "").trim(),
      user_id: "",
      email: String(item.actor_email || "").trim(),
      thing_id: String(metadata.thing_id || "").trim(),
      thing_name: titleThingName || "Objet",
      thing_type: "",
      thing_location: "",
      thing_status: "",
      thing_maintenance_state: "",
      problem_type: problemType || "Non specifie",
      description: description || "Description non fournie",
      status: "signale",
      decision: "",
      created_at: item.created_at || "",
      updated_at: item.updated_at || "",
      reviewed_at: "",
      reviewed_by_user_id: "",
      reviewed_by_email: "",
      date: ""
    };
  }

  async function fetchReportsFromNotificationsFallback(apiBase) {
    var response = await fetch(apiBase + "/notifications/me?limit=200", {
      method: "GET",
      headers: getAuthHeaders()
    });
    var payload = await response.json().catch(function () {
      return [];
    });
    if (!response.ok) {
      return [];
    }

    var list = Array.isArray(payload) ? payload : [];
    var reports = [];
    for (var i = 0; i < list.length; i += 1) {
      var mapped = parseNotificationReport(list[i]);
      if (mapped) {
        reports.push(mapped);
      }
    }
    return reports;
  }

  async function fetchReports() {
    var apiBase = getApiBase();
    if (!apiBase) {
      throw new Error("api_base_missing");
    }

    var response = await fetch(apiBase + "/problem-reports?limit=200", {
      method: "GET",
      headers: getAuthHeaders()
    });

    var payload = await response.json().catch(function () {
      return {};
    });
    if (!response.ok) {
      throw new Error(payload && payload.detail ? payload.detail : "reports_fetch_failed");
    }

    reportsCache = Array.isArray(payload && payload.reports) ? payload.reports : [];
    if (!reportsCache.length) {
      reportsCache = await fetchReportsFromNotificationsFallback(apiBase);
    }
    return reportsCache;
  }

  async function openReportsOverlay() {
    if (!openOverlay("Signalements", "<div class='p-2' style='color:#475569;font-weight:600;'>Chargement des signalements...</div>")) {
      return;
    }

    try {
      await fetchReports();
      openOverlay("Signalements", renderReportsHtml());
    } catch (error) {
      console.error("Erreur chargement signalements admin:", error);
      openOverlay("Signalements", "<div class='p-2' style='color:#b91c1c;font-weight:600;'>Impossible de charger les signalements.</div>");
      notify("Impossible de charger les signalements admin.", "error", "Signalements");
    }
  }

  async function submitDecision(reportId, decision) {
    var cleanReportId = String(reportId || "").trim();
    if (!cleanReportId) return;

    var apiBase = getApiBase();
    if (!apiBase) {
      notify("Configuration API introuvable.", "error", "Signalements");
      return;
    }

    try {
      var response = await fetch(apiBase + "/problem-reports/" + encodeURIComponent(cleanReportId) + "/decision", {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ decision: decision })
      });
      var payload = await response.json().catch(function () {
        return {};
      });
      if (!response.ok || !payload.success) {
        throw new Error(payload && payload.detail ? payload.detail : "report_review_failed");
      }

      if (decision === "accept") {
        notify("Le signalement a ete accepte et partage a tous les admins.", "success", "Signalements");
      } else if (decision === "reject") {
        notify("Le signalement a ete refuse.", "success", "Signalements");
      } else {
        notify("L'objet a ete remis en service.", "success", "Signalements");
      }

      await openReportsOverlay();
    } catch (error) {
      console.error("Erreur traitement signalement admin:", error);
      notify(String(error && error.message ? error.message : "Impossible de traiter le signalement."), "error", "Signalements");
    }
  }

  window.adminReviewReport = function (reportId, decision) {
    submitDecision(reportId, decision);
  };

  window.adminReactivateReport = function (reportId) {
    submitDecision(reportId, "reactivate");
  };

  window.__ibOpenAdminReportsOverlay = function (event) {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    openReportsOverlay();
    return false;
  };

  var trigger = document.getElementById("openAdminReportsOverlay");
  if (trigger) {
    trigger.addEventListener("click", window.__ibOpenAdminReportsOverlay);
  }

  document.addEventListener("click", function (event) {
    var delegatedTrigger = event.target && event.target.closest ? event.target.closest("#openAdminReportsOverlay") : null;
    if (!delegatedTrigger) {
      return;
    }
    window.__ibOpenAdminReportsOverlay(event);
  }, true);
})();
