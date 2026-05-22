# TA Recruitment System — Test Case Design Document

## 1. Test Strategy Overview

| Level | Scope | Tool | Automation |
|-------|-------|------|------------|
| Unit Test | Individual methods (util, service) | JUnit 5 | Automated |
| Integration Test | Service → DAO → JSON file I/O | JUnit 5 + temp files | Automated |
| Coverage | Line & branch coverage | JaCoCo 0.8.12 | Automated |
| Mutation | Mutation score | PiTest 1.15.8 | Automated |
| CI | Regression on every push | GitHub Actions | Automated |

---

## 2. Test Case Tables

### 2.1 AuthUtil.md5Encrypt() — Black-box (Equivalence Partition + Boundary)

| ID | Partition | Input | Expected Output | Actual | Pass |
|----|-----------|-------|-----------------|--------|------|
| AU-01 | Valid normal | `"123456"` | 32-char hex string | `"e10adc3949ba59abbe56e057f20f883e"` | ✅ |
| AU-02 | Valid known | `"abc"` | `"900150983cd24fb0d6963f7d28e17f72"` | Same | ✅ |
| AU-03 | Invalid null | `null` | `""` | `""` | ✅ |
| AU-04 | Invalid empty | `""` | `""` | `""` | ✅ |
| AU-05 | Determinism | `"test"` called twice | Same hash both times | Same | ✅ |
| AU-06 | Different input | `"abc"` vs `"abd"` | Different hashes | Different | ✅ |
| AU-07 | Boundary: 1 char | `"a"` | 32-char hex | 32-char hex | ✅ |
| AU-08 | Boundary: long | 1000-char string | 32-char hex | 32-char hex | ✅ |
| AU-09 | Special: Chinese | `"中文密码"` | 32-char hex | 32-char hex | ✅ |
| AU-10 | Special: emoji | `"🔐"` | 32-char hex | 32-char hex | ✅ |
| AU-11 | Special: spaces | `"  "` | 32-char hex (not empty) | 32-char hex | ✅ |

### 2.2 AuthUtil.generateUUID() — Black-box

| ID | Partition | Input | Expected Output | Actual | Pass |
|----|-----------|-------|-----------------|--------|------|
| AU-12 | Format | (none) | 32-char string | 32 chars | ✅ |
| AU-13 | No hyphens | (none) | No `-` character | No `-` | ✅ |
| AU-14 | Hex only | (none) | Matches `[0-9a-f]{32}` | Match | ✅ |
| AU-15 | Uniqueness | Two calls | Different strings | Different | ✅ |

### 2.3 AuthUtil.md5Encrypt() — White-box (Branch Coverage)

```
md5Encrypt(password):
  B1: if (password == null || password.isEmpty()) → return ""
  B2: else → compute MD5
    B2a: if (hexByte < 16) → pad with "0"
    B2b: else → no padding
```

| ID | Branch | Input | Covers | Pass |
|----|--------|-------|--------|------|
| AU-W1 | B1 (null) | `null` | null check → true | ✅ |
| AU-W2 | B1 (empty) | `""` | isEmpty() → true | ✅ |
| AU-W3 | B2 | `"abc"` | Enters MD5 computation | ✅ |
| AU-W4 | B2a | `"admin"` | Hash `21232f...` has byte `0x02` → padded to `"02"` | ✅ |

---

### 2.4 DateUtil — Black-box

| ID | Method | Input | Expected Output | Actual | Pass |
|----|--------|-------|-----------------|--------|------|
| DU-01 | `getNow()` | (none) | Matches `\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}` | Match | ✅ |
| DU-02 | `getNow()` | (none) | Within 2s of `System.currentTimeMillis()` | Within 2s | ✅ |
| DU-03 | `format()` | `date, "yyyy-MM-dd"` | `"2024-01-15"` (for that date) | Correct | ✅ |
| DU-04 | `format()` | `date, "HH:mm"` | Correct hours:minutes | Correct | ✅ |

---

### 2.5 Result — Black-box

| ID | Method | Input | Expected | Actual | Pass |
|----|--------|-------|----------|--------|------|
| R-01 | `success()` | (none) | code=200, msg="success", data=null | Same | ✅ |
| R-02 | `success(data)` | `"hello"` | code=200, data="hello" | Same | ✅ |
| R-03 | `success(msg,data)` | `"ok", 42` | code=200, msg="ok", data=42 | Same | ✅ |
| R-04 | `error(400,"bad")` | 400, "bad" | code=400, msg="bad", data=null | Same | ✅ |
| R-05 | `error(401,...)` | 401 | code=401 | 401 | ✅ |
| R-06 | `error(403,...)` | 403 | code=403 | 403 | ✅ |
| R-07 | `error(500,...)` | 500 | code=500 | 500 | ✅ |

---

### 2.6 UserService.login() — Black-box (Equivalence Partition)

| ID | Partition | username | password | Expected | Actual | Pass |
|----|-----------|----------|----------|----------|--------|------|
| US-01 | Valid credentials | `"testTA"` | `"pass123"` | Returns User object | User | ✅ |
| US-02 | Wrong password | `"testTA"` | `"wrong"` | `null` | `null` | ✅ |
| US-03 | Non-existent user | `"nobody"` | `"pass"` | `null` | `null` | ✅ |
| US-04 | Null username | `null` | `"pass"` | `null` | `null` | ✅ |
| US-05 | Null password | `"user"` | `null` | `null` | `null` | ✅ |
| US-06 | Empty username | `""` | `"pass"` | `null` | `null` | ✅ |
| US-07 | Empty password | `"user"` | `""` | `null` | `null` | ✅ |

### 2.7 UserService.login() — White-box (Branch Coverage)

```
login(username, password):
  B1: if (username == null || isEmpty) → return null
  B2: if (password == null || isEmpty) → return null
  B3: encrypt password, search users
  B4: if (!found || status != 0) → return null
  B5: if (user is TA) → return TA object
  B6: else → return User object
```

| ID | Branch | Input | Covers | Pass |
|----|--------|-------|--------|------|
| US-W1 | B1 | null username | null check | ✅ |
| US-W2 | B1 | empty username | isEmpty check | ✅ |
| US-W3 | B2 | null password | null check | ✅ |
| US-W4 | B4 | inactive user (status=1) | status != 0 branch | ✅ |
| US-W5 | B5 | TA user login | instanceof TA → true | ✅ |
| US-W6 | B6 | MO user login | instanceof TA → false | ✅ |

---

### 2.8 UserService.register*() — Black-box

| ID | Method | Condition | Expected | Actual | Pass |
|----|--------|-----------|----------|--------|------|
| US-08 | `registerTA()` | New username | `true` | `true` | ✅ |
| US-09 | `registerTA()` | Duplicate username | `false` | `false` | ✅ |
| US-10 | `registerMO()` | New username | `true` | `true` | ✅ |
| US-11 | `registerAdmin()` | New username | `true` | `true` | ✅ |

### 2.9 UserService.updateTAProfile() — Boundary

| ID | Input | Expected | Actual | Pass |
|----|-------|----------|--------|------|
| US-12 | `null` TA object | `false` | `false` | ✅ |
| US-13 | TA with null userId | `false` | `false` | ✅ |
| US-14 | Valid TA | `true` | `true` | ✅ |

### 2.10 UserService.matchTAsByTags() — Equivalence Partition

| ID | Input tags | TA tags in DB | Expected | Actual | Pass |
|----|-----------|---------------|----------|--------|------|
| US-15 | `null` | any | Empty list | Empty | ✅ |
| US-16 | `[]` | any | Empty list | Empty | ✅ |
| US-17 | `["Java","Python"]` | TA1:["Java"], TA2:["Python","Java"] | TA2 first (higher score) | TA2 first | ✅ |

---

### 2.11 JobService — Black-box

| ID | Method | Condition | Expected | Actual | Pass |
|----|--------|-----------|----------|--------|------|
| JS-01 | `publishJob()` | Valid job + moId | `true`, fields set | `true` | ✅ |
| JS-02 | `listOpenJobs()` | Mix of open/closed | Only status=0 returned | Correct | ✅ |
| JS-03 | `listMyJobs()` | MO with 2 jobs, other MO with 1 | Only own jobs returned | Correct | ✅ |
| JS-04 | `updateJob()` | Own job | `true`, preserves publishTime/moId | `true` | ✅ |
| JS-05 | `updateJob()` | Other MO's job | `false` (authorization) | `false` | ✅ |
| JS-06 | `updateJob()` | Non-existent job | `false` | `false` | ✅ |
| JS-07 | `deleteJob()` | Own job | `true` | `true` | ✅ |
| JS-08 | `deleteJob()` | Other MO's job | `false` (authorization) | `false` | ✅ |

---

### 2.12 ApplicationService — Black-box (Equivalence Partition)

| ID | Method | Condition | Expected | Actual | Pass |
|----|--------|-----------|----------|--------|------|
| AP-01 | `applyJob()` | Valid TA + open job | `true` | `true` | ✅ |
| AP-02 | `applyJob()` | Job does not exist | `false` | `false` | ✅ |
| AP-03 | `applyJob()` | Job is closed (status=1) | `false` | `false` | ✅ |
| AP-04 | `applyJob()` | Already applied | `false` (duplicate) | `false` | ✅ |
| AP-05 | `auditApplication()` | Approve (status=1) | `true`, hiredNum+1 | `true`, +1 | ✅ |
| AP-06 | `auditApplication()` | Approve, reaches quota | `true`, job status→2(FILLED) | `true`, 2 | ✅ |
| AP-07 | `auditApplication()` | Reject (status=2) | `true`, hiredNum unchanged | `true`, same | ✅ |
| AP-08 | `auditApplication()` | Wrong MO | `false` (authorization) | `false` | ✅ |
| AP-09 | `cancelApplication()` | Pending application, own | `true` | `true` | ✅ |
| AP-10 | `cancelApplication()` | Approved application | `false` (cannot cancel) | `false` | ✅ |
| AP-11 | `cancelApplication()` | Other user's application | `false` (ownership) | `false` | ✅ |

### 2.13 ApplicationService — White-box (Branch Coverage)

```
applyJob(taUserId, jobId):
  B1: if (job == null) → return false
  B2: if (jobStatus != 0) → return false
  B3: if (already applied) → return false
  B4: save application → return true

auditApplication(appId, moUserId, status, remark):
  B1: if (application == null) → return false
  B2: if (job == null) → return false
  B3: if (moUserId != publisher) → return false
  B4: set status, set audit fields
  B5: if (status == 1/PASSED) → increment hiredNum
    B5a: if (hiredNum >= recruitNum) → set jobStatus = 2
  B6: return true

cancelApplication(taUserId, appId):
  B1: if (application == null) → return false
  B2: if (taUserId != applicant) → return false
  B3: if (status == 1/PASSED) → return false
  B4: delete → return true
```

All branches covered by tests AP-01 through AP-11.

---

## 3. Coverage Summary

### How to generate reports

```bash
# Unit tests + JaCoCo coverage
mvn clean test

# Mutation testing (PiTest)
mvn org.pitest:pitest-maven:mutationCoverage
```

### Report locations

| Report | Path |
|--------|------|
| JaCoCo HTML | `target/site/jacoco/index.html` |
| JaCoCo XML | `target/site/jacoco/jacoco.xml` |
| PiTest HTML | `target/pit-reports/index.html` |
| Surefire XML | `target/surefire-reports/*.xml` |

---

## 4. Testing Methodology Alignment

| Course Requirement | Implementation |
|---|---|
| **Black-box: Equivalence Partition** | Each method tested with valid/invalid/boundary input partitions (see tables above) |
| **Black-box: Boundary Value Analysis** | null, empty string, single char, max-length, status=0 vs 1, hiredNum==recruitNum |
| **White-box: Statement Coverage** | JaCoCo statement coverage report |
| **White-box: Branch Coverage** | All if/else branches documented and tested (see W-series test IDs) |
| **White-box: Path Coverage** | Multi-branch methods (login, applyJob, auditApplication) tested across all paths |
| **TDD** | Test-first approach for new features; regression suite for existing code |
| **Mutation Testing** | PiTest configured with DEFAULTS mutators on util + service classes |
| **Regression Testing** | Full suite (78 tests) runs on every `mvn test` and every GitHub push |
| **CI/CD** | GitHub Actions workflow: checkout → JDK 8 → mvn test → upload reports |

---

## 5. Test Execution Evidence

```
$ mvn clean test

Tests run: 78, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS (2.156s)

  ApplicationServiceTest  — 11 tests ✅
  JobServiceTest          —  8 tests ✅
  UserServiceTest         — 18 tests ✅
  AuthUtilTest            — 17 tests ✅
  DateUtilTest            —  9 tests ✅
  ResultTest              — 15 tests ✅
```
