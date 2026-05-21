const BASE_URL = '/tapj';

    const state = {
      currentUser: null,
      currentUserDisplayName: 'MO User',
      jobs: [],
      recommendedByJob: {},
      recommendLoadingByJob: {},
      availableTags: [],
      selectedTags: [],
      tagLoadWarned: false,
      applicantSearchByJob: {},
      editingJobId: null,
      deletingJobId: null,
      viewingApplicant: null,
      auditBusyByJob: {},
      deleteModalMode: 'confirm_delete',
      deleteApprovedApplicants: []
    };

    const FALLBACK_TAGS = [
      'Python',
      'Java',
      'C++',
      'JavaScript',
      'English',
      'Machine Learning',
      'Data Analysis',
      'Teaching',
      'Communication',
      'Research'
    ];
    const MAX_WEEKLY_HOURS = 7 * 24;

    const dom = {
      headerRealName: document.getElementById('headerRealName'),
      btnMessageCenter: document.getElementById('btnMessageCenter'),
      btnLogout: document.getElementById('btnLogout'),
      btnOpenCreate: document.getElementById('btnOpenCreate'),
      btnOpenCreateFromPencil: document.getElementById('btnOpenCreateFromPencil'),
      profileUserLine: document.getElementById('profileUserLine'),
      statJobCount: document.getElementById('statJobCount'),
      statPendingCount: document.getElementById('statPendingCount'),
      jobCards: document.getElementById('jobCards'),
      emptyJobs: document.getElementById('emptyJobs'),
      toast: document.getElementById('toast'),

      jobModal: document.getElementById('jobModal'),
      jobModalTitle: document.getElementById('jobModalTitle'),
      formCourseName: document.getElementById('formCourseName'),
      formHoursPerWeek: document.getElementById('formHoursPerWeek'),
      formMaxCapacity: document.getElementById('formMaxCapacity'),
      formApplyDeadline: document.getElementById('formApplyDeadline'),
      formRequirements: document.getElementById('formRequirements'),
      formTagOptions: document.getElementById('formTagOptions'),
      formTags: document.getElementById('formTags'),
      btnSaveJob: document.getElementById('btnSaveJob'),

      applicantModal: document.getElementById('applicantModal'),
      applicantModalTitle: document.getElementById('applicantModalTitle'),
      applicantModalBody: document.getElementById('applicantModalBody'),

      deleteModal: document.getElementById('deleteModal'),
      deleteModalMessage: document.getElementById('deleteModalMessage'),
      btnDeleteCancel: document.getElementById('btnDeleteCancel'),
      btnConfirmDelete: document.getElementById('btnConfirmDelete')
    };

    function escapeHtml(v) {
      if (v === null || v === undefined) return '';
      return String(v)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    let toastTimer = null;

    function showToast(message, tone) {
      if (!dom.toast) {
        return;
      }
      dom.toast.textContent = message;
      dom.toast.classList.remove('toast-info', 'toast-warning', 'toast-success');
      if (tone === 'warning') {
        dom.toast.classList.add('toast-warning');
      } else if (tone === 'success') {
        dom.toast.classList.add('toast-success');
      } else {
        dom.toast.classList.add('toast-info');
      }
      dom.toast.classList.add('show');
      if (toastTimer) {
        window.clearTimeout(toastTimer);
      }
      toastTimer = window.setTimeout(() => {
        dom.toast.classList.remove('show');
      }, 3200);
    }

    function openModal(el) {
      if (!el) return;
      el.classList.add('show');
    }

    function closeModal(el) {
      if (!el) return;
      el.classList.remove('show');
      if (el === dom.deleteModal) {
        state.deleteModalMode = 'confirm_delete';
        state.deleteApprovedApplicants = [];
        configureDeleteModalForDelete();
      }
    }

    function bindModalClose() {
      document.querySelectorAll('[data-close]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-close');
          const target = document.getElementById(id);
          if (target) closeModal(target);
        });
      });

      [dom.jobModal, dom.applicantModal, dom.deleteModal].forEach((modal) => {
        if (!modal) return;
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal(modal);
        });
      });
    }

    async function request(url, options = {}) {
      try {
        const res = await fetch(BASE_URL + url, {
          credentials: 'include',
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

    function appStatusToWord(status) {
      if (status === 0 || status === '0' || status === 'pending') return 'pending';
      if (status === 1 || status === '1' || status === 'approved') return 'approved';
      if (status === 2 || status === '2' || status === 'rejected') return 'rejected';
      return 'pending';
    }

    function icon(name, cls) {
      const c = cls || 'icon-svg';
      if (name === 'edit') {
        return '<svg class="' + c + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path></svg>';
      }
      if (name === 'trash') {
        return '<svg class="' + c + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>';
      }
      if (name === 'share') {
        return '<svg class="' + c + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><path d="M8.59 13.51l6.83 3.98"></path><path d="M15.41 6.51L8.59 10.49"></path></svg>';
      }
      if (name === 'check') {
        return '<svg class="' + c + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>';
      }
      if (name === 'x') {
        return '<svg class="' + c + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"></path><path d="M6 6l12 12"></path></svg>';
      }
      if (name === 'search') {
        return '<svg class="' + c + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>';
      }
      if (name === 'message') {
        return '<svg class="' + c + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
      }
      return '';
    }

    function buildMessageCenterUrl(targetUserId, targetUserName, job) {
      const params = new URLSearchParams();
      if (targetUserId) params.append('targetUserId', String(targetUserId));
      if (targetUserName) params.append('targetUserName', String(targetUserName));
      if (job && job.id) params.append('jobId', String(job.id));
      if (job && job.courseName) params.append('jobTitle', String(job.courseName));

      const query = params.toString();
      return 'message.html' + (query ? ('?' + query) : '');
    }

    function gotoMessageCenter(targetUserId, targetUserName, job) {
      window.location.href = buildMessageCenterUrl(targetUserId, targetUserName, job);
    }

    function toEnglishDisplayName(realName, username) {
      const name = (realName || '').trim();
      if (!name) return username || 'MO User';

      const knownMap = {
        '鏉庤€佸笀': 'Prof. Li',
        '寮犱笁': 'Zhang San'
      };
      if (knownMap[name]) return knownMap[name];

      // If name contains non-ASCII characters and no explicit mapping,
      // fall back to username to keep the UI fully English.
      if (/[^\x00-\x7F]/.test(name)) {
        return username || 'MO User';
      }
      return name;
    }

    function normalizeUserType(userType) {
      if (userType === null || userType === undefined) return null;

      if (typeof userType === 'number') return userType;

      const text = String(userType).trim().toLowerCase();
      if (text === 'ta' || text === '1') return 1;
      if (text === 'mo' || text === '2') return 2;
      if (text === 'admin' || text === '3') return 3;

      const numeric = Number(text);
      return Number.isFinite(numeric) ? numeric : null;
    }

    function getRawApplyStatus(app) {
      if (app && app.status !== undefined && app.status !== null) return app.status;
      if (app && app.applyStatus !== undefined && app.applyStatus !== null) return app.applyStatus;
      return null;
    }

    function mapApplicant(rawApp) {
      const normalizedStatus = appStatusToWord(getRawApplyStatus(rawApp));
      const resolvedTaUserId = rawApp.taUserId || rawApp.taId || rawApp.userId || rawApp.uid || '';
      const resolvedTaName = rawApp.taRealName || rawApp.realName || rawApp.taName || ('TA #' + (resolvedTaUserId || '?'));
      return {
        applicationId: rawApp.applicationId,
        taUserId: resolvedTaUserId,
        name: resolvedTaName,
        studentId: rawApp.studentId || rawApp.taStudentId || '',
        major: rawApp.major || rawApp.taMajor || 'Major not provided',
        education: rawApp.education || rawApp.taEducation || '',
        status: normalizedStatus,
        remarks: rawApp.remark || rawApp.remarks || '',
        selfIntro: rawApp.selfIntro || rawApp.taSelfIntro || '',
        email: rawApp.email || rawApp.taEmail || 'Email not provided',
        resumeUrl: rawApp.resumeUrl || rawApp.resume || ''
      };
    }

    function parseTagsText(text) {
      if (text === null || text === undefined) return [];
      const source = Array.isArray(text) ? text.join(',') : String(text);
      const seen = Object.create(null);
      return source
        .split(/[\n,，;；|、]+/)
        .map((item) => item.trim().replace(/\s+/g, ' '))
        .filter((item) => item.length > 0)
        .filter((item) => {
          const key = item.toLowerCase();
          if (seen[key]) return false;
          seen[key] = true;
          return true;
        });
    }

    function collectJobTags(rawJob) {
      const candidates = [];
      if (Array.isArray(rawJob.tags)) candidates.push(rawJob.tags.join(','));
      if (typeof rawJob.tags === 'string') candidates.push(rawJob.tags);
      if (typeof rawJob.tagList === 'string') candidates.push(rawJob.tagList);
      const parsedTags = parseTagsText(candidates.join(','));
      if (parsedTags.length > 0) return parsedTags;
      if (rawJob.belongModule) return parseTagsText(rawJob.belongModule);
      return [];
    }

    function isTagSelected(tag) {
      const t = String(tag || '').toLowerCase();
      return state.selectedTags.some((item) => item.toLowerCase() === t);
    }

    function getRenderableTagOptions() {
      const combined = state.availableTags.concat(state.selectedTags);
      return parseTagsText(combined.join(','));
    }

    function renderTagOptions() {
      if (!dom.formTagOptions) return;

      const options = getRenderableTagOptions();
      if (options.length === 0) {
        dom.formTagOptions.innerHTML = '<div class="tag-picker-empty">No tags available from backend.</div>';
        return;
      }

      dom.formTagOptions.innerHTML = options.map((tag) => {
        return '<button type="button" class="tag-option' + (isTagSelected(tag) ? ' active' : '') + '" data-tag="' + escapeHtml(tag) + '">' + escapeHtml(tag) + '</button>';
      }).join('');
    }

    function setSelectedTags(tags) {
      state.selectedTags = parseTagsText(tags);
      if (dom.formTags) {
        dom.formTags.value = state.selectedTags.join(', ');
      }
      renderTagOptions();
    }

    function toggleSelectedTag(tag) {
      const t = String(tag || '').trim();
      if (!t) return;

      if (isTagSelected(t)) {
        state.selectedTags = state.selectedTags.filter((item) => item.toLowerCase() !== t.toLowerCase());
      } else {
        state.selectedTags = parseTagsText(state.selectedTags.concat([t]).join(','));
      }

      if (dom.formTags) {
        dom.formTags.value = state.selectedTags.join(', ');
      }
      renderTagOptions();
    }

    // 宸插疄鐜板悗绔帴鍙ｈ繛鎺?
    // GET /user?action=listTags
    async function loadAvailableTags() {
      if (dom.formTagOptions) {
        dom.formTagOptions.innerHTML = '<div class="tag-picker-empty">Loading tags...</div>';
      }

      const r = await request('/user?action=listTags');
      let apiTags = [];
      if (r.ok && r.data && r.data.code === 200 && Array.isArray(r.data.data)) {
        apiTags = parseTagsText(r.data.data.join(','));
      }

      if (apiTags.length > 0) {
        state.availableTags = apiTags;
      } else {
        state.availableTags = parseTagsText(FALLBACK_TAGS.join(','));
        if (!state.tagLoadWarned) {
          state.tagLoadWarned = true;
          showToast('Tag API unavailable. Showing fallback tags.');
        }
      }

      renderTagOptions();
    }

    function normalizeDeadlineDate(deadlineRaw) {
      if (deadlineRaw === null || deadlineRaw === undefined) return '';
      const text = String(deadlineRaw).trim();
      if (!text) return '';

      const directMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (directMatch) {
        return directMatch[1] + '-' + directMatch[2] + '-' + directMatch[3];
      }

      const embeddedMatch = text.match(/(\d{4})-(\d{2})-(\d{2})/);
      if (embeddedMatch) {
        return embeddedMatch[1] + '-' + embeddedMatch[2] + '-' + embeddedMatch[3];
      }

      return '';
    }

    function mapJob(rawJob, applicants) {
      const approvedCount = applicants.filter((a) => a.status === 'approved').length;
      const tags = collectJobTags(rawJob);

      return {
        id: String(rawJob.jobId),
        courseName: rawJob.jobName || 'Untitled Position',
        hoursPerWeek: Number(rawJob.workHoursWeekly || 0),
        requirements: rawJob.jobDesc || '',
        tags,
        recruitedCount: Number(rawJob.hiredNum || approvedCount),
        maxCapacity: Number(rawJob.recruitNum || 1),
        jobStatus: rawJob.jobStatus,
        jobType: rawJob.jobType,
        belongModule: rawJob.belongModule || '',
        deadline: normalizeDeadlineDate(rawJob.applyDeadline || ''),
        applicants
      };
    }

    // 宸插疄鐜板悗绔帴鍙ｈ繛鎺?
    // GET /user?action=getLoginUser
    async function loadCurrentUser() {
      const r = await request('/user?action=getLoginUser');
      if (!(r.ok && r.data && r.data.code === 200 && r.data.data)) {
        alert('Login expired. Please sign in again.');
        window.location.href = 'index.html';
        return false;
      }

      state.currentUser = r.data.data;
      const userType = normalizeUserType(state.currentUser.userType);
      if (userType !== 2 && userType !== 3) {
        alert('Only MO/Admin can access this page.');
        window.location.href = 'main.html';
        return false;
      }

      const displayName = toEnglishDisplayName(state.currentUser.realName, state.currentUser.username);
      state.currentUserDisplayName = displayName;
      if (dom.headerRealName) {
        dom.headerRealName.textContent = displayName;
      }
      if (dom.profileUserLine) {
        dom.profileUserLine.textContent = displayName;
      }
      return true;
    }

    // 宸插疄鐜板悗绔帴鍙ｈ繛鎺?
    // POST /user?action=logout
    async function logout() {
      await request('/user?action=logout', { method: 'POST' });
      alert('Signed out successfully.');
      window.location.href = 'index.html';
    }

    // 宸插疄鐜板悗绔帴鍙ｈ繛鎺?
    // GET /job?action=listMy
    // GET /application?action=listByJob&jobId=...
    async function loadJobsWithApplicants() {
      const jobsRes = await request('/job?action=listMy');
      if (!(jobsRes.ok && jobsRes.data && jobsRes.data.code === 200)) {
        state.jobs = [];
        renderAll();
        return;
      }

      const rawJobs = Array.isArray(jobsRes.data.data) ? jobsRes.data.data : [];
      const currentUserId = state.currentUser
        ? (state.currentUser.userId || state.currentUser.uid || state.currentUser.id || '')
        : '';

      // Enforce strict owner-only rendering on frontend side as a safety net,
      // even though /job?action=listMy should already be filtered by backend.
      const ownerOnlyJobs = currentUserId
        ? rawJobs.filter((job) => {
            const ownerId = job.publisherMoId || job.publisherId || job.publisherUserId || job.moId || job.userId;
            if (!ownerId) return false;
            return String(ownerId) === String(currentUserId);
          })
        : rawJobs;

      const resultJobs = [];

      for (let i = 0; i < ownerOnlyJobs.length; i += 1) {
        const rawJob = ownerOnlyJobs[i];
        const appRes = await request('/application?action=listByJob&jobId=' + encodeURIComponent(rawJob.jobId));
        let applicants = [];
        if (appRes.ok && appRes.data && appRes.data.code === 200) {
          applicants = (appRes.data.data || []).map(mapApplicant);
        }
        resultJobs.push(mapJob(rawJob, applicants));
      }

      state.jobs = resultJobs;
      state.recommendedByJob = {};
      state.recommendLoadingByJob = {};
      renderAll();
    }

    function pendingCountAll() {
      return state.jobs.reduce((sum, j) => {
        return sum + j.applicants.filter((a) => a.status === 'pending').length;
      }, 0);
    }

    function getRemainingCapacity(job) {
      const maxCapacity = Number(job && job.maxCapacity);
      const recruitedCount = Number(job && job.recruitedCount);

      if (!Number.isFinite(maxCapacity) || maxCapacity <= 0) {
        return 0;
      }

      const normalizedMax = Math.floor(maxCapacity);
      const normalizedRecruited = Number.isFinite(recruitedCount)
        ? Math.max(0, Math.floor(recruitedCount))
        : 0;
      return Math.max(0, normalizedMax - normalizedRecruited);
    }

    function showAcceptAllBlockedToast(blockReason, pendingCount, remainingCapacity) {
      if (blockReason === 'pending_exceeds') {
        const rejectAtLeast = Math.max(0, pendingCount - remainingCapacity);
        showToast(
          'Cannot accept all now: pending ' + pendingCount + ', remaining slots ' + remainingCapacity + '. Reject at least ' + rejectAtLeast + ' first.',
          'warning'
        );
        return;
      }
      if (blockReason === 'no_capacity') {
        showToast(
          'This position is already full. Accepted decisions are final, so Accept All is unavailable.',
          'warning'
        );
        return;
      }
      showToast('No pending applicants.', 'warning');
    }

    function renderAll() {
      dom.statJobCount.textContent = String(state.jobs.length);
      dom.statPendingCount.textContent = String(pendingCountAll());

      if (state.jobs.length === 0) {
        dom.jobCards.innerHTML = '';
        dom.emptyJobs.classList.remove('hidden');
      } else {
        dom.emptyJobs.classList.add('hidden');
        renderJobCards();
      }
    }

    function applicantStatusBadge(app) {
      if (app.status === 'approved') {
        return '<span class="text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1 status-approved">' +
          '<span>' + icon('check', 'icon-svg-sm') + '</span><span>APPROVED</span></span>';
      }
      if (app.status === 'rejected') {
        return '<span class="text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1 status-rejected">' +
          '<span>' + icon('x', 'icon-svg-sm') + '</span><span>REJECTED</span></span>';
      }
      return '';
    }

    function renderJobCards() {
      dom.jobCards.innerHTML = state.jobs.map((job) => {
        const currentSearch = (state.applicantSearchByJob[job.id] || '').toLowerCase();
        const visibleApplicants = job.applicants.filter((app) => {
          if (!currentSearch) return true;
          return app.name.toLowerCase().includes(currentSearch)
            || app.major.toLowerCase().includes(currentSearch)
            || String(app.taUserId).toLowerCase().includes(currentSearch);
        });

        const pendingCount = job.applicants.filter((a) => a.status === 'pending').length;
        const remainingCapacity = getRemainingCapacity(job);
        const deadlineLabel = job.deadline || 'N/A';
        const canAcceptAll = pendingCount > 0 && pendingCount <= remainingCapacity;
        let acceptAllBlockReason = '';
        let acceptAllTitle = 'Accept all pending applicants.';
        if (pendingCount === 0) {
          acceptAllBlockReason = 'no_pending';
          acceptAllTitle = 'No pending applicants.';
        } else if (remainingCapacity <= 0) {
          acceptAllBlockReason = 'no_capacity';
          acceptAllTitle = 'Position is full. Accept All is unavailable.';
        } else if (pendingCount > remainingCapacity) {
          acceptAllBlockReason = 'pending_exceeds';
          acceptAllTitle = 'Only ' + remainingCapacity + ' slot(s) left. Reject some pending applicants first.';
        }

        return ''
          + '<article class="soft-card job-card rounded-[28px] p-8">'
          + '  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-5">'
          + '    <div class="flex items-center gap-4 min-w-0">'
          + '      <div class="flex items-center gap-1 shrink-0">'
          + '        <div class="tooltip-anchor"><button class="icon-btn btn-edit-job" data-jobid="' + escapeHtml(job.id) + '">' + icon('edit', 'icon-svg-sm') + '</button><span class="tooltip">Edit Position</span></div>'
          + '        <div class="tooltip-anchor"><button class="icon-btn danger btn-delete-job" data-jobid="' + escapeHtml(job.id) + '">' + icon('trash', 'icon-svg-sm') + '</button><span class="tooltip">Delete Position</span></div>'
          + '        <div class="tooltip-anchor"><button class="icon-btn good btn-share-job" data-jobid="' + escapeHtml(job.id) + '">' + icon('share', 'icon-svg-sm') + '</button><span class="tooltip">Copy Share Link</span></div>'
          + '      </div>'
          + '      <h3 class="text-2xl font-bold tracking-tight truncate">' + escapeHtml(job.courseName) + '</h3>'
          + '    </div>'
          + '    <div class="flex items-center gap-2 self-start sm:self-auto">'
          + '      <button class="text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition btn-match-job" data-jobid="' + escapeHtml(job.id) + '">Recommend TAs</button>'
          + '      <button class="text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition btn-accept-all' + (canAcceptAll ? '' : ' blocked') + '" data-jobid="' + escapeHtml(job.id) + '" data-block-reason="' + escapeHtml(acceptAllBlockReason) + '" data-pending="' + escapeHtml(String(pendingCount)) + '" data-remaining="' + escapeHtml(String(remainingCapacity)) + '" title="' + escapeHtml(acceptAllTitle) + '">Accept All</button>'
          + '      <button class="text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition btn-reject-all" data-jobid="' + escapeHtml(job.id) + '">Reject All</button>'
          + '    </div>'
          + '  </div>'

          + '  <div class="flex flex-wrap items-center gap-4 mb-6">'
          + '    <div class="pill"><span class="dot dot-purple"></span><span>' + escapeHtml(state.currentUserDisplayName || 'MO') + '</span></div>'
          + '    <div class="pill"><span class="dot dot-green"></span><span>' + escapeHtml(job.hoursPerWeek) + ' hrs/wk</span></div>'
          + '    <div class="pill"><span class="dot dot-blue"></span><span>' + escapeHtml(job.recruitedCount) + ' / ' + escapeHtml(job.maxCapacity) + ' Recruited</span></div>'
          + '    <div class="pill"><span class="dot dot-amber"></span><span>Apply By ' + escapeHtml(deadlineLabel) + '</span></div>'
          + '  </div>'

          + '  <div class="flex flex-wrap items-center gap-2 mb-8">'
          + job.tags.map((tag) => '<span class="text-[13px] font-medium text-slate-600 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full break-all">' + escapeHtml(tag) + '</span>').join('')
          + '  </div>'

          + '  <div class="border-t border-slate-100 pt-6">'
          + '    <div class="flex items-center justify-between mb-4 px-1 gap-3">'
          + '      <h4 class="text-sm font-bold text-slate-900">Applicants (' + escapeHtml(job.applicants.length) + ')</h4>'
          + '      <div class="relative">'
          + '        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">' + icon('search', 'icon-svg-sm') + '</span>'
          + '        <input type="text" data-jobid="' + escapeHtml(job.id) + '" value="' + escapeHtml(state.applicantSearchByJob[job.id] || '') + '" placeholder="Search applicants..." class="job-app-search w-48 pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400 text-slate-700" />'
          + '      </div>'
          + '    </div>'

          + '    <div class="max-h-[280px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">'
          + (visibleApplicants.length === 0
              ? '<div class="text-center py-6 text-sm text-slate-500">No matching applicants.</div>'
              : visibleApplicants.map((app) => {
                  return ''
                    + '<div class="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer group app-row" data-jobid="' + escapeHtml(job.id) + '" data-appid="' + escapeHtml(app.applicationId) + '">'
                    + '  <div class="flex items-center gap-3 min-w-0">'
                    + '    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold shadow-inner shrink-0">' + escapeHtml(app.name.charAt(0)) + '</div>'
                    + '    <div class="min-w-0">'
                    + '      <div class="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">' + escapeHtml(app.name) + '</div>'
                    + '      <div class="text-xs text-slate-500 truncate">' + escapeHtml(app.major) + '</div>'
                    + '    </div>'
                    + (app.resumeUrl
                        ? '<div class="hidden sm:flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md ml-2 shrink-0">Resume</div>'
                        : '')
                    + '  </div>'
                    + '  <div class="flex items-center gap-2 shrink-0 app-action-zone">'
                    + '<button class="icon-btn btn-chat-app" data-jobid="' + escapeHtml(job.id) + '" data-uid="' + escapeHtml(app.taUserId) + '" data-name="' + escapeHtml(app.name) + '">' + icon('message', 'icon-svg-sm') + '</button>'
                    + (app.status === 'pending'
                        ? '<button class="icon-btn good btn-approve-app" data-jobid="' + escapeHtml(job.id) + '" data-appid="' + escapeHtml(app.applicationId) + '">' + icon('check', 'icon-svg-sm') + '</button>'
                          + '<button class="icon-btn danger btn-reject-app" data-jobid="' + escapeHtml(job.id) + '" data-appid="' + escapeHtml(app.applicationId) + '">' + icon('x', 'icon-svg-sm') + '</button>'
                        : applicantStatusBadge(app))
                    + '  </div>'
                    + '</div>';
                }).join(''))
          + '    </div>'
          + '  </div>'

          + '</article>';
      }).join('');

      bindJobCardEvents();
    }

    function findJob(jobId) {
      return state.jobs.find((j) => String(j.id) === String(jobId));
    }

    function findApplicant(jobId, appId) {
      const job = findJob(jobId);
      if (!job) return null;
      return job.applicants.find((a) => String(a.applicationId) === String(appId)) || null;
    }

    function findJobByApplicationId(appId) {
      const target = String(appId || '');
      for (let i = 0; i < state.jobs.length; i += 1) {
        const job = state.jobs[i];
        const exists = job.applicants.some((a) => String(a.applicationId) === target);
        if (exists) return job;
      }
      return null;
    }

    function isJobEnded(job) {
      if (!job) return false;
      const statusCode = Number(job.jobStatus);
      if (statusCode === 1) return true;

      const normalizedDeadline = normalizeDeadlineDate(job.deadline);
      if (!normalizedDeadline) return false;
      return normalizedDeadline < getTodayDateText();
    }

    function configureDeleteModalForDelete() {
      state.deleteModalMode = 'confirm_delete';
      if (dom.deleteModalMessage) {
        dom.deleteModalMessage.textContent = 'Are you sure you want to delete this position? This action cannot be undone.';
      }
      if (dom.btnDeleteCancel) {
        dom.btnDeleteCancel.textContent = 'Cancel';
      }
      if (dom.btnConfirmDelete) {
        dom.btnConfirmDelete.classList.remove('hidden', 'bg-slate-900');
        dom.btnConfirmDelete.classList.add('bg-red-600');
        dom.btnConfirmDelete.textContent = 'Yes, Delete';
        dom.btnConfirmDelete.disabled = false;
      }
    }

    function configureDeleteModalForApprovedApplicants(approvedApplicants) {
      state.deleteModalMode = 'contact_approved';
      state.deleteApprovedApplicants = Array.isArray(approvedApplicants) ? approvedApplicants.slice() : [];
      if (dom.deleteModalMessage) {
        dom.deleteModalMessage.textContent = 'This job already has approved applications and cannot be deleted. Please contact the approved applicant(s) and ask them to withdraw before deleting this job.';
      }
      if (dom.btnDeleteCancel) {
        dom.btnDeleteCancel.textContent = 'Cancel';
      }
      if (dom.btnConfirmDelete) {
        dom.btnConfirmDelete.classList.remove('hidden', 'bg-red-600');
        dom.btnConfirmDelete.classList.add('bg-slate-900');
        dom.btnConfirmDelete.textContent = 'Contact Applicant';
        dom.btnConfirmDelete.disabled = false;
      }
    }

    function bindJobCardEvents() {
      dom.jobCards.querySelectorAll('.job-app-search').forEach((input) => {
        input.addEventListener('input', () => {
          const jobId = input.getAttribute('data-jobid');
          state.applicantSearchByJob[jobId] = input.value;
          renderJobCards();
        });
      });

      dom.jobCards.querySelectorAll('.btn-share-job').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const jobId = btn.getAttribute('data-jobid');
          const url = window.location.origin + window.location.pathname + '#job-' + jobId;
          try {
            await navigator.clipboard.writeText(url);
            showToast('Share link copied to clipboard.');
          } catch (e) {
            showToast('Unable to copy. Please copy manually.');
          }
        });
      });

      dom.jobCards.querySelectorAll('.btn-edit-job').forEach((btn) => {
        btn.addEventListener('click', () => {
          const jobId = btn.getAttribute('data-jobid');
          openJobModal(jobId);
        });
      });

      dom.jobCards.querySelectorAll('.btn-delete-job').forEach((btn) => {
        btn.addEventListener('click', () => {
          const jobId = btn.getAttribute('data-jobid');
          const job = findJob(jobId);
          if (!job) {
            showToast('Job not found.', 'warning');
            return;
          }

          const approvedApplicants = job.applicants.filter((a) => a.status === 'approved');
          const pendingApplicants = job.applicants.filter((a) => a.status === 'pending');

          if (isJobEnded(job)) {
            state.deletingJobId = jobId;
            state.deleteApprovedApplicants = [];
            configureDeleteModalForDelete();
            openModal(dom.deleteModal);
            return;
          }

          if (approvedApplicants.length > 0) {
            state.deletingJobId = jobId;
            configureDeleteModalForApprovedApplicants(approvedApplicants);
            openModal(dom.deleteModal);
            return;
          }

          if (pendingApplicants.length > 0) {
            showToast('This job has pending applications. Please process them before deleting.', 'warning');
            return;
          }

          state.deletingJobId = jobId;
          state.deleteApprovedApplicants = [];
          configureDeleteModalForDelete();
          openModal(dom.deleteModal);
        });
      });

      dom.jobCards.querySelectorAll('.btn-match-job').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const jobId = btn.getAttribute('data-jobid');
          await openMatchCandidatesModal(jobId);
        });
      });

      dom.jobCards.querySelectorAll('.btn-accept-all').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const blockReason = btn.getAttribute('data-block-reason') || '';
          if (blockReason) {
            const pendingCount = Number(btn.getAttribute('data-pending') || 0);
            const remainingCapacity = Number(btn.getAttribute('data-remaining') || 0);
            showAcceptAllBlockedToast(blockReason, pendingCount, remainingCapacity);
            return;
          }
          const jobId = btn.getAttribute('data-jobid');
          await batchAudit(jobId, 1);
        });
      });

      dom.jobCards.querySelectorAll('.btn-reject-all').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const jobId = btn.getAttribute('data-jobid');
          await batchAudit(jobId, 2);
        });
      });

      dom.jobCards.querySelectorAll('.btn-approve-app').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const jobId = btn.getAttribute('data-jobid');
          const appId = btn.getAttribute('data-appid');
          await auditApplication(appId, 1, jobId);
        });
      });

      dom.jobCards.querySelectorAll('.btn-reject-app').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const appId = btn.getAttribute('data-appid');
          await auditApplication(appId, 2);
        });
      });

      dom.jobCards.querySelectorAll('.btn-chat-app').forEach((btn) => {
        btn.addEventListener('click', () => {
          const jobId = btn.getAttribute('data-jobid');
          const taUserId = btn.getAttribute('data-uid');
          const taName = btn.getAttribute('data-name') || 'TA';
          const job = findJob(jobId);
          gotoMessageCenter(taUserId, taName, job);
        });
      });

      dom.jobCards.querySelectorAll('.app-row').forEach((row) => {
        row.addEventListener('click', (e) => {
          if (e.target.closest('.app-action-zone')) return;
          const jobId = row.getAttribute('data-jobid');
          const appId = row.getAttribute('data-appid');
          openApplicantModal(jobId, appId);
        });
      });
    }

    function resetJobForm() {
      dom.formCourseName.value = '';
      dom.formHoursPerWeek.value = '10';
      dom.formMaxCapacity.value = '1';
      if (dom.formApplyDeadline) {
        dom.formApplyDeadline.value = getDefaultDeadlineDate();
        dom.formApplyDeadline.min = getTodayDateText();
      }
      dom.formRequirements.value = '';
      setSelectedTags([]);
    }

    function openJobModal(jobIdOrNull) {
      loadAvailableTags();
      state.editingJobId = jobIdOrNull || null;
      if (!state.editingJobId) {
        dom.jobModalTitle.textContent = 'Post a New Position';
        dom.btnSaveJob.textContent = 'Post Position';
        resetJobForm();
      } else {
        dom.jobModalTitle.textContent = 'Edit Position';
        dom.btnSaveJob.textContent = 'Save Changes';
        const job = findJob(state.editingJobId);
        if (job) {
          dom.formCourseName.value = job.courseName;
          dom.formHoursPerWeek.value = String(job.hoursPerWeek);
          dom.formMaxCapacity.value = String(job.maxCapacity);
          if (dom.formApplyDeadline) {
            dom.formApplyDeadline.value = normalizeDeadlineDate(job.deadline) || getDefaultDeadlineDate();
            dom.formApplyDeadline.min = getTodayDateText();
          }
          dom.formRequirements.value = job.requirements || '';
          setSelectedTags(job.tags);
        }
      }
      openModal(dom.jobModal);
    }

    function formatDateYYYYMMDD(d) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return y + '-' + m + '-' + day;
    }

    function getTodayDateText() {
      return formatDateYYYYMMDD(new Date());
    }

    function getDefaultDeadlineDate() {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      return formatDateYYYYMMDD(d);
    }

    function deriveBelongModule(courseName, tagsText) {
      const c = (courseName || '').trim();
      if (c) {
        const parts = c.split(':');
        if (parts[0] && parts[0].trim()) return parts[0].trim();
        return c;
      }

      const tags = parseTagsText(tagsText || '');
      if (tags.length > 0) return tags[0];
      return 'General';
    }

    // 宸插疄鐜板悗绔帴鍙ｈ繛鎺?
    // POST /job?action=publish
    // POST /job?action=update
    async function saveJob() {
      if (!dom.formCourseName.value.trim()) {
        showToast('Course name is required.');
        return;
      }

      const hoursRaw = dom.formHoursPerWeek.value.trim();
      const capacityRaw = dom.formMaxCapacity.value.trim();
      const deadlineRaw = dom.formApplyDeadline ? dom.formApplyDeadline.value.trim() : '';

      if (!hoursRaw) {
        showToast('Hours/week is required.');
        return;
      }
      const hoursValue = Number(hoursRaw);
      if (!Number.isFinite(hoursValue) || hoursValue <= 0) {
        showToast('Hours/week must be a positive number.');
        return;
      }
      if (hoursValue > MAX_WEEKLY_HOURS) {
        showToast('Hours/week cannot exceed 168.');
        return;
      }

      if (!capacityRaw) {
        showToast('Max capacity is required.');
        return;
      }
      const capacityValue = Number(capacityRaw);
      if (!Number.isInteger(capacityValue) || capacityValue <= 0) {
        showToast('Max capacity must be a positive integer.');
        return;
      }
      if (!deadlineRaw) {
        showToast('Application deadline is required.');
        return;
      }

      const deadlineValue = normalizeDeadlineDate(deadlineRaw);
      if (!deadlineValue) {
        showToast('Application deadline format is invalid.');
        return;
      }

      const parsedDeadline = new Date(deadlineValue + 'T00:00:00');
      if (Number.isNaN(parsedDeadline.getTime()) || formatDateYYYYMMDD(parsedDeadline) !== deadlineValue) {
        showToast('Application deadline is invalid.');
        return;
      }

      const params = new URLSearchParams();
      const courseName = dom.formCourseName.value.trim();
      const selectedTags = parseTagsText(dom.formTags.value);
      const tagsText = selectedTags.join(', ');
      const editingJob = state.editingJobId ? findJob(state.editingJobId) : null;

      // Keep UI identical to target screenshot while satisfying backend APIs.
      const fallbackJobType = editingJob && editingJob.jobType !== undefined && editingJob.jobType !== null
        ? String(editingJob.jobType)
        : '1';
      const autoBelongModule = deriveBelongModule(courseName, tagsText);

      params.append('jobName', dom.formCourseName.value.trim());
      params.append('jobType', fallbackJobType);
      params.append('belongModule', autoBelongModule);
      params.append('jobDesc', dom.formRequirements.value.trim());
      params.append('workHoursWeekly', String(hoursValue));
      params.append('recruitNum', String(capacityValue));
      params.append('applyDeadline', deadlineValue);
      if (tagsText) {
        params.append('tags', tagsText);
      }

      if (state.editingJobId) {
        params.append('jobId', String(state.editingJobId));
        const updateRes = await request('/job?action=update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params
        });

        if (updateRes.ok && updateRes.data) {
          showToast(updateRes.data.msg || 'Position updated.');
        } else {
          showToast('Failed to update position.');
          return;
        }

        if (updateRes.ok && updateRes.data && updateRes.data.code === 200) {
          closeModal(dom.jobModal);
          await loadJobsWithApplicants();
        }
        return;
      }

      const r = await request('/job?action=publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });

      if (r.ok && r.data) {
        showToast(r.data.msg || 'Position posted.');
      } else {
        showToast('Failed to post position.');
      }

      if (r.ok && r.data && r.data.code === 200) {
        closeModal(dom.jobModal);
        await loadJobsWithApplicants();
      }
    }

    async function queryApplicantResumePdf(taUserId) {
      const resumeUrl = BASE_URL + '/user?action=downloadProfilePdf&uid=' + encodeURIComponent(taUserId);
      try {
        const res = await fetch(resumeUrl, {
          method: 'GET',
          credentials: 'include'
        });

        const contentType = (res.headers.get('content-type') || '').toLowerCase();

        // Error payload may come back as JSON with HTTP 200; treat it as failure.
        if (contentType.includes('application/json') || contentType.startsWith('text/')) {
          const rawText = await res.text();
          let parsed = null;
          try {
            parsed = JSON.parse(rawText);
          } catch (e) {
            parsed = null;
          }

          const businessCode = parsed && parsed.code !== undefined && parsed.code !== null
            ? Number(parsed.code)
            : NaN;
          const mappedStatus = Number.isFinite(businessCode) && businessCode >= 400
            ? businessCode
            : (res.ok ? 500 : res.status);

          return {
            ok: false,
            status: mappedStatus,
            message: parsed && parsed.msg ? String(parsed.msg) : ''
          };
        }

        if (res.ok) {
          const blob = await res.blob();
          return { ok: true, blob };
        }

        return { ok: false, status: res.status };
      } catch (e) {
        return { ok: false, error: e.message || 'Network error' };
      }
    }

    function mapMatchedTa(raw) {
      return {
        userId: raw.userId || raw.taUserId || '',
        realName: raw.realName || raw.username || 'Unnamed TA',
        studentId: raw.studentId || '',
        major: raw.major || 'Major not provided',
        education: raw.education || '',
        grade: raw.grade || '',
        email: raw.email || '',
        selfIntro: raw.selfIntro || '',
        profilePdfPath: raw.profilePdfPath || '',
        matchScore: Number(raw.matchScore || 0),
        recommendScore: null,
        tags: Array.isArray(raw.tags) ? raw.tags : parseTagsText(raw.tags || '')
      };
    }

    function mapRecommendedTa(raw) {
      return {
        userId: raw.id || '',
        realName: raw.name || 'Unnamed TA',
        studentId: '',
        major: 'Major not provided',
        education: '',
        grade: '',
        email: '',
        selfIntro: '',
        profilePdfPath: '',
        matchScore: 0,
        recommendScore: Number(raw.score || 0),
        tags: []
      };
    }

    function mergeRecommendedCandidates(recommendedList, detailList) {
      const mergedMap = new Map();

      recommendedList.forEach((item, index) => {
        const key = String(item.userId || '');
        if (!key) return;
        mergedMap.set(key, {
          ...item,
          rank: index + 1
        });
      });

      detailList.forEach((detail) => {
        const key = String(detail.userId || '');
        if (!key) return;
        if (mergedMap.has(key)) {
          const existing = mergedMap.get(key);
          mergedMap.set(key, {
            ...detail,
            ...existing,
            realName: existing.realName || detail.realName,
            major: detail.major || existing.major,
            education: detail.education || existing.education,
            grade: detail.grade || existing.grade,
            email: detail.email || existing.email,
            selfIntro: detail.selfIntro || existing.selfIntro,
            tags: detail.tags.length ? detail.tags : existing.tags
          });
        } else {
          mergedMap.set(key, {
            ...detail,
            rank: null
          });
        }
      });

      const mergedList = Array.from(mergedMap.values());
      mergedList.sort((a, b) => {
        const scoreA = typeof a.recommendScore === 'number' ? a.recommendScore : -1;
        const scoreB = typeof b.recommendScore === 'number' ? b.recommendScore : -1;
        if (scoreB !== scoreA) return scoreB - scoreA;
        return Number(b.matchScore || 0) - Number(a.matchScore || 0);
      });

      return mergedList;
    }

    function formatRecommendScore(ta) {
      if (typeof ta.recommendScore === 'number' && ta.recommendScore > 0) {
        return (ta.recommendScore * 100).toFixed(1) + '% AI Match';
      }
      if (typeof ta.matchScore === 'number' && ta.matchScore > 0) {
        return 'Tag Match +' + String(ta.matchScore);
      }
      return 'Pending score';
    }

    async function loadRecommendationsByJob(jobId, forceReload) {
      const key = String(jobId || '');
      if (!key) return [];

      if (!forceReload && Array.isArray(state.recommendedByJob[key])) {
        return state.recommendedByJob[key];
      }

      if (state.recommendLoadingByJob[key]) {
        return state.recommendedByJob[key] || [];
      }

      state.recommendLoadingByJob[key] = true;

      const [recommendRes, matchRes] = await Promise.all([
        request('/recommend?action=recommendTAsForJob&jobId=' + encodeURIComponent(key) + '&topK=8'),
        request('/job?action=matchTAs&jobId=' + encodeURIComponent(key))
      ]);

      const recommendList = (recommendRes.ok && recommendRes.data && recommendRes.data.code === 200 && Array.isArray(recommendRes.data.data))
        ? recommendRes.data.data.map(mapRecommendedTa)
        : [];

      const detailList = (matchRes.ok && matchRes.data && matchRes.data.code === 200 && Array.isArray(matchRes.data.data))
        ? matchRes.data.data.map(mapMatchedTa)
        : [];

      const merged = mergeRecommendedCandidates(recommendList, detailList);
      state.recommendedByJob[key] = merged.slice(0, 8);
      state.recommendLoadingByJob[key] = false;

      return state.recommendedByJob[key];
    }

    function findRecommendedCandidate(jobId, taUserId) {
      const list = state.recommendedByJob[String(jobId || '')] || [];
      return list.find((item) => String(item.userId) === String(taUserId)) || null;
    }


    function renderMatchCandidates(job, matchList) {
      const sorted = matchList.slice().sort((a, b) => {
        const scoreA = typeof a.recommendScore === 'number' ? a.recommendScore : -1;
        const scoreB = typeof b.recommendScore === 'number' ? b.recommendScore : -1;
        if (scoreB !== scoreA) return scoreB - scoreA;
        return Number(b.matchScore || 0) - Number(a.matchScore || 0);
      });
      const jobTags = (job && Array.isArray(job.tags)) ? job.tags : [];

      if (!sorted.length) {
        dom.applicantModalBody.innerHTML = ''
          + '<div class="space-y-4">'
          + '  <div class="text-sm text-slate-600">No matched TA candidates for this role yet.</div>'
          + '  <div class="text-xs text-slate-400">Try enriching job tags to improve matching results.</div>'
          + '</div>';
        return;
      }

      dom.applicantModalBody.innerHTML = ''
        + '<div class="mb-5 text-sm text-slate-600">'
        + '  Matching based on current job tags: '
        + (jobTags.length > 0
            ? jobTags.map((tag) => '<span class="inline-flex text-xs font-semibold bg-slate-100 border border-slate-200 rounded-full px-2 py-0.5 mr-1 mb-1">' + escapeHtml(tag) + '</span>').join('')
            : '<span class="text-slate-400">No tags</span>')
        + '</div>'
        + '<div class="space-y-3">'
        + sorted.map((ta) => {
          return ''
            + '<div class="p-4 rounded-xl border border-slate-200 bg-white/90">'
            + '  <div class="flex items-start justify-between gap-3">'
            + '    <div>'
            + '      <div class="text-base font-bold text-slate-900">' + escapeHtml(ta.realName) + '</div>'
            + '      <div class="text-sm text-slate-500">' + escapeHtml(ta.major || 'Major not provided') + (ta.grade ? ' · ' + escapeHtml(ta.grade) : '') + '</div>'
            + '      <div class="text-xs text-slate-400 mt-1">TA ID: <span class="mono">' + escapeHtml(ta.userId || '-') + '</span>' + (ta.email ? ' · ' + escapeHtml(ta.email) : '') + '</div>'
            + '    </div>'
            + '    <div class="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 whitespace-nowrap">' + escapeHtml(formatRecommendScore(ta)) + '</div>'
            + '  </div>'
            + '  <div class="mt-2 text-xs text-slate-600 line-clamp-2">' + escapeHtml(ta.selfIntro || 'No introduction available yet.') + '</div>'
            + '  <div class="mt-3 flex flex-wrap gap-2">'
            + (ta.tags.length > 0
                ? ta.tags.map((tag) => '<span class="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-2 py-1">' + escapeHtml(tag) + '</span>').join('')
                : '<span class="text-xs text-slate-400">No tags</span>')
            + '  </div>'
            + '  <div class="mt-3 flex items-center gap-2">'
            + '    <button class="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full px-3 py-1.5 transition btn-rec-view" data-jobid="' + escapeHtml(job.id) + '" data-uid="' + escapeHtml(ta.userId) + '">View Details</button>'
            + '    <button class="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-700 rounded-full px-3 py-1.5 transition btn-rec-chat" data-jobid="' + escapeHtml(job.id) + '" data-uid="' + escapeHtml(ta.userId) + '" data-name="' + escapeHtml(ta.realName) + '">Message</button>'
            + '  </div>'
            + '</div>';
        }).join('')
        + '</div>';
    }

    function renderRecommendedCandidateModal(job, ta) {
      if (dom.applicantModalTitle) {
        dom.applicantModalTitle.textContent = 'Recommended Candidate Details';
      }

      dom.applicantModalBody.innerHTML = ''
        + '<div class="flex items-center gap-5 mb-6">'
        + '  <div class="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold text-3xl shadow-inner">' + escapeHtml((ta.realName || '?').charAt(0)) + '</div>'
        + '  <div class="min-w-0">'
        + '    <h3 class="text-2xl font-bold text-slate-900 truncate">' + escapeHtml(ta.realName || 'Unnamed TA') + '</h3>'
        + '    <p class="text-slate-500 font-medium">' + escapeHtml(ta.major || 'Major not provided') + (ta.grade ? (' · ' + escapeHtml(ta.grade)) : '') + '</p>'
        + '    <p class="text-sm text-slate-400 mt-1">' + escapeHtml(ta.email || 'Email not provided') + '</p>'
        + '    <p class="text-xs text-slate-400 mt-1">TA ID: <span class="mono">' + escapeHtml(ta.userId || '-') + '</span></p>'
        + '    <p class="text-xs text-emerald-700 mt-1 font-semibold">' + escapeHtml(formatRecommendScore(ta)) + '</p>'
        + '  </div>'
        + '</div>'

        + '<div class="space-y-5">'
        + '  <div>'
        + '    <h4 class="text-sm font-bold text-slate-900 mb-2">Profile Summary</h4>'
        + '    <div class="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 border border-slate-100">' + escapeHtml(ta.selfIntro || 'No self introduction provided yet.') + '</div>'
        + '  </div>'
        + '  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">'
        + '    <div class="bg-white border border-slate-100 rounded-xl px-3 py-2 text-sm text-slate-600"><span class="font-semibold text-slate-800">Student ID:</span> ' + escapeHtml(ta.studentId || '-') + '</div>'
        + '    <div class="bg-white border border-slate-100 rounded-xl px-3 py-2 text-sm text-slate-600"><span class="font-semibold text-slate-800">Education:</span> ' + escapeHtml(ta.education || '-') + '</div>'
        + '  </div>'
        + '  <div>'
        + '    <h4 class="text-sm font-bold text-slate-900 mb-2">Tags</h4>'
        + '    <div class="flex flex-wrap gap-2">'
        + (Array.isArray(ta.tags) && ta.tags.length > 0
            ? ta.tags.map((tag) => '<span class="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-2 py-1">' + escapeHtml(tag) + '</span>').join('')
            : '<span class="text-xs text-slate-400">No tags</span>')
        + '    </div>'
        + '  </div>'
        + '</div>'

        + '<div class="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">'
        + '  <button id="btnOpenRecMessage" class="px-4 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-700 transition">Start Conversation</button>'
        + '  <button id="btnOpenRecResume" class="px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:border-indigo-300 hover:bg-indigo-50 transition">Query Resume PDF</button>'
        + '</div>'
        + '<div id="recResumeStatus" class="text-sm text-slate-400 mt-3"></div>';

      const chatBtn = document.getElementById('btnOpenRecMessage');
      if (chatBtn) {
        chatBtn.addEventListener('click', () => {
          gotoMessageCenter(ta.userId, ta.realName || 'TA', job);
        });
      }

      const resumeBtn = document.getElementById('btnOpenRecResume');
      const resumeStatus = document.getElementById('recResumeStatus');
      if (resumeBtn) {
        resumeBtn.addEventListener('click', async () => {
          if (!ta.userId) {
            if (resumeStatus) {
              resumeStatus.textContent = 'TA ID missing. Cannot query resume.';
              resumeStatus.className = 'text-sm text-amber-600 mt-3';
            }
            return;
          }

          resumeBtn.disabled = true;
          resumeBtn.textContent = 'Querying...';
          if (resumeStatus) {
            resumeStatus.textContent = 'Checking resume status...';
            resumeStatus.className = 'text-sm text-slate-500 mt-3';
          }

          const r = await queryApplicantResumePdf(ta.userId);
          resumeBtn.disabled = false;
          resumeBtn.textContent = 'Query Resume PDF';

          if (r.ok) {
            const blobUrl = URL.createObjectURL(r.blob);
            window.open(blobUrl, '_blank', 'noopener');
            window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60 * 1000);
            if (resumeStatus) {
              resumeStatus.textContent = 'Resume found. Opened in new tab.';
              resumeStatus.className = 'text-sm text-emerald-600 mt-3';
            }
            return;
          }

          if (resumeStatus) {
            if (r.status === 404) {
              resumeStatus.textContent = 'Resume not uploaded.';
              resumeStatus.className = 'text-sm text-amber-600 mt-3';
            } else if (r.status === 403) {
              resumeStatus.textContent = 'Resume is private and cannot be viewed.';
              resumeStatus.className = 'text-sm text-amber-600 mt-3';
            } else if (r.status === 401) {
              resumeStatus.textContent = 'Session expired. Please log in again.';
              resumeStatus.className = 'text-sm text-red-600 mt-3';
            } else {
              resumeStatus.textContent = 'Query failed. Please try again.';
              resumeStatus.className = 'text-sm text-red-600 mt-3';
            }
          }
        });
      }
    }

    function openRecommendedCandidateModal(jobId, taUserId) {
      const job = findJob(jobId);
      if (!job) {
        showToast('Job not found.');
        return;
      }

      const candidate = findRecommendedCandidate(jobId, taUserId);
      if (!candidate) {
        showToast('Candidate details not loaded yet.');
        return;
      }

      renderRecommendedCandidateModal(job, candidate);
      openModal(dom.applicantModal);
    }

    // 宸插疄鐜板悗绔帴鍙ｈ繛鎺?
    // GET /job?action=matchTAs&jobId=...
    async function openMatchCandidatesModal(jobId) {
      const job = findJob(jobId);
      if (!job) {
        showToast('Job not found.');
        return;
      }

      if (dom.applicantModalTitle) {
        dom.applicantModalTitle.textContent = 'Recommended TA Candidates';
      }

      dom.applicantModalBody.innerHTML = '<div class="text-sm text-slate-500">Loading recommendations...</div>';
      openModal(dom.applicantModal);

      const list = await loadRecommendationsByJob(jobId, true);
      if (!Array.isArray(list)) {
        dom.applicantModalBody.innerHTML = '<div class="text-sm text-red-600">Failed to load recommendations.</div>';
        showToast('Failed to match TAs.');
        return;
      }

      renderMatchCandidates(job, list);

      dom.applicantModalBody.querySelectorAll('.btn-rec-view').forEach((btn) => {
        btn.addEventListener('click', () => {
          const taUserId = btn.getAttribute('data-uid');
          openRecommendedCandidateModal(job.id, taUserId);
        });
      });

      dom.applicantModalBody.querySelectorAll('.btn-rec-chat').forEach((btn) => {
        btn.addEventListener('click', () => {
          const taUserId = btn.getAttribute('data-uid');
          const taName = btn.getAttribute('data-name') || 'TA';
          gotoMessageCenter(taUserId, taName, job);
        });
      });
    }

    function renderApplicantModal(app) {
      if (dom.applicantModalTitle) {
        dom.applicantModalTitle.textContent = 'Applicant Profile';
      }

      const statusText = app.status.toUpperCase();
      const statusClass = app.status === 'approved'
        ? 'status-approved'
        : app.status === 'rejected'
          ? 'status-rejected'
          : 'status-pending';

      dom.applicantModalBody.innerHTML = ''
        + '<div class="flex items-center gap-5 mb-8">'
        + '  <div class="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold text-3xl shadow-inner">' + escapeHtml(app.name.charAt(0)) + '</div>'
        + '  <div>'
        + '    <h3 class="text-2xl font-bold text-slate-900">' + escapeHtml(app.name) + '</h3>'
        + '    <p class="text-slate-500 font-medium">' + escapeHtml(app.major) + '</p>'
        + '    <p class="text-sm text-slate-400 mt-1">' + escapeHtml(app.email) + '</p>'
        + '    <p class="text-xs text-slate-400 mt-1">TA ID: <span class="mono">' + escapeHtml(app.taUserId || '-') + '</span></p>'
        + '  </div>'
        + '</div>'

        + '<div class="space-y-6">'
        + '  <div>'
        + '    <h4 class="text-sm font-bold text-slate-900 mb-2">Remarks / Cover Letter</h4>'
        + '    <div class="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 leading-relaxed border border-slate-100">' + escapeHtml(app.remarks || 'No remarks provided.') + '</div>'
        + '  </div>'

        + '  <div>'
        + '    <h4 class="text-sm font-bold text-slate-900 mb-2">Resume</h4>'
    + '    <button id="btnQueryResumePdf" class="w-full px-4 py-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-semibold">Query Resume PDF</button>'
    + '    <div id="resumeQueryStatus" class="text-sm text-slate-400 mt-2">Click the button to query resume PDF.</div>'
      + '    <button id="btnMessageApplicant" class="w-full mt-3 px-4 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-700 transition">Start Conversation</button>'
        + '  </div>'
        + '</div>';

      if (app.status === 'pending') {
        dom.applicantModalBody.innerHTML += ''
          + '<div class="mt-8 flex gap-3 pt-6 border-t border-slate-100">'
          + '  <button id="btnModalReject" class="flex-1 px-4 py-3 font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl">Reject</button>'
          + '  <button id="btnModalApprove" class="flex-1 px-4 py-3 font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl">Approve</button>'
          + '</div>';
      } else {
        dom.applicantModalBody.innerHTML += ''
          + '<div class="mt-8 pt-6 border-t border-slate-100 flex justify-center">'
          + '  <span class="px-4 py-2 rounded-full font-bold text-sm ' + statusClass + '">This applicant is ' + escapeHtml(statusText) + '.</span>'
          + '</div>';
      }

      const queryResumeBtn = document.getElementById('btnQueryResumePdf');
      const resumeQueryStatus = document.getElementById('resumeQueryStatus');
      const messageApplicantBtn = document.getElementById('btnMessageApplicant');
      if (messageApplicantBtn) {
        const currentJob = state.viewingApplicant ? findJob(state.viewingApplicant.jobId) : null;
        messageApplicantBtn.addEventListener('click', () => {
          gotoMessageCenter(app.taUserId, app.name || 'TA', currentJob);
        });
      }

      if (queryResumeBtn) {
        if (!app.taUserId) {
          queryResumeBtn.disabled = true;
          queryResumeBtn.classList.add('opacity-60', 'cursor-not-allowed');
          if (resumeQueryStatus) {
            resumeQueryStatus.textContent = 'TA ID missing. Cannot query resume.';
            resumeQueryStatus.className = 'text-sm text-amber-600 mt-2';
          }
        } else {
          queryResumeBtn.addEventListener('click', async () => {
            queryResumeBtn.disabled = true;
            queryResumeBtn.textContent = 'Querying...';
            if (resumeQueryStatus) {
              resumeQueryStatus.textContent = 'Checking resume status...';
              resumeQueryStatus.className = 'text-sm text-slate-500 mt-2';
            }

            const r = await queryApplicantResumePdf(app.taUserId);
            queryResumeBtn.disabled = false;
            queryResumeBtn.textContent = 'Query Resume PDF';

            if (r.ok) {
              const blobUrl = URL.createObjectURL(r.blob);
              window.open(blobUrl, '_blank', 'noopener');
              window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60 * 1000);
              if (resumeQueryStatus) {
                resumeQueryStatus.textContent = 'Resume found. Opened in new tab.';
                resumeQueryStatus.className = 'text-sm text-emerald-600 mt-2';
              }
              return;
            }

            if (resumeQueryStatus) {
              if (r.status === 404) {
                resumeQueryStatus.textContent = 'Resume not uploaded.';
                resumeQueryStatus.className = 'text-sm text-amber-600 mt-2';
              } else if (r.status === 403) {
                resumeQueryStatus.textContent = 'Resume is private and cannot be viewed.';
                resumeQueryStatus.className = 'text-sm text-amber-600 mt-2';
              } else if (r.status === 401) {
                resumeQueryStatus.textContent = 'Session expired. Please log in again.';
                resumeQueryStatus.className = 'text-sm text-red-600 mt-2';
              } else {
                resumeQueryStatus.textContent = 'Query failed. Please try again.';
                resumeQueryStatus.className = 'text-sm text-red-600 mt-2';
              }
            }
          });
        }
      }

      const rejectBtn = document.getElementById('btnModalReject');
      if (rejectBtn) {
        rejectBtn.addEventListener('click', async () => {
          await auditApplication(app.applicationId, 2);
          closeModal(dom.applicantModal);
        });
      }

      const approveBtn = document.getElementById('btnModalApprove');
      if (approveBtn) {
        approveBtn.addEventListener('click', async () => {
          const currentJobId = state.viewingApplicant ? state.viewingApplicant.jobId : '';
          await auditApplication(app.applicationId, 1, currentJobId);
          closeModal(dom.applicantModal);
        });
      }
    }

    function openApplicantModal(jobId, appId) {
      const app = findApplicant(jobId, appId);
      if (!app) {
        showToast('Applicant not found.');
        return;
      }
      state.viewingApplicant = { jobId, appId };
      renderApplicantModal(app);
      openModal(dom.applicantModal);
    }

    // 宸插疄鐜板悗绔帴鍙ｈ繛鎺?
    // POST /application?action=audit
    async function auditApplication(applicationId, auditStatus, jobIdOrNull) {
      const targetJob = jobIdOrNull ? findJob(jobIdOrNull) : findJobByApplicationId(applicationId);
      if (auditStatus === 1 && targetJob) {
        const remainingCapacity = getRemainingCapacity(targetJob);
        if (remainingCapacity <= 0) {
          showToast('This position is already full. Accepted decisions are final, so this applicant cannot be approved.', 'warning');
          return;
        }
      }

      const lockKey = targetJob ? String(targetJob.id) : '__global__';
      if (state.auditBusyByJob[lockKey]) {
        showToast('A review operation is in progress. Please wait a moment.', 'warning');
        return;
      }
      state.auditBusyByJob[lockKey] = true;

      const params = new URLSearchParams();
      params.append('applicationId', String(applicationId));
      params.append('auditStatus', String(auditStatus));
      params.append('remark', auditStatus === 1 ? 'Approved by MO' : 'Rejected by MO');

      try {
        const r = await request('/application?action=audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params
        });

        if (r.ok && r.data) {
          showToast(r.data.msg || 'Application audited.');
        } else {
          showToast('Audit failed.');
        }

        if (r.ok && r.data && r.data.code === 200) {
          await loadJobsWithApplicants();
        }
      } finally {
        state.auditBusyByJob[lockKey] = false;
      }
    }

    async function batchAudit(jobId, auditStatus) {
      const job = findJob(jobId);
      if (!job) return;
      const lockKey = String(job.id);
      if (state.auditBusyByJob[lockKey]) {
        showToast('A review operation is in progress. Please wait a moment.', 'warning');
        return;
      }

      const pending = job.applicants.filter((a) => a.status === 'pending');
      if (pending.length === 0) {
        showToast('No pending applicants.', 'warning');
        return;
      }

      if (auditStatus === 1) {
        const remainingCapacity = getRemainingCapacity(job);
        if (remainingCapacity <= 0) {
          showToast('This position is already full. Accepted decisions are final, so Accept All is unavailable.', 'warning');
          return;
        }
        if (pending.length > remainingCapacity) {
          showToast('Pending exceeds remaining slots (' + remainingCapacity + '). Reject some first.', 'warning');
          return;
        }
      }

      state.auditBusyByJob[lockKey] = true;
      try {
        for (let i = 0; i < pending.length; i += 1) {
          const app = pending[i];
          const params = new URLSearchParams();
          params.append('applicationId', String(app.applicationId));
          params.append('auditStatus', String(auditStatus));
          params.append('remark', auditStatus === 1 ? 'Approved by MO (batch)' : 'Rejected by MO (batch)');

          await request('/application?action=audit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
          });
        }

        showToast(auditStatus === 1 ? 'All pending applicants accepted.' : 'All pending applicants rejected.', 'success');
        await loadJobsWithApplicants();
      } finally {
        state.auditBusyByJob[lockKey] = false;
      }
    }

    // 已实现后端接口连接
    // POST /job?action=delete
    async function deleteJob(jobId) {
      const normalizedId = String(jobId || '').trim();
      if (!normalizedId) {
        showToast('No position selected.');
        return false;
      }

      const params = new URLSearchParams();
      params.append('jobId', normalizedId);

      const r = await request('/job?action=delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });

      if (r.ok && r.data) {
        showToast(r.data.msg || 'Position deleted.');
      } else {
        showToast('Failed to delete position.');
      }

      if (r.ok && r.data && r.data.code === 200) {
        await loadJobsWithApplicants();
        return true;
      }
      return false;
    }

    function bindGlobalEvents() {
      if (dom.btnMessageCenter) {
        dom.btnMessageCenter.addEventListener('click', () => {
          gotoMessageCenter();
        });
      }

      if (dom.btnLogout) {
        dom.btnLogout.addEventListener('click', logout);
      }

      if (dom.btnOpenCreate) {
        dom.btnOpenCreate.addEventListener('click', () => openJobModal(null));
      }
      if (dom.btnOpenCreateFromPencil) {
        dom.btnOpenCreateFromPencil.addEventListener('click', () => openJobModal(null));
      }
      if (dom.btnSaveJob) {
        dom.btnSaveJob.addEventListener('click', saveJob);
      }

      if (dom.formTagOptions) {
        dom.formTagOptions.addEventListener('click', (e) => {
          const target = e.target.closest('.tag-option');
          if (!target) return;
          const tag = target.getAttribute('data-tag') || '';
          toggleSelectedTag(tag);
        });
      }

      if (dom.btnConfirmDelete) {
        dom.btnConfirmDelete.addEventListener('click', async () => {
          const targetJobId = state.deletingJobId;
          if (!targetJobId) {
            closeModal(dom.deleteModal);
            showToast('No position selected.');
            return;
          }

          if (state.deleteModalMode === 'contact_approved') {
            const job = findJob(targetJobId);
            const approvedApplicants = state.deleteApprovedApplicants.length > 0
              ? state.deleteApprovedApplicants
              : (job ? job.applicants.filter((a) => a.status === 'approved') : []);
            const targetApplicant = approvedApplicants.find((a) => a.taUserId) || approvedApplicants[0];
            if (!targetApplicant || !targetApplicant.taUserId) {
              showToast('Approved applicant info is missing.', 'warning');
              return;
            }
            closeModal(dom.deleteModal);
            state.deleteModalMode = 'confirm_delete';
            state.deleteApprovedApplicants = [];
            gotoMessageCenter(targetApplicant.taUserId, targetApplicant.name || 'Applicant', job);
            return;
          }

          const originalText = dom.btnConfirmDelete.textContent;
          dom.btnConfirmDelete.disabled = true;
          dom.btnConfirmDelete.textContent = 'Deleting...';

          const ok = await deleteJob(targetJobId);

          dom.btnConfirmDelete.disabled = false;
          dom.btnConfirmDelete.textContent = originalText;

          if (ok) {
            closeModal(dom.deleteModal);
            state.deletingJobId = null;
            state.deleteModalMode = 'confirm_delete';
            state.deleteApprovedApplicants = [];
          }
        });
      }

      bindModalClose();
    }

    async function bootstrap() {
      try {
        const ok = await loadCurrentUser();
        if (!ok) return;
        await loadAvailableTags();
        bindGlobalEvents();
        await loadJobsWithApplicants();
      } catch (e) {
        if (dom.headerRealName && dom.headerRealName.textContent === 'Loading...') {
          dom.headerRealName.textContent = 'Init failed';
        }
        showToast('Initialization failed. Please refresh and try again.');
      }
    }

    bootstrap();
