package com.qm.bupt.entity;

import com.qm.bupt.entity.enums.UserTypeEnum;

import java.io.Serializable;
import java.util.Date;

/**
 * 用户抽象基类，抽取TA/MO/Admin公共属性
 */
public abstract class User implements Serializable {
    private static final long serialVersionUID = 1L;

    // 用户唯一ID，UUID生成，全局唯一
    private String userId;
    // 登录用户名（学号/工号），全局唯一
    private String username;
    // 登录密码（MD5加密存储）
    private String password;
    // 真实姓名
    private String realName;
    // 联系邮箱
    private String email;
    // 联系电话（可选）
    private String phone;
    // 用户角色类型（1=TA,2=MO,3=Admin）
    private Integer userType;
    // 账号创建时间，格式：yyyy-MM-dd HH:mm:ss
    private String createTime;
    // 账号状态：0=正常，1=禁用
    private Integer status;

    // 无参构造（Gson反序列化必须）
    public User() {
    }

    // 全参构造
    public User(String userId, String username, String password, String realName, String email, String phone, Integer userType, String createTime, Integer status) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.realName = realName;
        this.email = email;
        this.phone = phone;
        this.userType = userType;
        this.createTime = createTime;
        this.status = status;
    }

    // 抽象方法：获取角色描述
    public abstract String getRoleDesc();

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}