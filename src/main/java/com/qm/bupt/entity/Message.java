package com.qm.bupt.entity;

import java.io.Serializable;

/**
 * Message entity representing in-app communication between users.
 *
 * <p>Messages are sent between TAs, MOs, and Admins. Each message records
 * the sender and receiver (with names for display), content, optional job
 * reference, send time, and read status.</p>
 */
public class Message implements Serializable {
    private static final long serialVersionUID = 1L;

    private String messageId;
    private String senderId;
    private String senderType;
    private String senderName;
    private String receiverId;
    private String receiverType;
    private String receiverName;
    private String content;
    private String jobId;
    private String jobTitle;
    private String sendTime;
    private Integer status;

    public Message() {
    }

    public Message(String messageId, String senderId, String senderType, String senderName,
                 String receiverId, String receiverType, String receiverName,
                 String content, String jobId, String jobTitle, String sendTime, Integer status) {
        this.messageId = messageId;
        this.senderId = senderId;
        this.senderType = senderType;
        this.senderName = senderName;
        this.receiverId = receiverId;
        this.receiverType = receiverType;
        this.receiverName = receiverName;
        this.content = content;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.sendTime = sendTime;
        this.status = status;
    }

    public String getMessageId() {
        return messageId;
    }

    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getSenderType() {
        return senderType;
    }

    public void setSenderType(String senderType) {
        this.senderType = senderType;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getReceiverType() {
        return receiverType;
    }

    public void setReceiverType(String receiverType) {
        this.receiverType = receiverType;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getSendTime() {
        return sendTime;
    }

    public void setSendTime(String sendTime) {
        this.sendTime = sendTime;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}