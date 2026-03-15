package com.qm.bupt.entity;

import com.qm.bupt.entity.enums.UserTypeEnum;

import java.io.Serializable;
import java.util.List;

/**
 * TA申请者实体，继承User基类
 */
public class TA extends User implements Serializable {
    private static final long serialVersionUID = 1L;

    // 学号，唯一
    private String studentId;
    // 所学专业
    private String major;
    // 学历（本科/硕士/博士）
    private String education;
    // 年级
    private String grade;
    // 掌握的技能ID列表
    private List<String> skillIds;
    // CV文件上传后的服务器路径
    private String cvPath;
    // 个人简介
    private String selfIntro;
    // 累计已分配工作量（小时）
    private Double totalWorkload;
    // 每周可投入时长
    private Double availableHours;

    // 无参构造
    public TA() {
        // 默认设置角色类型为TA
        this.setUserType(UserTypeEnum.TA.getCode());
        this.setTotalWorkload(0.0);
        this.setStatus(0);
    }

    @Override
    public String getRoleDesc() {
        return UserTypeEnum.TA.getDesc();
    }

    // Getter & Setter
    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public List<String> getSkillIds() {
        return skillIds;
    }

    public void setSkillIds(List<String> skillIds) {
        this.skillIds = skillIds;
    }

    public String getCvPath() {
        return cvPath;
    }

    public void setCvPath(String cvPath) {
        this.cvPath = cvPath;
    }

    public String getSelfIntro() {
        return selfIntro;
    }

    public void setSelfIntro(String selfIntro) {
        this.selfIntro = selfIntro;
    }

    public Double getTotalWorkload() {
        return totalWorkload;
    }

    public void setTotalWorkload(Double totalWorkload) {
        this.totalWorkload = totalWorkload;
    }

    public Double getAvailableHours() {
        return availableHours;
    }

    public void setAvailableHours(Double availableHours) {
        this.availableHours = availableHours;
    }
}