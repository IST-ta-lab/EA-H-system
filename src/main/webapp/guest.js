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

const state = {
    currentView: "feed",
    jobs: [],
    applications: [],
    hasResume: false,
    resumeName: "",
    isUploadingResume: false,
    availableTags: [...POPULAR_TAGS],

    searchQuery: "",
    activeTags: [],

    isProfileModalOpen: false,
    selectedJob: null,

    currentUser: null, // Backend API connected

    profile: {
        name: "guest",
        major: "Not provided",
        bio: "Passionate about teaching and helping others learn programming.",
        email: "",
        isVisible: true,
        visibilityScope: "applied_only",
        skills: ["Python", "Grading", "Java"],
        tags: []
    },

    appRemarks: "",
    appOptions: {
        takenCourse: false,
        inPerson: true
    }
};

const els = {};

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
    const overlay = document.getElementById("guestModalOverlay");
    if (overlay) {
        overlay.classList.remove("hidden");
        document.body.classList.add("modal-open");
    }
}

function closeGuestPrompt() {
    const overlay = document.getElementById("guestModalOverlay");
    if (overlay) {
        overlay.classList.add("hidden");
        document.body.classList.remove("modal-open");
    }
}

function goToLoginPage() {
    location.href = "index.html";
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
    const backendTags = Array.isArray(job.tags) ? job.tags : [];
    return {
        id: job.jobId,
        course: job.jobName || "Untitled Role",
        prof: job.publisherName || job.moName || "Course Lead",
        hours: job.workHoursWeekly || 0,
        tags: backendTags.length > 0
            ? backendTags
            : [
                job.jobType === 1 ? "TA" : "Assistant",
                job.belongModule || "Uncategorized"
            ],
        description: job.jobDesc || "No description available",
        raw: job
    };
}

// Backend API connected
function mapApplicationFromBackend(app) {
    const statusCode = typeof app.applyStatus === "number" ? app.applyStatus : Number(app.status);
    return {
        id: app.applicationId,
        jobId: app.jobId,
        status: formatApplyStatus(statusCode),
        statusCode,
        raw: app,
        job: {
            course: app.jobName ? app.jobName : `RoleID: ${app.jobId}`,
            module: app.belongModule || "Uncategorized",
            typeLabel: formatJobType(app.jobType),
            description: app.jobDesc || "No description available",
            hours: typeof app.workHoursWeekly === "number" ? app.workHoursWeekly : null
        }
    };
}

function formatApplyStatus(statusCode) {
    switch (Number(statusCode)) {
        case 0:
            return "Pending";
        case 1:
            return "Approved";
        case 2:
            return "Rejected";
        default:
            return "Unknown";
    }
}

function getApplicationStatusMeta(statusCode) {
    const code = Number(statusCode);
    if (code === 1) {
        return { label: "Approved", className: "badge-success", canCancel: false };
    }
    if (code === 2) {
        return { label: "Rejected", className: "badge-danger", canCancel: false };
    }
    if (code === 0) {
        return { label: "Pending", className: "badge-warning", canCancel: true };
    }
    return { label: "Unknown", className: "badge-soft", canCancel: false };
}

function formatJobType(jobType) {
    switch (Number(jobType)) {
        case 1:
            return "Course TA";
        case 2:
            return "Exam Proctor TA";
        case 3:
            return "Activity TA";
        default:
            return "Role";
    }
}

function getFilteredJobs() {
    return state.jobs.filter(job => {
        const matchesSearch =
            String(job.course || "").toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            String(job.prof || "").toLowerCase().includes(state.searchQuery.toLowerCase());

        const matchesTags =
            state.activeTags.length === 0 ||
            state.activeTags.every(tag => (job.tags || []).includes(tag));

        return matchesSearch && matchesTags;
    });
}

function getMatchData(job) {
    if (!job) return null;

    const jobTags = job.tags || [];
    const userTags = (state.profile.tags && state.profile.tags.length > 0)
        ? state.profile.tags
        : (state.profile.skills || []);

    if (jobTags.length === 0) {
        return { score: 100, matched: [], missing: [] };
    }

    const matched = jobTags.filter(tag => userTags.includes(tag));
    const missing = jobTags.filter(tag => !userTags.includes(tag));
    const score = Math.round((matched.length / jobTags.length) * 100);

    return { score, matched, missing };
}

function isJobApplied(jobId) {
    return state.applications.some(app => String(app.jobId) === String(jobId));
}

function setView(viewName) {
    if (viewName === "profile") {
        showGuestPrompt();
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
    return true;
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
    state.applications = [];
    renderSidebar();
}

// Backend API connected
async function logout() {
    showGuestPrompt();
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
    state.hasResume = false;
}

async function handleUploadResume() {
    showGuestPrompt();
}

function renderFeedView() {
    const filteredJobs = getFilteredJobs();

    els.feedView.innerHTML = `
    <div class="page-title-row">
      <div class="page-title">
        <h1>Discover Roles.</h1>
        <p>
          Explore and apply for teaching assistant positions. Enhance your academic
          journey by mentoring others.
        </p>
      </div>
      <div class="inline-actions">
        <button class="btn btn-ghost" id="goProfileBtn" type="button">View Profile</button>
      </div>
    </div>

    <div class="search-box glass-card section-card">
      ${Icons.search}
      <input
        id="jobSearchInput"
        type="text"
        placeholder="Search by course or professor..."
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
        filteredJobs.length > 0
            ? filteredJobs.map(job => renderJobCard(job)).join("")
            : `
            <div class="empty-state glass-card">
              <strong>No positions match your current criteria.</strong>
              <span>Try adjusting the search text or selected tags.</span>
            </div>
          `
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
        filteredJobs.length > 0
            ? filteredJobs.map(job => renderJobCard(job)).join("")
            : `
            <div class="empty-state glass-card">
              <strong>No positions match your current criteria.</strong>
              <span>Try adjusting the search text or selected tags.</span>
            </div>
          `
    }
    `;

    bindJobListEvents();
}

function renderJobCard(job) {
    const applied = isJobApplied(job.id);
    const applyLabel = applied ? "Applied" : "Apply";
    const applyIcon = applied ? "" : Icons.chevronRight;
    const applyDisabled = applied ? "disabled" : "";
    return `
    <article class="job-card" data-job-id="${job.id}">
      <div class="job-top">
        <div class="job-title-wrap">
          <h3>${escapeHtml(job.course)}</h3>
          <div class="job-sub">
            <span class="badge badge-soft">${Icons.user} ${escapeHtml(job.prof)}</span>
            <span class="badge badge-soft">${Icons.clock} ${escapeHtml(job.hours)} hrs/wk</span>
          </div>
        </div>
        <span class="badge badge-primary">Open</span>
      </div>

      <p class="job-desc">${escapeHtml(job.description)}</p>

      <div class="tag-list">
        ${(job.tags || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
      </div>

      <div class="job-footer">
        <div class="job-stats">
          <span>RoleID: ${job.id}</span>
          <span>${(job.tags || []).length} required tags</span>
        </div>
        <div class="job-actions">
          <button class="btn btn-ghost open-job-btn" type="button" data-job-id="${job.id}">
            View Details
          </button>
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
                    <p style="margin:0;">Optional, but recommended</p>
                  </div>
                </div>
              </button>
            `
    }
      </section>

      <section class="glass-card section-card">
        <h3 class="side-title">${Icons.clock} My Applications</h3>
        <div class="application-list">
          ${
        state.applications.length === 0
            ? `
                <div class="empty-state">
                  <strong>No applications submitted yet.</strong>
                  <span>Your submitted jobs will appear here.</span>
                </div>
              `
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
    const applyButtons = els.feedView.querySelectorAll(".apply-job-btn");
    const filterStubBtn = document.getElementById("filterStubBtn");

    if (goProfileBtn) {
        goProfileBtn.addEventListener("click", showGuestPrompt);
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

    applyButtons.forEach(btn => {
        btn.addEventListener("click", async event => {
            event.stopPropagation();
            showGuestPrompt();
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
    const cancelButtons = els.sidebar.querySelectorAll(".cancel-application-btn");

    if (openProfileEditBtn) {
        openProfileEditBtn.addEventListener("click", showGuestPrompt);
    }

    if (sidebarViewProfileBtn) {
        sidebarViewProfileBtn.addEventListener("click", showGuestPrompt);
    }

    if (resumeUploadBtn) {
        resumeUploadBtn.addEventListener("click", handleUploadResume);
    }

    cancelButtons.forEach(btn => {
        btn.addEventListener("click", event => {
            event.stopPropagation();
            showGuestPrompt();
        });
    });
}

function bindProfileViewEvents() {
    const backBtn = document.getElementById("profileBackToFeedBtn");
    const editBtn = document.getElementById("profileEditMainBtn");

    if (backBtn) {
        backBtn.addEventListener("click", showGuestPrompt);
    }

    if (editBtn) {
        editBtn.addEventListener("click", showGuestPrompt);
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
            showGuestPrompt();
        });
    });
}

function bindJobListEvents() {
    const openButtons = els.feedView.querySelectorAll(".open-job-btn");
    const applyButtons = els.feedView.querySelectorAll(".apply-job-btn");

    openButtons.forEach(btn => {
        btn.addEventListener("click", async event => {
            event.stopPropagation();
            const id = btn.dataset.jobId;
            await openJobModal(id);
        });
    });

    applyButtons.forEach(btn => {
        btn.addEventListener("click", async event => {
            event.stopPropagation();
            showGuestPrompt();
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
    const isProfileOpen = els.profileModalOverlay && !els.profileModalOverlay.classList.contains("hidden");
    const isJobOpen = els.jobModalOverlay && !els.jobModalOverlay.classList.contains("hidden");
    document.body.classList.toggle("modal-open", isProfileOpen || isJobOpen);
}

function openProfileModal() {
    showGuestPrompt();
}

function closeProfileModal() {
    state.isProfileModalOpen = false;
    els.profileModalOverlay.classList.add("hidden");
    updateBodyScrollLock();
}

// Backend not connected: profile saving is not available in the sample API, so this stays local.
async function saveProfile() {
    showGuestPrompt();
}

// Backend API connected
async function handleApply(jobId) {
    showGuestPrompt();
}

// Backend API connected
async function openJobModal(jobId) {
    const r = await request(`/job?action=getDetail&jobId=${encodeURIComponent(jobId)}`);

    if (r.ok && r.data && r.data.code === 200) {
        const detail = r.data.data || {};

        state.selectedJob = {
            id: detail.jobId,
            course: detail.jobName || "Untitled Role",
            prof: detail.publisherName || detail.moName || "Course Lead",
            hours: detail.workHoursWeekly || 0,
            tags: [
                detail.jobType === 1 ? "TA" : "Assistant",
                detail.belongModule || "Uncategorized"
            ],
            description: detail.jobDesc || "No description available",
            raw: detail
        };

        state.appRemarks = "";
        state.appOptions = {
            takenCourse: false,
            inPerson: true
        };

        renderJobModal();
        els.jobModalOverlay.classList.remove("hidden");
        updateBodyScrollLock();
        return;
    }

    showError((r.data && r.data.msg) || r.error || "Failed to load role details.");
}

function closeJobModal() {
    state.selectedJob = null;
    els.jobModalOverlay.classList.add("hidden");
    updateBodyScrollLock();
}

function renderJobModal() {
    const job = state.selectedJob;
    if (!job) return;

    const match = getMatchData(job);
    const raw = job.raw || {};
    const alreadyApplied = isJobApplied(job.id);

    els.jobModalTitle.textContent = job.course;
    els.jobModalMeta.innerHTML = `
    <span class="badge badge-soft">${Icons.user} ${escapeHtml(job.prof)}</span>
    <span class="badge badge-soft">${Icons.clock} ${escapeHtml(job.hours)} hrs/week</span>
    <span class="badge badge-primary">${raw.jobType === 1 ? "TARole" : "AssistantRole"}</span>
    <span class="badge badge-soft">${escapeHtml(raw.belongModule || "Uncategorized")}</span>
  `;

    els.jobDescriptionText.textContent = job.description;

    els.matchCard.innerHTML = `
    <strong>Role Match: ${match.score}%</strong>
    <p>
      Matched tags: ${match.matched.length > 0 ? escapeHtml(match.matched.join(", ")) : "None"}.
      ${
        match.missing.length > 0
            ? `Missing tags: ${escapeHtml(match.missing.join(", "))}.`
            : " Your current tags cover the listed tags."
    }
    </p>
  `;

    els.jobRequiredTags.innerHTML = (job.tags || [])
        .map(tag => `<span class="tag">${escapeHtml(tag)}</span>`)
        .join("");

    els.appRemarksInput.value = state.appRemarks;

    syncApplicationOptionButtons();

    const submitBtn = document.getElementById("submitApplicationBtn");
    if (submitBtn) {
        submitBtn.disabled = alreadyApplied;
        submitBtn.textContent = alreadyApplied ? "Applied" : "Submit Application";
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
    showGuestPrompt();
}

function bindModalEvents() {
    const closeProfileModalBtn = document.getElementById("closeProfileModalBtn");
    const cancelProfileModalBtn = document.getElementById("cancelProfileModalBtn");
    const saveProfileBtn = document.getElementById("saveProfileBtn");

    const closeJobModalBtn = document.getElementById("closeJobModalBtn");
    const cancelJobModalBtn = document.getElementById("cancelJobModalBtn");
    const submitApplicationBtn = document.getElementById("submitApplicationBtn");
    const guestModalOverlay = document.getElementById("guestModalOverlay");
    const guestGoLoginBtn = document.getElementById("guestGoLoginBtn");

    if (closeProfileModalBtn) {
        closeProfileModalBtn.addEventListener("click", () => {
            closeProfileModal();
            showGuestPrompt();
        });
    }

    if (cancelProfileModalBtn) {
        cancelProfileModalBtn.addEventListener("click", () => {
            closeProfileModal();
            showGuestPrompt();
        });
    }

    if (saveProfileBtn) {
        saveProfileBtn.addEventListener("click", showGuestPrompt);
    }

    if (els.profileVisibleToggle) {
        els.profileVisibleToggle.addEventListener("click", () => {
            showGuestPrompt();
        });
    }

    if (closeJobModalBtn) {
        closeJobModalBtn.addEventListener("click", closeJobModal);
    }

    if (cancelJobModalBtn) {
        cancelJobModalBtn.addEventListener("click", closeJobModal);
    }

    if (submitApplicationBtn) {
        submitApplicationBtn.addEventListener("click", async () => {
            showGuestPrompt();
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

    if (els.profileModalOverlay) {
        els.profileModalOverlay.addEventListener("click", event => {
            if (event.target === els.profileModalOverlay) {
                closeProfileModal();
            }
        });
    }

    if (els.jobModalOverlay) {
        els.jobModalOverlay.addEventListener("click", event => {
            if (event.target === els.jobModalOverlay) {
                closeJobModal();
            }
        });
    }

    if (guestModalOverlay) {
        guestModalOverlay.addEventListener("click", event => {
            if (event.target === guestModalOverlay) {
                closeGuestPrompt();
            }
        });
    }

    if (guestGoLoginBtn) {
        guestGoLoginBtn.addEventListener("click", goToLoginPage);
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            if (!els.profileModalOverlay.classList.contains("hidden")) {
                closeProfileModal();
            }
            if (!els.jobModalOverlay.classList.contains("hidden")) {
                closeJobModal();
            }
            const guestModal = document.getElementById("guestModalOverlay");
            if (guestModal && !guestModal.classList.contains("hidden")) {
                closeGuestPrompt();
            }
        }
    });
}

function render() {
    const navUserNameEl = document.getElementById("navUserName");
    if (navUserNameEl) {
        navUserNameEl.textContent = state.profile.name || "";
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
    els.logoutBtn = document.getElementById("logoutBtn");

    els.profileModalOverlay = document.getElementById("profileModalOverlay");
    els.jobModalOverlay = document.getElementById("jobModalOverlay");

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
}

function bindGlobalEvents() {
    if (els.avatarBtn) {
        els.avatarBtn.addEventListener("click", showGuestPrompt);
    }
    if (els.logoutBtn) {
        els.logoutBtn.addEventListener("click", showGuestPrompt);
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
    await checkResumeStatus();
    render();
});
