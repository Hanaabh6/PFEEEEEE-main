(function () {
  "use strict";

  const translations = {
    fr: {
      // Global
      brand: "IntelliBuild",
      lang_title: "Langue",
      lang_active: "Langue active: {code}",
      position_label: "Ma position:",
      loading: "Chargement...",
      no_data: "Aucune donnée",
      not_defined: "Non définie",
      distance_same_room: "0m (même salle)",
      close: "Fermer",
      confirm: "Confirmer",
      yes: "Oui",
      no: "Non",
      info: "Information",
      success: "Succès",
      error: "Erreur",
      toast_operation_completed: "Opération terminée",
      confirm_action_title: "Confirmer l'action",
      confirm_action_text: "Confirmer cette action ?",
      non_specified: "Non spécifié",
      bio_none: "Aucune bio",

      // Navigation
      nav_home: "Accueil",
      nav_dashboard: "Dashboard",
      nav_users: "Utilisateurs",
      nav_add: "Ajouter",
      nav_objects: "Objets",
      nav_my_objects: "Mes objets",
      nav_locations: "Plan du batiment",
      nav_history: "Historique",
      nav_notifications: "Notifications",
      nav_documentation: "Documentation",
      nav_settings: "Paramètres",
      nav_features: "Fonctionnalités",
      nav_about: "À propos",
      nav_favorites: "Favoris",
      nav_report_issue: "Signaler un problème",

      // Buttons
      btn_login: "Connexion",
      btn_register: "Inscription",
      btn_signin: "Se connecter",
      btn_signup: "S'inscrire",
      btn_refresh: "Actualiser",
      btn_back_dashboard: "Retour au dashboard",
      btn_mark_all_read: "Tout marquer comme lu",
      btn_mark_read: "Marquer lu",
      btn_verify: "Vérifier",
      btn_verify_status: "Vérifier statut",
      btn_verify_first: "Vérifier d'abord",
      btn_update_password: "Mettre à jour",
      btn_view_docs: "Voir la doc",
      btn_cancel: "Annuler",
      btn_save: "Enregistrer l'objet",
      btn_delete: "Supprimer",
      btn_edit: "Modifier",
      btn_borrow: "Emprunter",
      btn_return: "Rendre",
      btn_user_guide: "Guide d’utilisation",
      btn_add_favorites: "Ajouter aux favoris",
      btn_remove_favorites: "Retirer des favoris",

      // Labels et placeholders
      label_email: "Email",
      label_password: "Mot de passe",
      label_new_password: "Nouveau mot de passe",
      label_confirm_password: "Confirmer le mot de passe",
      label_object_name: "Nom de l'objet",
      label_object_type: "Type d'objet",
      label_object_location: "Localisation",
      label_description: "Description",

      ph_email: "exemple@mail.com",
      ph_password: "••••••••",
      ph_confirm_password: "••••••••",
      ph_object_name: "Ex: ECLAIRAGE Bureau C-12",
      search_objects: "Rechercher un objet...",

      // Menu utilisateur
      menu_profile: "Mon profil",
      logout: "Déconnexion",
      connected_as_admin: "Connecté en admin",
      connected_as_user: "Connecté en utilisateur",
      connected_space: "Espace connecté",

      // Tableaux
      table_name: "Nom",
      table_type: "Type",
      table_location: "Localisation",
      table_status: "Statut",
      table_actions: "Actions",
      table_action: "Action",
      table_taken_on: "Pris le",

      // Notifications
      unread_label: "Non lues:",
      notifications_user_doc_title: "Notifications utilisateur - IntelliBuild",
      notifications_admin_doc_title: "Notifications admin - IntelliBuild",
      notifications_user_title: "Notifications utilisateur",
      notifications_user_sub: "Canal personnel: vos emprunts, retours et messages utiles.",
      notifications_admin_title: "Notifications admin",
      notifications_admin_sub: "Canal réservé aux actions et alertes d'administration.",
      notifications_user_empty: "Aucune notification utilisateur pour le moment.",
      notifications_admin_empty: "Aucune notification admin pour le moment.",
      notification_default_title: "Notification",
      notif_history_error: "Impossible de charger l'historique.",
      notif_mark_all_error: "Impossible de marquer les notifications.",

      // Objet personnel
      my_objects_doc_title: "Mes objets - IntelliBuild",
      my_objects_title: "Mes objets",
      my_objects_sub: "Objets que vous avez pris et que vous pouvez rendre",
      my_objects_empty: "Vous n'avez aucun objet en cours.",
      user_recent_objects: "Objets récents",

      // Statistiques
      stat_total: "Total objets",
      stat_active: "Actifs",
      stat_inactive: "Inactifs",
      stat_locations: "Localisations",
      stat_locations_suffix: "salles uniques",

      // Home page
      home_doc_title: "IntelliBuild – Smart Objects",
      title: "Plateforme intelligente<br>de gestion d’objets connectés",
      subtitle: "Une solution moderne pour décrire, gérer, sécuriser et rechercher les objets connectés dans un smart building.",
      start: "Commencer",
      discover: "Découvrir",

      feature1_title: "Gestion",
      feature1_text: "Ajouter, modifier et supprimer facilement vos objets connectés.",
      feature2_title: "Sécurité",
      feature2_text: "Contrôle d’accès, protection des données et surveillance intelligente.",
      feature3_title: "Recherche",
      feature3_text: "Recherche rapide par type, localisation ou état des objets.",

      badge_centralized: "Gestion centralisée",
      badge_fast_search: "Recherche rapide",
      badge_smooth_experience: "Expérience fluide",

      hero_panel_label: "Smart Building",
      hero_panel_title: "Une interface plus claire pour piloter tous vos objets.",
      hero_panel_text: "Inventaire, localisation, sécurité et visibilité regroupés dans une seule expérience.",

      mini_inventory: "Inventaire",
      mini_centralized: "Centralisé",
      mini_search: "Recherche",
      mini_instant: "Instantanée",
      mini_tracking: "Suivi",
      mini_visible: "Visible",
      mini_design: "Design",
      mini_modern: "Moderne",

      stat_text_1: "espaces clairs pour consulter, localiser et suivre les objets sans perdre le fil.",
      stat_text_2: "plateforme pour centraliser l’inventaire, la recherche et la visibilité du smart building.",
      stat_text_3: "une interface pensée pour la démonstration du projet comme pour l’usage quotidien.",

      why_title: "Un parcours plus clair",
      why_1_title: "Comprendre vite",
      why_1_text: "Dès l’accueil, l’utilisateur voit ce que fait IntelliBuild, ce qu’il peut gérer et où commencer.",
      why_2_title: "Agir sans friction",
      why_2_text: "Connexion, dashboard, objets et localisation s’enchaînent dans un flux plus simple et plus lisible.",
      why_3_title: "Montrer le projet",
      why_3_text: "La page d’accueil présente mieux la valeur du PFE avec un rendu plus propre, plus moderne et plus convaincant.",

      about_title: "Pourquoi IntelliBuild ?",
      about_text: "IntelliBuild centralise la gestion des objets connectés d’un bâtiment intelligent pour améliorer l’efficacité, la sécurité et la visibilité.",
      footer_rights: "© 2026 IntelliBuild. Tous droits réservés.",

      // Authentification
      about_doc_title: "À propos - IntelliBuild",
      login_doc_title: "Connexion – IntelliBuild",
      login_title: "Connexion",
      login_sub: "Accédez à votre plateforme Smart Building",
      forgot_password: "Mot de passe oublié ?",
      auth_link_login: 'Vous avez déjà un compte ? <a href="login.html">Connectez-vous</a>',

      register_doc_title: "Inscription – IntelliBuild",
      register_title: "Créer un compte",
      register_sub: "Rejoignez la plateforme IntelliBuild",
      auth_link_register: 'Pas encore de compte ? <a href="register.html">Inscrivez-vous</a>',

      reset_doc_title: "Réinitialiser le mot de passe – IntelliBuild",
      reset_title: "Réinitialiser le mot de passe",
      reset_sub: "Choisissez un nouveau mot de passe.",

      // Ajouter objet
      add_object_title: "Ajouter un objet",
      add_object_sub: "Remplissez les informations de l'appareil",
      add_object_name: "Nom de l'objet",
      add_object_type: "Type d'objet",
      add_object_location: "Localisation",
      add_object_description: "Description",
      add_object_endpoint: "Endpoint (optionnel)",

      // Objets et détails
      objects_all: "Tous les objets",
      new_object: "Nouvel objet",
      detail_overlay_title: "Détail de l'objet",
      detail_name: "Nom",
      detail_type: "Type",
      detail_location: "Localisation",
      detail_status: "Statut",
      distance_label: "Distance",
      detail_description: "Description",
      object_sheet: "Fiche objet",
      unnamed_object: "Objet sans nom",
      status_pending_check: "À vérifier",
      object_description_empty: "Aucune description disponible.",
      object_edit_title: "Modification objet",

      // Historique, rôles et statuts
      history_admin_title: "Historique admin",
      user_activity_title: "Activité utilisateur",
      history_loading: "Chargement...",
      history_empty_admin: "Aucun historique pour le moment.",
      history_empty_user_activity: "Aucune activité utilisateur récente.",
      history_date: "Date",
      history_action: "Action",
      history_detail: "Détail",
      history_status: "Statut",
      nav_role: "Rôle",
      role_overlay_title: "Rôle",
      role_admin_chip: "Admin",
      role_admin_manage_title: "Gestion",
      role_admin_manage_text: "Accès complet.",
      role_manage_objects_title: "Gestion objets",
      role_manage_objects_text: "Peut ajouter, modifier et supprimer les objets connectés.",
      role_supervision_title: "Supervision",
      role_supervision_text: "Peut consulter les localisations et les statistiques globales.",
      role_administration_title: "Administration",
      role_administration_text: "Peut gérer les paramètres et les actions avancées.",
      admin_action_default: "Admin - Action",
      admin_action_users: "Admin - Gestion utilisateurs",
      admin_action_session: "Admin - Session",
      admin_action_profile: "Admin - Profil",
      admin_action_navigation: "Admin - Navigation",
      status_available: "Disponible",
      status_in_use: "En utilisation",
      status_unavailable: "Indisponible",
      status_active_label: "Actif",
      status_inactive_label: "Inactif",

      // Commandes utilisateur
      my_objects_counter_singular: "{count} objet en cours",
      my_objects_counter_plural: "{count} objets en cours",
      confirm_return_object: "Voulez-vous vraiment rendre l'objet {id} ?",
      object_check_first_title: "Vérifiez d'abord le statut de l'objet.",
      object_check_first_copy: "Cliquez sur Vérifier statut. Si l'objet est disponible, vous pourrez ensuite le prendre.",
      object_same_room_note: "Objet disponible dans votre salle actuelle.",
      status_already_taken_by_you: "Déjà pris (vous)",
      object_already_yours_title: "Cet objet est en votre utilisation.",
      object_already_yours_copy: "Vous avez actuellement cet objet. Rendez-vous au point de restitution quand vous avez terminé.",
      object_in_use_title: "Cet objet est déjà pris.",
      object_in_use_copy: "Cet objet est actuellement en utilisation. Vous ne pouvez pas le prendre pour le moment.",
      object_available_title: "Voulez-vous prendre cet objet ?",
      object_available_copy: "Statut vérifié: disponible. Vous pouvez maintenant prendre l'objet.",
      object_unavailable_title: "Cet objet n'est pas disponible pour la prise pour le moment.",
      object_unavailable_copy: "Statut vérifié: non disponible. Vous ne pouvez pas le prendre actuellement.",
      btn_take_object: "Je prends",
      return_impossible: "Retour impossible",
      object_returned: "Objet rendu",
      my_objects_load_error: "Impossible de charger vos objets",
      my_objects_feature_title: "Fonctionnalités de l'objet",
      my_objects_available_actions: "Actions disponibles",
      my_objects_feature_coming_soon: "Aucune commande spéciale pour cet objet pour le moment.",
      my_objects_feature_coming_soon_sub: "Nous commençons par les lampes et les alarmes, puis nous ajouterons les fonctionnalités des autres objets.",
      my_objects_open_lamp_hint: "Ouvrir les commandes de la lampe",
      my_objects_open_alarm_hint: "Ouvrir les commandes de l'alarme",
      my_objects_open_tv_hint: "Ouvrir la télécommande TV",
      my_objects_open_object_hint: "Ouvrir la fiche de l'objet",
      my_objects_remote_action_success: "Commande envoyée avec succès",
      my_objects_remote_action_error: "Impossible d'exécuter la commande distante",
      my_objects_remote_not_configured: "Commande distante non configurée",
      my_objects_generic_panel_sub: "Consultez la fiche et utilisez les commandes disponibles pour cet objet.",
      my_objects_lamp_panel_sub: "Contrôlez l'éclairage à distance.",
      my_objects_lamp_panel_missing_sub: "Cette lampe n'a pas encore d'endpoint de contrôle.",
      my_objects_lamp_missing_endpoint: "Endpoint lampe manquant",
      my_objects_lamp_missing_endpoint_sub: "Ajoutez un endpoint réseau pour piloter cette lampe.",
      my_objects_lamp_action_help: "Choisissez l'action à envoyer à la lampe.",
      my_objects_lamp_state_on: "Lampe allumée",
      my_objects_lamp_state_off: "Lampe éteinte",
      my_objects_lamp_turn_on: "Allumer",
      my_objects_lamp_turn_off: "Éteindre",
      my_objects_alarm_panel_sub: "Contrôlez l'alarme à distance.",
      my_objects_alarm_panel_missing_sub: "Cette alarme n'a pas encore d'endpoint de contrôle.",
      my_objects_alarm_missing_endpoint: "Endpoint alarme manquant",
      my_objects_alarm_missing_endpoint_sub: "Ajoutez un endpoint réseau pour piloter cette alarme.",
      my_objects_alarm_action_help: "Choisissez l'action à envoyer à l'alarme.",
      my_objects_alarm_state_on: "Alarme activée",
      my_objects_alarm_state_off: "Alarme désactivée",
      my_objects_alarm_turn_on: "Activer",
      my_objects_alarm_turn_off: "Désactiver",
      my_objects_tv_panel_sub: "Contrôlez la télévision à distance.",
      my_objects_tv_panel_missing_sub: "Cette TV n'a pas encore d'endpoint de contrôle.",
      my_objects_tv_missing_endpoint: "Endpoint TV manquant",
      my_objects_tv_missing_endpoint_sub: "Ajoutez un endpoint réseau pour piloter cette TV.",
      my_objects_tv_action_help: "Choisissez une commande TV.",
      my_objects_tv_channels: "Chaînes",
      my_objects_tv_now_playing: "Chaîne actuelle: {channel}",
      my_objects_tv_now_playing_unknown: "Aucune chaîne sélectionnée",
      my_objects_tv_state_ready: "Télécommande prête",
      my_objects_tv_state_channel: "Chaîne: {channel}",
      my_objects_tv_volume_up: "Volume +",
      my_objects_tv_volume_down: "Volume -",
      my_objects_tv_next: "Suivant",
      my_objects_tv_prev: "Précédent",
      my_objects_tv_mute: "Muet",

      // Profil utilisateur
      p1_doc_title: "IntelliBuild - User",
      profile_title: "Mon profil",
      profile_edit: "Modifier mon profil",
      profile_display_name: "Nom affiché",
      profile_email: "Email",
      profile_role_user: "Utilisateur IntelliBuild",
      profile_project_info: "Informations PFE",
      profile_borrowed_objects: "Objets empruntés",
      profile_unread_notifications: "Notifications non lues",
      profile_active_room: "Salle active",
      profile_member_since: "Membre depuis",
      profile_customize_name: "Personnaliser votre nom",
      profile_name_placeholder: "Votre nom affiché",
      profile_save_name: "Enregistrer le nom",
      quick_view_my_objects: "Voir mes objets",
      quick_view_notifications: "Voir notifications",
      history_user_title: "Historique utilisateur",
      history_user_empty_recent: "Aucune activité récente pour votre compte.",
      favorites_title: "Mes favoris",
      reports_title: "Problèmes signalés",
      added_on: "Ajouté le {date}",
      reported_on: "Signalé le {date}",
      report_prompt: 'Décrivez le problème avec "{name}":',
      report_type_damaged: "Objet endommagé",
      report_type_dirty: "Objet sale/contaminé",
      report_type_wrong_position: "Position incorrecte",
      report_type_missing_info: "Information manquante",
      report_type_other: "Autre",

      // Messages
      error_loading: "Erreur lors du chargement",
      success_saved: "Enregistré avec succès",
      success_deleted: "Supprimé avec succès",
      error_required_field: "Ce champ est requis",
      error_network: "Erreur réseau",
      error_missing_token: "Token manquant",
      error_missing_object_id: "Identifiant objet introuvable",
      error_take_object: "Impossible de prendre l'objet",
      error_take_title: "Échec de prise",
      success_object_taken: "Objet pris",
      confirm_delete_object: "Supprimer cet objet ?",
      error_update_object: "Erreur lors de la modification",
      success_update_object: "Objet modifié avec succès",
      error_delete_object: "Erreur lors de la suppression",
      error_delete_object_impossible: "Suppression impossible",
      availability_title: "Disponibilité",
      unavailability_title: "Indisponibilité",
      take_failed_title: "Échec de prise",
      object_taken_title: "Objet pris",
      return_failed_title: "Échec du retour",
      object_returned_title: "Objet retourné",
      connection_title: "Connexion",
      report_title: "Signalement",
      report_sent_title: "Signalement envoyé",
      validation_title: "Validation",
      deletion_title: "Suppression",
      profile_short_title: "Profil",
      favorite_added_message: "{name} ajouté aux favoris",
      favorite_removed_message: "{name} retiré des favoris",
      take_object_failed_named: "Impossible de prendre {name}",
      object_taken_named: "{name} pris",
      availability_message: "{name} est {status}",
      report_success_short: "Problème signalé avec succès",
      report_success_notified: "Problème signalé avec succès. L'admin sera notifié",
      report_deleted: "Signalement supprimé",
      validation_enter_valid_name: "Veuillez saisir un nom valide.",
      reset_success: "Mot de passe mis à jour.",
      reset_error_invalid: "Lien de réinitialisation invalide.",
      reset_error_mismatch: "Les mots de passe ne correspondent pas.",
reset_error_update: "Impossible de mettre à jour le mot de passe.",

      alert_name_required: "Veuillez saisir un nom d'objet.",
      alert_type_required: "Veuillez choisir un type d'objet.",
      alert_location_required: "Veuillez selectionner une salle.",
      alert_object_saved: "Objet enregistré !",
      alert_server_error: "Erreur serveur",
      alert_connection_error: "Erreur de connexion.",
      alert_custom_type_required: "Veuillez saisir le nom du nouveau type.",
      add_step1_title: "Etape 1: Choisissez d'abord un type (ECLAIRAGE, Climatiseur, Camera...)",
      add_step2_title: "Etape 2: Renseignez les details de l'objet",
      add_preview_incomplete: "Apercu: Objet non complete",
      add_progress_start: "Commencez par choisir un type d'objet.",
      add_progress_name: "Ajoutez maintenant un nom clair pour l'identifier rapidement.",
      add_progress_room: "Sélectionnez ensuite la salle ou la zone d'installation.",
      add_progress_desc: "Une petite description rendra la fiche plus utile à l'équipe.",
      add_progress_ready: "La fiche est prête, vous pouvez enregistrer cet objet.",
      add_summary_name_empty: "Non renseigné",
      add_summary_type_empty: "Aucun type choisi",
      add_summary_room_empty: "Aucune localisation",
      add_summary_desc_empty: "Encore vide",
      add_summary_desc_filled: "Complétée",
      history_admin_loading: "Chargement...",
      history_admin_error: "Impossible de charger l'historique admin.",
      role_admin_title: "Role admin",
      role_management: "Gestion",
      role_full_access: "Accès complet.",
      role_stats_access: "Accès stats.",
      toast_location_updated: "Localisation mise a jour",
      label_select_room: "-- Selectionner une salle --",
      param_users: "Utilisateurs",
      param_admins: "Admins",
      param_activity_events: "Événements activité",
      param_history_entries: "Entrées historique",
      param_accounts_visible: "Comptes visibles dans la plateforme.",
      param_profiles_elevated: "Profils avec privilèges élevés.",
      param_user_activity_lines: "Lignes chargées dans le journal utilisateur.",
      param_admin_actions_available: "Actions admin actuellement disponibles.",
      param_session_active: "Session active",
      param_admin_privileges: "ADMIN PRIVILEGES",
      param_sync_pending: "Sync en attente",
      param_user_management: "Gestion des utilisateurs",
      param_user_activity: "Activite utilisateurs",
      param_admin_history: "Historique admin",
      param_edit_admin_profile: "Editer profil admin",
      param_name_label: "Nom:",
      param_email_label: "Email:",
      param_role_label: "Role:",
      param_bio_label: "Bio:",
      param_current_room: "Salle actuelle:",
      param_member_since: "Membre depuis:",
      param_no_users: "Aucun utilisateur trouve.",
      param_no_activity: "Aucune activite utilisateur recente.",
      param_no_history: "Aucun historique pour le moment.",
      param_save: "Enregistrer",
      param_cancel: "Annuler",
      param_display_name: "Nom affiche",
      param_admin_bio: "Bio administrateur...",
      alert_cannot_delete_self: "Vous ne pouvez pas supprimer votre propre compte.",
      alert_cannot_delete_connected: "Vous ne pouvez pas supprimer votre propre compte connecté.",
      alert_user_role_updated: "Role utilisateur mis a jour.",
      alert_user_deleted: "Utilisateur supprimé.",
      alert_invalid_admin_name: "Nom admin invalide.",
      alert_change_role_error: "Impossible de changer le role.",
      alert_delete_user_failed: "Impossible de supprimer l'utilisateur.",
      alert_delete_user_error: "Erreur suppression utilisateur.",
      confirm_change_role: "Confirmer le changement de role vers '{nextRole}' pour {email} ?",
      confirm_delete_user: "Confirmer la suppression définitive de {email} ? Cette action est irréversible.",
      param_refresh_list: "Rafraichir liste",
      param_refresh_activity: "Rafraichir activite",
      param_refresh_history: "Rafraichir historique",
      param_actions_admin: "Actions admin",
      param_edit_objects: "Editer objets",
      param_add_object: "Ajouter objet",
      param_location_map: "Carte localisation",
      param_reset_password: "Reset password",
      param_sign_out: "Sign out",
      param_control_center: "Centre de contrôle et de supervision",
      param_manage_users: "Gestion utilisateurs",
      param_recent_activity: "Activité récente",
      param_quick_actions: "Actions rapides",
      param_account_info: "Infos compte",
      param_personal_history: "Historique personnel",
      param_user_settings: "Parametres utilisateur harmonises avec IntelliBuild.",
      param_modify_name_bio: "Modifiez votre nom affiche et votre bio."
    },

    en: {
      // Global
      brand: "IntelliBuild",
      lang_title: "Language",
      lang_active: "Active language: {code}",
      position_label: "My position:",
      loading: "Loading...",
      no_data: "No data",
      not_defined: "Not set",
      distance_same_room: "0m (same room)",
      close: "Close",
      confirm: "Confirm",
      yes: "Yes",
      no: "No",
      info: "Info",
      success: "Success",
      error: "Error",
      toast_operation_completed: "Operation completed",
      confirm_action_title: "Confirm action",
      confirm_action_text: "Confirm this action?",
      non_specified: "Not specified",
      bio_none: "No bio",

      // Navigation
      nav_home: "Home",
      nav_dashboard: "Dashboard",
      nav_users: "Users",
      nav_add: "Add",
      nav_objects: "Objects",
      nav_my_objects: "My objects",
      nav_locations: "Building plan",
      nav_history: "History",
      nav_notifications: "Notifications",
      nav_documentation: "Documentation",
      nav_settings: "Settings",
      nav_features: "Features",
      nav_about: "About",
      nav_favorites: "Favorites",
      nav_report_issue: "Report a problem",

      // Buttons
      btn_login: "Login",
      btn_register: "Sign up",
      btn_signin: "Sign in",
      btn_signup: "Create account",
      btn_refresh: "Refresh",
      btn_back_dashboard: "Back to dashboard",
      btn_mark_all_read: "Mark all as read",
      btn_mark_read: "Mark as read",
      btn_verify: "Verify",
      btn_verify_status: "Check status",
      btn_verify_first: "Check first",
      btn_update_password: "Update password",
      btn_view_docs: "View docs",
      btn_cancel: "Cancel",
      btn_save: "Save object",
      btn_delete: "Delete",
      btn_edit: "Edit",
      btn_borrow: "Borrow",
      btn_return: "Return",
      btn_user_guide: "User guide",
      btn_add_favorites: "Add to favorites",
      btn_remove_favorites: "Remove from favorites",

      // Labels and placeholders
      label_email: "Email",
      label_password: "Password",
      label_new_password: "New password",
      label_confirm_password: "Confirm password",
      label_object_name: "Object name",
      label_object_type: "Object type",
      label_object_location: "Location",
      label_description: "Description",

      ph_email: "example@mail.com",
      ph_password: "••••••••",
      ph_confirm_password: "••••••••",
      ph_object_name: "Example: LIGHTING Office C-12",
      search_objects: "Search for an object...",

      // User menu
      menu_profile: "My profile",
      logout: "Sign out",
      connected_as_admin: "Connected as admin",
      connected_as_user: "Connected as user",
      connected_space: "Connected area",

      // Tables
      table_name: "Name",
      table_type: "Type",
      table_location: "Location",
      table_status: "Status",
      table_actions: "Actions",
      table_action: "Action",
      table_taken_on: "Taken on",

      // Notifications
      unread_label: "Unread:",
      notifications_user_doc_title: "User notifications - IntelliBuild",
      notifications_admin_doc_title: "Admin notifications - IntelliBuild",
      notifications_user_title: "User notifications",
      notifications_user_sub: "Personal channel: your borrows, returns and useful messages.",
      notifications_admin_title: "Admin notifications",
      notifications_admin_sub: "Channel reserved for administration actions and alerts.",
      notifications_user_empty: "No user notifications yet.",
      notifications_admin_empty: "No admin notifications yet.",
      notification_default_title: "Notification",
      notif_history_error: "Unable to load history.",
      notif_mark_all_error: "Unable to mark notifications.",

      // My objects
      my_objects_doc_title: "My objects - IntelliBuild",
      my_objects_title: "My objects",
      my_objects_sub: "Objects you borrowed and can return",
      my_objects_empty: "You do not have any borrowed object.",
      user_recent_objects: "Recent objects",

      // Stats
      stat_total: "Total objects",
      stat_active: "Active",
      stat_inactive: "Inactive",
      stat_locations: "Locations",
      stat_locations_suffix: "unique rooms",

      // Home page
      home_doc_title: "IntelliBuild – Smart Objects",
      title: "Smart platform<br>for connected object management",
      subtitle: "A modern solution to describe, manage, secure and search connected objects inside a smart building.",
      start: "Get started",
      discover: "Discover",

      feature1_title: "Management",
      feature1_text: "Add, edit and delete your connected objects easily.",
      feature2_title: "Security",
      feature2_text: "Access control, data protection and smart monitoring.",
      feature3_title: "Search",
      feature3_text: "Fast search by type, location or object status.",

      badge_centralized: "Centralized management",
      badge_fast_search: "Fast search",
      badge_smooth_experience: "Smooth experience",

      hero_panel_label: "Smart Building",
      hero_panel_title: "A clearer interface to control all your objects.",
      hero_panel_text: "Inventory, location, security and visibility gathered in one experience.",

      mini_inventory: "Inventory",
      mini_centralized: "Centralized",
      mini_search: "Search",
      mini_instant: "Instant",
      mini_tracking: "Tracking",
      mini_visible: "Visible",
      mini_design: "Design",
      mini_modern: "Modern",

      stat_text_1: "clear spaces to view, locate and track objects without losing focus.",
      stat_text_2: "one platform to centralize inventory, search and visibility in the smart building.",
      stat_text_3: "an interface designed for project demonstration as well as daily use.",

      why_title: "A clearer journey",
      why_1_title: "Understand quickly",
      why_1_text: "From the homepage, the user immediately sees what IntelliBuild does, what can be managed and where to begin.",
      why_2_title: "Act without friction",
      why_2_text: "Login, dashboard, objects and locations follow one another in a simpler and more readable flow.",
      why_3_title: "Show the project",
      why_3_text: "The homepage highlights the PFE value with a cleaner, more modern and more convincing design.",

      about_title: "Why IntelliBuild?",
      about_text: "IntelliBuild centralizes connected object management in a smart building to improve efficiency, security and visibility.",
      footer_rights: "© 2026 IntelliBuild. All rights reserved.",

      // Authentication
      about_doc_title: "About - IntelliBuild",
      login_doc_title: "Login - IntelliBuild",
      login_title: "Login",
      login_sub: "Access your Smart Building platform",
      forgot_password: "Forgot password?",
      auth_link_login: 'Already have an account? <a href="login.html">Sign in</a>',

      register_doc_title: "Sign up - IntelliBuild",
      register_title: "Create an account",
      register_sub: "Join the IntelliBuild platform",
      auth_link_register: 'Don\'t have an account? <a href="register.html">Sign up</a>',

      reset_doc_title: "Reset password - IntelliBuild",
      reset_title: "Reset password",
      reset_sub: "Choose a new password.",

      // Add object
      add_object_title: "Add an object",
      add_object_sub: "Fill in the device information",
      add_object_name: "Object name",
      add_object_type: "Object type",
      add_object_location: "Location",
      add_object_description: "Description",
      add_object_endpoint: "Endpoint (optional)",

      // Objects and details
      objects_all: "All objects",
      new_object: "New object",
      detail_overlay_title: "Object details",
      detail_name: "Name",
      detail_type: "Type",
      detail_location: "Location",
      detail_status: "Status",
      distance_label: "Distance",
      detail_description: "Description",
      object_sheet: "Object sheet",
      unnamed_object: "Unnamed object",
      status_pending_check: "Pending check",
      object_description_empty: "No description available.",
      object_edit_title: "Edit object",

      // History, roles and statuses
      history_admin_title: "Admin history",
      user_activity_title: "User activity",
      history_loading: "Loading...",
      history_empty_admin: "No history yet.",
      history_empty_user_activity: "No recent user activity.",
      history_date: "Date",
      history_action: "Action",
      history_detail: "Detail",
      history_status: "Status",
      nav_role: "Role",
      role_overlay_title: "Role",
      role_admin_chip: "Admin",
      role_admin_manage_title: "Management",
      role_admin_manage_text: "Full access.",
      role_manage_objects_title: "Object management",
      role_manage_objects_text: "Can add, edit and delete connected objects.",
      role_supervision_title: "Supervision",
      role_supervision_text: "Can view locations and global statistics.",
      role_administration_title: "Administration",
      role_administration_text: "Can manage settings and advanced actions.",
      admin_action_default: "Admin - Action",
      admin_action_users: "Admin - User management",
      admin_action_session: "Admin - Session",
      admin_action_profile: "Admin - Profile",
      admin_action_navigation: "Admin - Navigation",
      status_available: "Available",
      status_in_use: "In use",
      status_unavailable: "Unavailable",
      status_active_label: "Active",
      status_inactive_label: "Inactive",

      // User commands
      my_objects_counter_singular: "{count} active object",
      my_objects_counter_plural: "{count} active objects",
      confirm_return_object: "Do you really want to return object {id}?",
      object_check_first_title: "Check the object status first.",
      object_check_first_copy: "Click Check status. If the object is available, you will then be able to take it.",
      object_same_room_note: "Object available in your current room.",
      status_already_taken_by_you: "Already taken (you)",
      object_already_yours_title: "This object is currently in your use.",
      object_already_yours_copy: "You currently have this object. Return it when you are finished.",
      object_in_use_title: "This object is already taken.",
      object_in_use_copy: "This object is currently in use. You cannot take it right now.",
      object_available_title: "Do you want to take this object?",
      object_available_copy: "Status checked: available. You can now take the object.",
      object_unavailable_title: "This object is not available to take right now.",
      object_unavailable_copy: "Status checked: unavailable. You cannot take it at the moment.",
      btn_take_object: "Take it",
      return_impossible: "Return unavailable",
      object_returned: "Object returned",
      my_objects_load_error: "Unable to load your objects",
      my_objects_feature_title: "Object features",
      my_objects_available_actions: "Available actions",
      my_objects_feature_coming_soon: "No special command for this object yet.",
      my_objects_feature_coming_soon_sub: "We start with lamps and alarms, then we will add features for other objects.",
      my_objects_open_lamp_hint: "Open lamp controls",
      my_objects_open_alarm_hint: "Open alarm controls",
      my_objects_open_tv_hint: "Open the TV remote",
      my_objects_open_object_hint: "Open the object sheet",
      my_objects_remote_action_success: "Command sent successfully",
      my_objects_remote_action_error: "Unable to run the remote command",
      my_objects_remote_not_configured: "Remote command not configured",
      my_objects_generic_panel_sub: "View the sheet and use the available commands for this object.",
      my_objects_lamp_panel_sub: "Control the lighting remotely.",
      my_objects_lamp_panel_missing_sub: "This lamp does not have a control endpoint yet.",
      my_objects_lamp_missing_endpoint: "Missing lamp endpoint",
      my_objects_lamp_missing_endpoint_sub: "Add a network endpoint to control this lamp.",
      my_objects_lamp_action_help: "Choose the action to send to the lamp.",
      my_objects_lamp_state_on: "Lamp on",
      my_objects_lamp_state_off: "Lamp off",
      my_objects_lamp_turn_on: "Turn on",
      my_objects_lamp_turn_off: "Turn off",
      my_objects_alarm_panel_sub: "Control the alarm remotely.",
      my_objects_alarm_panel_missing_sub: "This alarm does not have a control endpoint yet.",
      my_objects_alarm_missing_endpoint: "Missing alarm endpoint",
      my_objects_alarm_missing_endpoint_sub: "Add a network endpoint to control this alarm.",
      my_objects_alarm_action_help: "Choose the action to send to the alarm.",
      my_objects_alarm_state_on: "Alarm enabled",
      my_objects_alarm_state_off: "Alarm disabled",
      my_objects_alarm_turn_on: "Enable",
      my_objects_alarm_turn_off: "Disable",
      my_objects_tv_panel_sub: "Control the TV remotely.",
      my_objects_tv_panel_missing_sub: "This TV does not have a control endpoint yet.",
      my_objects_tv_missing_endpoint: "Missing TV endpoint",
      my_objects_tv_missing_endpoint_sub: "Add a network endpoint to control this TV.",
      my_objects_tv_action_help: "Choose a TV command.",
      my_objects_tv_channels: "Channels",
      my_objects_tv_now_playing: "Current channel: {channel}",
      my_objects_tv_now_playing_unknown: "No channel selected",
      my_objects_tv_state_ready: "Remote ready",
      my_objects_tv_state_channel: "Channel: {channel}",
      my_objects_tv_volume_up: "Volume +",
      my_objects_tv_volume_down: "Volume -",
      my_objects_tv_next: "Next",
      my_objects_tv_prev: "Previous",
      my_objects_tv_mute: "Mute",

      // User profile
      p1_doc_title: "IntelliBuild - User",
      profile_title: "My profile",
      profile_edit: "Edit my profile",
      profile_display_name: "Display name",
      profile_email: "Email",
      profile_role_user: "IntelliBuild user",
      profile_project_info: "Project information",
      profile_borrowed_objects: "Borrowed objects",
      profile_unread_notifications: "Unread notifications",
      profile_active_room: "Active room",
      profile_member_since: "Member since",
      profile_customize_name: "Customize your name",
      profile_name_placeholder: "Your display name",
      profile_save_name: "Save name",
      quick_view_my_objects: "View my objects",
      quick_view_notifications: "View notifications",
      history_user_title: "User history",
      history_user_empty_recent: "No recent activity for your account.",
      favorites_title: "My favorites",
      reports_title: "Reported issues",
      added_on: "Added on {date}",
      reported_on: "Reported on {date}",
      report_prompt: 'Describe the issue with "{name}":',
      report_type_damaged: "Damaged object",
      report_type_dirty: "Dirty/contaminated object",
      report_type_wrong_position: "Wrong position",
      report_type_missing_info: "Missing information",
      report_type_other: "Other",

      // Messages
      error_loading: "Error loading data",
      success_saved: "Saved successfully",
      success_deleted: "Deleted successfully",
      error_required_field: "This field is required",
      error_network: "Network error",
      error_missing_token: "Missing token",
      error_missing_object_id: "Object identifier not found",
      error_take_object: "Unable to borrow the object",
      error_take_title: "Borrow failed",
      success_object_taken: "Object borrowed",
      confirm_delete_object: "Delete this object?",
      error_update_object: "Error while updating",
      success_update_object: "Object updated successfully",
      error_delete_object: "Error while deleting",
      error_delete_object_impossible: "Deletion not possible",
      availability_title: "Availability",
      unavailability_title: "Unavailability",
      take_failed_title: "Borrow failed",
      object_taken_title: "Object borrowed",
      return_failed_title: "Return failed",
      object_returned_title: "Object returned",
      connection_title: "Connection",
      report_title: "Report",
      report_sent_title: "Report sent",
      validation_title: "Validation",
      deletion_title: "Deletion",
      profile_short_title: "Profile",
      favorite_added_message: "{name} added to favorites",
      favorite_removed_message: "{name} removed from favorites",
      take_object_failed_named: "Unable to borrow {name}",
      object_taken_named: "{name} borrowed",
      availability_message: "{name} is {status}",
      report_success_short: "Problem reported successfully",
      report_success_notified: "Problem reported successfully. The admin will be notified",
      report_deleted: "Report deleted",
      validation_enter_valid_name: "Please enter a valid name.",
      reset_success: "Password updated.",
      reset_error_invalid: "Invalid reset link.",
      reset_error_mismatch: "Passwords do not match.",
reset_error_update: "Unable to update password.",

      alert_name_required: "Please enter an object name.",
      alert_type_required: "Please choose an object type.",
      alert_location_required: "Please select a room.",
      alert_object_saved: "Object saved!",
      alert_server_error: "Server error",
      alert_connection_error: "Connection error.",
      alert_custom_type_required: "Please enter the new type name.",
      add_step1_title: "Step 1: First choose a type (LIGHTING, Air conditioner, Camera...)",
      add_step2_title: "Step 2: Fill in object details",
      add_preview_incomplete: "Preview: incomplete object",
      add_progress_start: "Start by choosing an object type.",
      add_progress_name: "Now add a clear name to identify it quickly.",
      add_progress_room: "Then select the room or installation area.",
      add_progress_desc: "A short description will make the sheet more useful to the team.",
      add_progress_ready: "The sheet is ready, you can save this object.",
      add_summary_name_empty: "Not provided",
      add_summary_type_empty: "No type selected",
      add_summary_room_empty: "No location",
      add_summary_desc_empty: "Still empty",
      add_summary_desc_filled: "Completed",
      history_admin_loading: "Loading...",
      history_admin_error: "Unable to load admin history.",
      role_admin_title: "Admin role",
      role_management: "Management",
      role_full_access: "Full access.",
      role_stats_access: "Stats access.",
      toast_location_updated: "Location updated",
      label_select_room: "-- Select a room --",
      param_users: "Users",
      param_admins: "Admins",
      param_activity_events: "Activity events",
      param_history_entries: "History entries",
      param_accounts_visible: "Accounts visible in the platform.",
      param_profiles_elevated: "Profiles with elevated privileges.",
      param_user_activity_lines: "Lines loaded in the user activity log.",
      param_admin_actions_available: "Admin actions currently available.",
      param_session_active: "Active session",
      param_admin_privileges: "ADMIN PRIVILEGES",
      param_sync_pending: "Pending sync",
      param_user_management: "User management",
      param_user_activity: "User activity",
      param_admin_history: "Admin history",
      param_edit_admin_profile: "Edit admin profile",
      param_name_label: "Name:",
      param_email_label: "Email:",
      param_role_label: "Role:",
      param_bio_label: "Bio:",
      param_current_room: "Current room:",
      param_member_since: "Member since:",
      param_no_users: "No user found.",
      param_no_activity: "No recent user activity.",
      param_no_history: "No history yet.",
      param_save: "Save",
      param_cancel: "Cancel",
      param_display_name: "Display name",
      param_admin_bio: "Administrator bio...",
      alert_cannot_delete_self: "You cannot delete your own account.",
      alert_cannot_delete_connected: "You cannot delete your own connected account.",
      alert_user_role_updated: "User role updated.",
      alert_user_deleted: "User deleted.",
      alert_invalid_admin_name: "Invalid admin name.",
      alert_change_role_error: "Unable to change role.",
      alert_delete_user_failed: "Unable to delete user.",
      alert_delete_user_error: "User deletion error.",
      confirm_change_role: "Confirm role change to '{nextRole}' for {email}?",
      confirm_delete_user: "Confirm permanent deletion of {email}? This action is irreversible.",
      param_refresh_list: "Refresh list",
      param_refresh_activity: "Refresh activity",
      param_refresh_history: "Refresh history",
      param_actions_admin: "Admin actions",
      param_edit_objects: "Edit objects",
      param_add_object: "Add object",
      param_location_map: "Location map",
      param_reset_password: "Reset password",
      param_sign_out: "Sign out",
      param_control_center: "Control and supervision center",
      param_manage_users: "User management",
      param_recent_activity: "Recent activity",
      param_quick_actions: "Quick actions",
      param_account_info: "Account info",
      param_personal_history: "Personal history",
      param_user_settings: "User settings harmonized with IntelliBuild.",
      param_modify_name_bio: "Edit your display name and bio."
    },

    ar: {
      // Global
      brand: "IntelliBuild",
      lang_title: "اللغة",
      lang_active: "اللغة النشطة: {code}",
      position_label: "موقعي:",
      loading: "جاري التحميل...",
      no_data: "لا توجد بيانات",
      not_defined: "غير محددة",
      distance_same_room: "0م (نفس القاعة)",
      close: "إغلاق",
      confirm: "تأكيد",
      yes: "نعم",
      no: "لا",
      info: "معلومة",
      success: "نجاح",
      error: "خطأ",
      toast_operation_completed: "اكتملت العملية",
      confirm_action_title: "تأكيد الإجراء",
      confirm_action_text: "هل تريد تأكيد هذا الإجراء؟",
      non_specified: "غير محدد",
      bio_none: "لا توجد نبذة",

      // Navigation
      nav_home: "الرئيسية",
      nav_dashboard: "لوحة التحكم",
      nav_users: "المستخدمون",
      nav_add: "إضافة",
      nav_objects: "الأجهزة",
      nav_my_objects: "أجهزتي",
      nav_locations: "مخطط المبنى",
      nav_history: "السجل",
      nav_notifications: "الإشعارات",
      nav_documentation: "التوثيق",
      nav_settings: "الإعدادات",
      nav_features: "الميزات",
      nav_about: "حول",
      nav_favorites: "المفضلة",
      nav_report_issue: "الإبلاغ عن مشكلة",

      // Buttons
      btn_login: "تسجيل الدخول",
      btn_register: "إنشاء حساب",
      btn_signin: "دخول",
      btn_signup: "تسجيل",
      btn_refresh: "تحديث",
      btn_back_dashboard: "العودة إلى لوحة التحكم",
      btn_mark_all_read: "تعليم الكل كمقروء",
      btn_mark_read: "تعليم كمقروء",
      btn_verify: "تحقق",
      btn_verify_status: "تحقق من الحالة",
      btn_verify_first: "تحقق أولاً",
      btn_update_password: "تحديث كلمة المرور",
      btn_view_docs: "عرض التوثيق",
      btn_cancel: "إلغاء",
      btn_save: "حفظ الجهاز",
      btn_delete: "حذف",
      btn_edit: "تعديل",
      btn_borrow: "استعارة",
      btn_return: "إرجاع",
      btn_user_guide: "دليل الاستخدام",
      btn_add_favorites: "إضافة إلى المفضلة",
      btn_remove_favorites: "إزالة من المفضلة",

      // Labels and placeholders
      label_email: "البريد الإلكتروني",
      label_password: "كلمة المرور",
      label_new_password: "كلمة المرور الجديدة",
      label_confirm_password: "تأكيد كلمة المرور",
      label_object_name: "اسم الجهاز",
      label_object_type: "نوع الجهاز",
      label_object_location: "الموقع",
      label_description: "الوصف",

      ph_email: "example@mail.com",
      ph_password: "••••••••",
      ph_confirm_password: "••••••••",
      ph_object_name: "مثال: إضاءة مكتب C-12",
      search_objects: "البحث عن جهاز...",

      // User menu
      menu_profile: "ملفي الشخصي",
      logout: "تسجيل الخروج",
      connected_as_admin: "متصل كمسؤول",
      connected_as_user: "متصل كمستخدم",
      connected_space: "مساحة متصلة",

      // Tables
      table_name: "الاسم",
      table_type: "النوع",
      table_location: "الموقع",
      table_status: "الحالة",
      table_actions: "الإجراءات",
      table_action: "الإجراء",
      table_taken_on: "تاريخ الأخذ",

      // Notifications
      unread_label: "غير المقروءة:",
      notifications_user_doc_title: "إشعارات المستخدم - إنتيليبيلد",
      notifications_admin_doc_title: "إشعارات المسؤول - إنتيليبيلد",
      notifications_user_title: "إشعارات المستخدم",
      notifications_user_sub: "قناة شخصية: الاستعارات والإرجاعات والرسائل المفيدة.",
      notifications_admin_title: "إشعارات المسؤول",
      notifications_admin_sub: "قناة مخصصة لإجراءات الإدارة والتنبيهات.",
      notifications_user_empty: "لا توجد إشعارات للمستخدم حاليًا.",
      notifications_admin_empty: "لا توجد إشعارات إدارية حاليًا.",
      notification_default_title: "إشعار",
      notif_history_error: "تعذر تحميل السجل.",
      notif_mark_all_error: "تعذر تعليم الإشعارات.",

      // My objects
      my_objects_doc_title: "أجهزتي - إنتيليبيلد",
      my_objects_title: "أجهزتي",
      my_objects_sub: "الأجهزة التي استعرتها ويمكنك إرجاعها",
      my_objects_empty: "ليس لديك أي جهاز مستعار.",
      user_recent_objects: "الأجهزة الأخيرة",

      // Stats
      stat_total: "إجمالي الأجهزة",
      stat_active: "نشطة",
      stat_inactive: "غير نشطة",
      stat_locations: "المواقع",
      stat_locations_suffix: "غرف مميزة",

      // Home page
      home_doc_title: "إنتيليبيلد – أشياء ذكية",
      title: "منصة ذكية<br>لإدارة الأجهزة المتصلة",
      subtitle: "حل حديث لوصف وإدارة وتأمين والبحث عن الأجهزة المتصلة داخل مبنى ذكي.",
      start: "ابدأ الآن",
      discover: "اكتشف",

      feature1_title: "الإدارة",
      feature1_text: "أضف وعدّل واحذف أجهزتك المتصلة بسهولة.",
      feature2_title: "الأمان",
      feature2_text: "التحكم في الوصول وحماية البيانات والمراقبة الذكية.",
      feature3_title: "البحث",
      feature3_text: "بحث سريع حسب النوع أو الموقع أو حالة الجهاز.",

      badge_centralized: "إدارة مركزية",
      badge_fast_search: "بحث سريع",
      badge_smooth_experience: "تجربة سلسة",

      hero_panel_label: "مبنى ذكي",
      hero_panel_title: "واجهة أوضح للتحكم في جميع أجهزتك.",
      hero_panel_text: "الجرد والموقع والأمان والرؤية في تجربة واحدة.",

      mini_inventory: "الجرد",
      mini_centralized: "مركزي",
      mini_search: "البحث",
      mini_instant: "فوري",
      mini_tracking: "التتبع",
      mini_visible: "واضح",
      mini_design: "التصميم",
      mini_modern: "حديث",

      stat_text_1: "مساحات واضحة لعرض الأجهزة وتحديد مواقعها ومتابعتها دون تعقيد.",
      stat_text_2: "منصة واحدة لتجميع الجرد والبحث والرؤية داخل المبنى الذكي.",
      stat_text_3: "واجهة مصممة لعرض المشروع وللاستخدام اليومي أيضًا.",

      why_title: "مسار أوضح",
      why_1_title: "فهم سريع",
      why_1_text: "من الصفحة الرئيسية يرى المستخدم بسرعة ما الذي يقدمه IntelliBuild وما الذي يمكنه إدارته ومن أين يبدأ.",
      why_2_title: "استخدام بلا تعقيد",
      why_2_text: "تسجيل الدخول ولوحة التحكم والأجهزة والمواقع تتسلسل في مسار أبسط وأكثر وضوحًا.",
      why_3_title: "إبراز المشروع",
      why_3_text: "تعرض الصفحة الرئيسية قيمة مشروع التخرج بشكل أنظف وأحدث وأكثر إقناعًا.",

      about_title: "لماذا إنتيليبيلد؟",
      about_text: "يوحد IntelliBuild إدارة الأجهزة المتصلة داخل مبنى ذكي لتحسين الكفاءة والأمان والرؤية.",
      footer_rights: "© 2026 إنتيليبيلد. جميع الحقوق محفوظة.",

      // Authentication
      about_doc_title: "حول - إنتيليبيلد",
      login_doc_title: "تسجيل الدخول - إنتيليبيلد",
      login_title: "تسجيل الدخول",
      login_sub: "الوصول إلى منصة المبنى الذكي الخاصة بك",
      forgot_password: "هل نسيت كلمة المرور؟",
      auth_link_login: 'هل لديك حساب بالفعل؟ <a href="login.html">سجل الدخول</a>',

      register_doc_title: "التسجيل - إنتيليبيلد",
      register_title: "إنشاء حساب",
      register_sub: "انضم إلى منصة إنتيليبيلد",
      auth_link_register: 'ليس لديك حساب؟ <a href="register.html">سجل الآن</a>',

      reset_doc_title: "إعادة تعيين كلمة المرور - إنتيليبيلد",
      reset_title: "إعادة تعيين كلمة المرور",
      reset_sub: "اختر كلمة مرور جديدة.",

      // Add object
      add_object_title: "إضافة جهاز",
      add_object_sub: "املأ معلومات الجهاز",
      add_object_name: "اسم الجهاز",
      add_object_type: "نوع الجهاز",
      add_object_location: "الموقع",
      add_object_description: "الوصف",
      add_object_endpoint: "نقطة النهاية (اختياري)",

      // Objects and details
      objects_all: "كل الأجهزة",
      new_object: "جهاز جديد",
      detail_overlay_title: "تفاصيل الجهاز",
      detail_name: "الاسم",
      detail_type: "النوع",
      detail_location: "الموقع",
      detail_status: "الحالة",
      distance_label: "المسافة",
      detail_description: "الوصف",
      object_sheet: "بطاقة الجهاز",
      unnamed_object: "جهاز بلا اسم",
      status_pending_check: "بانتظار التحقق",
      object_description_empty: "لا يوجد وصف متاح.",
      object_edit_title: "تعديل الجهاز",

      // History, roles and statuses
      history_admin_title: "سجل المسؤول",
      user_activity_title: "نشاط المستخدم",
      history_loading: "جاري التحميل...",
      history_empty_admin: "لا يوجد سجل حاليًا.",
      history_empty_user_activity: "لا يوجد نشاط مستخدم حديث.",
      history_date: "التاريخ",
      history_action: "الإجراء",
      history_detail: "التفاصيل",
      history_status: "الحالة",
      nav_role: "الدور",
      role_overlay_title: "الدور",
      role_admin_chip: "مسؤول",
      role_admin_manage_title: "الإدارة",
      role_admin_manage_text: "وصول كامل.",
      role_manage_objects_title: "إدارة الأجهزة",
      role_manage_objects_text: "يمكنه إضافة الأجهزة المتصلة وتعديلها وحذفها.",
      role_supervision_title: "المراقبة",
      role_supervision_text: "يمكنه عرض المواقع والإحصاءات العامة.",
      role_administration_title: "الإدارة المتقدمة",
      role_administration_text: "يمكنه إدارة الإعدادات والإجراءات المتقدمة.",
      admin_action_default: "مسؤول - إجراء",
      admin_action_users: "مسؤول - إدارة المستخدمين",
      admin_action_session: "مسؤول - الجلسة",
      admin_action_profile: "مسؤول - الملف الشخصي",
      admin_action_navigation: "مسؤول - التنقل",
      status_available: "متاح",
      status_in_use: "قيد الاستخدام",
      status_unavailable: "غير متاح",
      status_active_label: "نشط",
      status_inactive_label: "غير نشط",

      // User commands
      my_objects_counter_singular: "{count} جهاز قيد الاستخدام",
      my_objects_counter_plural: "{count} أجهزة قيد الاستخدام",
      confirm_return_object: "هل تريد فعلاً إرجاع الجهاز {id}؟",
      object_check_first_title: "تحقق أولاً من حالة الجهاز.",
      object_check_first_copy: "اضغط على تحقق من الحالة. إذا كان الجهاز متاحًا، يمكنك أخذه بعد ذلك.",
      object_same_room_note: "الجهاز متاح في قاعتك الحالية.",
      status_already_taken_by_you: "مأخوذ مسبقًا (أنت)",
      object_already_yours_title: "هذا الجهاز قيد استخدامك.",
      object_already_yours_copy: "لديك هذا الجهاز حاليًا. أرجعه عند الانتهاء.",
      object_in_use_title: "هذا الجهاز مأخوذ بالفعل.",
      object_in_use_copy: "هذا الجهاز قيد الاستخدام حاليًا. لا يمكنك أخذه الآن.",
      object_available_title: "هل تريد أخذ هذا الجهاز؟",
      object_available_copy: "تم التحقق من الحالة: متاح. يمكنك الآن أخذ الجهاز.",
      object_unavailable_title: "هذا الجهاز غير متاح للأخذ حاليًا.",
      object_unavailable_copy: "تم التحقق من الحالة: غير متاح. لا يمكنك أخذه الآن.",
      btn_take_object: "سآخذه",
      return_impossible: "تعذر الإرجاع",
      object_returned: "تم إرجاع الجهاز",
      my_objects_load_error: "تعذر تحميل أجهزتك",
      my_objects_feature_title: "ميزات الجهاز",
      my_objects_available_actions: "الإجراءات المتاحة",
      my_objects_feature_coming_soon: "لا توجد أوامر خاصة لهذا الجهاز حاليًا.",
      my_objects_feature_coming_soon_sub: "نبدأ بالمصابيح والإنذارات، ثم نضيف ميزات الأجهزة الأخرى.",
      my_objects_open_lamp_hint: "فتح أوامر المصباح",
      my_objects_open_alarm_hint: "فتح أوامر الإنذار",
      my_objects_open_tv_hint: "فتح جهاز التحكم بالتلفاز",
      my_objects_open_object_hint: "فتح بطاقة الجهاز",
      my_objects_remote_action_success: "تم إرسال الأمر بنجاح",
      my_objects_remote_action_error: "تعذر تنفيذ الأمر عن بعد",
      my_objects_remote_not_configured: "الأمر عن بعد غير مهيأ",
      my_objects_generic_panel_sub: "اطلع على البطاقة واستخدم الأوامر المتاحة لهذا الجهاز.",
      my_objects_lamp_panel_sub: "تحكم في الإضاءة عن بعد.",
      my_objects_lamp_panel_missing_sub: "لا يملك هذا المصباح نقطة تحكم بعد.",
      my_objects_lamp_missing_endpoint: "نقطة المصباح مفقودة",
      my_objects_lamp_missing_endpoint_sub: "أضف نقطة شبكة للتحكم في هذا المصباح.",
      my_objects_lamp_action_help: "اختر الإجراء المراد إرساله إلى المصباح.",
      my_objects_lamp_state_on: "المصباح يعمل",
      my_objects_lamp_state_off: "المصباح مطفأ",
      my_objects_lamp_turn_on: "تشغيل",
      my_objects_lamp_turn_off: "إيقاف",
      my_objects_alarm_panel_sub: "تحكم في الإنذار عن بعد.",
      my_objects_alarm_panel_missing_sub: "لا يملك هذا الإنذار نقطة تحكم بعد.",
      my_objects_alarm_missing_endpoint: "نقطة الإنذار مفقودة",
      my_objects_alarm_missing_endpoint_sub: "أضف نقطة شبكة للتحكم في هذا الإنذار.",
      my_objects_alarm_action_help: "اختر الإجراء المراد إرساله إلى الإنذار.",
      my_objects_alarm_state_on: "الإنذار مفعل",
      my_objects_alarm_state_off: "الإنذار معطل",
      my_objects_alarm_turn_on: "تفعيل",
      my_objects_alarm_turn_off: "تعطيل",
      my_objects_tv_panel_sub: "تحكم في التلفاز عن بعد.",
      my_objects_tv_panel_missing_sub: "لا يملك هذا التلفاز نقطة تحكم بعد.",
      my_objects_tv_missing_endpoint: "نقطة التلفاز مفقودة",
      my_objects_tv_missing_endpoint_sub: "أضف نقطة شبكة للتحكم في هذا التلفاز.",
      my_objects_tv_action_help: "اختر أمر التلفاز.",
      my_objects_tv_channels: "القنوات",
      my_objects_tv_now_playing: "القناة الحالية: {channel}",
      my_objects_tv_now_playing_unknown: "لم يتم اختيار قناة",
      my_objects_tv_state_ready: "جهاز التحكم جاهز",
      my_objects_tv_state_channel: "القناة: {channel}",
      my_objects_tv_volume_up: "رفع الصوت",
      my_objects_tv_volume_down: "خفض الصوت",
      my_objects_tv_next: "التالي",
      my_objects_tv_prev: "السابق",
      my_objects_tv_mute: "كتم الصوت",

      // User profile
      p1_doc_title: "إنتيليبيلد - المستخدم",
      profile_title: "ملفي الشخصي",
      profile_edit: "تعديل ملفي الشخصي",
      profile_display_name: "اسم العرض",
      profile_email: "البريد الإلكتروني",
      profile_role_user: "مستخدم IntelliBuild",
      profile_project_info: "معلومات المشروع",
      profile_borrowed_objects: "الأجهزة المستعارة",
      profile_unread_notifications: "الإشعارات غير المقروءة",
      profile_active_room: "القاعة النشطة",
      profile_member_since: "عضو منذ",
      profile_customize_name: "تخصيص اسمك",
      profile_name_placeholder: "اسم العرض الخاص بك",
      profile_save_name: "حفظ الاسم",
      quick_view_my_objects: "عرض أجهزتي",
      quick_view_notifications: "عرض الإشعارات",
      history_user_title: "سجل المستخدم",
      history_user_empty_recent: "لا يوجد نشاط حديث لحسابك.",
      favorites_title: "مفضلتي",
      reports_title: "المشكلات المبلّغ عنها",
      added_on: "أضيف في {date}",
      reported_on: "تم الإبلاغ في {date}",
      report_prompt: 'صف المشكلة المتعلقة بـ "{name}":',
      report_type_damaged: "جهاز تالف",
      report_type_dirty: "جهاز متسخ/ملوث",
      report_type_wrong_position: "موقع غير صحيح",
      report_type_missing_info: "معلومات ناقصة",
      report_type_other: "أخرى",

      // Messages
      error_loading: "خطأ في تحميل البيانات",
      success_saved: "تم الحفظ بنجاح",
      success_deleted: "تم الحذف بنجاح",
      error_required_field: "هذا الحقل مطلوب",
      error_network: "خطأ في الشبكة",
      error_missing_token: "الرمز مفقود",
      error_missing_object_id: "لم يتم العثور على معرف الجهاز",
      error_take_object: "تعذر استعارة الجهاز",
      error_take_title: "فشل الاستعارة",
      success_object_taken: "تمت استعارة الجهاز",
      confirm_delete_object: "حذف هذا الجهاز؟",
      error_update_object: "حدث خطأ أثناء التعديل",
      success_update_object: "تم تحديث الجهاز بنجاح",
      error_delete_object: "حدث خطأ أثناء الحذف",
      error_delete_object_impossible: "الحذف غير ممكن",
      availability_title: "التوفر",
      unavailability_title: "عدم التوفر",
      take_failed_title: "فشل الاستعارة",
      object_taken_title: "تمت الاستعارة",
      return_failed_title: "فشل الإرجاع",
      object_returned_title: "تم الإرجاع",
      connection_title: "الاتصال",
      report_title: "بلاغ",
      report_sent_title: "تم إرسال البلاغ",
      validation_title: "التحقق",
      deletion_title: "الحذف",
      profile_short_title: "الملف الشخصي",
      favorite_added_message: "تمت إضافة {name} إلى المفضلة",
      favorite_removed_message: "تمت إزالة {name} من المفضلة",
      take_object_failed_named: "تعذر استعارة {name}",
      object_taken_named: "تمت استعارة {name}",
      availability_message: "حالة {name}: {status}",
      report_success_short: "تم الإبلاغ عن المشكلة بنجاح",
      report_success_notified: "تم الإبلاغ عن المشكلة بنجاح. سيتم إشعار المسؤول",
      report_deleted: "تم حذف البلاغ",
      validation_enter_valid_name: "يرجى إدخال اسم صالح.",
      reset_success: "تم تحديث كلمة المرور.",
      reset_error_invalid: "رابط إعادة التعيين غير صالح.",
      reset_error_mismatch: "كلمتا المرور غير متطابقتين.",
reset_error_update: "تعذر تحديث كلمة المرور.",

      alert_name_required: "يرجى إدخال اسم الجهاز.",
      alert_type_required: "يرجى اختيار نوع الجهاز.",
      alert_location_required: "يرجى اختيار قاعة.",
      alert_object_saved: "تم حفظ الجهاز!",
      alert_server_error: "خطأ في الخادم",
      alert_connection_error: "خطأ في الاتصال.",
      alert_custom_type_required: "يرجى إدخال اسم النوع الجديد.",
      add_step1_title: "الخطوة 1: اختر أولًا نوعًا (إضاءة، مكيف، كاميرا...)",
      add_step2_title: "الخطوة 2: أدخل تفاصيل الجهاز",
      add_preview_incomplete: "معاينة: جهاز غير مكتمل",
      add_progress_start: "ابدأ باختيار نوع الجهاز.",
      add_progress_name: "أضف اسمًا واضحًا للعثور عليه بسرعة.",
      add_progress_room: "ثم اختر القاعة أو منطقة التركيب.",
      add_progress_desc: "وصف قصير يجعل البطاقة أكثر فائدة للفريق.",
      add_progress_ready: "البطاقة جاهزة، يمكنك حفظ هذا الجهاز.",
      add_summary_name_empty: "غير مذكور",
      add_summary_type_empty: "لم يتم اختيار نوع",
      add_summary_room_empty: "لا يوجد موقع",
      add_summary_desc_empty: "ما زال فارغًا",
      add_summary_desc_filled: "مكتمل",
      history_admin_loading: "جاري التحميل...",
      history_admin_error: "تعذر تحميل سجل المسؤول.",
      role_admin_title: "دور المسؤول",
      role_management: "الإدارة",
      role_full_access: "وصول كامل.",
      role_stats_access: "وصول الإحصائيات.",
      toast_location_updated: "تم تحديث الموقع",
      label_select_room: "-- اختر قاعة --",
      param_users: "المستخدمون",
      param_admins: "المسؤولون",
      param_activity_events: "أحداث النشاط",
      param_history_entries: "مدخلات السجل",
      param_accounts_visible: "الحسابات الظاهرة في المنصة.",
      param_profiles_elevated: "ملفات بصلاحيات عالية.",
      param_user_activity_lines: "أسطر تم تحميلها في سجل نشاط المستخدم.",
      param_admin_actions_available: "إجراءات المسؤول المتاحة حاليًا.",
      param_session_active: "جلسة نشطة",
      param_admin_privileges: "صلاحيات المسؤول",
      param_sync_pending: "مزامنة معلقة",
      param_user_management: "إدارة المستخدمين",
      param_user_activity: "نشاط المستخدمين",
      param_admin_history: "سجل المسؤول",
      param_edit_admin_profile: "تعديل ملف المسؤول",
      param_name_label: "الاسم:",
      param_email_label: "البريد الإلكتروني:",
      param_role_label: "الدور:",
      param_bio_label: "النبذة:",
      param_current_room: "القاعة الحالية:",
      param_member_since: "عضو منذ:",
      param_no_users: "لم يتم العثور على مستخدم.",
      param_no_activity: "لا يوجد نشاط حديث للمستخدمين.",
      param_no_history: "لا يوجد سجل حاليًا.",
      param_save: "حفظ",
      param_cancel: "إلغاء",
      param_display_name: "اسم العرض",
      param_admin_bio: "نبذة المسؤول...",
      alert_cannot_delete_self: "لا يمكنك حذف حسابك الخاص.",
      alert_cannot_delete_connected: "لا يمكنك حذف حسابك المتصل الخاص.",
      alert_user_role_updated: "تم تحديث دور المستخدم.",
      alert_user_deleted: "تم حذف المستخدم.",
      alert_invalid_admin_name: "اسم المسؤول غير صالح.",
      alert_change_role_error: "تعذر تغيير الدور.",
      alert_delete_user_failed: "تعذر حذف المستخدم.",
      alert_delete_user_error: "خطأ أثناء حذف المستخدم.",
      confirm_change_role: "تأكيد تغيير الدور إلى '{nextRole}' لـ {email}؟",
      confirm_delete_user: "تأكيد الحذف النهائي لـ {email}؟ لا يمكن التراجع عن هذا الإجراء.",
      param_refresh_list: "تحديث القائمة",
      param_refresh_activity: "تحديث النشاط",
      param_refresh_history: "تحديث السجل",
      param_actions_admin: "إجراءات المسؤول",
      param_edit_objects: "تعديل الأجهزة",
      param_add_object: "إضافة جهاز",
      param_location_map: "خريطة المواقع",
      param_reset_password: "إعادة تعيين كلمة المرور",
      param_sign_out: "تسجيل الخروج",
      param_control_center: "مركز التحكم والمراقبة",
      param_manage_users: "إدارة المستخدمين",
      param_recent_activity: "النشاط الأخير",
      param_quick_actions: "إجراءات سريعة",
      param_account_info: "معلومات الحساب",
      param_personal_history: "السجل الشخصي",
      param_user_settings: "إعدادات المستخدم منسجمة مع إنتيليبيلد.",
      param_modify_name_bio: "عدّل اسم العرض والنبذة الخاصة بك."
    }
  };

Object.assign(translations.fr, {
    login_doc_title: "Connexion - IntelliBuild",
    login_title: "Connexion",
    login_sub: "Renseignez vos identifiants pour accéder à votre espace IntelliBuild",
    login_welcome_eyebrow: "Bienvenue",
    login_showcase_kicker: "Smart Building",
login_showcase_title: "Bienvenue sur IntelliBuild",
login_showcase_text_1: "Ravi de vous revoir",
    login_showcase_text_2: "Connectez-vous pour continuer.",
    login_showcase_text: "Ravi de vous revoir. Connectez-vous pour continuer.",
    login_showcase_item_1_title: "Dashboard",
    login_showcase_item_1_text: "clair et rassurant",
    login_showcase_item_2_title: "Objets",
    login_showcase_item_2_text: "suivi plus rapide",
    login_showcase_item_3_title: "Parcours",
    login_showcase_item_3_text: "acces sans friction",
    login_chip_1: "Interface premium",
    login_chip_2: "Palette IntelliBuild",
    login_chip_3: "Acces securise",
    auth_link_register_inline: 'Pas de compte ? <a href="register.html">S\'inscrire</a>',
    login_note_title: "Acces direct",
    login_note_text: "Vous serez redirige automatiquement vers l'espace admin ou utilisateur apres connexion."
  });

  Object.assign(translations.en, {
    login_doc_title: "Welcome - IntelliBuild",
    login_title: "Welcome back",
    login_sub: "Sign in to get back to your IntelliBuild workspace.",
    login_welcome_eyebrow: "Welcome",
    login_showcase_kicker: "Smart Building",
    login_showcase_title: "A clearer sign-in experience for your objects, spaces and daily actions.",
    login_showcase_text: "Enjoy a smoother, more professional flow aligned with the IntelliBuild visual identity.",
    login_showcase_item_1_title: "Dashboard",
    login_showcase_item_1_text: "clear and reassuring",
    login_showcase_item_2_title: "Objects",
    login_showcase_item_2_text: "faster tracking",
    login_showcase_item_3_title: "Journey",
    login_showcase_item_3_text: "frictionless access",
    login_chip_1: "Premium UI",
    login_chip_2: "IntelliBuild palette",
    login_chip_3: "Secure access",
    auth_link_register_inline: 'No account? <a href="register.html">Sign up</a>',
    login_note_title: "Direct access",
    login_note_text: "After signing in, you are automatically redirected to the admin or user space."
  });

  Object.assign(translations.ar, {
    login_doc_title: "مرحبا - إنتيليبيلد",
    login_title: "مرحبا بعودتك",
    login_sub: "سجل الدخول للعودة إلى مساحة IntelliBuild الخاصة بك.",
    login_welcome_eyebrow: "مرحبا",
    login_showcase_kicker: "المبنى الذكي",
    login_showcase_title: "تجربة دخول أوضح لإدارة الأجهزة والمساحات والمهام اليومية.",
    login_showcase_text: "واجهة أكثر سلاسة واحترافية ومنسجمة مع هوية IntelliBuild.",
    login_showcase_item_1_title: "لوحة التحكم",
    login_showcase_item_1_text: "واضحة ومطمئنة",
    login_showcase_item_2_title: "الأجهزة",
    login_showcase_item_2_text: "متابعة أسرع",
    login_showcase_item_3_title: "المسار",
    login_showcase_item_3_text: "وصول بدون تعقيد",
    login_chip_1: "واجهة احترافية",
    login_chip_2: "هوية IntelliBuild",
    login_chip_3: "دخول آمن",
    auth_link_register_inline: 'ليس لديك حساب؟ <a href="register.html">سجل الآن</a>',
    login_note_title: "دخول مباشر",
    login_note_text: "بعد تسجيل الدخول سيتم توجيهك تلقائيا إلى مساحة المشرف أو المستخدم."
  });

  const autoTranslations = {
    en: {
      "Signalements": "Reports",
      "IntelliBuild - Dashboard": "IntelliBuild - Dashboard",
      "IntelliBuild - Objets": "IntelliBuild - Objects",
      "IntelliBuild - Ajouter un objet": "IntelliBuild - Add an object",
      "IntelliBuild - Architecture 3D Interactive": "IntelliBuild - Interactive 3D Architecture",
      "Parametres admin - IntelliBuild": "Admin settings - IntelliBuild",
      "Paramètres admin - IntelliBuild": "Admin settings - IntelliBuild",
      "Favoris": "Favorites",
      "Signaler un problème": "Report a problem",
      "Parametres": "Settings",
      "Paramètres": "Settings",
      "Deconnexion": "Sign out",
      "Déconnexion": "Sign out",
      "Details": "Details",
      "Détails": "Details",
      "Rafraichir": "Refresh",
      "Tout marquer lu": "Mark all as read",
      "Retour dashboard": "Back to dashboard",
      "Voir notifications": "View notifications",
      "Aller a localisations": "Go to locations",
      "Reinitialiser mot de passe": "Reset password",
      "Aucun historique pour le moment.": "No history yet.",
      "Aucun historique pour cet utilisateur.": "No history for this user yet.",
      "Aucune activite utilisateur recente.": "No recent user activity.",
      "Aucun utilisateur trouve.": "No user found.",
      "Aucune bio": "No bio",
      "Aucune bio enregistree.": "No saved bio.",
      "Non definie": "Not set",
      "Non renseigné": "Not provided",
      "Aucune localisation": "No location",
      "Encore vide": "Still empty",
      "Operation terminee": "Operation completed",
      "Confirmer l'action": "Confirm action",
      "Voulez-vous confirmer cette action ?": "Do you want to confirm this action?",
      "Oui, deconnexion": "Yes, sign out",
      "Confirmer la deconnexion du compte suivant:": "Confirm sign-out for this account:",

      "A propos - IntelliBuild": "About - IntelliBuild",
      "A propos": "About",
      "À propos": "About",
      "Documatation": "Documentation",
      "Connecte": "Connected",
      "Connecté": "Connected",
      "A propos du projet": "About the project",
      "IntelliBuild simplifie la gestion des objets connectes dans un smart building.": "IntelliBuild simplifies connected object management in a smart building.",
      "Notre application web a ete pensee pour donner une vue claire, moderne et exploitable sur l’inventaire, la localisation, le suivi et l’administration des objets connectes.": "Our web application was designed to give a clear, modern and useful view of inventory, location, tracking and connected object administration.",
      "Inventaire centralise": "Centralized inventory",
      "Recherche intelligente": "Smart search",
      "Localisation interactive": "Interactive location",
      "Voir le guide": "View the guide",
      "Retour accueil": "Back home",
      "En bref": "In short",
      "IntelliBuild relie une interface web claire, une gestion par roles et une vue batiment pour faciliter l’usage quotidien de la plateforme.": "IntelliBuild connects a clear web interface, role-based management and a building view to make daily platform use easier.",
      "Experience": "Experience",
      "Plus fluide": "Smoother",
      "Plus rapide": "Faster",
      "Plus visible": "More visible",
      "Plus clair": "Clearer",
      "Notre mission": "Our mission",
      "Offrir une plateforme simple a comprendre et puissante a utiliser.": "Offer a platform that is simple to understand and powerful to use.",
      "Ce qui fait la difference": "What makes the difference",
      "Une seule plateforme pour voir, gerer et retrouver les objets connectes.": "One platform to view, manage and find connected objects.",
      "Une navigation adaptee selon que l’on soit administrateur ou utilisateur.": "Navigation adapted for administrators and users.",
      "Une approche orientee demonstration, comprehension et usage reel.": "An approach focused on demonstration, understanding and real use.",
      "Objectif principal": "Main objective",
      "Transformer une gestion technique parfois dispersee en experience claire, visuelle et rassurante pour les utilisateurs.": "Turn technical and sometimes scattered management into a clear, visual and reassuring experience for users.",
      "Modules cles": "Key modules",
      "Dashboard, objets, localisation, notifications, historique et parametres.": "Dashboard, objects, location, notifications, history and settings.",
      "Vision": "Vision",
      "Centraliser la gestion des objets dans une experience coherente.": "Centralize object management in a consistent experience.",
      "Profils": "Profiles",
      "Des parcours differencies pour admin et utilisateur.": "Separate journeys for admin and user.",
      "Interface": "Interface",
      "Une vue localisation plus immersive pour le batiment.": "A more immersive location view for the building.",
      "Fonctionnalites fortes": "Key features",
      "Les piliers de la plateforme": "The pillars of the platform",
      "Gestion des objets": "Object management",
      "Creer, modifier, organiser et supprimer les objets connectes depuis une interface plus claire.": "Create, edit, organize and delete connected objects from a clearer interface.",
      "Trouver rapidement un objet par nom, type, statut ou emplacement dans le batiment.": "Quickly find an object by name, type, status or location in the building.",
      "Localisation 3D": "3D location",
      "Visualiser les salles et definir une position a l’aide d’une vue interactive du smart building.": "View rooms and define a position using an interactive smart building view.",
      "Suivi et notifications": "Tracking and notifications",
      "Conserver une trace des actions, recevoir les informations importantes et garder de la visibilite.": "Keep a record of actions, receive important information and maintain visibility.",
      "Comment IntelliBuild accompagne la gestion au quotidien": "How IntelliBuild supports daily management",
      "Identifier": "Identify",
      "Creer une fiche claire pour chaque objet.": "Create a clear sheet for every object.",
      "Localiser": "Locate",
      "Associer l’objet a un espace concret du batiment.": "Link the object to a real space in the building.",
      "Suivre": "Track",
      "Consulter l’activite, les notifications et les changements.": "View activity, notifications and changes.",
      "Administrer": "Administer",
      "Piloter l’ensemble depuis un cockpit plus visuel.": "Control everything from a more visual cockpit.",
      "Valeur du projet": "Project value",
      "Pourquoi IntelliBuild se demarque": "Why IntelliBuild stands out",
      "Vision centralisee": "Centralized vision",
      "Interface lisible": "Readable interface",
      "Usage concret": "Practical use",
      "Parcours differencies": "Separate journeys",
      "Demonstration forte": "Strong demonstration",
      "Base evolutive": "Scalable base",
      "Types d’objets": "Object types",
      "Objets simules": "Simulated objects",
      "Parcours metier": "Business journeys",
      "Plateforme unifiee": "Unified platform",
      "Explorer la plateforme": "Explore the platform",
      "Vous voulez voir comment l’application fonctionne concretement ?": "Want to see how the application works in practice?",
      "Passez directement au guide d’utilisation ou revenez au dashboard si vous etes deja connecte.": "Go directly to the user guide or return to the dashboard if you are already signed in.",
      "Ouvrir la doc": "Open the docs",

      "Documatation - IntelliBuild": "Documentation - IntelliBuild",
      "Guide d’utilisation": "User guide",
      "Comment utiliser notre application web IntelliBuild": "How to use our IntelliBuild web application",
      "Cette page explique simplement comment naviguer dans la plateforme, se connecter, gérer les objets connectés et utiliser les espaces admin et utilisateur.": "This page simply explains how to navigate the platform, sign in, manage connected objects and use the admin and user areas.",
      "Gestion d’objets": "Object management",
      "Ouvrir l’application": "Open the application",
      "Ce que vous pouvez faire": "What you can do",
      "Se connecter avec un compte utilisateur ou administrateur.": "Sign in with a user or administrator account.",
      "Consulter le tableau de bord et rechercher rapidement un objet.": "View the dashboard and quickly search for an object.",
      "Ajouter, modifier ou supprimer des objets selon le rôle.": "Add, edit or delete objects depending on the role.",
      "Utiliser la page Localisations pour définir une position dans le bâtiment.": "Use the Locations page to define a position in the building.",
      "Suivre l’historique, les notifications et les paramètres.": "Track history, notifications and settings.",
      "1. Démarrage": "1. Getting started",
      "Pour commencer, ouvrez la page d’accueil puis cliquez sur Connexion ou Inscription. Une fois connecté, l’application redirige automatiquement vers l’espace correspondant à votre rôle.": "To start, open the homepage then click Login or Sign up. Once connected, the application automatically redirects to the area matching your role.",
      "Créer un compte": "Create an account",
      "Utilisez la page Inscription si vous n’avez pas encore de compte dans la plateforme.": "Use the Sign up page if you do not have an account on the platform yet.",
      "Entrez votre email et votre mot de passe sur la page Connexion.": "Enter your email and password on the Login page.",
      "Accéder au dashboard": "Access the dashboard",
      "Après connexion, vous arrivez sur le dashboard admin ou utilisateur.": "After signing in, you arrive on the admin or user dashboard.",
      "Choisir une langue": "Choose a language",
      "Le sélecteur de langue est disponible sur plusieurs pages pour adapter l’interface.": "The language selector is available on several pages to adapt the interface.",
      "2. Les rôles dans l’application": "2. Roles in the application",
      "Rôle Admin": "Admin role",
      "Administration complète": "Full administration",
      "L’administrateur peut ajouter des objets, modifier l’inventaire, consulter les localisations, suivre l’activité et gérer les paramètres avancés.": "The administrator can add objects, edit the inventory, view locations, track activity and manage advanced settings.",
      "Rôle Utilisateur": "User role",
      "Consultation et suivi": "Viewing and tracking",
      "L’utilisateur peut rechercher des objets, voir ses objets, consulter les localisations, lire les notifications et gérer son profil.": "The user can search objects, view their objects, check locations, read notifications and manage their profile.",
      "3. Utilisation de l’espace administrateur": "3. Using the administrator area",
      "4. Utilisation de l’espace utilisateur": "4. Using the user area",
      "5. Workflow conseillé": "5. Recommended workflow",
      "6. Questions fréquentes": "6. Frequently asked questions",
      "Navigation rapide": "Quick navigation",
      "Démarrage": "Getting started",
      "Rôles": "Roles",
      "Espace administrateur": "Administrator area",
      "Espace utilisateur": "User area",
      "Workflow conseillé": "Recommended workflow",
      "Conseils": "Tips",
      "Pour une bonne démonstration du projet, commencez par vous connecter avec un compte admin, ajoutez quelques objets, puis montrez la recherche et la localisation 3D.": "For a good project demo, start by signing in with an admin account, add a few objects, then show search and 3D location.",

      "Pilotage admin": "Admin control",
      "Centre de contrôle IntelliBuild": "IntelliBuild control center",
      "Pilotez les objets, la localisation et l’activité du bâtiment depuis une interface plus claire, plus moderne et plus lisible.": "Control objects, location and building activity from a clearer, more modern and more readable interface.",
      "Vue globale": "Global view",
      "Temps réel": "Real time",
      "Actions rapides": "Quick actions",
      "Ajouter un objet": "Add an object",
      "Voir l’inventaire": "View inventory",
      "Ouvrir la carte": "Open the map",
      "Ma Position : salle inconnue": "My position: unknown room",

      "Catalogue objets": "Object catalog",
      "Supervisez tout l’inventaire connecté": "Supervise the whole connected inventory",
      "Retrouvez, filtrez et administrez rapidement chaque objet du bâtiment depuis un catalogue plus visuel et plus fluide.": "Find, filter and administer every building object quickly from a more visual and smoother catalog.",
      "Edition immédiate": "Instant editing",
      "Vue centralisée": "Centralized view",
      "Créer un nouvel objet": "Create a new object",
      "Ouvrir la carte 3D": "Open the 3D map",
      "Réinitialiser la recherche": "Reset search",
      "Objets affichés": "Displayed objects",
      "Inventaire visible à l’écran.": "Inventory visible on screen.",
      "Disponibles": "Available",
      "Objets actifs ou disponibles.": "Active or available objects.",
      "À surveiller": "To monitor",
      "Objets inactifs ou hors service.": "Inactive or out-of-service objects.",
      "Salles couvertes": "Covered rooms",
      "Localisations distinctes trouvées.": "Distinct locations found.",
      "Tout": "All",

      "Navigation 3D": "3D navigation",
      "Visualisez chaque étage en un coup d’œil": "View every floor at a glance",
      "Choisissez une salle, parcourez les niveaux du bâtiment et mettez à jour votre position avec une vue plus immersive.": "Choose a room, browse building levels and update your position with a more immersive view.",
      "Architecture interactive": "Interactive architecture",
      "Repérage visuel": "Visual orientation",
      "Position en direct": "Live position",
      "Position active": "Active position",
      "Étage détecté:": "Detected floor:",
      "Cliquez directement sur un bureau en 3D pour définir la position.": "Click directly on a 3D office to set the position.",
      "Etage": "Floor",
      "Étage": "Floor",
      "Salle": "Room",
      "Je suis ici": "I am here",
      "Aller a l'etage": "Go to floor",
      "Localisation mise a jour": "Location updated",
      "Localisation interactive": "Interactive location",
      "Choisissez votre salle en 3D": "Choose your room in 3D",
      "Explorez chaque etage, cliquez sur une salle et mettez a jour votre position sans quitter l’architecture du batiment.": "Explore each floor, click a room and update your position without leaving the building architecture.",
      "Vue 3D fluide": "Smooth 3D view",
      "Etages visuels": "Visual floors",
      "Position instantanee": "Instant position",
      "Comment l'utiliser": "How to use it",
      "Choisissez un etage puis cliquez directement sur la salle qui vous interesse.": "Choose a floor then click directly on the room you are interested in.",
      "Faites glisser la scene pour voir les espaces sous plusieurs angles.": "Drag the scene to view spaces from several angles.",
      "Votre position active se met a jour des que vous selectionnez une salle.": "Your active position updates as soon as you select a room.",
      "Salle active": "Active room",

      "Plateforme Smart Building": "Smart Building platform",
      "Un cockpit plus élégant pour gérer vos objets connectés.": "A more elegant cockpit to manage your connected objects.",
      "Connectez-vous à une interface pensée pour aller plus vite, mieux voir et agir sans friction.": "Sign in to an interface designed to move faster, see better and act without friction.",
      "clair et impactant": "clear and impactful",
      "plus rapide": "faster",
      "plus fluide": "smoother",
      "Nouvelle expérience": "New experience",
      "Créez votre espace IntelliBuild avec une UI plus premium.": "Create your IntelliBuild space with a more premium UI.",
      "Inscription rapide, univers visuel cohérent et parcours plus rassurant dès la première visite.": "Fast sign-up, consistent visual world and a more reassuring journey from the first visit.",
      "plus moderne": "more modern",
      "plus simple": "simpler",
      "Accès": "Access",
      "plus direct": "more direct",

      "Création guidée": "Guided creation",
      "Ajoutez un objet avec une vue plus claire": "Add an object with a clearer view",
      "Sélectionnez un type, renseignez les détails essentiels et suivez en direct l’état de préparation de votre fiche objet.": "Select a type, enter the essential details and follow the readiness of your object sheet live.",
      "Type assisté": "Assisted type",
      "Résumé instantané": "Instant summary",
      "Parcours fluide": "Smooth journey",
      "Voir le catalogue": "View catalog",
      "Etape 1: Choisissez d'abord un type (ECLAIRAGE, Climatiseur, Camera...)": "Step 1: First choose a type (LIGHTING, Air conditioner, Camera...)",
      "Aucun type choisi": "No type selected",
      "Nouveau type d'objet": "New object type",
      "Valider le type": "Validate type",
      "Ce type sera utilise pour l'objet en cours et enregistre comme categorie definie.": "This type will be used for the current object and saved as a defined category.",
      "Etape 2: Renseignez les details de l'objet": "Step 2: Fill in object details",
      "Nom court, clair et unique pour retrouver rapidement l'objet.": "Short, clear and unique name to find the object quickly.",
      "Choisissez la salle principale ou l'equipement est installe.": "Choose the main room where the equipment is installed.",
      "Generer une description": "Generate a description",
      "Effacer description": "Clear description",
      "Ajoutez des infos utiles: connectivite, usage, contraintes techniques.": "Add useful information: connectivity, usage, technical constraints.",
      "Endpoint reseau REST": "REST network endpoint",
      "Optionnel. Ajoutez-le pour un objet reel pilotable a distance comme la lampe de demo.": "Optional. Add it for a real remotely controllable object like the demo lamp.",
      "Apercu: Objet non complete": "Preview: incomplete object",
      "État de création": "Creation status",
      "Commencez par choisir un type d’objet.": "Start by choosing an object type.",
      "Résumé en direct": "Live summary",
      "Conseils rapides": "Quick tips",

      "Paramètres admin": "Admin settings",
      "Parametres admin": "Admin settings",
      "Centre de contrôle et de supervision": "Control and supervision center",
      "Gestion utilisateurs": "User management",
      "Activité récente": "Recent activity",
      "Historique admin": "Admin history",
      "Session active": "Active session",
      "Utilisateurs": "Users",
      "Comptes visibles dans la plateforme.": "Accounts visible in the platform.",
      "Admins": "Admins",
      "Profils avec privilèges élevés.": "Profiles with elevated privileges.",
      "Événements activité": "Activity events",
      "Entrées historique": "History entries",
      "Actions admin": "Admin actions",
      "Editer objets": "Edit objects",
      "Carte localisation": "Location map",
      "Session admin": "Admin session",
      "Role:": "Role:",
      "Gestion des utilisateurs": "User management",
      "Rafraichir liste": "Refresh list",
      "Activite utilisateurs": "User activity",
      "Rafraichir activite": "Refresh activity",
      "Rafraichir historique": "Refresh history",
      "Modifiez votre nom affiche et votre bio.": "Edit your display name and bio.",
      "Nom affiche": "Display name",
      "Enregistrer": "Save",

      "Parametres utilisateur - IntelliBuild": "User settings - IntelliBuild",
      "Parametres utilisateur harmonises avec IntelliBuild.": "User settings harmonized with IntelliBuild.",
      "Actions rapides": "Quick actions",
      "Infos compte": "Account info",
      "Nom:": "Name:",
      "Salle actuelle:": "Current room:",
      "Membre depuis:": "Member since:",
      "Editer profil": "Edit profile",
      "Bio utilisateur": "User bio",
      "Historique personnel": "Personal history",
      "Date": "Date",
      "Utilisateur": "User",
      "Objet": "Object",
      "Detail": "Detail",
      "Statut": "Status",
      "Bio": "Bio",

      "(c) 2026 IntelliBuild. All rights reserved.": "© 2026 IntelliBuild. All rights reserved.",
      "© 2026 IntelliBuild. Tous droits réservés.": "© 2026 IntelliBuild. All rights reserved."
    },
    ar: {
      "Signalements": "البلاغات",
      "IntelliBuild - Dashboard": "إنتيليبيلد - لوحة التحكم",
      "IntelliBuild - Objets": "إنتيليبيلد - الأجهزة",
      "IntelliBuild - Ajouter un objet": "إنتيليبيلد - إضافة جهاز",
      "IntelliBuild - Architecture 3D Interactive": "إنتيليبيلد - هندسة ثلاثية الأبعاد تفاعلية",
      "Parametres admin - IntelliBuild": "إعدادات المسؤول - إنتيليبيلد",
      "Paramètres admin - IntelliBuild": "إعدادات المسؤول - إنتيليبيلد",
      "Favoris": "المفضلة",
      "Signaler un problème": "الإبلاغ عن مشكلة",
      "Parametres": "الإعدادات",
      "Paramètres": "الإعدادات",
      "Deconnexion": "تسجيل الخروج",
      "Déconnexion": "تسجيل الخروج",
      "Details": "التفاصيل",
      "Détails": "التفاصيل",
      "Rafraichir": "تحديث",
      "Tout marquer lu": "تعليم الكل كمقروء",
      "Retour dashboard": "العودة إلى لوحة التحكم",
      "Voir notifications": "عرض الإشعارات",
      "Aller a localisations": "الذهاب إلى المواقع",
      "Reinitialiser mot de passe": "إعادة تعيين كلمة المرور",
      "Aucun historique pour le moment.": "لا يوجد سجل حاليًا.",
      "Aucun historique pour cet utilisateur.": "لا يوجد سجل لهذا المستخدم.",
      "Aucune activite utilisateur recente.": "لا يوجد نشاط حديث للمستخدمين.",
      "Aucun utilisateur trouve.": "لم يتم العثور على مستخدم.",
      "Aucune bio": "لا توجد نبذة",
      "Aucune bio enregistree.": "لا توجد نبذة محفوظة.",
      "Non definie": "غير محددة",
      "Non renseigné": "غير مذكور",
      "Aucune localisation": "لا يوجد موقع",
      "Encore vide": "ما زال فارغًا",
      "Operation terminee": "اكتملت العملية",
      "Confirmer l'action": "تأكيد الإجراء",
      "Voulez-vous confirmer cette action ?": "هل تريد تأكيد هذا الإجراء؟",
      "Oui, deconnexion": "نعم، تسجيل الخروج",
      "Confirmer la deconnexion du compte suivant:": "تأكيد تسجيل خروج الحساب التالي:",

      "A propos - IntelliBuild": "حول - إنتيليبيلد",
      "A propos": "حول",
      "À propos": "حول",
      "Documatation": "التوثيق",
      "Connecte": "متصل",
      "Connecté": "متصل",
      "A propos du projet": "حول المشروع",
      "IntelliBuild simplifie la gestion des objets connectes dans un smart building.": "إنتيليبيلد يبسط إدارة الأجهزة المتصلة داخل مبنى ذكي.",
      "Notre application web a ete pensee pour donner une vue claire, moderne et exploitable sur l’inventaire, la localisation, le suivi et l’administration des objets connectes.": "تم تصميم تطبيق الويب ليقدم رؤية واضحة وحديثة وقابلة للاستخدام للجرد والموقع والتتبع وإدارة الأجهزة المتصلة.",
      "Inventaire centralise": "جرد مركزي",
      "Recherche intelligente": "بحث ذكي",
      "Localisation interactive": "موقع تفاعلي",
      "Voir le guide": "عرض الدليل",
      "Retour accueil": "العودة إلى الرئيسية",
      "En bref": "باختصار",
      "IntelliBuild relie une interface web claire, une gestion par roles et une vue batiment pour faciliter l’usage quotidien de la plateforme.": "يربط إنتيليبيلد واجهة ويب واضحة وإدارة حسب الأدوار وعرضًا للمبنى لتسهيل الاستخدام اليومي للمنصة.",
      "Experience": "التجربة",
      "Plus fluide": "أكثر سلاسة",
      "Plus rapide": "أسرع",
      "Plus visible": "أوضح",
      "Plus clair": "أوضح",
      "Notre mission": "مهمتنا",
      "Offrir une plateforme simple a comprendre et puissante a utiliser.": "تقديم منصة سهلة الفهم وقوية الاستخدام.",
      "Ce qui fait la difference": "ما يصنع الفرق",
      "Une seule plateforme pour voir, gerer et retrouver les objets connectes.": "منصة واحدة لعرض وإدارة والعثور على الأجهزة المتصلة.",
      "Une navigation adaptee selon que l’on soit administrateur ou utilisateur.": "تنقل ملائم سواء كنت مسؤولًا أو مستخدمًا.",
      "Une approche orientee demonstration, comprehension et usage reel.": "نهج موجه للعرض والفهم والاستخدام الحقيقي.",
      "Objectif principal": "الهدف الرئيسي",
      "Transformer une gestion technique parfois dispersee en experience claire, visuelle et rassurante pour les utilisateurs.": "تحويل الإدارة التقنية المتفرقة أحيانًا إلى تجربة واضحة ومرئية ومطمئنة للمستخدمين.",
      "Modules cles": "الوحدات الأساسية",
      "Dashboard, objets, localisation, notifications, historique et parametres.": "لوحة التحكم، الأجهزة، المواقع، الإشعارات، السجل والإعدادات.",
      "Vision": "الرؤية",
      "Centraliser la gestion des objets dans une experience coherente.": "مركزة إدارة الأجهزة ضمن تجربة متناسقة.",
      "Profils": "الملفات",
      "Des parcours differencies pour admin et utilisateur.": "مسارات مختلفة للمسؤول والمستخدم.",
      "Interface": "الواجهة",
      "Une vue localisation plus immersive pour le batiment.": "عرض موقع أكثر تفاعلية للمبنى.",
      "Fonctionnalites fortes": "الميزات الرئيسية",
      "Les piliers de la plateforme": "ركائز المنصة",
      "Gestion des objets": "إدارة الأجهزة",
      "Creer, modifier, organiser et supprimer les objets connectes depuis une interface plus claire.": "إنشاء وتعديل وتنظيم وحذف الأجهزة المتصلة من واجهة أوضح.",
      "Trouver rapidement un objet par nom, type, statut ou emplacement dans le batiment.": "العثور بسرعة على جهاز حسب الاسم أو النوع أو الحالة أو الموقع داخل المبنى.",
      "Localisation 3D": "الموقع ثلاثي الأبعاد",
      "Visualiser les salles et definir une position a l’aide d’une vue interactive du smart building.": "عرض القاعات وتحديد الموقع باستخدام عرض تفاعلي للمبنى الذكي.",
      "Suivi et notifications": "التتبع والإشعارات",
      "Conserver une trace des actions, recevoir les informations importantes et garder de la visibilite.": "الاحتفاظ بسجل للإجراءات واستقبال المعلومات المهمة والحفاظ على الرؤية.",
      "Comment IntelliBuild accompagne la gestion au quotidien": "كيف يساعد إنتيليبيلد في الإدارة اليومية",
      "Identifier": "التعريف",
      "Creer une fiche claire pour chaque objet.": "إنشاء بطاقة واضحة لكل جهاز.",
      "Localiser": "تحديد الموقع",
      "Associer l’objet a un espace concret du batiment.": "ربط الجهاز بمساحة محددة داخل المبنى.",
      "Suivre": "المتابعة",
      "Consulter l’activite, les notifications et les changements.": "عرض النشاط والإشعارات والتغييرات.",
      "Administrer": "الإدارة",
      "Piloter l’ensemble depuis un cockpit plus visuel.": "التحكم في كل شيء من واجهة أكثر وضوحًا.",
      "Valeur du projet": "قيمة المشروع",
      "Pourquoi IntelliBuild se demarque": "لماذا يتميز إنتيليبيلد",
      "Vision centralisee": "رؤية مركزية",
      "Interface lisible": "واجهة مقروءة",
      "Usage concret": "استخدام عملي",
      "Parcours differencies": "مسارات مختلفة",
      "Demonstration forte": "عرض قوي",
      "Base evolutive": "قاعدة قابلة للتطوير",
      "Types d’objets": "أنواع الأجهزة",
      "Objets simules": "أجهزة محاكاة",
      "Parcours metier": "مسارات العمل",
      "Plateforme unifiee": "منصة موحدة",
      "Explorer la plateforme": "استكشاف المنصة",
      "Vous voulez voir comment l’application fonctionne concretement ?": "هل تريد رؤية كيفية عمل التطبيق فعليًا؟",
      "Passez directement au guide d’utilisation ou revenez au dashboard si vous etes deja connecte.": "انتقل مباشرة إلى دليل الاستخدام أو عد إلى لوحة التحكم إذا كنت متصلًا.",
      "Ouvrir la doc": "فتح التوثيق",

      "Documatation - IntelliBuild": "التوثيق - إنتيليبيلد",
      "Guide d’utilisation": "دليل الاستخدام",
      "Comment utiliser notre application web IntelliBuild": "كيفية استخدام تطبيق الويب إنتيليبيلد",
      "Cette page explique simplement comment naviguer dans la plateforme, se connecter, gérer les objets connectés et utiliser les espaces admin et utilisateur.": "تشرح هذه الصفحة ببساطة كيفية التنقل في المنصة وتسجيل الدخول وإدارة الأجهزة المتصلة واستخدام مساحتي المسؤول والمستخدم.",
      "Gestion d’objets": "إدارة الأجهزة",
      "Ouvrir l’application": "فتح التطبيق",
      "Ce que vous pouvez faire": "ما يمكنك فعله",
      "Se connecter avec un compte utilisateur ou administrateur.": "تسجيل الدخول بحساب مستخدم أو مسؤول.",
      "Consulter le tableau de bord et rechercher rapidement un objet.": "عرض لوحة التحكم والبحث بسرعة عن جهاز.",
      "Ajouter, modifier ou supprimer des objets selon le rôle.": "إضافة أو تعديل أو حذف الأجهزة حسب الدور.",
      "Utiliser la page Localisations pour définir une position dans le bâtiment.": "استخدم صفحة المواقع لتحديد موقع داخل المبنى.",
      "Suivre l’historique, les notifications et les paramètres.": "متابعة السجل والإشعارات والإعدادات.",
      "1. Démarrage": "1. البدء",
      "Pour commencer, ouvrez la page d’accueil puis cliquez sur Connexion ou Inscription. Une fois connecté, l’application redirige automatiquement vers l’espace correspondant à votre rôle.": "للبدء، افتح الصفحة الرئيسية ثم اضغط على تسجيل الدخول أو إنشاء حساب. بعد الاتصال، يوجهك التطبيق تلقائيًا إلى المساحة المناسبة لدورك.",
      "Créer un compte": "إنشاء حساب",
      "Utilisez la page Inscription si vous n’avez pas encore de compte dans la plateforme.": "استخدم صفحة التسجيل إذا لم يكن لديك حساب في المنصة بعد.",
      "Entrez votre email et votre mot de passe sur la page Connexion.": "أدخل بريدك الإلكتروني وكلمة المرور في صفحة تسجيل الدخول.",
      "Accéder au dashboard": "الوصول إلى لوحة التحكم",
      "Après connexion, vous arrivez sur le dashboard admin ou utilisateur.": "بعد تسجيل الدخول، تصل إلى لوحة تحكم المسؤول أو المستخدم.",
      "Choisir une langue": "اختيار اللغة",
      "Le sélecteur de langue est disponible sur plusieurs pages pour adapter l’interface.": "يتوفر محدد اللغة في عدة صفحات لتكييف الواجهة.",
      "2. Les rôles dans l’application": "2. الأدوار في التطبيق",
      "Rôle Admin": "دور المسؤول",
      "Administration complète": "إدارة كاملة",
      "L’administrateur peut ajouter des objets, modifier l’inventaire, consulter les localisations, suivre l’activité et gérer les paramètres avancés.": "يمكن للمسؤول إضافة الأجهزة وتعديل الجرد وعرض المواقع وتتبع النشاط وإدارة الإعدادات المتقدمة.",
      "Rôle Utilisateur": "دور المستخدم",
      "Consultation et suivi": "العرض والمتابعة",
      "L’utilisateur peut rechercher des objets, voir ses objets, consulter les localisations, lire les notifications et gérer son profil.": "يمكن للمستخدم البحث عن الأجهزة وعرض أجهزته والمواقع وقراءة الإشعارات وإدارة ملفه.",
      "3. Utilisation de l’espace administrateur": "3. استخدام مساحة المسؤول",
      "4. Utilisation de l’espace utilisateur": "4. استخدام مساحة المستخدم",
      "5. Workflow conseillé": "5. سير العمل المقترح",
      "6. Questions fréquentes": "6. الأسئلة الشائعة",
      "Navigation rapide": "تنقل سريع",
      "Démarrage": "البدء",
      "Rôles": "الأدوار",
      "Espace administrateur": "مساحة المسؤول",
      "Espace utilisateur": "مساحة المستخدم",
      "Workflow conseillé": "سير العمل المقترح",
      "Conseils": "نصائح",
      "Pour une bonne démonstration du projet, commencez par vous connecter avec un compte admin, ajoutez quelques objets, puis montrez la recherche et la localisation 3D.": "لعرض جيد للمشروع، ابدأ بتسجيل الدخول بحساب مسؤول، أضف بعض الأجهزة، ثم اعرض البحث والموقع ثلاثي الأبعاد.",

      "Pilotage admin": "تحكم المسؤول",
      "Centre de contrôle IntelliBuild": "مركز تحكم إنتيليبيلد",
      "Pilotez les objets, la localisation et l’activité du bâtiment depuis une interface plus claire, plus moderne et plus lisible.": "تحكم في الأجهزة والمواقع ونشاط المبنى من واجهة أوضح وأحدث وأسهل قراءة.",
      "Vue globale": "عرض شامل",
      "Temps réel": "وقت حقيقي",
      "Actions rapides": "إجراءات سريعة",
      "Ajouter un objet": "إضافة جهاز",
      "Voir l’inventaire": "عرض الجرد",
      "Ouvrir la carte": "فتح الخريطة",
      "Ma Position : salle inconnue": "موقعي: قاعة غير معروفة",

      "Catalogue objets": "كتالوج الأجهزة",
      "Supervisez tout l’inventaire connecté": "راقب كل الجرد المتصل",
      "Retrouvez, filtrez et administrez rapidement chaque objet du bâtiment depuis un catalogue plus visuel et plus fluide.": "اعثر على كل جهاز في المبنى وقم بتصفيته وإدارته بسرعة من كتالوج أوضح وأكثر سلاسة.",
      "Edition immédiate": "تعديل فوري",
      "Vue centralisée": "عرض مركزي",
      "Créer un nouvel objet": "إنشاء جهاز جديد",
      "Ouvrir la carte 3D": "فتح الخريطة ثلاثية الأبعاد",
      "Réinitialiser la recherche": "إعادة تعيين البحث",
      "Objets affichés": "الأجهزة المعروضة",
      "Inventaire visible à l’écran.": "الجرد الظاهر على الشاشة.",
      "Disponibles": "متاحة",
      "Objets actifs ou disponibles.": "أجهزة نشطة أو متاحة.",
      "À surveiller": "تحتاج متابعة",
      "Objets inactifs ou hors service.": "أجهزة غير نشطة أو خارج الخدمة.",
      "Salles couvertes": "القاعات المغطاة",
      "Localisations distinctes trouvées.": "مواقع مختلفة تم العثور عليها.",
      "Tout": "الكل",

      "Navigation 3D": "تنقل ثلاثي الأبعاد",
      "Visualisez chaque étage en un coup d’œil": "شاهد كل طابق بنظرة واحدة",
      "Choisissez une salle, parcourez les niveaux du bâtiment et mettez à jour votre position avec une vue plus immersive.": "اختر قاعة وتصفح مستويات المبنى وحدّث موقعك بعرض أكثر تفاعلية.",
      "Architecture interactive": "هندسة تفاعلية",
      "Repérage visuel": "توجيه بصري",
      "Position en direct": "موقع مباشر",
      "Position active": "الموقع النشط",
      "Étage détecté:": "الطابق المكتشف:",
      "Cliquez directement sur un bureau en 3D pour définir la position.": "انقر مباشرة على مكتب ثلاثي الأبعاد لتحديد الموقع.",
      "Etage": "الطابق",
      "Étage": "الطابق",
      "Salle": "القاعة",
      "Je suis ici": "أنا هنا",
      "Aller a l'etage": "الذهاب إلى الطابق",
      "Localisation mise a jour": "تم تحديث الموقع",
      "Localisation interactive": "موقع تفاعلي",
      "Choisissez votre salle en 3D": "اختر قاعتك بتقنية ثلاثية الأبعاد",
      "Explorez chaque etage, cliquez sur une salle et mettez a jour votre position sans quitter l’architecture du batiment.": "استكشف كل طابق، انقر على قاعة وحدّث موقعك دون مغادرة هندسة المبنى.",
      "Vue 3D fluide": "عرض ثلاثي الأبعاد سلس",
      "Etages visuels": "طوابق مرئية",
      "Position instantanee": "موقع فوري",
      "Comment l'utiliser": "كيفية الاستخدام",
      "Choisissez un etage puis cliquez directement sur la salle qui vous interesse.": "اختر طابقًا ثم انقر مباشرة على القاعة التي تهمك.",
      "Faites glisser la scene pour voir les espaces sous plusieurs angles.": "اسحب المشهد لرؤية المساحات من زوايا متعددة.",
      "Votre position active se met a jour des que vous selectionnez une salle.": "يتم تحديث موقعك النشط بمجرد اختيار قاعة.",
      "Salle active": "القاعة النشطة",

      "Plateforme Smart Building": "منصة المبنى الذكي",
      "Un cockpit plus élégant pour gérer vos objets connectés.": "واجهة أكثر أناقة لإدارة أجهزتك المتصلة.",
      "Connectez-vous à une interface pensée pour aller plus vite, mieux voir et agir sans friction.": "سجّل الدخول إلى واجهة مصممة للسرعة والرؤية الأفضل والعمل دون تعقيد.",
      "clair et impactant": "واضح ومؤثر",
      "plus rapide": "أسرع",
      "plus fluide": "أكثر سلاسة",
      "Nouvelle expérience": "تجربة جديدة",
      "Créez votre espace IntelliBuild avec une UI plus premium.": "أنشئ مساحتك في إنتيليبيلد بواجهة أكثر تميزًا.",
      "Inscription rapide, univers visuel cohérent et parcours plus rassurant dès la première visite.": "تسجيل سريع، تجربة بصرية متناسقة ومسار أكثر طمأنة من الزيارة الأولى.",
      "plus moderne": "أحدث",
      "plus simple": "أبسط",
      "Accès": "الوصول",
      "plus direct": "أكثر مباشرة",

      "Création guidée": "إنشاء موجه",
      "Ajoutez un objet avec une vue plus claire": "أضف جهازًا بعرض أوضح",
      "Sélectionnez un type, renseignez les détails essentiels et suivez en direct l’état de préparation de votre fiche objet.": "اختر نوعًا، أدخل التفاصيل الأساسية وتابع مباشرة حالة إعداد بطاقة الجهاز.",
      "Type assisté": "نوع مساعد",
      "Résumé instantané": "ملخص فوري",
      "Parcours fluide": "مسار سلس",
      "Voir le catalogue": "عرض الكتالوج",
      "Etape 1: Choisissez d'abord un type (ECLAIRAGE, Climatiseur, Camera...)": "الخطوة 1: اختر أولًا نوعًا (إضاءة، مكيف، كاميرا...)",
      "Aucun type choisi": "لم يتم اختيار نوع",
      "Nouveau type d'objet": "نوع جهاز جديد",
      "Valider le type": "تأكيد النوع",
      "Ce type sera utilise pour l'objet en cours et enregistre comme categorie definie.": "سيتم استخدام هذا النوع للجهاز الحالي وحفظه كفئة معرفة.",
      "Etape 2: Renseignez les details de l'objet": "الخطوة 2: أدخل تفاصيل الجهاز",
      "Nom court, clair et unique pour retrouver rapidement l'objet.": "اسم قصير وواضح وفريد للعثور على الجهاز بسرعة.",
      "Choisissez la salle principale ou l'equipement est installe.": "اختر القاعة الرئيسية التي تم تركيب الجهاز فيها.",
      "Generer une description": "إنشاء وصف",
      "Effacer description": "مسح الوصف",
      "Ajoutez des infos utiles: connectivite, usage, contraintes techniques.": "أضف معلومات مفيدة: الاتصال، الاستخدام، القيود التقنية.",
      "Endpoint reseau REST": "نقطة شبكة REST",
      "Optionnel. Ajoutez-le pour un objet reel pilotable a distance comme la lampe de demo.": "اختياري. أضفه لجهاز حقيقي يمكن التحكم فيه عن بعد مثل مصباح العرض.",
      "Apercu: Objet non complete": "معاينة: جهاز غير مكتمل",
      "État de création": "حالة الإنشاء",
      "Commencez par choisir un type d’objet.": "ابدأ باختيار نوع الجهاز.",
      "Résumé en direct": "ملخص مباشر",
      "Conseils rapides": "نصائح سريعة",

      "Paramètres admin": "إعدادات المسؤول",
      "Parametres admin": "إعدادات المسؤول",
      "Centre de contrôle et de supervision": "مركز التحكم والمراقبة",
      "Gestion utilisateurs": "إدارة المستخدمين",
      "Activité récente": "النشاط الأخير",
      "Historique admin": "سجل المسؤول",
      "Session active": "جلسة نشطة",
      "Utilisateurs": "المستخدمون",
      "Comptes visibles dans la plateforme.": "الحسابات الظاهرة في المنصة.",
      "Admins": "المسؤولون",
      "Profils avec privilèges élevés.": "ملفات بصلاحيات عالية.",
      "Événements activité": "أحداث النشاط",
      "Entrées historique": "مدخلات السجل",
      "Actions admin": "إجراءات المسؤول",
      "Editer objets": "تعديل الأجهزة",
      "Carte localisation": "خريطة المواقع",
      "Session admin": "جلسة المسؤول",
      "Role:": "الدور:",
      "Gestion des utilisateurs": "إدارة المستخدمين",
      "Rafraichir liste": "تحديث القائمة",
      "Activite utilisateurs": "نشاط المستخدمين",
      "Rafraichir activite": "تحديث النشاط",
      "Rafraichir historique": "تحديث السجل",
      "Modifiez votre nom affiche et votre bio.": "عدّل اسم العرض والنبذة الخاصة بك.",
      "Nom affiche": "اسم العرض",
      "Enregistrer": "حفظ",

      "Parametres utilisateur - IntelliBuild": "إعدادات المستخدم - إنتيليبيلد",
      "Parametres utilisateur harmonises avec IntelliBuild.": "إعدادات المستخدم منسجمة مع إنتيليبيلد.",
      "Actions rapides": "إجراءات سريعة",
      "Infos compte": "معلومات الحساب",
      "Nom:": "الاسم:",
      "Salle actuelle:": "القاعة الحالية:",
      "Membre depuis:": "عضو منذ:",
      "Editer profil": "تعديل الملف الشخصي",
      "Bio utilisateur": "نبذة المستخدم",
      "Historique personnel": "السجل الشخصي",
      "Date": "التاريخ",
      "Utilisateur": "المستخدم",
      "Objet": "الجهاز",
      "Detail": "التفاصيل",
      "Statut": "الحالة",
      "Bio": "النبذة",

      "(c) 2026 IntelliBuild. All rights reserved.": "© 2026 إنتيليبيلد. جميع الحقوق محفوظة.",
      "© 2026 IntelliBuild. Tous droits réservés.": "© 2026 إنتيليبيلد. جميع الحقوق محفوظة."
    }
  };

  const supplementalAutoTranslations = {
    en: {
      "Ajouter objet": "Add object",
      "Dashboard utilisateur": "User dashboard",
      "Editer profil admin": "Edit admin profile",
      "Dashboard: il affiche les statistiques principales, la recherche globale et les objets récents.": "Dashboard: it shows the main statistics, global search and recent objects.",
      "Ajouter: cette page permet de créer un nouvel objet avec son nom, son type, sa salle et sa description.": "Add: this page lets you create a new object with its name, type, room and description.",
      "Objets: vous pouvez rechercher un objet, le modifier ou le supprimer.": "Objects: you can search for an object, edit it or delete it.",
      "Localisations: cette page montre une architecture interactive du bâtiment pour choisir une salle.": "Locations: this page shows an interactive building architecture to choose a room.",
      "Notifications: vous pouvez suivre les événements importants liés à l’application.": "Notifications: you can track the important events related to the application.",
      "Paramètres: l’administrateur y voit les utilisateurs, l’activité et l’historique admin.": "Settings: the administrator can see users, activity and admin history there.",
      "Dashboard utilisateur: il affiche les objets visibles et un accès rapide aux pages utiles.": "User dashboard: it shows visible objects and quick access to useful pages.",
      "Mes objets: permet de retrouver les objets suivis ou utilisés par l’utilisateur.": "My objects: lets the user find tracked or currently used objects.",
      "Localisations utilisateur: permet de consulter ou définir un emplacement dans le bâtiment.": "User locations: lets you view or define a location in the building.",
      "Notifications utilisateur: sert à suivre les informations importantes liées à l’activité.": "User notifications: used to follow important activity-related information.",
      "Paramètres utilisateur: permet de gérer les informations de profil et certaines préférences.": "User settings: lets you manage profile information and some preferences.",
      "Pour une bonne démonstration du projet, commencez par vous connecter avec un compte admin, ajoutez quelques objets, puis montrez la recherche et la localisation 3D.": "For a good project demo, start by signing in with an admin account, add a few objects, then show search and 3D location.",
      "Fiche objet": "Object sheet",
      "À vérifier": "Pending check",
      "Description non fournie": "No description provided",
      "Aucun objet dans vos favoris pour le moment.": "No object in your favorites yet.",
      "Aucun problème signalé pour le moment.": "No reported issue for now.",
      "Type de problème": "Issue type",
      "Description du problème": "Issue description",
      "Maximum 500 caractères": "Maximum 500 characters",
      "Envoyer le signalement": "Send report",
      "Signalements": "Reports",
      "Signaler un problème": "Report a problem",
      "Signalé le": "Reported on",
      "Ajouté le": "Added on",
      "Retirer": "Remove",
      "Retour a la liste": "Back to list",
      "Personnaliser votre nom": "Customize your name",
      "Bio:": "Bio:",
      "Email:": "Email:",
      "Type:": "Type:",
      "Problème:": "Issue:",
      "Salle:": "Room:",
      "Nom:": "Name:",
      "Role:": "Role:",
      "Mon profil": "My profile",
      "Ajouter un autre type": "Add another type",
      "Type non present dans la liste": "Type not present in the list",
      "Ajoutez une description utile si l’objet a une contrainte technique ou réseau.": "Add a useful description if the object has a technical or network constraint.",
      "Choisissez un type proche de l’usage réel pour garder un inventaire cohérent.": "Choose a type close to the real use to keep a consistent inventory.",
      "Utilisez un nom court mais identifiable, par exemple avec la zone ou la salle.": "Use a short but identifiable name, for example with the area or room.",
      "Vue 3D fluide": "Smooth 3D view",
      "Etages visuels": "Visual floors",
      "Position instantanee": "Instant position",
      "Localisation interactive": "Interactive location",
      "Salle active": "Active room",
      "Je suis ici": "I am here",
      "Aller a l'etage": "Go to floor",
      "Dashboard utilisateur": "User dashboard",
      "Voir mes objets": "View my objects",
      "Voir notifications": "View notifications",
      "Ajouter objet": "Add object",
      "Historique": "History",
      "Parametres": "Settings",
      "La home pose mieux la valeur du PFE avec un rendu plus propre, plus moderne et plus convaincant.": "The home page showcases the PFE value better with a cleaner, more modern and more convincing result.",
      "Plus visible": "More visible",
      "Plus clair": "Clearer",
      "Experience": "Experience",
      "Plateforme unifiee": "Unified platform",
      "Parcours metier": "Business journeys",
      "Types d’objets": "Object types",
      "Objets simules": "Simulated objects",
      "Base evolutive": "Scalable base",
      "Parcours differencies": "Separate journeys",
      "Usage concret": "Practical use",
      "Vision centralisee": "Centralized vision",
      "Pourquoi IntelliBuild se demarque": "Why IntelliBuild stands out",
      "Valeur du projet": "Project value",
      "Administrer": "Administer",
      "Suivre": "Track",
      "Localiser": "Locate",
      "Identifier": "Identify",
      "Les piliers de la plateforme": "The pillars of the platform",
      "Fonctionnalites fortes": "Key features",
      "Modules cles": "Key modules",
      "Objectif principal": "Main objective",
      "Ce qui fait la difference": "What makes the difference",
      "Notre mission": "Our mission",
      "En bref": "In short",
      "A propos du projet": "About the project",
      "Espace administrateur": "Administrator area",
      "Espace utilisateur": "User area",
      "Workflow conseillé": "Recommended workflow",
      "Conseils": "Tips",
      "FAQ": "FAQ",
      "ADMIN PRIVILEGES": "Admin privileges",
      "Sync en attente": "Pending sync",
      "Lignes chargées dans le journal utilisateur.": "Lines loaded in the user activity log.",
      "Actions admin actuellement disponibles.": "Admin actions currently available.",
      "Aucune action pour le moment.": "No action yet.",
      "Reset password": "Reset password",
      "Sign out": "Sign out",
      "Nom admin invalide.": "Invalid admin name.",
      "Role utilisateur mis a jour.": "User role updated.",
      "Utilisateur supprimé.": "User deleted.",
      "Erreur suppression utilisateur.": "User deletion error."
    },
    ar: {
      "Ajouter objet": "إضافة جهاز",
      "Dashboard utilisateur": "لوحة المستخدم",
      "Editer profil admin": "تعديل ملف المسؤول",
      "Dashboard: il affiche les statistiques principales, la recherche globale et les objets récents.": "لوحة التحكم: تعرض الإحصاءات الرئيسية والبحث العام والأجهزة الأخيرة.",
      "Ajouter: cette page permet de créer un nouvel objet avec son nom, son type, sa salle et sa description.": "إضافة: تتيح هذه الصفحة إنشاء جهاز جديد باسمه ونوعه وقاعته ووصفه.",
      "Objets: vous pouvez rechercher un objet, le modifier ou le supprimer.": "الأجهزة: يمكنك البحث عن جهاز وتعديله أو حذفه.",
      "Localisations: cette page montre une architecture interactive du bâtiment pour choisir une salle.": "المواقع: تعرض هذه الصفحة بنية تفاعلية للمبنى لاختيار قاعة.",
      "Notifications: vous pouvez suivre les événements importants liés à l’application.": "الإشعارات: يمكنك متابعة الأحداث المهمة المرتبطة بالتطبيق.",
      "Paramètres: l’administrateur y voit les utilisateurs, l’activité et l’historique admin.": "الإعدادات: يرى المسؤول فيها المستخدمين والنشاط وسجل المسؤول.",
      "Dashboard utilisateur: il affiche les objets visibles et un accès rapide aux pages utiles.": "لوحة المستخدم: تعرض الأجهزة الظاهرة ووصولًا سريعًا إلى الصفحات المفيدة.",
      "Mes objets: permet de retrouver les objets suivis ou utilisés par l’utilisateur.": "أجهزتي: تتيح للمستخدم العثور على الأجهزة المتابعة أو المستخدمة.",
      "Localisations utilisateur: permet de consulter ou définir un emplacement dans le bâtiment.": "مواقع المستخدم: تتيح عرض أو تحديد موقع داخل المبنى.",
      "Notifications utilisateur: sert à suivre les informations importantes liées à l’activité.": "إشعارات المستخدم: تُستخدم لمتابعة المعلومات المهمة المتعلقة بالنشاط.",
      "Paramètres utilisateur: permet de gérer les informations de profil et certaines préférences.": "إعدادات المستخدم: تتيح إدارة معلومات الملف الشخصي وبعض التفضيلات.",
      "Pour une bonne démonstration du projet, commencez par vous connecter avec un compte admin, ajoutez quelques objets, puis montrez la recherche et la localisation 3D.": "لعرض جيد للمشروع، ابدأ بتسجيل الدخول بحساب مسؤول، أضف بعض الأجهزة، ثم اعرض البحث والموقع ثلاثي الأبعاد.",
      "Fiche objet": "بطاقة الجهاز",
      "À vérifier": "بانتظار التحقق",
      "Description non fournie": "لا يوجد وصف مقدم",
      "Aucun objet dans vos favoris pour le moment.": "لا يوجد أي جهاز في المفضلة حاليًا.",
      "Aucun problème signalé pour le moment.": "لا توجد أي مشكلة مُبلّغ عنها حاليًا.",
      "Type de problème": "نوع المشكلة",
      "Description du problème": "وصف المشكلة",
      "Maximum 500 caractères": "الحد الأقصى 500 حرف",
      "Envoyer le signalement": "إرسال البلاغ",
      "Signalements": "البلاغات",
      "Signaler un problème": "الإبلاغ عن مشكلة",
      "Signalé le": "تم الإبلاغ في",
      "Ajouté le": "أضيف في",
      "Retirer": "إزالة",
      "Retour a la liste": "العودة إلى القائمة",
      "Personnaliser votre nom": "تخصيص اسمك",
      "Bio:": "النبذة:",
      "Email:": "البريد الإلكتروني:",
      "Type:": "النوع:",
      "Problème:": "المشكلة:",
      "Salle:": "القاعة:",
      "Nom:": "الاسم:",
      "Role:": "الدور:",
      "Mon profil": "ملفي الشخصي",
      "Ajouter un autre type": "إضافة نوع آخر",
      "Type non present dans la liste": "النوع غير موجود في القائمة",
      "Ajoutez une description utile si l’objet a une contrainte technique ou réseau.": "أضف وصفًا مفيدًا إذا كان للجهاز قيد تقني أو شبكي.",
      "Choisissez un type proche de l’usage réel pour garder un inventaire cohérent.": "اختر نوعًا قريبًا من الاستخدام الفعلي للحفاظ على جرد متناسق.",
      "Utilisez un nom court mais identifiable, par exemple avec la zone ou la salle.": "استخدم اسمًا قصيرًا لكن واضحًا، مثل المنطقة أو القاعة.",
      "Vue 3D fluide": "عرض ثلاثي الأبعاد سلس",
      "Etages visuels": "طوابق مرئية",
      "Position instantanee": "موقع فوري",
      "Localisation interactive": "موقع تفاعلي",
      "Salle active": "القاعة النشطة",
      "Je suis ici": "أنا هنا",
      "Aller a l'etage": "الذهاب إلى الطابق",
      "Voir mes objets": "عرض أجهزتي",
      "Voir notifications": "عرض الإشعارات",
      "Historique": "السجل",
      "Parametres": "الإعدادات",
      "La home pose mieux la valeur du PFE avec un rendu plus propre, plus moderne et plus convaincant.": "تعرض الصفحة الرئيسية قيمة مشروع التخرج بشكل أفضل وبمظهر أنظف وأكثر حداثة وإقناعًا.",
      "Plus visible": "أوضح",
      "Plus clair": "أوضح",
      "Experience": "التجربة",
      "Plateforme unifiee": "منصة موحدة",
      "Parcours metier": "مسارات العمل",
      "Types d’objets": "أنواع الأجهزة",
      "Objets simules": "أجهزة محاكاة",
      "Base evolutive": "قاعدة قابلة للتطور",
      "Parcours differencies": "مسارات مختلفة",
      "Usage concret": "استخدام عملي",
      "Vision centralisee": "رؤية مركزية",
      "Pourquoi IntelliBuild se demarque": "لماذا يتميز إنتيليبيلد",
      "Valeur du projet": "قيمة المشروع",
      "Administrer": "الإدارة",
      "Suivre": "المتابعة",
      "Localiser": "تحديد الموقع",
      "Identifier": "التعريف",
      "Les piliers de la plateforme": "ركائز المنصة",
      "Fonctionnalites fortes": "ميزات أساسية",
      "Modules cles": "الوحدات الأساسية",
      "Objectif principal": "الهدف الرئيسي",
      "Ce qui fait la difference": "ما الذي يصنع الفرق",
      "Notre mission": "مهمتنا",
      "En bref": "باختصار",
      "A propos du projet": "حول المشروع",
      "Espace administrateur": "مساحة المسؤول",
      "Espace utilisateur": "مساحة المستخدم",
      "Workflow conseillé": "سير العمل المقترح",
      "Conseils": "نصائح",
      "FAQ": "الأسئلة الشائعة",
      "ADMIN PRIVILEGES": "صلاحيات المسؤول",
      "Sync en attente": "مزامنة معلقة",
      "Lignes chargées dans le journal utilisateur.": "أسطر تم تحميلها في سجل نشاط المستخدم.",
      "Actions admin actuellement disponibles.": "إجراءات المسؤول المتاحة حاليًا.",
      "Aucune action pour le moment.": "لا يوجد أي إجراء حاليًا.",
      "Reset password": "إعادة تعيين كلمة المرور",
      "Sign out": "تسجيل الخروج",
      "Nom admin invalide.": "اسم المسؤول غير صالح.",
      "Role utilisateur mis a jour.": "تم تحديث دور المستخدم.",
      "Utilisateur supprimé.": "تم حذف المستخدم.",
      "Erreur suppression utilisateur.": "خطأ أثناء حذف المستخدم."
    }
  };

  const languageSelectorQuery = ".lang, .lang-select, .lang-selector, .sidebar-lang, [data-lang-selector], #langSelect";
  const autoAttributeNames = ["placeholder", "title", "aria-label"];
  const skippedAutoTranslateTags = {
    SCRIPT: true,
    STYLE: true,
    NOSCRIPT: true,
    TEMPLATE: true,
    TEXTAREA: true,
    SELECT: true,
    OPTION: true,
    CODE: true,
    PRE: true
  };
  const textNodeDefaults = new WeakMap();
  const attrDefaults = new WeakMap();
  const normalizedAutoTranslations = {};
  let sourceTextIndex = null;
  let translationObserver = null;
  let applyTimer = null;
  let isApplyingTranslations = false;
  let defaultDocumentTitle = "";
  let i18nextInitPromise = null;
  const localeDateTags = {
    fr: "fr-FR",
    en: "en-US",
    ar: "ar-EG"
  };
  const i18nextCdnSources = [
    "https://unpkg.com/i18next/dist/umd/i18next.min.js",
    "https://cdn.jsdelivr.net/npm/i18next/dist/umd/i18next.min.js"
  ];

  function normalizeLocale(locale) {
    const value = String(locale || "").toLowerCase();
    if (value === "en" || value === "ar" || value === "fr") return value;
    return "fr";
  }

  function getLocaleTag(locale) {
    return localeDateTags[normalizeLocale(locale)] || localeDateTags.fr;
  }

  function loadExternalScript(src) {
    return new Promise(function (resolve, reject) {
      const existing = document.querySelector('script[data-i18next-src="' + src + '"]');
      if (existing) {
        if (existing.getAttribute("data-loaded") === "true") {
          resolve();
          return;
        }
        existing.addEventListener("load", function () { resolve(); }, { once: true });
        existing.addEventListener("error", function () { reject(new Error("script_load_failed")); }, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.setAttribute("data-i18next-src", src);
      script.addEventListener("load", function () {
        script.setAttribute("data-loaded", "true");
        resolve();
      }, { once: true });
      script.addEventListener("error", function () {
        reject(new Error("script_load_failed"));
      }, { once: true });
      document.head.appendChild(script);
    });
  }

  async function initI18nextInstance(locale) {
    const activeLocale = normalizeLocale(locale);
    if (!window.i18next) throw new Error("i18next_missing");

    if (!window.i18next.isInitialized) {
      await window.i18next.init({
        lng: activeLocale,
        fallbackLng: "fr",
        resources: {
          fr: { translation: translations.fr },
          en: { translation: translations.en },
          ar: { translation: translations.ar }
        },
        ns: ["translation"],
        defaultNS: "translation",
        interpolation: {
          escapeValue: false
        },
        returnNull: false,
        returnEmptyString: false
      });
      return window.i18next;
    }

    ["fr", "en", "ar"].forEach(function (lang) {
      window.i18next.addResourceBundle(lang, "translation", translations[lang], true, true);
    });

    if (window.i18next.language !== activeLocale) {
      await window.i18next.changeLanguage(activeLocale);
    }
    return window.i18next;
  }

  function ensureI18next(locale) {
    if (window.i18next && window.i18next.isInitialized) {
      return Promise.resolve(window.i18next);
    }

    if (i18nextInitPromise) return i18nextInitPromise;

    i18nextInitPromise = (async function () {
      if (!window.i18next) {
        let loaded = false;
        for (const src of i18nextCdnSources) {
          try {
            await loadExternalScript(src);
            loaded = Boolean(window.i18next);
            if (loaded) break;
          } catch (_error) {
            // Try the next CDN source.
          }
        }
        if (!loaded) throw new Error("i18next_load_failed");
      }

      return initI18nextInstance(locale);
    })().catch(function (error) {
      i18nextInitPromise = null;
      throw error;
    });

    return i18nextInitPromise;
  }

  function interpolate(text, params) {
    let value = String(text == null ? "" : text);
    if (!params || typeof params !== "object") return value;

    Object.keys(params).forEach(function (key) {
      value = value.replace(new RegExp("\\{" + key + "\\}", "g"), String(params[key] == null ? "" : params[key]));
    });

    return value;
  }

  function canonicalText(value) {
    return String(value || "")
      .replace(/\u00a0/g, " ")
      .replace(/[’‘]/g, "'")
      .replace(/[“”]/g, '"')
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function getNormalizedAutoTranslations(locale) {
    const activeLocale = normalizeLocale(locale);
    if (normalizedAutoTranslations[activeLocale]) {
      return normalizedAutoTranslations[activeLocale];
    }

    const rawPack = Object.assign(
      {},
      autoTranslations[activeLocale] || {},
      supplementalAutoTranslations[activeLocale] || {}
    );
    const normalizedPack = {};
    Object.keys(rawPack).forEach(function (key) {
      normalizedPack[canonicalText(key)] = rawPack[key];
    });
    normalizedAutoTranslations[activeLocale] = normalizedPack;
    return normalizedPack;
  }

  function getSourceTextIndex() {
    if (sourceTextIndex) return sourceTextIndex;

    sourceTextIndex = {};
    Object.keys(translations.fr).forEach(function (key) {
      const value = translations.fr[key];
      if (typeof value !== "string") return;
      if (value.indexOf("<") !== -1 || value.indexOf("{") !== -1) return;
      const normalized = canonicalText(value);
      if (!normalized || sourceTextIndex[normalized]) return;
      sourceTextIndex[normalized] = key;
    });

    return sourceTextIndex;
  }

  function translateTextValue(locale, text) {
    const activeLocale = normalizeLocale(locale);
    const original = String(text == null ? "" : text);
    const normalized = canonicalText(original);
    if (!normalized || activeLocale === "fr") return original;

    const indexedKey = getSourceTextIndex()[normalized];
    if (indexedKey && translations[activeLocale] && translations[activeLocale][indexedKey]) {
      return translations[activeLocale][indexedKey];
    }

    return getNormalizedAutoTranslations(activeLocale)[normalized] || translatePatternText(activeLocale, original) || original;
  }

  function translatePatternText(locale, text) {
    const activeLocale = normalizeLocale(locale);
    const value = String(text || "").trim();
    let match = value.match(/^Ma\s+Position\s*:\s*(.+)$/i) || value.match(/^Ma\s+position\s*:\s*(.+)$/i);
    if (match) {
      return activeLocale === "ar" ? "موقعي: " + match[1] : "My position: " + match[1];
    }

    match = value.match(/^Langue active\s*:\s*([A-Z]{2})$/i);
    if (match) {
      return interpolate(getTranslation(activeLocale, "lang_active", "Active language: {code}"), {
        code: match[1].toUpperCase()
      });
    }

    match = value.match(/^(\d+)\s+salles uniques$/i);
    if (match) {
      return activeLocale === "ar" ? match[1] + " قاعات فريدة" : match[1] + " unique rooms";
    }

    match = value.match(/^(\d+)\s+objet\(s\)\s+charg/i);
    if (match) {
      return activeLocale === "ar" ? match[1] + " جهاز تم تحميله في الكتالوج." : match[1] + " object(s) loaded in the catalog.";
    }

    match = value.match(/^Ajout[ée]?\s+le\s+(.+)$/i);
    if (match) {
      return interpolate(getTranslation(activeLocale, "added_on", "Added on {date}"), { date: match[1] });
    }

    match = value.match(/^Signal[ée]?\s+le\s+(.+)$/i);
    if (match) {
      return interpolate(getTranslation(activeLocale, "reported_on", "Reported on {date}"), { date: match[1] });
    }

    match = value.match(/^Objets\s+dans\s+cette\s+salle\s*:\s*(\d+)$/i);
    if (match) {
      return activeLocale === "ar" ? "الأجهزة في هذه القاعة: " + match[1] : "Objects in this room: " + match[1];
    }

    match = value.match(/^Localisation\s+mise\s+a\s+jour\s*:?\s*(.+)?$/i);
    if (match) {
      const room = String(match[1] || "").trim();
      if (!room) {
        return activeLocale === "ar" ? "تم تحديث الموقع" : "Location updated";
      }
      return activeLocale === "ar" ? "تم تحديث الموقع: " + room : "Location updated: " + room;
    }

    match = value.match(/^Objet\s*:\s*(.+)$/i);
    if (match) {
      return activeLocale === "ar" ? "الجهاز: " + match[1] : "Object: " + match[1];
    }

    match = value.match(/^(.+)\s+ajout[ée]?\s+aux\s+favoris$/i);
    if (match) {
      return interpolate(getTranslation(activeLocale, "favorite_added_message", "{name} added to favorites"), {
        name: match[1]
      });
    }

    match = value.match(/^(.+)\s+retir[ée]?\s+des\s+favoris$/i);
    if (match) {
      return interpolate(getTranslation(activeLocale, "favorite_removed_message", "{name} removed from favorites"), {
        name: match[1]
      });
    }

    match = value.match(/^Impossible\s+de\s+prendre\s+(.+)$/i);
    if (match) {
      return interpolate(getTranslation(activeLocale, "take_object_failed_named", "Unable to borrow {name}"), {
        name: match[1]
      });
    }

    match = value.match(/^(.+)\s+pris$/i);
    if (match) {
      return interpolate(getTranslation(activeLocale, "object_taken_named", "{name} borrowed"), {
        name: match[1]
      });
    }

    match = value.match(/^(.+)\s+est\s+(.+)$/i);
    if (match) {
      return interpolate(getTranslation(activeLocale, "availability_message", "{name} is {status}"), {
        name: match[1],
        status: translateTextValue(activeLocale, match[2])
      });
    }

    match = value.match(/^Users\s+sync\s+(.+)$/i);
    if (match) {
      return activeLocale === "ar" ? "مزامنة المستخدمين " + match[1] : "Users sync " + match[1];
    }

    match = value.match(/^Activit[ée]\s+sync\s+(.+)$/i);
    if (match) {
      return activeLocale === "ar" ? "مزامنة النشاط " + match[1] : "Activity sync " + match[1];
    }

    match = value.match(/^Historique\s+sync\s+(.+)$/i);
    if (match) {
      return activeLocale === "ar" ? "مزامنة السجل " + match[1] : "History sync " + match[1];
    }

    return "";
  }

  function rememberDefault(element) {
    if (!element || !element.dataset) return;

    const attr = element.getAttribute("data-attr");
    if (attr) {
      if (!element.dataset.i18nDefaultAttr) {
        element.dataset.i18nDefaultAttr = element.getAttribute(attr) || "";
      }
      return;
    }

    if (element.getAttribute("data-html") === "true") {
      if (!element.dataset.i18nDefaultHtml) {
        element.dataset.i18nDefaultHtml = element.innerHTML;
      }
      return;
    }

    if (!element.dataset.i18nDefaultText) {
      element.dataset.i18nDefaultText = element.textContent || "";
    }
  }

  function getTranslation(locale, key, fallback, params) {
    const activeLocale = normalizeLocale(locale);
    const i18nextInstance = window.i18next && window.i18next.isInitialized ? window.i18next : null;
    if (i18nextInstance && key && i18nextInstance.exists(key, { lng: activeLocale, ns: "translation" })) {
      return interpolate(
        i18nextInstance.t(key, Object.assign({ lng: activeLocale, ns: "translation" }, params || {})),
        params
      );
    }

    const pack = translations[activeLocale] || {};
    let value;
    if (Object.prototype.hasOwnProperty.call(pack, key)) {
      value = pack[key];
    } else if (fallback != null && fallback !== "") {
      value = translateTextValue(activeLocale, fallback);
    } else {
      value = key;
    }
    return interpolate(value == null ? key : value, params);
  }

  function shouldSkipAutoTranslate(node) {
    const parent = node && node.parentElement;
    if (!parent) return true;
    if (skippedAutoTranslateTags[parent.tagName]) return true;
    if (parent.closest("[data-key], [data-no-translate]")) return true;
    return false;
  }

  function translateAutomaticText(locale, root) {
    if (!root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node || !node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (shouldSkipAutoTranslate(node)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach(function (node) {
      if (!textNodeDefaults.has(node)) {
        textNodeDefaults.set(node, node.nodeValue);
      }

      const source = textNodeDefaults.get(node);
      const translated = translateTextValue(locale, source);
      if (node.nodeValue !== translated) {
        node.nodeValue = translated;
      }
    });
  }

  function translateAutomaticAttributes(locale, root) {
    if (!root || !root.querySelectorAll) return;

    const selector = autoAttributeNames.map(function (attr) {
      return "[" + attr + "]";
    }).join(",");

    root.querySelectorAll(selector).forEach(function (element) {
      if (!element || element.closest("[data-no-translate]")) return;
      if (element.hasAttribute("data-key") && element.hasAttribute("data-attr")) return;

      let defaults = attrDefaults.get(element);
      if (!defaults) {
        defaults = {};
        attrDefaults.set(element, defaults);
      }

      autoAttributeNames.forEach(function (attr) {
        if (!element.hasAttribute(attr)) return;
        if (!Object.prototype.hasOwnProperty.call(defaults, attr)) {
          defaults[attr] = element.getAttribute(attr) || "";
        }
        const translated = translateTextValue(locale, defaults[attr]);
        if (element.getAttribute(attr) !== translated) {
          element.setAttribute(attr, translated);
        }
      });
    });
  }

  function updateLanguageNotes(locale) {
    const activeLocale = normalizeLocale(locale);
    const code = activeLocale.toUpperCase();
    document.querySelectorAll(".lang-note, [data-lang-note], #langNote").forEach(function (element) {
      element.textContent = getTranslation(activeLocale, "lang_active", "Langue active: {code}", { code: code });
    });
  }

  function translateDocumentTitle(locale) {
    const titleElement = document.querySelector("title");
    if (titleElement && titleElement.hasAttribute("data-key")) return;
    if (!defaultDocumentTitle) {
      defaultDocumentTitle = document.title || "";
    }

    const translated = translateTextValue(locale, defaultDocumentTitle);
    if (translated && document.title !== translated) {
      document.title = translated;
    }
  }

  function getLanguageSelects() {
    const seen = [];
    document.querySelectorAll(languageSelectorQuery).forEach(function (node) {
      const select = node && node.tagName === "SELECT" ? node : node.querySelector && node.querySelector("select");
      if (!select || seen.indexOf(select) !== -1) return;
      seen.push(select);
    });
    return seen;
  }

  function applyDirection(locale) {
    const dir = locale === "ar" ? "rtl" : "ltr";

    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    document.documentElement.setAttribute("dir", dir);

    if (document.body) {
      document.body.dir = dir;
    }
  }

  function applyTranslations(locale, emitEvent) {
    const activeLocale = normalizeLocale(
      locale || localStorage.getItem("lang") || document.documentElement.lang || "fr"
    );
    const previousScrollX = window.pageXOffset || document.documentElement.scrollLeft || 0;
    const previousScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

    isApplyingTranslations = true;
    try {
      applyDirection(activeLocale);

      document.querySelectorAll("[data-key]").forEach(function (element) {
        rememberDefault(element);

        const key = element.getAttribute("data-key");
        const attr = element.getAttribute("data-attr");
        let value;

        if (attr) {
          value = getTranslation(activeLocale, key, element.dataset.i18nDefaultAttr || "");
          if (element.getAttribute(attr) !== value) element.setAttribute(attr, value);
          return;
        }

        if (element.getAttribute("data-html") === "true") {
          value = getTranslation(activeLocale, key, element.dataset.i18nDefaultHtml || "");
          if (element.innerHTML !== value) element.innerHTML = value;
          return;
        }

        value = getTranslation(activeLocale, key, element.dataset.i18nDefaultText || "");
        if (element.textContent !== value) element.textContent = value;
      });

      if (document.body) {
        translateAutomaticText(activeLocale, document.body);
        translateAutomaticAttributes(activeLocale, document.body);
      }

      translateDocumentTitle(activeLocale);
      getLanguageSelects().forEach(function (select) {
        if (select.value !== activeLocale) {
          select.value = activeLocale;
        }
      });

      updateLanguageNotes(activeLocale);
    } finally {
      isApplyingTranslations = false;
    }

    if (emitEvent === true) {
      const detail = { locale: activeLocale };
      document.dispatchEvent(new CustomEvent("languageChanged", { detail: detail }));
      window.dispatchEvent(new CustomEvent("app:languagechange", { detail: detail }));
    }

    if (typeof window.scrollTo === "function") {
      window.setTimeout(function () {
        window.scrollTo(previousScrollX, previousScrollY);
      }, 0);
    }
  }

  function setLanguage(locale) {
    const activeLocale = normalizeLocale(locale);
    localStorage.setItem("lang", activeLocale);
    if (window.i18next && window.i18next.isInitialized && window.i18next.language !== activeLocale) {
      window.i18next.changeLanguage(activeLocale).catch(function () {
        // Keep the existing fallback translator active even if i18next fails.
      });
    }
    applyTranslations(activeLocale, true);
  }

  function bindLanguageSelectors() {
    getLanguageSelects().forEach(function (select) {
      if (select.dataset.i18nBound === "true") return;
      select.dataset.i18nBound = "true";

      select.addEventListener("change", function (event) {
        setLanguage(event.target.value);
      });

      select.addEventListener("input", function (event) {
        setLanguage(event.target.value);
      });
    });
  }

  function scheduleApplyTranslations() {
    if (isApplyingTranslations || applyTimer) return;
    applyTimer = window.setTimeout(function () {
      applyTimer = null;
      bindLanguageSelectors();
      applyTranslations(localStorage.getItem("lang") || document.documentElement.lang || "fr");
    }, 40);
  }

  function startTranslationObserver() {
    if (translationObserver || !window.MutationObserver || !document.body) return;

    translationObserver = new MutationObserver(function (mutations) {
      const shouldRefresh = mutations.some(function (mutation) {
        if (mutation.type === "childList" && mutation.addedNodes && mutation.addedNodes.length > 0) return true;
        if (mutation.type === "characterData") return true;
        return mutation.type === "attributes";
      });
      if (shouldRefresh) {
        scheduleApplyTranslations();
      }
    });

    translationObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label", "data-key", "data-attr", "data-html"],
      characterData: true,
      childList: true,
      subtree: true
    });
  }

  function bootTranslations() {
    bindLanguageSelectors();
    const initialLocale = localStorage.getItem("lang") || "fr";
    ensureI18next(initialLocale)
      .then(function () {
        applyTranslations(initialLocale);
      })
      .catch(function () {
        applyTranslations(initialLocale);
      });
    startTranslationObserver();
  }

  window.translations = translations;
  window.tr = function (key, fallback, params) {
    const locale = normalizeLocale(localStorage.getItem("lang") || document.documentElement.lang || "fr");
    return getTranslation(locale, key, fallback || key, params);
  };
  window.getTranslationText = window.tr;
  window.applyTranslations = function (locale) {
    applyTranslations(locale, true);
  };
  window.setLanguage = setLanguage;
  window.setLang = setLanguage;
  window.getCurrentLocale = function () {
    return normalizeLocale(localStorage.getItem("lang") || document.documentElement.lang || "fr");
  };
  window.getLocaleDateTag = function (locale) {
    return getLocaleTag(locale || localStorage.getItem("lang") || document.documentElement.lang || "fr");
  };
  window.whenI18nReady = function () {
    return ensureI18next(localStorage.getItem("lang") || document.documentElement.lang || "fr");
  };
  window.getI18nextInstance = function () {
    return window.i18next && window.i18next.isInitialized ? window.i18next : null;
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootTranslations, { once: true });
  } else {
    bootTranslations();
    setTimeout(bindLanguageSelectors, 100);
  }

  window.addEventListener("load", function () {
    bindLanguageSelectors();
    applyTranslations(localStorage.getItem("lang") || "fr");
  });
})();
