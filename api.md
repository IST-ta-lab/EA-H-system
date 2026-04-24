# TA Recruitment System - Backend API Documentation

## Base Information

- **Context Path**: `/tapj`
- **Request Dispatch**: Action-based routing via `action` parameter
- **Response Format**: Unified JSON
- **HTTP Methods**: GET and POST

## Unified Response Format

```json
{
  "code": 200,
  "msg": "success",
  "data": {}
}
```

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## 1. User Servlet `/user`

### Login & Logout

| Method | Action | Parameters |
|--------|--------|------------|
| POST | `login` | `username`, `password` |
| POST | `logout` | (none) |
| GET | `getLoginUser` | (none) |

**Response Example (login)**:
```json
{
  "code": 200,
  "msg": "Login successful",
  "data": {
    "userId": "ta001",
    "username": "ta001",
    "realName": "Zhang San",
    "userType": 1
  }
}
```

**User Types**: `1`=TA, `2`=MO, `3`=Admin

### Registration

| Method | Action | Parameters |
|--------|--------|------------|
| POST | `registerTA` | `username`, `password`, `realName`, `email`, `studentId`, `major`, `education`, `grade` |
| POST | `registerMO` | `username`, `password`, `realName`, `email`, `staffId`, `department` |
| POST | `registerAdmin` | `username`, `password`, `realName`, `email` |

### Profile Management

| Method | Action | Parameters |
|--------|--------|------------|
| POST | `updateProfile` | `realName`, `email`, `major`, `selfIntro`, `skills`, `profileVisible`, `tags` |
| POST | `uploadProfilePdf` | `file` (multipart PDF) |
| GET | `downloadProfilePdf` | `uid` |
| GET | `listTags` | (none) |

- `skills` and `tags` are comma-separated strings

---

## 2. Job Servlet `/job`

| Method | Action | Parameters |
|--------|--------|------------|
| POST | `publish` | `jobName`, `jobType`, `belongModule`, `jobDesc`, `workHoursWeekly`, `recruitNum`, `applyDeadline`, `tags` |
| POST | `update` | `jobId`, `jobName`, `jobType`, `belongModule`, `jobDesc`, `workHoursWeekly`, `recruitNum`, `applyDeadline`, `tags` |
| GET | `listAll` | (none) |
| GET | `listOpen` | (none) |
| GET | `listMy` | (none) |
| GET | `getDetail` | `jobId` |
| GET | `matchTAs` | `jobId` |

**Job Types**: `1`=TA, `2`=Assistant

**Job Status**: `0`=Open, `1`=Closed, `2`=Filled, `3`=Disabled

**Response Example (listOpen)**:
```json
{
  "code": 200,
  "msg": "success",
  "data": [{
    "jobId": "5b92c53162794b4e88dfd24faf160bc9",
    "publisherMoId": "304557df5ad343e7b2f5fc318fb22ac8",
    "jobName": "Software Engineering TA",
    "jobType": 1,
    "belongModule": "Intelligent Science",
    "jobDesc": "Assist with grading",
    "workHoursWeekly": 3.0,
    "recruitNum": 2,
    "hiredNum": 0,
    "publishTime": "2026-04-02 19:50:04",
    "applyDeadline": "2026-05-01",
    "jobStatus": 0
  }]
}
```

---

## 3. Application Servlet `/application`

| Method | Action | Parameters |
|--------|--------|------------|
| POST | `apply` | `jobId` |
| POST | `audit` | `applicationId`, `auditStatus`, `remark` |
| POST | `cancel` | `applicationId` |
| GET | `listByJob` | `jobId` |
| GET | `listMy` | (none) |

**Audit Status**: `1`=Approve, `2`=Reject

**Application Status**: `0`=Pending, `1`=Approved, `2`=Rejected

**Response Example (listByJob)**:
```json
{
  "code": 200,
  "msg": "success",
  "data": [{
    "applicationId": "app001",
    "jobId": "5b92c53162794b4e88dfd24faf160bc9",
    "taId": "ta001",
    "taRealName": "Zhang San",
    "status": 0,
    "remark": ""
  }]
}
```

---

## 4. Message Servlet `/message`

| Method | Action | Parameters |
|--------|--------|------------|
| POST | `send` | `receiverId`, `content`, `jobId`, `jobTitle` |
| POST | `markRead` | `messageIds` |
| GET | `getHistory` | `otherUserId`, `page`, `size` |
| GET | `listConversations` | (none) |
| GET | `getUnreadCount` | (none) |

**Query Parameters**: `page` (default 1), `size` (default 20)

**Response Example (listConversations)**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "userId1": "User Name 1",
    "userId2": "User Name 2"
  }
}
```

---

## 5. Recommend Servlet `/recommend`

| Method | Action | Parameters |
|--------|--------|------------|
| GET | `recommendJobsForTA` | `taId`, `topK` |
| GET | `recommendTAsForJob` | `jobId`, `topK` |

**Query Parameters**: `topK` (default 10, max 50)

**Response Example**:
```json
{
  "code": 200,
  "msg": "success",
  "data": [{
    "jobId": "...",
    "jobName": "...",
    "score": 0.95
  }]
}
```

---

## 6. Embedding Servlet `/embedding`

| Method | Action | Parameters |
|--------|--------|------------|
| POST | `updateTAEmbedding` | `taId` |
| POST | `updateJobEmbedding` | `jobId` |
| GET | `getTAEmbedding` | `taId` |
| GET | `getJobEmbedding` | `jobId` |

---

## 7. Admin Servlet `/admin`

| Method | Action | Parameters |
|--------|--------|------------|
| GET | `listUsers` | (none) |
| GET | `getUserDetail` | `userId` |
| POST | `deleteUser` | `userId` |
| GET | `listAllJobs` | (none) |
| POST | `deleteJob` | `jobId` |

**Response Example (listUsers)**:
```json
{
  "code": 200,
  "msg": "success",
  "data": [{
    "userId": "ta001",
    "username": "ta001",
    "realName": "Zhang San",
    "userType": 1,
    "email": "zhangsan@example.com"
  }]
}
```

---

## 8. Hello Servlet `/hello`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/hello` | Test endpoint (returns HTML) |

---

## Role Permission Matrix

| Feature | TA | MO | Admin |
|---------|----|----|-------|
| Register | Yes | Yes | No |
| Login | Yes | Yes | Yes |
| Publish Job | No | Yes | No |
| View Jobs | Yes | Yes | Yes |
| Apply for Job | Yes | No | No |
| Audit Application | No | Yes | No |
| User Management | No | No | Yes |
| Job Management | No | No | Yes |

---

## Usage Examples

### Login
```
POST /tapj/user?action=login
Content-Type: application/x-www-form-urlencoded

username=ta001&password=123456
```

### Apply for Job
```
POST /tapj/application?action=apply&jobId=5b92c53162794b4e88dfd24faf160bc9
```

### MO Audit Application
```
POST /tapj/application?action=audit&applicationId=app001&auditStatus=1&remark=Good
```

### Send Message
```
POST /tapj/message?action=send&receiverId=mo001&content=Hello&jobId=job123&jobTitle=TA Position
```
