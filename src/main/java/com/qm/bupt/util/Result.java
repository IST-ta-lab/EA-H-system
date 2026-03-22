package com.qm.bupt.util;

import java.io.Serializable;

/**
 * 统一API响应结果类，前后端交互规范
 */
public class Result<T> implements Serializable {
    private static final long serialVersionUID = 1L;

    // 响应码：200=成功，400=参数错误，401=未登录，403=无权限，500=服务器错误
    private int code;
    // 响应信息
    private String msg;
    // 响应数据
    private T data;

    // 私有构造，通过静态方法创建实例
    private Result() {
    }

    // 成功响应（无数据）
    public static <T> Result<T> success() {
        Result<T> result = new Result<>();
        result.setCode(200);
        result.setMsg("操作成功");
        return result;
    }

    // 成功响应（带数据）
    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setCode(200);
        result.setMsg("操作成功");
        result.setData(data);
        return result;
    }

    // 成功响应（自定义消息+数据）
    public static <T> Result<T> success(String msg, T data) {
        Result<T> result = new Result<>();
        result.setCode(200);
        result.setMsg(msg);
        result.setData(data);
        return result;
    }

    // 失败响应
    public static <T> Result<T> error(int code, String msg) {
        Result<T> result = new Result<>();
        result.setCode(code);
        result.setMsg(msg);
        return result;
    }

    // Getter & Setter
    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}