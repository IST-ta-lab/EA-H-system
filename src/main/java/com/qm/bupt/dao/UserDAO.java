package com.qm.bupt.dao;

import com.qm.bupt.entity.User;
import jakarta.servlet.ServletContext;

/**
 * 用户数据访问层
 */
public class UserDAO extends BaseDAO<User> {

    // 单例实例
    private static final UserDAO INSTANCE = new UserDAO();
    // 数据文件存储路径（WEB-INF/data/user.json，受保护目录）
    private String filePath;

    // 私有构造，单例模式
    private UserDAO() {
    }

    // 获取单例
    public static UserDAO getInstance() {
        return INSTANCE;
    }

    // 初始化文件路径（必须在Servlet初始化时调用，传入ServletContext）
    public void init(ServletContext context) {
        this.filePath = context.getRealPath("/WEB-INF/data/user.json");
    }

    @Override
    protected String getFilePath() {
        return filePath;
    }

    @Override
    protected Class<User> getEntityClass() {
        return User.class;
    }
}