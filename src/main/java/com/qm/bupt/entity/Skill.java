package com.qm.bupt.entity;

import java.io.Serializable;

/**
 * 技能字典实体，用于AI技能匹配功能
 */
public class Skill implements Serializable {
    private static final long serialVersionUID = 1L;

    // 技能唯一ID
    private String skillId;
    // 技能名称
    private String skillName;
    // 技能类型：1=专业技术，2=软技能，3=岗位专项技能
    private Integer skillType;

    // 无参构造
    public Skill() {
    }

    // Getter & Setter
    public String getSkillId() {
        return skillId;
    }

    public void setSkillId(String skillId) {
        this.skillId = skillId;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public Integer getSkillType() {
        return skillType;
    }

    public void setSkillType(Integer skillType) {
        this.skillType = skillType;
    }
}