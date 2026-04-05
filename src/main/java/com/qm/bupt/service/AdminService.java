package com.qm.bupt.service;

import com.qm.bupt.dto.UserDetailDTO;
import com.qm.bupt.dto.UserListDTO;
import com.qm.bupt.entity.Job;
import java.util.List;

public interface AdminService {
    // 1. 查看所有用户名单
    List<UserListDTO> listAllUsers();
    // 2. 根据用户ID删除用户
    boolean deleteUser(String userId);
    // 3. 根据用户ID查看详细信息
    UserDetailDTO getUserDetail(String userId);
    // 4. 查看所有发布过的岗位
    List<Job> listAllJobs();
    // 5. 根据岗位ID删除岗位
    boolean deleteJob(String jobId);
}