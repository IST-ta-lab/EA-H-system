// ApplyStatusEnum.java 申请状态枚举
package com.qm.bupt.entity.enums;

public enum ApplyStatusEnum {
    PENDING(0, "待审核"),
    PASSED(1, "已通过"),
    REJECTED(2, "已拒绝");

    private final int code;
    private final String desc;

    ApplyStatusEnum(int code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public int getCode() {
        return code;
    }

    public String getDesc() {
        return desc;
    }
}