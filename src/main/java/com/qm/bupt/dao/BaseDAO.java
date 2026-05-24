package com.qm.bupt.dao;

import com.qm.bupt.util.FileUtil;
import com.qm.bupt.util.JsonUtil;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Generic data access base class providing CRUD operations for all entity types.
 *
 * <p>Subclasses specify the JSON file path and entity class. All read/write
 * operations are synchronized on a static lock to prevent concurrent file
 * corruption. ID-based operations use reflection to invoke the named getter.</p>
 *
 * @param <T> the entity type managed by this DAO
 */
public abstract class BaseDAO<T> {

    // 数据文件存储路径，由子类实现
    protected abstract String getFilePath();

    // 实体类类型，由子类实现
    protected abstract Class<T> getEntityClass();

    // 读写锁，解决并发文件覆盖问题
    private static final Object LOCK = new Object();

    /**
     * Retrieves all entities from the JSON data file.
     *
     * @return list of all entities, or an empty list if the file is empty or missing
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
     * Finds an entity by its unique ID using reflection on the specified field name.
     *
     * @param id          the unique identifier value
     * @param idFieldName the field name used for ID matching (e.g., "userId", "jobId")
     * @return an Optional containing the matching entity, or empty if not found
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
     * Appends a new entity to the data file.
     *
     * @param entity the entity to save
     * @return true if the save was successful, false on I/O error
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
     * Replaces the entity matching the given ID with the provided entity.
     *
     * @param entity      the new entity data
     * @param id          the unique identifier of the entity to update
     * @param idFieldName the field name used for ID matching
     * @return true if the update was successful, false on I/O error
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
     * Removes the entity matching the given ID from the data file.
     *
     * @param id          the unique identifier of the entity to delete
     * @param idFieldName the field name used for ID matching
     * @return true if the deletion was successful, false on I/O error
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
     * Overwrites the entire data file with the provided list of entities.
     *
     * @param entityList the complete list of entities to persist
     * @return true if successful, false on I/O error
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