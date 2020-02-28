import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/manager/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/manager/logout',
    method: 'get'
  })
}

export function queryUser(params) {
  return request({
    url: '/manager/queryUser',
    method: 'get',
    params
  })
}

export function forbidUser(id) {
  return request({
    url: '/manager/forbid_user/' + id,
    method: 'put'
  })
}
