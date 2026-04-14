package com.qm.bupt.dao;

import com.qm.bupt.entity.Message;
import com.qm.bupt.util.FileUtil;
import com.qm.bupt.util.JsonUtil;
import jakarta.servlet.ServletContext;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class MessageDAO {

    private static final MessageDAO INSTANCE = new MessageDAO();
    private static final Object LOCK = new Object();
    private String filePath;

    private MessageDAO() {
    }

    public static MessageDAO getInstance() {
        return INSTANCE;
    }

    public void init(ServletContext context) {
        this.filePath = context.getRealPath("/WEB-INF/data/message.json");
    }

    public boolean add(Message message) {
        synchronized (LOCK) {
            try {
                List<Message> messages = findAll();
                messages.add(message);
                String json = JsonUtil.toJson(messages);
                FileUtil.writeFile(filePath, json);
                return true;
            } catch (IOException e) {
                e.printStackTrace();
                return false;
            }
        }
    }

    public List<Message> findAll() {
        synchronized (LOCK) {
            try {
                String json = FileUtil.readFile(filePath);
                if (json == null || json.isEmpty()) {
                    return new ArrayList<>();
                }
                return JsonUtil.fromJsonToList(json, Message.class);
            } catch (IOException e) {
                e.printStackTrace();
                return new ArrayList<>();
            }
        }
    }

    public List<Message> findBySenderAndReceiver(String senderId, String receiverId) {
        List<Message> all = findAll();
        return all.stream()
                .filter(m -> (m.getSenderId().equals(senderId) && m.getReceiverId().equals(receiverId))
                        || (m.getSenderId().equals(receiverId) && m.getReceiverId().equals(senderId)))
                .sorted((a, b) -> b.getSendTime().compareTo(a.getSendTime()))
                .collect(Collectors.toList());
    }

    public List<String> findConversationUsers(String userId) {
        List<Message> all = findAll();
        List<String> userIds = new ArrayList<>();
        for (Message m : all) {
            if (m.getSenderId().equals(userId) && !userIds.contains(m.getReceiverId())) {
                userIds.add(m.getReceiverId());
            }
            if (m.getReceiverId().equals(userId) && !userIds.contains(m.getSenderId())) {
                userIds.add(m.getSenderId());
            }
        }
        return userIds;
    }

    public int countUnread(String userId) {
        List<Message> all = findAll();
        return (int) all.stream()
                .filter(m -> m.getReceiverId().equals(userId) && m.getStatus() == 0)
                .count();
    }

    public void markAsRead(List<String> messageIds) {
        synchronized (LOCK) {
            try {
                List<Message> all = findAll();
                for (Message m : all) {
                    if (messageIds.contains(m.getMessageId())) {
                        m.setStatus(1);
                    }
                }
                String json = JsonUtil.toJson(all);
                FileUtil.writeFile(filePath, json);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}