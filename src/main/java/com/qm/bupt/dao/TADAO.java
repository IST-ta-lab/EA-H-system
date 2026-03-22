package com.qm.bupt.dao;

import com.qm.bupt.entity.TA;
import jakarta.servlet.ServletContext;

public class TADAO extends BaseDAO<TA> {

    private static final TADAO INSTANCE = new TADAO();
    private String filePath;

    private TADAO() {
    }

    public static TADAO getInstance() {
        return INSTANCE;
    }

    public void init(ServletContext context) {
        this.filePath = context.getRealPath("/WEB-INF/data/ta.json");
    }

    @Override
    protected String getFilePath() {
        return filePath;
    }

    @Override
    protected Class<TA> getEntityClass() {
        return TA.class;
    }
}