const BASE_URL = "/tapj"; // 已实现后端接口连接

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

    searchQuery: "",
    activeTags: [],

    isProfileModalOpen: false,
    selectedJob: null,

    currentUser: null, // 已实现后端接口连接

    profile: {
        name: "未登录用户",
        major: "暂未获取",
        bio: "Passionate about teaching and helping others learn programming.",
        email: "",
        isVisible: true,
        visibilityScope: "applied_only",
        skills: ["Python", "Grading", "Java"]
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

// 已实现后端接口连接
function showError(message) {
    alert(message || "请求失败");
}

// 已实现后端接口连接
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

// 已实现后端接口连接
function mapUserToProfile(user) {
    if (!user) return;

    state.currentUser = user;
    state.profile.name = user.realName || user.username || "未命名用户";
    state.profile.email = user.email || "";
    state.profile.major = user.major || user.course || "暂未填写";
}

// 已实现后端接口连接
function mapJobFromBackend(job) {
    return {
        id: job.jobId,
        course: job.jobName || "未命名岗位",
        prof: job.publisherName || job.moName || "课程负责人",
        hours: job.workHoursWeekly || 0,
        tags: [
            job.jobType === 1 ? "助教" : "助理",
            job.belongModule || "未分类"
        ],
        description: job.jobDesc || "暂无岗位描述",
        raw: job
    };
}

// 已实现后端接口连接
function mapApplicationFromBackend(app) {
    return {
        id: app.applicationId,
        jobId: app.jobId,
        status: app.status || "未知状态",
        raw: app,
        job: {
            course: app.jobName ? app.jobName : `岗位ID: ${app.jobId}`,
            prof: app.taId ? `TA ID: ${app.taId}` : "我的申请"
        }
    };
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
    const userSkills = state.profile.skills || [];

    if (jobTags.length === 0) {
        return { score: 100, matched: [], missing: [] };
    }

    const matched = jobTags.filter(tag => userSkills.includes(tag));
    const missing = jobTags.filter(tag => !userSkills.includes(tag));
    const score = Math.round((matched.length / jobTags.length) * 100);

    return { score, matched, missing };
}

function setView(viewName) {
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

// 已实现后端接口连接
async function loadLoginUser() {
    const r = await request("/user?action=getLoginUser");
    if (r.ok && r.data.code === 200) {
        mapUserToProfile(r.data.data);
        render();
        return true;
    }

    alert("未登录或登录已过期，请重新登录");
    location.href = "index.html";
    return false;
}

// 已实现后端接口连接
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
    showError((r.data && r.data.msg) || r.error || "加载岗位失败");
}

// 已实现后端接口连接
async function loadMyApplications() {
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

// 未实现后端接口连接：示例接口文档中没有简历上传接口，先保留前端演示逻辑
function handleUploadResume() {
    if (state.hasResume) return;

    const uploadBtn = document.getElementById("resumeUploadBtn");
    if (uploadBtn) {
        uploadBtn.disabled = true;
        uploadBtn.innerHTML = `
      <div class="fade-in" style="display:flex;flex-direction:column;align-items:center;gap:12px;">
        <div class="profile-avatar" style="width:52px;height:52px;">...</div>
        <div style="text-align:center;">
          <p style="margin:0;font-weight:700;">Uploading...</p>
          <p style="margin:6px 0 0;color:var(--text-soft);font-size:12px;">Please wait</p>
        </div>
      </div>
    `;
    }

    setTimeout(() => {
        state.hasResume = true;
        renderSidebar();
    }, 600);
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
      ${POPULAR_TAGS.map(tag => `
        <button
          class="filter-chip ${state.activeTags.includes(tag) ? "active" : ""}"
          type="button"
          data-tag="${escapeHtml(tag)}"
        >
          ${escapeHtml(tag)}
        </button>
      `).join("")}
      <button class="filter-chip" id="filterStubBtn" type="button" title="当前仅保留交互外观">
        ${Icons.sliders}
      </button>
    </div>

    <div class="job-list">
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
}

function renderJobCard(job) {
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
          <span>岗位ID: ${job.id}</span>
          <span>${(job.tags || []).length} required skills</span>
        </div>
        <div class="job-actions">
          <button class="btn btn-ghost open-job-btn" type="button" data-job-id="${job.id}">
            View Details
          </button>
          <button class="btn btn-primary apply-job-btn" type="button" data-job-id="${job.id}">
            Apply ${Icons.chevronRight}
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
            <span>Skills</span>
            <span>${escapeHtml(state.profile.skills.join(", "))}</span>
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
        state.hasResume
            ? `
              <div class="resume-box fade-in">
                <div style="display:flex;align-items:center;gap:12px;">
                  <div class="profile-avatar" style="width:44px;height:44px;border-radius:14px;">
                    ${Icons.file}
                  </div>
                  <div>
                    <strong style="display:block;margin-bottom:4px;">Resume Uploaded</strong>
                    <p style="margin:0;">alex_resume_2026.pdf</p>
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
        <h3 class="side-title">${Icons.clock} Applications</h3>
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
                    <h5>${escapeHtml(app.job.course)}</h5>
                    <p>${escapeHtml(app.job.prof)}</p>
                    <div style="margin-top:10px;">
                      <span class="badge badge-soft">${escapeHtml(app.status)}</span>
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
    const skillCount = state.profile.skills.length;
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
                  ${state.profile.isVisible ? "●" : "○"} ${escapeHtml(visibilityText)}
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
            <strong>${skillCount}</strong>
            <span>Skills Listed</span>
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
            <h3>Skills</h3>
            <div class="tag-list">
              ${
        state.profile.skills.length > 0
            ? state.profile.skills.map(skill => `<span class="tag">${escapeHtml(skill)}</span>`).join("")
            : `<span class="tag">No skills yet</span>`
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
        goProfileBtn.addEventListener("click", () => setView("profile"));
    }

    if (searchInput) {
        searchInput.addEventListener("input", event => {
            state.searchQuery = event.target.value;
            renderFeedView();
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
            const id = Number(btn.dataset.jobId);
            await openJobModal(id);
        });
    });

    applyButtons.forEach(btn => {
        btn.addEventListener("click", async event => {
            event.stopPropagation();
            const id = Number(btn.dataset.jobId);
            await handleApply(id);
        });
    });

    const cards = els.feedView.querySelectorAll(".job-card");
    cards.forEach(card => {
        card.addEventListener("click", async () => {
            await openJobModal(Number(card.dataset.jobId));
        });
    });

    if (filterStubBtn) {
        filterStubBtn.addEventListener("click", () => {
            alert("当前版本保留了筛选按钮交互外观，详细高级筛选后续再扩展。");
        });
    }
}

function bindSidebarEvents() {
    const openProfileEditBtn = document.getElementById("openProfileEditBtn");
    const sidebarViewProfileBtn = document.getElementById("sidebarViewProfileBtn");
    const resumeUploadBtn = document.getElementById("resumeUploadBtn");

    if (openProfileEditBtn) {
        openProfileEditBtn.addEventListener("click", openProfileModal);
    }

    if (sidebarViewProfileBtn) {
        sidebarViewProfileBtn.addEventListener("click", () => setView("profile"));
    }

    if (resumeUploadBtn) {
        resumeUploadBtn.addEventListener("click", handleUploadResume);
    }
}

function bindProfileViewEvents() {
    const backBtn = document.getElementById("profileBackToFeedBtn");
    const editBtn = document.getElementById("profileEditMainBtn");

    if (backBtn) {
        backBtn.addEventListener("click", () => setView("feed"));
    }

    if (editBtn) {
        editBtn.addEventListener("click", openProfileModal);
    }
}

function syncProfileModalState() {
    els.profileNameInput.value = state.profile.name || "";
    els.profileEmailInput.value = state.profile.email || "";
    els.profileMajorInput.value = state.profile.major || "";
    els.profileBioInput.value = state.profile.bio || "";
    els.profileSkillsInput.value = (state.profile.skills || []).join(", ");

    els.profileVisibleToggle.classList.toggle("active", !!state.profile.isVisible);
    els.profileVisibleIcon.classList.toggle("active", !!state.profile.isVisible);
}

function openProfileModal() {
    state.isProfileModalOpen = true;
    syncProfileModalState();
    els.profileModalOverlay.classList.remove("hidden");
}

function closeProfileModal() {
    state.isProfileModalOpen = false;
    els.profileModalOverlay.classList.add("hidden");
}

// 未实现后端接口连接：示例接口文档中没有个人资料保存接口，先保留前端本地修改
function saveProfile() {
    state.profile.name = els.profileNameInput.value.trim() || state.profile.name;
    state.profile.email = els.profileEmailInput.value.trim() || state.profile.email;
    state.profile.major = els.profileMajorInput.value.trim() || state.profile.major;
    state.profile.bio = els.profileBioInput.value.trim();

    const nextSkills = els.profileSkillsInput.value
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);

    state.profile.skills = nextSkills;
    closeProfileModal();
    render();
}

// 已实现后端接口连接
async function handleApply(jobId) {
    const r = await request(`/application?action=apply&jobId=${encodeURIComponent(jobId)}`, {
        method: "POST"
    });

    if (r.ok && r.data && r.data.code === 200) {
        alert(r.data.msg || "申请成功");
        await loadOpenJobs();
        await loadMyApplications();
        render();
        return;
    }

    showError((r.data && r.data.msg) || r.error || "申请失败");
}

// 已实现后端接口连接
async function openJobModal(jobId) {
    const r = await request(`/job?action=getDetail&jobId=${encodeURIComponent(jobId)}`);

    if (r.ok && r.data && r.data.code === 200) {
        const detail = r.data.data || {};

        state.selectedJob = {
            id: detail.jobId,
            course: detail.jobName || "未命名岗位",
            prof: detail.publisherName || detail.moName || "课程负责人",
            hours: detail.workHoursWeekly || 0,
            tags: [
                detail.jobType === 1 ? "助教" : "助理",
                detail.belongModule || "未分类"
            ],
            description: detail.jobDesc || "暂无岗位描述",
            raw: detail
        };

        state.appRemarks = "";
        state.appOptions = {
            takenCourse: false,
            inPerson: true
        };

        renderJobModal();
        els.jobModalOverlay.classList.remove("hidden");
        return;
    }

    showError((r.data && r.data.msg) || r.error || "获取岗位详情失败");
}

function closeJobModal() {
    state.selectedJob = null;
    els.jobModalOverlay.classList.add("hidden");
}

function renderJobModal() {
    const job = state.selectedJob;
    if (!job) return;

    const match = getMatchData(job);
    const raw = job.raw || {};

    els.jobModalTitle.textContent = job.course;
    els.jobModalMeta.innerHTML = `
    <span class="badge badge-soft">${Icons.user} ${escapeHtml(job.prof)}</span>
    <span class="badge badge-soft">${Icons.clock} ${escapeHtml(job.hours)} hrs/week</span>
    <span class="badge badge-primary">${raw.jobType === 1 ? "助教岗位" : "助理岗位"}</span>
    <span class="badge badge-soft">${escapeHtml(raw.belongModule || "未分类")}</span>
  `;

    els.jobDescriptionText.textContent = job.description;

    els.matchCard.innerHTML = `
    <strong>${Icons.target} 岗位匹配度: ${match.score}%</strong>
    <p>
      已匹配技能: ${match.matched.length > 0 ? escapeHtml(match.matched.join(", ")) : "暂无"}。
      ${
        match.missing.length > 0
            ? `待补充技能: ${escapeHtml(match.missing.join(", "))}。`
            : " 当前技能已覆盖展示出的标签要求。"
    }
    </p>
  `;

    els.jobRequiredTags.innerHTML = (job.tags || [])
        .map(tag => `<span class="tag">${escapeHtml(tag)}</span>`)
        .join("");

    els.appRemarksInput.value = state.appRemarks;

    syncApplicationOptionButtons();
}

function syncApplicationOptionButtons() {
    const taken = !!state.appOptions.takenCourse;
    const inPerson = !!state.appOptions.inPerson;

    els.takenCourseToggle.classList.toggle("active", taken);
    els.takenCourseIcon.classList.toggle("active", taken);

    els.inPersonToggle.classList.toggle("active", inPerson);
    els.inPersonIcon.classList.toggle("active", inPerson);
}

// 已实现后端接口连接
async function submitApplicationFromModal() {
    if (!state.selectedJob) return;

    state.appRemarks = els.appRemarksInput.value.trim();

    const jobId = state.selectedJob.id;
    const r = await request(`/application?action=apply&jobId=${encodeURIComponent(jobId)}`, {
        method: "POST"
    });

    if (r.ok && r.data && r.data.code === 200) {
        alert(r.data.msg || "申请成功");
        closeJobModal();
        await loadOpenJobs();
        await loadMyApplications();
        render();
        return;
    }

    showError((r.data && r.data.msg) || r.error || "申请失败");
}

function bindModalEvents() {
    const closeProfileModalBtn = document.getElementById("closeProfileModalBtn");
    const cancelProfileModalBtn = document.getElementById("cancelProfileModalBtn");
    const saveProfileBtn = document.getElementById("saveProfileBtn");

    const closeJobModalBtn = document.getElementById("closeJobModalBtn");
    const cancelJobModalBtn = document.getElementById("cancelJobModalBtn");
    const submitApplicationBtn = document.getElementById("submitApplicationBtn");

    if (closeProfileModalBtn) {
        closeProfileModalBtn.addEventListener("click", closeProfileModal);
    }

    if (cancelProfileModalBtn) {
        cancelProfileModalBtn.addEventListener("click", closeProfileModal);
    }

    if (saveProfileBtn) {
        saveProfileBtn.addEventListener("click", saveProfile);
    }

    if (els.profileVisibleToggle) {
        els.profileVisibleToggle.addEventListener("click", () => {
            state.profile.isVisible = !state.profile.isVisible;
            syncProfileModalState();
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
            await submitApplicationFromModal();
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

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            if (!els.profileModalOverlay.classList.contains("hidden")) {
                closeProfileModal();
            }
            if (!els.jobModalOverlay.classList.contains("hidden")) {
                closeJobModal();
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

    els.profileModalOverlay = document.getElementById("profileModalOverlay");
    els.jobModalOverlay = document.getElementById("jobModalOverlay");

    els.profileNameInput = document.getElementById("profileNameInput");
    els.profileEmailInput = document.getElementById("profileEmailInput");
    els.profileMajorInput = document.getElementById("profileMajorInput");
    els.profileBioInput = document.getElementById("profileBioInput");
    els.profileSkillsInput = document.getElementById("profileSkillsInput");
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
        els.avatarBtn.addEventListener("click", () => setView("profile"));
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    cacheElements();
    bindGlobalEvents();
    bindModalEvents();

    const ok = await loadLoginUser(); // 已实现后端接口连接
    if (!ok) return;

    await loadOpenJobs(); // 已实现后端接口连接
    await loadMyApplications(); // 已实现后端接口连接
    render();
});