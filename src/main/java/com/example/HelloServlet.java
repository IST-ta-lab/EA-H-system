package com.example;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

// 注解配置访问路径，浏览器访问 /hello 就能触发这个Servlet
@WebServlet("/hello")
public class HelloServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 设置响应编码，避免中文乱码
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        // 输出到浏览器的内容
        out.println("<h1>✅ 服务启动成功！这是你的第一个Servlet</h1>");
        out.println("<p>项目配置完全正常</p>");
    }
}