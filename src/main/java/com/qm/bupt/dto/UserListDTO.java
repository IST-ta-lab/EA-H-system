package com.qm.bupt.dto;

import java.io.Serializable;

/**
 * 管理员用户列表DTO：展示所有用户的基本信息
 */
public class UserListDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private String userId;
    private String username;
    private String realName;
    private String email;
    private Integer userType; // 1=TA, 2=MO, 3=Admin
    private String userTypeDesc;
    private Integer status; // 0=正常, 1=禁用

    // 无参构造
    public UserListDTO() {
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

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}