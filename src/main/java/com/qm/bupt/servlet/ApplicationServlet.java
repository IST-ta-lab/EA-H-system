package com.qm.bupt.servlet;

import com.qm.bupt.dto.ApplicationDetailDTO;
import com.qm.bupt.dto.MyApplicationDTO;
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

/**
 * Servlet handling job application operations: applying, auditing, listing, and cancelling.
 *
 * <p>Mapped to {@code /application?action=xxx}. TAs can apply for and cancel their own
 * applications; MOs can review applications for their job postings.</p>
 */
@WebServlet("/application")
public class ApplicationServlet extends BaseServlet {

    private final ApplicationService applicationService = ApplicationServiceImpl.getInstance();

    /**
     * Submits a job application (TA only, requires login).
     * POST /application?action=apply&amp;jobId=xxx
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
     * Reviews a job application (MO only, must own the job posting).
     * POST /application?action=audit&amp;applicationId=xxx&amp;auditStatus=1&amp;remark=xxx
     * auditStatus: 1=approve, 2=reject
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
     * Lists all applications for a job posting with TA details (MO only).
     * GET /application?action=listByJob&amp;jobId=xxx
     */
    public void listByJob(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loginUser = (User) session.getAttribute("loginUser");

        if (loginUser == null || loginUser.getUserType() != 2) {
            writeJson(response, Result.error(403, "无权限"));
            return;
        }

        String jobId = request.getParameter("jobId");

        // 【修改点】：调用新的 service 方法，获取带详情的列表
        List<ApplicationDetailDTO> apps = applicationService.listApplicationDetailsByJobId(jobId);
        writeJson(response, Result.success(apps));
    }

    /**
     * Lists the logged-in TA's own application records.
     * GET /application?action=listMy
     */
    public void listMy(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loginUser = (User) session.getAttribute("loginUser");

        if (loginUser == null || loginUser.getUserType() != 1) {
            writeJson(response, Result.error(403, "无权限"));
            return;
        }

        List<MyApplicationDTO> apps = applicationService.listMyApplications(loginUser.getUserId());
        writeJson(response, Result.success(apps));
    }

    /**
     * Cancels a pending application (TA only, cannot cancel approved applications).
     * POST /application?action=cancel&amp;applicationId=xxx
     */
    public void cancel(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loginUser = (User) session.getAttribute("loginUser");

        if (loginUser == null) {
            writeJson(response, Result.error(401, "未登录"));
            return;
        }
        if (loginUser.getUserType() != 1) {
            writeJson(response, Result.error(403, "无权限，仅TA可取消申请"));
            return;
        }

        String applicationId = request.getParameter("applicationId");
        boolean success = applicationService.cancelApplication(loginUser.getUserId(), applicationId);
        writeJson(response, success ? Result.success("已取消申请") : Result.error(400, "取消失败（申请不存在、已通过或无权限）"));
    }

}
