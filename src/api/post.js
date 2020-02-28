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

