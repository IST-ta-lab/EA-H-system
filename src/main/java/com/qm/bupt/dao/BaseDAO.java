package com.qm.bupt.dao;

import com.qm.bupt.util.FileUtil;
import com.qm.bupt.util.JsonUtil;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 通用数据访问层基类，封装所有CRUD操作
 * @param <T> 实体类型
 */
public abstract class BaseDAO<T> {

    // 数据文件存储路径，由子类实现
    protected abstract String getFilePath();

    // 实体类类型，由子类实现
    protected abstract Class<T> getEntityClass();

    // 读写锁，解决并发文件覆盖问题
    private static final Object LOCK = new Object();

    /**
     * 查询所有数据
     */
    public List<T> listAll() {
        synchronized (LOCK) {
            try {
                String json = FileUtil.readFile(getFilePath());
                if (json.isEmpty()) {
                    return new ArrayList<>();
                }
                return JsonUtil.fromJsonToList(json, getEntityClass());
            } catch (IOException e) {
                e.printStackTrace();
                return new ArrayList<>();
            }
        }
    }

    /**
     * 根据ID查询
     * @param id 实体唯一ID
     * @param idFieldName ID字段名（如userId、jobId）
     */
    public Optional<T> getById(String id, String idFieldName) {
        List<T> list = listAll();
        return list.stream().filter(item -> {
            try {
                Object fieldValue = item.getClass().getMethod("get" + idFieldName.substring(0, 1).toUpperCase() + idFieldName.substring(1)).invoke(item);
                return id.equals(fieldValue.toString());
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
        }).findFirst();
    }

    /**
     * 新增/保存数据
     */
    public boolean save(T entity) {
        synchronized (LOCK) {
            try {
                List<T> list = listAll();
                list.add(entity);
                String json = JsonUtil.toJson(list);
                FileUtil.writeFile(getFilePath(), json);
                return true;
            } catch (IOException e) {
                e.printStackTrace();
                return false;
            }
        }
    }

    /**
     * 根据ID更新数据
     * @param entity 新的实体数据
     * @param id 实体唯一ID
     * @param idFieldName ID字段名
     */
    public boolean updateById(T entity, String id, String idFieldName) {
        synchronized (LOCK) {
            try {
                List<T> list = listAll();
                list = list.stream().map(item -> {
                    try {
                        Object fieldValue = item.getClass().getMethod("get" + idFieldName.substring(0, 1).toUpperCase() + idFieldName.substring(1)).invoke(item);
                        if (id.equals(fieldValue.toString())) {
                            return entity;
                        }
                        return item;
                    } catch (Exception e) {
                        e.printStackTrace();
                        return item;
                    }
                }).collect(Collectors.toList());
                String json = JsonUtil.toJson(list);
                FileUtil.writeFile(getFilePath(), json);
                return true;
            } catch (IOException e) {
                e.printStackTrace();
                return false;
            }
        }
    }

    /**
     * 根据ID删除数据
     */
    public boolean deleteById(String id, String idFieldName) {
        synchronized (LOCK) {
            try {
                List<T> list = listAll();
                list = list.stream().filter(item -> {
                    try {
                        Object fieldValue = item.getClass().getMethod("get" + idFieldName.substring(0, 1).toUpperCase() + idFieldName.substring(1)).invoke(item);
                        return !id.equals(fieldValue.toString());
                    } catch (Exception e) {
                        e.printStackTrace();
                        return true;
                    }
                }).collect(Collectors.toList());
                String json = JsonUtil.toJson(list);
                FileUtil.writeFile(getFilePath(), json);
                return true;
            } catch (IOException e) {
                e.printStackTrace();
                return false;
            }
        }
    }

    /**
     * 批量保存数据
     */
    public boolean saveBatch(List<T> entityList) {
        synchronized (LOCK) {
            try {
                String json = JsonUtil.toJson(entityList);
                FileUtil.writeFile(getFilePath(), json);
                return true;
            } catch (IOException e) {
                e.printStackTrace();
                return false;
            }
        }
    }
}