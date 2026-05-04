package com.qm.bupt.servlet;

import com.qm.bupt.entity.TA;
import com.qm.bupt.entity.User;
import com.qm.bupt.service.SuggestionService;
import com.qm.bupt.util.Result;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebServlet("/suggestion")
public class SuggestionServlet extends BaseServlet {

    private final SuggestionService suggestionService = SuggestionService.getInstance();

    /**
     * 为TA生成AI建议
     * GET /suggestion?action=generateForTA&taId=xxx
     * taId可选，默认使用当前登录用户
     */
    public void generateForTA(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            writeJson(response, Result.error(401, "未登录"));
            return;
        }

        String taId = request.getParameter("taId");
        if (taId == null || taId.isEmpty()) {
            taId = loginUser.getUserId();
        }

        if (!(loginUser instanceof TA) && !taId.equals(loginUser.getUserId())) {
            writeJson(response, Result.error(403, "仅TA用户可生成建议"));
            return;
        }

        try {
            String suggestion = suggestionService.generateSuggestion(taId);
            writeJson(response, Result.success(suggestion));
        } catch (IllegalArgumentException e) {
            writeJson(response, Result.error(404, e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            writeJson(response, Result.error(500, "AI建议生成失败：" + e.getMessage()));
        }
    }
}
