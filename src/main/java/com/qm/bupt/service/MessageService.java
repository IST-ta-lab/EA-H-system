package com.qm.bupt.service;

import com.qm.bupt.entity.Message;

import java.util.List;

public interface MessageService {
    boolean sendMessage(Message message);

    List<Message> getConversationHistory(String userId, String otherUserId, int page, int size);

    List<String> getConversationUsers(String userId);

    int getUnreadCount(String userId);

    void markAsRead(String userId, List<String> messageIds);
}