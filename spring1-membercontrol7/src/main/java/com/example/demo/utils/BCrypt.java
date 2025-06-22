package com.example.demo.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * BCrypt 密碼加密工具類，使用 Spring Security 的 BCryptPasswordEncoder
 */
public class BCrypt {
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    
    /**
     * 加密密碼
     * @param password 明文密碼
     * @param salt 鹽值 (在本實現中被忽略，因為 BCryptPasswordEncoder 會自動生成並包含鹽)
     * @return 加密後的密碼
     */
    public static String hashpw(String password, String salt) {
        return encoder.encode(password);
    }
    
    /**
     * 生成鹽值 (本實現返回空字符串，因為 BCryptPasswordEncoder 自動處理鹽)
     * @return 空字符串
     */
    public static String gensalt() {
        return "";
    }
    
    /**
     * 檢查密碼是否匹配
     * @param plaintext 明文密碼
     * @param hashed 加密後的密碼
     * @return 是否匹配
     */
    public static boolean checkpw(String plaintext, String hashed) {
        return encoder.matches(plaintext, hashed);
    }
} 