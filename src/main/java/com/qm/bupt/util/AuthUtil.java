package com.qm.bupt.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

/**
 * Authentication utility providing password hashing and unique ID generation.
 *
 * <p>Uses MD5 for password encryption (suitable for educational projects)
 * and UUID for generating globally unique entity identifiers.</p>
 */
public class AuthUtil {

    // 私有构造，禁止实例化
    private AuthUtil() {
    }

    /**
     * Generates a globally unique UUID string (without hyphens).
     */
    public static String generateUUID() {
        return UUID.randomUUID().toString().replace("-", "");
    }

    /**
     * Encrypts a password using MD5 hashing.
     * Suitable for educational projects; production deployments should use BCrypt.
     */
    public static String md5Encrypt(String password) {
        if (password == null || password.isEmpty()) {
            return "";
        }
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] bytes = md.digest(password.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    sb.append('0');
                }
                sb.append(hex);
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5加密失败", e);
        }
    }
}