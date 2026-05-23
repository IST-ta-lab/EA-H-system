package com.qm.bupt.service;

import com.qm.bupt.dao.JobDAO;
import com.qm.bupt.entity.Job;
import com.qm.bupt.service.impl.JobServiceImpl;

import org.junit.jupiter.api.*;

import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * JobService integration tests — exercises publish/update/delete logic through real DAO/JSON persistence.
 */
class JobServiceTest {

    private static JobService jobService;
    private static Path tempDir;

    private static final String MO_USER_ID = "mo-001";
    private static final String OTHER_MO_ID = "mo-other";

    @BeforeAll
    static void setup() throws Exception {
        tempDir = Files.createTempDirectory("tapj-job-test");

        // Set file path on singleton DAO via reflection
        setDaoFilePath(JobDAO.getInstance(), tempDir.resolve("job.json").toString());

        // Create empty JSON file
        Files.write(tempDir.resolve("job.json"), "[]".getBytes());

        jobService = JobServiceImpl.getInstance();
    }

    @BeforeEach
    void resetData() throws Exception {
        Files.write(tempDir.resolve("job.json"), "[]".getBytes());
    }

    // --- Tests ---

    @Test
    @DisplayName("publishJob: success sets all fields correctly")
    void publishJob_success_setsAllFields() {
        Job job = new Job();
        job.setJobName("Software Engineer TA");
        job.setJobType(1);
        job.setBelongModule("CS201");
        job.setJobDesc("Assist with lab sessions");
        job.setWorkHoursWeekly(8.0);
        job.setRecruitNum(2);
        job.setTags(Arrays.asList("Java", "Spring"));

        boolean result = jobService.publishJob(job, MO_USER_ID);
        assertTrue(result);

        // Verify generated fields
        assertNotNull(job.getJobId());
        assertEquals(MO_USER_ID, job.getPublisherMoId());
        assertNotNull(job.getPublishTime());
        assertEquals(0, job.getHiredNum().intValue());
        assertEquals(0, job.getJobStatus().intValue());
    }

    @Test
    @DisplayName("listOpenJobs: filters only status=0 jobs")
    void listOpenJobs_filtersCorrectly() {
        // Publish 2 open jobs
        publishHelper("Open Job 1", MO_USER_ID);
        publishHelper("Open Job 2", MO_USER_ID);

        // Publish a 3rd and then close it
        Job job3 = new Job();
        job3.setJobName("Closed Job");
        job3.setJobType(1);
        job3.setRecruitNum(1);
        jobService.publishJob(job3, MO_USER_ID);
        // Close it
        job3.setJobStatus(1);
        JobDAO.getInstance().updateById(job3, job3.getJobId(), "jobId");

        List<Job> openJobs = jobService.listOpenJobs();
        assertEquals(2, openJobs.size());
        for (Job j : openJobs) {
            assertEquals(0, j.getJobStatus().intValue());
        }
    }

    @Test
    @DisplayName("listMyJobs: filters by publisher MO id")
    void listMyJobs_filtersCorrectly() {
        publishHelper("My Job 1", MO_USER_ID);
        publishHelper("My Job 2", MO_USER_ID);
        publishHelper("Other Job", OTHER_MO_ID);

        List<Job> myJobs = jobService.listMyJobs(MO_USER_ID);
        assertEquals(2, myJobs.size());
        for (Job j : myJobs) {
            assertEquals(MO_USER_ID, j.getPublisherMoId());
        }
    }

    @Test
    @DisplayName("updateJob: success preserves system fields")
    void updateJob_success_preservesFields() {
        publishHelper("Original Job", MO_USER_ID);
        Job original = jobService.listMyJobs(MO_USER_ID).get(0);
        String originalId = original.getJobId();
        String originalTime = original.getPublishTime();

        // Build update payload
        Job update = new Job();
        update.setJobId(originalId);
        update.setJobName("Updated Job Name");
        update.setJobType(2);
        update.setRecruitNum(5);
        update.setJobStatus(0);

        boolean result = jobService.updateJob(update, MO_USER_ID);
        assertTrue(result);

        Job updated = jobService.getJobById(originalId);
        assertEquals("Updated Job Name", updated.getJobName());
        assertEquals(originalTime, updated.getPublishTime()); // preserved
        assertEquals(MO_USER_ID, updated.getPublisherMoId()); // preserved
        assertEquals(0, updated.getHiredNum().intValue()); // preserved
    }

    @Test
    @DisplayName("updateJob: wrong MO returns false")
    void updateJob_wrongMO_returnsFalse() {
        publishHelper("My Job", MO_USER_ID);
        Job job = jobService.listMyJobs(MO_USER_ID).get(0);

        Job update = new Job();
        update.setJobId(job.getJobId());
        update.setJobName("Hijacked");

        boolean result = jobService.updateJob(update, OTHER_MO_ID);
        assertFalse(result);
    }

    @Test
    @DisplayName("updateJob: nonexistent job returns false")
    void updateJob_nonexistent_returnsFalse() {
        Job update = new Job();
        update.setJobId("nonexistent-id");
        update.setJobName("Ghost");

        boolean result = jobService.updateJob(update, MO_USER_ID);
        assertFalse(result);
    }

    @Test
    @DisplayName("deleteJob: success returns true")
    void deleteJob_success_returnsTrue() {
        publishHelper("Deletable Job", MO_USER_ID);
        Job job = jobService.listMyJobs(MO_USER_ID).get(0);

        boolean result = jobService.deleteJob(job.getJobId(), MO_USER_ID);
        assertTrue(result);

        // Verify deletion
        assertNull(jobService.getJobById(job.getJobId()));
    }

    @Test
    @DisplayName("deleteJob: wrong MO returns false")
    void deleteJob_wrongMO_returnsFalse() {
        publishHelper("Protected Job", MO_USER_ID);
        Job job = jobService.listMyJobs(MO_USER_ID).get(0);

        boolean result = jobService.deleteJob(job.getJobId(), OTHER_MO_ID);
        assertFalse(result);

        // Job should still exist
        assertNotNull(jobService.getJobById(job.getJobId()));
    }

    @Test
    @DisplayName("listAllJobs: returns all jobs regardless of publisher")
    void listAllJobs_returnsAllJobs() {
        publishHelper("Job A", MO_USER_ID);
        publishHelper("Job B", OTHER_MO_ID);

        List<Job> allJobs = jobService.listAllJobs();
        assertEquals(2, allJobs.size());
    }

    @Test
    @DisplayName("listAllJobs: empty when no jobs published")
    void listAllJobs_empty_returnsEmptyList() {
        List<Job> allJobs = jobService.listAllJobs();
        assertNotNull(allJobs);
        assertTrue(allJobs.isEmpty());
    }

    @Test
    @DisplayName("getJobById: null jobId returns null")
    void getJobById_nullId_returnsNull() {
        Job found = jobService.getJobById(null);
        assertNull(found);
    }

    @Test
    @DisplayName("getJobById: nonexistent jobId returns null")
    void getJobById_nonexistent_returnsNull() {
        Job found = jobService.getJobById("fake-job-id");
        assertNull(found);
    }

    @Test
    @DisplayName("listOpenJobs: closed job (status=1) is excluded")
    void listOpenJobs_closedJobExcluded() throws Exception {
        publishHelper("Open Job", MO_USER_ID);
        publishHelper("Soon Closed", MO_USER_ID);

        // Manually set second job's status to 1 (closed) via JSON
        List<Job> myJobs = jobService.listMyJobs(MO_USER_ID);
        Job toClose = myJobs.get(1);
        String json = new String(java.nio.file.Files.readAllBytes(tempDir.resolve("job.json")));
        json = json.replace(
            "\"jobId\": \"" + toClose.getJobId() + "\", \"publisherMoId\": \"" + MO_USER_ID + "\", \"jobName\": \"Soon Closed\"",
            "\"jobId\": \"" + toClose.getJobId() + "\", \"publisherMoId\": \"" + MO_USER_ID + "\", \"jobName\": \"Soon Closed\""
        );
        // Use a simpler approach: update via the DAO
        toClose.setJobStatus(1);
        com.qm.bupt.dao.JobDAO.getInstance().updateById(toClose, toClose.getJobId(), "jobId");

        List<Job> openJobs = jobService.listOpenJobs();
        assertEquals(1, openJobs.size());
        assertEquals("Open Job", openJobs.get(0).getJobName());
    }

    @Test
    @DisplayName("deleteJob: nonexistent jobId returns false")
    void deleteJob_nonexistent_returnsFalse() {
        boolean result = jobService.deleteJob("fake-job-id", MO_USER_ID);
        assertFalse(result);
    }

    @Test
    @DisplayName("publishJob: null job throws NullPointerException")
    void publishJob_nullJob_throwsNPE() {
        assertThrows(NullPointerException.class, () -> {
            jobService.publishJob(null, MO_USER_ID);
        });
    }

    // --- Helper methods ---

    private void publishHelper(String name, String moId) {
        Job job = new Job();
        job.setJobName(name);
        job.setJobType(1);
        job.setBelongModule("Module");
        job.setJobDesc("Description");
        job.setWorkHoursWeekly(5.0);
        job.setRecruitNum(2);
        jobService.publishJob(job, moId);
    }

    private static void setDaoFilePath(Object dao, String path) throws Exception {
        Field field = dao.getClass().getDeclaredField("filePath");
        field.setAccessible(true);
        field.set(dao, path);
    }
}
