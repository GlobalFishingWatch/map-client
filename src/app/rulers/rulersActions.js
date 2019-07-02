export const EDIT_RULER = 'EDIT_RULER'
export const MOVE_CURRENT_RULER = 'MOVE_CURRENT_RULER'

// export const moveCurrentRuler = ({ latitude, longitude }) => (dispatch, getState) => {
//   const state = getState().rulers
//   if (state.isDrawing === false) {
//     return
//   }
//   console.log(latitude, longitude)
//   console.log(state)
//   console.log('moveCurrentRuler')
// }

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

// export const toggle = () => {

// }
