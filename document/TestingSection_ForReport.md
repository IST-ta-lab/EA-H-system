# Testing

## Testing Strategy

We adopted a layered, automated, regression-oriented testing strategy aligned with agile practices. Unit tests form the foundation, covering utility classes (AuthUtil, DateUtil, Result) and service-layer business logic (UserService, JobService, ApplicationService). Integration tests exercise the full service-to-DAO-to-JSON-file stack using real temporary file I/O rather than mocks, ensuring end-to-end data persistence correctness. All 78 tests execute via a single `mvn test` command, integrated into a GitHub Actions CI pipeline that triggers on every push and pull request. This ensures continuous regression — no code merges without a green test suite. JaCoCo generates line and branch coverage reports automatically, while PiTest performs mutation testing to evaluate test suite fault-detection strength.

## Testing Techniques

**Black-box — Equivalence Partitioning:** We divided each method's input space into valid, invalid, and boundary equivalence classes. For example, `UserService.login()` was partitioned into: valid credentials, wrong password, non-existent user, null username, null password, empty username, and empty password — each representing a distinct equivalence class requiring only one test per partition.

**Black-box — Boundary Value Analysis:** Critical boundaries were identified and tested at their exact transition points. For instance, the application approval auto-close mechanism was tested at `hiredNum = recruitNum - 1` (job remains open) versus `hiredNum = recruitNum` (job transitions to FILLED status). String inputs were tested at null, empty, single-character, and 1000-character boundaries.

**White-box — Branch Coverage:** For critical methods, we documented control flow graphs and ensured every decision branch was exercised. The `login()` method has 6 branches (null checks, empty checks, inactive-user check, TA-type check), each mapped to a dedicated test case verified by JaCoCo branch coverage reporting.

**Mutation Testing:** PiTest with DEFAULTS mutators systematically altered source code (negating conditions, changing operators, removing returns) and verified that tests detected each mutation. This provides a stronger quality signal than coverage alone.

## Test Case Design — Examples

**Example 1: ApplicationService.applyJob() — Equivalence Partition**

| Test ID | Partition | Input | Expected | Result |
|---------|-----------|-------|----------|--------|
| AP-01 | Valid: open job, new applicant | `applyJob("ta1","job1")` | `true` | ✅ |
| AP-02 | Invalid: job not found | `applyJob("ta1","fake")` | `false` | ✅ |
| AP-03 | Invalid: job closed (status=1) | `applyJob("ta1","closed")` | `false` | ✅ |
| AP-04 | Invalid: duplicate application | `applyJob("ta1","job1")` again | `false` | ✅ |

This demonstrates testing three business rules (existence, status, uniqueness) via four distinct equivalence partitions.

**Example 2: auditApplication() — Boundary + Branch Coverage**

```java
@Test
void auditApplication_approve_autoClosesJob() {
    // Setup: job with recruitNum=1, hiredNum=0
    // Action: approve one application
    // Assert: hiredNum==1 AND jobStatus==2 (FILLED)
}
```

This targets the boundary where `hiredNum` equals `recruitNum`, exercising the branch `if (hiredNum >= recruitNum) → jobStatus = FILLED`.

**Example 3: AuthUtil.md5Encrypt() — White-box Hex Padding**

```java
@Test
void md5Encrypt_adminHash_verifiesHexPadding() {
    // "admin" → "21232f..." (byte 0x02 requires zero-padding to "02")
    assertEquals("21232f297a57a5a743894a0e4a801fc3", AuthUtil.md5Encrypt("admin"));
}
```

This specifically targets the `if (hexByte < 16) → prepend "0"` branch that would be missed by testing only passwords producing no single-digit hex bytes.

## Test Results

**Execution Summary:**
- 78 tests, 0 failures, 0 errors, 0 skipped
- Execution time: 6.1 seconds
- 6 test classes covering util layer (3) and service layer (3)

**JaCoCo Coverage:** The tested classes (util + service.impl) achieve high line and branch coverage. Untested layers (servlet, filter, DAO internals) require a servlet container and are excluded from unit testing scope — they are validated manually during sprint reviews.

**PiTest Mutation Testing:**
- 262 mutations generated | 115 killed (44%) | Test strength: 75%
- The 108 mutations with no coverage reside in servlet/DAO file-I/O code that is architecturally outside unit-test reach

**CI Integration:** GitHub Actions (`.github/workflows/test.yml`) runs the full suite on every push, uploading JaCoCo and Surefire reports as downloadable artifacts. This provides traceable regression evidence in the repository history.
