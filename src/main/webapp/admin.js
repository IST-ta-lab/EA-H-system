const BASE_URL = "/tapj"; // 已实现后端接口连接

const state = {
    currentView: "mo",

    currentAdmin: {
        name: "Admin User",
        role: "System Administrator",
        email: "admin@ta-market.edu"
    },

    filters: {
        taSearch: "",
        moSearch: "",
        logSearch: "",
        taStatus: "all",
        moStatus: "all",
        logType: "all",
        jobsSearch: ""
    },

    selectedTA: null,
    selectedJobApplicants: [],

    rejectReason: "",

    backendUsers: [],
    backendJobsList: [],
    backendApplications: [],

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

    roleRequests: [],
    taWorkloads: [],
    moWorkloads: [],
    logs: []
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
    els.requestsModalOverlay = document.getElementById("requestsModalOverlay");
    els.allJobsModalOverlay = document.getElementById("allJobsModalOverlay");
    els.jobDetailModalOverlay = document.getElementById("jobDetailModalOverlay");

    els.taDetailModalBody = document.getElementById("taDetailModalBody");
    els.statsModalBody = document.getElementById("statsModalBody");
    els.usersModalBody = document.getElementById("usersModalBody");
    els.userDetailModalBody = document.getElementById("userDetailModalBody");
    els.requestsModalBody = document.getElementById("requestsModalBody");
    els.allJobsModalBody = document.getElementById("allJobsModalBody");
    els.jobDetailModalBody = document.getElementById("jobDetailModalBody");
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
    alert(message || "Request failed");
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

    alert("Not logged in or session expired. Please login again.");
    location.href = "index.html";
    return false;
}

// 修复问题3：加载所有申请记录，用于计算TA工作负荷
async function loadAllApplications() {
    const r = await request("/application?action=listAll");
    if (r.ok && r.data && r.data.code === 200) {
        state.backendApplications = Array.isArray(r.data.data) ? r.data.data : [];
        return state.backendApplications;
    }
    state.backendApplications = [];
    return [];
}

// 计算申请统计数据
function computeApplicationStats() {
    const apps = state.backendApplications || [];
    const total = apps.length;
    const pending = apps.filter(a => a.applyStatus === 0 || a.applyStatus === "0").length;
    const approved = apps.filter(a => a.applyStatus === 1 || a.applyStatus === "1").length;
    const rejected = apps.filter(a => a.applyStatus === 2 || a.applyStatus === "2").length;
    const approvalRate = total > 0 ? ((approved / total) * 100).toFixed(1) : 0;
    
    // 今日申请数
    const today = new Date().toISOString().split('T')[0];
    const todayApps = apps.filter(a => a.applyTime && a.applyTime.startsWith(today));
    
    // 统计每个岗位的申请数
    const jobApplicationCounts = {};
    apps.forEach(a => {
        if (a.jobId) {
            jobApplicationCounts[a.jobId] = (jobApplicationCounts[a.jobId] || 0) + 1;
        }
    });
    
    // 获取申请最热的岗位
    const topJobs = Object.entries(jobApplicationCounts)
        .map(([jobId, count]) => {
            const job = state.backendJobsList.find(j => String(j.jobId) === String(jobId));
            return {
                jobId,
                jobName: job ? job.jobName : `Job #${jobId}`,
                count
            };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    
    return {
        totalApplications: total,
        pendingCount: pending,
        approvedCount: approved,
        rejectedCount: rejected,
        approvalRate: parseFloat(approvalRate),
        todayApplications: todayApps.length,
        topJobsByApplications: topJobs
    };
}

// 计算MO工作量统计数据
function computeMoWorkloadStats() {
    return state.moWorkloads.map(mo => {
        // 该MO发布的岗位收到的所有申请
        const moJobs = state.backendJobsList.filter(j => String(j.publisherMoId) === String(mo.id));
        const moJobIds = moJobs.map(j => String(j.jobId));
        
        const moApps = state.backendApplications.filter(a => 
            moJobIds.includes(String(a.jobId))
        );
        
        const totalApps = moApps.length;
        const pendingApps = moApps.filter(a => a.applyStatus === 0 || a.applyStatus === "0").length;
        const approvedApps = moApps.filter(a => a.applyStatus === 1 || a.applyStatus === "1").length;
        const rejectedApps = moApps.filter(a => a.applyStatus === 2 || a.applyStatus === "2").length;
        const approvalRate = totalApps > 0 ? ((approvedApps / totalApps) * 100).toFixed(1) : 0;
        
        // 工作量等级
        let workloadLevel = "light";
        if (pendingApps >= 5 || totalApps >= 20) {
            workloadLevel = "busy";
        } else if (pendingApps >= 2 || totalApps >= 10) {
            workloadLevel = "normal";
        }
        
        return {
            moId: mo.id,
            moName: mo.name,
            totalPublishedJobs: mo.publishedPosts,
            totalApplications: totalApps,
            pendingApplications: pendingApps,
            approvedApplications: approvedApps,
            rejectedApplications: rejectedApps,
            approvalRate: parseFloat(approvalRate),
            workloadLevel
        };
    });
}

// 模拟日志数据（后端暂无接口）
function generateMockLogs() {
    const actionTypes = ['user_create', 'user_delete', 'job_create', 'job_delete', 'application_audit', 'role_change'];
    const operators = state.backendUsers.filter(u => u.userType === 3).map(u => u.realName || u.username);
    const mockLogs = [];
    
    if (operators.length === 0) {
        mockLogs.push({
            logId: 'log001',
            operatorName: 'Admin',
            actionType: 'user_create',
            targetType: 'USER',
            targetId: 'ta001',
            detail: 'Created new user: Test TA',
            createTime: new Date().toLocaleString('zh-CN')
        });
        return mockLogs;
    }
    
    for (let i = 0; i < 10; i++) {
        const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)];
        const operator = operators[Math.floor(Math.random() * operators.length)];
        const time = new Date(Date.now() - i * 3600000).toLocaleString('zh-CN');
        
        let detail = '';
        switch (actionType) {
            case 'user_create':
                detail = `Created new user: ${['TA', 'MO'][Math.floor(Math.random() * 2)]}`;
                break;
            case 'user_delete':
                detail = 'Deleted user account';
                break;
            case 'job_create':
                detail = 'Published new job posting';
                break;
            case 'job_delete':
                detail = 'Deleted job posting';
                break;
            case 'application_audit':
                detail = Math.random() > 0.5 ? 'Approved application' : 'Rejected application';
                break;
            case 'role_change':
                detail = 'Approved role change request';
                break;
        }
        
        mockLogs.push({
            logId: `log${String(i + 1).padStart(3, '0')}`,
            operatorName: operator,
            actionType,
            targetType: actionType.includes('user') ? 'USER' : actionType.includes('job') ? 'JOB' : 'APPLICATION',
            targetId: `${actionType.includes('user') ? 'user' : actionType.includes('job') ? 'job' : 'app'}${Math.floor(Math.random() * 100)}`,
            detail,
            createTime: time
        });
    }
    
    return mockLogs;
}

// 加载日志数据
// async function loadLogs()

// 已实现后端接口连接 - 加载开放岗位（仅用于后端统计，不直接用于MO视图）
async function loadOpenJobs() {
    const r = await request("/job?action=listOpen");
    if (r.ok && r.data && r.data.code === 200) {
        const jobs = Array.isArray(r.data.data) ? r.data.data : [];
        state.backendJobs = jobs.map(mapJobForAdmin);
        return;
    }

    state.backendJobs = [];
    showError((r.data && r.data.msg) || r.error || "Failed to load job list");
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
                const moJobIds = moJobs.map(j => String(j.jobId));
                
                // 统计该MO收到的申请数
                const moApps = state.backendApplications ? state.backendApplications.filter(a => moJobIds.includes(String(a.jobId))) : [];
                const pendingApps = moApps.filter(a => a.applyStatus === 0 || a.applyStatus === "0").length;
                
                return {
                    id: String(mo.userId), // 统一转换为字符串
                    name: mo.realName || mo.username || "Unnamed MO",
                    username: mo.username || "",
                    email: mo.email || "",
                    course: mo.belongModule || "No Module Assigned",
                    publishedPosts: moJobs.length,
                    openPosts: moJobs.filter(j => j.jobStatus === 0).length,
                    closedPosts: moJobs.filter(j => j.jobStatus !== 0).length,
                    totalApplications: moApps.length,
                    pendingApplications: pendingApps,
                    status: "active",
                    summary: moJobs.length > 0
                        ? `This course organizer has published ${moJobs.length} job(s), with ${moJobs.filter(j => j.jobStatus === 0).length} currently recruiting.`
                        : "This course organizer has not published any jobs yet.",
                    recentPosts: moJobs.slice(0, 5) // 最多显示5个最近的岗位
                };
            });

        // 修复问题3：从用户列表中过滤出TA用户（userType=1），构建TA工作负载视图数据
        // 计算逻辑：TA的工作负荷 = 该TA申请岗位的总工作时间（每周工作时长总和）
        // 实现方式：先通过 /admin?action=getUserDetail&userId=xxx 接口查询用户申请的所有岗位
        // 然后从岗位列表获取每个岗位的时间并累加
        const taUsers = state.backendUsers.filter(u => u.userType === 1); // 只保留TA用户
        state.taWorkloads = [];

        // 对每个TA用户分别调用接口获取申请岗位
        for (const ta of taUsers) {
            // 调用 getUserDetail 接口获取该用户的申请岗位列表
            const userDetail = await loadUserDetail(ta.userId);

            // 从接口返回数据中获取申请记录
            // 正确的字段名是 taApplicationList
            let userApplications = [];

            if (userDetail) {
                userApplications = userDetail.taApplicationList || [];
            }

            let totalWorkHours = 0;
            let recentTasks = [];
            let appliedJobs = [];

            userApplications.forEach(app => {
                const appJobId = app.jobId;
                const relatedJob = state.backendJobsList.find(j =>
                    String(j.jobId) === String(appJobId)
                );
                if (relatedJob) {
                    // 只要找到岗位就添加，不管workHoursWeekly是否为0
                    const workHours = relatedJob.workHoursWeekly || 0;
                    totalWorkHours += parseFloat(workHours) || 0;
                    recentTasks.push(`${relatedJob.jobName || "Unnamed Job"} (${workHours}h/week)`);
                    // 保存完整岗位信息用于详情页展示
                    appliedJobs.push({
                        jobId: relatedJob.jobId,
                        jobName: relatedJob.jobName || "Unnamed Job",
                        workHoursWeekly: workHours,
                        belongModule: relatedJob.belongModule || "N/A",
                        publisherName: relatedJob.publisherName || relatedJob.moName || "N/A",
                        jobDesc: relatedJob.jobDesc || "No description",
                        applicationStatus: app.status || "N/A",
                        recruitNum: relatedJob.recruitNum || 0
                    });
                } else {
                    recentTasks.push(`Job #${appJobId}`);
                    appliedJobs.push({
                        jobId: appJobId,
                        jobName: `Job #${appJobId}`,
                        workHoursWeekly: 0,
                        belongModule: "N/A",
                        publisherName: "N/A",
                        jobDesc: "No description",
                        applicationStatus: app.status || "N/A",
                        recruitNum: 0
                    });
                }
            });

            // 计算工作负荷状态：基于每周工作小时数
            // 假设标准工作上限为20小时
            const maxHours = 20;
            const currentHours = totalWorkHours;
            const workloadRatio = maxHours > 0 ? currentHours / maxHours : 0;

            let workloadStatus;
            // 三个状态：绿色（健康）、黄色（接近上限）、红色（超负荷）
            if (workloadRatio > 1) {
                workloadStatus = "overloaded"; // 红色 - 超负荷
            } else if (workloadRatio >= 0.8) {
                workloadStatus = "near_limit"; // 黄色 - 接近上限
            } else {
                workloadStatus = "healthy"; // 绿色 - 健康
            }

            state.taWorkloads.push({
                id: String(ta.userId), // 统一转换为字符串
                name: ta.realName || ta.username || "Unnamed TA",
                username: ta.username || "",
                course: ta.belongModule || "No Module Assigned",
                email: ta.email || "",
                workloadStatus: workloadStatus, // overloaded (红) / near_limit (黄) / healthy (绿)
                currentHours: currentHours,
                maxHours: maxHours,
                hoursDisplay: `${currentHours}/${maxHours} Hours`,
                summary: userApplications.length > 0
                    ? `This TA has applied for ${userApplications.length} job(s) with a total weekly workload of ${currentHours} hours.`
                    : "This TA has not applied for any jobs yet.",
                skills: ta.skills || [],
                taskCount: String(userApplications.length),
                recentTasks: recentTasks,
                appliedJobs: appliedJobs // 完整的岗位申请详情
            });
        }

        return state.backendUsers;
    }

    showError((r.data && r.data.msg) || r.error || "Failed to load user list");
    return [];
}

// 已实现后端接口连接 - 删除用户（修改：禁止删除其他admin）
async function deleteUser(userId) {
    // 查找要删除的用户
    const userToDelete = state.backendUsers.find(u => String(u.userId) === String(userId));

    // 检查是否是admin用户（userType === 3）
    if (userToDelete && userToDelete.userType === 3) {
        alert("Cannot delete admin users. This operation is not allowed.");
        return;
    }

    if (!confirm("Are you sure you want to delete this user?")) {
        return;
    }

    const r = await request(`/admin?action=deleteUser&userId=${encodeURIComponent(userId)}`, { method: "POST" });
    if (r.ok && r.data && r.data.code === 200) {
        alert(r.data.msg || "Deleted successfully");
        await loadAllUsers();
        await loadAllJobs();
        render();
        return;
    }

    showError((r.data && r.data.msg) || r.error || "Failed to delete user");
}

// 已实现后端接口连接 - 退出登录
async function logout() {
    if (!confirm("Are you sure you want to logout?")) {
        return;
    }

    const r = await request("/user?action=logout", { method: "POST" });
    if (r.ok && r.data && r.data.code === 200) {
        alert(r.data.msg || "Logged out successfully");
        location.href = "index.html";
        return;
    }

    // 即使后端接口失败，也跳转到登录页
    location.href = "index.html";
}

// 已实现后端接口连接 - 加载所有岗位
async function loadAllJobs() {
    const r = await request("/admin?action=listAllJobs");

    if (r.ok && r.data && r.data.code === 200) {
        state.backendJobsList = Array.isArray(r.data.data) ? r.data.data : [];

        state.stats.totalPosts = state.backendJobsList.length;

        return state.backendJobsList;
    }
    showError((r.data && r.data.msg) || r.error || "Failed to load job list");
    return [];
}

// 已实现后端接口连接 - 删除岗位
async function deleteJob(jobId) {
    if (!confirm("Are you sure you want to delete this job? This will also delete all related applications!")) {
        return;
    }

    const r = await request(`/admin?action=deleteJob&jobId=${encodeURIComponent(jobId)}`, { method: "POST" });
    if (r.ok && r.data && r.data.code === 200) {
        alert(r.data.msg || "Deleted successfully");
        // 重新加载岗位和用户数据，确保MO视图中的岗位列表也更新
        await loadAllJobs();
        await loadAllUsers();
        render();
        return;
    }

    showError((r.data && r.data.msg) || r.error || "Failed to delete job");
}

// 已实现后端接口连接 - 加载用户详情
async function loadUserDetail(userId) {
    const r = await request(`/admin?action=getUserDetail&userId=${encodeURIComponent(userId)}`);

    if (r.ok && r.data && r.data.code === 200) {
        return r.data.data;
    }

    showError((r.data && r.data.msg) || r.error || "Failed to get user details");
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

        // 工作负荷状态过滤：all / overloaded / near_limit / healthy / zero
        const matchStatus =
            state.filters.taStatus === "all" ||
            item.workloadStatus === state.filters.taStatus;

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
            item.operatorName.toLowerCase().includes(state.filters.logSearch.toLowerCase()) ||
            item.detail.toLowerCase().includes(state.filters.logSearch.toLowerCase()) ||
            item.targetId.toLowerCase().includes(state.filters.logSearch.toLowerCase());

        const matchType =
            state.filters.logType === "all" ||
            item.actionType.includes(state.filters.logType);

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
        View platform statistics overview including users, jobs, applications and pending items. Statistics are updated in real-time from the backend.
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
        Manage all platform users, view their roles, status and basic information. User data comes from the backend API.
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
        View and manage all published jobs, including job deletion. Job data comes from the backend API.
      </p>
      <div class="action-button-row">
        <button class="btn btn-primary action-btn" id="openAllJobsBtn" type="button">
          Manage Jobs
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
  `;
}

function renderTAView() {
    const items = getFilteredTAWorkloads();

    // 获取工作负荷状态显示文本和样式（修复问题4：只有三个状态，红黄绿）
    const getWorkloadStatusInfo = (status) => {
        switch (status) {
            case "overloaded":
                return { text: "OVERLOADED", class: "badge-danger", color: "var(--danger)" };
            case "near_limit":
                return { text: "Near Limit", class: "badge-warning", color: "var(--warning)" };
            case "healthy":
                return { text: "Healthy", class: "badge-success", color: "var(--success)" };
            default:
                return { text: status, class: "badge-soft", color: "var(--text-faint)" };
        }
    };

    // 计算进度条百分比
    const getProgressPercent = (current, max) => {
        if (max === 0) return 0;
        const percent = (current / max) * 100;
        return Math.min(percent, 100); // 最多100%
    };

    els.monitorContent.innerHTML = `
    <section class="section-header">
      <div class="section-title-block">
        <h2>Teaching Assistant (TA) Workload</h2>
        <p>View all TA users and their workload status. Click the TA name to see detailed information.</p>
      </div>

      <div class="toolbar-row" style="margin:0;justify-content:flex-end;">
        <div class="filter-chips">
          <button class="filter-chip ${state.filters.taStatus === "all" ? "active" : ""}" data-ta-status="all" type="button">All</button>
          <button class="filter-chip ${state.filters.taStatus === "overloaded" ? "active" : ""}" data-ta-status="overloaded" type="button">Overloaded (Red)</button>
          <button class="filter-chip ${state.filters.taStatus === "near_limit" ? "active" : ""}" data-ta-status="near_limit" type="button">Near Limit (Yellow)</button>
          <button class="filter-chip ${state.filters.taStatus === "healthy" ? "active" : ""}" data-ta-status="healthy" type="button">Healthy (Green)</button>
        </div>

        <div class="search-box">
          <span class="search-icon">${Icons.search}</span>
          <input id="taSearchInput" type="text" placeholder="Search TA name..." value="${escapeHtml(state.filters.taSearch)}" />
          <button id="taSearchBtn" class="search-btn" type="button">Search</button>
        </div>
      </div>
    </section>

    <div class="workload-grid">
      ${
        items.length > 0
            ? items.map(item => {
                const statusInfo = getWorkloadStatusInfo(item.workloadStatus);
                const progressPercent = item.currentHours === 0 ? 0 : getProgressPercent(item.currentHours, item.maxHours);
                return `
              <article class="workload-card" data-ta-id="${item.id}">
                <div class="workload-top">
                  <div>
                    <h3 class="workload-title">
                      <a href="#" class="ta-name-link view-ta-detail-btn" data-ta-id="${item.id}" style="color:var(--text);text-decoration:none;">${escapeHtml(item.name)}</a>
                    </h3>
                    <div class="workload-sub">
                      <span class="badge badge-soft">@${escapeHtml(item.username)}</span>
                      <span class="badge badge-soft">${escapeHtml(item.course)}</span>
                    </div>
                  </div>
                  <span class="badge ${statusInfo.class}" style="font-weight:600;">
                    ${statusInfo.text}
                  </span>
                </div>

                <!-- 工作负荷进度条 - 红黄绿三色（修复问题4） -->
                <div class="workload-progress-container">
                  <div class="workload-progress-header">
                    <span class="workload-progress-label">Weekly Workload</span>
                    <span class="workload-progress-value ${item.workloadStatus}">${item.hoursDisplay}</span>
                  </div>
                  <div class="workload-progress-bar">
                    <div class="workload-progress-fill ${item.workloadStatus}" style="width: ${progressPercent}%;"></div>
                  </div>
                </div>

                <div style="display:flex;align-items:center;gap:16px;margin:16px 0;padding:14px;background:var(--bg-soft);border-radius:12px;">
                  <div style="flex:1;">
                    <div style="font-size:13px;color:var(--text-soft);margin-bottom:6px;">Applied Jobs</div>
                    <div style="font-size:22px;font-weight:700;color:var(--text);">${escapeHtml(item.taskCount)}</div>
                  </div>
                  <div style="flex:1;">
                    <div style="font-size:13px;color:var(--text-soft);margin-bottom:6px;">Total Hours</div>
                    <div style="font-size:22px;font-weight:700;color:var(--text);">${item.currentHours}h</div>
                  </div>
                  <div style="flex:1;">
                    <div style="font-size:13px;color:var(--text-soft);margin-bottom:6px;">Max Hours</div>
                    <div style="font-size:22px;font-weight:700;color:var(--text);">${item.maxHours}h</div>
                  </div>
                </div>

                ${item.skills && item.skills.length > 0 ? `
                <div style="margin-bottom:16px;">
                  <div style="font-size:13px;color:var(--text-soft);margin-bottom:8px;">Skills</div>
                  <div class="tag-list">
                    ${item.skills.map(skill => `<span class="tag">${escapeHtml(skill)}</span>`).join("")}
                  </div>
                </div>
                ` : ''}

                <div class="workload-actions">
                  <button class="btn btn-sm btn-soft view-ta-detail-btn" type="button" data-ta-id="${item.id}">
                    ${Icons.eye} View Details
                  </button>
                  <button class="btn btn-sm btn-danger delete-ta-btn" type="button" data-ta-id="${item.id}">
                    ${Icons.reject} Delete
                  </button>
                </div>
              </article>
            `}).join("")
            : `
            <div class="empty-state">
              <strong>No TA records matched.</strong>
              <span>Try adjusting your search or workload status filter.</span>
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
        <p>View all course organizers and their published job statistics.</p>
      </div>

      <div class="toolbar-row" style="margin:0;">
        <div class="search-box">
          <span class="search-icon">${Icons.search}</span>
          <input id="moSearchInput" type="text" placeholder="Search MO..." value="${escapeHtml(state.filters.moSearch)}" />
          <button id="moSearchBtn" class="search-btn" type="button">Search</button>
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
                  <button class="btn btn-sm btn-soft view-mo-detail-btn" type="button" data-mo-id="${item.id}">
                    ${Icons.eye} View Details
                  </button>
                  <button class="btn btn-sm btn-danger delete-mo-btn" type="button" data-mo-id="${item.id}">
                    ${Icons.reject} Delete MO
                  </button>
                </div>

                <div class="workload-sub" style="margin-bottom:16px;">
                  <span class="badge badge-soft">Posts: ${escapeHtml(item.publishedPosts)}</span>
                  <span class="badge badge-success">Open: ${escapeHtml(item.openPosts)}</span>
                  <span class="badge badge-soft">Closed: ${escapeHtml(item.closedPosts)}</span>
                  <span class="badge badge-primary">Apps: ${escapeHtml(item.totalApplications || 0)}</span>
                  <span class="badge badge-warning">Pending: ${escapeHtml(item.pendingApplications || 0)}</span>
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
                        const statusText = post.jobStatus === 0 ? "Open" : post.jobStatus === 1 ? "Closed" : post.jobStatus === 2 ? "Filled" : "Cancelled";
                        const statusClass = post.jobStatus === 0 ? "badge-success" : post.jobStatus === 1 ? "badge-warning" : post.jobStatus === 2 ? "badge-danger" : "badge-soft";
                        return `
                          <tr>
                            <td>${escapeHtml(post.jobName || "Unnamed Job")}</td>
                            <td><span class="badge ${statusClass}">${escapeHtml(statusText)}</span></td>
                            <td>
                              <div class="row-actions">
                                <button class="btn btn-sm btn-soft open-post-view-btn" type="button" data-post-id="${String(post.jobId)}">
                                  View
                                </button>
                                <button class="btn btn-sm btn-danger delete-post-btn" type="button" data-post-id="${String(post.jobId)}">
                                  Delete Post
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
        <p>Operation history and audit trail</p>
      </div>

      <div class="toolbar-row" style="margin:0;">
        <div class="search-box">
          <span class="search-icon">${Icons.search}</span>
          <input id="logSearchInput" type="text" placeholder="Search logs..." value="${escapeHtml(state.filters.logSearch)}" />
          <button id="logSearchBtn" class="search-btn" type="button">Search</button>
        </div>

        <div class="filter-chips">
          <button class="filter-chip ${state.filters.logType === "all" ? "active" : ""}" data-log-type="all" type="button">All</button>
          <button class="filter-chip ${state.filters.logType === "user" ? "active" : ""}" data-log-type="user" type="button">User</button>
          <button class="filter-chip ${state.filters.logType === "job" ? "active" : ""}" data-log-type="job" type="button">Job</button>
          <button class="filter-chip ${state.filters.logType === "application" ? "active" : ""}" data-log-type="application" type="button">Application</button>
        </div>
      </div>
    </section>

    <div class="log-list">
      ${
        items.length > 0
            ? items.map(item => `
              <article class="log-item">
                <div class="log-item-header">
                  <h3 class="log-title">${escapeHtml(item.detail)}</h3>
                  <span class="badge badge-soft">${escapeHtml(item.actionType)}</span>
                </div>
                <div class="log-meta">${escapeHtml(item.operatorName)} · ${escapeHtml(item.createTime)}</div>
                <p class="log-body">Target: ${escapeHtml(item.targetType)} #${escapeHtml(item.targetId)}</p>
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

function bindPageEvents() {
    const openStatsBtn = document.getElementById("openStatsBtn");
    const openUsersBtn = document.getElementById("openUsersBtn");
    const openAllJobsBtn = document.getElementById("openAllJobsBtn");
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
    // 使用事件委托避免重新渲染时丢失事件监听器
    const parent = els.monitorContent;
    if (!parent) return;

    // TA搜索框 - 使用事件委托
    const taSearchInput = parent.querySelector("#taSearchInput");
    if (taSearchInput && taSearchInput.dataset.bound !== "true") {
        taSearchInput.addEventListener("input", e => {
            state.filters.taSearch = e.target.value;
        });
        taSearchInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                renderTAView();
                bindTAViewEvents();
            }
        });
        taSearchInput.dataset.bound = "true";
    }

    // TA搜索按钮
    const taSearchBtn = parent.querySelector("#taSearchBtn");
    if (taSearchBtn && taSearchBtn.dataset.bound !== "true") {
        taSearchBtn.addEventListener("click", () => {
            renderTAView();
            bindTAViewEvents();
        });
        taSearchBtn.dataset.bound = "true";
    }

    // TA状态过滤按钮
    if (parent.dataset.statusBound !== "true") {
        parent.addEventListener("click", e => {
            const btn = e.target.closest("[data-ta-status]");
            if (btn) {
                state.filters.taStatus = btn.dataset.taStatus;
                renderTAView();
                bindTAViewEvents(); // 重新绑定，因为DOM被重新渲染了
            }
        });
        parent.dataset.statusBound = "true";
    }

    // TA详情按钮
    parent.addEventListener("click", e => {
        const btn = e.target.closest(".view-ta-detail-btn");
        if (btn) {
            const id = String(btn.dataset.taId);
            openTADetailModal(id);
        }
    });

    // 删除TA按钮 - 使用事件委托，避免重复绑定
    let taDeleteHandled = false;
    if (!taDeleteHandled) {
        parent.addEventListener("click", async e => {
            const btn = e.target.closest(".delete-ta-btn");
            if (btn) {
                const taId = String(btn.dataset.taId);
                const ta = getTAById(taId);
                if (ta && confirm(`Are you sure you want to delete TA "${ta.name}"?`)) {
                    await deleteUser(taId);
                }
            }
        });
        taDeleteHandled = true;
    }
}

function bindMOViewEvents() {
    // 使用事件委托避免重新渲染时丢失事件监听器
    const parent = els.monitorContent;
    if (!parent) return;

    // MO搜索框 - 使用事件委托
    const moSearchInput = parent.querySelector("#moSearchInput");
    if (moSearchInput && moSearchInput.dataset.bound !== "true") {
        moSearchInput.addEventListener("input", e => {
            state.filters.moSearch = e.target.value;
        });
        moSearchInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                renderMOView();
                bindMOViewEvents();
            }
        });
        moSearchInput.dataset.bound = "true";
    }

    // MO搜索按钮
    const moSearchBtn = parent.querySelector("#moSearchBtn");
    if (moSearchBtn && moSearchBtn.dataset.bound !== "true") {
        moSearchBtn.addEventListener("click", () => {
            renderMOView();
            bindMOViewEvents();
        });
        moSearchBtn.dataset.bound = "true";
    }

    // MO状态过滤按钮
    if (parent.dataset.moStatusBound !== "true") {
        parent.addEventListener("click", e => {
            const btn = e.target.closest("[data-mo-status]");
            if (btn) {
                state.filters.moStatus = btn.dataset.moStatus;
                renderMOView();
                bindMOViewEvents(); // 重新绑定，因为DOM被重新渲染了
            }
        });
        parent.dataset.moStatusBound = "true";
    }

    // MO详情按钮
    parent.addEventListener("click", e => {
        const btn = e.target.closest(".view-mo-detail-btn");
        if (btn) {
            const moId = String(btn.dataset.moId);
            openUserDetailModal(moId);
        }
    });

    // 查看岗位按钮
    parent.addEventListener("click", e => {
        const btn = e.target.closest(".open-post-view-btn");
        if (btn) {
            const postId = String(btn.dataset.postId);
            openPostPreview(postId);
        }
    });

    // 删除岗位和删除MO按钮 - 使用事件委托，避免重复绑定
    let moDeleteHandled = false;
    if (!moDeleteHandled) {
        parent.addEventListener("click", async e => {
            const postBtn = e.target.closest(".delete-post-btn");
            if (postBtn) {
                const jobId = String(postBtn.dataset.postId);
                if (confirm("Are you sure you want to delete this job?")) {
                    await deleteJob(jobId);
                    render();
                }
            }

            const moBtn = e.target.closest(".delete-mo-btn");
            if (moBtn) {
                const moId = String(moBtn.dataset.moId);
                const mo = getMOById(moId);
                if (mo && confirm(`Are you sure you want to delete MO "${mo.name}"?`)) {
                    await deleteUser(moId);
                }
            }
        });
        moDeleteHandled = true;
    }
}

function bindLogsViewEvents() {
    // 使用事件委托避免重新渲染时丢失事件监听器
    const parent = els.monitorContent;
    if (!parent) return;

    // Logs搜索框 - 使用事件委托
    const logSearchInput = parent.querySelector("#logSearchInput");
    if (logSearchInput && logSearchInput.dataset.bound !== "true") {
        logSearchInput.addEventListener("input", e => {
            state.filters.logSearch = e.target.value;
        });
        logSearchInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                renderLogsView();
                bindLogsViewEvents();
            }
        });
        logSearchInput.dataset.bound = "true";
    }

    // Logs搜索按钮
    const logSearchBtn = parent.querySelector("#logSearchBtn");
    if (logSearchBtn && logSearchBtn.dataset.bound !== "true") {
        logSearchBtn.addEventListener("click", () => {
            renderLogsView();
            bindLogsViewEvents();
        });
        logSearchBtn.dataset.bound = "true";
    }

    // Logs类型过滤按钮
    if (parent.dataset.logTypeBound !== "true") {
        parent.addEventListener("click", e => {
            const btn = e.target.closest("[data-log-type]");
            if (btn) {
                state.filters.logType = btn.dataset.logType;
                renderLogsView();
                bindLogsViewEvents(); // 重新绑定，因为DOM被重新渲染了
            }
        });
        parent.dataset.logTypeBound = "true";
    }
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
        alert("TA user not found. Please refresh the page and try again.");
        return;
    }

    state.selectedTA = ta;

    // 获取工作负荷状态显示信息（修复问题4：只有三个状态，红黄绿）
    const getWorkloadStatusInfo = (status) => {
        switch (status) {
            case "overloaded":
                return { text: "OVERLOADED", class: "badge-danger", color: "var(--danger)" };
            case "near_limit":
                return { text: "Near Limit", class: "badge-warning", color: "var(--warning)" };
            case "healthy":
                return { text: "Healthy", class: "badge-success", color: "var(--success)" };
            default:
                return { text: status, class: "badge-soft", color: "var(--text-faint)" };
        }
    };

    const statusInfo = getWorkloadStatusInfo(ta.workloadStatus);

    els.taDetailModalBody.innerHTML = `
    <div id="taDetailContent">
      <div class="user-profile-block" style="margin-bottom:20px;">
        <div class="user-avatar-xl" style="width:72px;height:72px;font-size:24px;">${escapeHtml(getInitials(ta.name))}</div>
        <div class="user-identity">
          <h3 style="margin:0 0 6px;font-size:22px;">${escapeHtml(ta.name)}</h3>
          <p style="margin:0;font-size:14px;color:var(--text-soft);">@${escapeHtml(ta.username)} · ${escapeHtml(ta.course)}</p>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;">
        <div style="padding:14px;background:linear-gradient(135deg,var(--primary),var(--primary-2));border-radius:14px;text-align:center;color:white;">
          <div style="font-size:24px;font-weight:700;">${escapeHtml(ta.taskCount)}</div>
          <div style="font-size:12px;opacity:0.9;">Applied Jobs</div>
        </div>
        <div style="padding:14px;background:var(--bg-soft);border-radius:14px;text-align:center;">
          <div style="font-size:24px;font-weight:700;color:var(--text);">${escapeHtml(ta.currentHours)}h</div>
          <div style="font-size:12px;color:var(--text-soft);">Current Load</div>
        </div>
        <div style="padding:14px;background:var(--bg-soft);border-radius:14px;text-align:center;">
          <div style="font-size:24px;font-weight:700;color:var(--text);">${escapeHtml(ta.maxHours)}h</div>
          <div style="font-size:12px;color:var(--text-soft);">Max Hours</div>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;padding:14px;background:var(--bg-soft);border-radius:14px;">
        <span class="badge ${statusInfo.class}" style="font-size:13px;font-weight:600;padding:10px 18px;">
          ${statusInfo.text}
        </span>
        <span style="font-size:13px;color:var(--text-soft);">Workload Status</span>
      </div>

      <div class="workload-progress-container" style="margin-bottom:24px;">
        <div class="workload-progress-header">
          <span class="workload-progress-label">Weekly Workload Progress</span>
          <span class="workload-progress-value ${ta.workloadStatus}" style="font-weight:600;">${ta.hoursDisplay}</span>
        </div>
        <div class="workload-progress-bar" style="height:12px;">
          <div class="workload-progress-fill ${ta.workloadStatus}" style="width: ${ta.currentHours === 0 ? 0 : Math.min((ta.currentHours / ta.maxHours) * 100, 100)}%;"></div>
        </div>
      </div>

      <div class="detail-grid" style="margin-bottom:20px;">
        <div class="detail-row">
          <span>User ID</span>
          <span style="font-family:monospace;">${escapeHtml(ta.id)}</span>
        </div>
        <div class="detail-row">
          <span>Email</span>
          <span>${escapeHtml(ta.email || "-")}</span>
        </div>
        <div class="detail-row">
          <span>Username</span>
          <span>@${escapeHtml(ta.username)}</span>
        </div>
        <div class="detail-row">
          <span>Course/Module</span>
          <span>${escapeHtml(ta.course)}</span>
        </div>
      </div>

      ${ta.skills && ta.skills.length > 0 ? `
      <div style="margin-bottom:20px;">
        <h3 style="margin:0 0 12px;font-size:15px;font-weight:600;color:var(--text);">Skills & Tags</h3>
        <div class="tag-list">
          ${ta.skills.map(skill => `<span class="tag">${escapeHtml(skill)}</span>`).join("")}
        </div>
      </div>
      ` : ''}

      <div style="display:flex;gap:10px;margin-bottom:20px;">
        <button class="btn btn-sm btn-soft" type="button" id="viewPdfBtn" data-uid="${escapeHtml(ta.id)}">
          ${Icons.eye} View Profile PDF
        </button>
      </div>

      ${ta.appliedJobs && ta.appliedJobs.length > 0 ? `
      <div>
        <h3 style="margin:0 0 14px;font-size:15px;font-weight:600;color:var(--text);">Applied Jobs History</h3>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${ta.appliedJobs.map((job, index) => `
            <button class="job-detail-btn" type="button" data-job-index="${index}">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:36px;height:36px;background:var(--primary);border-radius:8px;display:flex;align-items:center;justify-content:center;">
                  <svg viewBox="0 0 24 24" style="width:18px;height:18px;color:white;" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/>
                  </svg>
                </div>
                <div style="flex:1;">
                  <div style="font-size:14px;font-weight:600;color:var(--text);">${escapeHtml(job.jobName)}</div>
                  <div style="font-size:12px;color:var(--text-soft);">${escapeHtml(job.belongModule)}</div>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:10px;">
                <span class="badge ${job.applicationStatus === 'approved' || job.applicationStatus === '1' ? 'badge-success' : job.applicationStatus === 'rejected' || job.applicationStatus === '2' ? 'badge-danger' : 'badge-warning'}" style="font-size:11px;">
                  ${job.applicationStatus === 'approved' || job.applicationStatus === '1' ? 'Approved' : job.applicationStatus === 'rejected' || job.applicationStatus === '2' ? 'Rejected' : 'Pending'}
                </span>
                <span style="font-size:13px;font-weight:500;color:var(--text);">${escapeHtml(job.workHoursWeekly)}h/w</span>
                <svg viewBox="0 0 24 24" style="width:16px;height:16px;color:var(--text-soft);" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </button>
          `).join("")}
        </div>
      </div>
      ` : `
      <div style="padding:24px;text-align:center;color:var(--text-soft);background:var(--bg-soft);border-radius:12px;">
        <p style="margin:0;">This TA has not applied for any jobs yet.</p>
      </div>
      `}
    </div>

    <!-- PDF Preview Container - 界面内嵌预览 -->
    <div id="pdfPreviewContainer" class="hidden" style="background:#f8f9fa;border-radius:12px;padding:16px;margin-top:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <h3 style="margin:0;font-size:16px;color:var(--text);">PDF Preview</h3>
        <button class="btn btn-sm btn-soft hidden" type="button" id="closePreviewBtn" style="display:inline-flex;align-items:center;gap:6px;">
          <svg viewBox="0 0 24 24" style="width:16px;height:16px;transform:rotate(180deg);" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
          Back to Details
        </button>
      </div>
    </div>
  `;

    const header = els.taDetailModalOverlay.querySelector(".modal-header h2");
    if (header) header.textContent = "Teaching Assistant Details";

    // 添加PDF查看按钮事件监听器
    const viewPdfBtn = els.taDetailModalOverlay.querySelector('#viewPdfBtn');
    if (viewPdfBtn) {
        viewPdfBtn.addEventListener('click', async function() {
            const uid = this.getAttribute('data-uid');
            const pdfUrl = `/tapj/user?action=downloadProfilePdf&uid=${encodeURIComponent(uid)}`;

            try {
                // 直接发GET请求获取PDF内容，检查响应状态
                const response = await fetch(pdfUrl, {
                    credentials: 'include'
                });

                // 检查HTTP状态码
                if (response.status === 403) {
                    alert("You do not have permission to view this profile PDF.");
                    return;
                }
                if (response.status === 404) {
                    alert("Profile PDF not found for this user.");
                    return;
                }
                if (!response.ok) {
                    alert("Failed to load profile PDF. Please try again later.");
                    return;
                }

                // 获取 PDF 内容作为 blob
                const blob = await response.blob();

                // 检查blob是否为空
                if (blob.size === 0) {
                    alert("Profile PDF not found for this user.");
                    return;
                }

                // 检查内容类型，确保是PDF而不是JSON错误
                const contentType = response.headers.get('Content-Type') || blob.type;
                if (contentType && contentType.includes('application/json')) {
                    // 如果是JSON响应，说明是错误信息
                    alert("Profile PDF not available due to privacy settings.");
                    return;
                }

                // 创建 blob URL 用于预览
                const blobUrl = URL.createObjectURL(blob);

                // 在界面内嵌预览 PDF，不打开新窗口
                const previewContainer = els.taDetailModalOverlay.querySelector('#pdfPreviewContainer');
                if (previewContainer) {
                    const iframe = document.createElement('iframe');
                    iframe.src = blobUrl;
                    iframe.style.width = '100%';
                    iframe.style.height = '600px';
                    iframe.style.border = 'none';
                    iframe.id = 'pdfPreviewIframe';

                    previewContainer.innerHTML = '';
                    previewContainer.appendChild(iframe);
                    previewContainer.classList.remove('hidden');

                    // 隐藏其他详情内容，显示PDF预览
                    const detailContent = els.taDetailModalOverlay.querySelector('#taDetailContent');
                    if (detailContent) {
                        detailContent.classList.add('hidden');
                    }

                    // 更新模态框标题
                    const header = els.taDetailModalOverlay.querySelector(".modal-header h2");
                    if (header) header.textContent = "Profile PDF Preview";

                    // 添加关闭预览按钮
                    const closePreviewBtn = els.taDetailModalOverlay.querySelector('#closePreviewBtn');
                    if (closePreviewBtn) {
                        closePreviewBtn.classList.remove('hidden');
                    }
                }
            } catch (error) {
                alert("An error occurred while loading the PDF. Please try again later.");
            }
        });
    }

    // 关闭PDF预览按钮
    const closePreviewBtn = els.taDetailModalOverlay.querySelector('#closePreviewBtn');
    if (closePreviewBtn) {
        closePreviewBtn.addEventListener('click', function() {
            const previewContainer = els.taDetailModalOverlay.querySelector('#pdfPreviewContainer');
            if (previewContainer) {
                previewContainer.classList.add('hidden');
                previewContainer.innerHTML = '';
            }

            // 恢复显示详情内容
            const detailContent = els.taDetailModalOverlay.querySelector('#taDetailContent');
            if (detailContent) {
                detailContent.classList.remove('hidden');
            }

            // 恢复模态框标题
            const header = els.taDetailModalOverlay.querySelector(".modal-header h2");
            if (header) header.textContent = "Teaching Assistant Details";

            // 隐藏关闭预览按钮
            closePreviewBtn.classList.add('hidden');
        });
    }

    // 添加岗位详情按钮事件监听器
    const jobDetailBtns = els.taDetailModalOverlay.querySelectorAll('.job-detail-btn');
    jobDetailBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const jobIndex = parseInt(this.getAttribute('data-job-index'), 10);
            const selectedJob = ta.appliedJobs[jobIndex];
            if (selectedJob) {
                openJobDetailModal(selectedJob);
            }
        });
    });

    els.taDetailModalOverlay.classList.remove("hidden");
}

function closeTADetailModal() {
    state.selectedTA = null;
    // 重置PDF预览状态
    const previewContainer = els.taDetailModalOverlay.querySelector('#pdfPreviewContainer');
    if (previewContainer) {
        previewContainer.classList.add("hidden");
        previewContainer.innerHTML = '';
    }
    const closePreviewBtn = els.taDetailModalOverlay.querySelector('#closePreviewBtn');
    if (closePreviewBtn) {
        closePreviewBtn.classList.add("hidden");
    }
    const detailContent = els.taDetailModalOverlay.querySelector('#taDetailContent');
    if (detailContent) {
        detailContent.classList.remove("hidden");
    }
    els.taDetailModalOverlay.classList.add("hidden");
}

function openJobDetailModal(job) {
    const statusMap = {
        0: { text: "Open", class: "badge-success" },
        1: { text: "Closed", class: "badge-warning" },
        2: { text: "Filled", class: "badge-danger" },
        3: { text: "Cancelled", class: "badge-soft" }
    };
    const jobStatus = statusMap[job.jobStatus] || statusMap[0];
    const typeMap = { 1: "Course TA", 2: "Exam TA", 3: "Event TA" };
    const jobType = typeMap[job.jobType] || "TA";

    els.jobDetailModalBody.innerHTML = `
    <div style="padding:20px;background:linear-gradient(135deg,var(--primary),var(--primary-2));border-radius:16px;margin-bottom:20px;color:white;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div style="flex:1;">
          <h3 style="margin:0 0 8px;font-size:20px;font-weight:600;color:white;">${escapeHtml(job.jobName)}</h3>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <span class="badge ${jobStatus.class}" style="background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.3);">${jobStatus.text}</span>
            <span style="font-size:12px;opacity:0.9;">Job ID: ${escapeHtml(job.jobId)}</span>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:28px;font-weight:700;">${escapeHtml(job.workHoursWeekly)}</div>
          <div style="font-size:12px;opacity:0.8;">hours/week</div>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:20px;">
      <div style="padding:16px;background:var(--bg-soft);border-radius:12px;">
        <div style="font-size:12px;color:var(--text-soft);margin-bottom:4px;">Course Organizer</div>
        <div style="font-size:14px;font-weight:500;color:var(--text);">${escapeHtml(job.publisherName || "N/A")}</div>
      </div>
      <div style="padding:16px;background:var(--bg-soft);border-radius:12px;">
        <div style="font-size:12px;color:var(--text-soft);margin-bottom:4px;">Job Type</div>
        <div style="font-size:14px;font-weight:500;color:var(--text);">${escapeHtml(jobType)}</div>
      </div>
      <div style="padding:16px;background:var(--bg-soft);border-radius:12px;">
        <div style="font-size:12px;color:var(--text-soft);margin-bottom:4px;">Module/Course</div>
        <div style="font-size:14px;font-weight:500;color:var(--text);">${escapeHtml(job.belongModule || "N/A")}</div>
      </div>
      <div style="padding:16px;background:var(--bg-soft);border-radius:12px;">
        <div style="font-size:12px;color:var(--text-soft);margin-bottom:4px;">Recruitment</div>
        <div style="font-size:14px;font-weight:500;color:var(--text);">${escapeHtml(job.recruitNum || 0)} positions</div>
      </div>
    </div>

    <div style="margin-bottom:20px;">
      <h3 style="margin:0 0 12px;font-size:15px;font-weight:600;color:var(--text);">Job Description</h3>
      <div style="padding:16px;background:var(--bg-soft);border-radius:12px;font-size:14px;line-height:1.8;color:var(--text);white-space:pre-wrap;min-height:80px;">
        ${escapeHtml(job.jobDesc) || "No description provided."}
      </div>
    </div>

    ${job.tags && job.tags.length > 0 ? `
    <div style="margin-bottom:20px;">
      <h3 style="margin:0 0 12px;font-size:15px;font-weight:600;color:var(--text);">Tags</h3>
      <div class="tag-list">
        ${job.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
      </div>
    </div>
    ` : ''}
  `;

    const header = els.jobDetailModalOverlay.querySelector(".modal-header h2");
    if (header) header.textContent = "Job Details";

    els.jobDetailModalOverlay.classList.remove("hidden");
}

function closeJobDetailModal() {
    els.jobDetailModalOverlay.classList.add("hidden");
}

function openStatsModal() {
    const appStats = computeApplicationStats();
    
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
    </div>

    <div class="section-header" style="margin-top:24px;">
      <div class="section-title-block">
        <h3>Application Statistics</h3>
        <p>Real-time application data from backend</p>
      </div>
    </div>

    <div class="metrics-grid" style="margin-bottom:20px;">
      <div class="metric-card">
        <strong>${escapeHtml(appStats.totalApplications)}</strong>
        <span>Total Applications</span>
      </div>
      <div class="metric-card">
        <strong>${escapeHtml(appStats.pendingCount)}</strong>
        <span>Pending</span>
      </div>
      <div class="metric-card">
        <strong>${escapeHtml(appStats.approvedCount)}</strong>
        <span>Approved</span>
      </div>
      <div class="metric-card">
        <strong>${escapeHtml(appStats.approvalRate)}%</strong>
        <span>Approval Rate</span>
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
              <td>Overall user registration is growing steadily</td>
            </tr>
            <tr>
              <td>Application Queue</td>
              <td>${escapeHtml(appStats.pendingCount)}</td>
              <td><span class="badge badge-warning">Attention</span></td>
              <td>${escapeHtml(appStats.pendingCount)} applications awaiting processing</td>
            </tr>
            <tr>
              <td>Role Change Requests</td>
              <td>${escapeHtml(state.roleRequests.filter(r => r.status === "pending").length)}</td>
              <td><span class="badge badge-warning">Pending</span></td>
              <td>Has pending role request</td>
            </tr>
            <tr>
              <td>System Activity</td>
              <td>${escapeHtml(appStats.todayApplications)}</td>
              <td><span class="badge badge-success">Healthy</span></td>
              <td>${escapeHtml(appStats.todayApplications)} applications today</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    ${appStats.topJobsByApplications.length > 0 ? `
    <div class="section-header" style="margin-top:24px;">
      <div class="section-title-block">
        <h3>Top Jobs by Applications</h3>
        <p>Most popular jobs among TAs</p>
      </div>
    </div>
    <div class="table-card">
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Job Name</th>
              <th>Application Count</th>
            </tr>
          </thead>
          <tbody>
            ${appStats.topJobsByApplications.map((job, index) => `
              <tr>
                <td><span class="badge ${index === 0 ? 'badge-warning' : 'badge-soft'}">#${index + 1}</span></td>
                <td>${escapeHtml(job.jobName)}</td>
                <td><strong>${escapeHtml(job.count)}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
    ` : ''}
  `;

    els.statsModalOverlay.classList.remove("hidden");
}

function closeStatsModal() {
    els.statsModalOverlay.classList.add("hidden");
}

// 已实现后端接口连接
// 添加用户筛选状态
state.filters.usersRole = "all";
state.filters.usersSearch = "";

async function openUsersModal() {
    await loadAllUsers();
    renderUsersModal();
    els.usersModalOverlay.classList.remove("hidden");
}

function renderUsersModal() {
    // 根据筛选条件过滤用户
    const filteredUsers = state.backendUsers.filter(user => {
        // 角色筛选
        const matchRole = state.filters.usersRole === "all" ||
            (state.filters.usersRole === "TA" && user.userType === 1) ||
            (state.filters.usersRole === "MO" && user.userType === 2) ||
            (state.filters.usersRole === "Admin" && user.userType === 3);

        // 搜索筛选
        const searchLower = state.filters.usersSearch.toLowerCase();
        const matchSearch = !state.filters.usersSearch ||
            (user.username && user.username.toLowerCase().includes(searchLower)) ||
            (user.realName && user.realName.toLowerCase().includes(searchLower)) ||
            (user.email && user.email.toLowerCase().includes(searchLower));

        return matchRole && matchSearch;
    });

    els.usersModalBody.innerHTML = `
    <div class="section-header">
      <div class="section-title-block">
        <h3>All System Users</h3>
        <p>View all users by role. Click username to see details.</p>
      </div>
    </div>

    <div class="users-filter-bar">
      <div class="search-box">
        <span class="search-icon">${Icons.search}</span>
        <input id="usersSearchInput" type="text" placeholder="Search users..." value="${escapeHtml(state.filters.usersSearch)}" />
        <button id="usersSearchBtn" class="search-btn" type="button">Search</button>
      </div>

      <div class="filter-chips">
        <button class="filter-chip ${state.filters.usersRole === "all" ? "active" : ""}" data-user-role="all" type="button">All (${state.backendUsers.length})</button>
        <button class="filter-chip ${state.filters.usersRole === "TA" ? "active" : ""}" data-user-role="TA" type="button">TA (${state.backendUsers.filter(u => u.userType === 1).length})</button>
        <button class="filter-chip ${state.filters.usersRole === "MO" ? "active" : ""}" data-user-role="MO" type="button">MO (${state.backendUsers.filter(u => u.userType === 2).length})</button>
        <button class="filter-chip ${state.filters.usersRole === "Admin" ? "active" : ""}" data-user-role="Admin" type="button">Admin (${state.backendUsers.filter(u => u.userType === 3).length})</button>
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
            ${filteredUsers.length > 0 ? filteredUsers.map(user => {
        const roleText = user.userType === 1 ? "TA" : user.userType === 2 ? "MO" : user.userType === 3 ? "Admin" : "Unknown";
        const roleClass = user.userType === 1 ? "badge-primary" : user.userType === 2 ? "badge-warning" : user.userType === 3 ? "badge-success" : "badge-soft";
        // 检查是否是admin用户，如果是则不显示删除按钮
        const isAdmin = user.userType === 3;
        return `
              <tr>
                <td>${escapeHtml(user.userId)}</td>
                <td><a href="#" class="username-link" data-user-id="${escapeHtml(user.userId)}">${escapeHtml(user.username)}</a></td>
                <td>${escapeHtml(user.realName || "-")}</td>
                <td><span class="badge ${roleClass}">${escapeHtml(roleText)}</span></td>
                <td>${escapeHtml(user.email || "-")}</td>
                <td>
                  <div class="row-actions">
                    <button class="btn btn-sm btn-soft open-user-detail-btn" type="button" data-user-id="${user.userId}">
                      ${Icons.eye} View
                    </button>
                    ${isAdmin ? '' : `
                    <button class="btn btn-sm btn-danger delete-user-btn" type="button" data-user-id="${user.userId}">
                      Delete
                    </button>
                    `}
                  </div>
                </td>
              </tr>
            `}).join("") : `
              <tr>
                <td colspan="6" style="text-align:center;padding:30px;">No users matched your criteria</td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;

    // 绑定事件
    bindUsersModalEvents();
}

function bindUsersModalEvents() {
    const modalBody = els.usersModalBody;

    // 搜索框事件
    const searchInput = modalBody.querySelector("#usersSearchInput");
    if (searchInput) {
        searchInput.addEventListener("input", e => {
            state.filters.usersSearch = e.target.value;
        });
        searchInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                renderUsersModal();
            }
        });
    }

    // 搜索按钮
    const searchBtn = modalBody.querySelector("#usersSearchBtn");
    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            renderUsersModal();
        });
    }

    // 角色筛选按钮
    const roleBtns = modalBody.querySelectorAll("[data-user-role]");
    roleBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            state.filters.usersRole = btn.dataset.userRole;
            renderUsersModal();
        });
    });

    // 用户名点击事件
    const usernameLinks = modalBody.querySelectorAll(".username-link");
    usernameLinks.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const userId = link.dataset.userId;
            openUserDetailModal(userId);
        });
    });

    // View按钮
    const detailBtns = modalBody.querySelectorAll(".open-user-detail-btn");
    detailBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const userId = btn.dataset.userId;
            openUserDetailModal(userId);
        });
    });

    // Delete按钮 - 只有非admin用户才显示删除按钮
    const deleteBtns = modalBody.querySelectorAll(".delete-user-btn");
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

// 已实现后端接口连接 - All Jobs 弹窗
async function openAllJobsModal() {
    await loadAllJobs();
    renderAllJobsModal();
    els.allJobsModalOverlay.classList.remove("hidden");
}

function renderAllJobsModal() {
    const filteredJobs = state.backendJobsList.filter(job => {
        const searchLower = state.filters.jobsSearch.toLowerCase();
        const matchSearch = !state.filters.jobsSearch ||
            (job.jobName && job.jobName.toLowerCase().includes(searchLower)) ||
            (job.belongModule && job.belongModule.toLowerCase().includes(searchLower)) ||
            (job.jobDesc && job.jobDesc.toLowerCase().includes(searchLower));
        return matchSearch;
    });

    els.allJobsModalBody.innerHTML = `
    <div class="section-header">
      <div class="section-title-block">
        <h3>All Jobs Management</h3>
        <p>View all jobs and perform delete operations. Data from backend API.</p>
      </div>
    </div>

    <div class="users-filter-bar">
      <div class="search-box">
        <span class="search-icon">${Icons.search}</span>
        <input id="jobsSearchInput" type="text" placeholder="Search jobs by name, module, description..." value="${escapeHtml(state.filters.jobsSearch)}" />
        <button id="jobsSearchBtn" class="search-btn" type="button">Search</button>
      </div>
    </div>

    <div class="table-card">
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Job Name</th>
              <th>Publisher MO</th>
              <th>Recruit Num</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${filteredJobs.length > 0 ? filteredJobs.map(job => {
        const statusText = job.jobStatus === 0 ? "Open" : job.jobStatus === 1 ? "Closed" : job.jobStatus === 2 ? "Filled" : job.jobStatus === 3 ? "Cancelled" : "Unknown";
        const statusClass = job.jobStatus === 0 ? "badge-success" : job.jobStatus === 1 ? "badge-warning" : job.jobStatus === 2 ? "badge-danger" : "badge-soft";
        const moUser = state.backendUsers.find(u => String(u.userId) === String(job.publisherMoId) && u.userType === 2);
        const moDisplay = moUser ? (moUser.realName || moUser.username) : `MO #${job.publisherMoId}`;
        return `
              <tr>
                <td>${escapeHtml(job.jobId)}</td>
                <td>${escapeHtml(job.jobName)}</td>
                <td>${escapeHtml(moDisplay)}</td>
                <td>${escapeHtml(job.recruitNum)}</td>
                <td><span class="badge ${statusClass}">${escapeHtml(statusText)}</span></td>
                <td>
                  <div class="row-actions">
                    <button class="btn btn-soft view-job-detail-btn" type="button" data-job-id="${job.jobId}">
                      View Details
                    </button>
                    <button class="btn btn-danger delete-alljob-btn" type="button" data-job-id="${job.jobId}">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            `}).join("") : `
              <tr>
                <td colspan="6" style="text-align:center;padding:30px;">No job data available</td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;

    bindAllJobsModalEvents();
}

function bindAllJobsModalEvents() {
    const modalBody = els.allJobsModalBody;

    // 搜索框事件
    const searchInput = modalBody.querySelector("#jobsSearchInput");
    if (searchInput) {
        searchInput.addEventListener("input", e => {
            state.filters.jobsSearch = e.target.value;
        });
        searchInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                renderAllJobsModal();
            }
        });
    }

    // 搜索按钮
    const searchBtn = modalBody.querySelector("#jobsSearchBtn");
    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            renderAllJobsModal();
        });
    }

    // 查看岗位详情按钮
    const viewDetailBtns = modalBody.querySelectorAll(".view-job-detail-btn");
    viewDetailBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const jobId = btn.dataset.jobId;
            const job = state.backendJobsList.find(j => String(j.jobId) === String(jobId));
            if (job) {
                // 尝试从用户列表中查找MO的名称
                const moUser = state.backendUsers.find(u =>
                    String(u.userId) === String(job.publisherMoId) && u.userType === 2
                );
                const moName = moUser ? (moUser.realName || moUser.username) : `MO #${job.publisherMoId}`;

                openJobDetailModal({
                    jobId: job.jobId,
                    jobName: job.jobName || "Unnamed Job",
                    workHoursWeekly: job.workHoursWeekly || 0,
                    belongModule: job.belongModule || "N/A",
                    publisherName: moName,
                    jobDesc: job.jobDesc || "No description available.",
                    recruitNum: job.recruitNum || 0
                });
            }
        });
    });

    // 删除岗位按钮
    const deleteBtns = modalBody.querySelectorAll(".delete-alljob-btn");
    deleteBtns.forEach(btn => {
        btn.addEventListener("click", async () => {
            const jobId = btn.dataset.jobId;
            await deleteJob(jobId);
            renderAllJobsModal();
        });
    });
}

function closeAllJobsModal() {
    els.allJobsModalOverlay.classList.add("hidden");
}

// 已实现后端接口连接
async function openUserDetailModal(userId) {
    let user = state.backendUsers.find(item => String(item.userId) === String(userId));
    if (!user) {
        const userData = await loadUserDetail(userId);
        if (!userData) return;
        user = userData;
    }

    state.selectedUser = user;
    const roleText = user.userType === 1 ? "TA" : user.userType === 2 ? "MO" : user.userType === 3 ? "Admin" : "Unknown";
    const roleClass = user.userType === 1 ? "badge-primary" : user.userType === 2 ? "badge-warning" : "badge-success";

    const moData = state.moWorkloads.find(m => String(m.id) === String(userId));
    const taData = state.taWorkloads.find(t => String(t.id) === String(userId));

    els.userDetailModalBody.innerHTML = `
    <div class="user-profile-block" style="margin-bottom:20px;">
      <div class="user-avatar-xl" style="width:72px;height:72px;font-size:24px;">${escapeHtml(getInitials(user.realName || user.username))}</div>
      <div class="user-identity">
        <h3 style="margin:0 0 6px;font-size:22px;">${escapeHtml(user.realName || "-")}</h3>
        <p style="margin:0;font-size:14px;color:var(--text-soft);">@${escapeHtml(user.username)}</p>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
      <span class="badge ${roleClass}" style="font-size:13px;font-weight:600;padding:8px 16px;">${escapeHtml(roleText)}</span>
      <span style="font-size:13px;color:var(--text-soft);">User Role</span>
    </div>

    ${user.userType === 2 && moData ? `
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;">
      <div style="padding:14px;background:var(--bg-soft);border-radius:12px;text-align:center;">
        <div style="font-size:20px;font-weight:700;color:var(--text);">${escapeHtml(moData.publishedPosts || 0)}</div>
        <div style="font-size:11px;color:var(--text-soft);">Total Posts</div>
      </div>
      <div style="padding:14px;background:rgba(16,185,129,0.1);border-radius:12px;text-align:center;">
        <div style="font-size:20px;font-weight:700;color:var(--success);">${escapeHtml(moData.openPosts || 0)}</div>
        <div style="font-size:11px;color:var(--text-soft);">Open</div>
      </div>
      <div style="padding:14px;background:rgba(59,130,246,0.1);border-radius:12px;text-align:center;">
        <div style="font-size:20px;font-weight:700;color:var(--primary);">${escapeHtml(moData.totalApplications || 0)}</div>
        <div style="font-size:11px;color:var(--text-soft);">Applications</div>
      </div>
      <div style="padding:14px;background:rgba(245,158,11,0.1);border-radius:12px;text-align:center;">
        <div style="font-size:20px;font-weight:700;color:var(--warning);">${escapeHtml(moData.pendingApplications || 0)}</div>
        <div style="font-size:11px;color:var(--text-soft);">Pending</div>
      </div>
    </div>
    ` : ''}

    ${user.userType === 1 && taData ? `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;">
      <div style="padding:14px;background:var(--bg-soft);border-radius:12px;text-align:center;">
        <div style="font-size:20px;font-weight:700;color:var(--text);">${escapeHtml(taData.taskCount || 0)}</div>
        <div style="font-size:11px;color:var(--text-soft);">Applied Jobs</div>
      </div>
      <div style="padding:14px;background:rgba(59,130,246,0.1);border-radius:12px;text-align:center;">
        <div style="font-size:20px;font-weight:700;color:var(--primary);">${escapeHtml(taData.currentHours || 0)}h</div>
        <div style="font-size:11px;color:var(--text-soft);">Current Load</div>
      </div>
      <div style="padding:14px;background:${taData.workloadStatus === 'overloaded' ? 'rgba(239,68,68,0.1)' : taData.workloadStatus === 'near_limit' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)'};border-radius:12px;text-align:center;">
        <div style="font-size:20px;font-weight:700;color:${taData.workloadStatus === 'overloaded' ? 'var(--danger)' : taData.workloadStatus === 'near_limit' ? 'var(--warning)' : 'var(--success)'};">${escapeHtml(taData.workloadStatus === 'overloaded' ? 'High' : taData.workloadStatus === 'near_limit' ? 'Medium' : 'Normal')}</div>
        <div style="font-size:11px;color:var(--text-soft);">Workload</div>
      </div>
    </div>
    ` : ''}

    <div class="detail-grid" style="margin-bottom:20px;">
      <div class="detail-row">
        <span>User ID</span>
        <span style="font-family:monospace;font-size:13px;">${escapeHtml(user.userId)}</span>
      </div>
      <div class="detail-row">
        <span>Username</span>
        <span>@${escapeHtml(user.username)}</span>
      </div>
      <div class="detail-row">
        <span>Email</span>
        <span>${escapeHtml(user.email || "-")}</span>
      </div>
      <div class="detail-row">
        <span>Phone</span>
        <span>${escapeHtml(user.phone || "-")}</span>
      </div>
      <div class="detail-row">
        <span>Course/Module</span>
        <span>${escapeHtml(user.belongModule || "-")}</span>
      </div>
      <div class="detail-row">
        <span>Account Status</span>
        <span><span class="badge ${user.status === 0 ? 'badge-success' : 'badge-danger'}">${user.status === 0 ? 'Active' : 'Disabled'}</span></span>
      </div>
    </div>

    ${user.userType === 1 && taData && taData.skills && taData.skills.length > 0 ? `
    <div style="margin-bottom:20px;">
      <h3 style="margin:0 0 12px;font-size:15px;font-weight:600;color:var(--text);">Skills</h3>
      <div class="tag-list">
        ${taData.skills.map(s => `<span class="tag">${escapeHtml(s)}</span>`).join("")}
      </div>
    </div>
    ` : ''}
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
        const statusMap = {
            0: { text: "Open", class: "badge-success" },
            1: { text: "Closed", class: "badge-warning" },
            2: { text: "Filled", class: "badge-danger" },
            3: { text: "Cancelled", class: "badge-soft" }
        };
        const jobStatus = statusMap[detail.jobStatus] || statusMap[0];
        const typeMap = { 1: "Course TA", 2: "Exam TA", 3: "Event TA" };
        const jobType = typeMap[detail.jobType] || "TA";

        els.taDetailModalBody.innerHTML = `
      <div style="padding:20px;background:linear-gradient(135deg,var(--primary),var(--primary-2));border-radius:16px;margin-bottom:20px;color:white;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div style="flex:1;">
            <h3 style="margin:0 0 8px;font-size:20px;font-weight:600;color:white;">${escapeHtml(detail.jobName || "Unnamed Job")}</h3>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <span class="badge ${jobStatus.class}" style="background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.3);">${jobStatus.text}</span>
              <span style="font-size:12px;opacity:0.9;">Job ID: ${escapeHtml(detail.jobId)}</span>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:28px;font-weight:700;">${escapeHtml(detail.workHoursWeekly || 0)}</div>
            <div style="font-size:12px;opacity:0.8;">hours/week</div>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:20px;">
        <div style="padding:16px;background:var(--bg-soft);border-radius:12px;">
          <div style="font-size:12px;color:var(--text-soft);margin-bottom:4px;">Course Organizer</div>
          <div style="font-size:14px;font-weight:500;color:var(--text);">${escapeHtml(detail.publisherName || detail.moName || "N/A")}</div>
        </div>
        <div style="padding:16px;background:var(--bg-soft);border-radius:12px;">
          <div style="font-size:12px;color:var(--text-soft);margin-bottom:4px;">Job Type</div>
          <div style="font-size:14px;font-weight:500;color:var(--text);">${escapeHtml(jobType)}</div>
        </div>
        <div style="padding:16px;background:var(--bg-soft);border-radius:12px;">
          <div style="font-size:12px;color:var(--text-soft);margin-bottom:4px;">Module/Course</div>
          <div style="font-size:14px;font-weight:500;color:var(--text);">${escapeHtml(detail.belongModule || "N/A")}</div>
        </div>
        <div style="padding:16px;background:var(--bg-soft);border-radius:12px;">
          <div style="font-size:12px;color:var(--text-soft);margin-bottom:4px;">Deadline</div>
          <div style="font-size:14px;font-weight:500;color:var(--text);">${escapeHtml(detail.applyDeadline || "N/A")}</div>
        </div>
        <div style="padding:16px;background:var(--bg-soft);border-radius:12px;">
          <div style="font-size:12px;color:var(--text-soft);margin-bottom:4px;">Recruitment</div>
          <div style="font-size:14px;font-weight:500;color:var(--text);">${escapeHtml(detail.recruitNum || 0)} positions</div>
        </div>
        <div style="padding:16px;background:var(--bg-soft);border-radius:12px;">
          <div style="font-size:12px;color:var(--text-soft);margin-bottom:4px;">Hired</div>
          <div style="font-size:14px;font-weight:500;color:var(--text);">${escapeHtml(detail.hiredNum || 0)} selected</div>
        </div>
      </div>

      <div>
        <h3 style="margin:0 0 12px;font-size:15px;font-weight:600;color:var(--text);">Description</h3>
        <div style="padding:16px;background:var(--bg-soft);border-radius:12px;font-size:14px;line-height:1.8;color:var(--text);white-space:pre-wrap;min-height:80px;">
          ${escapeHtml(detail.jobDesc || "No description provided.")}
        </div>
      </div>
    `;

        const header = els.taDetailModalOverlay.querySelector(".modal-header h2");
        if (header) header.textContent = "Post Preview";

        els.taDetailModalOverlay.classList.remove("hidden");
        return;
    }

    showError((r.data && r.data.msg) || r.error || "Failed to get job details");
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
          <p>View application records and approve or reject.</p>
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
                    String(app.status).toLowerCase().includes("pass") || String(app.status).includes("approved")
                        ? "badge-success"
                        : String(app.status).toLowerCase().includes("reject") || String(app.status).includes("rejected")
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
                await auditApplication(btn.dataset.applicationId, 1, "Approved", btn.dataset.jobId);
            });
        });

        rejectBtns.forEach(btn => {
            btn.addEventListener("click", async () => {
                await auditApplication(btn.dataset.applicationId, 2, "Rejected", btn.dataset.jobId);
            });
        });

        return;
    }

    showError((r.data && r.data.msg) || r.error || "Failed to load applicants list");
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
        alert(r.data.msg || "Audit successful");

        state.logs.unshift({
            id: Date.now(),
            type: "audit",
            title: auditStatus === 1 ? "Application Approved" : "Application Rejected",
            actor: state.currentAdmin.name,
            time: new Date().toLocaleString(),
            detail: `Application ${applicationId} for job ${jobId} was ${auditStatus === 1 ? "approved" : "rejected"}.`
        });

        await openPostApplicantsModal(jobId);
        renderRequestDot();
        return;
    }

    showError((r.data && r.data.msg) || r.error || "Audit failed");
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
        time: new Date().toLocaleString(),
        detail: `${req.realName}'s request from ${req.currentRole} to ${req.targetRole} was ${nextStatus}.`
    });

    if (nextStatus === "approved") {
        const user = state.backendUsers.find(item => item.username === req.username);
        if (user) user.userType = req.targetRole === "TA" ? 1 : req.targetRole === "MO" ? 2 : 3;
    }

    renderRequestDot();
    openRequestsModal();
}

function bindModalEvents() {
    const closeTaDetailModalBtn = document.getElementById("closeTaDetailModalBtn");
    const closeStatsModalBtn = document.getElementById("closeStatsModalBtn");
    const closeUsersModalBtn = document.getElementById("closeUsersModalBtn");
    const closeUserDetailModalBtn = document.getElementById("closeUserDetailModalBtn");
    const closeRequestsModalBtn = document.getElementById("closeRequestsModalBtn");
    const closeAllJobsModalBtn = document.getElementById("closeAllJobsModalBtn");
    const closeJobDetailModalBtn = document.getElementById("closeJobDetailModalBtn");

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

    if (closeRequestsModalBtn) {
        closeRequestsModalBtn.addEventListener("click", closeRequestsModal);
    }

    if (closeAllJobsModalBtn) {
        closeAllJobsModalBtn.addEventListener("click", closeAllJobsModal);
    }

    if (closeJobDetailModalBtn) {
        closeJobDetailModalBtn.addEventListener("click", closeJobDetailModal);
    }

    if (els.openRequestsBtn) {
        els.openRequestsBtn.addEventListener("click", openRequestsModal);
    }

    // 退出登录按钮
    if (document.getElementById("logoutBtn")) {
        document.getElementById("logoutBtn").addEventListener("click", logout);
    }

    [
        [els.taDetailModalOverlay, closeTADetailModal],
        [els.statsModalOverlay, closeStatsModal],
        [els.usersModalOverlay, closeUsersModal],
        [els.userDetailModalOverlay, closeUserDetailModal],
        [els.requestsModalOverlay, closeRequestsModal],
        [els.allJobsModalOverlay, closeAllJobsModal],
        [els.jobDetailModalOverlay, closeJobDetailModal]
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
        if (!els.requestsModalOverlay.classList.contains("hidden")) closeRequestsModal();
        if (!els.allJobsModalOverlay.classList.contains("hidden")) closeAllJobsModal();
        if (!els.jobDetailModalOverlay.classList.contains("hidden")) closeJobDetailModal();
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    cacheElements();
    bindModalEvents();

    const ok = await loadLoginUser(); // 已实现后端接口连接
    if (!ok) return;

    // 修复问题3：调整数据加载顺序
    // 先加载申请记录（用于计算TA工作负荷），再加载岗位和用户数据
    await loadAllApplications(); // 先加载申请记录
    await loadAllJobs(); // 再加载岗位列表
    await loadAllUsers(); // 用户列表加载时会使用申请记录来计算TA工作负荷
    await loadOpenJobs(); // 开放岗位列表
    state.logs = generateMockLogs(); // 生成模拟日志数据
    render();
});