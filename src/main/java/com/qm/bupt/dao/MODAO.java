package com.qm.bupt.dao;

import com.qm.bupt.entity.MO;
import jakarta.servlet.ServletContext;

public class MODAO extends BaseDAO<MO> {

    private static final MODAO INSTANCE = new MODAO();
    private String filePath;

    private MODAO() {
    }

    public static MODAO getInstance() {
        return INSTANCE;
    }

    public void init(ServletContext context) {
        this.filePath = context.getRealPath("/WEB-INF/data/mo.json");
    }

    @Override
    protected String getFilePath() {
        return filePath;
    }

    @Override
    protected Class<MO> getEntityClass() {
        return MO.class;
    }
}