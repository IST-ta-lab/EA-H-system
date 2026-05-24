package com.qm.bupt.dao;

import com.qm.bupt.entity.Application;
import jakarta.servlet.ServletContext;

/**
 * Data access object for Application entities.
 *
 * <p>Manages persistence of job application records to the application.json file.
 * Inherits standard CRUD operations from BaseDAO.</p>
 */
public class ApplicationDAO extends BaseDAO<Application> {

    private static final ApplicationDAO INSTANCE = new ApplicationDAO();
    private String filePath;

    private ApplicationDAO() {
    }

    /**
     * Returns the singleton instance of ApplicationDAO.
     */
    public static ApplicationDAO getInstance() {
        return INSTANCE;
    }

    /**
     * Initializes the file path using the ServletContext.
     */
    public void init(ServletContext context) {
        this.filePath = context.getRealPath("/WEB-INF/data/application.json");
    }

    @Override
    protected String getFilePath() {
        return filePath;
    }

    @Override
    protected Class<Application> getEntityClass() {
        return Application.class;
    }
}