import request from '@/utils/request'

// 查询我的问卷列表
export function listDirectory(query) {
  return request({
    url: '/pp/directory/list',
    method: 'get',
    params: query
  })
}

// 查询我的问卷详细
export function getDirectory(id) {
  return request({
    url: '/pp/directory/' + id,
    method: 'get'
  })
}

// 新增我的问卷
export function addDirectory(data) {
  return request({
    url: '/pp/directory',
    method: 'post',
    data: data
  })
}

// 修改我的问卷
export function updateDirectory(data) {
  return request({
    url: '/pp/directory',
    method: 'put',
    data: data
  })
}

// 删除我的问卷
export function delDirectory(id) {
  return request({
    url: '/pp/directory/' + id,
    method: 'delete'
  })
}

/**
 * 创建问卷
 * @param data
 * @returns {*}
 */
export function dwSurveyCreate (data) {
  return request({
    url: '/pp/directory/',
    method: 'post',
    data: data
  })
}
