package com.qm.bupt.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("AuthUtil Unit Tests")
public class AuthUtilTest {

    // ===== MD5 Encrypt: Black-box (Equivalence Partition + Boundary) =====

    @Test
    @DisplayName("md5Encrypt: normal password returns 32-char hex string")
    void md5Encrypt_normalPassword_returns32CharHex() {
        String result = AuthUtil.md5Encrypt("password123");
        assertNotNull(result);
        assertEquals(32, result.length());
        assertTrue(result.matches("[0-9a-f]{32}"), "Should be lowercase hex");
    }

    @Test
    @DisplayName("md5Encrypt: empty string returns empty string")
    void md5Encrypt_emptyString_returnsEmpty() {
        String result = AuthUtil.md5Encrypt("");
        assertEquals("", result);
    }

    @Test
    @DisplayName("md5Encrypt: null returns empty string")
    void md5Encrypt_null_returnsEmpty() {
        String result = AuthUtil.md5Encrypt(null);
        assertEquals("", result);
    }

    @Test
    @DisplayName("md5Encrypt: same password twice produces same hash (deterministic)")
    void md5Encrypt_samePasswordTwice_sameHash() {
        String hash1 = AuthUtil.md5Encrypt("testPassword");
        String hash2 = AuthUtil.md5Encrypt("testPassword");
        assertEquals(hash1, hash2);
    }

    @Test
    @DisplayName("md5Encrypt: different passwords produce different hashes")
    void md5Encrypt_differentPasswords_differentHashes() {
        String hash1 = AuthUtil.md5Encrypt("password1");
        String hash2 = AuthUtil.md5Encrypt("password2");
        assertNotEquals(hash1, hash2);
    }

    @Test
    @DisplayName("md5Encrypt: Chinese characters handled correctly")
    void md5Encrypt_chineseCharacters_returns32CharHex() {
        String result = AuthUtil.md5Encrypt("你好世界");
        assertNotNull(result);
        assertEquals(32, result.length());
        assertTrue(result.matches("[0-9a-f]{32}"));
    }

    @Test
    @DisplayName("md5Encrypt: emoji handled correctly")
    void md5Encrypt_emoji_returns32CharHex() {
        String result = AuthUtil.md5Encrypt("😀🎉🚀");
        assertNotNull(result);
        assertEquals(32, result.length());
        assertTrue(result.matches("[0-9a-f]{32}"));
    }

    @Test
    @DisplayName("md5Encrypt: spaces handled correctly")
    void md5Encrypt_spaces_returns32CharHex() {
        String result = AuthUtil.md5Encrypt("  hello world  ");
        assertNotNull(result);
        assertEquals(32, result.length());
        assertTrue(result.matches("[0-9a-f]{32}"));
    }

    @Test
    @DisplayName("md5Encrypt: very long password (1000 chars) returns 32-char hex")
    void md5Encrypt_veryLongPassword_returns32CharHex() {
        StringBuilder sb = new StringBuilder(1000);
        for (int i = 0; i < 1000; i++) sb.append('a');
        String longPassword = sb.toString();
        String result = AuthUtil.md5Encrypt(longPassword);
        assertNotNull(result);
        assertEquals(32, result.length());
        assertTrue(result.matches("[0-9a-f]{32}"));
    }

    // ===== MD5 Encrypt: White-box (Branch coverage) =====

    @Test
    @DisplayName("md5Encrypt: single-digit hex padding branch (bytes < 16 are zero-padded)")
    void md5Encrypt_hexPaddingBranch_correctlyPads() {
        // MD5 of "admin" is known: 21232f297a57a5a743894a0e4a801fc3
        // This hash contains bytes that need padding (e.g., 0e -> needs the leading zero)
        String result = AuthUtil.md5Encrypt("admin");
        assertEquals(32, result.length());
        // Verify it matches the known MD5 hash of "admin"
        assertEquals("21232f297a57a5a743894a0e4a801fc3", result);
    }

    @Test
    @DisplayName("md5Encrypt: known value 'abc' produces correct MD5 hash")
    void md5Encrypt_knownValue_correctHash() {
        // MD5("abc") = 900150983cd24fb0d6963f7d28e17f72
        String result = AuthUtil.md5Encrypt("abc");
        assertEquals("900150983cd24fb0d6963f7d28e17f72", result);
    }

    // ===== UUID Tests =====

    @Test
    @DisplayName("generateUUID: returns string of length 32")
    void generateUUID_length32() {
        String uuid = AuthUtil.generateUUID();
        assertEquals(32, uuid.length());
    }

    @Test
    @DisplayName("generateUUID: contains no hyphens")
    void generateUUID_noHyphens() {
        String uuid = AuthUtil.generateUUID();
        assertFalse(uuid.contains("-"));
    }

    @Test
    @DisplayName("generateUUID: contains only hex characters [0-9a-f]")
    void generateUUID_onlyHexChars() {
        String uuid = AuthUtil.generateUUID();
        assertTrue(uuid.matches("[0-9a-f]{32}"), "UUID should only contain hex characters");
    }

    @Test
    @DisplayName("generateUUID: two calls produce different UUIDs (uniqueness)")
    void generateUUID_twoCallsProduceDifferentValues() {
        String uuid1 = AuthUtil.generateUUID();
        String uuid2 = AuthUtil.generateUUID();
        assertNotEquals(uuid1, uuid2, "Two generated UUIDs should be unique");
    }
}
