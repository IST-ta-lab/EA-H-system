package com.qm.bupt.service;

import com.qm.bupt.entity.Admin;
import com.qm.bupt.entity.MO;
import com.qm.bupt.entity.TA;
import com.qm.bupt.entity.User;

import java.util.List;

/**
 * Service interface for user-related business operations.
 *
 * <p>Covers login, registration (for all three roles), profile management,
 * user lookup, tag-based TA matching, and MO listing.</p>
 */
public interface UserService {

    /**
     * Authenticates a user by username and password.
     *
     * @param username the login username
     * @param password the plaintext password (will be MD5-hashed for comparison)
     * @return the authenticated User object, or null if credentials are invalid
     */
    User login(String username, String password);

    /**
     * Registers a new TA account.
     *
     * @param ta the TA entity containing registration details
     * @return true if registration succeeded, false if the username already exists
     */
    boolean registerTA(TA ta);

    /**
     * Registers a new MO account.
     *
     * @param mo the MO entity containing registration details
     * @return true if registration succeeded, false if the username already exists
     */
    boolean registerMO(MO mo);

    /**
     * Registers a new Admin account.
     *
     * @param admin the Admin entity containing registration details
     * @return true if registration succeeded, false if the username already exists
     */
    boolean registerAdmin(Admin admin);

    /**
     * Looks up a user by their username.
     *
     * @param username the username to search for
     * @return the matching User, or null if not found
     */
    User getUserByUsername(String username);

    /**
     * Looks up a user by their unique ID.
     *
     * @param userId the user ID to search for
     * @return the matching User, or null if not found
     */
    User getUserById(String userId);

    /**
     * Looks up a TA by their user ID from the TA data store.
     *
     * @param userId the TA's user ID
     * @return the matching TA entity, or null if not found
     */
    TA getTAById(String userId);

    /**
     * Updates a TA's profile in both the user and TA data stores.
     *
     * @param ta the TA entity with updated fields
     * @return true if the update succeeded
     */
    boolean updateTAProfile(TA ta);

    /**
     * Matches TAs to a set of job tags, returning results sorted by match count descending.
     *
     * @param jobTags the tags required by the job
     * @return a list of TAs with their match scores populated, sorted by relevance
     */
    List<TA> matchTAsByTags(List<String> jobTags);

    /**
     * Returns all MO users with basic info (userId, realName, username).
     *
     * @return list of all MO users
     */
    List<User> listMOs();
}
