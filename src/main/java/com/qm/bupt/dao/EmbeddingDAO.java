package com.qm.bupt.dao;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.qm.bupt.util.FileUtil;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Data access object for vector embeddings used in AI-powered recommendation.
 *
 * <p>Manages persistence of TA and job embeddings to separate JSON files.
 * Embeddings are stored as Map&lt;String, List&lt;Double&gt;&gt; keyed by entity ID.
 * Provides CRUD operations for both TA and job embedding data.</p>
 */
public class EmbeddingDAO {

    private static final Object LOCK = new Object();
    private static final Gson gson = new Gson();

    private String taEmbeddingFilePath;
    private String jobEmbeddingFilePath;

    private static final EmbeddingDAO INSTANCE = new EmbeddingDAO();

    private EmbeddingDAO() {
    }

    /**
     * Returns the singleton instance of EmbeddingDAO.
     */
    public static EmbeddingDAO getInstance() {
        return INSTANCE;
    }

    /**
     * Initializes file paths for TA and job embedding data.
     *
     * @param taFilePath  the file path for TA embeddings
     * @param jobFilePath the file path for job embeddings
     */
    public void init(String taFilePath, String jobFilePath) {
        this.taEmbeddingFilePath = taFilePath;
        this.jobEmbeddingFilePath = jobFilePath;
    }

    /**
     * Saves or updates a TA's embedding vector.
     *
     * @param taId      the TA's unique identifier
     * @param embedding the embedding vector as a list of doubles
     * @return true if successful, false on I/O error
     */
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

    /**
     * Saves or updates a job's embedding vector.
     *
     * @param jobId     the job's unique identifier
     * @param embedding the embedding vector as a list of doubles
     * @return true if successful, false on I/O error
     */
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

    /**
     * Retrieves a TA's embedding vector.
     *
     * @param taId the TA's unique identifier
     * @return the embedding vector, or null if not found
     */
    public List<Double> getTAEmbedding(String taId) {
        Map<String, List<Double>> embeddings = loadTAEmbeddings();
        return embeddings.get(taId);
    }

    /**
     * Retrieves a job's embedding vector.
     *
     * @param jobId the job's unique identifier
     * @return the embedding vector, or null if not found
     */
    public List<Double> getJobEmbedding(String jobId) {
        Map<String, List<Double>> embeddings = loadJobEmbeddings();
        return embeddings.get(jobId);
    }

    /**
     * Loads all TA embeddings from the data file.
     *
     * @return a map of TA ID to embedding vector, or an empty map if none exist
     */
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

    /**
     * Loads all job embeddings from the data file.
     *
     * @return a map of job ID to embedding vector, or an empty map if none exist
     */
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

    /**
     * Deletes a TA's embedding vector.
     *
     * @param taId the TA's unique identifier
     * @return true if successful, false on I/O error
     */
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

    /**
     * Deletes a job's embedding vector.
     *
     * @param jobId the job's unique identifier
     * @return true if successful, false on I/O error
     */
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