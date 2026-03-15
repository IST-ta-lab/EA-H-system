package com.qm.bupt.servlet;

import com.qm.bupt.util.JsonUtil;
import com.qm.bupt.util.Result;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.lang.reflect.Method;

/**
 * 基础Servlet，通过action参数分发方法，统一响应格式
 */
public abstract class BaseServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 统一设置编码
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*"); // 跨域处理

        // 获取action参数，分发到对应方法
        String action = request.getParameter("action");
        if (action == null || action.isEmpty()) {
            writeJson(response, Result.error(400, "action参数不能为空"));
            return;
        }

        // 反射调用对应方法
        try {
            Method method = this.getClass().getDeclaredMethod(action, HttpServletRequest.class, HttpServletResponse.class);
            method.setAccessible(true);
            method.invoke(this, request, response);
        } catch (NoSuchMethodException e) {
            writeJson(response, Result.error(404, "接口方法不存在"));
        } catch (Exception e) {
            e.printStackTrace();
            writeJson(response, Result.error(500, "服务器内部错误"));
        }
    }

    /**
     * 写入JSON响应
     */
    protected void writeJson(HttpServletResponse response, Result<?> result) throws IOException {
        response.getWriter().write(JsonUtil.toJson(result));
    }
}