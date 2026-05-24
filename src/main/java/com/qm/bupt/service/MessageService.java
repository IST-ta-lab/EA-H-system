package com.qm.bupt.service;

import com.qm.bupt.entity.Message;

import java.util.List;

/**
 * Service interface for in-app messaging between users.
 *
 * <p>Provides message sending, conversation history retrieval with pagination,
 * conversation partner listing, unread counting, and batch mark-as-read.</p>
 */
public interface MessageService {

    /**
     * Sends a message. Automatically populates sender/receiver names and timestamps.
     *
     * @param message the message to send
     * @return true if the message was sent successfully
     */
    boolean sendMessage(Message message);

    /**
     * Retrieves paginated conversation history between two users.
     *
     * @param userId      the current user's ID
     * @param otherUserId the conversation partner's ID
     * @param page        page number (1-indexed)
     * @param size        page size
     * @return list of messages in the conversation
     */
    List<Message> getConversationHistory(String userId, String otherUserId, int page, int size);

    /**
     * Finds all unique user IDs the given user has exchanged messages with.
     *
     * @param userId the user's ID
     * @return list of unique conversation partner IDs
     */
    List<String> getConversationUsers(String userId);

    /**
     * Counts unread messages for a user.
     *
     * @param userId the receiver's user ID
     * @return the number of unread messages
     */
    int getUnreadCount(String userId);

    /**
     * Marks a list of messages as read.
     *
     * @param userId     the reader's user ID
     * @param messageIds the list of message IDs to mark as read
     */
    void markAsRead(String userId, List<String> messageIds);
}