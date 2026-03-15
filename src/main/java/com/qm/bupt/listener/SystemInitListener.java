package com.qm.bupt.listener;

import com.qm.bupt.dao.*;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

/**
 * 系统初始化监听器，项目启动时初始化DAO文件路径
 */
@WebListener
public class SystemInitListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("===== 系统启动，初始化DAO层 =====");
        // 初始化所有DAO的文件路径
        ServletContext context = sce.getServletContext();
        UserDAO.getInstance().init(context);
        TADAO.getInstance().init(context);
        MODAO.getInstance().init(context);
        JobDAO.getInstance().init(context);
        ApplicationDAO.getInstance().init(context);
        System.out.println("===== DAO层初始化完成 =====");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("===== 系统关闭 =====");
    }
}