package com.qm.bupt.dao;

import com.qm.bupt.entity.Application;
import jakarta.servlet.ServletContext;

public class ApplicationDAO extends BaseDAO<Application> {

    private static final ApplicationDAO INSTANCE = new ApplicationDAO();
    private String filePath;

    private ApplicationDAO() {
    }

    public static ApplicationDAO getInstance() {
        return INSTANCE;
    }

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