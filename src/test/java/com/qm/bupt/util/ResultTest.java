package com.qm.bupt.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Result Unit Tests")
public class ResultTest {

    // ===== Factory Method: success() =====

    @Test
    @DisplayName("success(): returns code 200, msg 'success', data null")
    void success_noArgs_returnsDefault() {
        Result result = Result.success();
        assertEquals(200, result.getCode());
        assertEquals("success", result.getMsg());
        assertNull(result.getData());
    }

    // ===== Factory Method: success(T data) =====

    @Test
    @DisplayName("success(data): returns code 200, msg 'success', with provided data")
    void success_withData_returnsDataCorrectly() {
        Result result = Result.success("hello");
        assertEquals(200, result.getCode());
        assertEquals("success", result.getMsg());
        assertEquals("hello", result.getData());
    }

    @Test
    @DisplayName("success(data): works with Integer type")
    void success_withIntegerData_returnsCorrectly() {
        Result result = Result.success(42);
        assertEquals(200, result.getCode());
        assertEquals("success", result.getMsg());
        assertEquals(42, result.getData());
    }

    @Test
    @DisplayName("success(data): works with List type")
    void success_withListData_returnsCorrectly() {
        List<String> list = Arrays.asList("a", "b", "c");
        Result result = Result.success(list);
        assertEquals(200, result.getCode());
        assertEquals("success", result.getMsg());
        assertEquals(list, result.getData());
    }

    @Test
    @DisplayName("success(data): works with null data")
    void success_withNullData_returnsNullData() {
        Result result = Result.success(null);
        assertEquals(200, result.getCode());
        assertEquals("success", result.getMsg());
        assertNull(result.getData());
    }

    // ===== Factory Method: success(String msg, T data) =====

    @Test
    @DisplayName("success(msg, data): returns code 200 with custom msg and data")
    void success_withMsgAndData_returnsCorrectly() {
        Result result = Result.success("operation complete", "payload");
        assertEquals(200, result.getCode());
        assertEquals("operation complete", result.getMsg());
        assertEquals("payload", result.getData());
    }

    @Test
    @DisplayName("success(msg, data): works with custom message and Integer data")
    void success_withCustomMsgAndInteger_returnsCorrectly() {
        Result result = Result.success("count retrieved", 100);
        assertEquals(200, result.getCode());
        assertEquals("count retrieved", result.getMsg());
        assertEquals(100, result.getData());
    }

    // ===== Factory Method: error(int code, String msg) =====

    @Test
    @DisplayName("error(400, msg): returns code 400 with message, data null")
    void error_badRequest_returnsCorrectly() {
        Result result = Result.error(400, "Bad Request");
        assertEquals(400, result.getCode());
        assertEquals("Bad Request", result.getMsg());
        assertNull(result.getData());
    }

    @Test
    @DisplayName("error(401, msg): returns code 401 Unauthorized")
    void error_unauthorized_returnsCorrectly() {
        Result result = Result.error(401, "Unauthorized");
        assertEquals(401, result.getCode());
        assertEquals("Unauthorized", result.getMsg());
        assertNull(result.getData());
    }

    @Test
    @DisplayName("error(403, msg): returns code 403 Forbidden")
    void error_forbidden_returnsCorrectly() {
        Result result = Result.error(403, "Forbidden");
        assertEquals(403, result.getCode());
        assertEquals("Forbidden", result.getMsg());
        assertNull(result.getData());
    }

    @Test
    @DisplayName("error(500, msg): returns code 500 Internal Server Error")
    void error_internalServerError_returnsCorrectly() {
        Result result = Result.error(500, "Internal Server Error");
        assertEquals(500, result.getCode());
        assertEquals("Internal Server Error", result.getMsg());
        assertNull(result.getData());
    }

    // ===== Getters and Setters =====

    @Test
    @DisplayName("setCode/getCode: sets and retrieves code correctly")
    void setCode_getCode_worksCorrectly() {
        Result result = Result.success();
        result.setCode(404);
        assertEquals(404, result.getCode());
    }

    @Test
    @DisplayName("setMsg/getMsg: sets and retrieves msg correctly")
    void setMsg_getMsg_worksCorrectly() {
        Result result = Result.success();
        result.setMsg("custom message");
        assertEquals("custom message", result.getMsg());
    }

    @Test
    @DisplayName("setData/getData: sets and retrieves data correctly")
    void setData_getData_worksCorrectly() {
        Result result = Result.success();
        result.setData("new data");
        assertEquals("new data", result.getData());
    }

    @Test
    @DisplayName("setData/getData: works with complex generic type (List<Integer>)")
    void setData_getData_withGenericList() {
        Result result = Result.success();
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
        result.setData(numbers);
        assertEquals(numbers, result.getData());
    }
}
