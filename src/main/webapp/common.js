// 后端接口基础路径
const BASE_URL = '/tapj'

// 通用请求工具
async function request(url, method = 'GET', data = {}) {
    try {
        const options = {
            method: method,
            headers: { 'Content-Type': 'application/json' }
        }
        if (method === 'POST') options.body = JSON.stringify(data)

        const res = await fetch(BASE_URL + url, options)
        return await res.json()
    } catch (e) {
        alert('请求失败：' + e)
    }
}

// ===================== 用户模块 =====================
// 登录
export function login(userAccount, userPwd) {
    return request('/user/login', 'POST', { userAccount, userPwd })
}

// ===================== 岗位模块 =====================
// 获取所有岗位
export function getJobList() {
    return request('/job/list')
}

// ===================== 应聘模块 =====================
// 提交应聘
export function applyJob(jobId, taInfo, skill) {
    return request('/application/add', 'POST', { jobId, taInfo, skill })
}

// 获取我的申请
export function getMyApp() {
    return request('/application/my')
}