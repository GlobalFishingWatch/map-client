import { connect } from 'react-redux'
import MenuMobile from 'app/siteNav/components/MenuMobile'
import { login, logout } from 'app/user/userActions'
import { setSupportModalVisibility } from 'app/siteNav/supportFormActions'

const mapStateToProps = (state) => ({
  loggedUser: state.user.loggedUser,
})

const mapDispatchToProps = (dispatch) => ({
  login: () => {
    dispatch(login())
  },
  logout: () => {
    dispatch(logout())
  },
  setSupportModalVisibility: () => {
    dispatch(setSupportModalVisibility(true))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuMobile)
