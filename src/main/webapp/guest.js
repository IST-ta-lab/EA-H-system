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
    guestPromptMessage: "You are not registered. Please login/register first.",
    loginPage: "index.html",
    uiText: {
        navMessageAriaLabel: "Login to contact course leads",
        navLogoutLabel: "Register / Login",
        navAvatarAriaLabel: "Open guest preferences",
        pageTitle: "Browse Roles.",
        pageDescription: "Explore teaching assistant roles as a guest. Pick a few tags to preview which courses may fit you best.",
        profileButtonLabel: "Guest Preferences",
        contactButtonLabel: "Login to Message",
        applyButtonLabel: "Login to Apply",
        appliedButtonLabel: "Login to Apply",
        submitApplicationLabel: "Login to Apply"
    },
    profileDefaults: {
        name: "Guest",
        major: "Not provided",
        bio: "Passionate about teaching and helping others learn programming.",
        email: "",
        isVisible: true,
        visibilityScope: "applied_only",
        skills: [],
        tags: []
    }
};
