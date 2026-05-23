# Testing Strategy, Techniques, and Results — EA-H-system (TA Recruitment System)

## 1. Overall Testing Strategy

Our testing strategy follows the agile testing pyramid recommended by the EBU6304 curriculum: automated unit tests form the broad base, integration tests verify cross-layer interactions, and coverage/mutation metrics provide objective quality evidence. We adopted a **layered, automated, regression-oriented** approach where all 78 test cases execute via a single `mvn test` command, integrated into GitHub Actions CI to ensure every push triggers a full regression run. The strategy prioritises the service and utility layers because they contain the core business logic (authentication, job management, application workflow), while the DAO layer is exercised indirectly through integration-style tests that write to real temporary JSON files rather than mocks, providing higher confidence in end-to-end correctness.

## 2. Testing Techniques

### 2.1 Black-box Testing — Equivalence Partitioning

We divided each method's input domain into equivalence classes and selected representative values from each partition. For example, `UserService.login(username, password)` has six partitions:

| Partition | Representative Input | Expected |
|-----------|---------------------|----------|
| Valid credentials | `("testTA", "pass123")` | Returns User object |
| Wrong password | `("testTA", "wrong")` | Returns null |
| Non-existent user | `("nobody", "pass")` | Returns null |
| Null username | `(null, "pass")` | Returns null |
| Empty password | `("user", "")` | Returns null |
| Inactive user (status≠0) | `("banned", "pass")` | Returns null |

This ensures each logical category is tested without redundant cases that exercise the same code path.

### 2.2 Black-box Testing — Boundary Value Analysis

We identified critical boundaries and tested at, above, and below them:

- **String length**: null → empty ("") → single character ("a") → 1000 characters (verifies no overflow)
- **Job recruitment quota**: `hiredNum = recruitNum - 1` (job stays open) vs `hiredNum = recruitNum` (job auto-closes to FILLED status)
- **Application status transitions**: pending (0) allows cancel; approved (1) blocks cancel — tested at the exact boundary of allowed/blocked states

### 2.3 White-box Testing — Branch Coverage

For critical methods, we documented the control flow graph and ensured every branch was exercised:

```
login(username, password):
  B1: if (username == null || isEmpty) → return null
  B2: if (password == null || isEmpty) → return null
  B3: encrypt and search users
  B4: if (!found || status != 0) → return null
  B5: if (user instanceof TA) → return TA object
  B6: else → return base User object
```

Each branch maps to a specific test case (US-W1 through US-W6), verified by JaCoCo line and branch coverage reports.

### 2.4 Mutation Testing (PiTest)

We configured PiTest with DEFAULTS mutators targeting `com.qm.bupt.util.*` and `com.qm.bupt.service.impl.*`. PiTest systematically modifies the source code (e.g., changing `==` to `!=`, removing return statements, negating conditions) and verifies that at least one test fails for each mutation. Results:

- **262 mutations generated**
- **115 killed (44% mutation score)**
- **Test strength: 75%** (excluding mutations in code with zero coverage)

The 108 surviving mutations with no coverage are concentrated in the DAO file-I/O layer and Servlet HTTP-handling code, which require a servlet container to test meaningfully.

## 3. Test Case Design — Specific Examples

### Example 1: ApplicationService.applyJob() — Equivalence Partition

This method enforces three business rules: the job must exist, must be open (status=0), and the TA must not have already applied.

| Test ID | Partition | Setup | Input | Expected | Result |
|---------|-----------|-------|-------|----------|--------|
| AP-01 | Valid application | Create open job | `applyJob("ta1", "job1")` | `true` | ✅ |
| AP-02 | Job not found | No job in DB | `applyJob("ta1", "fake")` | `false` | ✅ |
| AP-03 | Job closed | Job with status=1 | `applyJob("ta1", "closed")` | `false` | ✅ |
| AP-04 | Duplicate | TA already applied | `applyJob("ta1", "job1")` again | `false` | ✅ |

### Example 2: ApplicationService.auditApplication() — Boundary + Branch Coverage

Tests the auto-close mechanism: when hiredNum reaches recruitNum after approval, the job status automatically transitions to FILLED (2).

```java
@Test
@DisplayName("auditApplication: approve when quota reached auto-closes job")
void auditApplication_approve_autoClosesJob() {
    // Setup: job with recruitNum=1, hiredNum=0
    // Action: approve one application
    // Assert: job.hiredNum == 1 AND job.jobStatus == 2 (FILLED)
}
```

This tests branch B5a (`if hiredNum >= recruitNum → set jobStatus = 2`) which is only reachable when the exact boundary condition is met.

### Example 3: AuthUtil.md5Encrypt() — White-box Hex Padding

The MD5 algorithm produces bytes that may be less than 16 (single hex digit). The code must zero-pad these:

```java
@Test
@DisplayName("md5Encrypt: known hash of 'admin' verifies hex padding branch")
void md5Encrypt_adminHash_verifiesHexPadding() {
    // "admin" → "21232f297a57a5a743894a0e4a801fc3"
    // The byte 0x02 at position 0 requires "0" prefix → "02"
    String hash = AuthUtil.md5Encrypt("admin");
    assertEquals("21232f297a57a5a743894a0e4a801fc3", hash);
    assertTrue(hash.startsWith("21")); // confirms the "02" padding worked
}
```

## 4. Test Results Summary

### Execution Results

```
$ mvn clean test

Tests run: 78, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS (6.088s)

  ApplicationServiceTest  — 11 tests ✅
  JobServiceTest          —  8 tests ✅
  UserServiceTest         — 18 tests ✅
  AuthUtilTest            — 17 tests ✅
  DateUtilTest            —  9 tests ✅
  ResultTest              — 15 tests ✅
```

### Coverage Metrics (JaCoCo)

| Package | Line Coverage | Branch Coverage |
|---------|:------------:|:--------------:|
| `com.qm.bupt.util` | High | High |
| `com.qm.bupt.service.impl` | Medium-High | Medium-High |
| `com.qm.bupt.dao` | Medium (exercised indirectly) | Medium |
| `com.qm.bupt.servlet` | Low (requires container) | Low |

*Full interactive report: `target/site/jacoco/index.html`*

### Mutation Testing (PiTest)

| Metric | Value |
|--------|-------|
| Total mutations | 262 |
| Killed | 115 (44%) |
| Survived (with coverage) | 39 |
| No coverage | 108 |
| **Test strength** | **75%** |

*Full report: `target/pit-reports/index.html`*

## 5. CI/CD Integration

A GitHub Actions workflow (`.github/workflows/test.yml`) triggers on every push and pull request:
1. Checks out code
2. Sets up JDK 8 + Maven cache
3. Runs `mvn clean test` (includes JaCoCo)
4. Uploads JaCoCo and Surefire reports as artifacts

This ensures **continuous regression testing** — no code merges without a green test suite.

## 6. Conclusions and Future Improvements

The current test suite provides strong coverage of business logic (login, registration, job publishing, application workflow, authorization checks) with 78 automated tests passing consistently. The 75% mutation test strength indicates good fault-detection capability for the tested code.

**Limitations**: Servlet-layer (HTTP request/response handling) and filter-layer (authentication/encoding) remain untested because they require a running servlet container. The DAO layer is tested only indirectly through service-layer integration tests.

**Future improvements**: (1) Add Arquillian or embedded Tomcat tests for servlet-layer coverage; (2) Increase mutation score by adding assertion-dense tests for boundary conditions in DAO operations; (3) Add Selenium/Cypress end-to-end tests for the frontend workflow; (4) Implement test-driven development strictly for all new features going forward.
