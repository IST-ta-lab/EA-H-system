package com.qm.bupt.service.impl;

import com.qm.bupt.dao.ApplicationDAO;
import com.qm.bupt.dao.JobDAO;
import com.qm.bupt.dao.TADAO; // 【新增】导入TADAO
import com.qm.bupt.dto.ApplicationDetailDTO; // 【新增】导入DTO
import com.qm.bupt.entity.Application;
import com.qm.bupt.entity.Job;
import com.qm.bupt.entity.TA; // 【新增】导入TA
import com.qm.bupt.service.ApplicationService;
import com.qm.bupt.util.AuthUtil;
import com.qm.bupt.util.DateUtil;

import java.util.ArrayList; // 【新增】
import java.util.List;
import java.util.stream.Collectors;

public class ApplicationServiceImpl implements ApplicationService {

    private static final ApplicationServiceImpl INSTANCE = new ApplicationServiceImpl();
    private final ApplicationDAO applicationDAO = ApplicationDAO.getInstance();
    private final JobDAO jobDAO = JobDAO.getInstance();
    private final TADAO taDAO = TADAO.getInstance(); // 【新增】注入TADAO

    private ApplicationServiceImpl() {
    }

    public static ApplicationServiceImpl getInstance() {
        return INSTANCE;
    }

    @Override
    public boolean applyJob(String taUserId, String jobId) {
        // 1. 校验岗位是否存在且在招聘中
        Job job = jobDAO.getById(jobId, "jobId").orElse(null);
        if (job == null || job.getJobStatus() != 0) {
            return false;
        }
        // 2. 校验是否重复申请
        List<Application> existing = applicationDAO.listAll().stream()
                .filter(a -> taUserId.equals(a.getTaUserId()) && jobId.equals(a.getJobId()))
                .collect(Collectors.toList());
        if (!existing.isEmpty()) {
            return false;
        }
        // 3. 创建申请记录
        Application app = new Application();
        app.setApplicationId(AuthUtil.generateUUID());
        app.setTaUserId(taUserId);
        app.setJobId(jobId);
        app.setApplyTime(DateUtil.getNow());
        app.setApplyStatus(0); // 0=待审核
        return applicationDAO.save(app);
    }

    @Override
    public boolean auditApplication(String applicationId, String moUserId, Integer auditStatus, String remark) {
        // 1. 查询申请记录
        Application app = applicationDAO.getById(applicationId, "applicationId").orElse(null);
        if (app == null) return false;

        // 2. 查询岗位，确认是该MO发布的
        Job job = jobDAO.getById(app.getJobId(), "jobId").orElse(null);
        if (job == null || !moUserId.equals(job.getPublisherMoId())) {
            return false; // 无权审核别人的岗位
        }

        // 3. 更新申请状态
        app.setApplyStatus(auditStatus);
        app.setAuditMoId(moUserId);
        app.setAuditTime(DateUtil.getNow());
        app.setAuditRemark(remark);

        // 4. 如果审核通过，更新岗位已录用人数
        if (auditStatus == 1) {
            job.setHiredNum(job.getHiredNum() + 1);
            // 如果招满了，自动关闭岗位
            if (job.getHiredNum() >= job.getRecruitNum()) {
                job.setJobStatus(2); // 2=已招满
            }
            jobDAO.updateById(job, job.getJobId(), "jobId");
        }

        return applicationDAO.updateById(app, applicationId, "applicationId");
    }

    @Override
    public List<Application> listApplicationsByJobId(String jobId) {
        return applicationDAO.listAll().stream()
                .filter(a -> jobId.equals(a.getJobId()))
                .collect(Collectors.toList());
    }

    @Override
    public List<Application> listMyApplications(String taUserId) {
        return applicationDAO.listAll().stream()
                .filter(a -> taUserId.equals(a.getTaUserId()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ApplicationDetailDTO> listApplicationDetailsByJobId(String jobId) {
        // 1. 先查出所有申请记录
        List<Application> appList = applicationDAO.listAll().stream()
                .filter(a -> jobId.equals(a.getJobId()))
                .collect(Collectors.toList());

        // 2. 遍历申请记录，组装TA信息
        List<ApplicationDetailDTO> dtoList = new ArrayList<>();
        for (Application app : appList) {
            // 根据 taUserId 查出 TA 的详细信息
            TA ta = taDAO.getById(app.getTaUserId(), "userId").orElse(null);
            // 组装成 DTO
            ApplicationDetailDTO dto = new ApplicationDetailDTO(app, ta);
            dtoList.add(dto);
        }

        return dtoList;
    }
}