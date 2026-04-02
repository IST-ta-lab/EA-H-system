package com.qm.bupt.servlet;

import com.qm.bupt.entity.Application;
import com.qm.bupt.entity.User;
import com.qm.bupt.service.ApplicationService;
import com.qm.bupt.service.impl.ApplicationServiceImpl;
import com.qm.bupt.util.Result;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.List;

@WebServlet("/application")
public class ApplicationServlet extends BaseServlet {

    private final ApplicationService applicationService = ApplicationServiceImpl.getInstance();

    /**
     * 1. TA申请岗位（必须登录TA）
     * POST /application?action=apply&jobId=xxx
     */
    public void apply(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loginUser = (User) session.getAttribute("loginUser");

        if (loginUser == null) {
            writeJson(response, Result.error(401, "未登录"));
            return;
        }
        if (loginUser.getUserType() != 1) {
            writeJson(response, Result.error(403, "无权限，仅TA可申请岗位"));
            return;
        }

        String jobId = request.getParameter("jobId");
        boolean success = applicationService.applyJob(loginUser.getUserId(), jobId);
        writeJson(response, success ? Result.success("申请成功") : Result.error(400, "申请失败（岗位不存在、已关闭或重复申请）"));
    }

    /**
     * 2. MO审核申请（必须登录MO，且只能审核自己的）
     * POST /application?action=audit&applicationId=xxx&auditStatus=1&remark=xxx
     * auditStatus: 1=通过, 2=拒绝
     */
    public void audit(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loginUser = (User) session.getAttribute("loginUser");

        if (loginUser == null) {
            writeJson(response, Result.error(401, "未登录"));
            return;
        }
        if (loginUser.getUserType() != 2) {
            writeJson(response, Result.error(403, "无权限，仅MO可审核"));
            return;
        }

        String applicationId = request.getParameter("applicationId");
        Integer auditStatus = Integer.parseInt(request.getParameter("auditStatus"));
        String remark = request.getParameter("remark");

        boolean success = applicationService.auditApplication(applicationId, loginUser.getUserId(), auditStatus, remark);
        writeJson(response, success ? Result.success("审核成功") : Result.error(400, "审核失败（无权审核或申请不存在）"));
    }

    /**
     * 3. 查询某岗位的所有申请（MO调用）
     * GET /application?action=listByJob&jobId=xxx
     */
    public void listByJob(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loginUser = (User) session.getAttribute("loginUser");

        if (loginUser == null || loginUser.getUserType() != 2) {
            writeJson(response, Result.error(403, "无权限"));
            return;
        }

        String jobId = request.getParameter("jobId");
        List<Application> apps = applicationService.listApplicationsByJobId(jobId);
        writeJson(response, Result.success(apps));
    }

    /**
     * 4. TA查询自己的申请记录
     * GET /application?action=listMy
     */
    public void listMy(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loginUser = (User) session.getAttribute("loginUser");

        if (loginUser == null || loginUser.getUserType() != 1) {
            writeJson(response, Result.error(403, "无权限"));
            return;
        }

        List<Application> apps = applicationService.listMyApplications(loginUser.getUserId());
        writeJson(response, Result.success(apps));
    }
}