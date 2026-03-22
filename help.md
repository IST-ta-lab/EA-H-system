# BUPT国际学院TA招聘系统 - 开发环境部署指南
> **版本**: v1.0 | **更新日期**: 2026-03-15

本文档旨在帮助团队成员快速搭建本地开发环境，避免重复踩坑。请严格按照步骤操作。

---

## 一、项目简介
本项目是为BUPT国际学院开发的助教招聘系统，采用**敏捷开发方法**，迭代交付。

### 技术栈（严格遵守项目约束）
- **后端**: 原生 Java Servlet (Jakarta EE 9)
- **前端**: 原生 HTML5 + CSS3 + JavaScript
- **数据存储**: 纯文本文件 (JSON/CSV)，**禁止使用数据库**
- **核心工具包**: Gson (JSON序列化)
- **Web服务器**: Apache Tomcat 10.1.x
- **JDK版本**: OpenJDK 25 (或 JDK 8+)
- **构建工具**: Maven 3.6+
- **IDE**: IntelliJ IDEA (推荐)

---

## 二、环境准备清单
在开始之前，请确保你已安装以下软件：
1.  **JDK**: 版本 8 或更高 (项目截图中使用 OpenJDK 25)
2.  **Tomcat**: 版本 **10.1.x** (必须是Tomcat 10+，因为使用了`jakarta.servlet`包，Tomcat 9及以下不兼容)
3.  **Maven**: IDEA通常自带，无需单独安装
4.  **Git**: 用于代码版本控制

---

## 三、详细部署步骤

### 1. 克隆代码 & 打开项目
1.  从 GitHub 克隆仓库到本地。
2.  打开 IDEA，选择 `File` -> `Open`，选中项目的 `pom.xml` 文件，选择 `Open as Project`。

### 2. 配置 Maven (最关键的一步)
**如果不配置，依赖将无法下载！**

1.  打开 `File` -> `Settings` -> `Build, Execution, Deployment` -> `Build Tools` -> `Maven`。
2.  找到 **User settings file** 这一栏。
3.  如果你的 `settings.xml` 是空的或者不存在，请按以下操作：
    - 在 `C:\Users\你的用户名\.m2\` 目录下（如果没有`.m2`文件夹就新建一个），创建/编辑 `settings.xml`。
    - 将以下配置完整复制进去（阿里云镜像源，下载速度快）：
      ```xml
      <?xml version="1.0" encoding="UTF-8"?>
      <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
          <mirrors>
              <mirror>
                  <id>aliyunmaven</id>
                  <mirrorOf>*</mirrorOf>
                  <name>阿里云公共仓库</name>
                  <url>https://maven.aliyun.com/repository/public</url>
              </mirror>
          </mirrors>
      </settings>
      ```
4.  回到IDEA，点击右侧 Maven 面板的 **刷新图标 (Reload All Maven Projects)**，等待依赖下载完成。

### 3. 配置 Artifacts (确保依赖被打包)
**如果不配置，Tomcat运行时会报 `NoClassDefFoundError`！**

1.  打开 `File` -> `Project Structure` (快捷键 `Ctrl+Alt+Shift+S`)。
2.  选择左侧的 **Artifacts**。
3.  中间选中 `tapj:war exploded`。
4.  看右侧的 **Available Elements** 列表。
5.  找到 `Maven: com.google.code.gson:gson:xxx` 以及其他所有Maven依赖，**双击它们**，将其添加到左侧的 `WEB-INF/lib` 目录下。
6.  点击 `Apply` -> `OK`。

### 4. 配置 Tomcat 服务器
1.  点击IDEA右上角的 `Current File` 下拉框 -> `Edit Configurations...`。
2.  点击左上角 `+` 号 -> 选择 **Tomcat Server** -> **Local**。
3.  **Server 选项卡**:
    - `Application server`: 点击 `Configure`，选择你本地解压的 Tomcat 10.1.x 目录。
    - `URL`: 保持默认或改为 `http://localhost:8080/tapj/`。
    - `JRE`: 选择你的 JDK。
4.  **Deployment 选项卡**:
    - 点击 `+` -> 选择 `Artifact...` -> 选中 `tapj:war exploded`。
    - **Application context**: 建议改为 `/tapj` (或者 `/` 如果你想直接访问根路径)。
5.  点击 `Apply` -> `OK`。

### 5. 启动项目
1.  点击IDEA右上角的绿色 **三角形 (Run)** 按钮。
2.  观察控制台，当看到 `工件已成功部署` 和 `Server startup in X ms` 时，说明启动成功。
3.  浏览器访问 `http://localhost:8080/tapj/` 进行测试。

---

## 四、常见问题 (FAQ) & 解决方案
这是本文档最重要的部分，记录了踩过的所有坑。

### 问题 1: 访问页面出现 HTTP 404
**现象**: Tomcat启动成功，但浏览器访问 `localhost:8080` 显示404。
**可能原因 & 解决方案**:
1.  **URL路径不对**: 请确认你访问的URL包含了正确的「应用程序上下文」。如果你在Deployment里配置的是`/tapj`，请访问 `http://localhost:8080/tapj/`。
2.  **文件位置不对**: `index.html` 必须放在 `src/main/webapp` 根目录下，**绝对不能**放在 `WEB-INF` 文件夹里（WEB-INF是受保护目录，浏览器无法直接访问）。
3.  **文件夹未标记**: 右键 `src/main/webapp` -> `将目录标记为` -> `Web资源根目录`。

---

### 问题 2: HTTP 500 - `NoClassDefFoundError: com/google/gson/GsonBuilder`
**现象**: 接口可以请求，但后台报错找不到Gson类。
**原因**: Maven依赖虽然导入了，但没有被复制到Tomcat的运行目录。
**解决方案**: 请严格按照上文 **「步骤 3. 配置 Artifacts」** 操作，确保Gson包在 `WEB-INF/lib` 列表里。

---

### 问题 3: Maven 依赖下载失败 / 右侧 Maven 面板看不到 Gson
**现象**: `pom.xml` 里有Gson，但Maven面板的Dependencies里是空的，或者有红色波浪线。
**原因**: `settings.xml` 未配置或配置错误，导致Maven连不上中央仓库。
**解决方案**: 请严格按照上文 **「步骤 2. 配置 Maven」** 操作，配置阿里云镜像源。

---

### 问题 4: HTTP 500 - `Abstract classes can't be instantiated! (User类)`
**现象**: 注册成功，但登录时报错。
**原因**: Gson在反序列化JSON时，试图直接`new User()`，但`User`被定义为了抽象类。
**解决方案**: 代码中已通过 `RuntimeTypeAdapterFactory` 解决。
1.  确保 `pom.xml` 中包含了 `gson-extras` 依赖。
2.  确保 `JsonUtil.java` 中正确注册了多态适配器。
3.  **注意**: 该类的导入包名可能是 `com.google.gson.typeadapters.RuntimeTypeAdapterFactory` 而不是 `org.danilopianini...`，请根据实际情况调整。

---

### 问题 5: 端口 8080 被占用
**现象**: 启动Tomcat时报错 `Port 8080 was already in use`。
**解决方案**:
1.  关掉其他正在运行的Tomcat或Java进程。
2.  或者在Tomcat配置的 `Server` 选项卡中，将 `HTTP port` 改为 `8081` 或其他未被占用的端口。

---

## 五、快速测试接口
环境跑通后，可以使用以下接口进行测试（使用Postman或浏览器）：

### 1. 注册TA
```
POST http://localhost:8080/tapj/user?action=registerTA
Params: username=test01&password=123456&realName=测试&email=test@qq.com&studentId=2026001&major=软件工程&education=本科&grade=2023
```

### 2. 登录
```
POST http://localhost:8080/tapj/user?action=login
Params: username=test01&password=123456
```

---

## 六、联系支持
如果按照本文档操作仍有问题，请查看群聊记录或联系负责环境配置的组员。