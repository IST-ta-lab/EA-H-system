package com.qm.bupt.dao;

import com.qm.bupt.entity.Job;
import jakarta.servlet.ServletContext;

public class JobDAO extends BaseDAO<Job> {

    private static final JobDAO INSTANCE = new JobDAO();
    private String filePath;

    private JobDAO() {
    }

    public static JobDAO getInstance() {
        return INSTANCE;
    }

    public void init(ServletContext context) {
        this.filePath = context.getRealPath("/WEB-INF/data/job.json");
    }

    @Override
    protected String getFilePath() {
        return filePath;
    }

    @Override
    protected Class<Job> getEntityClass() {
        return Job.class;
    }
}