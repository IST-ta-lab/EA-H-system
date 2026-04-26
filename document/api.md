# EA-H-system API 文档

## 1. 概述

### 1.1 文档说明
本文档详细描述了 EA-H-system 系统的所有 REST API 接口。

### 1.2 基础信息

| 项目 | 值 |
|------|-----|
| **Base URL** | `http://{host}:{port}/tapj` |
| **上下文路径** | `/tapj` |
| **内容类型** | `application/x-www-form-urlencoded` |
| **响应格式** | JSON |

### 1.3 认证说明
部分接口需要登录后才能访问。登录后用户信息会存储在Session中，后续请求会自动携带Session Cookie。

---

## 2. 统一响应格式

### 2.1 响应结构

```json
{
  "code": 200,
  "msg": "success",
  "data": { ... }
}
```

### 2.2 状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 参数错误 |
| 401 | 未授权（未登录） |
| 403 | 禁止访问（权限不足） |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

### 2.3 错误响应示例

```json
{
  "code": 400,
  "msg": "用户名或密码错误",
  "data": null
}
```

---

## 3. 枚举值说明

### 3.1 用户类型 (userType)

| 值 | 描述 | 说明 |
|----|------|------|
| 1 | TA | 助教申请者 |
| 2 | MO | 模块组织者 |
| 3 | Admin | 系统管理员 |

### 3.2 岗位类型 (jobType)

| 值 | 描述 | 说明 |
|----|------|------|
| 1 | 课程助教 | Course TA |
| 2 | 监考助教 | Exam TA |
| 3 | 活动助教 | Activity TA |

### 3.3 岗位状态 (jobStatus)

| 值 | 描述 | 说明 |
|----|------|------|
| 0 | 招聘中 | Open |
| 1 | 已截止 | Closed |
| 2 | 已招满 | Filled |

### 3.4 申请状态 (applyStatus)

| 值 | 描述 | 说明 |
|----|------|------|
| 0 | 待审核 | Pending |
| 1 | 已通过 | Passed |
| 2 | 已拒绝 | Rejected |

---

## 4. Servlet 索引

| Servlet | 路径 | 方法数 | 说明 |
|---------|------|--------|------|
| HelloServlet | /hello | 1 | 健康检查 |
| UserServlet | /user | 9 | 用户管理 |
| JobServlet | /job | 7 | 岗位管理 |
| ApplicationServlet | /application | 5 | 申请管理 |
| MessageServlet | /message | 5 | 消息管理 |
| AdminServlet | /admin | 5 | 系统管理 |
| RecommendServlet | /recommend | 2 | 推荐服务 |
| EmbeddingServlet | /embedding | 4 | 嵌入向量 |

---

## 5. HelloServlet

### 5.1 健康检查

#### `GET /hello`

健康检查接口，用于验证服务是否正常运行。

**认证要求**: 否

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": "<html>...success message...</html>"
}
```

---

## 6. UserServlet (`/user`)

用户管理相关接口，包括登录、注册、资料管理等。

### 6.1 登录

#### `POST /user?action=login`

用户登录接口。

**认证要求**: 否

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | String | 是 | 用户名 |
| password | String | 是 | 密码 |

**响应示例**:
```json
{
  "code": 200,
  "msg": "登录成功",
  "data": {
    "userId": "xxx",
    "username": "student001",
    "realName": "张三",
    "userType": 1,
    ...
  }
}
```

**错误码**:
- 400: 用户名或密码错误

---

### 6.2 注册TA

#### `POST /user?action=registerTA`

注册新的助教（TA）账号。

**认证要求**: 否

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | String | 是 | 用户名（唯一） |
| password | String | 是 | 密码 |
| realName | String | 否 | 真实姓名 |
| email | String | 否 | 邮箱 |
| studentId | String | 否 | 学号 |
| major | String | 否 | 专业 |
| education | String | 否 | 学历 |
| grade | String | 否 | 年级 |

**响应示例**:
```json
{
  "code": 200,
  "msg": "注册成功",
  "data": null
}
```

---

### 6.3 注册MO

#### `POST /user?action=registerMO`

注册新的模块组织者（MO）账号。

**认证要求**: 否

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | String | 是 | 用户名（唯一） |
| password | String | 是 | 密码 |
| realName | String | 否 | 真实姓名 |
| email | String | 否 | 邮箱 |
| staffId | String | 否 | 工号 |
| department | String | 否 | 部门 |

**响应示例**:
```json
{
  "code": 200,
  "msg": "注册成功",
  "data": null
}
```

---

### 6.4 注册Admin

#### `POST /user?action=registerAdmin`

注册新的管理员（Admin）账号。

**认证要求**: 否

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | String | 是 | 用户名（唯一） |
| password | String | 是 | 密码 |
| realName | String | 否 | 真实姓名 |
| email | String | 否 | 邮箱 |

**响应示例**:
```json
{
  "code": 200,
  "msg": "注册成功",
  "data": null
}
```

---

### 6.5 获取当前登录用户

#### `GET /user?action=getLoginUser`

获取当前登录用户的信息。

**认证要求**: 是

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "userId": "xxx",
    "username": "student001",
    "realName": "张三",
    "userType": 1,
    ...
  }
}
```

---

### 6.6 更新TA资料

#### `POST /user?action=updateProfile`

更新助教（TA）的个人资料。

**认证要求**: 是（TA用户）

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| realName | String | 否 | 真实姓名 |
| email | String | 否 | 邮箱 |
| major | String | 否 | 专业 |
| selfIntro | String | 否 | 个人简介 |
| skills | String | 否 | 技能ID列表（逗号分隔） |
| profileVisible | Boolean | 否 | 资料是否可见 |
| tags | String | 否 | 标签列表（逗号分隔） |

**响应示例**:
```json
{
  "code": 200,
  "msg": "更新成功",
  "data": { /* 更新后的TA对象 */ }
}
```

---

### 6.7 登出

#### `POST /user?action=logout`

用户登出。

**认证要求**: 是

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "msg": "登出成功",
  "data": null
}
```

---

### 6.8 上传简历PDF

#### `POST /user?action=uploadProfilePdf`

上传TA的简历PDF文件。

**认证要求**: 是（TA用户）

**请求格式**: `multipart/form-data`

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | File | 是 | PDF文件 |

**响应示例**:
```json
{
  "code": 200,
  "msg": "上传成功",
  "data": null
}
```

---

### 6.9 下载简历PDF

#### `GET /user?action=downloadProfilePdf`

下载TA的简历PDF文件。

**认证要求**: 否（受隐私设置限制）

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uid | String | 是 | TA用户ID |

**响应**: PDF二进制文件

---

### 6.10 获取标签列表

#### `GET /user?action=listTags`

获取系统中所有可用的标签。

**认证要求**: 否

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": ["Java", "Python", "Machine Learning", "Data Analysis", ...]
}
```

---

## 7. JobServlet (`/job`)

岗位管理相关接口。

### 7.1 发布岗位

#### `POST /job?action=publish`

MO发布一个新的岗位。

**认证要求**: 是（MO用户）

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| jobName | String | 是 | 岗位名称 |
| jobType | Integer | 是 | 岗位类型（1=课程, 2=监考, 3=活动） |
| belongModule | String | 是 | 所属课程/模块 |
| jobDesc | String | 是 | 岗位描述 |
| workHoursWeekly | Double | 是 | 每周工作小时数 |
| recruitNum | Integer | 是 | 招聘人数 |
| applyDeadline | String | 是 | 申请截止时间 |
| tags | String | 否 | 标签列表（逗号分隔） |

**响应示例**:
```json
{
  "code": 200,
  "msg": "发布成功",
  "data": null
}
```

---

### 7.2 获取所有岗位

#### `GET /job?action=listAll`

获取所有已发布的岗位（包括已截止和已招满的）。

**认证要求**: 否

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "jobId": "xxx",
      "jobName": "数据结构课程助教",
      "jobType": 1,
      "belongModule": "CS101",
      "jobStatus": 0,
      "recruitNum": 5,
      "hiredNum": 0,
      ...
    }
  ]
}
```

---

### 7.3 获取开放岗位

#### `GET /job?action=listOpen`

获取当前正在招聘的岗位（状态为0）。

**认证要求**: 否

**请求参数**: 无

**响应示例**: 同 `listAll`，但只包含 `jobStatus=0` 的岗位

---

### 7.4 获取我发布的岗位

#### `GET /job?action=listMy`

获取当前MO自己发布的岗位列表。

**认证要求**: 是（MO用户）

**请求参数**: 无

**响应示例**: 同 `listAll`，但只包含当前用户发布的岗位

---

### 7.5 获取岗位详情

#### `GET /job?action=getDetail`

获取某个岗位的详细信息。

**认证要求**: 否

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| jobId | String | 是 | 岗位ID |

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "jobId": "xxx",
    "jobName": "数据结构课程助教",
    "publisherMoId": "mo001",
    "jobType": 1,
    "belongModule": "CS101",
    "jobDesc": "负责数据结构课程答疑和作业批改",
    "workHoursWeekly": 10.0,
    "recruitNum": 5,
    "hiredNum": 2,
    "publishTime": "2026-04-01 10:00:00",
    "applyDeadline": "2026-04-30 23:59:59",
    "jobStatus": 0,
    "tags": ["Java", "Algorithm"],
    ...
  }
}
```

---

### 7.6 匹配TA

#### `GET /job?action=matchTAs`

根据岗位的标签匹配适合的TA。

**认证要求**: 是（MO用户，且为岗位发布者）

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| jobId | String | 是 | 岗位ID |

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "userId": "ta001",
      "realName": "张三",
      "matchScore": 95,
      "tags": ["Java", "Algorithm"]
    }
  ]
}
```

---

### 7.7 更新岗位

#### `POST /job?action=update`

MO更新自己发布的岗位信息。

**认证要求**: 是（MO用户，且为岗位发布者）

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| jobId | String | 是 | 岗位ID |
| jobName | String | 否 | 岗位名称 |
| jobType | Integer | 否 | 岗位类型 |
| belongModule | String | 否 | 所属模块 |
| jobDesc | String | 否 | 岗位描述 |
| workHoursWeekly | Double | 否 | 每周工时 |
| recruitNum | Integer | 否 | 招聘人数 |
| applyDeadline | String | 否 | 截止时间 |
| tags | String | 否 | 标签列表 |

**响应示例**:
```json
{
  "code": 200,
  "msg": "更新成功",
  "data": null
}
```

---

## 8. ApplicationServlet (`/application`)

申请管理相关接口。

### 8.1 提交申请

#### `POST /application?action=apply`

TA申请某个岗位。

**认证要求**: 是（TA用户）

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| jobId | String | 是 | 岗位ID |

**响应示例**:
```json
{
  "code": 200,
  "msg": "申请成功",
  "data": null
}
```

**错误码**:
- 400: 岗位不存在或已截止
- 400: 重复申请

---

### 8.2 审核申请

#### `POST /application?action=audit`

MO审核某个申请（通过或拒绝）。

**认证要求**: 是（MO用户，且为岗位发布者）

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| applicationId | String | 是 | 申请ID |
| auditStatus | Integer | 是 | 审核状态（1=通过, 2=拒绝） |
| remark | String | 否 | 审核备注 |

**响应示例**:
```json
{
  "code": 200,
  "msg": "审核成功",
  "data": null
}
```

---

### 8.3 按岗位查看申请

#### `GET /application?action=listByJob`

MO查看某个岗位的所有申请列表（包含TA详细信息）。

**认证要求**: 是（MO用户，且为岗位发布者）

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| jobId | String | 是 | 岗位ID |

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "applicationId": "xxx",
      "jobId": "job001",
      "taUserId": "ta001",
      "taRealName": "张三",
      "taStudentId": "20210001",
      "taMajor": "计算机科学与技术",
      "taEducation": "硕士",
      "taEmail": "zhangsan@bupt.edu.cn",
      "taSelfIntro": "熟悉数据结构与算法...",
      "applyTime": "2026-04-10 14:30:00",
      "applyStatus": 0,
      "auditRemark": null
    }
  ]
}
```

---

### 8.4 查看我的申请

#### `GET /application?action=listMy`

TA查看自己的所有申请记录（包含岗位详细信息）。

**认证要求**: 是（TA用户）

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "applicationId": "xxx",
      "jobId": "job001",
      "jobName": "数据结构课程助教",
      "jobType": 1,
      "belongModule": "CS101",
      "jobDesc": "负责课程答疑",
      "workHoursWeekly": 10.0,
      "applyTime": "2026-04-10 14:30:00",
      "applyStatus": 0,
      "auditRemark": null
    }
  ]
}
```

---

### 8.5 取消申请

#### `POST /application?action=cancel`

TA取消自己待审核的申请。

**认证要求**: 是（TA用户，且为申请者）

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| applicationId | String | 是 | 申请ID |

**响应示例**:
```json
{
  "code": 200,
  "msg": "取消成功",
  "data": null
}
```

**错误码**:
- 400: 申请不存在
- 400: 申请状态不是待审核

---

## 9. MessageServlet (`/message`)

消息管理相关接口。

### 9.1 发送消息

#### `POST /message?action=send`

向指定用户发送消息。

**认证要求**: 是

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| receiverId | String | 是 | 接收者用户ID |
| content | String | 是 | 消息内容 |
| jobId | String | 否 | 相关岗位ID |
| jobTitle | String | 否 | 相关岗位标题 |

**响应示例**:
```json
{
  "code": 200,
  "msg": "发送成功",
  "data": {
    "messageId": "xxx",
    "senderId": "ta001",
    "receiverId": "mo001",
    "content": "您好，我想咨询岗位详情",
    "sendTime": "2026-04-10 15:00:00",
    "status": 0
  }
}
```

---

### 9.2 获取聊天历史

#### `GET /message?action=getHistory`

获取与某个用户的聊天历史记录。

**认证要求**: 是

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| otherUserId | String | 是 | 对方用户ID |
| page | Integer | 否 | 页码（默认1） |
| size | Integer | 否 | 每页大小（默认20） |

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "messageId": "xxx",
      "senderId": "ta001",
      "senderName": "张三",
      "receiverId": "mo001",
      "receiverName": "李老师",
      "content": "您好",
      "sendTime": "2026-04-10 15:00:00",
      "status": 1
    }
  ]
}
```

---

### 9.3 获取会话列表

#### `GET /message?action=listConversations`

获取当前用户的所有会话列表（按用户分组）。

**认证要求**: 是

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "mo001": "李老师",
    "ta002": "王五",
    "admin001": "系统管理员"
  }
}
```

---

### 9.4 获取未读消息数

#### `GET /message?action=getUnreadCount`

获取当前用户的未读消息总数。

**认证要求**: 是

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": 5
}
```

---

### 9.5 标记消息已读

#### `POST /message?action=markRead`

标记指定消息为已读状态。

**认证要求**: 是

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| messageIds | String | 是 | 消息ID列表（逗号分隔） |

**响应示例**:
```json
{
  "code": 200,
  "msg": "标记成功",
  "data": null
}
```

---

## 10. AdminServlet (`/admin`)

系统管理相关接口。

### 10.1 用户列表

#### `GET /admin?action=listUsers`

获取所有用户的列表。

**认证要求**: 是（Admin用户）

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "userId": "xxx",
      "username": "student001",
      "realName": "张三",
      "email": "zhangsan@bupt.edu.cn",
      "userType": 1,
      "userTypeDesc": "TA",
      "status": 0
    }
  ]
}
```

---

### 10.2 删除用户

#### `POST /admin?action=deleteUser`

删除指定用户。

**认证要求**: 是（Admin用户）

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | String | 是 | 要删除的用户ID |

**响应示例**:
```json
{
  "code": 200,
  "msg": "删除成功",
  "data": null
}
```

---

### 10.3 获取用户详情

#### `GET /admin?action=getUserDetail`

获取用户的详细信息（根据用户类型包含不同内容）。

**认证要求**: 是（Admin用户）

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | String | 是 | 用户ID |

**响应示例** (TA用户):
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "userId": "xxx",
    "username": "student001",
    "realName": "张三",
    "email": "zhangsan@bupt.edu.cn",
    "userType": 1,
    "userTypeDesc": "TA",
    "createTime": "2026-01-01 10:00:00",
    "taInfo": {
      "studentId": "20210001",
      "major": "计算机科学与技术",
      "education": "硕士",
      "selfIntro": "熟悉Java编程",
      ...
    },
    "taApplicationList": [
      { /* 申请记录 */ }
    ]
  }
}
```

**响应示例** (MO用户):
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "userId": "xxx",
    "username": "teacher001",
    "realName": "李老师",
    "email": "li@bupt.edu.cn",
    "userType": 2,
    "userTypeDesc": "MO",
    "createTime": "2026-01-01 10:00:00",
    "moInfo": {
      "staffId": "T001",
      "department": "计算机学院",
      "manageModules": ["CS101", "CS201"],
      ...
    },
    "moPublishedJobList": [
      { /* 发布的岗位 */ }
    ]
  }
}
```

---

### 10.4 所有岗位列表

#### `GET /admin?action=listAllJobs`

获取系统中所有岗位的列表（包括已删除的）。

**认证要求**: 是（Admin用户）

**请求参数**: 无

**响应示例**: 同 `JobServlet.listAll`

---

### 10.5 删除岗位

#### `POST /admin?action=deleteJob`

删除指定岗位（同时删除所有相关申请）。

**认证要求**: 是（Admin用户）

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| jobId | String | 是 | 要删除的岗位ID |

**响应示例**:
```json
{
  "code": 200,
  "msg": "删除成功",
  "data": null
}
```

---

## 11. RecommendServlet (`/recommend`)

智能推荐相关接口。

### 11.1 为TA推荐岗位

#### `GET /recommend?action=recommendJobsForTA`

基于嵌入向量相似度，为TA推荐合适的岗位。

**认证要求**: 是

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| taId | String | 否 | TA用户ID（默认为当前登录用户） |
| topK | Integer | 否 | 推荐数量（默认10，最大50） |

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "id": "job001",
      "name": "数据结构课程助教",
      "score": 0.95
    },
    {
      "id": "job002",
      "name": "算法设计课程助教",
      "score": 0.88
    }
  ]
}
```

---

### 11.2 为岗位推荐TA

#### `GET /recommend?action=recommendTAsForJob`

基于嵌入向量相似度，为岗位推荐合适的TA。

**认证要求**: 是

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| jobId | String | 是 | 岗位ID |
| topK | Integer | 否 | 推荐数量（默认10，最大50） |

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "id": "ta001",
      "name": "张三",
      "score": 0.95
    },
    {
      "id": "ta002",
      "name": "李四",
      "score": 0.87
    }
  ]
}
```

---

## 12. EmbeddingServlet (`/embedding`)

嵌入向量管理相关接口。

### 12.1 更新TA嵌入向量

#### `GET /embedding?action=updateTAEmbedding`

根据TA的简介和标签重新计算嵌入向量。

**认证要求**: 否

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| taId | String | 是 | TA用户ID |

**响应示例**:
```json
{
  "code": 200,
  "msg": "更新成功",
  "data": null
}
```

---

### 12.2 更新岗位嵌入向量

#### `GET /embedding?action=updateJobEmbedding`

根据岗位的名称、描述和标签重新计算嵌入向量。

**认证要求**: 否

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| jobId | String | 是 | 岗位ID |

**响应示例**:
```json
{
  "code": 200,
  "msg": "更新成功",
  "data": null
}
```

---

### 12.3 获取TA嵌入向量

#### `GET /embedding?action=getTAEmbedding`

获取指定TA的嵌入向量。

**认证要求**: 否

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| taId | String | 是 | TA用户ID |

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": [0.123, -0.456, 0.789, ...]
}
```

---

### 12.4 获取岗位嵌入向量

#### `GET /embedding?action=getJobEmbedding`

获取指定岗位的嵌入向量。

**认证要求**: 否

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| jobId | String | 是 | 岗位ID |

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": [0.234, -0.567, 0.890, ...]
}
```

---

## 13. 数据传输对象 (DTOs)

### 13.1 UserListDTO

管理员用户列表中使用的数据传输对象。

```json
{
  "userId": "xxx",
  "username": "student001",
  "realName": "张三",
  "email": "zhangsan@bupt.edu.cn",
  "userType": 1,
  "userTypeDesc": "TA",
  "status": 0
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| userId | String | 用户ID |
| username | String | 用户名 |
| realName | String | 真实姓名 |
| email | String | 邮箱 |
| userType | Integer | 用户类型 |
| userTypeDesc | String | 用户类型描述 |
| status | Integer | 状态（0=正常, 1=禁用） |

---

### 13.2 UserDetailDTO

管理员查看用户详情时使用的数据传输对象。

```json
{
  "userId": "xxx",
  "username": "student001",
  "realName": "张三",
  "email": "zhangsan@bupt.edu.cn",
  "phone": "13800138000",
  "userType": 1,
  "userTypeDesc": "TA",
  "createTime": "2026-01-01 10:00:00",
  "taInfo": { /* TA对象 */ },
  "taApplicationList": [ /* 申请记录数组 */ ]
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| userId | String | 用户ID |
| username | String | 用户名 |
| realName | String | 真实姓名 |
| email | String | 邮箱 |
| phone | String | 电话 |
| userType | Integer | 用户类型 |
| userTypeDesc | String | 用户类型描述 |
| createTime | String | 创建时间 |
| taInfo | TA | TA详情（TA用户） |
| taApplicationList | List\<Application\> | 申请记录（TA用户） |
| moInfo | MO | MO详情（MO用户） |
| moPublishedJobList | List\<Job\> | 发布的岗位（MO用户） |

---

### 13.3 MyApplicationDTO

TA查看自己的申请记录时使用。

```json
{
  "applicationId": "xxx",
  "jobId": "job001",
  "applyTime": "2026-04-10 14:30:00",
  "applyStatus": 0,
  "auditRemark": null,
  "jobName": "数据结构课程助教",
  "jobType": 1,
  "belongModule": "CS101",
  "jobDesc": "负责课程答疑",
  "workHoursWeekly": 10.0
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| applicationId | String | 申请ID |
| jobId | String | 岗位ID |
| applyTime | String | 申请时间 |
| applyStatus | Integer | 申请状态 |
| auditRemark | String | 审核备注 |
| jobName | String | 岗位名称 |
| jobType | Integer | 岗位类型 |
| belongModule | String | 所属模块 |
| jobDesc | String | 岗位描述 |
| workHoursWeekly | Double | 每周工时 |

---

### 13.4 ApplicationDetailDTO

MO查看岗位申请列表时使用（包含TA详细信息）。

```json
{
  "applicationId": "xxx",
  "jobId": "job001",
  "applyTime": "2026-04-10 14:30:00",
  "applyStatus": 0,
  "auditRemark": null,
  "taUserId": "ta001",
  "taRealName": "张三",
  "taStudentId": "20210001",
  "taMajor": "计算机科学与技术",
  "taEducation": "硕士",
  "taEmail": "zhangsan@bupt.edu.cn",
  "taCvPath": "/files/cv/ta001.pdf",
  "taSelfIntro": "熟悉数据结构与算法..."
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| applicationId | String | 申请ID |
| jobId | String | 岗位ID |
| applyTime | String | 申请时间 |
| applyStatus | Integer | 申请状态 |
| auditRemark | String | 审核备注 |
| taUserId | String | TA用户ID |
| taRealName | String | TA真实姓名 |
| taStudentId | String | TA学号 |
| taMajor | String | TA专业 |
| taEducation | String | TA学历 |
| taEmail | String | TA邮箱 |
| taCvPath | String | TA简历路径 |
| taSelfIntro | String | TA个人简介 |

---

### 13.5 RecommendResult

推荐结果对象。

```json
{
  "id": "job001",
  "name": "数据结构课程助教",
  "score": 0.95
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 推荐对象ID（岗位ID或TA用户ID） |
| name | String | 推荐对象名称 |
| score | Double | 相似度分数（0-1之间） |

---

## 14. 实体类 (Entities)

### 14.1 User

抽象基类，所有用户类型都继承此类。

| 字段 | 类型 | 说明 |
|------|------|------|
| userId | String | 用户唯一ID（UUID） |
| username | String | 登录用户名（唯一） |
| password | String | 密码（MD5加密） |
| realName | String | 真实姓名 |
| email | String | 邮箱 |
| phone | String | 电话 |
| userType | Integer | 用户类型（1=TA, 2=MO, 3=Admin） |
| createTime | String | 创建时间（yyyy-MM-dd HH:mm:ss） |
| status | Integer | 状态（0=正常, 1=禁用） |

---

### 14.2 TA

助教用户，继承User。

| 字段 | 类型 | 说明 |
|------|------|------|
| studentId | String | 学号（唯一） |
| major | String | 专业 |
| education | String | 学历 |
| grade | String | 年级 |
| skillIds | List\<String\> | 技能ID列表 |
| cvPath | String | CV文件路径 |
| profilePdfPath | String | 简历PDF路径 |
| selfIntro | String | 个人简介 |
| profileVisible | Boolean | 资料是否可见 |
| totalWorkload | Double | 累计工作量（小时） |
| availableHours | Double | 每周可用时长 |
| tags | List\<String\> | 标签列表 |

---

### 14.3 MO

模块组织者，继承User。

| 字段 | 类型 | 说明 |
|------|------|------|
| staffId | String | 工号（唯一） |
| department | String | 部门 |
| manageModules | List\<String\> | 管理的模块列表 |
| publishedJobIds | List\<String\> | 发布的岗位ID列表 |

---

### 14.4 Admin

系统管理员，继承User。

| 字段 | 类型 | 说明 |
|------|------|------|
| roleLevel | Integer | 权限等级（1=普通, 2=超级） |

---

### 14.5 Job

岗位实体。

| 字段 | 类型 | 说明 |
|------|------|------|
| jobId | String | 岗位唯一ID（UUID） |
| publisherMoId | String | 发布者MO的用户ID |
| jobName | String | 岗位名称 |
| jobType | Integer | 岗位类型（1=课程, 2=监考, 3=活动） |
| belongModule | String | 所属课程/模块 |
| requireSkillIds | List\<String\> | 要求的技能ID列表 |
| jobDesc | String | 岗位职责描述 |
| workHoursWeekly | Double | 每周所需工时 |
| recruitNum | Integer | 计划招聘人数 |
| hiredNum | Integer | 已录用人数 |
| publishTime | String | 发布时间 |
| applyDeadline | String | 申请截止时间 |
| jobStatus | Integer | 岗位状态（0=招聘中, 1=已截止, 2=已招满） |
| tags | List\<String\> | 标签列表 |

---

### 14.6 Application

申请记录实体。

| 字段 | 类型 | 说明 |
|------|------|------|
| applicationId | String | 申请记录唯一ID（UUID） |
| taUserId | String | 申请者TA的用户ID |
| jobId | String | 申请的岗位ID |
| applyTime | String | 申请提交时间 |
| applyStatus | Integer | 申请状态（0=待审核, 1=已通过, 2=已拒绝） |
| auditMoId | String | 审核人MO的用户ID |
| auditTime | String | 审核时间 |
| auditRemark | String | 审核备注 |

---

### 14.7 Message

消息实体。

| 字段 | 类型 | 说明 |
|------|------|------|
| messageId | String | 消息唯一ID（UUID） |
| senderId | String | 发送者用户ID |
| senderType | String | 发送者类型 |
| senderName | String | 发送者姓名 |
| receiverId | String | 接收者用户ID |
| receiverType | String | 接收者类型 |
| receiverName | String | 接收者姓名 |
| content | String | 消息内容 |
| jobId | String | 相关岗位ID（可选） |
| jobTitle | String | 相关岗位标题（可选） |
| sendTime | String | 发送时间 |
| status | Integer | 阅读状态（0=未读, 1=已读） |

---

## 15. API 汇总表

| Servlet | 方法 | Action | 认证 | 说明 |
|---------|------|--------|------|------|
| HelloServlet | GET | (default) | 否 | 健康检查 |
| UserServlet | POST | login | 否 | 用户登录 |
| UserServlet | POST | registerTA | 否 | 注册TA |
| UserServlet | POST | registerMO | 否 | 注册MO |
| UserServlet | POST | registerAdmin | 否 | 注册Admin |
| UserServlet | GET | getLoginUser | 是 | 获取当前用户 |
| UserServlet | POST | updateProfile | 是 | 更新TA资料 |
| UserServlet | POST | logout | 是 | 登出 |
| UserServlet | POST | uploadProfilePdf | 是 | 上传简历PDF |
| UserServlet | GET | downloadProfilePdf | 否 | 下载简历PDF |
| UserServlet | GET | listTags | 否 | 获取标签列表 |
| JobServlet | POST | publish | 是(mo) | 发布岗位 |
| JobServlet | GET | listAll | 否 | 获取所有岗位 |
| JobServlet | GET | listOpen | 否 | 获取开放岗位 |
| JobServlet | GET | listMy | 是(mo) | 获取我发布的岗位 |
| JobServlet | GET | getDetail | 否 | 获取岗位详情 |
| JobServlet | GET | matchTAs | 是(mo) | 匹配TA |
| JobServlet | POST | update | 是(mo) | 更新岗位 |
| ApplicationServlet | POST | apply | 是(ta) | 提交申请 |
| ApplicationServlet | POST | audit | 是(mo) | 审核申请 |
| ApplicationServlet | GET | listByJob | 是(mo) | 按岗位查看申请 |
| ApplicationServlet | GET | listMy | 是(ta) | 查看我的申请 |
| ApplicationServlet | POST | cancel | 是(ta) | 取消申请 |
| MessageServlet | POST | send | 是 | 发送消息 |
| MessageServlet | GET | getHistory | 是 | 获取聊天历史 |
| MessageServlet | GET | listConversations | 是 | 获取会话列表 |
| MessageServlet | GET | getUnreadCount | 是 | 获取未读数 |
| MessageServlet | POST | markRead | 是 | 标记已读 |
| AdminServlet | GET | listUsers | 是(admin) | 用户列表 |
| AdminServlet | POST | deleteUser | 是(admin) | 删除用户 |
| AdminServlet | GET | getUserDetail | 是(admin) | 用户详情 |
| AdminServlet | GET | listAllJobs | 是(admin) | 所有岗位 |
| AdminServlet | POST | deleteJob | 是(admin) | 删除岗位 |
| RecommendServlet | GET | recommendJobsForTA | 是 | 岗位推荐 |
| RecommendServlet | GET | recommendTAsForJob | 是 | TA推荐 |
| EmbeddingServlet | GET | updateTAEmbedding | 否 | 更新TA向量 |
| EmbeddingServlet | GET | updateJobEmbedding | 否 | 更新岗位向量 |
| EmbeddingServlet | GET | getTAEmbedding | 否 | 获取TA向量 |
| EmbeddingServlet | GET | getJobEmbedding | 否 | 获取岗位向量 |

---

## 16. 错误码汇总

| 错误码 | 说明 | 可能场景 |
|--------|------|----------|
| 200 | 成功 | 操作成功 |
| 400 | 参数错误 | 缺少必填参数、参数格式错误 |
| 401 | 未授权 | 未登录或Session过期 |
| 403 | 禁止访问 | 权限不足（如TA访问MO接口） |
| 404 | 资源不存在 | 用户ID、岗位ID不存在 |
| 500 | 服务器错误 | 内部异常 |

---

## 17. 认证标记说明

| 标记 | 说明 |
|------|------|
| 否 | 无需登录即可访问 |
| 是 | 需要登录即可访问 |
| 是(ta) | 仅TA用户可访问 |
| 是(mo) | 仅MO用户可访问 |
| 是(admin) | 仅Admin用户可访问 |