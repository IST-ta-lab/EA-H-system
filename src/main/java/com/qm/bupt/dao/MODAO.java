package com.qm.bupt.dao;

import com.qm.bupt.entity.MO;
import jakarta.servlet.ServletContext;

/**
 * Data access object for MO (Module Organizer) entities.
 *
 * <p>Manages persistence of MO-specific extended profile data to the mo.json file.
 * Inherits standard CRUD operations from BaseDAO.</p>
 */
public class MODAO extends BaseDAO<MO> {

    private static final MODAO INSTANCE = new MODAO();
    private String filePath;

    private MODAO() {
    }

    /**
     * Returns the singleton instance of MODAO.
     */
    public static MODAO getInstance() {
        return INSTANCE;
    }

    /**
     * Initializes the file path using the ServletContext.
     */
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