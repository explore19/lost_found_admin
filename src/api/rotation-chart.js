import request from '@/utils/request'

export function queryRotationChart(params) {
  return request({
    url: '/rotation_chart/find_rotation',
    method: 'get',
    params
  })
}

export function createRotationChart(data) {
  return request({
    url: '/rotation_chart',
    method: 'post',
    data
  })
}

export function putRotationChart(data, id) {
  data.id = id
  return request({
    url: '/rotation_chart',
    method: 'put',
    data
  })
}

export function deleteRotationChart(id) {
  return request({
    url: '/rotation_chart/' + id,
    method: 'delete'
  })
}

