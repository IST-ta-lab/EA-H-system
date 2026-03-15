package com.qm.bupt.util;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.qm.bupt.entity.Admin;
import com.qm.bupt.entity.MO;
import com.qm.bupt.entity.TA;
import com.qm.bupt.entity.User;
import com.google.gson.typeadapters.RuntimeTypeAdapterFactory;

import java.lang.reflect.Type;
import java.util.List;

/**
 * JSON工具类，封装Gson操作（支持多态反序列化）
 */
public class JsonUtil {

    // 配置多态类型适配器
    private static final RuntimeTypeAdapterFactory<User> USER_TYPE_FACTORY = RuntimeTypeAdapterFactory
            .of(User.class, "userType") // 基类是User，区分字段是 userType
            .registerSubtype(TA.class, "1")    // userType=1 时，实例化 TA
            .registerSubtype(MO.class, "2")    // userType=2 时，实例化 MO
            .registerSubtype(Admin.class, "3"); // userType=3 时，实例化 Admin

    // 单例Gson对象，注册多态适配器
    private static final Gson GSON = new GsonBuilder()
            .setDateFormat("yyyy-MM-dd HH:mm:ss")
            .disableHtmlEscaping()
            .setPrettyPrinting()
            .registerTypeAdapterFactory(USER_TYPE_FACTORY) // 【关键】注册多态适配器
            .create();

    // 私有构造，禁止实例化
    private JsonUtil() {
    }

    /**
     * Java对象转JSON字符串
     */
    public static String toJson(Object obj) {
        return GSON.toJson(obj);
    }

    /**
     * JSON字符串转Java对象
     */
    public static <T> T fromJson(String json, Class<T> clazz) {
        return GSON.fromJson(json, clazz);
    }

    /**
     * JSON字符串转List集合
     */
    public static <T> List<T> fromJsonToList(String json, Class<T> clazz) {
        Type type = TypeToken.getParameterized(List.class, clazz).getType();
        return GSON.fromJson(json, type);
    }
}