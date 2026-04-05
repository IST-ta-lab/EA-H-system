package com.qm.bupt.filter;

import com.qm.bupt.entity.User;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * 登录权限过滤器，拦截未登录请求
 */
public class AuthFilter implements Filter {

    // 白名单：无需登录即可访问的路径
    private static final List<String> WHITE_LIST = Arrays.asList(
            "/index.html",
            "/login.html",
            "/user?action=login",
            "/user?action=registerTA",
            "/user?action=registerMO",
            "/user?action=registerAdmin", // 【新增】放开Admin注册
            "/job?action=listAll",    // 【新增】游客查所有岗位
            "/job?action=listOpen",   // 【新增】游客查招聘中岗位
            "/job?action=getDetail",  // 【新增】游客查岗位详情
            "/static/",
            "/admin"
    );

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;

        String requestURI = req.getRequestURI();
        String queryString = req.getQueryString();
        String fullPath = requestURI + (queryString != null ? "?" + queryString : "");

        // 白名单放行
        for (String path : WHITE_LIST) {
            if (fullPath.contains(path)) {
                chain.doFilter(request, response);
                return;
            }
        }

        // 检查登录状态
        HttpSession session = req.getSession();
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            // 未登录，重定向到登录页，或返回401
            resp.setContentType("application/json;charset=UTF-8");
            resp.getWriter().write("{\"code\":401,\"msg\":\"未登录，请先登录\",\"data\":null}");
            return;
        }

        // 已登录，放行
        chain.doFilter(request, response);
    }
}