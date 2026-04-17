package com.qm.bupt.servlet;

import com.qm.bupt.dao.ApplicationDAO;
import com.qm.bupt.dao.JobDAO;
import com.qm.bupt.entity.*;
import com.qm.bupt.service.MessageService;
import com.qm.bupt.service.impl.MessageServiceImpl;
import com.qm.bupt.util.Result;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.*;

@WebServlet("/message")
public class MessageServlet extends BaseServlet {

    private final MessageService messageService = MessageServiceImpl.getInstance();
    private final JobDAO jobDAO = JobDAO.getInstance();
    private final ApplicationDAO applicationDAO = ApplicationDAO.getInstance();

    public void send(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            writeJson(response, Result.error(401, "请先登录"));
            return;
        }

        String receiverId = request.getParameter("receiverId");
        String content = request.getParameter("content");
        String jobId = request.getParameter("jobId");
        String jobTitle = request.getParameter("jobTitle");

        if (receiverId == null || receiverId.isEmpty() || content == null || content.isEmpty()) {
            writeJson(response, Result.error(400, "接收者ID和消息内容不能为空"));
            return;
        }

        Message message = new Message();
        message.setSenderId(loginUser.getUserId());
        message.setReceiverId(receiverId);
        message.setContent(content);
        message.setJobId(jobId);
        message.setJobTitle(jobTitle);

        boolean success = messageService.sendMessage(message);
        if (success) {
            writeJson(response, Result.success("消息发送成功", message));
        } else {
            writeJson(response, Result.error(500, "消息发送失败"));
        }
    }

    public void getHistory(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            writeJson(response, Result.error(401, "请先登录"));
            return;
        }

        String otherUserId = request.getParameter("otherUserId");
        if (otherUserId == null || otherUserId.isEmpty()) {
            writeJson(response, Result.error(400, "对方用户ID不能为空"));
            return;
        }

        int page = 1;
        int size = 20;
        try {
            if (request.getParameter("page") != null) {
                page = Integer.parseInt(request.getParameter("page"));
            }
            if (request.getParameter("size") != null) {
                size = Integer.parseInt(request.getParameter("size"));
            }
        } catch (NumberFormatException e) {
            // use default values
        }

        List<Message> messages = messageService.getConversationHistory(loginUser.getUserId(), otherUserId, page, size);
        writeJson(response, Result.success("获取成功", messages));
    }

    public void listConversations(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            writeJson(response, Result.error(401, "请先登录"));
            return;
        }

        List<String> conversationUserIds = messageService.getConversationUsers(loginUser.getUserId());
        List<ConversationDTO> result = new ArrayList<>();

        // 获取当前用户发布的岗位ID列表（如果是MO）
        Set<String> myPublishedJobIds = new HashSet<>();
        if (loginUser instanceof MO) {
            MO mo = (MO) loginUser;
            if (mo.getPublishedJobIds() != null) {
                myPublishedJobIds.addAll(mo.getPublishedJobIds());
            }
        }
        // 获取当前用户申请过的岗位ID列表（如果是TA）
        Set<String> myAppliedJobIds = new HashSet<>();
        if (loginUser instanceof TA) {
            TA ta = (TA) loginUser;
            List<Application> applications = applicationDAO.listAll();
            for (Application app : applications) {
                if (app.getTaUserId().equals(ta.getUserId())) {
                    myAppliedJobIds.add(app.getJobId());
                }
            }
        }

        for (String uid : conversationUserIds) {
            User user = com.qm.bupt.dao.UserDAO.getInstance().findById(uid);
            if (user == null) continue;

            ConversationDTO dto = new ConversationDTO();
            dto.setUserId(uid);
            dto.setUserName(user.getRealName());
            dto.setUserType(user.getUserType());
            dto.setUserTypeDesc(user.getRoleDesc());

            // 查找该用户与当前用户消息中关联的Job
            List<JobSimple> relatedJobs = new ArrayList<>();
            boolean isRelated = false;

            if (user instanceof TA) {
                // 对方是TA：查找该TA申请过的岗位中，有哪些是当前MO发布的
                List<Application> applications = applicationDAO.listAll();
                for (Application app : applications) {
                    if (app.getTaUserId().equals(uid)) {
                        Job job = jobDAO.getById(app.getJobId(), "jobId").orElse(null);
                        if (job != null) {
                            relatedJobs.add(new JobSimple(job.getJobId(), job.getJobName()));
                            if (myPublishedJobIds.contains(job.getJobId())) {
                                isRelated = true;
                            }
                        }
                    }
                }
            } else if (user instanceof MO) {
                // 对方是MO：查找该MO发布的岗位中，有哪些是当前TA申请过的
                MO otherMo = (MO) user;
                if (otherMo.getPublishedJobIds() != null) {
                    for (String jobId : otherMo.getPublishedJobIds()) {
                        Job job = jobDAO.getById(jobId, "jobId").orElse(null);
                        if (job != null) {
                            relatedJobs.add(new JobSimple(job.getJobId(), job.getJobName()));
                            if (myAppliedJobIds.contains(jobId)) {
                                isRelated = true;
                            }
                        }
                    }
                }
            }

            dto.setRelatedJobs(relatedJobs);
            dto.setRelated(isRelated);
            result.add(dto);
        }

        writeJson(response, Result.success("获取成功", result));
    }

    public void getUnreadCount(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            writeJson(response, Result.error(401, "请先登录"));
            return;
        }

        int count = messageService.getUnreadCount(loginUser.getUserId());
        writeJson(response, Result.success("获取成功", count));
    }

    public void markRead(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            writeJson(response, Result.error(401, "请先登录"));
            return;
        }

        String messageIdsStr = request.getParameter("messageIds");
        if (messageIdsStr == null || messageIdsStr.isEmpty()) {
            writeJson(response, Result.error(400, "消息ID不能为空"));
            return;
        }

        List<String> messageIds = Arrays.asList(messageIdsStr.split(","));
        messageService.markAsRead(loginUser.getUserId(), messageIds);
        writeJson(response, Result.success("标记成功", null));
    }
}