package com.qm.bupt.entity;

import com.qm.bupt.entity.enums.UserTypeEnum;

import java.io.Serializable;

/**
 * Admin管理员实体，继承User基类
 */
public class Admin extends User implements Serializable {
    private static final long serialVersionUID = 1L;

    // 权限等级：1=普通管理员（仅查询工作量），2=超级管理员（全系统管理）
    private Integer roleLevel;

    // 无参构造
    public Admin() {
        // 默认设置角色类型为Admin
        this.setUserType(UserTypeEnum.ADMIN.getCode());
        this.setRoleLevel(1);
        this.setStatus(0);
    }

    @Override
    public String getRoleDesc() {
        return UserTypeEnum.ADMIN.getDesc();
    }

    // Getter & Setter
    public Integer getRoleLevel() {
        return roleLevel;
    }

    public void setRoleLevel(Integer roleLevel) {
        this.roleLevel = roleLevel;
    }
}