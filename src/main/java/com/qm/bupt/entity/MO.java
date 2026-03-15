package com.qm.bupt.entity;

import com.qm.bupt.entity.enums.UserTypeEnum;

import java.io.Serializable;
import java.util.List;

/**
 * MO模块组织者实体，继承User基类
 */
public class MO extends User implements Serializable {
    private static final long serialVersionUID = 1L;

    // 工号，唯一
    private String staffId;
    // 所属院系/部门
    private String department;
    // 负责的课程/模块列表
    private List<String> manageModules;
    // 发布的岗位ID列表
    private List<String> publishedJobIds;

    // 无参构造
    public MO() {
        // 默认设置角色类型为MO
        this.setUserType(UserTypeEnum.MO.getCode());
        this.setStatus(0);
    }

    @Override
    public String getRoleDesc() {
        return UserTypeEnum.MO.getDesc();
    }

    // Getter & Setter
    public String getStaffId() {
        return staffId;
    }

    public void setStaffId(String staffId) {
        this.staffId = staffId;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public List<String> getManageModules() {
        return manageModules;
    }

    public void setManageModules(List<String> manageModules) {
        this.manageModules = manageModules;
    }

    public List<String> getPublishedJobIds() {
        return publishedJobIds;
    }

    public void setPublishedJobIds(List<String> publishedJobIds) {
        this.publishedJobIds = publishedJobIds;
    }
}