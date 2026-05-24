package com.qm.bupt.dao;

import com.qm.bupt.entity.Job;
import jakarta.servlet.ServletContext;

/**
 * Data access object for Job entities.
 *
 * <p>Manages persistence of job postings to the job.json file.
 * Inherits standard CRUD operations from BaseDAO.</p>
 */
public class JobDAO extends BaseDAO<Job> {

    private static final JobDAO INSTANCE = new JobDAO();
    private String filePath;

    private JobDAO() {
    }

    /**
     * Returns the singleton instance of JobDAO.
     */
    public static JobDAO getInstance() {
        return INSTANCE;
    }

    /**
     * Initializes the file path using the ServletContext.
     */
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