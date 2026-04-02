package com.qm.bupt.dto;

import com.qm.bupt.entity.Application;
import com.qm.bupt.entity.TA;

import java.io.Serializable;

/**
 * 申请详情DTO：组装申请记录 + TA申请者信息
 * 专门用于MO查看申请列表时返回
 */
public class ApplicationDetailDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    // --- 申请记录本身的信息 ---
    private String applicationId;
    private String jobId;
    private String applyTime;
    private Integer applyStatus; // 0=待审核,1=通过,2=拒绝
    private String auditRemark;

    // --- TA申请者的详细信息 ---
    private String taUserId;
    private String taRealName;   // TA真实姓名
    private String taStudentId;  // TA学号
    private String taMajor;      // TA专业
    private String taEducation;  // TA学历
    private String taEmail;      // TA邮箱
    private String taCvPath;     // TA简历路径
    private String taSelfIntro;  // TA自我介绍

    // 无参构造
    public ApplicationDetailDTO() {
    }

    // 构造方法：通过 Application 和 TA 组装
    public ApplicationDetailDTO(Application app, TA ta) {
        // 复制申请信息
        this.applicationId = app.getApplicationId();
        this.jobId = app.getJobId();
        this.applyTime = app.getApplyTime();
        this.applyStatus = app.getApplyStatus();
        this.auditRemark = app.getAuditRemark();
        this.taUserId = app.getTaUserId();

        // 复制TA信息（如果TA不为空）
        if (ta != null) {
            this.taRealName = ta.getRealName();
            this.taStudentId = ta.getStudentId();
            this.taMajor = ta.getMajor();
            this.taEducation = ta.getEducation();
            this.taEmail = ta.getEmail();
            this.taCvPath = ta.getCvPath();
            this.taSelfIntro = ta.getSelfIntro();
        }
    }

    // Getter & Setter (必须全部生成，否则Gson无法序列化)
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

    public String getTaUserId() {
        return taUserId;
    }

    public void setTaUserId(String taUserId) {
        this.taUserId = taUserId;
    }

    public String getTaRealName() {
        return taRealName;
    }

    public void setTaRealName(String taRealName) {
        this.taRealName = taRealName;
    }

    public String getTaStudentId() {
        return taStudentId;
    }

    public void setTaStudentId(String taStudentId) {
        this.taStudentId = taStudentId;
    }

    public String getTaMajor() {
        return taMajor;
    }

    public void setTaMajor(String taMajor) {
        this.taMajor = taMajor;
    }

    public String getTaEducation() {
        return taEducation;
    }

    public void setTaEducation(String taEducation) {
        this.taEducation = taEducation;
    }

    public String getTaEmail() {
        return taEmail;
    }

    public void setTaEmail(String taEmail) {
        this.taEmail = taEmail;
    }

    public String getTaCvPath() {
        return taCvPath;
    }

    public void setTaCvPath(String taCvPath) {
        this.taCvPath = taCvPath;
    }

    public String getTaSelfIntro() {
        return taSelfIntro;
    }

    public void setTaSelfIntro(String taSelfIntro) {
        this.taSelfIntro = taSelfIntro;
    }
}