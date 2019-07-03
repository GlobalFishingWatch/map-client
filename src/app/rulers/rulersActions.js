export const EDIT_RULER = 'EDIT_RULER'
export const MOVE_CURRENT_RULER = 'MOVE_CURRENT_RULER'
export const TOGGLE = 'TOGGLE'
export const RESET = 'RESET'

export const moveCurrentRuler = ({ latitude, longitude }) => ({
  type: MOVE_CURRENT_RULER,
  latitude,
  longitude,
})

export const editRuler = ({ latitude, longitude }) => ({
  type: EDIT_RULER,
  latitude,
  longitude,
})

export const toggle = () => ({
  type: TOGGLE,
})

export const reset = () => ({
  type: RESET,
})
