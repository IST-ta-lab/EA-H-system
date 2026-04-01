package com.qm.bupt.service;

import com.qm.bupt.entity.Job;
import java.util.List;

public interface JobService {
    // 1. MO发布新岗位
    boolean publishJob(Job job, String publisherMoId);
    // 2. 查询所有发布的岗位（游客可看）
    List<Job> listAllJobs();
    // 3. 查询所有招聘中岗位
    List<Job> listOpenJobs();
    // 4. MO查询自己发布的岗位
    List<Job> listMyJobs(String moUserId);
    // 5. 根据ID查询岗位
    Job getJobById(String jobId);
}