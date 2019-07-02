import { connect } from 'react-redux'
import Rulers from '../components/Rulers'
// import {
//   toggle,
//   toggleVisibility,
//   toggleEditing,
//   reset } from '../rulersActions'

const mapStateToProps = (state) => ({
  numRulers: 1,
  // numRulers: state.rulers.rulers.length,
  visible: true,
  editing: true,
})

const mapDispatchToProps = (dispatch) => ({
  toggle: () => {
    // dispatch(toggle())
  },
  toggleVisibility: () => {
    // dispatch(toggleVisibility())
  },
  toggleEditing: () => {
    // dispatch(toggleEditing())
  },
  reset: () => {
    // dispatch(reset())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Rulers)
