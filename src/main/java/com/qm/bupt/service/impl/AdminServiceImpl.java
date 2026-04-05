package com.qm.bupt.service.impl;

import com.qm.bupt.dao.*;
import com.qm.bupt.dto.UserDetailDTO;
import com.qm.bupt.dto.UserListDTO;
import com.qm.bupt.entity.*;
import com.qm.bupt.service.AdminService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class AdminServiceImpl implements AdminService {

    private static final AdminServiceImpl INSTANCE = new AdminServiceImpl();
    private final UserDAO userDAO = UserDAO.getInstance();
    private final TADAO taDAO = TADAO.getInstance();
    private final MODAO moDAO = MODAO.getInstance();
    private final JobDAO jobDAO = JobDAO.getInstance();
    private final ApplicationDAO applicationDAO = ApplicationDAO.getInstance();

    private AdminServiceImpl() {
    }

    public static AdminServiceImpl getInstance() {
        return INSTANCE;
    }

    @Override
    public List<UserListDTO> listAllUsers() {
        List<User> userList = userDAO.listAll();
        List<UserListDTO> dtoList = new ArrayList<>();

        for (User user : userList) {
            UserListDTO dto = new UserListDTO();
            dto.setUserId(user.getUserId());
            dto.setUsername(user.getUsername());
            dto.setRealName(user.getRealName());
            dto.setEmail(user.getEmail());
            dto.setUserType(user.getUserType());
            dto.setStatus(user.getStatus());

            // 转换角色描述
            switch (user.getUserType()) {
                case 1: dto.setUserTypeDesc("助教申请者(TA)"); break;
                case 2: dto.setUserTypeDesc("模块组织者(MO)"); break;
                case 3: dto.setUserTypeDesc("系统管理员(Admin)"); break;
                default: dto.setUserTypeDesc("未知");
            }
            dtoList.add(dto);
        }
        return dtoList;
    }

    @Override
    public boolean deleteUser(String userId) {
        // 1. 先查询用户是否存在
        User user = userDAO.getById(userId, "userId").orElse(null);
        if (user == null) return false;

        // 2. 根据角色删除对应的子表数据
        if (user.getUserType() == 1) {
            taDAO.deleteById(userId, "userId");
        } else if (user.getUserType() == 2) {
            moDAO.deleteById(userId, "userId");
        }

        // 3. 删除User主表数据
        return userDAO.deleteById(userId, "userId");
    }

    @Override
    public UserDetailDTO getUserDetail(String userId) {
        // 1. 查询基础用户信息
        User user = userDAO.getById(userId, "userId").orElse(null);
        if (user == null) return null;

        // 2. 组装公共信息
        UserDetailDTO dto = new UserDetailDTO();
        dto.setUserId(user.getUserId());
        dto.setUsername(user.getUsername());
        dto.setRealName(user.getRealName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setUserType(user.getUserType());
        dto.setCreateTime(user.getCreateTime());

        // 3. 根据角色组装专属信息
        if (user.getUserType() == 1) {
            // TA：查询TA档案 + 申请记录
            dto.setUserTypeDesc("助教申请者(TA)");
            TA ta = taDAO.getById(userId, "userId").orElse(null);
            dto.setTaInfo(ta);

            List<Application> apps = applicationDAO.listAll().stream()
                    .filter(a -> userId.equals(a.getTaUserId()))
                    .collect(Collectors.toList());
            dto.setTaApplicationList(apps);

        } else if (user.getUserType() == 2) {
            // MO：查询MO档案 + 发布的岗位
            dto.setUserTypeDesc("模块组织者(MO)");
            MO mo = moDAO.getById(userId, "userId").orElse(null);
            dto.setMoInfo(mo);

            List<Job> jobs = jobDAO.listAll().stream()
                    .filter(j -> userId.equals(j.getPublisherMoId()))
                    .collect(Collectors.toList());
            dto.setMoPublishedJobList(jobs);

        } else if (user.getUserType() == 3) {
            dto.setUserTypeDesc("系统管理员(Admin)");
        }

        return dto;
    }

    @Override
    public List<Job> listAllJobs() {
        return jobDAO.listAll();
    }

    @Override
    public boolean deleteJob(String jobId) {
        // 1. 先删除该岗位下的所有申请记录
        List<Application> allApps = applicationDAO.listAll();
        List<Application> remainingApps = allApps.stream()
                .filter(a -> !jobId.equals(a.getJobId()))
                .collect(Collectors.toList());
        applicationDAO.saveBatch(remainingApps);

        // 2. 再删除岗位本身
        return jobDAO.deleteById(jobId, "jobId");
    }
}