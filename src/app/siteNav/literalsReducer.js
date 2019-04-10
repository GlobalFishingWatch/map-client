import literals from 'app/literals.json'

const initialState = literals

export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state
  }
}
