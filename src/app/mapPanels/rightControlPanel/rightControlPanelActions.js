import 'whatwg-fetch'

export const SET_SUBMENU = 'SET_SUBMENU'

export function setSubmenu(submenuName) {
  return {
    type: SET_SUBMENU,
    payload: submenuName,
  }
}
