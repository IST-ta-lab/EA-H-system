package com.qm.bupt.service;

import com.qm.bupt.entity.Application;
import java.util.List;

public interface ApplicationService {
    // 1. TA申请岗位
    boolean applyJob(String taUserId, String jobId);
    // 2. MO审核申请（通过/拒绝）
    boolean auditApplication(String applicationId, String moUserId, Integer auditStatus, String remark);
    // 3. 查询某岗位的所有申请（MO看自己岗位的）
    List<Application> listApplicationsByJobId(String jobId);
    // 4. TA查询自己的申请记录
    List<Application> listMyApplications(String taUserId);
}