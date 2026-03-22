package com.qm.bupt.entity;

import java.io.Serializable;

/**
 * 岗位申请记录实体（TA与Job的多对多关联）
 */
public class Application implements Serializable {
    private static final long serialVersionUID = 1L;

    // 申请记录唯一ID，UUID生成
    private String applicationId;
    // 申请者TA的userId
    private String taUserId;
    // 申请的岗位ID
    private String jobId;
    // 申请提交时间
    private String applyTime;
    // 申请状态：0=待审核，1=已通过，2=已拒绝
    private Integer applyStatus;
    // 审核人MO的userId
    private String auditMoId;
    // 审核时间
    private String auditTime;
    // 审核备注
    private String auditRemark;

    // 无参构造
    public Application() {
        this.applyStatus = 0;
    }

    // Getter & Setter
    public String getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(String applicationId) {
        this.applicationId = applicationId;
    }

    public String getTaUserId() {
        return taUserId;
    }

    public void setTaUserId(String taUserId) {
        this.taUserId = taUserId;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public String getApplyTime() {
        return applyTime;
    }

    public void setApplyTime(String applyTime) {
        this.applyTime = applyTime;
    }

    public Integer getApplyStatus() {
        return applyStatus;
    }

    public void setApplyStatus(Integer applyStatus) {
        this.applyStatus = applyStatus;
    }

    public String getAuditMoId() {
        return auditMoId;
    }

    public void setAuditMoId(String auditMoId) {
        this.auditMoId = auditMoId;
    }

    public String getAuditTime() {
        return auditTime;
    }

    public void setAuditTime(String auditTime) {
        this.auditTime = auditTime;
    }

    public String getAuditRemark() {
        return auditRemark;
    }

    public void setAuditRemark(String auditRemark) {
        this.auditRemark = auditRemark;
    }
}