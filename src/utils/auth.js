import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const infoName = 'logininfo'


export function getToken() {
  let info = (sessionStorage.getItem(infoName) == 'null' || sessionStorage.getItem(infoName) == null || !sessionStorage.getItem(infoName)) ? { token: '' } : JSON.parse(sessionStorage.getItem(infoName));
  return info.token
}
export function getRoleId() {
  let info = (sessionStorage.getItem(infoName) == 'null' || sessionStorage.getItem(infoName) == null || !sessionStorage.getItem(infoName)) ? { token: '' } : JSON.parse(sessionStorage.getItem(infoName));
  return info.roleId
}
export function getCpId() {
  let info = (sessionStorage.getItem(infoName) == 'null' || sessionStorage.getItem(infoName) == null || !sessionStorage.getItem(infoName)) ? { token: '' } : JSON.parse(sessionStorage.getItem(infoName));
  return info.cpId
}
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function setsessionInfo(info) {
  return sessionStorage.setItem(infoName, info)
}
export function getsessionInfo() {
  return sessionStorage.getItem(infoName)
}