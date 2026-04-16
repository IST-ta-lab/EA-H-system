package com.qm.bupt.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class EmbeddingService {

    private static final String EMBEDDING_API_URL = "https://ai.gitee.com/v1/embeddings";
    private static final String API_TOKEN = "PLGPQO7Z8JBDBWA7Z8N2C0M5BVIKKAZXPPLCAXMP";
    private static final String MODEL_NAME = "bge-m3";

    private static final EmbeddingService INSTANCE = new EmbeddingService();

    private final CloseableHttpClient httpClient;
    private final Gson gson;

    private EmbeddingService() {
        this.httpClient = HttpClients.createDefault();
        this.gson = new Gson();
    }

    public static EmbeddingService getInstance() {
        return INSTANCE;
    }

    public List<Double> generateEmbedding(String text) throws Exception {
        JsonObject requestBody = new JsonObject();
        requestBody.addProperty("model", MODEL_NAME);
        requestBody.addProperty("input", text);

        HttpPost httpPost = new HttpPost(EMBEDDING_API_URL);
        httpPost.setHeader("Authorization", "Bearer " + API_TOKEN);
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
}