import request from '@/utils/request'

// var baseURL='http://192.168.1.128:5000/';
var baseURL='https://www.zhifutongzhushou.com/backend/'

export function login(data) {
  return request({
    url: baseURL+'account/login',
    method: 'post',
    data
  })
}


export function logout() {
  return request({
    url: baseURL+'admin/logout',
    method: 'post'
  })
}
