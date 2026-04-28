package com.qm.bupt.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.qm.bupt.dao.JobDAO;
import com.qm.bupt.dao.TADAO;
import com.qm.bupt.entity.Job;
import com.qm.bupt.entity.TA;
import com.qm.bupt.service.RecommendService.RecommendResult;
import com.qm.bupt.util.ConfigUtil;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class SuggestionService {

    private static final String DEFAULT_API_URL = "https://api.openai.com/v1/chat/completions";
    private static final String DEFAULT_MODEL = "gpt-3.5-turbo";

    private static final SuggestionService INSTANCE = new SuggestionService();

    private final RecommendService recommendService;
    private final JobDAO jobDAO;
    private final TADAO taDAO;
    private final CloseableHttpClient httpClient;
    private final Gson gson;

    private SuggestionService() {
        this.recommendService = RecommendService.getInstance();
        this.jobDAO = JobDAO.getInstance();
        this.taDAO = TADAO.getInstance();
        this.httpClient = HttpClients.createDefault();
        this.gson = new Gson();
    }

    public static SuggestionService getInstance() {
        return INSTANCE;
    }

    private String getApiUrl() {
        return ConfigUtil.get("AI_API_URL", DEFAULT_API_URL);
    }

    private String getApiToken() {
        String token = ConfigUtil.get("AI_API_TOKEN");
        if (token == null || token.isEmpty()) {
            throw new RuntimeException("AI_API_TOKEN not configured. Set environment variable or config.properties");
        }
        return token;
    }

    private String getModel() {
        return ConfigUtil.get("AI_API_MODEL", DEFAULT_MODEL);
    }

    /**
     * 为TA生成AI建议，基于其被推荐的岗位
     */
    public String generateSuggestion(String taId) throws Exception {
        TA ta = taDAO.getById(taId, "userId").orElse(null);
        if (ta == null) {
            throw new IllegalArgumentException("TA not found: " + taId);
        }

        // 优先使用嵌入向量推荐，无结果时回退到标签匹配
        List<RecommendResult> recommendedJobs = recommendService.recommendJobsForTA(taId, 5);
        boolean isTagFallback = false;
        if (recommendedJobs.isEmpty()) {
            recommendedJobs = recommendByTagMatch(ta, 5);
            isTagFallback = true;
        }

        if (recommendedJobs.isEmpty()) {
            return "当前没有足够的推荐数据来生成建议。请确保你已完善个人资料（个人简介和标签），且系统中存在招聘岗位。";
        }

        String prompt = buildPrompt(ta, recommendedJobs, isTagFallback);
        return callAI(prompt);
    }

    /**
     * 标签匹配回退：当嵌入向量不存在时，用TA与Job的标签交集数量排序
     */
    private List<RecommendResult> recommendByTagMatch(TA ta, int topK) {
        List<String> taTags = ta.getTags();
        if (taTags == null || taTags.isEmpty()) {
            return new ArrayList<>();
        }

        List<String> lowerTaTags = new ArrayList<>();
        for (String tag : taTags) {
            lowerTaTags.add(tag.toLowerCase().trim());
        }

        List<Job> allJobs = jobDAO.listAll();
        List<RecommendResult> results = new ArrayList<>();

        for (Job job : allJobs) {
            List<String> jobTags = job.getTags();
            if (jobTags == null || jobTags.isEmpty()) {
                continue;
            }
            int matchCount = 0;
            for (String jt : jobTags) {
                if (lowerTaTags.contains(jt.toLowerCase().trim())) {
                    matchCount++;
                }
            }
            if (matchCount > 0) {
                double score = (double) matchCount / Math.max(jobTags.size(), taTags.size());
                results.add(new RecommendResult(job.getJobId(), job.getJobName(), score));
            }
        }

        results.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));
        int limit = Math.min(topK, results.size());
        return results.subList(0, limit);
    }

    private String buildPrompt(TA ta, List<RecommendResult> recommendedJobs, boolean isTagFallback) {
        StringBuilder sb = new StringBuilder();
        sb.append("你是一位大学生助教（TA）岗位的职业顾问。请根据以下学生信息和推荐岗位，为该学生提供个性化的求职建议。\n\n");

        // TA profile
        sb.append("## 学生信息\n");
        sb.append("- 姓名：").append(nullToEmpty(ta.getRealName())).append("\n");
        sb.append("- 专业：").append(nullToEmpty(ta.getMajor())).append("\n");
        sb.append("- 学历：").append(nullToEmpty(ta.getEducation())).append("\n");
        sb.append("- 年级：").append(nullToEmpty(ta.getGrade())).append("\n");
        if (ta.getSelfIntro() != null && !ta.getSelfIntro().isEmpty()) {
            sb.append("- 个人简介：").append(ta.getSelfIntro()).append("\n");
        }
        if (ta.getTags() != null && !ta.getTags().isEmpty()) {
            sb.append("- 技能标签：").append(String.join("、", ta.getTags())).append("\n");
        }
        if (ta.getSkillIds() != null && !ta.getSkillIds().isEmpty()) {
            sb.append("- 技能：").append(String.join("、", ta.getSkillIds())).append("\n");
        }

        // Recommended jobs
        String matchLabel = isTagFallback ? "按标签匹配度降序" : "按AI匹配度降序";
        sb.append("\n## 推荐的岗位（").append(matchLabel).append("）\n");
        for (int i = 0; i < recommendedJobs.size(); i++) {
            RecommendResult result = recommendedJobs.get(i);
            Job job = jobDAO.getById(result.getId(), "jobId").orElse(null);
            sb.append("\n### ").append(i + 1).append(". ").append(result.getName());
            sb.append("（匹配度：").append(String.format("%.0f%%", result.getScore() * 100)).append("）\n");
            if (job != null) {
                if (job.getBelongModule() != null) {
                    sb.append("- 所属模块：").append(job.getBelongModule()).append("\n");
                }
                if (job.getJobDesc() != null) {
                    sb.append("- 岗位描述：").append(job.getJobDesc()).append("\n");
                }
                if (job.getTags() != null && !job.getTags().isEmpty()) {
                    sb.append("- 要求技能：").append(String.join("、", job.getTags())).append("\n");
                }
                if (job.getWorkHoursWeekly() != null) {
                    sb.append("- 每周工时：").append(job.getWorkHoursWeekly()).append("小时\n");
                }
            }
        }

        sb.append("\n请给出以下建议（使用中文，共300-500字）：\n");
        sb.append("1. 综合评估该学生的竞争力\n");
        sb.append("2. 针对最匹配的1-2个岗位，给出具体的申请准备建议\n");
        sb.append("3. 指出学生还需提升的技能或方向\n");
        sb.append("请使用友好的语气，直接给出建议内容，不要称呼「学生」或「你」，用「同学你」代替。");

        return sb.toString();
    }

    private String callAI(String prompt) throws Exception {
        JsonObject requestBody = new JsonObject();
        requestBody.addProperty("model", getModel());

        JsonArray messages = new JsonArray();

        JsonObject systemMsg = new JsonObject();
        systemMsg.addProperty("role", "system");
        systemMsg.addProperty("content", "你是一位专业的大学生助教岗位职业顾问，提供中肯、实用的求职建议。");
        messages.add(systemMsg);

        JsonObject userMsg = new JsonObject();
        userMsg.addProperty("role", "user");
        userMsg.addProperty("content", prompt);
        messages.add(userMsg);

        requestBody.add("messages", messages);
        requestBody.addProperty("temperature", 0.7);
        requestBody.addProperty("max_tokens", 800);

        HttpPost httpPost = new HttpPost(getApiUrl());
        httpPost.setHeader("Authorization", "Bearer " + getApiToken());
        httpPost.setHeader("Content-Type", "application/json");
        httpPost.setEntity(new StringEntity(gson.toJson(requestBody), StandardCharsets.UTF_8));

        try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
            String responseBody = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);

            if (response.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("AI API error (HTTP " + response.getStatusLine().getStatusCode() + "): " + responseBody);
            }

            JsonObject jsonResponse = gson.fromJson(responseBody, JsonObject.class);
            JsonArray choices = jsonResponse.getAsJsonArray("choices");
            if (choices == null || choices.size() == 0) {
                throw new RuntimeException("AI API returned no choices");
            }

            return choices.get(0).getAsJsonObject()
                    .getAsJsonObject("message")
                    .get("content").getAsString();
        }
    }

    private String nullToEmpty(String s) {
        return s == null ? "" : s;
    }
}
