import request from '@/utils/request'

export function queryPost(params) {
  return request({
    url: '/post/query',
    method: 'get',
    params
  })
}

export function deletePost(id) {
  return request({
    url: '/manager/delete_user_post/' + id,
    method: 'delete'
  })
}

export function queryreply(params) {
  return request({
    url: '/post/query_all_reply',
    method: 'get',
    params
  })
}
export function deletereply(id) {
  return request({
    url: '/reply/' + id,
    method: 'delete'
  })
}

export function AuditPost(id, operation) {
  return request({
    url: '/post/Audit',
    params: { id: id, operation: operation },
    method: 'get'
  })
}
