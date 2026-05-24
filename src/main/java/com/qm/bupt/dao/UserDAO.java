package com.qm.bupt.dao;

import com.qm.bupt.entity.User;
import jakarta.servlet.ServletContext;

import java.util.List;

/**
 * Data access object for User entities.
 *
 * <p>Manages persistence of all user types (TA, MO, Admin) to the user.json file.
 * Extends BaseDAO with a custom {@code findById} helper for direct lookups.</p>
 */
public class UserDAO extends BaseDAO<User> {

    private static final UserDAO INSTANCE = new UserDAO();
    private String filePath;

    private UserDAO() {
    }

    /**
     * Returns the singleton instance of UserDAO.
     */
    public static UserDAO getInstance() {
        return INSTANCE;
    }

    /**
     * Initializes the file path using the ServletContext.
     * Must be called during application startup by SystemInitListener.
     */
    public void init(ServletContext context) {
        this.filePath = context.getRealPath("/WEB-INF/data/user.json");
    }

    @Override
    protected String getFilePath() {
        return filePath;
    }

    @Override
    protected Class<User> getEntityClass() {
        return User.class;
    }

    /**
     * Finds a user by their unique user ID.
     *
     * @param userId the user ID to look up
     * @return the matching User, or null if not found
     */
    public User findById(String userId) {
        List<User> list = listAll();
        for (User u : list) {
            if (u.getUserId().equals(userId)) {
                return u;
            }
        }
        return null;
    }
}