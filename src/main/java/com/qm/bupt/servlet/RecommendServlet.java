package com.qm.bupt.servlet;

import com.qm.bupt.entity.User;
import com.qm.bupt.service.RecommendService;
import com.qm.bupt.service.RecommendService.RecommendResult;
import com.qm.bupt.util.Result;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.List;

/**
 * Servlet providing AI-powered recommendation endpoints.
 *
 * <p>Mapped to {@code /recommend?action=xxx}. Supports job-to-TA and TA-to-job
 * recommendations based on vector embedding similarity scores.</p>
 */
@WebServlet("/recommend")
public class RecommendServlet extends BaseServlet {

    private final RecommendService recommendService = RecommendService.getInstance();

    public void recommendJobsForTA(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loginUser = (User) session.getAttribute("loginUser");

        if (loginUser == null) {
            writeJson(response, Result.error(401, "未登录"));
            return;
        }

        String taId = request.getParameter("taId");
        String topKStr = request.getParameter("topK");
        
        String targetTaId = taId;
        if (targetTaId == null || targetTaId.isEmpty()) {
            targetTaId = loginUser.getUserId();
        }

        int topK = 10;
        if (topKStr != null && !topKStr.isEmpty()) {
            try {
                topK = Integer.parseInt(topKStr);
                topK = Math.max(1, Math.min(topK, 50));
            } catch (NumberFormatException e) {
                topK = 10;
            }
        }

        List<RecommendResult> results = recommendService.recommendJobsForTA(targetTaId, topK);
        writeJson(response, Result.success(results));
    }

    public void recommendTAsForJob(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loginUser = (User) session.getAttribute("loginUser");

        if (loginUser == null) {
            writeJson(response, Result.error(401, "未登录"));
            return;
        }

        String jobId = request.getParameter("jobId");
        String topKStr = request.getParameter("topK");

        if (jobId == null || jobId.isEmpty()) {
            writeJson(response, Result.error(400, "缺少jobId参数"));
            return;
        }

        int topK = 10;
        if (topKStr != null && !topKStr.isEmpty()) {
            try {
                topK = Integer.parseInt(topKStr);
                topK = Math.max(1, Math.min(topK, 50));
            } catch (NumberFormatException e) {
                topK = 10;
            }
        }

        List<RecommendResult> results = recommendService.recommendTAsForJob(jobId, topK);
        writeJson(response, Result.success(results));
    }
}