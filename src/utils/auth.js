import Cookies from 'js-cookie'
// Cookie中的token参数
const TokenKey = 'BingFeng-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
