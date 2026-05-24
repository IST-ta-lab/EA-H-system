package com.qm.bupt.util;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Date utility providing consistent date-formatting operations.
 *
 * <p>Uses the default pattern {@code yyyy-MM-dd HH:mm:ss} for the current
 * timestamp and supports custom patterns for formatting arbitrary Date objects.</p>
 */
public class DateUtil {

    public static final String DEFAULT_PATTERN = "yyyy-MM-dd HH:mm:ss";

    // 私有构造，禁止实例化
    private DateUtil() {
    }

    /**
     * Returns the current date/time formatted as yyyy-MM-dd HH:mm:ss.
     */
    public static String getNow() {
        return new SimpleDateFormat(DEFAULT_PATTERN).format(new Date());
    }

    /**
     * Formats a Date object using the given pattern.
     */
    public static String format(Date date, String pattern) {
        return new SimpleDateFormat(pattern).format(date);
    }
}