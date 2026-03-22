package com.qm.bupt.service.impl;

import com.qm.bupt.dao.MODAO;
import com.qm.bupt.dao.TADAO;
import com.qm.bupt.dao.UserDAO;
import com.qm.bupt.entity.Admin;
import com.qm.bupt.entity.MO;
import com.qm.bupt.entity.TA;
import com.qm.bupt.entity.User;
import com.qm.bupt.service.UserService;
import com.qm.bupt.util.AuthUtil;
import com.qm.bupt.util.DateUtil;

import java.util.List;
import java.util.Optional;

public class UserServiceImpl implements UserService {

    // 单例实例
    private static final UserServiceImpl INSTANCE = new UserServiceImpl();
    private final UserDAO userDAO = UserDAO.getInstance();
    private final TADAO taDAO = TADAO.getInstance();
    private final MODAO moDAO = MODAO.getInstance();

    private UserServiceImpl() {
    }

    public static UserServiceImpl getInstance() {
        return INSTANCE;
    }

    @Override
    public User login(String username, String password) {
        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            return null;
        }
        // 加密密码
        String encryptPwd = AuthUtil.md5Encrypt(password);
        // 查询用户
        List<User> userList = userDAO.listAll();
        Optional<User> userOptional = userList.stream()
                .filter(u -> username.equals(u.getUsername()) && encryptPwd.equals(u.getPassword()) && u.getStatus() == 0)
                .findFirst();
        return userOptional.orElse(null);
    }

    @Override
    public boolean registerTA(TA ta) {
        // 校验用户名是否已存在
        if (getUserByUsername(ta.getUsername()) != null) {
            return false;
        }
        // 填充基础信息
        ta.setUserId(AuthUtil.generateUUID());
        ta.setPassword(AuthUtil.md5Encrypt(ta.getPassword()));
        ta.setCreateTime(DateUtil.getNow());
        // 保存用户基础信息和TA信息
        userDAO.save(ta);
        return taDAO.save(ta);
    }

    @Override
    public boolean registerMO(MO mo) {
        if (getUserByUsername(mo.getUsername()) != null) {
            return false;
        }
        mo.setUserId(AuthUtil.generateUUID());
        mo.setPassword(AuthUtil.md5Encrypt(mo.getPassword()));
        mo.setCreateTime(DateUtil.getNow());
        userDAO.save(mo);
        return moDAO.save(mo);
    }

    @Override
    public boolean registerAdmin(Admin admin) {
        if (getUserByUsername(admin.getUsername()) != null) {
            return false;
        }
        admin.setUserId(AuthUtil.generateUUID());
        admin.setPassword(AuthUtil.md5Encrypt(admin.getPassword()));
        admin.setCreateTime(DateUtil.getNow());
        return userDAO.save(admin);
    }

    @Override
    public User getUserByUsername(String username) {
        List<User> userList = userDAO.listAll();
        return userList.stream()
                .filter(u -> username.equals(u.getUsername()))
                .findFirst()
                .orElse(null);
    }

    @Override
    public User getUserById(String userId) {
        return userDAO.getById(userId, "userId").orElse(null);
    }
}