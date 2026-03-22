// JobStatusEnum.java 岗位状态枚举
package com.qm.bupt.entity.enums;

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