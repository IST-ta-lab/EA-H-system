package com.qm.bupt.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.qm.bupt.dao.EmbeddingDAO;
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
 * Service for generating and managing vector embeddings using an external AI API.
 *
 * <p>Builds text representations from TA profiles or job descriptions, calls an
 * embedding API (bge-m3 model), and stores the resulting vectors via EmbeddingDAO.
 * These embeddings are used by RecommendService for similarity-based matching.</p>
 */
public class EmbeddingService {

    private static final String EMBEDDING_API_URL = "https://ai.gitee.com/v1/embeddings";
    private static final String API_TOKEN_KEY = "EMBEDDING_API_TOKEN";
    private static final String MODEL_NAME = "bge-m3";

    private static final EmbeddingService INSTANCE = new EmbeddingService();

    private final CloseableHttpClient httpClient;
    private final Gson gson;

    private EmbeddingService() {
        this.httpClient = HttpClients.createDefault();
        this.gson = new Gson();
    }

    /**
     * Returns the singleton instance of EmbeddingService.
     */
    public static EmbeddingService getInstance() {
        return INSTANCE;
    }

    /**
     * Retrieves the embedding API token from config or environment variables.
     */
    private String getApiToken() {
        String token = ConfigUtil.get(API_TOKEN_KEY);
        if (token == null || token.isEmpty()) {
            throw new RuntimeException("Embedding API token not configured. Set environment variable EMBEDDING_API_TOKEN or create config.properties with embedding.api.token");
        }
        return token;
    }

    /**
     * Calls the external embedding API to generate a vector for the given text.
     *
     * @param text the input text to embed
     * @return the embedding vector as a list of doubles
     * @throws Exception if the API call fails or returns no data
     */
    public List<Double> generateEmbedding(String text) throws Exception {
        JsonObject requestBody = new JsonObject();
        requestBody.addProperty("model", MODEL_NAME);
        requestBody.addProperty("input", text);

        HttpPost httpPost = new HttpPost(EMBEDDING_API_URL);
        httpPost.setHeader("Authorization", "Bearer " + getApiToken());
        httpPost.setHeader("Content-Type", "application/json");
        httpPost.setEntity(new StringEntity(gson.toJson(requestBody), StandardCharsets.UTF_8));

        try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
            String responseBody = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
            
            if (response.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("Embedding API error: " + responseBody);
            }

            JsonObject jsonResponse = gson.fromJson(responseBody, JsonObject.class);
            JsonArray dataArray = jsonResponse.getAsJsonArray("data");
            
            if (dataArray == null || dataArray.size() == 0) {
                throw new RuntimeException("No embedding returned from API");
            }

            JsonArray embeddingArray = dataArray.get(0).getAsJsonObject().getAsJsonArray("embedding");
            List<Double> embedding = new ArrayList<>();
            for (int i = 0; i < embeddingArray.size(); i++) {
                embedding.add(embeddingArray.get(i).getAsDouble());
            }
            return embedding;
        }
    }

    /**
     * Builds a text representation of a TA profile for embedding.
     *
     * @param selfIntro the TA's self introduction
     * @param tags      the TA's skill tags
     * @return concatenated text for embedding generation
     */
    public String buildTAText(String selfIntro, List<String> tags) {
        StringBuilder sb = new StringBuilder();
        if (selfIntro != null && !selfIntro.isEmpty()) {
            sb.append(selfIntro);
        }
        if (tags != null && !tags.isEmpty()) {
            if (sb.length() > 0) {
                sb.append(" | ");
            }
            sb.append("Skills: ");
            sb.append(String.join(", ", tags));
        }
        return sb.toString();
    }

    /**
     * Builds a text representation of a job posting for embedding.
     *
     * @param jobName the job title
     * @param jobDesc the job description
     * @param tags    the job's required skill tags
     * @return concatenated text for embedding generation
     */
    public String buildJobText(String jobName, String jobDesc, List<String> tags) {
        StringBuilder sb = new StringBuilder();
        if (jobName != null && !jobName.isEmpty()) {
            sb.append(jobName);
        }
        if (jobDesc != null && !jobDesc.isEmpty()) {
            if (sb.length() > 0) {
                sb.append(" | ");
            }
            sb.append(jobDesc);
        }
        if (tags != null && !tags.isEmpty()) {
            if (sb.length() > 0) {
                sb.append(" | ");
            }
            sb.append("Required Skills: ");
            sb.append(String.join(", ", tags));
        }
        return sb.toString();
    }

    /**
     * Persists a TA's embedding vector.
     */
    public void saveTAEmbedding(String taId, List<Double> embedding) {
        EmbeddingDAO.getInstance().saveTAEmbedding(taId, embedding);
    }

    /**
     * Persists a job's embedding vector.
     */
    public void saveJobEmbedding(String jobId, List<Double> embedding) {
        EmbeddingDAO.getInstance().saveJobEmbedding(jobId, embedding);
    }
}