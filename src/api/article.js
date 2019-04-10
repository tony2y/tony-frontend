import request from '@/utils/request'
var rqeUrl = 'http://localhost:8081'
export function fetchList(query) {
  return request({
    url: '/article/list',
    method: 'get',
    params: query
  })
}

export function loginBack(data) { // 登录
  return request({
    url: rqeUrl + '/loginIn',
    method: 'get',
    params: data
  })
}

export function userList(query) { // 查询用户
  return request({
    url: rqeUrl + '/system/user/list',
    method: 'get',
    params: query
  })
}

export function menuList(query) { // 菜单权限列表
  return request({
    url: rqeUrl + '/system/menu/tree',
    method: 'get',
    params: query
  })
}

export function deptList(query) { // 部门列表
  return request({
    url: rqeUrl + '/system/dept/tree',
    method: 'get',
    params: query
  })
}

export function serverList() { // 服务器列表
  return request({
    url: rqeUrl + '/system/user/server',
    method: 'get'
  })
}

export function updatePass(data) { // 修改密码
  return request({
    url: rqeUrl + '/system/user/editPwd',
    method: 'post',
    params: data
  })
}

export function updateStatus(data) { // 更改状态
  return request({
    url: rqeUrl + '/system/user/updateStatus',
    method: 'put',
    params: data
  })
}

export function createUser(data) { // 新增用户
  return request({
    url: rqeUrl + '/system/user/add',
    method: 'post',
    params: data
  })
}

export function removeUser(id) { // 删除用户
  return request({
    url: rqeUrl + '/system/user/remove/' + id,
    method: 'delete'
  })
}

export function druid() { // 数据监控
  return request({
    url: rqeUrl + '/druid/index.html'
  })
}

export function swagger() { // 接口文档
  return request({
    url: rqeUrl + '/swagger-ui.html'
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}
