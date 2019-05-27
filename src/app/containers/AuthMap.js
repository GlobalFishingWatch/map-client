import { connect } from 'react-redux'
import AuthMap from 'app/components/AuthMap'
import { login } from 'app/user/userActions'

const mapStateToProps = (state) => ({
  token: state.user.token,
  userPermissions: state.user.userPermissions,
  isEmbedded: state.app.isEmbedded,
})

const mapDispatchToProps = (dispatch) => ({
  login: () => dispatch(login()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthMap)
