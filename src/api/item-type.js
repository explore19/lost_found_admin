import request from '@/utils/request'

export function queryItemType(params) {
  return request({
    url: '/itemType/getAllType',
    method: 'get',
    params
  })
}

export function createItem(data) {
  return request({
    url: '/itemType',
    method: 'post',
    data
  })
}

export function putItem(data) {
  return request({
    url: '/itemType',
    method: 'put',
    data
  })
}

export function deleteItem(id) {
  return request({
    url: '/itemType/' + id,
    method: 'delete'
  })
}

