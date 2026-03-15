package com.qm.bupt.entity;

import java.io.Serializable;
import java.util.List;

/**
 * 招聘岗位实体
 */
public class Job implements Serializable {
    private static final long serialVersionUID = 1L;

    // 岗位唯一ID，UUID生成
    private String jobId;
    // 发布人MO的userId
    private String publisherMoId;
    // 岗位名称
    private String jobName;
    // 岗位类型：1=课程助教，2=监考助教，3=活动助教
    private Integer jobType;
    // 所属课程/模块
    private String belongModule;
    // 岗位要求的技能ID列表
    private List<String> requireSkillIds;
    // 岗位职责描述
    private String jobDesc;
    // 每周所需工时
    private Double workHoursWeekly;
    // 计划招聘人数
    private Integer recruitNum;
    // 已录用人数
    private Integer hiredNum;
    // 发布时间
    private String publishTime;
    // 申请截止时间
    private String applyDeadline;
    // 岗位状态：0=招聘中，1=已截止，2=已招满
    private Integer jobStatus;

    // 无参构造
    public Job() {
        this.hiredNum = 0;
        this.jobStatus = 0;
    }

    // Getter & Setter
    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public String getPublisherMoId() {
        return publisherMoId;
    }

    public void setPublisherMoId(String publisherMoId) {
        this.publisherMoId = publisherMoId;
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

    public List<String> getRequireSkillIds() {
        return requireSkillIds;
    }

    public void setRequireSkillIds(List<String> requireSkillIds) {
        this.requireSkillIds = requireSkillIds;
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

    public Integer getRecruitNum() {
        return recruitNum;
    }

    public void setRecruitNum(Integer recruitNum) {
        this.recruitNum = recruitNum;
    }

    public Integer getHiredNum() {
        return hiredNum;
    }

    public void setHiredNum(Integer hiredNum) {
        this.hiredNum = hiredNum;
    }

    public String getPublishTime() {
        return publishTime;
    }

    public void setPublishTime(String publishTime) {
        this.publishTime = publishTime;
    }

    public String getApplyDeadline() {
        return applyDeadline;
    }

    public void setApplyDeadline(String applyDeadline) {
        this.applyDeadline = applyDeadline;
    }

    public Integer getJobStatus() {
        return jobStatus;
    }

    public void setJobStatus(Integer jobStatus) {
        this.jobStatus = jobStatus;
    }
}