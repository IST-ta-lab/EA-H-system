Java Web项目（Tomcat+Maven）运行与开发指导手册

一、手册说明

本手册适配项目结构：项目根目录下包含 pom.xml 和 src 文件夹，src 内有 java（代码）和 webapp（HTML页面），使用 Tomcat 服务器部署，Maven 打包，解决项目启动、代码修改、部署生效等全流程问题。

核心目标：帮助快速完成项目启动、代码修改、重新部署，避免缓存、配置错误等常见问题。

二、前置准备（已完成，供后续参考）

2.1 环境配置

- 安装 Tomcat 10+（解压至指定路径，如 D:\apache-tomcat-10.1.53）

- VSCode 安装插件：Community Server Connectors、Tomcat for Java

- 配置 VSCode 中的 Tomcat：左侧“服务器”面板 → 点击“+” → 选择解压的 Tomcat 路径

- 确保 pom.xml 配置正确（关键配置：<packaging>war</packaging>，依赖完整）

2.2 项目结构确认（正确结构）

项目根目录/
├── pom.xml          （项目配置文件，Maven 核心配置）
├── src/
│   ├── java/        （核心代码：Servlet、DAO等，如example、qm文件夹）
│   └── webapp/      （静态页面：HTML文件，如index.html、main.html）
└── target/          （Maven打包后自动生成，含war包）

三、Maven 配置手册（新增）

Maven 是项目打包、依赖管理的核心工具，本章节详细说明本项目专属的 Maven 配置（贴合你的 JDK 版本、项目结构），直接复制使用即可，无需额外修改。

3.1 核心配置（pom.xml 完整代码）

替换你项目根目录下的 pom.xml 全部内容，无需修改任何参数，直接适配你的项目：

<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!-- 项目基本信息（无需修改） -->
    <groupId>com.example</groupId>
    <artifactId>tapj</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war&lt;/packaging&gt;  <!-- 关键：打包为war包，适配Tomcat部署 -->
    <name>tapj</name>
    <description>Java Web项目（Tomcat+Maven）</description>

    <!-- 仓库配置：阿里云仓库，解决国内下载慢问题 -->
    <repositories>
        <repository>
            <id>aliyunmaven</id>
            <name>阿里云公共仓库</name>
            <url>https://maven.aliyun.com/repository/public</url>
            <releases>
                <enabled>true</enabled>
            </releases>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </repository>
    </repositories>

    <!-- 插件仓库：同步阿里云，避免插件下载失败 -->
    <pluginRepositories>
        <pluginRepository>
            <id>aliyunmaven</id>
            <name>阿里云插件仓库</name>
            <url>https://maven.aliyun.com/repository/public</url>
            <releases>
                <enabled>true</enabled>
            </releases>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </pluginRepository>
    </pluginRepositories>

    <!-- 依赖配置（核心，无需修改） -->
    <dependencies>
        <!-- Servlet API 依赖：适配Tomcat，无需手动导入jar包 -->
        <dependency>
            <groupId>jakarta.servlet</groupId>
            <artifactId>jakarta.servlet-api</artifactId>
            <version>5.0.0</version>
            &lt;scope&gt;provided&lt;/scope&gt;  <!-- 由Tomcat提供，避免冲突 -->
        </dependency>
        <!-- 若需其他依赖（如Gson），可在此处添加 -->
        <dependency>
            <groupId>com.google.code.gson</groupId>
            <artifactId>gson</artifactId>
            <version>2.10.1</version>
        </dependency>
    </dependencies>

    <!-- 构建配置：编译版本、输出名称 -->
    <build>
        &lt;finalName&gt;tapj&lt;/finalName&gt;  <!-- 打包后war包名称，与项目部署前缀一致 -->
        <plugins>
            <!-- JDK编译配置：适配你的JDK版本（自动兼容JDK8及以上） -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <source&gt;1.8&lt;/source&gt;  <!-- 若用JDK17，改为17，无需其他修改 -->
                    &lt;target&gt;1.8&lt;/target&gt;  <!-- 与source一致即可 -->
                    &lt;encoding&gt;UTF-8&lt;/encoding&gt;  <!-- 避免中文乱码 -->
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>

3.2 配置说明（关键重点）

- <packaging>war</packaging>：核心配置，指定打包为 war 包，适配 Tomcat 部署，解决“无法生成 war 包”的问题。

- 阿里云仓库：解决国内 Maven 下载慢、依赖失败的问题，无需手动配置代理。

- JDK 版本：默认适配 JDK8（最常用），若你用 JDK11/17，只需修改 <source> 和 <target> 为对应版本（如 11/17），其余无需改动。

- 依赖说明：已包含 Servlet API（适配 Tomcat 10）、Gson（与你项目原有依赖一致），可直接使用，无需额外添加。

3.3 Maven 打包操作步骤

1. 打开 VSCode，确保已打开项目根目录（包含 pom.xml 和 src）。

2. 左侧打开“Maven”面板（若未显示，点击 VSCode 左侧“活动栏”的 Maven 图标）。

3. 找到你的项目（显示为 com.example:tapj:1.0-SNAPSHOT），展开后点击“Lifecycle”。

4. 双击 package，等待控制台显示 BUILD SUCCESS，即打包完成（生成 target/tapj.war）。

3.4 常见 Maven 报错解决

- 报错“无法找到 JDK”：打开 VSCode 设置 → 搜索 java.configuration.runtimes，添加你的 JDK 路径（如 C:\Program Files\Java\jdk-1.8）。

- 报错“依赖下载失败”：检查网络，重新双击 package（阿里云仓库会自动重试下载）。

- 报错“打包失败”：确认 pom.xml 未修改，删除 target 文件夹后重新打包。

四、核心操作流程

4.1 首次启动项目（已完成）

1. 确认 pom.xml 已替换为上述完整配置。

2. Maven 打包：双击 package 生成 war 包。

3. VSCode 左侧“服务器”面板 → 右键 Tomcat → 选择 target/tapj.war 部署。

4. 启动 Tomcat，浏览器访问对应页面。

4.2 修改代码/页面后，重新部署流程（关键！）

1. 停止 Tomcat：VSCode 左侧 → 右键 Tomcat → Stop Server。

2. 清理旧文件：删除 target 文件夹、Tomcat/webapps 下的 tapj 文件夹和 tapj.war。

3. 重新打包：Maven 面板 → 双击 package，生成新的 war 包。

4. 重新部署：Tomcat 面板 → Add Deployment → 选择新生成的 tapj.war。

5. 启动 Tomcat，浏览器按 Ctrl + F5 强制刷新，查看修改效果。

4.3 项目停止方法（3种，任选其一）

1. 方法1（最直接）：关闭 Tomcat 启动的黑色命令行窗口。

2. 方法2（最稳妥）：任务管理器 → 找到“Java Platform SE Binary” → 结束任务。

3. 方法3（最规范）：VSCode 左侧 → 右键 Tomcat → Stop Server。

五、常见问题及解决方案

5.1 问题1：修改HTML/代码后，页面不更新

原因：浏览器缓存、Tomcat 未加载新文件、打包未包含修改内容。

解决方案：

- 浏览器按 Ctrl + F5 强制刷新，清除缓存。

- 按 4.2 流程重新打包、部署，确保 target 文件夹被重新生成。

- 确认修改的文件在 src/webapp/ 下（HTML）或src/java/ 下（代码）。

5.2 问题2：跳转页面无法跳转/跳转异常

原因：跳转路径未加项目前缀 /tapj。

解决方案：

- HTML 跳转：href="/tapj/main.html"（而非 href="main.html"）。

- Servlet 重定向：response.sendRedirect("/tapj/main.html")。

5.3 问题3：报错“Failed to retrieve default libraries for C:\Program Files\Java\jdk-21”

原因：VSCode 中 JDK 路径配置错误，与 pom.xml 中 JDK 版本不匹配。

解决方案：

- VSCode 按 Ctrl + , 打开设置 → 搜索 java.configuration.runtimes。

- 添加你的 JDK 路径（如 C:\Program Files\Java\jdk-1.8），删除错误的 JDK21 路径。

- 重启 VSCode，重新打包部署。

5.4 问题4：重启电脑后，仍能访问页面

原因：Tomcat 自动启动，且 webapps 下仍有 tapj 解压文件夹。

解决方案：删除 Tomcat/webapps 下的 tapj 文件夹和 tapj.war，重启电脑即可。

5.5 问题5：Add Deployment 无法选择 war 包

原因：未生成 war 包，或路径选择错误。

解决方案：重新执行 Maven package，找到 target/tapj.war，直接选择该文件即可。

六、注意事项

- 所有 HTML 页面必须放在 src/main/webapp/ 下，否则 Maven 打包不会包含，修改后无法生效。

- 每次修改代码/页面后，必须按 4.2 流程重新打包、部署，跳过任何一步都可能导致修改不生效。

- Tomcat 启动后，需等待日志显示“部署完成”再访问页面，避免因部署延迟导致访问失败。

- 项目访问路径固定为 http://localhost:8080/tapj/xxx，不可省略 /tapj 前缀。

- 若需修改 JDK 版本，只需修改 pom.xml 中 <source> 和 <target> 的版本号，无需修改其他配置。

七、总结

核心流程口诀：改代码 → 停服务 → 清旧文件 → 重新打包 → 删旧部署 → 加新war → 启服务 → 强刷新。

本手册覆盖 Maven 配置、项目部署、问题排查全场景，按步骤操作即可确保项目正常运行，可反复参考使用。

理想的运行环境：左侧边栏有项目，servers栏，javaprojects栏和maven栏，其中servers用于创建新tomcat，需要每次启动或停止，从maven打包的target文件夹，war文件读取。

注：由于vscode配件环境不稳定，导致tomcat每次读取新war文件极其不稳定，不建议使用vscode进行该项目。