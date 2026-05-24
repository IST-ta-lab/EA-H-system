package com.qm.bupt.dto;

import com.qm.bupt.entity.Application;
import com.qm.bupt.entity.Job;

import java.io.Serializable;

/**
 * DTO for a TA's own application records with associated job information.
 *
 * <p>Combines application fields (status, time, remark) with job details
 * (name, type, module, description, hours) for display on the TA dashboard.</p>
 */
public class MyApplicationDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    // 申请信息
    private String applicationId;
    private String jobId;
    private String applyTime;
    private Integer applyStatus;
    private String auditRemark;

    // 岗位信息
    private String jobName;
    private Integer jobType;
    private String belongModule;
    private String jobDesc;
    private Double workHoursWeekly;

    public MyApplicationDTO() {
    }

    public MyApplicationDTO(Application app, Job job) {
        this.applicationId = app.getApplicationId();
        this.jobId = app.getJobId();
        this.applyTime = app.getApplyTime();
        this.applyStatus = app.getApplyStatus();
        this.auditRemark = app.getAuditRemark();

        if (job != null) {
            this.jobName = job.getJobName();
            this.jobType = job.getJobType();
            this.belongModule = job.getBelongModule();
            this.jobDesc = job.getJobDesc();
            this.workHoursWeekly = job.getWorkHoursWeekly();
        }
    }

    public String getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(String applicationId) {
        this.applicationId = applicationId;
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

    public String getAuditRemark() {
        return auditRemark;
    }

    public void setAuditRemark(String auditRemark) {
        this.auditRemark = auditRemark;
    }

    public String getJobName() {
        return jobName;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public Integer getJobType() {
        return jobType;
    }

    public void setJobType(Integer jobType) {
        this.jobType = jobType;
    }

    public String getBelongModule() {
        return belongModule;
    }

    public void setBelongModule(String belongModule) {
        this.belongModule = belongModule;
    }

    public String getJobDesc() {
        return jobDesc;
    }

    public void setJobDesc(String jobDesc) {
        this.jobDesc = jobDesc;
    }

    public Double getWorkHoursWeekly() {
        return workHoursWeekly;
    }

    public void setWorkHoursWeekly(Double workHoursWeekly) {
        this.workHoursWeekly = workHoursWeekly;
    }
}
