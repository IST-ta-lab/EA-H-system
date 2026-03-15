package com.qm.bupt.service;

import com.qm.bupt.entity.Admin;
import com.qm.bupt.entity.MO;
import com.qm.bupt.entity.TA;
import com.qm.bupt.entity.User;

public interface UserService {
    // 用户登录
    User login(String username, String password);

    // TA注册
    boolean registerTA(TA ta);

    // MO注册
    boolean registerMO(MO mo);

    // Admin注册
    boolean registerAdmin(Admin admin);

    // 根据用户名查询用户
    User getUserByUsername(String username);

    // 根据userId查询用户
    User getUserById(String userId);
}