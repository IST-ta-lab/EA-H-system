package com.qm.bupt.entity.enums;

/**
 * Enum representing the lifecycle status of a job posting.
 *
 * <p>Jobs start as OPEN when published, and can transition to CLOSED
 * (by the MO) or FILLED (automatically when all positions are filled).</p>
 */
public enum JobStatusEnum {
    OPEN(0, "招聘中"),
    CLOSED(1, "已截止"),
    FILLED(2, "已招满");

    private final int code;
    private final String desc;

    JobStatusEnum(int code, String desc) {
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