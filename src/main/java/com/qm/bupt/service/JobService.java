package com.qm.bupt.service;

import com.qm.bupt.entity.Job;
import java.util.List;

/**
 * Service interface for job posting operations.
 *
 * <p>Covers the full job lifecycle: publishing, listing (all/open/my),
 * detail querying, updating, and deleting. Ownership checks ensure MOs
 * can only modify their own postings.</p>
 */
public interface JobService {

    /**
     * Publishes a new job posting under the specified MO.
     *
     * @param job           the job entity to publish
     * @param publisherMoId the MO's user ID
     * @return true if publishing succeeded
     */
    boolean publishJob(Job job, String publisherMoId);

    /**
     * Lists all job postings (including closed and filled).
     *
     * @return list of all jobs
     */
    List<Job> listAllJobs();

    /**
     * Lists only currently open (recruiting) job postings.
     *
     * @return list of open jobs
     */
    List<Job> listOpenJobs();

    /**
     * Lists all jobs published by a specific MO.
     *
     * @param moUserId the MO's user ID
     * @return list of jobs published by this MO
     */
    List<Job> listMyJobs(String moUserId);

    /**
     * Looks up a job by its unique ID.
     *
     * @param jobId the job ID to search for
     * @return the matching Job, or null if not found
     */
    Job getJobById(String jobId);

    /**
     * Updates an existing job posting (MO ownership required).
     *
     * @param job      the updated job entity
     * @param moUserId the requesting MO's user ID (for ownership verification)
     * @return true if the update succeeded
     */
    boolean updateJob(Job job, String moUserId);

    /**
     * Deletes a job posting (MO ownership required).
     *
     * @param jobId    the job ID to delete
     * @param moUserId the requesting MO's user ID (for ownership verification)
     * @return true if the deletion succeeded
     */
    boolean deleteJob(String jobId, String moUserId);
}