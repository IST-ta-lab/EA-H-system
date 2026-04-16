package com.qm.bupt.dao;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.qm.bupt.util.FileUtil;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EmbeddingDAO {

    private static final Object LOCK = new Object();
    private static final Gson gson = new Gson();

    private String taEmbeddingFilePath;
    private String jobEmbeddingFilePath;

    private static final EmbeddingDAO INSTANCE = new EmbeddingDAO();

    private EmbeddingDAO() {
    }

    public static EmbeddingDAO getInstance() {
        return INSTANCE;
    }

    public void init(String taFilePath, String jobFilePath) {
        this.taEmbeddingFilePath = taFilePath;
        this.jobEmbeddingFilePath = jobFilePath;
    }

    public boolean saveTAEmbedding(String taId, List<Double> embedding) {
        synchronized (LOCK) {
            try {
                Map<String, List<Double>> embeddings = loadTAEmbeddings();
                embeddings.put(taId, embedding);
                String json = gson.toJson(embeddings);
                FileUtil.writeFile(taEmbeddingFilePath, json);
                return true;
            } catch (IOException e) {
                e.printStackTrace();
                return false;
            }
        }
    }

    public boolean saveJobEmbedding(String jobId, List<Double> embedding) {
        synchronized (LOCK) {
            try {
                Map<String, List<Double>> embeddings = loadJobEmbeddings();
                embeddings.put(jobId, embedding);
                String json = gson.toJson(embeddings);
                FileUtil.writeFile(jobEmbeddingFilePath, json);
                return true;
            } catch (IOException e) {
                e.printStackTrace();
                return false;
            }
        }
    }

    public List<Double> getTAEmbedding(String taId) {
        Map<String, List<Double>> embeddings = loadTAEmbeddings();
        return embeddings.get(taId);
    }

    public List<Double> getJobEmbedding(String jobId) {
        Map<String, List<Double>> embeddings = loadJobEmbeddings();
        return embeddings.get(jobId);
    }

    public Map<String, List<Double>> loadTAEmbeddings() {
        synchronized (LOCK) {
            try {
                String json = FileUtil.readFile(taEmbeddingFilePath);
                if (json == null || json.isEmpty()) {
                    return new HashMap<>();
                }
                return gson.fromJson(json, Map.class);
            } catch (IOException e) {
                e.printStackTrace();
                return new HashMap<>();
            }
        }
    }

    public Map<String, List<Double>> loadJobEmbeddings() {
        synchronized (LOCK) {
            try {
                String json = FileUtil.readFile(jobEmbeddingFilePath);
                if (json == null || json.isEmpty()) {
                    return new HashMap<>();
                }
                return gson.fromJson(json, Map.class);
            } catch (IOException e) {
                e.printStackTrace();
                return new HashMap<>();
            }
        }
    }

    public boolean deleteTAEmbedding(String taId) {
        synchronized (LOCK) {
            try {
                Map<String, List<Double>> embeddings = loadTAEmbeddings();
                embeddings.remove(taId);
                String json = gson.toJson(embeddings);
                FileUtil.writeFile(taEmbeddingFilePath, json);
                return true;
            } catch (IOException e) {
                e.printStackTrace();
                return false;
            }
        }
    }

    public boolean deleteJobEmbedding(String jobId) {
        synchronized (LOCK) {
            try {
                Map<String, List<Double>> embeddings = loadJobEmbeddings();
                embeddings.remove(jobId);
                String json = gson.toJson(embeddings);
                FileUtil.writeFile(jobEmbeddingFilePath, json);
                return true;
            } catch (IOException e) {
                e.printStackTrace();
                return false;
            }
        }
    }
}