import { connect } from 'react-redux'
import NoLogin from 'app/components/Map/NoLogin'
import { login } from 'app/user/userActions'

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => ({
  login: () => {
    dispatch(login())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoLogin)
