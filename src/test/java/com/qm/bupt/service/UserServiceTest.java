package com.qm.bupt.service;

import com.qm.bupt.dao.MODAO;
import com.qm.bupt.dao.TADAO;
import com.qm.bupt.dao.UserDAO;
import com.qm.bupt.entity.Admin;
import com.qm.bupt.entity.MO;
import com.qm.bupt.entity.TA;
import com.qm.bupt.entity.User;
import com.qm.bupt.service.impl.UserServiceImpl;

import org.junit.jupiter.api.*;

import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * UserService integration tests — exercises business logic through real DAO/JSON persistence.
 */
class UserServiceTest {

    private static UserService userService;
    private static Path tempDir;

    @BeforeAll
    static void setup() throws Exception {
        // Create temp directory for JSON storage
        tempDir = Files.createTempDirectory("tapj-user-test");

        // Set file paths on singleton DAOs via reflection (bypass ServletContext)
        setDaoFilePath(UserDAO.getInstance(), tempDir.resolve("user.json").toString());
        setDaoFilePath(TADAO.getInstance(), tempDir.resolve("ta.json").toString());
        setDaoFilePath(MODAO.getInstance(), tempDir.resolve("mo.json").toString());

        // Create empty JSON files that DAOs expect
        Files.write(tempDir.resolve("user.json"), "[]".getBytes());
        Files.write(tempDir.resolve("ta.json"), "[]".getBytes());
        Files.write(tempDir.resolve("mo.json"), "[]".getBytes());

        userService = UserServiceImpl.getInstance();
    }

    @BeforeEach
    void resetData() throws Exception {
        // Reset all JSON files to empty arrays for test isolation
        Files.write(tempDir.resolve("user.json"), "[]".getBytes());
        Files.write(tempDir.resolve("ta.json"), "[]".getBytes());
        Files.write(tempDir.resolve("mo.json"), "[]".getBytes());
    }

    // --- Black-box: Equivalence Partition ---

    @Test
    @DisplayName("login: valid credentials returns user")
    void login_validCredentials_returnsUser() {
        TA ta = buildTA("ta_user1", "pass123");
        userService.registerTA(ta);

        User result = userService.login("ta_user1", "pass123");
        assertNotNull(result);
        assertEquals("ta_user1", result.getUsername());
    }

    @Test
    @DisplayName("login: wrong password returns null")
    void login_wrongPassword_returnsNull() {
        TA ta = buildTA("ta_user2", "correctPwd");
        userService.registerTA(ta);

        User result = userService.login("ta_user2", "wrongPwd");
        assertNull(result);
    }

    @Test
    @DisplayName("login: nonexistent user returns null")
    void login_nonexistentUser_returnsNull() {
        User result = userService.login("ghost_user", "anyPwd");
        assertNull(result);
    }

    @Test
    @DisplayName("login: null username returns null")
    void login_nullUsername_returnsNull() {
        assertNull(userService.login(null, "pass"));
    }

    @Test
    @DisplayName("login: null password returns null")
    void login_nullPassword_returnsNull() {
        assertNull(userService.login("user", null));
    }

    @Test
    @DisplayName("login: empty username returns null")
    void login_emptyUsername_returnsNull() {
        assertNull(userService.login("", "pass"));
    }

    @Test
    @DisplayName("login: empty password returns null")
    void login_emptyPassword_returnsNull() {
        assertNull(userService.login("user", ""));
    }

    @Test
    @DisplayName("registerTA: success returns true")
    void registerTA_success_returnsTrue() {
        TA ta = buildTA("new_ta", "pwd123");
        boolean result = userService.registerTA(ta);
        assertTrue(result);
        assertNotNull(ta.getUserId());
        assertNotNull(ta.getCreateTime());
    }

    @Test
    @DisplayName("registerTA: duplicate username returns false")
    void registerTA_duplicateUsername_returnsFalse() {
        TA ta1 = buildTA("dup_ta", "pwd1");
        userService.registerTA(ta1);

        TA ta2 = buildTA("dup_ta", "pwd2");
        boolean result = userService.registerTA(ta2);
        assertFalse(result);
    }

    @Test
    @DisplayName("registerMO: duplicate username returns false")
    void registerMO_duplicateUsername_returnsFalse() {
        MO mo1 = buildMO("dup_mo", "pwd1");
        userService.registerMO(mo1);

        MO mo2 = buildMO("dup_mo", "pwd2");
        boolean result = userService.registerMO(mo2);
        assertFalse(result);
    }

    @Test
    @DisplayName("registerAdmin: duplicate username returns false")
    void registerAdmin_duplicateUsername_returnsFalse() {
        Admin admin1 = buildAdmin("dup_admin", "pwd1");
        userService.registerAdmin(admin1);

        Admin admin2 = buildAdmin("dup_admin", "pwd2");
        boolean result = userService.registerAdmin(admin2);
        assertFalse(result);
    }

    @Test
    @DisplayName("registerMO: success returns true")
    void registerMO_success_returnsTrue() {
        MO mo = buildMO("new_mo", "pwd456");
        boolean result = userService.registerMO(mo);
        assertTrue(result);
        assertNotNull(mo.getUserId());
    }

    @Test
    @DisplayName("registerAdmin: success returns true")
    void registerAdmin_success_returnsTrue() {
        Admin admin = buildAdmin("new_admin", "pwd789");
        boolean result = userService.registerAdmin(admin);
        assertTrue(result);
        assertNotNull(admin.getUserId());
    }

    @Test
    @DisplayName("getUserByUsername: existing user returns User")
    void getUserByUsername_existing_returnsUser() {
        TA ta = buildTA("findme", "pwd");
        userService.registerTA(ta);

        User found = userService.getUserByUsername("findme");
        assertNotNull(found);
        assertEquals("findme", found.getUsername());
    }

    @Test
    @DisplayName("getUserByUsername: null username returns null")
    void getUserByUsername_null_returnsNull() {
        User found = userService.getUserByUsername(null);
        assertNull(found);
    }

    @Test
    @DisplayName("getUserByUsername: not found returns null")
    void getUserByUsername_notFound_returnsNull() {
        User found = userService.getUserByUsername("no_such_user");
        assertNull(found);
    }

    @Test
    @DisplayName("updateTAProfile: valid TA updates successfully")
    void updateTAProfile_validTA_returnsTrue() {
        TA ta = buildTA("update_ta", "pwd");
        userService.registerTA(ta);

        ta.setRealName("Updated Name");
        ta.setMajor("Physics");
        boolean result = userService.updateTAProfile(ta);
        assertTrue(result);

        TA found = userService.getTAById(ta.getUserId());
        assertEquals("Updated Name", found.getRealName());
    }

    @Test
    @DisplayName("updateTAProfile: null TA returns false")
    void updateTAProfile_nullTA_returnsFalse() {
        boolean result = userService.updateTAProfile(null);
        assertFalse(result);
    }

    @Test
    @DisplayName("updateTAProfile: null userId returns false")
    void updateTAProfile_nullUserId_returnsFalse() {
        TA ta = new TA();
        ta.setUserId(null);
        boolean result = userService.updateTAProfile(ta);
        assertFalse(result);
    }

    @Test
    @DisplayName("matchTAsByTags: null tags returns empty list")
    void matchTAsByTags_nullTags_returnsEmptyList() {
        List<TA> result = userService.matchTAsByTags(null);
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("matchTAsByTags: empty tags returns empty list")
    void matchTAsByTags_emptyTags_returnsEmptyList() {
        List<TA> result = userService.matchTAsByTags(Collections.emptyList());
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("matchTAsByTags: matching tags returns sorted list")
    void matchTAsByTags_matchingTags_returnsSorted() {
        // Register two TAs with different tag overlaps
        TA ta1 = buildTA("ta_tag1", "pwd");
        ta1.setTags(Arrays.asList("Java", "Python"));
        userService.registerTA(ta1);

        TA ta2 = buildTA("ta_tag2", "pwd");
        ta2.setTags(Arrays.asList("Java", "Python", "Go"));
        userService.registerTA(ta2);

        // Search for Java + Python + Go => ta2 should score higher (3 matches vs 2)
        List<TA> result = userService.matchTAsByTags(Arrays.asList("Java", "Python", "Go"));
        assertNotNull(result);
        assertEquals(2, result.size());
        // ta2 has 3 matching tags, ta1 has 2 — ta2 should come first
        assertTrue(result.get(0).getMatchScore() >= result.get(1).getMatchScore());
        assertEquals(3, result.get(0).getMatchScore().intValue());
        assertEquals(2, result.get(1).getMatchScore().intValue());
    }

    @Test
    @DisplayName("getUserById: existing user returns User")
    void getUserById_existing_returnsUser() {
        TA ta = buildTA("ta_by_id", "pwd");
        userService.registerTA(ta);

        User found = userService.getUserById(ta.getUserId());
        assertNotNull(found);
        assertEquals("ta_by_id", found.getUsername());
    }

    @Test
    @DisplayName("getUserById: nonexistent id returns null")
    void getUserById_nonexistent_returnsNull() {
        User found = userService.getUserById("non-existent-id");
        assertNull(found);
    }

    @Test
    @DisplayName("getTAById: existing TA returns TA object")
    void getTAById_existing_returnsTA() {
        TA ta = buildTA("ta_only", "pwd");
        userService.registerTA(ta);

        TA found = userService.getTAById(ta.getUserId());
        assertNotNull(found);
        assertEquals("ta_only", found.getUsername());
    }

    @Test
    @DisplayName("getTAById: nonexistent id returns null")
    void getTAById_nonexistent_returnsNull() {
        TA found = userService.getTAById("non-existent-id");
        assertNull(found);
    }

    @Test
    @DisplayName("matchTAsByTags: TA with null tag element is safely skipped")
    void matchTAsByTags_taWithNullTagElement_safelySkipped() {
        TA ta = buildTA("ta_null_tag", "pwd");
        ta.setTags(Arrays.asList("Java", null, "Python"));
        userService.registerTA(ta);

        // Must not throw NPE — null tags are skipped in matching
        List<TA> result = userService.matchTAsByTags(Arrays.asList("Java", "Python"));
        assertNotNull(result);
        // The registered TA should be found (matches both Java and Python)
        boolean found = result.stream().anyMatch(r -> "ta_null_tag".equals(r.getUsername()));
        assertTrue(found);
    }

    // --- White-box: Branch coverage ---

    @Test
    @DisplayName("login: inactive user (status!=0) returns null")
    void login_inactiveUser_returnsNull() throws Exception {
        // Register a TA, then manually set status=1 (disabled) in the JSON
        TA ta = buildTA("inactive_ta", "pwd");
        userService.registerTA(ta);

        // Read the user.json, modify status, write back
        String json = new String(Files.readAllBytes(tempDir.resolve("user.json")));
        json = json.replace("\"status\": 0", "\"status\": 1");
        Files.write(tempDir.resolve("user.json"), json.getBytes());

        User result = userService.login("inactive_ta", "pwd");
        assertNull(result);
    }

    // --- Helper methods ---

    private TA buildTA(String username, String password) {
        TA ta = new TA();
        ta.setUsername(username);
        ta.setPassword(password);
        ta.setRealName("Test TA");
        ta.setEmail(username + "@test.com");
        ta.setStudentId("S" + System.nanoTime());
        ta.setMajor("Computer Science");
        ta.setEducation("Master");
        return ta;
    }

    private MO buildMO(String username, String password) {
        MO mo = new MO();
        mo.setUsername(username);
        mo.setPassword(password);
        mo.setRealName("Test MO");
        mo.setEmail(username + "@test.com");
        mo.setStaffId("W" + System.nanoTime());
        mo.setDepartment("CS Department");
        return mo;
    }

    private Admin buildAdmin(String username, String password) {
        Admin admin = new Admin();
        admin.setUsername(username);
        admin.setPassword(password);
        admin.setRealName("Test Admin");
        admin.setEmail(username + "@test.com");
        return admin;
    }

    /**
     * Use reflection to set the private 'filePath' field on a DAO singleton.
     */
    private static void setDaoFilePath(Object dao, String path) throws Exception {
        Field field = dao.getClass().getDeclaredField("filePath");
        field.setAccessible(true);
        field.set(dao, path);
    }
}
