package com.qm.bupt.servlet;

import java.io.Serializable;

/**
 * 简洁的Job信息，用于会话列表展示
 */
public class JobSimple implements Serializable {
    private static final long serialVersionUID = 1L;

    private String jobId;
    private String jobName;

    public JobSimple() {}

    public JobSimple(String jobId, String jobName) {
        this.jobId = jobId;
        this.jobName = jobName;
    }

    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }
    public String getJobName() { return jobName; }
    public void setJobName(String jobName) { this.jobName = jobName; }
}