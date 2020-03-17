import PropTypes from 'prop-types'
import React, { Component } from 'react'
import NoLoginStyles from 'styles/components/map/no-login.module.scss'
import { getLoginUrl } from 'app/user/userActions'

class NoLogin extends Component {
  render() {
    return (
      <div className={NoLoginStyles.noLogin}>
        <h2 className={NoLoginStyles.title}>Access needed</h2>
        <div className={NoLoginStyles.content}>
          <p>
            To view the Map, you must have a user account. Click below to access, or visit our{' '}
            <a href="/" className={NoLoginStyles.back}>
              Home Page
            </a>
          </p>
          <a className={NoLoginStyles.btnAction} href={getLoginUrl()}>
            log in / register
          </a>
        </div>
      </div>
    )
  }
}

NoLogin.propTypes = {
  login: PropTypes.func.isRequired,
}

export default NoLogin
