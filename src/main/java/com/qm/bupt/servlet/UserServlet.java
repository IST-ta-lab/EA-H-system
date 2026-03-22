package com.qm.bupt.servlet;

import com.qm.bupt.entity.TA;
import com.qm.bupt.entity.MO;
import com.qm.bupt.entity.Admin;
import com.qm.bupt.entity.User;
import com.qm.bupt.service.UserService;
import com.qm.bupt.service.impl.UserServiceImpl;
import com.qm.bupt.util.Result;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

/**
 * 用户相关接口
 * 访问路径：/user?action=xxx
 */
@WebServlet("/user")
public class UserServlet extends BaseServlet {

    private final UserService userService = UserServiceImpl.getInstance();

    /**
     * 登录接口
     * 访问：POST /user?action=login
     * 参数：username, password
     */
    public void login(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");

        User user = userService.login(username, password);
        if (user == null) {
            writeJson(response, Result.error(400, "用户名或密码错误"));
            return;
        }

        // 登录成功，保存用户信息到Session
        HttpSession session = request.getSession();
        session.setAttribute("loginUser", user);
        session.setMaxInactiveInterval(3600); // 1小时过期

        writeJson(response, Result.success("登录成功", user));
    }

    /**
     * TA注册接口
     * 访问：POST /user?action=registerTA
     * 参数：username, password, realName, email, studentId, major, education, grade
     */
    public void registerTA(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 接收参数
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String realName = request.getParameter("realName");
        String email = request.getParameter("email");
        String studentId = request.getParameter("studentId");
        String major = request.getParameter("major");
        String education = request.getParameter("education");
        String grade = request.getParameter("grade");

        // 非空校验
        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            writeJson(response, Result.error(400, "用户名和密码不能为空"));
            return;
        }

        // 封装TA对象
        TA ta = new TA();
        ta.setUsername(username);
        ta.setPassword(password);
        ta.setRealName(realName);
        ta.setEmail(email);
        ta.setStudentId(studentId);
        ta.setMajor(major);
        ta.setEducation(education);
        ta.setGrade(grade);

        // 注册
        boolean success = userService.registerTA(ta);
        if (!success) {
            writeJson(response, Result.error(400, "用户名已存在，注册失败"));
            return;
        }

        writeJson(response, Result.success("注册成功"));
    }

    /**
     * 获取当前登录用户信息
     * 访问：GET /user?action=getLoginUser
     */
    public void getLoginUser(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            writeJson(response, Result.error(401, "未登录"));
            return;
        }
        writeJson(response, Result.success(loginUser));
    }

    /**
     * 退出登录
     * 访问：POST /user?action=logout
     */
    public void logout(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        session.invalidate();
        writeJson(response, Result.success("退出成功"));
    }

    /**
     * MO注册接口
     * 访问：POST /user?action=registerMO
     * 参数：username, password, realName, email, staffId, department
     */
    public void registerMO(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 接收参数
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String realName = request.getParameter("realName");
        String email = request.getParameter("email");
        String staffId = request.getParameter("staffId");
        String department = request.getParameter("department");

        // 非空校验
        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            writeJson(response, Result.error(400, "用户名和密码不能为空"));
            return;
        }

        // 封装MO对象
        MO mo = new MO();
        mo.setUsername(username);
        mo.setPassword(password);
        mo.setRealName(realName);
        mo.setEmail(email);
        mo.setStaffId(staffId);
        mo.setDepartment(department);

        // 注册
        boolean success = userService.registerMO(mo);
        if (!success) {
            writeJson(response, Result.error(400, "用户名已存在，注册失败"));
            return;
        }

        writeJson(response, Result.success("MO注册成功"));
    }

    /**
     * Admin注册接口（仅用于初始化，实际项目中Admin应该由后台直接创建）
     * 访问：POST /user?action=registerAdmin
     * 参数：username, password, realName, email
     */
    public void registerAdmin(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String realName = request.getParameter("realName");
        String email = request.getParameter("email");

        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            writeJson(response, Result.error(400, "用户名和密码不能为空"));
            return;
        }

        Admin admin = new Admin();
        admin.setUsername(username);
        admin.setPassword(password);
        admin.setRealName(realName);
        admin.setEmail(email);
        admin.setRoleLevel(2); // 默认超级管理员

        boolean success = userService.registerAdmin(admin);
        if (!success) {
            writeJson(response, Result.error(400, "用户名已存在，注册失败"));
            return;
        }

        writeJson(response, Result.success("Admin注册成功"));
    }


}