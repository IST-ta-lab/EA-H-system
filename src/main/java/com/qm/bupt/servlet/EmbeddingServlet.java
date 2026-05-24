package com.qm.bupt.servlet;

import com.qm.bupt.dao.EmbeddingDAO;
import com.qm.bupt.entity.Job;
import com.qm.bupt.entity.TA;
import com.qm.bupt.entity.User;
import com.qm.bupt.service.EmbeddingService;
import com.qm.bupt.service.JobService;
import com.qm.bupt.service.UserService;
import com.qm.bupt.service.impl.JobServiceImpl;
import com.qm.bupt.service.impl.UserServiceImpl;
import com.qm.bupt.util.Result;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servlet for managing vector embeddings used in AI matching.
 *
 * <p>Mapped to {@code /embedding?action=xxx}. Provides endpoints to update
 * and retrieve embedding vectors for both TAs and job postings.</p>
 */
@WebServlet("/embedding")
public class EmbeddingServlet extends BaseServlet {

    private final EmbeddingService embeddingService = EmbeddingService.getInstance();
    private final EmbeddingDAO embeddingDAO = EmbeddingDAO.getInstance();
    private final UserService userService = UserServiceImpl.getInstance();
    private final JobService jobService = JobServiceImpl.getInstance();

    public void updateTAEmbedding(HttpServletRequest request, HttpServletResponse response) throws ServletException, Exception {
        String taId = request.getParameter("taId");
        
        if (taId == null || taId.isEmpty()) {
            writeJson(response, Result.error(400, "缺少taId参数"));
            return;
        }

        TA ta = userService.getTAById(taId);
        if (ta == null) {
            writeJson(response, Result.error(404, "TA不存在"));
            return;
        }

        String textToEmbed = embeddingService.buildTAText(ta.getSelfIntro(), ta.getTags());
        if (textToEmbed == null || textToEmbed.isEmpty()) {
            writeJson(response, Result.error(400, "TA的简介和标签均为空，无法生成向量"));
            return;
        }

        List<Double> embedding = embeddingService.generateEmbedding(textToEmbed);
        boolean success = embeddingDAO.saveTAEmbedding(taId, embedding);
        
        if (success) {
            writeJson(response, Result.success("TA向量更新成功"));
        } else {
            writeJson(response, Result.error(500, "TA向量更新失败"));
        }
    }

    public void updateJobEmbedding(HttpServletRequest request, HttpServletResponse response) throws ServletException, Exception {
        String jobId = request.getParameter("jobId");
        
        if (jobId == null || jobId.isEmpty()) {
            writeJson(response, Result.error(400, "缺少jobId参数"));
            return;
        }

        Job job = jobService.getJobById(jobId);
        if (job == null) {
            writeJson(response, Result.error(404, "Job不存在"));
            return;
        }

        String textToEmbed = embeddingService.buildJobText(job.getJobName(), job.getJobDesc(), job.getTags());
        if (textToEmbed == null || textToEmbed.isEmpty()) {
            writeJson(response, Result.error(400, "Job的名称、描述和标签均为空，无法生成向量"));
            return;
        }

        List<Double> embedding = embeddingService.generateEmbedding(textToEmbed);
        boolean success = embeddingDAO.saveJobEmbedding(jobId, embedding);
        
        if (success) {
            writeJson(response, Result.success("Job向量更新成功"));
        } else {
            writeJson(response, Result.error(500, "Job向量更新失败"));
        }
    }

    public void getTAEmbedding(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String taId = request.getParameter("taId");
        
        if (taId == null || taId.isEmpty()) {
            writeJson(response, Result.error(400, "缺少taId参数"));
            return;
        }

        List<Double> embedding = embeddingDAO.getTAEmbedding(taId);
        if (embedding == null) {
            writeJson(response, Result.error(404, "TA向量不存在"));
            return;
        }

        writeJson(response, Result.success(embedding));
    }

    public void getJobEmbedding(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String jobId = request.getParameter("jobId");
        
        if (jobId == null || jobId.isEmpty()) {
            writeJson(response, Result.error(400, "缺少jobId参数"));
            return;
        }

        List<Double> embedding = embeddingDAO.getJobEmbedding(jobId);
        if (embedding == null) {
            writeJson(response, Result.error(404, "Job向量不存在"));
            return;
        }

        writeJson(response, Result.success(embedding));
    }
}