import { SET_SUBMENU } from 'app/mapPanels/rightControlPanel/rightControlPanelActions'

const initialState = {
  activeSubMenu: null,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_SUBMENU:
      return Object.assign({}, state, { activeSubmenu: action.payload })
    default:
      return state
  }
}
