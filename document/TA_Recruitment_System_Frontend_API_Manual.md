# TA Recruitment System - Frontend API Manual

## Document Description

This document is specifically written for frontend UI design developers. No backend code review is required - simply call the APIs according to the interface specifications.

## Table of Contents

1. [General Information](#general-information)
2. [User Module](#user-module)
3. [Job Module](#job-module)
4. [Application Module](#application-module)
5. [Admin Module](#admin-module)

---

## General Information

### 1. Base Path

All API base path: `/tapj`

Full URL example: `http://localhost:8080/tapj/user?action=login`

### 2. Request Methods

- **GET**: Query operations
- **POST**: Submit/Modify/Delete operations

### 3. Parameter Passing

- **GET requests**: Parameters appended to URL
- **POST requests**: Parameters using `application/x-www-form-urlencoded` format

### 4. Authentication

- Session is automatically saved after login
- Subsequent requests must include Cookie (`credentials: 'include'`)
- Some APIs require specific role permissions

### 5. Common Response Format

All APIs return a unified JSON format:

```json
{
  "code": 200,
  "msg": "Operation successful",
  "data": {}
}
```

- `code`: 200 = Success, other values = Failure
- `msg`: Message information
- `data`: Returned data

---

## User Module

**API Path**: `/user?action=xxx`

### 1. TA Registration

**Endpoint**: `/user?action=registerTA`

**Method**: POST

**Permission**: No login required

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| username | String | Yes | Username |
| password | String | Yes | Password |
| realName | String | Yes | Full Name |
| email | String | Yes | Email |
| studentId | String | Yes | Student ID |
| major | String | Yes | Major |
| education | String | Yes | Education Level |
| grade | String | Yes | Grade |

**Example**:

```javascript
const params = new URLSearchParams();
params.append('username', 'ta001');
params.append('password', '123456');
params.append('realName', 'Zhang San');
params.append('email', 'zhangsan@example.com');
params.append('studentId', '2024001');
params.append('major', 'Computer Science');
params.append('education', 'Master');
params.append('grade', 'Year 2 Graduate');

const res = await fetch('/tapj/user?action=registerTA', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: params,
  credentials: 'include'
});
```

**Response Example**:

```json
{
  "code": 200,
  "msg": "Registration successful",
  "data": null
}
```

---

### 2. MO Registration

**Endpoint**: `/user?action=registerMO`

**Method**: POST

**Permission**: No login required

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| username | String | Yes | Username |
| password | String | Yes | Password |
| realName | String | Yes | Full Name |
| email | String | Yes | Email |
| staffId | String | Yes | Staff ID |
| department | String | Yes | Department |

**Example**:

```javascript
const params = new URLSearchParams();
params.append('username', 'mo001');
params.append('password', '123456');
params.append('realName', 'Prof. Li');
params.append('email', 'mo@bupt.edu.cn');
params.append('staffId', 'T2024001');
params.append('department', 'School of Computer Science');

const res = await fetch('/tapj/user?action=registerMO', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: params,
  credentials: 'include'
});
```

**Response Example**:

```json
{
  "code": 200,
  "msg": "MO registration successful",
  "data": null
}
```

---

### 3. Login (General)

**Endpoint**: `/user?action=login`

**Method**: POST

**Permission**: No login required

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| username | String | Yes | Username |
| password | String | Yes | Password |

**Example**:

```javascript
const params = new URLSearchParams();
params.append('username', 'ta001');
params.append('password', '123456');

const res = await fetch('/tapj/user?action=login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: params,
  credentials: 'include'
});
```

**Response Example**:

```json
{
  "code": 200,
  "msg": "Login successful",
  "data": {
    "userId": "ta001",
    "username": "ta001",
    "realName": "Zhang San",
    "email": "zhangsan@example.com",
    "userType": 1
  }
}
```

**Role Description**:
- `userType=1`: TA (Teaching Assistant Applicant)
- `userType=2`: MO (Instructor/Publisher)
- `userType=3`: Admin (Administrator)

---

### 4. Get Current Logged-in User

**Endpoint**: `/user?action=getLoginUser`

**Method**: GET

**Permission**: Login required

**Parameters**: None

**Example**:

```javascript
const res = await fetch('/tapj/user?action=getLoginUser', {
  method: 'GET',
  credentials: 'include'
});
```

**Response Example**:

```json
{
  "code": 200,
  "msg": "Operation successful",
  "data": {
    "userId": "ta001",
    "username": "ta001",
    "realName": "Zhang San",
    "email": "zhangsan@example.com",
    "userType": 1
  }
}
```

---

### 5. Logout

**Endpoint**: `/user?action=logout`

**Method**: POST

**Permission**: Login required

**Parameters**: None

**Example**:

```javascript
const res = await fetch('/tapj/user?action=logout', {
  method: 'POST',
  credentials: 'include'
});
```

**Response Example**:

```json
{
  "code": 200,
  "msg": "Logout successful",
  "data": null
}
```

---

## Job Module

**API Path**: `/job?action=xxx`

### 1. Publish Job

**Endpoint**: `/job?action=publish`

**Method**: POST

**Permission**: Login required, MO only

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| jobName | String | Yes | Job Title |
| jobType | Integer | Yes | Job Type (1=TA, 2=Assistant) |
| belongModule | String | Yes | Belonging Module |
| jobDesc | String | Yes | Job Description |
| workHoursWeekly | Double | Yes | Weekly Working Hours |
| recruitNum | Integer | Yes | Number of Positions |
| applyDeadline | String | Yes | Application Deadline |

**Example**:

```javascript
const params = new URLSearchParams();
params.append('jobName', 'Software Engineering TA');
params.append('jobType', '1');
params.append('belongModule', 'Intelligent Science and Technology');
params.append('jobDesc', 'Assist with grading assignments and answering questions');
params.append('workHoursWeekly', '3.0');
params.append('recruitNum', '2');
params.append('applyDeadline', '2026-05-01');

const res = await fetch('/tapj/job?action=publish', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: params,
  credentials: 'include'
});
```

**Response Example**:

```json
{
  "code": 200,
  "msg": "Job published successfully",
  "data": null
}
```

---

### 2. List All Open Jobs

**Endpoint**: `/job?action=listOpen`

**Method**: GET

**Permission**: No login required

**Parameters**: None

**Description**: Only returns jobs with `jobStatus=0` (Open) and `hiredNum < recruitNum` (Not full)

**Example**:

```javascript
const res = await fetch('/tapj/job?action=listOpen', {
  method: 'GET',
  credentials: 'include'
});
```

**Response Example**:

```json
{
  "code": 200,
  "msg": "Operation successful",
  "data": [
    {
      "jobId": "5b92c53162794b4e88dfd24faf160bc9",
      "publisherMoId": "304557df5ad343e7b2f5fc318fb22ac8",
      "jobName": "Software Engineering TA",
      "jobType": 1,
      "belongModule": "Intelligent Science and Technology",
      "jobDesc": "Assist with grading assignments and answering questions",
      "workHoursWeekly": 3.0,
      "recruitNum": 2,
      "hiredNum": 0,
      "publishTime": "2026-04-02 19:50:04",
      "applyDeadline": "2026-05-01",
      "jobStatus": 0
    }
  ]
}
```

**Job Status Description**:
- `jobStatus=0`: Open for application
- `jobStatus=1`: Closed
- `jobStatus=2`: Filled
- `jobStatus=3`: Disabled

---

### 3. List All Jobs

**Endpoint**: `/job?action=listAll`

**Method**: GET

**Permission**: No login required

**Parameters**: None

**Description**: Returns all jobs regardless of status

**Example**:

```javascript
const res = await fetch('/tapj/job?action=listAll', {
  method: 'GET',
  credentials: 'include'
});
```

**Response Example**: Same as `listOpen`

---

### 4. MO List Own Published Jobs

**Endpoint**: `/job?action=listMy`

**Method**: GET

**Permission**: Login required, MO only

**Parameters**: None

**Example**:

```javascript
const res = await fetch('/tapj/job?action=listMy', {
  method: 'GET',
  credentials: 'include'
});
```

**Response Example**: Same as `listOpen`

---

### 5. Get Job Details by ID

**Endpoint**: `/job?action=getDetail&jobId=xxx`

**Method**: GET

**Permission**: No login required

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| jobId | String | Yes | Job ID |

**Example**:

```javascript
const res = await fetch('/tapj/job?action=getDetail&jobId=5b92c53162794b4e88dfd24faf160bc9', {
  method: 'GET',
  credentials: 'include'
});
```

**Response Example**:

```json
{
  "code": 200,
  "msg": "Operation successful",
  "data": {
    "jobId": "5b92c53162794b4e88dfd24faf160bc9",
    "publisherMoId": "304557df5ad343e7b2f5fc318fb22ac8",
    "jobName": "Software Engineering TA",
    "jobType": 1,
    "belongModule": "Intelligent Science and Technology",
    "jobDesc": "Assist with grading assignments and answering questions",
    "workHoursWeekly": 3.0,
    "recruitNum": 2,
    "hiredNum": 0,
    "publishTime": "2026-04-02 19:50:04",
    "applyDeadline": "2026-05-01",
    "jobStatus": 0
  }
}
```

---

## Application Module

**API Path**: `/application?action=xxx`

### 1. TA Apply for Job

**Endpoint**: `/application?action=apply&jobId=xxx`

**Method**: POST

**Permission**: Login required, TA only

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| jobId | String | Yes | Job ID |

**Example**:

```javascript
const res = await fetch('/tapj/application?action=apply&jobId=5b92c53162794b4e88dfd24faf160bc9', {
  method: 'POST',
  credentials: 'include'
});
```

**Response Example**:

```json
{
  "code": 200,
  "msg": "Application submitted successfully",
  "data": null
}
```

---

### 2. MO Audit Application

**Endpoint**: `/application?action=audit`

**Method**: POST

**Permission**: Login required, MO only

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| applicationId | String | Yes | Application ID |
| auditStatus | Integer | Yes | Audit Status (1=Approve, 2=Reject) |
| remark | String | No | Audit Remarks |

**Example**:

```javascript
const params = new URLSearchParams();
params.append('applicationId', 'app001');
params.append('auditStatus', '1');
params.append('remark', 'Approved');

const res = await fetch('/tapj/application?action=audit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: params,
  credentials: 'include'
});
```

**Response Example**:

```json
{
  "code": 200,
  "msg": "Audit completed successfully",
  "data": null
}
```

---

### 3. List All Applications for a Job

**Endpoint**: `/application?action=listByJob&jobId=xxx`

**Method**: GET

**Permission**: Login required, MO only

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| jobId | String | Yes | Job ID |

**Example**:

```javascript
const res = await fetch('/tapj/application?action=listByJob&jobId=5b92c53162794b4e88dfd24faf160bc9', {
  method: 'GET',
  credentials: 'include'
});
```

**Response Example**:

```json
{
  "code": 200,
  "msg": "Operation successful",
  "data": [
    {
      "applicationId": "app001",
      "jobId": "5b92c53162794b4e88dfd24faf160bc9",
      "taId": "ta001",
      "taRealName": "Zhang San",
      "status": 0,
      "remark": ""
    }
  ]
}
```

**Application Status Description**:
- `status=0`: Pending Review
- `status=1`: Approved
- `status=2`: Rejected

---

### 4. TA List Own Applications

**Endpoint**: `/application?action=listMy`

**Method**: GET

**Permission**: Login required, TA only

**Parameters**: None

**Example**:

```javascript
const res = await fetch('/tapj/application?action=listMy', {
  method: 'GET',
  credentials: 'include'
});
```

**Response Example**:

```json
{
  "code": 200,
  "msg": "Operation successful",
  "data": [
    {
      "applicationId": "app001",
      "jobId": "5b92c53162794b4e88dfd24faf160bc9",
      "taId": "ta001",
      "status": 0
    }
  ]
}
```

---

## Admin Module

**API Path**: `/admin?action=xxx`

### 1. List All Users

**Endpoint**: `/admin?action=listUsers`

**Method**: GET

**Permission**: Login required, Admin only

**Parameters**: None

**Example**:

```javascript
const res = await fetch('/tapj/admin?action=listUsers', {
  method: 'GET',
  credentials: 'include'
});
```

**Response Example**:

```json
{
  "code": 200,
  "msg": "Operation successful",
  "data": [
    {
      "userId": "ta001",
      "username": "ta001",
      "realName": "Zhang San",
      "userType": 1,
      "email": "zhangsan@example.com"
    },
    {
      "userId": "mo001",
      "username": "mo001",
      "realName": "Prof. Li",
      "userType": 2,
      "email": "mo@bupt.edu.cn"
    }
  ]
}
```

---

### 2. Delete User by ID

**Endpoint**: `/admin?action=deleteUser&userId=xxx`

**Method**: POST

**Permission**: Login required, Admin only

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | String | Yes | User ID |

**Example**:

```javascript
const res = await fetch('/tapj/admin?action=deleteUser&userId=ta001', {
  method: 'POST',
  credentials: 'include'
});
```

**Response Example**:

```json
{
  "code": 200,
  "msg": "User deleted successfully",
  "data": null
}
```

---

### 3. Get User Details by ID

**Endpoint**: `/admin?action=getUserDetail&userId=xxx`

**Method**: GET

**Permission**: Login required, Admin only

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | String | Yes | User ID |

**Example**:

```javascript
const res = await fetch('/tapj/admin?action=getUserDetail&userId=ta001', {
  method: 'GET',
  credentials: 'include'
});
```

**Response Example**:

```json
{
  "code": 200,
  "msg": "Operation successful",
  "data": {
    "userId": "ta001",
    "username": "ta001",
    "realName": "Zhang San",
    "email": "zhangsan@example.com",
    "userType": 1,
    "studentId": "2024001",
    "major": "Computer Science",
    "education": "Master",
    "grade": "Year 2 Graduate"
  }
}
```

---

### 4. List All Published Jobs

**Endpoint**: `/admin?action=listAllJobs`

**Method**: GET

**Permission**: Login required, Admin only

**Parameters**: None

**Example**:

```javascript
const res = await fetch('/tapj/admin?action=listAllJobs', {
  method: 'GET',
  credentials: 'include'
});
```

**Response Example**: Same as `job?action=listOpen`

---

### 5. Delete Job by ID

**Endpoint**: `/admin?action=deleteJob&jobId=xxx`

**Method**: POST

**Permission**: Login required, Admin only

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| jobId | String | Yes | Job ID |

**Description**: Deleting a job will cascade delete related applications

**Example**:

```javascript
const res = await fetch('/tapj/admin?action=deleteJob&jobId=5b92c53162794b4e88dfd24faf160bc9', {
  method: 'POST',
  credentials: 'include'
});
```

**Response Example**:

```json
{
  "code": 200,
  "msg": "Job deleted successfully (related applications have been cascade deleted)",
  "data": null
}
```

---

## Appendix

### 1. Fetch Request Template

```javascript
async function request(url, options = {}) {
  try {
    const res = await fetch('/tapj' + url, {
      credentials: 'include',
      ...options
    });
    const text = await res.text();
    try {
      return { ok: true, data: JSON.parse(text) };
    } catch (e) {
      return { ok: false, raw: text };
    }
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
```

### 2. Role Permission Matrix

| API | TA | MO | Admin |
|-----|----|----|-------|
| User Registration | Yes | Yes | No |
| Login | Yes | Yes | Yes |
| Publish Job | No | Yes | No |
| View Jobs | Yes | Yes | Yes |
| Apply for Job | Yes | No | No |
| Audit Application | No | Yes | No |
| User Management | No | No | Yes |
| Job Management | No | No | Yes |

---

**Document Version**: v1.0

**Last Updated**: 2026-04-05
