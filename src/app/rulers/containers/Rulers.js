import { connect } from 'react-redux'
import Rulers from '../components/Rulers'
import { toggle, reset } from '../rulersActions'

const mapStateToProps = (state) => ({
  numRulers: state.rulers.rulers.length,
  editing: state.rulers.editing,
})

const mapDispatchToProps = (dispatch) => ({
  toggle: () => {
    dispatch(toggle())
  },
  reset: () => {
    dispatch(reset())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Rulers)
