package com.qm.bupt.servlet;

import com.qm.bupt.dto.UserDetailDTO;
import com.qm.bupt.dto.UserListDTO;
import com.qm.bupt.entity.Job;
import com.qm.bupt.entity.User;
import com.qm.bupt.service.AdminService;
import com.qm.bupt.service.impl.AdminServiceImpl;
import com.qm.bupt.util.Result;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.List;

/**
 * Servlet handling administrative operations: user and job management.
 *
 * <p>Mapped to {@code /admin?action=xxx}. All endpoints require Admin-level
 * authentication. Provides user listing/detail/deletion and job listing/deletion.</p>
 */
@WebServlet("/admin")
public class AdminServlet extends BaseServlet {

    private final AdminService adminService = AdminServiceImpl.getInstance();

    /**
     * Checks whether the current session has Admin-level authorization.
     */
    private boolean checkAdminAuth(HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        return loginUser != null && loginUser.getUserType() == 3;
    }

    /**
     * Lists all users with summary information (Admin only).
     * GET /admin?action=listUsers
     */
    public void listUsers(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (!checkAdminAuth(request.getSession())) {
            writeJson(response, Result.error(403, "无权限，仅管理员可访问"));
            return;
        }
        List<UserListDTO> users = adminService.listAllUsers();
        writeJson(response, Result.success(users));
    }

    /**
     * Deletes a user and their role-specific data (Admin only).
     * POST /admin?action=deleteUser&amp;userId=xxx
     */
    public void deleteUser(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (!checkAdminAuth(request.getSession())) {
            writeJson(response, Result.error(403, "无权限，仅管理员可访问"));
            return;
        }
        String userId = request.getParameter("userId");
        boolean success = adminService.deleteUser(userId);
        writeJson(response, success ? Result.success("用户删除成功") : Result.error(400, "用户删除失败（用户不存在）"));
    }

    /**
     * Gets detailed information for a specific user (Admin only).
     * GET /admin?action=getUserDetail&amp;userId=xxx
     */
    public void getUserDetail(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (!checkAdminAuth(request.getSession())) {
            writeJson(response, Result.error(403, "无权限，仅管理员可访问"));
            return;
        }
        String userId = request.getParameter("userId");
        UserDetailDTO detail = adminService.getUserDetail(userId);
        writeJson(response, detail != null ? Result.success(detail) : Result.error(404, "用户不存在"));
    }

    /**
     * Lists all job postings across all MOs (Admin only).
     * GET /admin?action=listAllJobs
     */
    public void listAllJobs(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (!checkAdminAuth(request.getSession())) {
            writeJson(response, Result.error(403, "无权限，仅管理员可访问"));
            return;
        }
        List<Job> jobs = adminService.listAllJobs();
        writeJson(response, Result.success(jobs));
    }

    /**
     * Deletes a job posting and cascadingly removes related applications (Admin only).
     * POST /admin?action=deleteJob&amp;jobId=xxx
     */
    public void deleteJob(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (!checkAdminAuth(request.getSession())) {
            writeJson(response, Result.error(403, "无权限，仅管理员可访问"));
            return;
        }
        String jobId = request.getParameter("jobId");
        boolean success = adminService.deleteJob(jobId);
        writeJson(response, success ? Result.success("岗位删除成功（已级联删除相关申请）") : Result.error(400, "岗位删除失败"));
    }
}