package com.qm.bupt.dao;

import com.qm.bupt.entity.Message;
import com.qm.bupt.util.FileUtil;
import com.qm.bupt.util.JsonUtil;
import jakarta.servlet.ServletContext;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Data access object for Message entities.
 *
 * <p>Manages persistence of in-app messages to the message.json file.
 * Provides custom query methods for conversation history, unread counts,
 * and read-status marking. Unlike other DAOs, MessageDAO does not extend
 * BaseDAO due to its specialized query requirements.</p>
 */
public class MessageDAO {

    private static final MessageDAO INSTANCE = new MessageDAO();
    private static final Object LOCK = new Object();
    private String filePath;

    private MessageDAO() {
    }

    /**
     * Returns the singleton instance of MessageDAO.
     */
    public static MessageDAO getInstance() {
        return INSTANCE;
    }

    /**
     * Initializes the file path using the ServletContext.
     */
    public void init(ServletContext context) {
        this.filePath = context.getRealPath("/WEB-INF/data/message.json");
    }

    /**
     * Adds a new message to the data file.
     *
     * @param message the message to persist
     * @return true if successful, false on I/O error
     */
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

    /**
     * Retrieves all messages from the data file.
     *
     * @return list of all messages, or an empty list if the file is empty
     */
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

    /**
     * Finds all messages exchanged between two users (both directions),
     * sorted by send time descending.
     *
     * @param senderId   one user's ID
     * @param receiverId the other user's ID
     * @return list of messages in the conversation
     */
    public List<Message> findBySenderAndReceiver(String senderId, String receiverId) {
        List<Message> all = findAll();
        return all.stream()
                .filter(m -> (m.getSenderId().equals(senderId) && m.getReceiverId().equals(receiverId))
                        || (m.getSenderId().equals(receiverId) && m.getReceiverId().equals(senderId)))
                .sorted((a, b) -> b.getSendTime().compareTo(a.getSendTime()))
                .collect(Collectors.toList());
    }

    /**
     * Finds all unique user IDs that the given user has conversed with.
     *
     * @param userId the user to find conversation partners for
     * @return list of unique user IDs
     */
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

    /**
     * Counts the number of unread messages for a given user.
     *
     * @param userId the receiver's user ID
     * @return the count of messages with status = 0 (unread)
     */
    public int countUnread(String userId) {
        List<Message> all = findAll();
        return (int) all.stream()
                .filter(m -> m.getReceiverId().equals(userId) && m.getStatus() == 0)
                .count();
    }

    /**
     * Marks a list of messages as read (status = 1).
     *
     * @param messageIds list of message IDs to mark as read
     */
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