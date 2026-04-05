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

    stats: {
        totalUsers: 248,
        totalTAs: 126,
        totalMOs: 32,
        totalPosts: 57,
        totalApplications: 391,
        pendingPostReviews: 8,
        pendingRoleRequests: 3,
        activeLogsToday: 84
    },

    roleRequests: [
        {
            id: 1,
            username: "alice.zhang",
            realName: "Alice Zhang",
            currentRole: "TA",
            targetRole: "MO",
            reason: "希望参与课程组织与岗位发布管理，已长期协助课程答疑。",
            submittedAt: "2026-04-03 14:25",
            status: "pending"
        },
        {
            id: 2,
            username: "kevin.lee",
            realName: "Kevin Lee",
            currentRole: "TA",
            targetRole: "MO",
            reason: "希望承担课程协作管理任务，并辅助教师组织实验安排。",
            submittedAt: "2026-04-04 09:12",
            status: "pending"
        },
        {
            id: 3,
            username: "mia.sun",
            realName: "Mia Sun",
            currentRole: "MO",
            targetRole: "Admin",
            reason: "已负责多个课程岗位流转，希望拥有更高层级管理权限。",
            submittedAt: "2026-04-05 18:40",
            status: "pending"
        }
    ],

    systemUsers: [
        {
            id: 1,
            username: "admin01",
            realName: "System Admin",
            email: "admin@ta-market.edu",
            role: "Admin",
            status: "active",
            createdAt: "2026-01-10",
            major: "System Control",
            notes: "核心系统管理员"
        },
        {
            id: 2,
            username: "li.mo",
            realName: "Prof. Li",
            email: "li.mo@ta-market.edu",
            role: "MO",
            status: "active",
            createdAt: "2026-02-02",
            major: "Software Engineering",
            notes: "负责软件工程课程岗位管理"
        },
        {
            id: 3,
            username: "wang.mo",
            realName: "Prof. Wang",
            email: "wang.mo@ta-market.edu",
            role: "MO",
            status: "active",
            createdAt: "2026-02-12",
            major: "Artificial Intelligence",
            notes: "负责 AI 课程岗位管理"
        },
        {
            id: 4,
            username: "alex.ta",
            realName: "Alex Chen",
            email: "alex.ta@ta-market.edu",
            role: "TA",
            status: "active",
            createdAt: "2026-02-28",
            major: "Computer Science",
            notes: "表现稳定，已多次参与课程辅助"
        },
        {
            id: 5,
            username: "jessica.ta",
            realName: "Jessica Lin",
            email: "jessica.ta@ta-market.edu",
            role: "TA",
            status: "suspended",
            createdAt: "2026-03-05",
            major: "Data Science",
            notes: "因多次未响应任务暂时冻结"
        }
    ],

    taWorkloads: [
        {
            id: 101,
            name: "Alex Chen",
            username: "alex.ta",
            course: "SE301: 软件工程",
            hours: 11,
            taskCount: 6,
            status: "healthy",
            rating: 4.8,
            skills: ["Java", "Grading", "Office Hours"],
            summary: "负责课程答疑、作业批改与实验辅导，整体负载稳定。",
            recentTasks: [
                "完成第 4 周作业批改",
                "线下答疑 2 次",
                "更新实验说明文档"
            ]
        },
        {
            id: 102,
            name: "Jessica Lin",
            username: "jessica.ta",
            course: "AI202: 人工智能导论",
            hours: 17,
            taskCount: 9,
            status: "warning",
            rating: 4.2,
            skills: ["Python", "ML", "Experiment Support"],
            summary: "当前任务较重，最近有部分处理延迟，需要关注。",
            recentTasks: [
                "实验课支持",
                "批改实验报告",
                "整理模型测试样例"
            ]
        },
        {
            id: 103,
            name: "Ryan Zhou",
            username: "ryan.ta",
            course: "DB204: 数据库系统",
            hours: 8,
            taskCount: 4,
            status: "healthy",
            rating: 4.6,
            skills: ["SQL", "DB Lab", "Tutoring"],
            summary: "负载正常，实验课支持情况良好。",
            recentTasks: [
                "实验讲解",
                "处理 SQL 提问",
                "整理实验数据"
            ]
        },
        {
            id: 104,
            name: "Nina Wu",
            username: "nina.ta",
            course: "NW210: 计算机网络",
            hours: 19,
            taskCount: 10,
            status: "critical",
            rating: 3.9,
            skills: ["Network", "Lab Support", "Debugging"],
            summary: "当前工作量偏高，且有多个待处理事项，建议调整分配。",
            recentTasks: [
                "实验环境排查",
                "网络抓包讲解",
                "课后答疑积压"
            ]
        }
    ],

    moWorkloads: [],

    logs: [
        {
            id: 1,
            type: "post_review",
            title: "Post Review Triggered",
            actor: "admin01",
            time: "2026-04-06 09:20",
            detail: "Reviewed pending post 'SE301 Lab Assistant'."
        },
        {
            id: 2,
            type: "role_change",
            title: "Role Change Request Submitted",
            actor: "alice.zhang",
            time: "2026-04-05 18:20",
            detail: "Requested role change from TA to MO."
        },
        {
            id: 3,
            type: "audit",
            title: "Application Audit Completed",
            actor: "li.mo",
            time: "2026-04-05 16:45",
            detail: "Approved application #3382 for SE301 assignment support."
        },
        {
            id: 4,
            type: "system",
            title: "Daily Data Snapshot",
            actor: "system",
            time: "2026-04-05 03:00",
            detail: "Generated daily metrics snapshot for dashboard report."
        }
    ]
};

const els = {};

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

// 已实现后端接口连接
async function loadOpenJobs() {
    const r = await request("/job?action=listOpen");
    if (r.ok && r.data && r.data.code === 200) {
        const jobs = Array.isArray(r.data.data) ? r.data.data : [];
        state.backendJobs = jobs.map(mapJobForAdmin);

        state.moWorkloads = [
            {
                id: 999001,
                name: "Open Jobs Pool",
                username: "system.open.jobs",
                course: "All Courses",
                publishedPosts: state.backendJobs.length,
                pendingReviews: 0,
                status: "stable",
                summary: "这里展示的是当前后端返回的开放岗位列表，供管理员查看详情与申请情况。",
                recentPosts: state.backendJobs
            }
        ];

        render();
        return;
    }

    state.backendJobs = [];
    state.moWorkloads = [];
    render();
    showError((r.data && r.data.msg) || r.error || "加载岗位列表失败");
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
            item.course.toLowerCase().includes(state.filters.moSearch.toLowerCase()) ||
            (item.recentPosts || []).some(post =>
                String(post.title || "").toLowerCase().includes(state.filters.moSearch.toLowerCase()) ||
                String(post.publisherName || "").toLowerCase().includes(state.filters.moSearch.toLowerCase())
            );

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
        <span class="badge badge-soft">Local Demo</span>
      </div>
      <h2 class="action-title">Statistics Report</h2>
      <p class="action-subtitle">
        查看平台用户、岗位、申请和待处理事项的统计概览。当前统计仍为前端保留逻辑。
      </p>
      <div class="action-button-row">
        <button class="btn btn-primary action-btn" id="openStatsBtn" type="button">
          View Report
        </button>
      </div>
    </article>

    <article class="action-card purple">
      <div class="action-top">
        <div class="action-icon">${Icons.users}</div>
        <span class="badge badge-soft">Local Demo</span>
      </div>
      <h2 class="action-title">System Users</h2>
      <p class="action-subtitle">
        管理全平台用户，查看其角色、状态与基础信息。当前用户列表仍为前端保留逻辑。
      </p>
      <div class="action-button-row">
        <button class="btn btn-primary action-btn" id="openUsersBtn" type="button">
          Manage Users
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
        <h2>TA Workload Monitoring</h2>
        <p>当前 TA 工作负载部分仍保留前端演示数据，因为示例接口未提供全站 TA 负载接口。</p>
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
                    ${Icons.eye} View Details
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
        <h2>Open Jobs Monitoring</h2>
        <p>查看后端当前开放岗位，并进入详情与申请列表。</p>
      </div>

      <div class="toolbar-row" style="margin:0;">
        <div class="search-box">
          ${Icons.search}
          <input id="moSearchInput" type="text" placeholder="Search Job..." value="${escapeHtml(state.filters.moSearch)}" />
        </div>

        <div class="filter-chips">
          <button class="filter-chip ${state.filters.moStatus === "all" ? "active" : ""}" data-mo-status="all" type="button">All</button>
          <button class="filter-chip ${state.filters.moStatus === "stable" ? "active" : ""}" data-mo-status="stable" type="button">Open</button>
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
                  <span class="badge badge-success">open</span>
                </div>

                <p class="workload-desc">${escapeHtml(item.summary)}</p>

                <div class="workload-sub" style="margin-bottom:16px;">
                  <span class="badge badge-soft">Open Posts: ${escapeHtml(item.publishedPosts)}</span>
                </div>

                <div class="table-card">
                  <div class="data-table-wrap">
                    <table class="data-table">
                      <thead>
                        <tr>
                          <th>Post</th>
                          <th>Publisher</th>
                          <th>Hours</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${item.recentPosts.map(post => `
                          <tr>
                            <td>${escapeHtml(post.title)}</td>
                            <td>${escapeHtml(post.publisherName)}</td>
                            <td>${escapeHtml(post.workHoursWeekly)}</td>
                            <td>
                              <div class="row-actions">
                                <button class="btn btn-soft open-post-view-btn" type="button" data-post-id="${post.id}" data-mo-id="${item.id}">
                                  View
                                </button>
                                <button class="btn btn-primary open-post-applicants-btn" type="button" data-post-id="${post.id}">
                                  Applicants
                                </button>
                              </div>
                            </td>
                          </tr>
                        `).join("")}
                      </tbody>
                    </table>
                  </div>
                </div>
              </article>
            `).join("")
            : `
            <div class="empty-state">
              <strong>No job records matched.</strong>
              <span>Try adjusting your search filter.</span>
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
        <p>当前日志列表仍为前端保留逻辑，因为示例接口未提供管理员日志查询接口。</p>
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

    els.taDetailModalBody = document.getElementById("taDetailModalBody");
    els.statsModalBody = document.getElementById("statsModalBody");
    els.usersModalBody = document.getElementById("usersModalBody");
    els.userDetailModalBody = document.getElementById("userDetailModalBody");
    els.requestsModalBody = document.getElementById("requestsModalBody");

    els.rejectReasonInput = document.getElementById("rejectReasonInput");
}

function bindPageEvents() {
    const openStatsBtn = document.getElementById("openStatsBtn");
    const openUsersBtn = document.getElementById("openUsersBtn");
    const switchBtns = document.querySelectorAll("[data-view]");

    if (openStatsBtn) {
        openStatsBtn.addEventListener("click", openStatsModal);
    }

    if (openUsersBtn) {
        openUsersBtn.addEventListener("click", openUsersModal);
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
            const id = Number(btn.dataset.taId);
            openTADetailModal(id);
        });
    });
}

function bindMOViewEvents() {
    const moSearchInput = document.getElementById("moSearchInput");
    const statusBtns = document.querySelectorAll("[data-mo-status]");
    const viewBtns = document.querySelectorAll(".open-post-view-btn");
    const applicantBtns = document.querySelectorAll(".open-post-applicants-btn");

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
            const postId = Number(btn.dataset.postId);
            await openPostPreview(postId);
        });
    });

    applicantBtns.forEach(btn => {
        btn.addEventListener("click", async () => {
            const postId = Number(btn.dataset.postId);
            await openPostApplicantsModal(postId);
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
    return state.taWorkloads.find(item => item.id === id) || null;
}

function getMOById(id) {
    return state.moWorkloads.find(item => item.id === id) || null;
}

function getPostByIds(postId, moId) {
    const mo = getMOById(moId);
    if (!mo) return null;
    return mo.recentPosts.find(post => post.id === postId) || null;
}

function openTADetailModal(id) {
    const ta = getTAById(id);
    if (!ta) return;

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

function openUsersModal() {
    els.usersModalBody.innerHTML = `
    <div class="section-header">
      <div class="section-title-block">
        <h3>All System Users</h3>
        <p>查看用户角色、状态并进入详情页。当前为前端保留逻辑。</p>
      </div>
    </div>

    <div class="table-card">
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.systemUsers.map(user => `
              <tr>
                <td>${escapeHtml(user.realName)}<br><span style="color:var(--text-faint);font-size:12px;">@${escapeHtml(user.username)}</span></td>
                <td>${escapeHtml(user.email)}</td>
                <td><span class="badge badge-soft">${escapeHtml(user.role)}</span></td>
                <td>
                  <span class="badge ${
        user.status === "active" ? "badge-success" : "badge-danger"
    }">${escapeHtml(user.status)}</span>
                </td>
                <td>${escapeHtml(user.createdAt)}</td>
                <td>
                  <div class="row-actions">
                    <button class="btn btn-soft open-user-detail-btn" type="button" data-user-id="${user.id}">
                      ${Icons.eye} View
                    </button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

    els.usersModalOverlay.classList.remove("hidden");

    const detailBtns = els.usersModalBody.querySelectorAll(".open-user-detail-btn");
    detailBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.userId);
            openUserDetailModal(id);
        });
    });
}

function closeUsersModal() {
    els.usersModalOverlay.classList.add("hidden");
}

function openUserDetailModal(id) {
    const user = state.systemUsers.find(item => item.id === id);
    if (!user) return;

    state.selectedUser = user;

    els.userDetailModalBody.innerHTML = `
    <div class="user-profile-block">
      <div class="user-avatar-xl">${escapeHtml(getInitials(user.realName))}</div>
      <div class="user-identity">
        <h3>${escapeHtml(user.realName)}</h3>
        <p>@${escapeHtml(user.username)} · ${escapeHtml(user.role)}</p>
      </div>
    </div>

    <div class="detail-grid">
      <div class="detail-row">
        <span>Email</span>
        <span>${escapeHtml(user.email)}</span>
      </div>
      <div class="detail-row">
        <span>Status</span>
        <span>${escapeHtml(user.status)}</span>
      </div>
      <div class="detail-row">
        <span>Created At</span>
        <span>${escapeHtml(user.createdAt)}</span>
      </div>
      <div class="detail-row">
        <span>Major / Department</span>
        <span>${escapeHtml(user.major)}</span>
      </div>
      <div class="detail-row">
        <span>Notes</span>
        <span>${escapeHtml(user.notes)}</span>
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
        detail: `Rejected post '${post.title}' with reason: ${reason}`
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
        const user = state.systemUsers.find(item => item.username === req.username);
        if (user) user.role = req.targetRole;
    }

    renderRequestDot();
    openRequestsModal();
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
        [els.requestsModalOverlay, closeRequestsModal]
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
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    cacheElements();
    bindModalEvents();

    const ok = await loadLoginUser(); // 已实现后端接口连接
    if (!ok) return;

    await loadOpenJobs(); // 已实现后端接口连接
    render();
});