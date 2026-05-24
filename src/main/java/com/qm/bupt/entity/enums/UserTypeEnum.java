package com.qm.bupt.entity.enums;

/**
 * Enum representing the three user roles in the system.
 *
 * <p>Used as the {@code userType} discriminator field in the User entity hierarchy
 * for Gson polymorphic deserialization.</p>
 */
public enum UserTypeEnum {
    TA(1, "助教申请者"),
    MO(2, "模块组织者"),
    ADMIN(3, "系统管理员");

    private final int code;
    private final String desc;

    UserTypeEnum(int code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public int getCode() {
        return code;
    }

    public String getDesc() {
        return desc;
    }

    // 根据code获取枚举
    public static UserTypeEnum getByCode(int code) {
        for (UserTypeEnum e : values()) {
            if (e.code == code) return e;
        }
        return null;
    }
}