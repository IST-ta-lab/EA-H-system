package com.qm.bupt.service.impl;

import com.qm.bupt.dao.MessageDAO;
import com.qm.bupt.dao.UserDAO;
import com.qm.bupt.entity.Message;
import com.qm.bupt.entity.User;
import com.qm.bupt.service.MessageService;
import com.qm.bupt.util.DateUtil;

import java.util.List;
import java.util.UUID;

public class MessageServiceImpl implements MessageService {

    private static final MessageServiceImpl INSTANCE = new MessageServiceImpl();
    private final MessageDAO messageDAO = MessageDAO.getInstance();
    private final UserDAO userDAO = UserDAO.getInstance();

    private MessageServiceImpl() {
    }

    public static MessageServiceImpl getInstance() {
        return INSTANCE;
    }

    @Override
    public boolean sendMessage(Message message) {
        if (message == null || message.getSenderId() == null || message.getReceiverId() == null) {
            return false;
        }

        message.setMessageId(UUID.randomUUID().toString());
        message.setSendTime(DateUtil.getNow());
        message.setStatus(0);

        User sender = userDAO.findById(message.getSenderId());
        User receiver = userDAO.findById(message.getReceiverId());

        if (sender != null) {
            message.setSenderType(getUserType(sender));
            message.setSenderName(sender.getRealName());
        }
        if (receiver != null) {
            message.setReceiverType(getUserType(receiver));
            message.setReceiverName(receiver.getRealName());
        }

        messageDAO.add(message);
        return true;
    }

    @Override
    public List<Message> getConversationHistory(String userId, String otherUserId, int page, int size) {
        List<Message> messages = messageDAO.findBySenderAndReceiver(userId, otherUserId);

        int fromIndex = (page - 1) * size;
        int toIndex = Math.min(fromIndex + size, messages.size());

        if (fromIndex >= messages.size()) {
            return java.util.Collections.emptyList();
        }

        return messages.subList(fromIndex, toIndex);
    }

    @Override
    public List<String> getConversationUsers(String userId) {
        return messageDAO.findConversationUsers(userId);
    }

    @Override
    public int getUnreadCount(String userId) {
        return messageDAO.countUnread(userId);
    }

    @Override
    public void markAsRead(String userId, List<String> messageIds) {
        messageDAO.markAsRead(messageIds);
    }

    private String getUserType(User user) {
        if (user instanceof com.qm.bupt.entity.TA) {
            return "TA";
        } else if (user instanceof com.qm.bupt.entity.MO) {
            return "MO";
        } else if (user instanceof com.qm.bupt.entity.Admin) {
            return "Admin";
        }
        return "Unknown";
    }
}