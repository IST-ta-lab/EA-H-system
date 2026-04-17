package com.qm.bupt.servlet;

import java.io.Serializable;
import java.util.List;

/**
 * 会话信息DTO，用于返回丰富的会话数据
 */
public class ConversationDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private String userId;
    private String userName;
    private Integer userType; // 1=TA, 2=MO
    private String userTypeDesc;
    private List<JobSimple> relatedJobs; // 关联的Job列表
    private boolean isRelated; // 是否与当前用户相关

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public Integer getUserType() { return userType; }
    public void setUserType(Integer userType) { this.userType = userType; }
    public String getUserTypeDesc() { return userTypeDesc; }
    public void setUserTypeDesc(String userTypeDesc) { this.userTypeDesc = userTypeDesc; }
    public List<JobSimple> getRelatedJobs() { return relatedJobs; }
    public void setRelatedJobs(List<JobSimple> relatedJobs) { this.relatedJobs = relatedJobs; }
    public boolean isRelated() { return isRelated; }
    public void setRelated(boolean related) { this.isRelated = related; }
}