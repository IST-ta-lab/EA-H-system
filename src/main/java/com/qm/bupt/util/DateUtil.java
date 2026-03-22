package com.qm.bupt.util;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 日期工具类，统一日期格式
 */
public class DateUtil {

    public static final String DEFAULT_PATTERN = "yyyy-MM-dd HH:mm:ss";

    // 私有构造，禁止实例化
    private DateUtil() {
    }

    /**
     * 获取当前时间，格式：yyyy-MM-dd HH:mm:ss
     */
    public static String getNow() {
        return new SimpleDateFormat(DEFAULT_PATTERN).format(new Date());
    }

    /**
     * 日期格式化
     */
    public static String format(Date date, String pattern) {
        return new SimpleDateFormat(pattern).format(date);
    }
}