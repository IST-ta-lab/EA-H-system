package com.qm.bupt.servlet;

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
 * Servlet handling job posting operations: publishing, listing, updating, deleting, and TA matching.
 *
 * <p>Mapped to {@code /job?action=xxx}. MOs can publish/update/delete their own jobs;
 * all users (including unauthenticated guests) can browse open job listings.</p>
 */
@WebServlet("/job")
public class JobServlet extends BaseServlet {

    private final JobService jobService = JobServiceImpl.getInstance();
    private final UserService userService = UserServiceImpl.getInstance();
    private final EmbeddingService embeddingService = EmbeddingService.getInstance();

    /**
     * Publishes a new job posting (MO only, requires login).
     * POST /job?action=publish
     */
    public void publish(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loginUser = (User) session.getAttribute("loginUser");

        // 权限校验：仅MO
        if (loginUser == null) {
            writeJson(response, Result.error(401, "未登录"));
            return;
        }
        if (loginUser.getUserType() != 2) {
            writeJson(response, Result.error(403, "无权限，仅MO可发布岗位"));
            return;
        }

        // 封装参数
        Job job = new Job();
        job.setJobName(request.getParameter("jobName"));
        job.setJobType(Integer.parseInt(request.getParameter("jobType")));
        job.setBelongModule(request.getParameter("belongModule"));
        job.setJobDesc(request.getParameter("jobDesc"));
        job.setWorkHoursWeekly(Double.parseDouble(request.getParameter("workHoursWeekly")));
        job.setRecruitNum(Integer.parseInt(request.getParameter("recruitNum")));
        job.setApplyDeadline(request.getParameter("applyDeadline"));

        String tagsParam = request.getParameter("tags");
        if (tagsParam != null && !tagsParam.isEmpty()) {
            List<String> tagList = Arrays.stream(tagsParam.split(","))
                    .map(String::trim)
                    .filter(item -> !item.isEmpty())
                    .collect(Collectors.toList());
            job.setTags(tagList);
        }

        boolean success = jobService.publishJob(job, loginUser.getUserId());
        if (success) {
            try {
                String textToEmbed = embeddingService.buildJobText(job.getJobName(), job.getJobDesc(), job.getTags());
                if (textToEmbed != null && !textToEmbed.isEmpty()) {
                    List<Double> embedding = embeddingService.generateEmbedding(textToEmbed);
                    embeddingService.saveJobEmbedding(job.getJobId(), embedding);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            writeJson(response, Result.success("岗位发布成功"));
        } else {
            writeJson(response, Result.error(500, "发布失败"));
        }
    }

    /**
     * Lists all job postings (no authentication required).
     * GET /job?action=listAll
     */
    public void listAll(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<Job> jobs = jobService.listAllJobs();
        writeJson(response, Result.success(jobs));
    }

    /**
     * Lists only open (recruiting) job postings (no authentication required).
     * GET /job?action=listOpen
     */
    public void listOpen(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<Job> jobs = jobService.listOpenJobs();
        writeJson(response, Result.success(jobs));
    }

    /**
     * Lists jobs published by the currently logged-in MO.
     * GET /job?action=listMy
     */
    public void listMy(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loginUser = (User) session.getAttribute("loginUser");

        if (loginUser == null) {
            writeJson(response, Result.error(401, "未登录"));
            return;
        }
        if (loginUser.getUserType() != 2) {
            writeJson(response, Result.error(403, "无权限"));
            return;
        }

        List<Job> jobs = jobService.listMyJobs(loginUser.getUserId());
        writeJson(response, Result.success(jobs));
    }

    /**
     * Gets the full details of a job posting by its ID.
     * GET /job?action=getDetail&amp;jobId=xxx
     */
    public void getDetail(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String jobId = request.getParameter("jobId");
        Job job = jobService.getJobById(jobId);
        writeJson(response, job != null ? Result.success(job) : Result.error(404, "岗位不存在"));
    }

    /**
     * Matches TAs to a job posting based on tag similarity (MO only).
     * GET /job?action=matchTAs&amp;jobId=xxx
     */
    public void matchTAs(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loginUser = (User) session.getAttribute("loginUser");

        if (loginUser == null) {
            writeJson(response, Result.error(401, "未登录"));
            return;
        }
        if (loginUser.getUserType() != 2) {
            writeJson(response, Result.error(403, "无权限"));
            return;
        }

        String jobId = request.getParameter("jobId");
        if (jobId == null || jobId.isEmpty()) {
            writeJson(response, Result.error(400, "缺少jobId参数"));
            return;
        }

        Job job = jobService.getJobById(jobId);
        if (job == null) {
            writeJson(response, Result.error(404, "岗位不存在"));
            return;
        }

        List<TA> matchedTAs = userService.matchTAsByTags(job.getTags());
        writeJson(response, Result.success(matchedTAs));
    }

    /**
     * Updates an existing job posting (MO only, must be the original publisher).
     * POST /job?action=update
     */
    public void update(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loginUser = (User) session.getAttribute("loginUser");

        if (loginUser == null) {
            writeJson(response, Result.error(401, "未登录"));
            return;
        }
        if (loginUser.getUserType() != 2) {
            writeJson(response, Result.error(403, "无权限，仅MO可修改岗位"));
            return;
        }

        String jobId = request.getParameter("jobId");
        if (jobId == null || jobId.isEmpty()) {
            writeJson(response, Result.error(400, "缺少jobId参数"));
            return;
        }

        Job existingJob = jobService.getJobById(jobId);
        if (existingJob == null) {
            writeJson(response, Result.error(404, "岗位不存在"));
            return;
        }
        if (!loginUser.getUserId().equals(existingJob.getPublisherMoId())) {
            writeJson(response, Result.error(403, "无权限，只能修改自己发布的岗位"));
            return;
        }

        Job updatedJob = new Job();
        updatedJob.setJobId(jobId);

        String jobName = request.getParameter("jobName");
        if (jobName != null && !jobName.isEmpty()) {
            updatedJob.setJobName(jobName);
        } else {
            updatedJob.setJobName(existingJob.getJobName());
        }

        String jobType = request.getParameter("jobType");
        if (jobType != null && !jobType.isEmpty()) {
            updatedJob.setJobType(Integer.parseInt(jobType));
        } else {
            updatedJob.setJobType(existingJob.getJobType());
        }

        String belongModule = request.getParameter("belongModule");
        if (belongModule != null && !belongModule.isEmpty()) {
            updatedJob.setBelongModule(belongModule);
        } else {
            updatedJob.setBelongModule(existingJob.getBelongModule());
        }

        String jobDesc = request.getParameter("jobDesc");
        if (jobDesc != null && !jobDesc.isEmpty()) {
            updatedJob.setJobDesc(jobDesc);
        } else {
            updatedJob.setJobDesc(existingJob.getJobDesc());
        }

        String workHoursWeekly = request.getParameter("workHoursWeekly");
        if (workHoursWeekly != null && !workHoursWeekly.isEmpty()) {
            updatedJob.setWorkHoursWeekly(Double.parseDouble(workHoursWeekly));
        } else {
            updatedJob.setWorkHoursWeekly(existingJob.getWorkHoursWeekly());
        }

        String recruitNum = request.getParameter("recruitNum");
        if (recruitNum != null && !recruitNum.isEmpty()) {
            updatedJob.setRecruitNum(Integer.parseInt(recruitNum));
        } else {
            updatedJob.setRecruitNum(existingJob.getRecruitNum());
        }

        String applyDeadline = request.getParameter("applyDeadline");
        if (applyDeadline != null && !applyDeadline.isEmpty()) {
            updatedJob.setApplyDeadline(applyDeadline);
        } else {
            updatedJob.setApplyDeadline(existingJob.getApplyDeadline());
        }

        String tagsParam = request.getParameter("tags");
        if (tagsParam != null && !tagsParam.isEmpty()) {
            List<String> tagList = Arrays.stream(tagsParam.split(","))
                    .map(String::trim)
                    .filter(item -> !item.isEmpty())
                    .collect(Collectors.toList());
            updatedJob.setTags(tagList);
        } else {
            updatedJob.setTags(existingJob.getTags());
        }

        boolean success = jobService.updateJob(updatedJob, loginUser.getUserId());
        if (success) {
            try {
                String textToEmbed = embeddingService.buildJobText(updatedJob.getJobName(), updatedJob.getJobDesc(), updatedJob.getTags());
                if (textToEmbed != null && !textToEmbed.isEmpty()) {
                    List<Double> embedding = embeddingService.generateEmbedding(textToEmbed);
                    embeddingService.saveJobEmbedding(jobId, embedding);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            writeJson(response, Result.success("岗位修改成功"));
        } else {
            writeJson(response, Result.error(500, "修改失败"));
        }
    }

    /**
     * Deletes a job posting (MO only, must be the original publisher).
     * POST /job?action=delete&amp;jobId=xxx
     */
    public void delete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loginUser = (User) session.getAttribute("loginUser");

        if (loginUser == null) {
            writeJson(response, Result.error(401, "未登录"));
            return;
        }
        if (loginUser.getUserType() != 2) {
            writeJson(response, Result.error(403, "无权限，仅MO可删除岗位"));
            return;
        }

        String jobId = request.getParameter("jobId");
        if (jobId == null || jobId.isEmpty()) {
            writeJson(response, Result.error(400, "缺少jobId参数"));
            return;
        }

        boolean success = jobService.deleteJob(jobId, loginUser.getUserId());
        if (success) {
            writeJson(response, Result.success("岗位删除成功"));
        } else {
            writeJson(response, Result.error(404, "岗位不存在或无权删除"));
        }
    }
}