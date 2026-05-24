package com.qm.bupt.entity.enums;

/**
 * Enum representing the status of a job application.
 *
 * <p>Applications start as PENDING when submitted, then are either
 * PASSED or REJECTED by the reviewing MO.</p>
 */
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