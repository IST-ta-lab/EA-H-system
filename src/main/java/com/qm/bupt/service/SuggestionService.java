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

/**
 * Service for generating AI-powered career suggestions for TAs.
 *
 * <p>Retrieves recommended jobs for a TA (via embedding or tag-matching fallback),
 * builds a structured prompt with the TA's profile and job matches, then calls
 * an OpenAI-compatible chat API to generate personalized advice.</p>
 */
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

    /**
     * Returns the singleton instance of SuggestionService.
     */
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
     * Generates AI-powered career suggestions for a TA based on recommended job positions.
     *
     * <p>Uses embedding-based recommendation first; falls back to tag matching
     * if no embeddings are available.</p>
     *
     * @param taId the TA's user ID
     * @return the AI-generated suggestion text
     * @throws Exception if the TA is not found or the AI API call fails
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
            return "No recommendation data available to generate suggestions. Please ensure your profile (self-introduction and tags) is complete and that there are active job postings in the system.";
        }

        String prompt = buildPrompt(ta, recommendedJobs, isTagFallback);
        return callAI(prompt);
    }

    /**
     * Tag-matching fallback: when embeddings are unavailable, rank jobs by
     * the intersection count of tags between the TA and each job posting.
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
        sb.append("You are a career advisor for university Teaching Assistant (TA) positions. Provide personalized job-seeking advice based on the student's profile and recommended positions.\n\n");

        // TA profile
        sb.append("## Student Profile\n");
        sb.append("- Name: ").append(nullToEmpty(ta.getRealName())).append("\n");
        sb.append("- Major: ").append(nullToEmpty(ta.getMajor())).append("\n");
        sb.append("- Education: ").append(nullToEmpty(ta.getEducation())).append("\n");
        sb.append("- Grade: ").append(nullToEmpty(ta.getGrade())).append("\n");
        if (ta.getSelfIntro() != null && !ta.getSelfIntro().isEmpty()) {
            sb.append("- Self Introduction: ").append(ta.getSelfIntro()).append("\n");
        }
        if (ta.getTags() != null && !ta.getTags().isEmpty()) {
            sb.append("- Skill Tags: ").append(String.join(", ", ta.getTags())).append("\n");
        }
        if (ta.getSkillIds() != null && !ta.getSkillIds().isEmpty()) {
            sb.append("- Skills: ").append(String.join(", ", ta.getSkillIds())).append("\n");
        }

        // Recommended jobs
        String matchLabel = isTagFallback ? "sorted by tag match (descending)" : "sorted by AI match score (descending)";
        sb.append("\n## Recommended Positions (").append(matchLabel).append(")\n");
        for (int i = 0; i < recommendedJobs.size(); i++) {
            RecommendResult result = recommendedJobs.get(i);
            Job job = jobDAO.getById(result.getId(), "jobId").orElse(null);
            sb.append("\n### ").append(i + 1).append(". ").append(result.getName());
            sb.append(" (Match: ").append(String.format("%.0f%%", result.getScore() * 100)).append(")\n");
            if (job != null) {
                if (job.getBelongModule() != null) {
                    sb.append("- Module: ").append(job.getBelongModule()).append("\n");
                }
                if (job.getJobDesc() != null) {
                    sb.append("- Description: ").append(job.getJobDesc()).append("\n");
                }
                if (job.getTags() != null && !job.getTags().isEmpty()) {
                    sb.append("- Required Skills: ").append(String.join(", ", job.getTags())).append("\n");
                }
                if (job.getWorkHoursWeekly() != null) {
                    sb.append("- Weekly Hours: ").append(job.getWorkHoursWeekly()).append(" hours\n");
                }
            }
        }

        sb.append("\nPlease provide the following advice (300-500 words in English):\n");
        sb.append("1. Overall assessment of the student's competitiveness\n");
        sb.append("2. Specific application preparation advice for the 1-2 best-matching positions\n");
        sb.append("3. Skills or areas the student should further improve\n");
        sb.append("Use a friendly and encouraging tone, addressing the student directly.\n");

        return sb.toString();
    }

    private String callAI(String prompt) throws Exception {
        JsonObject requestBody = new JsonObject();
        requestBody.addProperty("model", getModel());

        JsonArray messages = new JsonArray();

        JsonObject systemMsg = new JsonObject();
        systemMsg.addProperty("role", "system");
        systemMsg.addProperty("content", "You are a professional career advisor for university Teaching Assistant positions. Provide practical and actionable job-seeking advice.");
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
