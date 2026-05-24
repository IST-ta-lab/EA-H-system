package com.qm.bupt.service;

import com.qm.bupt.dao.EmbeddingDAO;
import com.qm.bupt.entity.Job;
import com.qm.bupt.entity.TA;
import com.qm.bupt.dao.JobDAO;
import com.qm.bupt.dao.TADAO;

import java.util.*;

/**
 * Service for AI-powered job-TA and TA-job recommendations.
 *
 * <p>Uses cosine similarity on pre-computed vector embeddings to find the best
 * matches between TAs and job postings. Results are sorted by similarity score
 * and limited to a configurable top-K count.</p>
 */
public class RecommendService {

    private static final RecommendService INSTANCE = new RecommendService();

    private final EmbeddingDAO embeddingDAO;
    private final JobDAO jobDAO;
    private final TADAO taDAO;

    private RecommendService() {
        this.embeddingDAO = EmbeddingDAO.getInstance();
        this.jobDAO = JobDAO.getInstance();
        this.taDAO = TADAO.getInstance();
    }

    /**
     * Returns the singleton instance of RecommendService.
     */
    public static RecommendService getInstance() {
        return INSTANCE;
    }

    /**
     * Recommends job postings for a TA based on embedding similarity.
     *
     * @param taId the TA's user ID
     * @param topK the maximum number of recommendations to return
     * @return a list of RecommendResult sorted by score descending
     */
    public List<RecommendResult> recommendJobsForTA(String taId, int topK) {
        List<Double> taEmbedding = embeddingDAO.getTAEmbedding(taId);
        if (taEmbedding == null || taEmbedding.isEmpty()) {
            return new ArrayList<>();
        }

        List<Job> allJobs = jobDAO.listAll();
        List<RecommendResult> results = new ArrayList<>();

        for (Job job : allJobs) {
            List<Double> jobEmbedding = embeddingDAO.getJobEmbedding(job.getJobId());
            if (jobEmbedding == null || jobEmbedding.isEmpty()) {
                continue;
            }
            
            double similarity = cosineSimilarity(taEmbedding, jobEmbedding);
            results.add(new RecommendResult(job.getJobId(), job.getJobName(), similarity));
        }

        results.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));
        
        int limit = Math.min(topK, results.size());
        return results.subList(0, limit);
    }

    /**
     * Recommends TAs for a job posting based on embedding similarity.
     *
     * @param jobId the job ID
     * @param topK  the maximum number of recommendations to return
     * @return a list of RecommendResult sorted by score descending
     */
    public List<RecommendResult> recommendTAsForJob(String jobId, int topK) {
        List<Double> jobEmbedding = embeddingDAO.getJobEmbedding(jobId);
        if (jobEmbedding == null || jobEmbedding.isEmpty()) {
            return new ArrayList<>();
        }

        List<TA> allTAs = taDAO.listAll();
        List<RecommendResult> results = new ArrayList<>();

        for (TA ta : allTAs) {
            List<Double> taEmbedding = embeddingDAO.getTAEmbedding(ta.getUserId());
            if (taEmbedding == null || taEmbedding.isEmpty()) {
                continue;
            }
            
            double similarity = cosineSimilarity(jobEmbedding, taEmbedding);
            results.add(new RecommendResult(ta.getUserId(), ta.getRealName(), similarity));
        }

        results.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));
        
        int limit = Math.min(topK, results.size());
        return results.subList(0, limit);
    }

    /**
     * Computes cosine similarity between two vectors.
     *
     * @param vecA first vector
     * @param vecB second vector
     * @return cosine similarity score in [0, 1], or 0 if vectors differ in size or are zero-vectors
     */
    private double cosineSimilarity(List<Double> vecA, List<Double> vecB) {
        if (vecA.size() != vecB.size()) {
            return 0.0;
        }

        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (int i = 0; i < vecA.size(); i++) {
            dotProduct += vecA.get(i) * vecB.get(i);
            normA += vecA.get(i) * vecA.get(i);
            normB += vecB.get(i) * vecB.get(i);
        }

        normA = Math.sqrt(normA);
        normB = Math.sqrt(normB);

        if (normA == 0 || normB == 0) {
            return 0.0;
        }

        return dotProduct / (normA * normB);
    }

    /**
     * Result wrapper for a recommendation item.
     */
    public static class RecommendResult {
        private String id;
        private String name;
        private double score;

        public RecommendResult(String id, String name, double score) {
            this.id = id;
            this.name = name;
            this.score = score;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public double getScore() {
            return score;
        }

        public void setScore(double score) {
            this.score = score;
        }
    }
}