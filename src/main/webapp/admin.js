const BASE_URL = "/tapj"; // 已实现后端接口连接

const state = {
    currentView: "mo",

    currentAdmin: {
        name: "Admin User",
        role: "System Administrator",
        email: "admin@ta-market.edu"
    },

    currentUser: null, // 已实现后端接口连接
    backendJobs: [], // 已实现后端接口连接

    filters: {
        taSearch: "",
        moSearch: "",
        logSearch: "",
        taStatus: "all",
        moStatus: "all",
        logType: "all"
    },

    selectedTA: null,
    selectedUser: null,
    selectedPost: null,
    selectedRequest: null,
    selectedBackendJob: null, // 已实现后端接口连接
    selectedJobApplicants: [], // 已实现后端接口连接

    modals: {
        taDetail: false,
        stats: false,
        users: false,
        userDetail: false,
        rejectPost: false,
        requests: false
    },

    rejectReason: "",

    backendUsers: [], // 已实现后端接口连接
    backendJobsList: [], // 已实现后端接口连接

    stats: {
        totalUsers: 0,
        totalTAs: 0,
        totalMOs: 0,
        totalPosts: 0,
        totalApplications: 0,
        pendingPostReviews: 0,
        pendingRoleRequests: 0,
        activeLogsToday: 0
    },

    roleRequests: [], // 已实现后端接口连接 - 从后端加载

    systemUsers: [], // 已实现后端接口连接 - 从后端加载

    taWorkloads: [], // 已实现后端接口连接 - 从backendUsers过滤出TA用户

    moWorkloads: [], // 已实现后端接口连接 - 从backendUsers过滤出MO用户

    logs: [] // 已实现后端接口连接 - 从后端加载（后端暂无此接口，暂时为空）
};

const els = {};

// 缓存所有DOM元素
function cacheElements() {
    els.heroActions = document.getElementById("heroActions");
    els.monitorSwitcher = document.getElementById("monitorSwitcher");
    els.monitorContent = document.getElementById("monitorContent");

    els.openRequestsBtn = document.getElementById("openRequestsBtn");
    els.requestDot = document.getElementById("requestDot");

    els.taDetailModalOverlay = document.getElementById("taDetailModalOverlay");
    els.statsModalOverlay = document.getElementById("statsModalOverlay");
    els.usersModalOverlay = document.getElementById("usersModalOverlay");
    els.userDetailModalOverlay = document.getElementById("userDetailModalOverlay");
    els.rejectPostModalOverlay = document.getElementById("rejectPostModalOverlay");
    els.requestsModalOverlay = document.getElementById("requestsModalOverlay");
    els.allJobsModalOverlay = document.getElementById("allJobsModalOverlay");
    els.userQueryModalOverlay = document.getElementById("userQueryModalOverlay");

    els.taDetailModalBody = document.getElementById("taDetailModalBody");
    els.statsModalBody = document.getElementById("statsModalBody");
    els.usersModalBody = document.getElementById("usersModalBody");
    els.userDetailModalBody = document.getElementById("userDetailModalBody");
    els.requestsModalBody = document.getElementById("requestsModalBody");
    els.allJobsModalBody = document.getElementById("allJobsModalBody");
    els.userQueryModalBody = document.getElementById("userQueryModalBody");
    els.queryUserIdInput = document.getElementById("queryUserIdInput");
    els.userQueryResult = document.getElementById("userQueryResult");

    els.rejectReasonInput = document.getElementById("rejectReasonInput");
}

const Icons = {
    chart: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 19h16M7 16V9m5 7V5m5 11v-6"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
    users: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 21a4 4 0 0 0-8 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 10a4 4 0 0 0-6-3.46M18 9a3 3 0 1 0-2.83-4M4 21a4 4 0 0 1 6-3.46M6 9a3 3 0 1 1 2.83-4"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
    search: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m21 21-4.35-4.35M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
    bell: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 0 1-6 0"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
    user: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
    shield: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3Z"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  `,
    briefcase: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M4 9h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Zm0 0V8a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v1"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  `,
    activity: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 12h4l2.5-6 4 12 2.5-6H21"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
    eye: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
    reject: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
    approve: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 4 4L19 6"
        fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
    file: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <path d="M14 3v5h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  `,
    log: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 6h10M8 12h10M8 18h10M4 6h.01M4 12h.01M4 18h.01"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
    warning: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 9v4m0 4h.01M10.29 3.86l-7.54 13A2 2 0 0 0 4.47 20h15.06a2 2 0 0 0 1.72-3.14l-7.54-13a2 2 0 0 0-3.42 0Z"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
};

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
function mapUserToAdmin(user) {
    if (!user) return;

    state.currentUser = user;
    state.currentAdmin.name = user.realName || user.username || "Admin User";
    state.currentAdmin.email = user.email || "";
    state.currentAdmin.role = user.roleName || "System Administrator";
}

// 已实现后端接口连接
function mapJobForAdmin(job) {
    return {
        id: job.jobId,
        title: job.jobName || "未命名岗位",
        status: "open",
        createdAt: job.applyDeadline || "",
        description: job.jobDesc || "暂无岗位描述",
        belongModule: job.belongModule || "未分类",
        jobType: job.jobType,
        publisherName: job.publisherName || job.moName || "课程负责人",
        workHoursWeekly: job.workHoursWeekly || 0
    };
}

// 已实现后端接口连接
async function loadLoginUser() {
    const r = await request("/user?action=getLoginUser");
    if (r.ok && r.data && r.data.code === 200) {
        mapUserToAdmin(r.data.data);
        render();
        return true;
    }

    alert("未登录或登录已过期，请重新登录");
    location.href = "index.html";
    return false;
}

// 已实现后端接口连接 - 加载开放岗位（仅用于后端统计，不直接用于MO视图）
async function loadOpenJobs() {
    const r = await request("/job?action=listOpen");
    if (r.ok && r.data && r.data.code === 200) {
        const jobs = Array.isArray(r.data.data) ? r.data.data : [];
        state.backendJobs = jobs.map(mapJobForAdmin);
        return;
    }

    state.backendJobs = [];
    showError((r.data && r.data.msg) || r.error || "加载岗位列表失败");
}

// 已实现后端接口连接 - 加载所有用户
async function loadAllUsers() {
    const r = await request("/admin?action=listUsers");
    if (r.ok && r.data && r.data.code === 200) {
        // 直接使用后端返回的原始数据
        state.backendUsers = Array.isArray(r.data.data) ? r.data.data : [];

        // 更新统计数据
        state.stats.totalUsers = state.backendUsers.length;
        state.stats.totalTAs = state.backendUsers.filter(u => u.userType === 1).length;
        state.stats.totalMOs = state.backendUsers.filter(u => u.userType === 2).length;

        // 从用户列表中过滤出MO用户（userType=2），构建MO工作负载视图数据
        // 确保id统一为字符串类型，防止类型不一致导致查找失败
        state.moWorkloads = state.backendUsers
            .filter(u => u.userType === 2) // 只保留MO用户
            .map(mo => {
                // 统计该MO发布的岗位数量
                const moJobs = state.backendJobsList.filter(j => String(j.publisherMoId) === String(mo.userId));
                return {
                    id: String(mo.userId), // 统一转换为字符串
                    name: mo.realName || mo.username || "未命名MO",
                    username: mo.username || "",
                    email: mo.email || "",
                    course: mo.belongModule || "未分配模块",
                    publishedPosts: moJobs.length,
                    openPosts: moJobs.filter(j => j.jobStatus === 0).length,
                    closedPosts: moJobs.filter(j => j.jobStatus !== 0).length,
                    status: "active",
                    summary: moJobs.length > 0
                        ? `该课程组织者共发布了 ${moJobs.length} 个岗位，其中 ${moJobs.filter(j => j.jobStatus === 0).length} 个正在招聘中。`
                        : "该课程组织者暂未发布任何岗位。",
                    recentPosts: moJobs.slice(0, 5) // 最多显示5个最近的岗位
                };
            });

        // 从用户列表中过滤出TA用户（userType=1），构建TA工作负载视图数据
        // 确保id统一为字符串类型，防止类型不一致导致查找失败
        state.taWorkloads = state.backendUsers
            .filter(u => u.userType === 1) // 只保留TA用户
            .map(ta => {
                return {
                    id: String(ta.userId), // 统一转换为字符串
                    name: ta.realName || ta.username || "未命名TA",
                    username: ta.username || "",
                    course: ta.belongModule || "未分配模块",
                    status: "healthy",
                    summary: "该助教用户已注册，可查看其申请记录了解详情。",
                    skills: [],
                    hours: "N/A",
                    taskCount: "N/A",
                    rating: "N/A",
                    recentTasks: []
                };
            });

        return state.backendUsers;
    }

    showError((r.data && r.data.msg) || r.error || "加载用户列表失败");
    return [];
}

// 已实现后端接口连接 - 删除用户
async function deleteUser(userId) {
    if (!confirm("确定要删除该用户吗？")) {
        return;
    }

    const r = await request(`/admin?action=deleteUser&userId=${encodeURIComponent(userId)}`, { method: "POST" });
    if (r.ok && r.data && r.data.code === 200) {
        alert(r.data.msg || "删除成功");
        await loadAllUsers();
        await loadAllJobs();
        render();
        return;
    }

    showError((r.data && r.data.msg) || r.error || "删除用户失败");
}

// 已实现后端接口连接 - 加载所有岗位
async function loadAllJobs() {
    const r = await request("/admin?action=listAllJobs");
    if (r.ok && r.data && r.data.code === 200) {
        // 直接使用后端返回的原始数据
        state.backendJobsList = Array.isArray(r.data.data) ? r.data.data : [];

        // 更新统计数据
        state.stats.totalPosts = state.backendJobsList.length;

        return state.backendJobsList;
    }

    showError((r.data && r.data.msg) || r.error || "加载岗位列表失败");
    return [];
}

// 已实现后端接口连接 - 删除岗位
async function deleteJob(jobId) {
    if (!confirm("确定要删除该岗位吗？这将级联删除相关申请！")) {
        return;
    }

    const r = await request(`/admin?action=deleteJob&jobId=${encodeURIComponent(jobId)}`, { method: "POST" });
    if (r.ok && r.data && r.data.code === 200) {
        alert(r.data.msg || "删除成功");
        await loadAllJobs();
        render();
        return;
    }

    showError((r.data && r.data.msg) || r.error || "删除岗位失败");
}

// 已实现后端接口连接 - 加载用户详情
async function loadUserDetail(userId) {
    const r = await request(`/admin?action=getUserDetail&userId=${encodeURIComponent(userId)}`);
    if (r.ok && r.data && r.data.code === 200) {
        return r.data.data;
    }

    showError((r.data && r.data.msg) || r.error || "获取用户详情失败");
    return null;
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
    return (name || "A")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase() || "")
        .join("");
}

function getFilteredTAWorkloads() {
    return state.taWorkloads.filter(item => {
        const matchSearch =
            !state.filters.taSearch ||
            item.name.toLowerCase().includes(state.filters.taSearch.toLowerCase()) ||
            item.username.toLowerCase().includes(state.filters.taSearch.toLowerCase()) ||
            item.course.toLowerCase().includes(state.filters.taSearch.toLowerCase());

        const matchStatus =
            state.filters.taStatus === "all" ||
            item.status === state.filters.taStatus;

        return matchSearch && matchStatus;
    });
}

function getFilteredMOWorkloads() {
    return state.moWorkloads.filter(item => {
        const matchSearch =
            !state.filters.moSearch ||
            item.name.toLowerCase().includes(state.filters.moSearch.toLowerCase()) ||
            item.username.toLowerCase().includes(state.filters.moSearch.toLowerCase()) ||
            item.email.toLowerCase().includes(state.filters.moSearch.toLowerCase()) ||
            item.course.toLowerCase().includes(state.filters.moSearch.toLowerCase());

        const matchStatus =
            state.filters.moStatus === "all" ||
            item.status === state.filters.moStatus;

        return matchSearch && matchStatus;
    });
}

function getFilteredLogs() {
    return state.logs.filter(item => {
        const matchSearch =
            !state.filters.logSearch ||
            item.title.toLowerCase().includes(state.filters.logSearch.toLowerCase()) ||
            item.actor.toLowerCase().includes(state.filters.logSearch.toLowerCase()) ||
            item.detail.toLowerCase().includes(state.filters.logSearch.toLowerCase());

        const matchType =
            state.filters.logType === "all" ||
            item.type === state.filters.logType;

        return matchSearch && matchType;
    });
}

function renderHeroActions() {
    els.heroActions.innerHTML = `
    <article class="action-card">
      <div class="action-top">
        <div class="action-icon">${Icons.chart}</div>
        <span class="badge badge-soft">Backend API</span>
      </div>
      <h2 class="action-title">Statistics Report</h2>
      <p class="action-subtitle">
        查看平台用户、岗位、申请和待处理事项的统计概览。统计数据来自后端实时更新。
      </p>
      <div class="action-button-row">
        <button class="btn btn-primary action-btn" id="openStatsBtn" type="button">
          View Report
        </button>
      </div>
    </article>

    <article class="action-card">
      <div class="action-top">
        <div class="action-icon" style="background: linear-gradient(135deg, var(--violet) 0%, var(--primary) 100%);">${Icons.users}</div>
        <span class="badge badge-soft">Backend API</span>
      </div>
      <h2 class="action-title">System Users</h2>
      <p class="action-subtitle">
        管理全平台用户，查看其角色、状态与基础信息。用户数据来自后端接口。
      </p>
      <div class="action-button-row">
        <button class="btn btn-primary action-btn" id="openUsersBtn" type="button">
          Manage Users
        </button>
      </div>
    </article>

    <article class="action-card purple">
      <div class="action-top">
        <div class="action-icon">${Icons.briefcase}</div>
        <span class="badge badge-soft">Backend API</span>
      </div>
      <h2 class="action-title">All Jobs</h2>
      <p class="action-subtitle">
        查看和管理所有发布的岗位，包括删除岗位操作。岗位数据来自后端接口。
      </p>
      <div class="action-button-row">
        <button class="btn btn-primary action-btn" id="openAllJobsBtn" type="button">
          Manage Jobs
        </button>
      </div>
    </article>

    <article class="action-card">
      <div class="action-top">
        <div class="action-icon" style="background: linear-gradient(135deg, var(--success) 0%, var(--primary-2) 100%);">${Icons.activity}</div>
        <span class="badge badge-soft">Backend API</span>
      </div>
      <h2 class="action-title">User Details</h2>
      <p class="action-subtitle">
        根据用户ID查询详细信息，包括用户的申请记录等。
      </p>
      <div class="action-button-row">
        <button class="btn btn-primary action-btn" id="openUserQueryBtn" type="button">
          Query User
        </button>
      </div>
    </article>
  `;
}

function renderSwitcher() {
    els.monitorSwitcher.innerHTML = `
    <button class="switch-pill ${state.currentView === "ta" ? "active" : ""}" type="button" data-view="ta">
      TA
    </button>
    <button class="switch-pill ${state.currentView === "mo" ? "active" : ""}" type="button" data-view="mo">
      MO
    </button>
    <button class="switch-pill ${state.currentView === "logs" ? "active" : ""}" type="button" data-view="logs">
      Logs
    </button>
  `;
}

function renderTAView() {
    const items = getFilteredTAWorkloads();

    els.monitorContent.innerHTML = `
    <section class="section-header">
      <div class="section-title-block">
        <h2>Teaching Assistant (TA) Overview</h2>
        <p>查看所有助教用户的信息，点击查看详情了解其申请记录。</p>
      </div>

      <div class="toolbar-row" style="margin:0;">
        <div class="search-box">
          ${Icons.search}
          <input id="taSearchInput" type="text" placeholder="Search TA..." value="${escapeHtml(state.filters.taSearch)}" />
        </div>

        <div class="filter-chips">
          <button class="filter-chip ${state.filters.taStatus === "all" ? "active" : ""}" data-ta-status="all" type="button">All</button>
          <button class="filter-chip ${state.filters.taStatus === "healthy" ? "active" : ""}" data-ta-status="healthy" type="button">Healthy</button>
          <button class="filter-chip ${state.filters.taStatus === "warning" ? "active" : ""}" data-ta-status="warning" type="button">Warning</button>
          <button class="filter-chip ${state.filters.taStatus === "critical" ? "active" : ""}" data-ta-status="critical" type="button">Critical</button>
        </div>
      </div>
    </section>

    <div class="workload-grid">
      ${
        items.length > 0
            ? items.map(item => `
              <article class="workload-card" data-ta-id="${item.id}">
                <div class="workload-top">
                  <div>
                    <h3 class="workload-title">${escapeHtml(item.name)}</h3>
                    <div class="workload-sub">
                      <span class="badge badge-soft">@${escapeHtml(item.username)}</span>
                      <span class="badge badge-soft">${escapeHtml(item.course)}</span>
                    </div>
                  </div>
                  <span class="badge ${
                item.status === "healthy"
                    ? "badge-success"
                    : item.status === "warning"
                        ? "badge-warning"
                        : "badge-danger"
            }">
                    ${escapeHtml(item.status)}
                  </span>
                </div>

                <p class="workload-desc">${escapeHtml(item.summary)}</p>

                <div class="tag-list" style="margin-bottom:16px;">
                  ${item.skills.map(skill => `<span class="tag">${escapeHtml(skill)}</span>`).join("")}
                </div>

                <div class="workload-sub" style="margin-bottom:16px;">
                  <span class="badge badge-soft">Hours: ${escapeHtml(item.hours)}</span>
                  <span class="badge badge-soft">Tasks: ${escapeHtml(item.taskCount)}</span>
                  <span class="badge badge-soft">Rating: ${escapeHtml(item.rating)}</span>
                </div>

                <div class="workload-actions">
                  <button class="btn btn-soft view-ta-detail-btn" type="button" data-ta-id="${item.id}">
                    View Details
                  </button>
                  <button class="btn btn-sm btn-danger delete-ta-btn" type="button" data-ta-id="${item.id}">
                    ${Icons.reject}
                  </button>
                </div>
              </article>
            `).join("")
            : `
            <div class="empty-state">
              <strong>No TA records matched.</strong>
              <span>Try adjusting your search or status filter.</span>
            </div>
          `
    }
    </div>
  `;
}

function renderMOView() {
    const items = getFilteredMOWorkloads();

    els.monitorContent.innerHTML = `
    <section class="section-header">
      <div class="section-title-block">
        <h2>Course Organizer (MO) Overview</h2>
        <p>查看所有课程组织者的信息及其发布的岗位统计。</p>
      </div>

      <div class="toolbar-row" style="margin:0;">
        <div class="search-box">
          ${Icons.search}
          <input id="moSearchInput" type="text" placeholder="Search MO..." value="${escapeHtml(state.filters.moSearch)}" />
        </div>

        <div class="filter-chips">
          <button class="filter-chip ${state.filters.moStatus === "all" ? "active" : ""}" data-mo-status="all" type="button">All</button>
          <button class="filter-chip ${state.filters.moStatus === "active" ? "active" : ""}" data-mo-status="active" type="button">Active</button>
        </div>
      </div>
    </section>

    <div class="workload-grid">
      ${
        items.length > 0
            ? items.map(item => `
              <article class="workload-card" data-mo-id="${item.id}">
                <div class="workload-top">
                  <div>
                    <h3 class="workload-title">${escapeHtml(item.name)}</h3>
                    <div class="workload-sub">
                      <span class="badge badge-soft">@${escapeHtml(item.username)}</span>
                      <span class="badge badge-soft">${escapeHtml(item.course)}</span>
                    </div>
                  </div>
                  <span class="badge badge-success">${escapeHtml(item.status)}</span>
                </div>

                <p class="workload-desc">${escapeHtml(item.summary)}</p>

                <div class="workload-actions" style="margin-bottom:16px;">
                  <button class="btn btn-sm btn-danger delete-mo-btn" type="button" data-mo-id="${item.id}">
                    ${Icons.reject} Delete
                  </button>
                </div>

                <div class="workload-sub" style="margin-bottom:16px;">
                  <span class="badge badge-soft">Total Posts: ${escapeHtml(item.publishedPosts)}</span>
                  <span class="badge badge-success">Open: ${escapeHtml(item.openPosts)}</span>
                  <span class="badge badge-soft">Closed: ${escapeHtml(item.closedPosts)}</span>
                </div>

                ${
                item.recentPosts && item.recentPosts.length > 0
                    ? `
                <div class="table-card">
                  <div class="data-table-wrap">
                    <table class="data-table">
                      <thead>
                        <tr>
                          <th>Job Name</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${item.recentPosts.map(post => {
                        const statusText = post.jobStatus === 0 ? "招聘中" : post.jobStatus === 1 ? "已截止" : post.jobStatus === 2 ? "已招满" : "已关闭";
                        const statusClass = post.jobStatus === 0 ? "badge-success" : post.jobStatus === 1 ? "badge-warning" : post.jobStatus === 2 ? "badge-danger" : "badge-soft";
                        return `
                          <tr>
                            <td>${escapeHtml(post.jobName || "未命名岗位")}</td>
                            <td><span class="badge ${statusClass}">${escapeHtml(statusText)}</span></td>
                            <td>
                              <div class="row-actions">
                                <button class="btn btn-soft open-post-view-btn" type="button" data-post-id="${String(post.jobId)}">
                                  View
                                </button>
                              </div>
                            </td>
                          </tr>
                        `}).join("")}
                      </tbody>
                    </table>
                  </div>
                </div>
                        `
                    : ""
            }
              </article>
            `).join("")
            : `
            <div class="empty-state">
              <strong>No MO records matched.</strong>
              <span>There are no course organizers in the system yet.</span>
            </div>
          `
    }
    </div>
  `;
}

function renderLogsView() {
    const items = getFilteredLogs();

    els.monitorContent.innerHTML = `
    <section class="section-header">
      <div class="section-title-block">
        <h2>System Logs</h2>
        <p>系统日志数据（后端暂无此接口，当前显示为空）</p>
      </div>

      <div class="toolbar-row" style="margin:0;">
        <div class="search-box">
          ${Icons.search}
          <input id="logSearchInput" type="text" placeholder="Search logs..." value="${escapeHtml(state.filters.logSearch)}" />
        </div>

        <div class="filter-chips">
          <button class="filter-chip ${state.filters.logType === "all" ? "active" : ""}" data-log-type="all" type="button">All</button>
          <button class="filter-chip ${state.filters.logType === "post_review" ? "active" : ""}" data-log-type="post_review" type="button">Post Review</button>
          <button class="filter-chip ${state.filters.logType === "role_change" ? "active" : ""}" data-log-type="role_change" type="button">Role Change</button>
          <button class="filter-chip ${state.filters.logType === "audit" ? "active" : ""}" data-log-type="audit" type="button">Audit</button>
          <button class="filter-chip ${state.filters.logType === "system" ? "active" : ""}" data-log-type="system" type="button">System</button>
        </div>
      </div>
    </section>

    <div class="log-list">
      ${
        items.length > 0
            ? items.map(item => `
              <article class="log-item">
                <div class="log-item-header">
                  <h3 class="log-title">${escapeHtml(item.title)}</h3>
                  <span class="badge badge-soft">${escapeHtml(item.type)}</span>
                </div>
                <div class="log-meta">${escapeHtml(item.actor)} · ${escapeHtml(item.time)}</div>
                <p class="log-body">${escapeHtml(item.detail)}</p>
              </article>
            `).join("")
            : `
            <div class="empty-state">
              <strong>No logs matched.</strong>
              <span>Try adjusting your search or log type filter.</span>
            </div>
          `
    }
    </div>
  `;
}

function renderMonitorContent() {
    if (state.currentView === "ta") {
        renderTAView();
    } else if (state.currentView === "mo") {
        renderMOView();
    } else {
        renderLogsView();
    }
}

function renderRequestDot() {
    const pending = state.roleRequests.some(item => item.status === "pending");
    els.requestDot.classList.toggle("hidden", !pending);
}

function render() {
    document.getElementById("navUserName").textContent = state.currentAdmin.name;
    renderHeroActions();
    renderSwitcher();
    renderMonitorContent();
    renderRequestDot();
    bindPageEvents();
}

function cacheElements() {
    els.heroActions = document.getElementById("heroActions");
    els.monitorSwitcher = document.getElementById("monitorSwitcher");
    els.monitorContent = document.getElementById("monitorContent");

    els.openRequestsBtn = document.getElementById("openRequestsBtn");
    els.requestDot = document.getElementById("requestDot");

    els.taDetailModalOverlay = document.getElementById("taDetailModalOverlay");
    els.statsModalOverlay = document.getElementById("statsModalOverlay");
    els.usersModalOverlay = document.getElementById("usersModalOverlay");
    els.userDetailModalOverlay = document.getElementById("userDetailModalOverlay");
    els.rejectPostModalOverlay = document.getElementById("rejectPostModalOverlay");
    els.requestsModalOverlay = document.getElementById("requestsModalOverlay");
    els.allJobsModalOverlay = document.getElementById("allJobsModalOverlay");
    els.userQueryModalOverlay = document.getElementById("userQueryModalOverlay");

    els.taDetailModalBody = document.getElementById("taDetailModalBody");
    els.statsModalBody = document.getElementById("statsModalBody");
    els.usersModalBody = document.getElementById("usersModalBody");
    els.userDetailModalBody = document.getElementById("userDetailModalBody");
    els.requestsModalBody = document.getElementById("requestsModalBody");
    els.allJobsModalBody = document.getElementById("allJobsModalBody");
    els.userQueryModalBody = document.getElementById("userQueryModalBody");
    els.queryUserIdInput = document.getElementById("queryUserIdInput");
    els.userQueryResult = document.getElementById("userQueryResult");

    els.rejectReasonInput = document.getElementById("rejectReasonInput");
}

function bindPageEvents() {
    const openStatsBtn = document.getElementById("openStatsBtn");
    const openUsersBtn = document.getElementById("openUsersBtn");
    const openAllJobsBtn = document.getElementById("openAllJobsBtn");
    const openUserQueryBtn = document.getElementById("openUserQueryBtn");
    const switchBtns = document.querySelectorAll("[data-view]");

    if (openStatsBtn) {
        openStatsBtn.addEventListener("click", openStatsModal);
    }

    if (openUsersBtn) {
        openUsersBtn.addEventListener("click", openUsersModal);
    }

    if (openAllJobsBtn) {
        openAllJobsBtn.addEventListener("click", openAllJobsModal);
    }

    if (openUserQueryBtn) {
        openUserQueryBtn.addEventListener("click", openUserQueryModal);
    }

    switchBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            state.currentView = btn.dataset.view;
            render();
        });
    });

    bindTAViewEvents();
    bindMOViewEvents();
    bindLogsViewEvents();
}

function bindTAViewEvents() {
    const taSearchInput = document.getElementById("taSearchInput");
    const statusBtns = document.querySelectorAll("[data-ta-status]");
    const detailBtns = document.querySelectorAll(".view-ta-detail-btn");

    if (taSearchInput) {
        taSearchInput.addEventListener("input", e => {
            state.filters.taSearch = e.target.value;
            renderTAView();
            bindTAViewEvents();
        });
    }

    statusBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            state.filters.taStatus = btn.dataset.taStatus;
            renderTAView();
            bindTAViewEvents();
        });
    });

    detailBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = String(btn.dataset.taId); // 直接使用字符串，避免类型转换问题
            openTADetailModal(id);
        });
    });

    // 删除TA按钮事件
    const deleteBtns = document.querySelectorAll(".delete-ta-btn");
    deleteBtns.forEach(btn => {
        btn.addEventListener("click", async () => {
            const taId = String(btn.dataset.taId);
            const ta = getTAById(taId);
            if (ta && confirm(`确定要删除TA用户 "${ta.name}" 吗？`)) {
                await deleteUser(taId);
            }
        });
    });
}

function bindMOViewEvents() {
    const moSearchInput = document.getElementById("moSearchInput");
    const statusBtns = document.querySelectorAll("[data-mo-status]");
    const viewBtns = document.querySelectorAll(".open-post-view-btn");

    if (moSearchInput) {
        moSearchInput.addEventListener("input", e => {
            state.filters.moSearch = e.target.value;
            renderMOView();
            bindMOViewEvents();
        });
    }

    statusBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            state.filters.moStatus = btn.dataset.moStatus;
            renderMOView();
            bindMOViewEvents();
        });
    });

    viewBtns.forEach(btn => {
        btn.addEventListener("click", async () => {
            const postId = String(btn.dataset.postId);
            await openPostPreview(postId);
        });
    });

    // 删除MO按钮事件
    const deleteMoBtns = document.querySelectorAll(".delete-mo-btn");
    deleteMoBtns.forEach(btn => {
        btn.addEventListener("click", async () => {
            const moId = String(btn.dataset.moId);
            const mo = getMOById(moId);
            if (mo && confirm(`确定要删除MO用户 "${mo.name}" 吗？`)) {
                await deleteUser(moId);
            }
        });
    });
}

function bindLogsViewEvents() {
    const logSearchInput = document.getElementById("logSearchInput");
    const typeBtns = document.querySelectorAll("[data-log-type]");

    if (logSearchInput) {
        logSearchInput.addEventListener("input", e => {
            state.filters.logSearch = e.target.value;
            renderLogsView();
            bindLogsViewEvents();
        });
    }

    typeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            state.filters.logType = btn.dataset.logType;
            renderLogsView();
            bindLogsViewEvents();
        });
    });
}

function getTAById(id) {
    // 使用严格相等比较字符串类型
    return state.taWorkloads.find(item => item.id === String(id)) || null;
}

function getMOById(id) {
    return state.moWorkloads.find(item => item.id === String(id)) || null;
}

function getPostByIds(postId, moId) {
    const mo = getMOById(moId);
    if (!mo) return null;
    return mo.recentPosts.find(post => String(post.jobId) === String(postId)) || null;
}

function openTADetailModal(id) {
    // 直接使用字符串id进行匹配
    const ta = getTAById(id);
    if (!ta) {
        console.error("TA not found, id:", id, "available ids:", state.taWorkloads.map(t => t.id));
        alert("无法找到该TA用户，请刷新页面后重试");
        return;
    }

    state.selectedTA = ta;

    els.taDetailModalBody.innerHTML = `
    <div class="user-profile-block">
      <div class="user-avatar-xl">${escapeHtml(getInitials(ta.name))}</div>
      <div class="user-identity">
        <h3>${escapeHtml(ta.name)}</h3>
        <p>@${escapeHtml(ta.username)} · ${escapeHtml(ta.course)}</p>
      </div>
    </div>

    <div class="detail-grid" style="margin-bottom:18px;">
      <div class="detail-row">
        <span>Weekly Hours</span>
        <span>${escapeHtml(ta.hours)}</span>
      </div>
      <div class="detail-row">
        <span>Task Count</span>
        <span>${escapeHtml(ta.taskCount)}</span>
      </div>
      <div class="detail-row">
        <span>Status</span>
        <span>${escapeHtml(ta.status)}</span>
      </div>
      <div class="detail-row">
        <span>Rating</span>
        <span>${escapeHtml(ta.rating)}</span>
      </div>
    </div>

    <div style="margin-bottom:18px;">
      <h3 style="margin:0 0 12px;">Skills</h3>
      <div class="tag-list">
        ${ta.skills.map(skill => `<span class="tag">${escapeHtml(skill)}</span>`).join("")}
      </div>
    </div>

    <div style="margin-bottom:18px;">
      <h3 style="margin:0 0 12px;">Summary</h3>
      <p style="margin:0;color:var(--text-soft);line-height:1.85;">${escapeHtml(ta.summary)}</p>
    </div>

    <div>
      <h3 style="margin:0 0 12px;">Recent Tasks</h3>
      <div class="log-list">
        ${ta.recentTasks.map(task => `
          <div class="log-item">
            <p class="log-body">${escapeHtml(task)}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `;

    const header = els.taDetailModalOverlay.querySelector(".modal-header h2");
    if (header) header.textContent = "Teaching Assistant Details";

    els.taDetailModalOverlay.classList.remove("hidden");
}

function closeTADetailModal() {
    state.selectedTA = null;
    els.taDetailModalOverlay.classList.add("hidden");
}

function openStatsModal() {
    els.statsModalBody.innerHTML = `
    <div class="metrics-grid" style="margin-bottom:20px;">
      <div class="metric-card">
        <strong>${escapeHtml(state.stats.totalUsers)}</strong>
        <span>Total Users</span>
      </div>
      <div class="metric-card">
        <strong>${escapeHtml(state.stats.totalTAs)}</strong>
        <span>Total TAs</span>
      </div>
      <div class="metric-card">
        <strong>${escapeHtml(state.stats.totalMOs)}</strong>
        <span>Total MOs</span>
      </div>
      <div class="metric-card">
        <strong>${escapeHtml(state.stats.totalPosts)}</strong>
        <span>Total Posts</span>
      </div>
      <div class="metric-card">
        <strong>${escapeHtml(state.stats.totalApplications)}</strong>
        <span>Total Applications</span>
      </div>
      <div class="metric-card">
        <strong>${escapeHtml(state.stats.pendingPostReviews)}</strong>
        <span>Pending Post Reviews</span>
      </div>
      <div class="metric-card">
        <strong>${escapeHtml(state.stats.pendingRoleRequests)}</strong>
        <span>Pending Role Requests</span>
      </div>
      <div class="metric-card">
        <strong>${escapeHtml(state.stats.activeLogsToday)}</strong>
        <span>Logs Today</span>
      </div>
    </div>

    <div class="table-card">
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Current Value</th>
              <th>Status</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>User Growth</td>
              <td>${escapeHtml(state.stats.totalUsers)}</td>
              <td><span class="badge badge-success">Stable</span></td>
              <td>整体注册用户规模稳定增长</td>
            </tr>
            <tr>
              <td>Post Review Queue</td>
              <td>${escapeHtml(state.stats.pendingPostReviews)}</td>
              <td><span class="badge badge-warning">Attention</span></td>
              <td>仍有岗位等待管理员处理</td>
            </tr>
            <tr>
              <td>Role Change Requests</td>
              <td>${escapeHtml(state.stats.pendingRoleRequests)}</td>
              <td><span class="badge badge-warning">Pending</span></td>
              <td>存在待处理权限申请</td>
            </tr>
            <tr>
              <td>System Activity</td>
              <td>${escapeHtml(state.stats.activeLogsToday)}</td>
              <td><span class="badge badge-success">Healthy</span></td>
              <td>今日系统事件记录正常</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

    els.statsModalOverlay.classList.remove("hidden");
}

function closeStatsModal() {
    els.statsModalOverlay.classList.add("hidden");
}

// 已实现后端接口连接
async function openUsersModal() {
    await loadAllUsers();

    els.usersModalBody.innerHTML = `
    <div class="section-header">
      <div class="section-title-block">
        <h3>All System Users</h3>
        <p>查看用户角色、状态并进入详情页。数据来自后端接口。</p>
      </div>
    </div>

    <div class="table-card">
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Real Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.backendUsers.length > 0 ? state.backendUsers.map(user => {
        const roleText = user.userType === 1 ? "TA" : user.userType === 2 ? "MO" : user.userType === 3 ? "Admin" : "Unknown";
        return `
              <tr>
                <td>${escapeHtml(user.userId)}</td>
                <td>${escapeHtml(user.username)}</td>
                <td>${escapeHtml(user.realName || "-")}</td>
                <td><span class="badge badge-soft">${escapeHtml(roleText)}</span></td>
                <td>${escapeHtml(user.email || "-")}</td>
                <td>
                  <div class="row-actions">
                    <button class="btn btn-soft open-user-detail-btn" type="button" data-user-id="${user.userId}">
                      ${Icons.eye} View
                    </button>
                    <button class="btn btn-danger delete-user-btn" type="button" data-user-id="${user.userId}">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            `}).join("") : `
              <tr>
                <td colspan="6" style="text-align:center;padding:30px;">暂无用户数据</td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;

    els.usersModalOverlay.classList.remove("hidden");

    const detailBtns = els.usersModalBody.querySelectorAll(".open-user-detail-btn");
    detailBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const userId = btn.dataset.userId;
            openUserDetailModal(userId);
        });
    });

    const deleteBtns = els.usersModalBody.querySelectorAll(".delete-user-btn");
    deleteBtns.forEach(btn => {
        btn.addEventListener("click", async () => {
            const userId = btn.dataset.userId;
            await deleteUser(userId);
            await openUsersModal();
        });
    });
}

function closeUsersModal() {
    els.usersModalOverlay.classList.add("hidden");
}

// 已实现后端接口连接
async function openUserDetailModal(userId) {
    let user = state.backendUsers.find(item => String(item.userId) === String(userId));
    if (!user) {
        // 如果本地找不到，从后端获取
        const userData = await loadUserDetail(userId);
        if (!userData) return;
        user = userData;
    }

    state.selectedUser = user;
    const roleText = user.userType === 1 ? "TA" : user.userType === 2 ? "MO" : user.userType === 3 ? "Admin" : "Unknown";

    els.userDetailModalBody.innerHTML = `
    <div class="user-profile-block">
      <div class="user-avatar-xl">${escapeHtml(getInitials(user.realName || user.username))}</div>
      <div class="user-identity">
        <h3>${escapeHtml(user.realName || "-")}</h3>
        <p>@${escapeHtml(user.username)} · ${escapeHtml(roleText)}</p>
      </div>
    </div>

    <div class="detail-grid">
      <div class="detail-row">
        <span>User ID</span>
        <span>${escapeHtml(user.userId)}</span>
      </div>
      <div class="detail-row">
        <span>Username</span>
        <span>${escapeHtml(user.username)}</span>
      </div>
      <div class="detail-row">
        <span>Email</span>
        <span>${escapeHtml(user.email || "-")}</span>
      </div>
      <div class="detail-row">
        <span>Role</span>
        <span>${escapeHtml(roleText)}</span>
      </div>
    </div>
  `;

    els.userDetailModalOverlay.classList.remove("hidden");
}

function closeUserDetailModal() {
    state.selectedUser = null;
    els.userDetailModalOverlay.classList.add("hidden");
}

// 已实现后端接口连接
async function openPostPreview(postId) {
    const r = await request(`/job?action=getDetail&jobId=${encodeURIComponent(postId)}`);

    if (r.ok && r.data && r.data.code === 200) {
        const detail = r.data.data || {};

        els.taDetailModalBody.innerHTML = `
      <div class="detail-grid" style="margin-bottom:18px;">
        <div class="detail-row">
          <span>Post Title</span>
          <span>${escapeHtml(detail.jobName || "未命名岗位")}</span>
        </div>
        <div class="detail-row">
          <span>Publisher</span>
          <span>${escapeHtml(detail.publisherName || detail.moName || "课程负责人")}</span>
        </div>
        <div class="detail-row">
          <span>Type</span>
          <span>${detail.jobType === 1 ? "助教" : "助理"}</span>
        </div>
        <div class="detail-row">
          <span>Module</span>
          <span>${escapeHtml(detail.belongModule || "未分类")}</span>
        </div>
        <div class="detail-row">
          <span>Weekly Hours</span>
          <span>${escapeHtml(detail.workHoursWeekly || 0)}</span>
        </div>
        <div class="detail-row">
          <span>Deadline</span>
          <span>${escapeHtml(detail.applyDeadline || "")}</span>
        </div>
      </div>

      <div>
        <h3 style="margin:0 0 12px;">Description</h3>
        <p style="margin:0;color:var(--text-soft);line-height:1.85;">${escapeHtml(detail.jobDesc || "暂无岗位描述")}</p>
      </div>
    `;

        const header = els.taDetailModalOverlay.querySelector(".modal-header h2");
        if (header) header.textContent = "Post Preview";

        els.taDetailModalOverlay.classList.remove("hidden");
        return;
    }

    showError((r.data && r.data.msg) || r.error || "获取岗位详情失败");
}

// 已实现后端接口连接
async function openPostApplicantsModal(jobId) {
    const r = await request(`/application?action=listByJob&jobId=${encodeURIComponent(jobId)}`);

    if (r.ok && r.data && r.data.code === 200) {
        const apps = Array.isArray(r.data.data) ? r.data.data : [];
        state.selectedJobApplicants = apps;

        els.taDetailModalBody.innerHTML = `
      <div class="section-header">
        <div class="section-title-block">
          <h3>Applicants of Job ${escapeHtml(jobId)}</h3>
          <p>查看该岗位的申请记录，并执行通过或拒绝。</p>
        </div>
      </div>

      ${
            apps.length > 0
                ? `
            <div class="table-card">
              <div class="data-table-wrap">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Application ID</th>
                      <th>TA ID</th>
                      <th>Status</th>
                      <th>Job ID</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${apps.map(app => `
                      <tr>
                        <td>${escapeHtml(app.applicationId)}</td>
                        <td>${escapeHtml(app.taId)}</td>
                        <td>
                          <span class="badge ${
                    String(app.status).toLowerCase().includes("pass") || String(app.status).includes("通过")
                        ? "badge-success"
                        : String(app.status).toLowerCase().includes("reject") || String(app.status).includes("拒绝")
                            ? "badge-danger"
                            : "badge-warning"
                }">${escapeHtml(app.status || "pending")}</span>
                        </td>
                        <td>${escapeHtml(app.jobId)}</td>
                        <td>
                          <div class="row-actions">
                            <button class="btn btn-primary audit-pass-btn" type="button" data-application-id="${escapeHtml(app.applicationId)}" data-job-id="${escapeHtml(app.jobId)}">
                              Approve
                            </button>
                            <button class="btn btn-danger audit-reject-btn" type="button" data-application-id="${escapeHtml(app.applicationId)}" data-job-id="${escapeHtml(app.jobId)}">
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            </div>
          `
                : `
            <div class="empty-state">
              <strong>No applicants yet.</strong>
              <span>This job currently has no application records.</span>
            </div>
          `
        }
    `;

        const header = els.taDetailModalOverlay.querySelector(".modal-header h2");
        if (header) header.textContent = "Applicants";

        els.taDetailModalOverlay.classList.remove("hidden");

        const passBtns = els.taDetailModalBody.querySelectorAll(".audit-pass-btn");
        const rejectBtns = els.taDetailModalBody.querySelectorAll(".audit-reject-btn");

        passBtns.forEach(btn => {
            btn.addEventListener("click", async () => {
                await auditApplication(btn.dataset.applicationId, 1, "通过", btn.dataset.jobId);
            });
        });

        rejectBtns.forEach(btn => {
            btn.addEventListener("click", async () => {
                await auditApplication(btn.dataset.applicationId, 2, "拒绝", btn.dataset.jobId);
            });
        });

        return;
    }

    showError((r.data && r.data.msg) || r.error || "加载申请人列表失败");
}

// 未实现后端接口连接：示例接口文档中没有管理员驳回岗位接口，先保留前端演示逻辑
function openRejectPostModal(postId, moId) {
    const post = getPostByIds(postId, moId);
    if (!post) return;

    state.selectedPost = { postId, moId, post };
    state.rejectReason = "";
    els.rejectReasonInput.value = "";
    els.rejectPostModalOverlay.classList.remove("hidden");
}

// 未实现后端接口连接：示例接口文档中没有管理员驳回岗位接口，先保留前端演示逻辑
function closeRejectPostModal() {
    state.selectedPost = null;
    state.rejectReason = "";
    els.rejectReasonInput.value = "";
    els.rejectPostModalOverlay.classList.add("hidden");
}

// 未实现后端接口连接：示例接口文档中没有管理员驳回岗位接口，先保留前端演示逻辑
function confirmRejectPost() {
    if (!state.selectedPost) return;

    const reason = els.rejectReasonInput.value.trim();
    if (!reason) {
        alert("Please enter a rejection reason.");
        return;
    }

    const { postId, moId } = state.selectedPost;
    const post = getPostByIds(postId, moId);
    if (!post) return;

    post.status = "rejected";

    state.logs.unshift({
        id: Date.now(),
        type: "post_review",
        title: "Post Rejected",
        actor: state.currentAdmin.name,
        time: new Date().toLocaleString("zh-CN"),
        detail: `Rejected post '${post.jobName || post.title}' with reason: ${reason}`
    });

    closeRejectPostModal();
    render();
}

// 已实现后端接口连接
async function auditApplication(applicationId, auditStatus, remark, jobId) {
    const params = new URLSearchParams();
    params.append("applicationId", applicationId);
    params.append("auditStatus", auditStatus);
    params.append("remark", remark);

    const r = await request("/application?action=audit", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    if (r.ok && r.data && r.data.code === 200) {
        alert(r.data.msg || "审核成功");

        state.logs.unshift({
            id: Date.now(),
            type: "audit",
            title: auditStatus === 1 ? "Application Approved" : "Application Rejected",
            actor: state.currentAdmin.name,
            time: new Date().toLocaleString("zh-CN"),
            detail: `Application ${applicationId} for job ${jobId} was ${auditStatus === 1 ? "approved" : "rejected"}.`
        });

        await openPostApplicantsModal(jobId);
        renderRequestDot();
        return;
    }

    showError((r.data && r.data.msg) || r.error || "审核失败");
}

// 未实现后端接口连接：示例接口文档中没有管理员角色申请通知接口，先保留前端演示逻辑
function openRequestsModal() {
    els.requestsModalBody.innerHTML = `
    <div class="log-list">
      ${
        state.roleRequests.length > 0
            ? state.roleRequests.map(req => `
              <article class="log-item">
                <div class="log-item-header">
                  <h3 class="log-title">${escapeHtml(req.realName)} · ${escapeHtml(req.currentRole)} → ${escapeHtml(req.targetRole)}</h3>
                  <span class="badge ${
                req.status === "pending"
                    ? "badge-warning"
                    : req.status === "approved"
                        ? "badge-success"
                        : "badge-danger"
            }">${escapeHtml(req.status)}</span>
                </div>

                <div class="log-meta">@${escapeHtml(req.username)} · ${escapeHtml(req.submittedAt)}</div>
                <p class="log-body">${escapeHtml(req.reason)}</p>

                ${
                req.status === "pending"
                    ? `
                      <div class="inline-actions" style="margin-top:14px;">
                        <button class="btn btn-primary approve-request-btn" type="button" data-request-id="${req.id}">
                          ${Icons.approve} Approve
                        </button>
                        <button class="btn btn-danger reject-request-btn" type="button" data-request-id="${req.id}">
                          ${Icons.reject} Reject
                        </button>
                      </div>
                    `
                    : ""
            }
              </article>
            `).join("")
            : `
            <div class="empty-state">
              <strong>No role change requests.</strong>
              <span>New requests will appear here.</span>
            </div>
          `
    }
    </div>
  `;

    els.requestsModalOverlay.classList.remove("hidden");

    const approveBtns = els.requestsModalBody.querySelectorAll(".approve-request-btn");
    const rejectBtns = els.requestsModalBody.querySelectorAll(".reject-request-btn");

    approveBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            handleRoleRequest(Number(btn.dataset.requestId), "approved");
        });
    });

    rejectBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            handleRoleRequest(Number(btn.dataset.requestId), "rejected");
        });
    });
}

// 未实现后端接口连接：示例接口文档中没有管理员角色申请通知接口，先保留前端演示逻辑
function closeRequestsModal() {
    els.requestsModalOverlay.classList.add("hidden");
}

// 未实现后端接口连接：示例接口文档中没有管理员角色申请通知接口，先保留前端演示逻辑
function handleRoleRequest(id, nextStatus) {
    const req = state.roleRequests.find(item => item.id === id);
    if (!req) return;

    req.status = nextStatus;

    state.logs.unshift({
        id: Date.now(),
        type: "role_change",
        title: `Role Change Request ${nextStatus === "approved" ? "Approved" : "Rejected"}`,
        actor: state.currentAdmin.name,
        time: new Date().toLocaleString("zh-CN"),
        detail: `${req.realName}'s request from ${req.currentRole} to ${req.targetRole} was ${nextStatus}.`
    });

    if (nextStatus === "approved") {
        const user = state.backendUsers.find(item => item.username === req.username);
        if (user) user.userType = req.targetRole === "TA" ? 1 : req.targetRole === "MO" ? 2 : 3;
    }

    renderRequestDot();
    openRequestsModal();
}

// 已实现后端接口连接 - 加载所有岗位弹窗
async function openAllJobsModal() {
    await loadAllJobs();

    els.allJobsModalBody.innerHTML = `
    <div class="section-header">
      <div class="section-title-block">
        <h3>All Jobs Management</h3>
        <p>查看所有岗位并可执行删除操作。岗位数据来自后端接口。</p>
      </div>
    </div>

    <div class="table-card">
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Job Name</th>
              <th>Publisher MO ID</th>
              <th>Recruit Num</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.backendJobsList.length > 0 ? state.backendJobsList.map(job => {
        const statusText = job.jobStatus === 0 ? "招聘中" : job.jobStatus === 1 ? "已截止" : job.jobStatus === 2 ? "已招满" : job.jobStatus === 3 ? "已关闭" : "未知";
        const statusClass = job.jobStatus === 0 ? "badge-success" : job.jobStatus === 1 ? "badge-warning" : job.jobStatus === 2 ? "badge-danger" : "badge-soft";
        return `
              <tr>
                <td>${escapeHtml(job.jobId)}</td>
                <td>${escapeHtml(job.jobName)}</td>
                <td>${escapeHtml(job.publisherMoId)}</td>
                <td>${escapeHtml(job.recruitNum)}</td>
                <td><span class="badge ${statusClass}">${escapeHtml(statusText)}</span></td>
                <td>
                  <div class="row-actions">
                    <button class="btn btn-danger delete-job-btn" type="button" data-job-id="${job.jobId}">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            `}).join("") : `
              <tr>
                <td colspan="6" style="text-align:center;padding:30px;">暂无岗位数据</td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;

    els.allJobsModalOverlay.classList.remove("hidden");

    const deleteBtns = els.allJobsModalBody.querySelectorAll(".delete-job-btn");
    deleteBtns.forEach(btn => {
        btn.addEventListener("click", async () => {
            const jobId = btn.dataset.jobId;
            await deleteJob(jobId);
            await openAllJobsModal();
        });
    });
}

function closeAllJobsModal() {
    els.allJobsModalOverlay.classList.add("hidden");
}

// 已实现后端接口连接 - 用户查询弹窗
function openUserQueryModal() {
    els.queryUserIdInput.value = "";
    els.userQueryResult.innerHTML = "";
    els.userQueryModalOverlay.classList.remove("hidden");
}

function closeUserQueryModal() {
    els.userQueryModalOverlay.classList.add("hidden");
}

// 已实现后端接口连接 - 执行用户查询
async function confirmQueryUser() {
    const userId = els.queryUserIdInput.value.trim();
    if (!userId) {
        alert("请输入用户ID");
        return;
    }

    els.userQueryResult.innerHTML = '<p style="color:var(--text-soft);">Loading...</p>';

    const userData = await loadUserDetail(userId);
    if (userData) {
        const roleText = userData.userType === 1 ? "TA" : userData.userType === 2 ? "MO" : userData.userType === 3 ? "Admin" : "未知";
        els.userQueryResult.innerHTML = `
        <div class="detail-row">
          <span>User ID</span>
          <span>${escapeHtml(userData.userId || userId)}</span>
        </div>
        <div class="detail-row">
          <span>Username</span>
          <span>${escapeHtml(userData.username || "-")}</span>
        </div>
        <div class="detail-row">
          <span>Real Name</span>
          <span>${escapeHtml(userData.realName || "-")}</span>
        </div>
        <div class="detail-row">
          <span>Email</span>
          <span>${escapeHtml(userData.email || "-")}</span>
        </div>
        <div class="detail-row">
          <span>User Type</span>
          <span>${escapeHtml(roleText)}</span>
        </div>
      `;
    } else {
        els.userQueryResult.innerHTML = '<p style="color:var(--danger);">获取用户详情失败，请检查用户ID是否正确。</p>';
    }
}

function bindModalEvents() {
    const closeTaDetailModalBtn = document.getElementById("closeTaDetailModalBtn");
    const closeStatsModalBtn = document.getElementById("closeStatsModalBtn");
    const closeUsersModalBtn = document.getElementById("closeUsersModalBtn");
    const closeUserDetailModalBtn = document.getElementById("closeUserDetailModalBtn");
    const closeRejectPostModalBtn = document.getElementById("closeRejectPostModalBtn");
    const cancelRejectPostBtn = document.getElementById("cancelRejectPostBtn");
    const confirmRejectPostBtn = document.getElementById("confirmRejectPostBtn");
    const closeRequestsModalBtn = document.getElementById("closeRequestsModalBtn");
    const closeAllJobsModalBtn = document.getElementById("closeAllJobsModalBtn");
    const closeUserQueryModalBtn = document.getElementById("closeUserQueryModalBtn");
    const confirmQueryUserBtn = document.getElementById("confirmQueryUserBtn");

    if (closeTaDetailModalBtn) {
        closeTaDetailModalBtn.addEventListener("click", closeTADetailModal);
    }

    if (closeStatsModalBtn) {
        closeStatsModalBtn.addEventListener("click", closeStatsModal);
    }

    if (closeUsersModalBtn) {
        closeUsersModalBtn.addEventListener("click", closeUsersModal);
    }

    if (closeUserDetailModalBtn) {
        closeUserDetailModalBtn.addEventListener("click", closeUserDetailModal);
    }

    if (closeRejectPostModalBtn) {
        closeRejectPostModalBtn.addEventListener("click", closeRejectPostModal);
    }

    if (cancelRejectPostBtn) {
        cancelRejectPostBtn.addEventListener("click", closeRejectPostModal);
    }

    if (confirmRejectPostBtn) {
        confirmRejectPostBtn.addEventListener("click", confirmRejectPost);
    }

    if (closeRequestsModalBtn) {
        closeRequestsModalBtn.addEventListener("click", closeRequestsModal);
    }

    if (closeAllJobsModalBtn) {
        closeAllJobsModalBtn.addEventListener("click", closeAllJobsModal);
    }

    if (closeUserQueryModalBtn) {
        closeUserQueryModalBtn.addEventListener("click", closeUserQueryModal);
    }

    if (confirmQueryUserBtn) {
        confirmQueryUserBtn.addEventListener("click", confirmQueryUser);
    }

    if (els.openRequestsBtn) {
        els.openRequestsBtn.addEventListener("click", openRequestsModal);
    }

    if (els.rejectReasonInput) {
        els.rejectReasonInput.addEventListener("input", e => {
            state.rejectReason = e.target.value;
        });
    }

    [
        [els.taDetailModalOverlay, closeTADetailModal],
        [els.statsModalOverlay, closeStatsModal],
        [els.usersModalOverlay, closeUsersModal],
        [els.userDetailModalOverlay, closeUserDetailModal],
        [els.rejectPostModalOverlay, closeRejectPostModal],
        [els.requestsModalOverlay, closeRequestsModal],
        [els.allJobsModalOverlay, closeAllJobsModal],
        [els.userQueryModalOverlay, closeUserQueryModal]
    ].forEach(([overlay, closer]) => {
        if (!overlay) return;
        overlay.addEventListener("click", e => {
            if (e.target === overlay) closer();
        });
    });

    document.addEventListener("keydown", e => {
        if (e.key !== "Escape") return;

        if (!els.taDetailModalOverlay.classList.contains("hidden")) closeTADetailModal();
        if (!els.statsModalOverlay.classList.contains("hidden")) closeStatsModal();
        if (!els.usersModalOverlay.classList.contains("hidden")) closeUsersModal();
        if (!els.userDetailModalOverlay.classList.contains("hidden")) closeUserDetailModal();
        if (!els.rejectPostModalOverlay.classList.contains("hidden")) closeRejectPostModal();
        if (!els.requestsModalOverlay.classList.contains("hidden")) closeRequestsModal();
        if (!els.allJobsModalOverlay.classList.contains("hidden")) closeAllJobsModal();
        if (!els.userQueryModalOverlay.classList.contains("hidden")) closeUserQueryModal();
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    cacheElements();
    bindModalEvents();

    const ok = await loadLoginUser(); // 已实现后端接口连接
    if (!ok) return;

    // 已实现后端接口连接 - 先加载岗位数据，再加载用户数据
    // 原因：loadAllUsers()内部需要使用backendJobsList来统计MO发布的岗位数量
    await loadAllJobs(); // 先加载岗位列表
    await Promise.all([
        loadAllUsers(), // 用户列表加载时会构建moWorkloads和taWorkloads
        loadOpenJobs()  // 开放岗位列表
    ]);
    render();
});
