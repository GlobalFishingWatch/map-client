import { connect } from 'react-redux'
import AuthMap from 'app/components/AuthMap'
import { login } from 'app/user/userActions'
import { canShareWorkspaces } from 'app/user/userSelectors'

const mapStateToProps = (state) => ({
  token: state.user.token,
  canShareWorkspaces: canShareWorkspaces(state),
})

const mapDispatchToProps = (dispatch) => ({
  login: () => dispatch(login()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthMap)
