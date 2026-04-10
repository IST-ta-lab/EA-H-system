package com.qm.bupt.servlet;

import com.qm.bupt.entity.TA;
import com.qm.bupt.entity.MO;
import com.qm.bupt.entity.Admin;
import com.qm.bupt.entity.User;
import com.qm.bupt.service.UserService;
import com.qm.bupt.service.impl.UserServiceImpl;
import com.qm.bupt.util.Result;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.Part;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.FileOutputStream;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * 用户相关接口
 * 访问路径：/user?action=xxx
 */
@WebServlet("/user")
@MultipartConfig
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
     * 更新TA个人资料
     * 访问：POST /user?action=updateProfile
     * 参数：realName, email, major, selfIntro, skills(英文逗号分隔), profileVisible(true/false 或 1/0)
     */
    public void updateProfile(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            writeJson(response, Result.error(401, "未登录"));
            return;
        }
        if (!(loginUser instanceof TA)) {
            writeJson(response, Result.error(403, "仅TA可更新个人资料"));
            return;
        }

        TA ta = (TA) loginUser;
        String realName = request.getParameter("realName");
        String email = request.getParameter("email");
        String major = request.getParameter("major");
        String selfIntro = request.getParameter("selfIntro");
        String skills = request.getParameter("skills");
        String profileVisible = request.getParameter("profileVisible");
        String tags = request.getParameter("tags");

        if (realName != null) {
            ta.setRealName(realName);
        }
        if (email != null) {
            ta.setEmail(email);
        }
        if (major != null) {
            ta.setMajor(major);
        }
        if (selfIntro != null) {
            ta.setSelfIntro(selfIntro);
        }
        if (profileVisible != null) {
            boolean visible = "1".equals(profileVisible) || "true".equalsIgnoreCase(profileVisible);
            ta.setProfileVisible(visible);
        }
        if (skills != null) {
            List<String> skillList = Arrays.stream(skills.split(","))
                    .map(String::trim)
                    .filter(item -> !item.isEmpty())
                    .collect(Collectors.toList());
            ta.setSkillIds(skillList);
        }
        if (tags != null) {
            List<String> tagList = Arrays.stream(tags.split(","))
                    .map(String::trim)
                    .filter(item -> !item.isEmpty())
                    .collect(Collectors.toList());
            ta.setTags(tagList);
        }

        boolean ok = userService.updateTAProfile(ta);
        if (!ok) {
            writeJson(response, Result.error(500, "更新失败"));
            return;
        }

        session.setAttribute("loginUser", ta);
        writeJson(response, Result.success("更新成功", ta));
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

    /**
     * TA上传个人资料PDF
     * 访问：POST /user?action=uploadProfilePdf
     * 参数：file (multipart file)
     */
    public void uploadProfilePdf(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            writeJson(response, Result.error(401, "未登录"));
            return;
        }
        if (!(loginUser instanceof TA)) {
            writeJson(response, Result.error(403, "仅TA可上传个人资料PDF"));
            return;
        }

        Part filePart = request.getPart("file");
        if (filePart == null || filePart.getSubmittedFileName() == null || filePart.getSubmittedFileName().isEmpty()) {
            writeJson(response, Result.error(400, "请选择PDF文件"));
            return;
        }

        String fileName = filePart.getSubmittedFileName();
        if (!fileName.toLowerCase().endsWith(".pdf")) {
            writeJson(response, Result.error(400, "仅支持PDF文件"));
            return;
        }

        TA ta = (TA) loginUser;
        String userId = ta.getUserId();

        String pdfDir = request.getServletContext().getRealPath("/WEB-INF/data/profile_pdfs");
        File pdfDirFile = new File(pdfDir);
        if (!pdfDirFile.exists()) {
            pdfDirFile.mkdirs();
        }

        String saveFileName = userId + ".pdf";
        String filePath = pdfDir + File.separator + saveFileName;

        try (InputStream input = filePart.getInputStream();
             FileOutputStream output = new FileOutputStream(filePath)) {
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = input.read(buffer)) != -1) {
                output.write(buffer, 0, bytesRead);
            }
        }

        ta.setProfilePdfPath("/WEB-INF/data/profile_pdfs/" + saveFileName);
        boolean ok = userService.updateTAProfile(ta);
        if (!ok) {
            new File(filePath).delete();
            writeJson(response, Result.error(500, "保存失败"));
            return;
        }

        session.setAttribute("loginUser", ta);
        writeJson(response, Result.success("上传成功"));
    }

    /**
     * 根据uid下载TA的个人资料PDF
     * 访问：GET /user?action=downloadProfilePdf&uid=xxx
     * 仅当TA设置了profileVisible=true且已上传PDF时才可下载
     */
    public void downloadProfilePdf(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String uid = request.getParameter("uid");
        if (uid == null || uid.isEmpty()) {
            response.sendError(400, "缺少uid参数");
            return;
        }

        TA ta = userService.getTAById(uid);
        if (ta == null) {
            response.sendError(404, "用户不存在");
            return;
        }

        if (ta.getProfileVisible() == null || !ta.getProfileVisible()) {
            response.sendError(403, "该用户设置了隐私保护，无法下载");
            return;
        }

        String pdfPath = ta.getProfilePdfPath();
        if (pdfPath == null || pdfPath.isEmpty()) {
            response.sendError(404, "该用户未上传个人资料PDF");
            return;
        }

        String realPath = request.getServletContext().getRealPath(pdfPath);
        File pdfFile = new File(realPath);
        if (!pdfFile.exists()) {
            response.sendError(404, "文件不存在");
            return;
        }

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=\"" + ta.getRealName() + "_profile.pdf\"");
        response.setContentLengthLong(pdfFile.length());

        try (InputStream input = new java.io.FileInputStream(pdfFile);
             java.io.OutputStream output = response.getOutputStream()) {
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = input.read(buffer)) != -1) {
                output.write(buffer, 0, bytesRead);
            }
        }
    }


}
