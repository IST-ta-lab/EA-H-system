package com.qm.bupt.dto;

import com.qm.bupt.entity.Application;
import com.qm.bupt.entity.Job;
import com.qm.bupt.entity.MO;
import com.qm.bupt.entity.TA;

import java.io.Serializable;
import java.util.List;

/**
 * 管理员用户详情DTO：根据角色展示不同的深度信息
 */
public class UserDetailDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    // --- 公共基础信息 ---
    private String userId;
    private String username;
    private String realName;
    private String email;
    private String phone;
    private Integer userType;
    private String userTypeDesc;
    private String createTime;

    // --- TA 专属信息 ---
    private TA taInfo; // TA完整档案
    private List<Application> taApplicationList; // TA申请过的岗位记录

    // --- MO 专属信息 ---
    private MO moInfo; // MO完整档案
    private List<Job> moPublishedJobList; // MO发布过的岗位列表

    // 无参构造
    public UserDetailDTO() {
    }

    // Getter & Setter
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Integer getUserType() {
        return userType;
    }

    public void setUserType(Integer userType) {
        this.userType = userType;
    }

    public String getUserTypeDesc() {
        return userTypeDesc;
    }

    public void setUserTypeDesc(String userTypeDesc) {
        this.userTypeDesc = userTypeDesc;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public TA getTaInfo() {
        return taInfo;
    }

    public void setTaInfo(TA taInfo) {
        this.taInfo = taInfo;
    }

    public List<Application> getTaApplicationList() {
        return taApplicationList;
    }

    public void setTaApplicationList(List<Application> taApplicationList) {
        this.taApplicationList = taApplicationList;
    }

    public MO getMoInfo() {
        return moInfo;
    }

    public void setMoInfo(MO moInfo) {
        this.moInfo = moInfo;
    }

    public List<Job> getMoPublishedJobList() {
        return moPublishedJobList;
    }

    public void setMoPublishedJobList(List<Job> moPublishedJobList) {
        this.moPublishedJobList = moPublishedJobList;
    }
}