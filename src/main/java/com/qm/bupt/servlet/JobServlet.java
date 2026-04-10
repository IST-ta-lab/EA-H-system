package com.qm.bupt.servlet;

import com.qm.bupt.entity.Job;
import com.qm.bupt.entity.TA;
import com.qm.bupt.entity.User;
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

@WebServlet("/job")
public class JobServlet extends BaseServlet {

    private final JobService jobService = JobServiceImpl.getInstance();
    private final UserService userService = UserServiceImpl.getInstance();

    /**
     * 1. MO发布岗位（必须登录）
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
        writeJson(response, success ? Result.success("岗位发布成功") : Result.error(500, "发布失败"));
    }

    /**
     * 2. 查询所有发布的岗位（无需登录，游客可看）
     * GET /job?action=listAll
     */
    public void listAll(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<Job> jobs = jobService.listAllJobs();
        writeJson(response, Result.success(jobs));
    }

    /**
     * 3. 查询所有招聘中岗位（无需登录）
     * GET /job?action=listOpen
     */
    public void listOpen(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<Job> jobs = jobService.listOpenJobs();
        writeJson(response, Result.success(jobs));
    }

    /**
     * 4. MO查询自己发布的岗位（必须登录）
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
     * 5. 根据ID查询岗位详情
     * GET /job?action=getDetail&jobId=xxx
     */
    public void getDetail(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String jobId = request.getParameter("jobId");
        Job job = jobService.getJobById(jobId);
        writeJson(response, job != null ? Result.success(job) : Result.error(404, "岗位不存在"));
    }

    /**
     * 6. MO根据工作ID匹配TA（必须登录）
     * GET /job?action=matchTAs&jobId=xxx
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
}