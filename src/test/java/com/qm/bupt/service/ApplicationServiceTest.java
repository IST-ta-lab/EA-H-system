package com.qm.bupt.service;

import com.qm.bupt.dao.ApplicationDAO;
import com.qm.bupt.dao.JobDAO;
import com.qm.bupt.dao.TADAO;
import com.qm.bupt.entity.Application;
import com.qm.bupt.entity.Job;
import com.qm.bupt.service.impl.ApplicationServiceImpl;
import com.qm.bupt.service.impl.JobServiceImpl;

import org.junit.jupiter.api.*;

import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * ApplicationService integration tests — exercises apply/audit/cancel logic through real DAO/JSON persistence.
 */
class ApplicationServiceTest {

    private static ApplicationService applicationService;
    private static JobService jobService;
    private static Path tempDir;

    private static final String MO_USER_ID = "mo-001";
    private static final String TA_USER_ID = "ta-001";
    private static final String OTHER_MO_ID = "mo-999";
    private static final String OTHER_TA_ID = "ta-999";

    @BeforeAll
    static void setup() throws Exception {
        tempDir = Files.createTempDirectory("tapj-app-test");

        // Set file paths on singleton DAOs via reflection
        setDaoFilePath(JobDAO.getInstance(), tempDir.resolve("job.json").toString());
        setDaoFilePath(ApplicationDAO.getInstance(), tempDir.resolve("application.json").toString());
        setDaoFilePath(TADAO.getInstance(), tempDir.resolve("ta.json").toString());

        // Create empty JSON files
        Files.write(tempDir.resolve("job.json"), "[]".getBytes());
        Files.write(tempDir.resolve("application.json"), "[]".getBytes());
        Files.write(tempDir.resolve("ta.json"), "[]".getBytes());

        applicationService = ApplicationServiceImpl.getInstance();
        jobService = JobServiceImpl.getInstance();
    }

    @BeforeEach
    void resetData() throws Exception {
        Files.write(tempDir.resolve("job.json"), "[]".getBytes());
        Files.write(tempDir.resolve("application.json"), "[]".getBytes());
        Files.write(tempDir.resolve("ta.json"), "[]".getBytes());
    }

    // --- Tests ---

    @Test
    @DisplayName("applyJob: success returns true")
    void applyJob_success_returnsTrue() {
        String jobId = publishTestJob(MO_USER_ID, 3);

        boolean result = applicationService.applyJob(TA_USER_ID, jobId);
        assertTrue(result);
    }

    @Test
    @DisplayName("applyJob: job not exists returns false")
    void applyJob_jobNotExists_returnsFalse() {
        boolean result = applicationService.applyJob(TA_USER_ID, "nonexistent-job-id");
        assertFalse(result);
    }

    @Test
    @DisplayName("applyJob: job closed returns false")
    void applyJob_jobClosed_returnsFalse() {
        String jobId = publishTestJob(MO_USER_ID, 3);

        // Close the job by updating status to 1 (closed)
        Job job = jobService.getJobById(jobId);
        job.setJobStatus(1);
        JobDAO.getInstance().updateById(job, jobId, "jobId");

        boolean result = applicationService.applyJob(TA_USER_ID, jobId);
        assertFalse(result);
    }

    @Test
    @DisplayName("applyJob: duplicate application returns false")
    void applyJob_duplicate_returnsFalse() {
        String jobId = publishTestJob(MO_USER_ID, 3);
        applicationService.applyJob(TA_USER_ID, jobId);

        boolean result = applicationService.applyJob(TA_USER_ID, jobId);
        assertFalse(result);
    }

    @Test
    @DisplayName("auditApplication: approve increments hiredNum")
    void auditApplication_approve_incrementsHired() {
        String jobId = publishTestJob(MO_USER_ID, 3);
        applicationService.applyJob(TA_USER_ID, jobId);
        String appId = getFirstApplicationId(jobId);

        boolean result = applicationService.auditApplication(appId, MO_USER_ID, 1, "approved");
        assertTrue(result);

        Job job = jobService.getJobById(jobId);
        assertEquals(1, job.getHiredNum().intValue());
    }

    @Test
    @DisplayName("auditApplication: approve auto-closes job when full")
    void auditApplication_approve_autoClosesJob() {
        // Create job with recruitNum=1
        String jobId = publishTestJob(MO_USER_ID, 1);
        applicationService.applyJob(TA_USER_ID, jobId);
        String appId = getFirstApplicationId(jobId);

        applicationService.auditApplication(appId, MO_USER_ID, 1, "hired");

        Job job = jobService.getJobById(jobId);
        assertEquals(2, job.getJobStatus().intValue()); // 2 = filled/closed
    }

    @Test
    @DisplayName("auditApplication: reject does not increment hiredNum")
    void auditApplication_reject_doesNotIncrementHired() {
        String jobId = publishTestJob(MO_USER_ID, 3);
        applicationService.applyJob(TA_USER_ID, jobId);
        String appId = getFirstApplicationId(jobId);

        boolean result = applicationService.auditApplication(appId, MO_USER_ID, 2, "rejected");
        assertTrue(result);

        Job job = jobService.getJobById(jobId);
        assertEquals(0, job.getHiredNum().intValue());
    }

    @Test
    @DisplayName("auditApplication: wrong MO returns false")
    void auditApplication_wrongMO_returnsFalse() {
        String jobId = publishTestJob(MO_USER_ID, 3);
        applicationService.applyJob(TA_USER_ID, jobId);
        String appId = getFirstApplicationId(jobId);

        boolean result = applicationService.auditApplication(appId, OTHER_MO_ID, 1, "no authority");
        assertFalse(result);
    }

    @Test
    @DisplayName("cancelApplication: success returns true")
    void cancelApplication_success_returnsTrue() {
        String jobId = publishTestJob(MO_USER_ID, 3);
        applicationService.applyJob(TA_USER_ID, jobId);
        String appId = getFirstApplicationId(jobId);

        boolean result = applicationService.cancelApplication(TA_USER_ID, appId);
        assertTrue(result);
    }

    @Test
    @DisplayName("cancelApplication: approved application returns false")
    void cancelApplication_approved_returnsFalse() {
        String jobId = publishTestJob(MO_USER_ID, 3);
        applicationService.applyJob(TA_USER_ID, jobId);
        String appId = getFirstApplicationId(jobId);

        // Approve first
        applicationService.auditApplication(appId, MO_USER_ID, 1, "ok");

        boolean result = applicationService.cancelApplication(TA_USER_ID, appId);
        assertFalse(result);
    }

    @Test
    @DisplayName("cancelApplication: wrong user returns false")
    void cancelApplication_wrongUser_returnsFalse() {
        String jobId = publishTestJob(MO_USER_ID, 3);
        applicationService.applyJob(TA_USER_ID, jobId);
        String appId = getFirstApplicationId(jobId);

        boolean result = applicationService.cancelApplication(OTHER_TA_ID, appId);
        assertFalse(result);
    }

    // --- Helper methods ---

    /**
     * Publish a test job and return its generated jobId.
     */
    private String publishTestJob(String moId, int recruitNum) {
        Job job = new Job();
        job.setJobName("Test Job " + System.nanoTime());
        job.setJobType(1);
        job.setBelongModule("CS101");
        job.setJobDesc("Test job description");
        job.setWorkHoursWeekly(10.0);
        job.setRecruitNum(recruitNum);
        jobService.publishJob(job, moId);
        // Retrieve the published job (last one added)
        List<Job> jobs = jobService.listMyJobs(moId);
        return jobs.get(jobs.size() - 1).getJobId();
    }

    /**
     * Get the applicationId of the first application for the given jobId.
     */
    private String getFirstApplicationId(String jobId) {
        List<Application> apps = applicationService.listApplicationsByJobId(jobId);
        assertFalse(apps.isEmpty(), "Expected at least one application");
        return apps.get(0).getApplicationId();
    }

    private static void setDaoFilePath(Object dao, String path) throws Exception {
        Field field = dao.getClass().getDeclaredField("filePath");
        field.setAccessible(true);
        field.set(dao, path);
    }
}
