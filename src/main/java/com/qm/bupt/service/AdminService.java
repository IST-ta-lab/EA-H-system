package com.qm.bupt.service;

import com.qm.bupt.dto.UserDetailDTO;
import com.qm.bupt.dto.UserListDTO;
import com.qm.bupt.entity.Job;
import java.util.List;

/**
 * Service interface for administrative operations.
 *
 * <p>Provides user management (list, detail, delete) and job management
 * (list all, delete with cascading application removal) functions
 * available exclusively to Admin users.</p>
 */
public interface AdminService {

    /**
     * Lists all users with summary information for the admin dashboard.
     *
     * @return list of UserListDTO with basic user info and role descriptions
     */
    List<UserListDTO> listAllUsers();

    /**
     * Deletes a user and their role-specific data (TA/MO sub-records).
     *
     * @param userId the user ID to delete
     * @return true if the deletion succeeded
     */
    boolean deleteUser(String userId);

    /**
     * Retrieves detailed user information including role-specific data.
     *
     * @param userId the user ID to query
     * @return a UserDetailDTO with common and role-specific fields, or null if not found
     */
    UserDetailDTO getUserDetail(String userId);

    /**
     * Lists all job postings across all MOs.
     *
     * @return list of all jobs
     */
    List<Job> listAllJobs();

    /**
     * Deletes a job posting and cascadingly removes its related applications.
     *
     * @param jobId the job ID to delete
     * @return true if the deletion succeeded
     */
    boolean deleteJob(String jobId);
}