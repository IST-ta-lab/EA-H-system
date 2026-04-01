package com.qm.bupt.service.impl;

import com.qm.bupt.dao.JobDAO;
import com.qm.bupt.entity.Job;
import com.qm.bupt.service.JobService;
import com.qm.bupt.util.AuthUtil;
import com.qm.bupt.util.DateUtil;

import java.util.List;
import java.util.stream.Collectors;

public class JobServiceImpl implements JobService {

    private static final JobServiceImpl INSTANCE = new JobServiceImpl();
    private final JobDAO jobDAO = JobDAO.getInstance();

    private JobServiceImpl() {
    }

    public static JobServiceImpl getInstance() {
        return INSTANCE;
    }

    @Override
    public boolean publishJob(Job job, String publisherMoId) {
        job.setJobId(AuthUtil.generateUUID());
        job.setPublisherMoId(publisherMoId);
        job.setPublishTime(DateUtil.getNow());
        job.setHiredNum(0);
        job.setJobStatus(0); // 0=招聘中
        return jobDAO.save(job);
    }

    @Override
    public List<Job> listAllJobs() {
        return jobDAO.listAll();
    }

    @Override
    public List<Job> listOpenJobs() {
        return jobDAO.listAll().stream()
                .filter(j -> j.getJobStatus() == 0)
                .collect(Collectors.toList());
    }

    @Override
    public List<Job> listMyJobs(String moUserId) {
        return jobDAO.listAll().stream()
                .filter(j -> moUserId.equals(j.getPublisherMoId()))
                .collect(Collectors.toList());
    }

    @Override
    public Job getJobById(String jobId) {
        return jobDAO.getById(jobId, "jobId").orElse(null);
    }
}