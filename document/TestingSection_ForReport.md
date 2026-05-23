# 3. Testing

## Testing Strategy

We adopted a layered testing strategy: pure unit tests for utility classes and integration tests for service classes, both using JUnit 5 (Jupiter) with Maven Surefire. Utility tests (AuthUtil, DateUtil, Result) run in isolation with no external dependencies. Service tests (ApplicationService, JobService, UserService) exercise the full service-to-DAO-to-JSON-file stack using temporary file I/O — each test class creates a temp directory, redirects DAO singleton paths via reflection, and resets data before every test with `@BeforeEach`. This ensures full isolation from production data without mocking the persistence layer. All tests execute via a single `mvn test` command, integrated into a GitHub Actions CI pipeline that triggers on every push and pull request. JaCoCo generates line and branch coverage reports, while PITest performs mutation testing to evaluate fault-detection strength.

## Testing Techniques

**Black-box — Equivalence Partitioning:** Each method's input space was divided into valid, invalid, and boundary equivalence classes. For `UserService.login()`: valid credentials, wrong password, nonexistent user, null username, null password, empty username, empty password, and inactive user (status ≠ 0) — eight distinct partitions with one test each.

**Black-box — Boundary Value Analysis:** Critical boundaries were tested at exact transition points. The application auto-close mechanism was tested at `hiredNum == recruitNum` (job fills), `hiredNum < recruitNum` (job remains open), and `hiredNum == 0` after rejection. String inputs were tested at null, empty, and 1000-character boundaries.

**White-box — Branch Coverage:** Critical decision points were mapped to dedicated tests. The `matchTAsByTags` null-tag branch (previously causing NPE) was identified, fixed, and verified. Lambda filter predicates in stream operations were tested via their containing methods.

**Mutation Testing:** PITest with DEFAULTS mutators systematically altered source code — negating conditions, changing operators, removing method calls, and replacing return values — to verify tests detect each mutation.

## Test Case Design — Examples

**applyJob() — Equivalence Partitioning**

| Partition | Input | Expected | Status |
|-----------|-------|----------|--------|
| Open job, new applicant | `applyJob("ta1","job1")` | `true` | Pass |
| Job not found | `applyJob("ta1","fake")` | `false` | Pass |
| Job closed (status=1) | `applyJob("ta1","closed")` | `false` | Pass |
| Job filled (status=2) | `applyJob("ta1","filled")` | `false` | Pass |
| Duplicate application | `applyJob("ta1","job1")` again | `false` | Pass |

**auditApplication() — Boundary Coverage**
```java
@Test
void auditApplication_approve_autoClosesJob() {
    // Job recruitNum=1 → approve one application
    // Assert: hiredNum==1 AND jobStatus transitions to 2 (FILLED)
}
```

**matchTAsByTags() — Null Safety Fix**
```java
@Test
void matchTAsByTags_taWithNullTagElement_safelySkipped() {
    TA ta = buildTA("ta", "pwd");
    ta.setTags(Arrays.asList("Java", null, "Python"));
    userService.registerTA(ta);
    // Must not throw NPE — null tags are skipped
    List<TA> result = userService.matchTAsByTags(Arrays.asList("Java", "Python"));
    assertTrue(result.stream().anyMatch(r -> "ta".equals(r.getUsername())));
}
```

## Test Results

**Execution Summary:**
- 103 tests, 0 failures, 0 errors, 0 skipped
- 6 test classes: ApplicationServiceTest (19), JobServiceTest (15), UserServiceTest (28), AuthUtilTest (15), DateUtilTest (11), ResultTest (15)

**PIT Mutation Testing:**
- 263 mutations generated across 11 classes, 137 killed (52% overall)
- Test strength on covered code: 79%
- AuthUtil and Result: 100% mutation coverage
- ApplicationServiceImpl: 76%, JobServiceImpl: 78%, UserServiceImpl: 73%
- Lower overall score is attributable to untested classes (AdminServiceImpl, MessageServiceImpl, ConfigUtil) which have no dedicated test suites
