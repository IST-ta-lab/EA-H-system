package com.qm.bupt.util;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * File I/O utility for reading and writing text files.
 *
 * <p>Provides convenient static methods for file read, write, and existence
 * check operations using UTF-8 encoding. Directories are auto-created on write.</p>
 */
public class FileUtil {

    // 私有构造，禁止实例化
    private FileUtil() {
    }

    /**
     * 读取文本文件内容
     * @param filePath 文件路径
     * @return 文件内容字符串
     */
    public static String readFile(String filePath) throws IOException {
        File file = new File(filePath);
        if (!file.exists()) {
            return "";
        }
        return new String(Files.readAllBytes(Paths.get(filePath)), StandardCharsets.UTF_8);
    }

    /**
     * 写入内容到文本文件（覆盖写入）
     * @param filePath 文件路径
     * @param content 要写入的内容
     */
    public static void writeFile(String filePath, String content) throws IOException {
        File file = new File(filePath);
        // 父目录不存在则创建
        if (!file.getParentFile().exists()) {
            file.getParentFile().mkdirs();
        }
        // 写入文件
        try (FileOutputStream fos = new FileOutputStream(file);
             OutputStreamWriter osw = new OutputStreamWriter(fos, StandardCharsets.UTF_8)) {
            osw.write(content);
        }
    }

    /**
     * 判断文件是否存在
     */
    public static boolean exists(String filePath) {
        return new File(filePath).exists();
    }
}