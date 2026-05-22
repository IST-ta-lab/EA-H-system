window.TA_PORTAL_CONFIG = {
    role: "guest",
    allowProfileView: true,
    allowProfileEdit: false,
    allowApply: false,
    allowResumeUpload: false,
    allowResumePreview: false,
    allowMessage: false,
    allowLogout: false,
    showRecommendations: false,
    showJobDetailMatch: true,
    showContactButton: true,
    showGuestPrompt: true,
    guestPromptMessage: "You are browsing as a guest. Register or login to apply, message course leads, and save your profile.",
    loginPage: "index.html",
    uiText: {
        navMessageAriaLabel: "Login to contact course leads",
        navLogoutLabel: "Register / Login",
        navAvatarAriaLabel: "Open guest preferences",
        pageTitle: "Browse TA Roles.",
        pageDescription: "Explore teaching assistant roles as a guest. Use tags to preview your interests before creating an account.",
        profileButtonLabel: "Guest Preferences",
        openDetailsButtonLabel: "Preview Details",
        contactButtonLabel: "Login to Contact",
        applyButtonLabel: "Login to Apply",
        appliedButtonLabel: "Login to Apply",
        submitApplicationLabel: "Login to Apply"
    },
    profileDefaults: {
        name: "Guest Visitor",
        major: "Preview Mode",
        bio: "Browsing open TA roles and testing tag preferences before registering.",
        email: "",
        isVisible: true,
        visibilityScope: "applied_only",
        skills: [],
        tags: []
    }
};
