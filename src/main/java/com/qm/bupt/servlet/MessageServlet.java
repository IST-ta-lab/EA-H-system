package com.qm.bupt.servlet;

import com.qm.bupt.entity.Message;
import com.qm.bupt.entity.User;
import com.qm.bupt.service.MessageService;
import com.qm.bupt.service.impl.MessageServiceImpl;
import com.qm.bupt.util.Result;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@WebServlet("/message")
public class MessageServlet extends BaseServlet {

    private final MessageService messageService = MessageServiceImpl.getInstance();

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
        Map<String, Object> result = new HashMap<>();
        
        for (String uid : conversationUserIds) {
            User user = com.qm.bupt.dao.UserDAO.getInstance().findById(uid);
            if (user != null) {
                result.put(uid, user.getRealName());
            }
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