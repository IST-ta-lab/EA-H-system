# EA-H-system 项目架构描述

## 1. 项目概述

### 1.1 项目名称
**EA-H-system** (也称为 `tapj` - TA Recruitment System)

### 1.2 项目背景
EA-H-system 是一个基于敏捷开发的助教（Teaching Assistant）招聘系统，为北京邮电大学国际学院提供完整的助教招聘管理解决方案。

### 1.3 项目类型
- **架构模式**: MVC + 分层架构
- **应用类型**: Java Web 应用 (WAR 打包)
- **上下文路径**: `/tapj`

---

## 2. 技术栈

### 2.1 后端技术

| 组件 | 技术 | 版本 |
|------|------|------|
| 开发语言 | Java | JDK 8+ |
| Web框架 | Jakarta Servlet | 9 (EE 9) |
| JSON处理 | Gson + Gson-extras | - |
| HTTP客户端 | Apache HttpClient | - |
| 文件操作 | Apache Commons IO | - |
| 构建工具 | Maven | 3.6+ |
| Web服务器 | Apache Tomcat | 10.1.x |

### 2.2 前端技术

| 组件 | 技术 |
|------|------|
| 标记语言 | HTML5 |
| 样式 | CSS3 |
| 脚本 | Vanilla JavaScript (原生JS，无框架) |

### 2.3 数据存储

| 存储方式 | 说明 |
|----------|------|
| 数据库 | **无** (不使用传统数据库) |
| 数据文件 | JSON 文件存储于 `/WEB-INF/data/` |

---

## 3. 项目目录结构

```
EA-H-system/
├── pom.xml                              # Maven 项目配置
├── README.md                            # 项目说明
├── api.md                               # API 文档
├── help.md                              # 开发部署指南
├── Product Backlog.md                   # 敏捷产品待办列表
├── LICENSE                              # 许可证
│
├── document/                            # 项目文档
│   ├── material/                        # 需求材料
│   ├── storys_original/                 # 原始用户故事文档
│   ├── architecture.md                  # 本文档
│   └── api.md                           # API 文档
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       ├── example/              # 示例代码
│       │       │   └── HelloServlet.java
│       │       └── qm/
│       │           └── bupt/
│       │               ├── dao/                     # 数据访问层
│       │               │   ├── BaseDAO.java
│       │               │   ├── UserDAO.java
│       │               │   ├── TADAO.java
│       │               │   ├── MODAO.java
│       │               │   ├── JobDAO.java
│       │               │   ├── ApplicationDAO.java
│       │               │   ├── MessageDAO.java
│       │               │   └── EmbeddingDAO.java
│       │               │
│       │               ├── dto/                     # 数据传输对象
│       │               │   ├── ApplicationDetailDTO.java
│       │               │   ├── MyApplicationDTO.java
│       │               │   ├── UserDetailDTO.java
│       │               │   └── UserListDTO.java
│       │               │
│       │               ├── entity/                  # 领域模型
│       │               │   ├── enums/               # 枚举类
│       │               │   │   ├── ApplyStatusEnum.java
│       │               │   │   ├── JobStatusEnum.java
│       │               │   │   └── UserTypeEnum.java
│       │               │   ├── User.java           # 抽象基类
│       │               │   ├── TA.java             # 助教
│       │               │   ├── MO.java             # 模块组织者
│       │               │   ├── Admin.java          # 管理员
│       │               │   ├── Job.java            # 岗位
│       │               │   ├── Application.java    # 申请记录
│       │               │   ├── Message.java        # 消息
│       │               │   └── Skill.java          # 技能
│       │               │
│       │               ├── filter/                  # Servlet 过滤器
│       │               │   ├── AuthFilter.java      # 登录认证
│       │               │   └── EncodingFilter.java  # UTF-8 编码
│       │               │
│       │               ├── listener/                # 监听器
│       │               │   └── SystemInitListener.java
│       │               │
│       │               ├── service/                 # 业务逻辑层
│       │               │   ├── impl/               # 服务实现
│       │               │   │   ├── AdminServiceImpl.java
│       │               │   │   ├── ApplicationServiceImpl.java
│       │               │   │   ├── JobServiceImpl.java
│       │               │   │   ├── MessageServiceImpl.java
│       │               │   │   └── UserServiceImpl.java
│       │               │   ├── AdminService.java
│       │               │   ├── ApplicationService.java
│       │               │   ├── EmbeddingService.java
│       │               │   ├── JobService.java
│       │               │   ├── MessageService.java
│       │               │   ├── RecommendService.java
│       │               │   └── UserService.java
│       │               │
│       │               ├── servlet/                 # REST API 控制器
│       │               │   ├── BaseServlet.java
│       │               │   ├── AdminServlet.java
│       │               │   ├── ApplicationServlet.java
│       │               │   ├── EmbeddingServlet.java
│       │               │   ├── JobServlet.java
│       │               │   ├── MessageServlet.java
│       │               │   ├── RecommendServlet.java
│       │               │   └── UserServlet.java
│       │               │
│       │               └── util/                    # 工具类
│       │                   ├── AuthUtil.java
│       │                   ├── ConfigUtil.java
│       │                   ├── DateUtil.java
│       │                   ├── FileUtil.java
│       │                   ├── JsonUtil.java
│       │                   └── Result.java
│       │
│       └── webapp/                      # Web 资源
│           ├── index.html               # 首页
│           ├── login.html               # 登录页
│           ├── apply.html               # 申请页
│           ├── guest.html                # 访客页
│           ├── admin.html               # 管理员面板
│           ├── main.html                # 主面板
│           ├── message.html             # 消息页
│           ├── mo.html                  # MO 页面
│           ├── recommend.html           # 推荐页
│           ├── ta.html                   # TA 页面
│           ├── file.html                 # 文件上传页
│           ├── *.css                     # 样式表
│           ├── *.js                      # JavaScript 文件
│           └── WEB-INF/
│               ├── web.xml              # Web 应用配置
│               └── data/                # 数据存储
│                   ├── config.properties.example
│                   ├── tags.json
│                   ├── ta_embeddings.json
│                   └── job_embeddings.json
│
└── target/                              # Maven 构建输出
```

---

## 4. 核心模块架构

### 4.1 分层架构图

```
┌─────────────────────────────────────────────────────────┐
│                    HTTP Request                         │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                     Filters (过滤器)                     │
│  ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │  AuthFilter     │    │   EncodingFilter            │ │
│  │  (认证过滤器)    │    │   (UTF-8编码过滤器)          │ │
│  └─────────────────┘    └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  Servlets (控制器层)                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │UserServlet│ │JobServlet│ │AppServlet│ │Message...│  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                Services (业务逻辑层)                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │UserService│ │JobService│ │AppService│ │MsgService│  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│  ┌────────────────────┐  ┌────────────────────────────┐  │
│  │ EmbeddingService  │  │   RecommendService        │  │
│  │ (AI嵌入服务)       │  │   (推荐引擎)               │  │
│  └────────────────────┘  └────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   DAOs (数据访问层)                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ UserDAO  │ │  JobDAO  │ │AppDAO    │ │ Message..│  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              JSON Files (数据持久化)                     │
│  users.json │ jobs.json │ applications.json │ messages │
└─────────────────────────────────────────────────────────┘
```

### 4.2 各层职责

| 层级 | 包路径 | 职责 |
|------|--------|------|
| **控制器层** | `com.qm.bupt.servlet` | 处理HTTP请求，路由分发，返回JSON响应 |
| **业务逻辑层** | `com.qm.bupt.service` | 业务逻辑处理，数据验证，服务编排 |
| **数据访问层** | `com.qm.bupt.dao` | 数据持久化到JSON文件，CRUD操作 |
| **实体层** | `com.qm.bupt.entity` | 领域模型(User, TA, MO, Admin, Job, Application, Message) |
| **DTO层** | `com.qm.bupt.dto` | API数据传输对象 |
| **过滤器层** | `com.qm.bupt.filter` | 认证、编码等横切关注点 |
| **工具层** | `com.qm.bupt.util` | 辅助工具(JSON、文件、认证、配置) |

### 4.3 请求处理流程

```
1. 请求进入 → EncodingFilter (设置UTF-8编码)
2. 检查是否需要认证 → AuthFilter (登录检查)
3. Servlet 接收请求 → 根据 action 参数分发
4. 调用 Service 层处理业务逻辑
5. 调用 DAO 层进行数据持久化
6. 逐层返回结果 → 统一封装为 Result 对象
7. 返回 JSON 响应给前端
```

---

## 5. 数据模型

### 5.1 实体类关系图

```
┌──────────────────────────────────────────────────────────┐
│                      User (抽象基类)                       │
│  userId, username, password, realName, email, phone,     │
│  userType, createTime, status                             │
└──────────────────────────────────────────────────────────┘
          ▲                    ▲                    ▲
          │                    │                    │
    ┌─────┴─────┐        ┌─────┴─────┐       ┌─────┴─────┐
    │    TA     │        │    MO     │       │   Admin   │
    │ (助教)    │        │ (模块组织者) │       │  (管理员)  │
    └───────────┘        └───────────┘       └───────────┘
```

### 5.2 主要实体

#### User (抽象基类)
| 字段 | 类型 | 说明 |
|------|------|------|
| userId | String | UUID，唯一标识 |
| username | String | 用户名，唯一 |
| password | String | 密码(MD5加密) |
| realName | String | 真实姓名 |
| email | String | 邮箱 |
| phone | String | 电话 |
| userType | Integer | 1=TA, 2=MO, 3=Admin |
| createTime | String | 创建时间 |
| status | Integer | 0=正常, 1=禁用 |

#### TA (继承User)
| 字段 | 类型 | 说明 |
|------|------|------|
| studentId | String | 学号 |
| major | String | 专业 |
| education | String | 学历 |
| grade | String | 年级 |
| skillIds | List<String> | 技能列表 |
| cvPath | String | CV路径 |
| selfIntro | String | 个人简介 |
| profileVisible | Boolean | 隐私设置 |
| totalWorkload | Double | 累计工作量 |
| availableHours | Double | 可用时长 |
| tags | List<String> | 标签 |

#### MO (继承User)
| 字段 | 类型 | 说明 |
|------|------|------|
| staffId | String | 工号 |
| department | String | 部门 |
| manageModules | List<String> | 管理的模块 |
| publishedJobIds | List<String> | 发布的岗位 |

#### Job
| 字段 | 类型 | 说明 |
|------|------|------|
| jobId | String | UUID |
| publisherMoId | String | 发布者MO的ID |
| jobName | String | 岗位名称 |
| jobType | Integer | 1=课程助教, 2=监考助教, 3=活动助教 |
| belongModule | String | 所属模块 |
| jobDesc | String | 描述 |
| workHoursWeekly | Double | 每周工时 |
| recruitNum | Integer | 招聘人数 |
| hiredNum | Integer | 已录用 |
| publishTime | String | 发布时间 |
| applyDeadline | String | 截止时间 |
| jobStatus | Integer | 0=招聘中, 1=已截止, 2=已招满 |
| tags | List<String> | 标签 |

#### Application
| 字段 | 类型 | 说明 |
|------|------|------|
| applicationId | String | UUID |
| taUserId | String | 申请者ID |
| jobId | String | 岗位ID |
| applyTime | String | 申请时间 |
| applyStatus | Integer | 0=待审核, 1=已通过, 2=已拒绝 |
| auditMoId | String | 审核者ID |
| auditTime | String | 审核时间 |
| auditRemark | String | 审核备注 |

#### Message
| 字段 | 类型 | 说明 |
|------|------|------|
| messageId | String | UUID |
| senderId | String | 发送者ID |
| senderName | String | 发送者姓名 |
| receiverId | String | 接收者ID |
| receiverName | String | 接收者姓名 |
| content | String | 消息内容 |
| jobId | String | 相关岗位(可选) |
| jobTitle | String | 相关岗位标题 |
| sendTime | String | 发送时间 |
| status | Integer | 0=未读, 1=已读 |

### 5.3 枚举类

| 枚举 | 值 | 说明 |
|------|-----|------|
| **UserTypeEnum** | 1=TA, 2=MO, 3=Admin | 用户类型 |
| **JobStatusEnum** | 0=OPEN, 1=CLOSED, 2=FILLED | 岗位状态 |
| **ApplyStatusEnum** | 0=PENDING, 1=PASSED, 2=REJECTED | 申请状态 |

---

## 6. 用户角色与权限

### 6.1 角色定义

| 角色 | 代码 | 描述 | 主要功能 |
|------|------|------|----------|
| **TA** | 1 | 助教申请者 | 浏览岗位、申请岗位、上传简历、管理个人信息 |
| **MO** | 2 | 模块组织者 | 发布岗位、管理岗位、审核申请、查看推荐 |
| **Admin** | 3 | 系统管理员 | 用户管理、岗位管理、查看所有数据 |

### 6.2 权限矩阵

| 功能 | TA | MO | Admin |
|------|----|----|----|
| 登录/登出 | ✓ | ✓ | ✓ |
| 注册 | ✓ | ✓ | ✓ |
| 查看岗位列表 | ✓ | ✓ | ✓ |
| 申请岗位 | ✓ | ✗ | ✗ |
| 发布岗位 | ✗ | ✓ | ✗ |
| 审核申请 | ✗ | ✓ | ✗ |
| 发送消息 | ✓ | ✓ | ✓ |
| 推荐匹配 | ✓ | ✓ | ✗ |
| 管理用户 | ✗ | ✗ | ✓ |
| 管理岗位 | ✗ | ✗ | ✓ |

---

## 7. 核心功能模块

### 7.1 用户管理模块
- **组件**: UserServlet, UserService, UserDAO, TADAO, MODAO
- **功能**: 用户注册、登录、资料管理、密码修改

### 7.2 岗位管理模块
- **组件**: JobServlet, JobService, JobDAO
- **功能**: 发布岗位、编辑岗位、关闭岗位、岗位列表查询

### 7.3 申请管理模块
- **组件**: ApplicationServlet, ApplicationService, ApplicationDAO
- **功能**: 提交申请、审核申请、取消申请、申请记录查询

### 7.4 消息中心模块
- **组件**: MessageServlet, MessageService, MessageDAO
- **功能**: 发送消息、查看历史会话、未读消息标记

### 7.5 AI推荐模块
- **组件**: RecommendServlet, RecommendService, EmbeddingService, EmbeddingDAO
- **功能**: 基于嵌入向量的智能岗位推荐、人才推荐

### 7.6 系统管理模块
- **组件**: AdminServlet, AdminService
- **功能**: 用户管理、岗位管理、数据统计

---

## 8. API 设计

### 8.1 设计规范

- **协议**: HTTP/HTTPS
- **格式**: RESTful API (通过action参数分发)
- **请求格式**: `Content-Type: application/x-www-form-urlencoded`
- **响应格式**: JSON

### 8.2 统一响应格式

```json
{
  "code": 200,           // 状态码: 200=成功, 400=参数错误, 401=未授权, 403=禁止, 404=未找到, 500=服务器错误
  "msg": "success",      // 消息
  "data": { ... }        // 数据 payload
}
```

### 8.3 Servlet 路由

| Servlet | 路径 | 操作数 |
|---------|------|--------|
| UserServlet | /user | 9 |
| JobServlet | /job | 7 |
| ApplicationServlet | /application | 5 |
| MessageServlet | /message | 5 |
| AdminServlet | /admin | 5 |
| RecommendServlet | /recommend | 2 |
| EmbeddingServlet | /embedding | 4 |
| HelloServlet | /hello | 1 |

**总计**: 8 Servlets, 38 API 端点

---

## 9. 数据存储

### 9.1 存储策略

- **存储方式**: JSON 文件
- **位置**: `src/main/webapp/WEB-INF/data/`
- **特点**: 无数据库，纯文件存储

### 9.2 数据文件

| 文件 | 说明 |
|------|------|
| user.json | 用户数据 |
| ta.json | TA扩展数据 |
| mo.json | MO扩展数据 |
| job.json | 岗位数据 |
| application.json | 申请记录 |
| message.json | 消息记录 |
| ta_embeddings.json | TA嵌入向量 |
| job_embeddings.json | Job嵌入向量 |
| tags.json | 系统标签 |

### 9.3 并发处理

- 使用文件锁实现并发安全
- 每次读写操作前后进行加锁/解锁

---

## 10. 关键架构决策

### 10.1 设计模式

| 模式 | 应用场景 |
|------|----------|
| **单例模式** | 所有DAO类使用 `instance()` 方法获取单例 |
| **工厂模式** | RuntimeTypeAdapterFactory 处理多态反序列化 |
| **门面模式** | Service层封装复杂业务逻辑 |
| **模板方法** | BaseDAO提供通用CRUD模板 |

### 10.2 关键设计

1. **Action-based路由**: Servlet使用 `action` 参数通过反射分发方法
2. **统一JSON响应**: 所有API返回 `Result` 封装对象
3. **多态反序列化**: Gson使用RuntimeTypeAdapterFactory处理User子类
4. **AI推荐**: EmbeddingService使用简单向量嵌入实现职位/人才匹配
5. **CORS支持**: 所有响应包含 `Access-Control-Allow-Origin: *`

### 10.3 安全特性

- 密码MD5加密存储
- Session-based认证
- 角色权限控制
- 文件上传类型限制

---

## 11. 部署架构

### 11.1 环境要求

| 组件 | 版本要求 |
|------|----------|
| JDK | 8+ |
| Maven | 3.6+ |
| Tomcat | 10.1.x |

### 11.2 部署流程

1. `mvn clean package` 编译项目
2. 生成 `target/tapj.war` 文件
3. 部署到 Tomcat `webapps` 目录
4. 访问 `http://localhost:8080/tapj/`

### 11.3 配置

- 配置文件: `src/main/webapp/WEB-INF/data/config.properties.example`
- 日志配置: Tomcat 日志目录

---

## 12. 扩展性考虑

### 12.1 可扩展点

1. **数据库迁移**: 可将JSON存储迁移至MySQL/PostgreSQL
2. **缓存层**: 可引入Redis缓存热点数据
3. **AI服务**: 可接入更强大的Embedding服务
4. **消息队列**: 可引入Kafka处理异步消息

### 12.2 模块化设计

各层之间通过接口解耦，便于：
- 单元测试（Mock Service/DAO）
- 功能替换（换用不同存储方案）
- 水平扩展（微服务拆分）

---

## 13. 文档索引

- [API 文档](./api.md) - 完整的API端点说明
- [开发部署指南](./help.md) - 本地开发环境配置
- [产品待办列表](./Product Backlog.md) - 敏捷开发任务跟踪