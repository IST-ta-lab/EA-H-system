package com.qm.bupt.util;

import java.io.*;
import java.util.Properties;

public class ConfigUtil {

    private static final String CONFIG_FILE = "/WEB-INF/data/config.properties";
    private static Properties properties;

    static {
        properties = new Properties();
    }

    public static void init(String realPath) {
        String configFilePath = realPath + CONFIG_FILE;
        File configFile = new File(configFilePath);
        
        if (configFile.exists()) {
            try (InputStream input = new FileInputStream(configFile)) {
                properties.load(input);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static String get(String key) {
        String envValue = System.getenv(key);
        if (envValue != null && !envValue.isEmpty()) {
            return envValue;
        }
        return properties.getProperty(key);
    }

    public static String get(String key, String defaultValue) {
        String value = get(key);
        return value != null ? value : defaultValue;
    }
}