package com.qm.bupt.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("DateUtil Unit Tests")
public class DateUtilTest {

    // ===== getNow() Tests =====

    @Test
    @DisplayName("getNow: returns string in yyyy-MM-dd HH:mm:ss format")
    void getNow_returnsCorrectFormat() {
        String now = DateUtil.getNow();
        assertNotNull(now);
        // Regex for yyyy-MM-dd HH:mm:ss
        assertTrue(now.matches("\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}"),
                "Should match yyyy-MM-dd HH:mm:ss format, got: " + now);
    }

    @Test
    @DisplayName("getNow: returns current time within 2 seconds tolerance")
    void getNow_returnsCurrentTime_withinTolerance() throws Exception {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date before = new Date();
        String nowStr = DateUtil.getNow();
        Date after = new Date();

        Date nowParsed = sdf.parse(nowStr);
        // The parsed time should be between (before - 1s) and (after + 1s)
        long tolerance = 2000; // 2 seconds
        assertTrue(nowParsed.getTime() >= before.getTime() - tolerance,
                "getNow() should not be more than 2 seconds before the test start");
        assertTrue(nowParsed.getTime() <= after.getTime() + tolerance,
                "getNow() should not be more than 2 seconds after the test end");
    }

    @Test
    @DisplayName("getNow: year part is current year")
    void getNow_yearIsCurrentYear() {
        String now = DateUtil.getNow();
        int currentYear = Calendar.getInstance().get(Calendar.YEAR);
        assertTrue(now.startsWith(String.valueOf(currentYear)),
                "Should start with current year");
    }

    // ===== format(Date, String) Tests =====

    @Test
    @DisplayName("format: formats date with yyyy-MM-dd pattern")
    void format_dateOnly_returnsCorrectFormat() {
        // Create a known date: 2023-06-15 10:30:45
        Calendar cal = Calendar.getInstance();
        cal.set(2023, Calendar.JUNE, 15, 10, 30, 45);
        Date date = cal.getTime();

        String result = DateUtil.format(date, "yyyy-MM-dd");
        assertEquals("2023-06-15", result);
    }

    @Test
    @DisplayName("format: formats date with yyyy-MM-dd HH:mm:ss pattern")
    void format_dateTime_returnsCorrectFormat() {
        Calendar cal = Calendar.getInstance();
        cal.set(2023, Calendar.JANUARY, 1, 0, 0, 0);
        Date date = cal.getTime();

        String result = DateUtil.format(date, "yyyy-MM-dd HH:mm:ss");
        assertTrue(result.startsWith("2023-01-01 00:00:00"),
                "Should format to 2023-01-01 00:00:00, got: " + result);
    }

    @Test
    @DisplayName("format: formats date with yyyy/MM/dd pattern")
    void format_slashSeparator_returnsCorrectFormat() {
        Calendar cal = Calendar.getInstance();
        cal.set(2024, Calendar.DECEMBER, 25, 12, 0, 0);
        Date date = cal.getTime();

        String result = DateUtil.format(date, "yyyy/MM/dd");
        assertEquals("2024/12/25", result);
    }

    @Test
    @DisplayName("format: formats date with HH:mm pattern (time only)")
    void format_timeOnly_returnsCorrectFormat() {
        Calendar cal = Calendar.getInstance();
        cal.set(2023, Calendar.MARCH, 10, 14, 30, 0);
        Date date = cal.getTime();

        String result = DateUtil.format(date, "HH:mm");
        assertEquals("14:30", result);
    }

    @Test
    @DisplayName("format: formats date with yyyyMMdd pattern (no separators)")
    void format_noSeparators_returnsCorrectFormat() {
        Calendar cal = Calendar.getInstance();
        cal.set(2023, Calendar.JULY, 4, 0, 0, 0);
        Date date = cal.getTime();

        String result = DateUtil.format(date, "yyyyMMdd");
        assertEquals("20230704", result);
    }

    @Test
    @DisplayName("format: specific known date produces expected output")
    void format_knownDate_producesExpectedOutput() {
        // Use epoch + offset for a well-known timestamp
        Calendar cal = Calendar.getInstance();
        cal.set(2000, Calendar.JANUARY, 1, 12, 0, 0);
        cal.set(Calendar.MILLISECOND, 0);
        Date date = cal.getTime();

        String result = DateUtil.format(date, "yyyy-MM-dd HH:mm:ss");
        assertEquals("2000-01-01 12:00:00", result);
    }
}
