package com.qm.bupt.service;

import com.qm.bupt.dto.ApplicationDetailDTO;
import com.qm.bupt.dto.MyApplicationDTO;
import com.qm.bupt.entity.Application;
import java.util.List;

/**
 * Service interface for job application operations.
 *
 * <p>Covers the application lifecycle: TAs apply for jobs, MOs review and
 * audit applications, and TAs can cancel pending applications. Includes
 * DTO assembling for enriched application views.</p>
 */
public interface ApplicationService {

    /**
     * Submits a job application from a TA to a job posting.
     *
     * @param taUserId the applicant TA's user ID
     * @param jobId    the target job ID
     * @return true if the application was submitted successfully
     */
    boolean applyJob(String taUserId, String jobId);

    /**
     * Reviews an application: approve (1) or reject (2).
     *
     * @param applicationId the application ID to review
     * @param moUserId      the reviewing MO's user ID (for ownership verification)
     * @param auditStatus   1 = approve, 2 = reject
     * @param remark        optional review remark
     * @return true if the audit was applied successfully
     */
    boolean auditApplication(String applicationId, String moUserId, Integer auditStatus, String remark);

    /**
     * Lists all applications for a given job.
     *
     * @param jobId the job ID
     * @return list of plain Application entities
     */
    List<Application> listApplicationsByJobId(String jobId);

    /**
     * Lists a TA's own applications with job details.
     *
     * @param taUserId the TA's user ID
     * @return list of MyApplicationDTO containing application and job data
     */
    List<MyApplicationDTO> listMyApplications(String taUserId);

    /**
     * Lists all applications for a job, enriched with TA profile details.
     *
     * @param jobId the job ID
     * @return list of ApplicationDetailDTO containing application and TA data
     */
    List<ApplicationDetailDTO> listApplicationDetailsByJobId(String jobId);

    /**
     * Cancels a pending application (cannot cancel already-approved ones).
     *
     * @param taUserId      the requesting TA's user ID (for ownership verification)
     * @param applicationId the application ID to cancel
     * @return true if the cancellation succeeded
     */
    boolean cancelApplication(String taUserId, String applicationId);
}
