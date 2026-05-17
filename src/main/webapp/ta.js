const BASE_URL = "/tapj"; // Backend API connected

const AVAILABLE_JOBS = [];

const POPULAR_TAGS = [
    "Python",
    "Machine Learning",
    "Grading",
    "Office Hours",
    "Math",
    "Essay Review",
    "Lab Assistant",
    "Java",
    "C++"
];

const DEFAULT_PORTAL_CONFIG = {
    role: "ta",
    allowProfileView: true,
    allowProfileEdit: true,
    allowApply: true,
    allowResumeUpload: true,
    allowResumePreview: true,
    allowMessage: true,
    allowLogout: true,
    showRecommendations: true,
    showJobCardMatch: true,
    showJobDetailMatch: true,
    showContactButton: true,
    showGuestPrompt: false,
    guestPromptMessage: "You are not registered. Please login/register first.",
    loginPage: "index.html",
    uiText: {
        navMessageAriaLabel: "Open messages",
        navLogoutLabel: "Logout",
        navAvatarAriaLabel: "Open profile",
        pageTitle: "Discover Roles.",
        pageDescription: "Explore and apply for teaching assistant positions. Enhance your academic journey by mentoring others.",
        pageRecommendedDescription: "Recommended roles are shown first based on your TA profile, with {count} matched position{suffix} available now.",
        profileButtonLabel: "View Profile",
        searchPlaceholder: "Search by course or professor...",
        contactButtonLabel: "Message",
        openDetailsButtonLabel: "View Details",
        applyButtonLabel: "Apply",
        appliedButtonLabel: "Applied",
        submitApplicationLabel: "Submit Application"
    },
    profileDefaults: {
        name: "Guest User",
        major: "Not provided",
        bio: "Passionate about teaching and helping others learn programming.",
        email: "",
        isVisible: true,
        visibilityScope: "applied_only",
        skills: ["Python", "Grading", "Java"],
        tags: []
    }
};

const runtimeConfig = window.TA_PORTAL_CONFIG || {};
const portalConfig = {
    ...DEFAULT_PORTAL_CONFIG,
    ...runtimeConfig,
    uiText: {
        ...DEFAULT_PORTAL_CONFIG.uiText,
        ...(runtimeConfig.uiText || {})
    },
    profileDefaults: {
        ...DEFAULT_PORTAL_CONFIG.profileDefaults,
        ...(runtimeConfig.profileDefaults || {})
    }
};

const state = {
    currentView: "feed",
    jobs: [],
    applications: [],
    hasResume: false,
    resumeName: "",
    resumePreviewUrl: "",
    resumeObjectUrl: "",
    isUploadingResume: false,
    recommendedJobs: {},
    recommendationLoaded: false,
    availableTags: [...POPULAR_TAGS],

    searchQuery: "",
    activeTags: [],

    isProfileModalOpen: false,
    selectedJob: null,

    currentUser: null, // Backend API connected

    profile: {
        ...portalConfig.profileDefaults
    },

    appRemarks: "",
    appOptions: {
        takenCourse: false,
        inPerson: true
    }
};

const els = {};
const modalRegistry = {};
let modalStack = [];

const Icons = {
    search: `
    <svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m21 21-4.35-4.35M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
    sliders: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h9M17 6h3M10 6a2 2 0 1 0 0 0ZM4 12h3M11 12h9M14 12a2 2 0 1 0 0 0ZM4 18h11M19 18h1M16 18a2 2 0 1 0 0 0Z"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
    user: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
    clock: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
    sparkles: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3 1.8 4.7L18.5 9l-4.7 1.3L12 15l-1.8-4.7L5.5 9l4.7-1.3L12 3Zm7 11 1 2.5L22.5 17 20 17.5 19 20l-1-2.5L15.5 17 18 16.5 19 14ZM5 14l1 2.5L8.5 17 6 17.5 5 20l-1-2.5L1.5 17 4 16.5 5 14Z"
        fill="currentColor"/>
    </svg>
  `,
    edit: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 20 8-8-4-4-8 8-1 5 5-1ZM14 6l4 4"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
    chevronRight: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 18 6-6-6-6"
        fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
    upload: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 16V6m0 0-4 4m4-4 4 4M5 17.5A3.5 3.5 0 0 0 8.5 21h7A3.5 3.5 0 0 0 19 17.5"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
    file: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <path d="M14 3v5h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  `,
    checkCircle: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 12 2 2 4-4M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
    briefcase: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M4 9h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Zm0 0V8a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v1"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  `,
    target: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.36-6.36-2.12 2.12M7.76 16.24l-2.12 2.12m0-12.72 2.12 2.12m8.48 8.48 2.12 2.12M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm4 0a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
    send: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7Z"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    </svg>
  `
};

function showGuestPrompt() {
    if (!portalConfig.showGuestPrompt) return false;

    const overlay = els.guestModalOverlay || document.getElementById("guestModalOverlay");
    const description = overlay && overlay.querySelector(".guest-modal-desc");
    if (!overlay) return false;

    if (description) {
        description.textContent = portalConfig.guestPromptMessage;
    }

    openModal("guestPrompt");
    return true;
}

function closeGuestPrompt() {
    closeModal("guestPrompt");
}

function goToLoginPage() {
    location.href = portalConfig.loginPage;
}

function handleRestrictedAction() {
    return showGuestPrompt();
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function getInitials(name) {
    return (name || "U")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase() || "")
        .join("");
}

function normalizeTagList(tags) {
    if (Array.isArray(tags)) {
        return tags
            .map(tag => String(tag || "").trim())
            .filter(Boolean);
    }

    if (typeof tags === "string") {
        return tags
            .split(/[,，]/)
            .map(tag => tag.trim())
            .filter(Boolean);
    }

    return [];
}

// Backend API connected
function showError(message) {
    alert(message || "Request failed");
}

// Backend API connected
async function request(url, options = {}) {
    try {
        const res = await fetch(BASE_URL + url, {
            credentials: "include",
            ...options
        });
        const text = await res.text();

        try {
            return { ok: true, data: JSON.parse(text) };
        } catch (e) {
            return { ok: false, raw: text };
        }
    } catch (e) {
        return { ok: false, error: e.message };
    }
}

// Backend API connected
function mapUserToProfile(user) {
    if (!user) return;

    state.currentUser = user;
    state.profile.name = user.realName || user.username || "Unnamed User";
    state.profile.email = user.email || "";
    state.profile.major = user.major || user.course || "Not specified";
    if (typeof user.selfIntro !== "undefined") {
        state.profile.bio = user.selfIntro || "";
    }
    if (Array.isArray(user.skillIds)) {
        state.profile.skills = user.skillIds;
    }
    if (Array.isArray(user.tags)) {
        state.profile.tags = user.tags;
    }
    if (typeof user.profileVisible === "boolean") {
        state.profile.isVisible = user.profileVisible;
    }
}

// Backend API connected
function mapJobFromBackend(job) {
    const backendTags = normalizeTagList(job.tags);
    const contactUserId = job.publisherMoId || job.publisherId || job.publisherUserId || job.moId || job.userId || "";
    const contactName = job.publisherName || job.moName || "Course Lead";
    return {
        id: job.jobId,
        course: job.jobName || "Untitled Role",
        prof: contactName,
        hours: job.workHoursWeekly || 0,
        contactUserId: contactUserId ? String(contactUserId) : "",
        contactName,
        tags: backendTags,
        description: job.jobDesc || "No description available",
        raw: job
    };
}

// Backend API connected
function mapApplicationFromBackend(app) {
    const statusCode = typeof app.applyStatus === "number" ? app.applyStatus : Number(app.status);
    const applicationStatus = getApplicationStatusMeta(statusCode);
    const jobTypeMeta = getJobTypeMeta(app.jobType);
    return {
        id: app.applicationId,
        jobId: app.jobId,
        status: applicationStatus.label,
        statusCode,
        raw: app,
        job: {
            course: app.jobName ? app.jobName : `RoleID: ${app.jobId}`,
            module: app.belongModule || "Uncategorized",
            typeLabel: jobTypeMeta.label,
            description: app.jobDesc || "No description available",
            hours: typeof app.workHoursWeekly === "number" ? app.workHoursWeekly : null
        }
    };
}

function getStatusMeta(category, value) {
    const normalizedValue = Number(value);

    if (category === "application") {
        switch (normalizedValue) {
            case 0:
                return { label: "Pending", className: "badge-warning", canCancel: true };
            case 1:
                return { label: "Approved", className: "badge-success", canCancel: false };
            case 2:
                return { label: "Rejected", className: "badge-danger", canCancel: false };
            default:
                return { label: "Unknown", className: "badge-soft", canCancel: false };
        }
    }

    if (category === "jobType") {
        switch (normalizedValue) {
            case 1:
                return { label: "Course TA", className: "badge-primary" };
            case 2:
                return { label: "Exam Proctor TA", className: "badge-primary" };
            case 3:
                return { label: "Activity TA", className: "badge-primary" };
            default:
                return { label: "Role", className: "badge-soft" };
        }
    }

    if (category === "matchScore") {
        if (!Number.isFinite(normalizedValue)) {
            return { label: "Role Match: --", className: "badge-soft" };
        }

        return {
            label: `Role Match: ${normalizedValue}%`,
            className: normalizedValue >= 80 ? "badge-success" : "badge-primary"
        };
    }

    if (category === "recommendationScore") {
        if (!Number.isFinite(normalizedValue) || normalizedValue <= 0) {
            return null;
        }

        return {
            label: `Recommended ${(normalizedValue * 100).toFixed(1)}%`,
            className: "badge-success"
        };
    }

    return { label: "Unknown", className: "badge-soft" };
}

function formatApplyStatus(statusCode) {
    return getStatusMeta("application", statusCode).label;
}

function getApplicationStatusMeta(statusCode) {
    return getStatusMeta("application", statusCode);
}

function formatJobType(jobType) {
    return getStatusMeta("jobType", jobType).label;
}

function getJobTypeMeta(jobType) {
    return getStatusMeta("jobType", jobType);
}

function getMatchScoreMeta(score) {
    return getStatusMeta("matchScore", score);
}

function getRecommendationScoreMeta(score) {
    return getStatusMeta("recommendationScore", score);
}

function getFilteredJobs() {
    const filteredJobs = state.jobs.filter(job => {
        const matchesSearch =
            String(job.course || "").toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            String(job.prof || "").toLowerCase().includes(state.searchQuery.toLowerCase());

        const matchesTags =
            state.activeTags.length === 0 ||
            state.activeTags.every(tag => (job.tags || []).includes(tag));

        return matchesSearch && matchesTags;
    });

    return [...filteredJobs].sort((left, right) => {
        const recommendationGap = getJobRecommendationScore(right) - getJobRecommendationScore(left);
        if (recommendationGap !== 0) {
            return recommendationGap;
        }

        const matchGap = getMatchData(right).score - getMatchData(left).score;
        if (matchGap !== 0) {
            return matchGap;
        }

        return String(left.course || "").localeCompare(String(right.course || ""));
    });
}

function getMatchData(job) {
    if (!job) return null;

    const jobTags = normalizeTagList(job.tags);
    const userTags = normalizeTagList(
        state.profile.tags && state.profile.tags.length > 0
            ? state.profile.tags
            : state.profile.skills
    );
    const userTagSet = new Set(userTags.map(tag => tag.toLowerCase()));

    if (jobTags.length === 0) {
        return { score: 100, matched: [], missing: [] };
    }

    const matched = jobTags.filter(tag => userTagSet.has(tag.toLowerCase()));
    const missing = jobTags.filter(tag => !userTagSet.has(tag.toLowerCase()));
    const score = Math.round((matched.length / jobTags.length) * 100);

    return { score, matched, missing };
}

function getRecommendationTaId() {
    if (!state.currentUser) return "";

    return state.currentUser.userId
        || state.currentUser.taId
        || state.currentUser.uid
        || "";
}

function getJobRecommendationScore(job) {
    if (!job || !job.id) return 0;
    return Number(state.recommendedJobs[String(job.id)] || 0);
}

async function loadRecommendedJobs() {
    if (!portalConfig.showRecommendations) {
        state.recommendedJobs = {};
        state.recommendationLoaded = true;
        return;
    }

    const taId = getRecommendationTaId();
    if (!taId) {
        state.recommendedJobs = {};
        state.recommendationLoaded = true;
        return;
    }

    const r = await request(`/recommend?action=recommendJobsForTA&taId=${encodeURIComponent(taId)}&topK=10`);
    if (r.ok && r.data && r.data.code === 200) {
        const recommendations = Array.isArray(r.data.data) ? r.data.data : [];
        state.recommendedJobs = recommendations.reduce((acc, item) => {
            const jobId = item.id || item.jobId;
            if (!jobId) return acc;
            acc[String(jobId)] = Number(item.score || 0);
            return acc;
        }, {});
        state.recommendationLoaded = true;
        return;
    }

    state.recommendedJobs = {};
    state.recommendationLoaded = true;
}

function isJobApplied(jobId) {
    return state.applications.some(app => String(app.jobId) === String(jobId));
}

function getJobContactInfo(job) {
    if (!job) return { userId: "", name: "Course Lead" };

    const raw = job.raw || {};
    const userId = raw.publisherMoId || raw.publisherId || raw.publisherUserId || raw.moId || raw.userId || job.contactUserId || "";
    const name = raw.publisherName || raw.moName || job.contactName || job.prof || "Course Lead";
    return {
        userId: userId ? String(userId) : "",
        name
    };
}

function getJobDisplayData(job) {
    if (!job) return null;

    const raw = job.raw || {};
    const tags = normalizeTagList(job.tags);
    const contact = getJobContactInfo(job);
    const match = getMatchData(job) || { score: NaN, matched: [], missing: [] };
    const recommendationScore = portalConfig.showRecommendations ? getJobRecommendationScore(job) : 0;

    return {
        id: job.id,
        title: job.course || "Untitled Role",
        description: job.description || "No description available",
        tags,
        contact,
        hours: job.hours || 0,
        module: raw.belongModule || "Uncategorized",
        jobTypeMeta: getJobTypeMeta(raw.jobType),
        match,
        matchMeta: getMatchScoreMeta(match.score),
        recommendationMeta: getRecommendationScoreMeta(recommendationScore)
    };
}

function renderJobTags(tags, emptyLabel = "No tags listed") {
    return tags.length > 0
        ? tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")
        : `<span class="tag">${escapeHtml(emptyLabel)}</span>`;
}

function renderJobMatchSummary(match) {
    return `
    Matched tags: ${match.matched.length > 0 ? escapeHtml(match.matched.join(", ")) : "None"}.
    ${
        match.missing.length > 0
            ? `Missing tags: ${escapeHtml(match.missing.join(", "))}.`
            : " Your current tags cover the listed tags."
    }
  `;
}

function renderEmptyState({ title, description, tips = [], compact = false }) {
    return `
    <div class="empty-state ${compact ? "empty-state-compact" : ""}">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(description)}</span>
      ${
        tips.length > 0
            ? `
              <div class="empty-state-tips">
                ${tips.map(tip => `<span class="empty-tip">${escapeHtml(tip)}</span>`).join("")}
              </div>
            `
            : ""
    }
    </div>
  `;
}

function setView(viewName) {
    if (viewName === "profile" && !portalConfig.allowProfileView) {
        handleRestrictedAction();
        return;
    }

    state.currentView = viewName;
    render();
}

function toggleTag(tag) {
    if (state.activeTags.includes(tag)) {
        state.activeTags = state.activeTags.filter(item => item !== tag);
    } else {
        state.activeTags = [...state.activeTags, tag];
    }
    renderFeedView();
}

// Backend API connected
async function loadLoginUser() {
    if (portalConfig.role === "guest") {
        state.currentUser = null;
        state.profile = {
            ...portalConfig.profileDefaults
        };
        render();
        return true;
    }

    const r = await request("/user?action=getLoginUser");
    if (r.ok && r.data.code === 200) {
        mapUserToProfile(r.data.data);
        render();
        return true;
    }

    alert("Not logged in or session expired. Please log in again.");
    location.href = "index.html";
    return false;
}

// Backend API connected
async function loadOpenJobs() {
    const r = await request("/job?action=listOpen");
    if (r.ok && r.data.code === 200) {
        const jobs = Array.isArray(r.data.data) ? r.data.data : [];
        state.jobs = jobs.map(mapJobFromBackend);
        renderFeedView();
        return;
    }

    state.jobs = [];
    renderFeedView();
    showError((r.data && r.data.msg) || r.error || "Failed to load roles");
}

// Backend API connected
async function loadMyApplications() {
    if (!portalConfig.allowApply) {
        state.applications = [];
        renderSidebar();
        if (state.currentView === "profile") {
            renderProfileView();
        }
        return;
    }

    const r = await request("/application?action=listMy");
    if (r.ok && r.data.code === 200) {
        const apps = Array.isArray(r.data.data) ? r.data.data : [];
        state.applications = apps.map(mapApplicationFromBackend);
        renderSidebar();
        if (state.currentView === "profile") {
            renderProfileView();
        }
        return;
    }

    state.applications = [];
    renderSidebar();
}

// Backend API connected
async function logout() {
    if (!portalConfig.allowLogout) {
        handleRestrictedAction();
        return;
    }

    if (!confirm("Are you sure you want to logout?")) {
        return;
    }

    const r = await request("/user?action=logout", { method: "POST" });
    if (r.ok && r.data && r.data.code === 200) {
        alert(r.data.msg || "Logged out successfully");
        location.href = "index.html";
        return;
    }

    location.href = "index.html";
}

// Backend API connected
async function loadTagList() {
    const r = await request("/user?action=listTags");
    if (r.ok && r.data && r.data.code === 200) {
        const tags = Array.isArray(r.data.data) ? r.data.data : [];
        if (tags.length > 0) {
            state.availableTags = tags;
        }
    }
}

function createResumePicker() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";
    return input;
}

function getResumePreviewUrl() {
    if (!state.currentUser || !state.currentUser.userId) return "";
    return `${BASE_URL}/user?action=downloadProfilePdf&uid=${encodeURIComponent(state.currentUser.userId)}`;
}

function releaseResumeObjectUrl() {
    if (state.resumeObjectUrl) {
        URL.revokeObjectURL(state.resumeObjectUrl);
        state.resumeObjectUrl = "";
    }
}

async function fetchResumePreviewObjectUrl() {
    const previewUrl = getResumePreviewUrl();
    if (!previewUrl) {
        return { ok: false, error: "No resume preview is available." };
    }

    try {
        const res = await fetch(previewUrl, {
            method: "GET",
            credentials: "include"
        });

        const contentType = (res.headers.get("content-type") || "").toLowerCase();
        if (!res.ok) {
            return { ok: false, error: "Failed to load resume preview." };
        }

        if (contentType.includes("application/json")) {
            const json = await res.json();
            return { ok: false, error: json.msg || "No resume is available to preview yet." };
        }

        const blob = await res.blob();
        const blobType = (blob.type || contentType || "").toLowerCase();
        if (!blobType.includes("pdf")) {
            return { ok: false, error: "The resume preview endpoint did not return a PDF file." };
        }

        releaseResumeObjectUrl();
        state.resumeObjectUrl = URL.createObjectURL(blob);
        return { ok: true, url: state.resumeObjectUrl };
    } catch (error) {
        return { ok: false, error: error.message || "Failed to load resume preview." };
    }
}

async function uploadResumeFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    const r = await request("/user?action=uploadProfilePdf", {
        method: "POST",
        body: formData
    });

    if (r.ok && r.data && r.data.code === 200) {
        return { ok: true, data: r.data };
    }

    return { ok: false, error: (r.data && r.data.msg) || r.error || "Upload failed" };
}

async function checkResumeStatus() {
    if (!portalConfig.allowResumeUpload) {
        state.hasResume = false;
        state.resumeName = "";
        state.resumePreviewUrl = "";
        return;
    }

    if (!state.currentUser || !state.currentUser.userId) return;

    const uid = state.currentUser.userId;
    const previewUrl = getResumePreviewUrl();
    try {
        const res = await fetch(previewUrl, {
            method: "GET",
            credentials: "include"
        });

        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const json = await res.json();
            if (json.code === 200) {
                state.hasResume = true;
                state.resumeName = `${uid}.pdf`;
                state.resumePreviewUrl = previewUrl;
                renderSidebar();
                if (state.currentView === "profile") {
                    renderProfileView();
                }
            }
        } else if (res.ok) {
            state.hasResume = true;
            state.resumeName = `${uid}.pdf`;
            state.resumePreviewUrl = previewUrl;
            renderSidebar();
            if (state.currentView === "profile") {
                renderProfileView();
            }
        } else {
            state.hasResume = false;
            state.resumeName = "";
            state.resumePreviewUrl = "";
        }
    } catch (e) {
        state.hasResume = false;
        state.resumeName = "";
        state.resumePreviewUrl = "";
    }
}

async function handleUploadResume() {
    if (!portalConfig.allowResumeUpload) {
        handleRestrictedAction();
        return;
    }

    if (state.isUploadingResume) return;

    const picker = createResumePicker();
    picker.addEventListener("change", async () => {
        const file = picker.files && picker.files[0];
        if (!file) return;

        const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
        if (!isPdf) {
            showError("Please upload a PDF file.");
            return;
        }

        state.isUploadingResume = true;
        renderSidebar();

        const result = await uploadResumeFile(file);
        state.isUploadingResume = false;

        if (result.ok) {
            state.hasResume = true;
            state.resumeName = file.name;
            state.resumePreviewUrl = getResumePreviewUrl();
            renderSidebar();
            if (state.currentView === "profile") {
                renderProfileView();
            }
            return;
        }

        renderSidebar();
        showError(result.error);
    });

    picker.click();
}

function openMessageCenter() {
    if (!portalConfig.allowMessage) {
        handleRestrictedAction();
        return;
    }

    location.href = "message.html";
}

async function openMessageCenterForJob(jobId) {
    if (!portalConfig.allowMessage) {
        handleRestrictedAction();
        return;
    }

    let job = state.jobs.find(item => String(item.id) === String(jobId));

    if (!job) {
        showError("Unable to find this role.");
        return;
    }

    let contact = getJobContactInfo(job);
    if (!contact.userId) {
        const r = await request(`/job?action=getDetail&jobId=${encodeURIComponent(jobId)}`);
        if (r.ok && r.data && r.data.code === 200) {
            job = mapJobFromBackend(r.data.data || {});
            contact = getJobContactInfo(job);
        }
    }

    if (!contact.userId) {
        showError("This role does not expose a teacher ID yet.");
        return;
    }

    const params = new URLSearchParams();
    params.append("targetUserId", contact.userId);
    params.append("targetUserName", contact.name || job.prof || "Course Lead");
    if (job.id) {
        params.append("jobId", String(job.id));
    }
    if (job.course) {
        params.append("jobTitle", String(job.course));
    }

    window.open(`message.html?${params.toString()}`, "_blank");
}

function renderFeedView() {
    const filteredJobs = getFilteredJobs();
    const recommendedCount = portalConfig.showRecommendations
        ? filteredJobs.filter(job => getJobRecommendationScore(job) > 0).length
        : 0;
    const hasRecommendations = Object.keys(state.recommendedJobs || {}).length > 0;
    const pageDescription = recommendedCount > 0
        ? portalConfig.uiText.pageRecommendedDescription
            .replace("{count}", String(recommendedCount))
            .replace("{suffix}", recommendedCount === 1 ? "" : "s")
        : portalConfig.uiText.pageDescription;

    els.feedView.innerHTML = `
    <div class="page-title-row">
      <div class="page-title">
        <h1>${escapeHtml(portalConfig.uiText.pageTitle)}</h1>
        <p>
          ${escapeHtml(pageDescription)}
        </p>
      </div>
      <div class="inline-actions">
        <button class="btn btn-ghost" id="goProfileBtn" type="button">${escapeHtml(portalConfig.uiText.profileButtonLabel)}</button>
      </div>
    </div>

    <div class="search-box glass-card section-card">
      ${Icons.search}
      <input
        id="jobSearchInput"
        type="text"
        placeholder="${escapeHtml(portalConfig.uiText.searchPlaceholder)}"
        value="${escapeHtml(state.searchQuery)}"
      />
    </div>

    <div class="filter-row">
      ${state.availableTags.map(tag => `
        <button
          class="filter-chip ${state.activeTags.includes(tag) ? "active" : ""}"
          type="button"
          data-tag="${escapeHtml(tag)}"
        >
          ${escapeHtml(tag)}
        </button>
      `).join("")}
      <button class="filter-chip" id="filterStubBtn" type="button" title="UI only in this version">
        ${Icons.sliders}
      </button>
    </div>

    <div class="job-list" id="jobList">
      ${
        portalConfig.showRecommendations && state.recommendationLoaded && !hasRecommendations && state.jobs.length > 0
            ? `
              <div class="status-box empty-hint">
                <strong>No personalized recommendations yet.</strong>
                <p>Open more role details or update your profile tags to help the system surface stronger matches.</p>
              </div>
            `
            : ""
    }
      ${
        filteredJobs.length > 0
            ? filteredJobs.map(job => renderJobCard(job)).join("")
            : state.jobs.length === 0
                ? renderEmptyState({
                    title: "No open roles are available right now.",
                    description: "Check back later for newly published TA opportunities.",
                    tips: ["Refresh after new postings are released", "Keep your profile ready for future openings"]
                })
                : renderEmptyState({
                    title: "No roles match your current filters.",
                    description: "Try adjusting your search text or selected tags to see more results.",
                    tips: ["Clear one or two tags", "Search by a broader course keyword"]
                })
    }
    </div>
  `;

    bindFeedEvents();
    renderJobList();
}

function renderJobList() {
    const jobListEl = document.getElementById("jobList");
    if (!jobListEl) return;

    const filteredJobs = getFilteredJobs();

    jobListEl.innerHTML = `
      ${
        portalConfig.showRecommendations && state.recommendationLoaded && Object.keys(state.recommendedJobs || {}).length === 0 && state.jobs.length > 0
            ? `
              <div class="status-box empty-hint">
                <strong>No personalized recommendations yet.</strong>
                <p>Open more role details or update your profile tags to help the system surface stronger matches.</p>
              </div>
            `
            : ""
    }
      ${
        filteredJobs.length > 0
            ? filteredJobs.map(job => renderJobCard(job)).join("")
            : state.jobs.length === 0
                ? renderEmptyState({
                    title: "No open roles are available right now.",
                    description: "Check back later for newly published TA opportunities.",
                    tips: ["Refresh after new postings are released", "Keep your profile ready for future openings"]
                })
                : renderEmptyState({
                    title: "No roles match your current filters.",
                    description: "Try adjusting your search text or selected tags to see more results.",
                    tips: ["Clear one or two tags", "Search by a broader course keyword"]
                })
    }
    `;

    bindJobListEvents();
}

function renderJobCard(job) {
    const applied = isJobApplied(job.id);
    const applyLabel = applied ? portalConfig.uiText.appliedButtonLabel : portalConfig.uiText.applyButtonLabel;
    const applyIcon = applied ? "" : Icons.chevronRight;
    const applyDisabled = applied ? "disabled" : "";
    const display = getJobDisplayData(job);
    const recommendationBadge = display.recommendationMeta
        ? `<span class="badge ${display.recommendationMeta.className}">${escapeHtml(display.recommendationMeta.label)}</span>`
        : "";
    const jobStatusBadge = `<span class="badge ${display.matchMeta.className}">${escapeHtml(display.matchMeta.label)}</span>`;
    const contactButton = portalConfig.showContactButton
        ? `
          <button class="btn btn-soft contact-job-btn" type="button" data-job-id="${job.id}">
            ${escapeHtml(portalConfig.uiText.contactButtonLabel)}
          </button>
        `
        : "";
    return `
    <article class="job-card" data-job-id="${job.id}">
      <div class="job-top">
        <div class="job-title-wrap">
          <h3>${escapeHtml(display.title)}</h3>
          <div class="job-sub">
            <span class="badge badge-soft">${Icons.user} ${escapeHtml(display.contact.name)}</span>
            <span class="badge badge-soft">${Icons.clock} ${escapeHtml(display.hours)} hrs/wk</span>
            ${recommendationBadge}
          </div>
        </div>
        ${jobStatusBadge}
      </div>

      <p class="job-desc">${escapeHtml(display.description)}</p>

      <div class="tag-list">
        ${renderJobTags(display.tags)}
      </div>

      <div class="job-footer">
        <div class="job-stats">
          <span>RoleID: ${job.id}</span>
          <span>${display.tags.length} required tags</span>
        </div>
        <div class="job-actions">
          <button class="btn btn-ghost open-job-btn" type="button" data-job-id="${job.id}">
            ${escapeHtml(portalConfig.uiText.openDetailsButtonLabel)}
          </button>
          ${contactButton}
          <button class="btn btn-primary apply-job-btn" type="button" data-job-id="${job.id}" ${applyDisabled}>
            ${applyLabel}${applyIcon ? " " + applyIcon : ""}
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderSidebar() {
    els.sidebar.innerHTML = `
    <div class="sidebar-sticky">
      <section class="glass-card section-card">
        <div class="profile-mini">
          <div class="profile-avatar">${escapeHtml(getInitials(state.profile.name))}</div>
          <div class="profile-meta">
            <h4>${escapeHtml(state.profile.name)}</h4>
            <p>${escapeHtml(state.profile.major)}</p>
          </div>
        </div>

        <div class="profile-lines">
          <div class="info-line">
            <span>Email</span>
            <span>${escapeHtml(state.profile.email)}</span>
          </div>
          <div class="info-line">
            <span>Visibility</span>
            <span>${state.profile.isVisible ? "Visible" : "Hidden"}</span>
          </div>
          <div class="info-line">
            <span>Tags</span>
            <span>${escapeHtml((state.profile.tags && state.profile.tags.length > 0
                ? state.profile.tags
                : state.profile.skills).join(", "))}</span>
          </div>
        </div>

        <div class="inline-actions" style="margin-top:18px;">
          <button class="btn btn-soft" id="openProfileEditBtn" type="button">
            Edit Profile
          </button>
          <button class="btn btn-ghost" id="sidebarViewProfileBtn" type="button">
            Full Profile
          </button>
        </div>
      </section>

      <section class="glass-card section-card">
        <h3 class="side-title">${Icons.sparkles} Resume</h3>
        ${
        state.isUploadingResume
            ? `
              <div class="resume-box fade-in">
                <div style="display:flex;align-items:center;gap:12px;">
                  <div class="profile-avatar" style="width:52px;height:52px;border-radius:16px;">...</div>
                  <div>
                    <strong style="display:block;margin-bottom:4px;">Uploading...</strong>
                    <p style="margin:0;">Please wait</p>
                  </div>
                </div>
              </div>
            `
            : state.hasResume
            ? `
              <div class="resume-box fade-in">
                <div style="display:flex;align-items:center;gap:12px;">
                  <div class="profile-avatar" style="width:44px;height:44px;border-radius:14px;">
                    ${Icons.file}
                  </div>
                  <div>
                    <strong style="display:block;margin-bottom:4px;">Resume Uploaded</strong>
                    <p style="margin:0;">${escapeHtml(state.resumeName || "uploaded_resume.pdf")}</p>
                  </div>
                  <div style="margin-left:auto;color:var(--success);width:22px;height:22px;">
                    ${Icons.checkCircle}
                  </div>
                </div>
                <div class="resume-actions">
                  <button class="btn btn-soft" id="resumePreviewBtn" type="button">Preview</button>
                  <button class="btn btn-ghost" id="resumeReplaceBtn" type="button">Replace</button>
                </div>
              </div>
            `
            : `
              <button class="resume-box" id="resumeUploadBtn" type="button" style="width:100%;">
                <div style="display:flex;flex-direction:column;align-items:center;gap:12px;">
                  <div class="profile-avatar" style="width:52px;height:52px;border-radius:16px;">
                    ${Icons.upload}
                  </div>
                  <div style="text-align:center;">
                    <strong style="display:block;margin-bottom:6px;">Upload Resume</strong>
                    <p style="margin:0;">Add your PDF resume to unlock faster applications and better job matching.</p>
                  </div>
                </div>
              </button>
              ${renderEmptyState({
                    title: "No resume uploaded yet.",
                    description: "You can still browse roles, but uploading a resume makes it easier to apply when a good match appears.",
                    tips: ["Upload a PDF file", "Keep one updated version ready"],
                    compact: true
                })}
            `
    }
      </section>

      <section class="glass-card section-card">
        <h3 class="side-title">${Icons.clock} My Applications</h3>
        <div class="application-list">
          ${
        state.applications.length === 0
            ? renderEmptyState({
                title: "No application records yet.",
                description: "Roles you apply for will appear here with their latest review status.",
                tips: ["Browse open roles", "Submit your first application"],
                compact: true
            })
            : state.applications.map(app => `
                  <div class="application-item fade-in">
                    <div class="application-head">
                      <div>
                        <h5>${escapeHtml(app.job.course)}</h5>
                        <p class="application-sub">${escapeHtml(app.job.module)} - ${escapeHtml(app.job.typeLabel)}</p>
                      </div>
                    </div>
                    <p class="application-desc">${escapeHtml(app.job.description)}</p>
                    <div class="application-meta">
                      <span>RoleID: ${escapeHtml(app.jobId)}</span>
                      <span>${app.job.hours !== null ? `${escapeHtml(app.job.hours)} hrs/week` : "Hours TBD"}</span>
                    </div>
                    <div class="application-footer">
                      ${(() => {
                        const meta = getApplicationStatusMeta(app.statusCode);
                        return `
                          <span class="badge ${meta.className}">${escapeHtml(meta.label)}</span>
                          <button class="btn btn-danger btn-xs cancel-application-btn" type="button" data-app-id="${escapeHtml(app.id)}" ${meta.canCancel ? "" : "disabled"}>
                            Cancel Application
                          </button>
                        `;
                    })()}
                    </div>
                  </div>
                `).join("")
    }
        </div>
      </section>
    </div>
  `;

    bindSidebarEvents();
}

function renderProfileView() {
    const applicationCount = state.applications.length;
    const tagCount = (state.profile.tags && state.profile.tags.length > 0
        ? state.profile.tags
        : state.profile.skills).length;
    const visibilityText = state.profile.isVisible ? "Visible to recruiters" : "Hidden";

    els.profileView.innerHTML = `
    <div class="profile-page-grid">
      <section class="glass-card section-card">
        <div class="profile-hero">
          <div class="profile-left">
            <div class="profile-avatar-lg">${escapeHtml(getInitials(state.profile.name))}</div>
            <div>
              <h2>${escapeHtml(state.profile.name)}</h2>
              <p>${escapeHtml(state.profile.major)}</p>
              <div style="margin-top:12px;">
                <span class="status-pill ${state.profile.isVisible ? "" : "off"}">
                  ${escapeHtml(visibilityText)}
                </span>
              </div>
            </div>
          </div>

          <div class="inline-actions">
            <button class="btn btn-soft" id="profileBackToFeedBtn" type="button">
              Back to Feed
            </button>
            <button class="btn btn-primary" id="profileEditMainBtn" type="button">
              ${Icons.edit} Edit Profile
            </button>
          </div>
        </div>
      </section>

      <section class="glass-card section-card">
        <div class="kpi-grid">
          <div class="kpi-card">
            <strong>${applicationCount}</strong>
            <span>Applications Submitted</span>
          </div>
          <div class="kpi-card">
              <strong>${tagCount}</strong>
              <span>Tags Listed</span>
          </div>
          <div class="kpi-card">
            <strong>${state.hasResume ? "Yes" : "No"}</strong>
            <span>Resume Uploaded</span>
          </div>
        </div>
      </section>

      <section class="two-col-grid">
        <div class="glass-card section-card">
          <div class="bio-box">
            <h3>About</h3>
            <p>${escapeHtml(state.profile.bio || "No bio added yet.")}</p>
          </div>
        </div>

        <div class="glass-card section-card">
          <div class="skill-box">
            <h3>Tags</h3>
            <div class="tag-list">
              ${
        (state.profile.tags && state.profile.tags.length > 0
            ? state.profile.tags
            : state.profile.skills).length > 0
            ? (state.profile.tags && state.profile.tags.length > 0
                ? state.profile.tags
                : state.profile.skills).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")
            : `<span class="tag">No tags yet</span>`
    }
            </div>
          </div>
        </div>
      </section>

      <section class="glass-card section-card">
        <div class="page-title-row" style="margin-bottom:16px;">
          <div class="page-title">
            <h2 style="font-size:20px;">Resume</h2>
            <p>Preview your uploaded PDF or replace it with a newer version.</p>
          </div>
        </div>

        ${
        state.hasResume
            ? `
              <div class="resume-box">
                <div style="display:flex;align-items:center;gap:12px;">
                  <div class="profile-avatar" style="width:44px;height:44px;border-radius:14px;">
                    ${Icons.file}
                  </div>
                  <div>
                    <strong style="display:block;margin-bottom:4px;">${escapeHtml(state.resumeName || "uploaded_resume.pdf")}</strong>
                    <p style="margin:0;">PDF file ready for preview and replacement.</p>
                  </div>
                </div>
                <div class="resume-actions">
                  <button class="btn btn-soft" id="profileResumePreviewBtn" type="button">Preview Resume</button>
                  <button class="btn btn-ghost" id="profileResumeReplaceBtn" type="button">Replace File</button>
                </div>
              </div>
            `
            : `
              <button class="resume-box" id="profileResumeUploadBtn" type="button" style="width:100%;">
                <div style="display:flex;flex-direction:column;align-items:center;gap:12px;">
                  <div class="profile-avatar" style="width:52px;height:52px;border-radius:16px;">
                    ${Icons.upload}
                  </div>
                  <div style="text-align:center;">
                    <strong style="display:block;margin-bottom:6px;">Upload Resume</strong>
                    <p style="margin:0;">Add a PDF first, then you can preview or replace it here.</p>
                  </div>
                </div>
              </button>
              ${renderEmptyState({
                    title: "Your resume section is still empty.",
                    description: "Upload one PDF resume so you are ready when you decide to apply for a role.",
                    tips: ["Use a recent version", "Highlight teaching or grading experience"],
                    compact: true
                })}
            `
    }
      </section>

      <section class="glass-card section-card">
        <div class="page-title-row" style="margin-bottom:16px;">
          <div class="page-title">
            <h2 style="font-size:20px;">Profile Details</h2>
            <p>Basic account and visibility information.</p>
          </div>
        </div>

        <div class="profile-lines">
          <div class="info-line">
            <span>Name</span>
            <span>${escapeHtml(state.profile.name)}</span>
          </div>
          <div class="info-line">
            <span>Email</span>
            <span>${escapeHtml(state.profile.email)}</span>
          </div>
          <div class="info-line">
            <span>Major</span>
            <span>${escapeHtml(state.profile.major)}</span>
          </div>
          <div class="info-line">
            <span>Visibility</span>
            <span>${state.profile.isVisible ? "Enabled" : "Disabled"}</span>
          </div>
        </div>
      </section>
    </div>
  `;

    bindProfileViewEvents();
}

function bindFeedEvents() {
    const goProfileBtn = document.getElementById("goProfileBtn");
    const searchInput = document.getElementById("jobSearchInput");
    const tagButtons = els.feedView.querySelectorAll("[data-tag]");
    const openButtons = els.feedView.querySelectorAll(".open-job-btn");
    const contactButtons = els.feedView.querySelectorAll(".contact-job-btn");
    const applyButtons = els.feedView.querySelectorAll(".apply-job-btn");
    const filterStubBtn = document.getElementById("filterStubBtn");

    if (goProfileBtn) {
        goProfileBtn.addEventListener("click", () => setView("profile"));
    }

    if (searchInput) {
        searchInput.addEventListener("input", event => {
            state.searchQuery = event.target.value;
            renderJobList();
        });
    }

    tagButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            toggleTag(btn.dataset.tag || "");
        });
    });

    openButtons.forEach(btn => {
        btn.addEventListener("click", async event => {
            event.stopPropagation();
            const id = btn.dataset.jobId;
            await openJobModal(id);
        });
    });

    contactButtons.forEach(btn => {
        btn.addEventListener("click", async event => {
            event.stopPropagation();
            const id = btn.dataset.jobId;
            await openMessageCenterForJob(id);
        });
    });

    applyButtons.forEach(btn => {
        btn.addEventListener("click", async event => {
            event.stopPropagation();
            const id = btn.dataset.jobId;
            await handleApply(id);
        });
    });

    const cards = els.feedView.querySelectorAll(".job-card");
    cards.forEach(card => {
        card.addEventListener("click", async () => {
            await openJobModal(card.dataset.jobId);
        });
    });

    if (filterStubBtn) {
        filterStubBtn.addEventListener("click", () => {
            alert("This version keeps the filter button UI only; advanced filters will be added later.");
        });
    }
}

function bindSidebarEvents() {
    const openProfileEditBtn = document.getElementById("openProfileEditBtn");
    const sidebarViewProfileBtn = document.getElementById("sidebarViewProfileBtn");
    const resumeUploadBtn = document.getElementById("resumeUploadBtn");
    const resumePreviewBtn = document.getElementById("resumePreviewBtn");
    const resumeReplaceBtn = document.getElementById("resumeReplaceBtn");
    const cancelButtons = els.sidebar.querySelectorAll(".cancel-application-btn");

    if (openProfileEditBtn) {
        openProfileEditBtn.addEventListener("click", openProfileModal);
    }

    if (sidebarViewProfileBtn) {
        sidebarViewProfileBtn.addEventListener("click", () => setView("profile"));
    }

    if (resumeUploadBtn) {
        resumeUploadBtn.addEventListener("click", handleUploadResume);
    }

    if (resumePreviewBtn) {
        resumePreviewBtn.addEventListener("click", openResumePreviewModal);
    }

    if (resumeReplaceBtn) {
        resumeReplaceBtn.addEventListener("click", handleUploadResume);
    }

    cancelButtons.forEach(btn => {
        btn.addEventListener("click", async event => {
            event.stopPropagation();
            const applicationId = btn.dataset.appId;
            if (!applicationId) return;
            if (!confirm("Cancel this application?")) return;

            const r = await request(`/application?action=cancel&applicationId=${encodeURIComponent(applicationId)}`, {
                method: "POST"
            });

            if (r.ok && r.data && r.data.code === 200) {
                alert(r.data.msg || "Application canceled.");
                await loadMyApplications();
                render();
                return;
            }

            showError((r.data && r.data.msg) || r.error || "Failed to cancel application.");
        });
    });
}

function bindProfileViewEvents() {
    const backBtn = document.getElementById("profileBackToFeedBtn");
    const editBtn = document.getElementById("profileEditMainBtn");
    const profileResumeUploadBtn = document.getElementById("profileResumeUploadBtn");
    const profileResumePreviewBtn = document.getElementById("profileResumePreviewBtn");
    const profileResumeReplaceBtn = document.getElementById("profileResumeReplaceBtn");

    if (backBtn) {
        backBtn.addEventListener("click", () => setView("feed"));
    }

    if (editBtn) {
        editBtn.addEventListener("click", openProfileModal);
    }

    if (profileResumeUploadBtn) {
        profileResumeUploadBtn.addEventListener("click", handleUploadResume);
    }

    if (profileResumePreviewBtn) {
        profileResumePreviewBtn.addEventListener("click", openResumePreviewModal);
    }

    if (profileResumeReplaceBtn) {
        profileResumeReplaceBtn.addEventListener("click", handleUploadResume);
    }
}

function syncProfileModalState() {
    els.profileNameInput.value = state.profile.name || "";
    els.profileEmailInput.value = state.profile.email || "";
    els.profileMajorInput.value = state.profile.major || "";
    els.profileBioInput.value = state.profile.bio || "";

    els.profileVisibleToggle.classList.toggle("active", !!state.profile.isVisible);
    els.profileVisibleIcon.classList.toggle("active", !!state.profile.isVisible);
    renderProfileTagOptions();
}

function renderProfileTagOptions() {
    const container = document.getElementById("profileTagList");
    if (!container) return;

    const tags = state.availableTags || [];
    if (tags.length === 0) {
        container.innerHTML = `<span class="tag">No tags available</span>`;
        return;
    }

    container.innerHTML = tags.map(tag => `
        <button
          class="filter-chip ${state.profile.tags.includes(tag) ? "active" : ""}"
          type="button"
          data-tag="${escapeHtml(tag)}"
        >
          ${escapeHtml(tag)}
        </button>
      `).join("");

    const tagButtons = container.querySelectorAll("[data-tag]");
    tagButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            if (!portalConfig.allowProfileEdit) {
                handleRestrictedAction();
                return;
            }

            const tag = btn.dataset.tag || "";
            if (!tag) return;
            if (state.profile.tags.includes(tag)) {
                state.profile.tags = state.profile.tags.filter(item => item !== tag);
                btn.classList.remove("active");
            } else {
                state.profile.tags = [...state.profile.tags, tag];
                btn.classList.add("active");
            }
        });
    });
}

function bindJobListEvents() {
    const openButtons = els.feedView.querySelectorAll(".open-job-btn");
    const contactButtons = els.feedView.querySelectorAll(".contact-job-btn");
    const applyButtons = els.feedView.querySelectorAll(".apply-job-btn");

    openButtons.forEach(btn => {
        btn.addEventListener("click", async event => {
            event.stopPropagation();
            const id = btn.dataset.jobId;
            await openJobModal(id);
        });
    });

    contactButtons.forEach(btn => {
        btn.addEventListener("click", async event => {
            event.stopPropagation();
            const id = btn.dataset.jobId;
            await openMessageCenterForJob(id);
        });
    });

    applyButtons.forEach(btn => {
        btn.addEventListener("click", async event => {
            event.stopPropagation();
            const id = btn.dataset.jobId;
            await handleApply(id);
        });
    });

    const cards = els.feedView.querySelectorAll(".job-card");
    cards.forEach(card => {
        card.addEventListener("click", async () => {
            await openJobModal(card.dataset.jobId);
        });
    });
}

function updateBodyScrollLock() {
    const hasOpenModal = Object.values(modalRegistry).some(modal => isModalVisible(modal && modal.overlay));
    document.body.classList.toggle("modal-open", hasOpenModal);
}

function isModalVisible(overlay) {
    return !!(overlay && !overlay.classList.contains("hidden"));
}

function registerModal(name, overlay, options = {}) {
    if (!name || !overlay) return;

    modalRegistry[name] = {
        overlay,
        onOpen: options.onOpen,
        onClose: options.onClose
    };

    overlay.addEventListener("click", event => {
        if (event.target === overlay) {
            closeModal(name);
        }
    });
}

function openModal(name) {
    const modal = modalRegistry[name];
    if (!modal || !modal.overlay) return false;

    if (typeof modal.onOpen === "function") {
        modal.onOpen();
    }

    modal.overlay.classList.remove("hidden");
    modalStack = modalStack.filter(item => item !== name);
    modalStack.push(name);
    updateBodyScrollLock();
    return true;
}

function closeModal(name) {
    const modal = modalRegistry[name];
    if (!modal || !modal.overlay) return false;

    if (!isModalVisible(modal.overlay)) {
        modalStack = modalStack.filter(item => item !== name);
        updateBodyScrollLock();
        return false;
    }

    if (typeof modal.onClose === "function") {
        modal.onClose();
    }

    modal.overlay.classList.add("hidden");
    modalStack = modalStack.filter(item => item !== name);
    updateBodyScrollLock();
    return true;
}

function closeTopmostModal() {
    while (modalStack.length > 0) {
        const name = modalStack[modalStack.length - 1];
        if (closeModal(name)) {
            return true;
        }

        modalStack.pop();
    }

    return false;
}

function openProfileModal() {
    if (!portalConfig.allowProfileEdit) {
        handleRestrictedAction();
        return;
    }

    openModal("profile");
}

function closeProfileModal() {
    closeModal("profile");
}

async function openResumePreviewModal() {
    if (!portalConfig.allowResumePreview) {
        handleRestrictedAction();
        return;
    }

    if (!state.hasResume || !state.resumePreviewUrl) {
        showError("No resume is available to preview yet.");
        return;
    }

    const previewResult = await fetchResumePreviewObjectUrl();
    if (!previewResult.ok) {
        showError(previewResult.error);
        return;
    }

    if (els.resumePreviewFileName) {
        els.resumePreviewFileName.textContent = state.resumeName || "profile.pdf";
    }
    if (els.resumePreviewFrame) {
        els.resumePreviewFrame.src = previewResult.url;
    }

    openModal("resumePreview");
}

function closeResumePreviewModal() {
    closeModal("resumePreview");
}

// Backend not connected: profile saving is not available in the sample API, so this stays local.
async function saveProfile() {
    if (!portalConfig.allowProfileEdit) {
        handleRestrictedAction();
        return;
    }

    const nextName = els.profileNameInput.value.trim() || state.profile.name;
    const nextEmail = els.profileEmailInput.value.trim() || state.profile.email;
    const nextMajor = els.profileMajorInput.value.trim() || state.profile.major;
    const nextBio = els.profileBioInput.value.trim();
    const nextTags = state.profile.tags || [];

    const payload = new URLSearchParams({
        realName: nextName,
        email: nextEmail,
        major: nextMajor,
        selfIntro: nextBio,
        profileVisible: state.profile.isVisible ? "1" : "0",
        tags: nextTags.join(",")
    });

    const r = await request("/user?action=updateProfile", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: payload.toString()
    });

    if (r.ok && r.data && r.data.code === 200) {
        mapUserToProfile(r.data.data);
        await loadRecommendedJobs();
        closeProfileModal();
        render();
        return;
    }

    showError((r.data && r.data.msg) || r.error || "Save failed");
}

// Backend API connected
async function handleApply(jobId) {
    if (!portalConfig.allowApply) {
        handleRestrictedAction();
        return;
    }

    const r = await request(`/application?action=apply&jobId=${encodeURIComponent(jobId)}`, {
        method: "POST"
    });

    if (r.ok && r.data && r.data.code === 200) {
        alert(r.data.msg || "Application submitted.");
        await loadOpenJobs();
        await loadMyApplications();
        render();
        return;
    }

    showError((r.data && r.data.msg) || r.error || "Application failed");
}

// Backend API connected
async function openJobModal(jobId) {
    const r = await request(`/job?action=getDetail&jobId=${encodeURIComponent(jobId)}`);

    if (r.ok && r.data && r.data.code === 200) {
        const detail = r.data.data || {};
        const existingJob = state.jobs.find(job => String(job.id) === String(jobId));
        const mappedDetailJob = mapJobFromBackend(detail);

        state.selectedJob = {
            ...existingJob,
            ...mappedDetailJob,
            tags: normalizeTagList(detail.tags).length > 0
                ? normalizeTagList(detail.tags)
                : normalizeTagList(existingJob && existingJob.tags),
            description: detail.jobDesc || (existingJob && existingJob.description) || "No description available",
            raw: {
                ...((existingJob && existingJob.raw) || {}),
                ...detail
            }
        };

        state.appRemarks = "";
        state.appOptions = {
            takenCourse: false,
            inPerson: true
        };

        renderJobModal();
        openModal("job");
        return;
    }

    showError((r.data && r.data.msg) || r.error || "Failed to load role details.");
}

function closeJobModal() {
    closeModal("job");
}

function renderJobModal() {
    const job = state.selectedJob;
    if (!job) return;

    const alreadyApplied = isJobApplied(job.id);
    const display = getJobDisplayData(job);

    els.jobModalTitle.textContent = display.title;
    els.jobModalMeta.innerHTML = `
    <span class="badge badge-soft">${Icons.user} ${escapeHtml(display.contact.name)}</span>
    <span class="badge badge-soft">${Icons.clock} ${escapeHtml(display.hours)} hrs/week</span>
    <span class="badge ${display.jobTypeMeta.className}">${escapeHtml(display.jobTypeMeta.label)}</span>
    <span class="badge ${display.matchMeta.className}">${escapeHtml(display.matchMeta.label)}</span>
    <span class="badge badge-soft">${escapeHtml(display.module)}</span>
  `;

    els.jobDescriptionText.textContent = display.description;

    if (els.matchCard) {
        if (portalConfig.showJobDetailMatch) {
            els.matchCard.innerHTML = `
    <strong>${escapeHtml(display.matchMeta.label)}</strong>
    <p>${renderJobMatchSummary(display.match)}</p>
  `;
            els.matchCard.classList.remove("hidden");
        } else {
            els.matchCard.innerHTML = "";
            els.matchCard.classList.add("hidden");
        }
    }

    els.jobRequiredTags.innerHTML = renderJobTags(display.tags);

    els.appRemarksInput.value = state.appRemarks;

    syncApplicationOptionButtons();

    const submitBtn = document.getElementById("submitApplicationBtn");
    if (submitBtn) {
        submitBtn.disabled = alreadyApplied;
        submitBtn.textContent = alreadyApplied ? portalConfig.uiText.appliedButtonLabel : portalConfig.uiText.submitApplicationLabel;
    }
}

function syncApplicationOptionButtons() {
    const taken = !!state.appOptions.takenCourse;
    const inPerson = !!state.appOptions.inPerson;

    els.takenCourseToggle.classList.toggle("active", taken);
    els.takenCourseIcon.classList.toggle("active", taken);

    els.inPersonToggle.classList.toggle("active", inPerson);
    els.inPersonIcon.classList.toggle("active", inPerson);
}

// Backend API connected
async function submitApplicationFromModal() {
    if (!portalConfig.allowApply) {
        handleRestrictedAction();
        return;
    }

    if (!state.selectedJob) return;

    state.appRemarks = els.appRemarksInput.value.trim();

    const jobId = state.selectedJob.id;
    const r = await request(`/application?action=apply&jobId=${encodeURIComponent(jobId)}`, {
        method: "POST"
    });

    if (r.ok && r.data && r.data.code === 200) {
        alert(r.data.msg || "Application submitted.");
        closeJobModal();
        await loadOpenJobs();
        await loadMyApplications();
        render();
        return;
    }

    showError((r.data && r.data.msg) || r.error || "Application failed");
}

function bindModalEvents() {
    const saveProfileBtn = document.getElementById("saveProfileBtn");
    const submitApplicationBtn = document.getElementById("submitApplicationBtn");
    const replaceResumeBtnFromModal = document.getElementById("replaceResumeBtnFromModal");

    registerModal("profile", els.profileModalOverlay, {
        onOpen: () => {
            state.isProfileModalOpen = true;
            syncProfileModalState();
        },
        onClose: () => {
            state.isProfileModalOpen = false;
        }
    });

    registerModal("job", els.jobModalOverlay, {
        onClose: () => {
            state.selectedJob = null;
        }
    });

    registerModal("resumePreview", els.resumePreviewModalOverlay, {
        onClose: () => {
            if (els.resumePreviewFrame) {
                els.resumePreviewFrame.src = "about:blank";
            }
            releaseResumeObjectUrl();
        }
    });

    registerModal("guestPrompt", els.guestModalOverlay || document.getElementById("guestModalOverlay"));

    document.querySelectorAll("[data-modal-close]").forEach(button => {
        button.addEventListener("click", () => {
            closeModal(button.dataset.modalClose);
        });
    });

    if (saveProfileBtn) {
        saveProfileBtn.addEventListener("click", saveProfile);
    }

    if (els.profileVisibleToggle) {
        els.profileVisibleToggle.addEventListener("click", () => {
            if (!portalConfig.allowProfileEdit) {
                handleRestrictedAction();
                return;
            }

            state.profile.isVisible = !state.profile.isVisible;
            syncProfileModalState();
        });
    }

    if (submitApplicationBtn) {
        submitApplicationBtn.addEventListener("click", async () => {
            await submitApplicationFromModal();
        });
    }

    if (replaceResumeBtnFromModal) {
        replaceResumeBtnFromModal.addEventListener("click", async () => {
            closeResumePreviewModal();
            await handleUploadResume();
        });
    }

    if (els.takenCourseToggle) {
        els.takenCourseToggle.addEventListener("click", () => {
            state.appOptions.takenCourse = !state.appOptions.takenCourse;
            syncApplicationOptionButtons();
        });
    }

    if (els.inPersonToggle) {
        els.inPersonToggle.addEventListener("click", () => {
            state.appOptions.inPerson = !state.appOptions.inPerson;
            syncApplicationOptionButtons();
        });
    }

    if (els.appRemarksInput) {
        els.appRemarksInput.addEventListener("input", event => {
            state.appRemarks = event.target.value;
        });
    }

    if (els.guestGoLoginBtn) {
        els.guestGoLoginBtn.addEventListener("click", goToLoginPage);
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeTopmostModal();
        }
    });
}

function render() {
    if (els.messageBtn) {
        els.messageBtn.setAttribute("aria-label", portalConfig.uiText.navMessageAriaLabel);
    }
    if (els.logoutBtn) {
        els.logoutBtn.textContent = portalConfig.uiText.navLogoutLabel;
    }
    if (els.avatarBtn) {
        els.avatarBtn.setAttribute("aria-label", portalConfig.uiText.navAvatarAriaLabel);
    }

    if (els.navUserName) {
        els.navUserName.textContent = state.profile.name || "";
    }

    renderSidebar();

    if (state.currentView === "feed") {
        els.feedView.classList.add("active");
        els.profileView.classList.remove("active");
        renderFeedView();
    } else {
        els.profileView.classList.add("active");
        els.feedView.classList.remove("active");
        renderProfileView();
    }
}

function cacheElements() {
    els.feedView = document.getElementById("feedView");
    els.profileView = document.getElementById("profileView");
    els.sidebar = document.getElementById("sidebar");
    els.avatarBtn = document.getElementById("avatarBtn");
    els.messageBtn = document.getElementById("messageBtn");
    els.logoutBtn = document.getElementById("logoutBtn");
    els.navUserName = document.getElementById("navUserName");

    els.profileModalOverlay = document.getElementById("profileModalOverlay");
    els.jobModalOverlay = document.getElementById("jobModalOverlay");
    els.resumePreviewModalOverlay = document.getElementById("resumePreviewModalOverlay");
    els.guestModalOverlay = document.getElementById("guestModalOverlay");
    els.guestGoLoginBtn = document.getElementById("guestGoLoginBtn");

    els.profileNameInput = document.getElementById("profileNameInput");
    els.profileEmailInput = document.getElementById("profileEmailInput");
    els.profileMajorInput = document.getElementById("profileMajorInput");
    els.profileBioInput = document.getElementById("profileBioInput");
    els.profileVisibleToggle = document.getElementById("profileVisibleToggle");
    els.profileVisibleIcon = document.getElementById("profileVisibleIcon");

    els.jobModalTitle = document.getElementById("jobModalTitle");
    els.jobModalMeta = document.getElementById("jobModalMeta");
    els.jobDescriptionText = document.getElementById("jobDescriptionText");
    els.matchCard = document.getElementById("matchCard");
    els.jobRequiredTags = document.getElementById("jobRequiredTags");
    els.appRemarksInput = document.getElementById("appRemarksInput");
    els.takenCourseToggle = document.getElementById("takenCourseToggle");
    els.takenCourseIcon = document.getElementById("takenCourseIcon");
    els.inPersonToggle = document.getElementById("inPersonToggle");
    els.inPersonIcon = document.getElementById("inPersonIcon");
    els.resumePreviewFrame = document.getElementById("resumePreviewFrame");
    els.resumePreviewFileName = document.getElementById("resumePreviewFileName");
}

function bindGlobalEvents() {
    if (els.avatarBtn) {
        els.avatarBtn.addEventListener("click", () => setView("profile"));
    }
    if (els.messageBtn) {
        els.messageBtn.addEventListener("click", openMessageCenter);
    }
    if (els.logoutBtn) {
        els.logoutBtn.addEventListener("click", logout);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    cacheElements();
    bindGlobalEvents();
    bindModalEvents();

    const ok = await loadLoginUser(); // Backend API connected
    if (!ok) return;

    await loadTagList(); // Backend API connected
    await loadOpenJobs(); // Backend API connected
    await loadMyApplications(); // Backend API connected
    await loadRecommendedJobs();
    await checkResumeStatus();
    render();
});
