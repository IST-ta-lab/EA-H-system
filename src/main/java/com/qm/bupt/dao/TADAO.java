package com.qm.bupt.dao;

import com.qm.bupt.entity.TA;
import jakarta.servlet.ServletContext;

/**
 * Data access object for TA (Teaching Assistant) entities.
 *
 * <p>Manages persistence of TA-specific extended profile data to the ta.json file.
 * Inherits standard CRUD operations from BaseDAO.</p>
 */
public class TADAO extends BaseDAO<TA> {

    private static final TADAO INSTANCE = new TADAO();
    private String filePath;

    private TADAO() {
    }

    /**
     * Returns the singleton instance of TADAO.
     */
    public static TADAO getInstance() {
        return INSTANCE;
    }

    /**
     * Initializes the file path using the ServletContext.
     */
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