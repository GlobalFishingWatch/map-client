/* eslint-disable react/no-danger */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import AppStyles from 'styles/components/app.module.scss'
import Notifications from 'app/notifications/containers/Notifications'

const ACCESS_TOKEN_REGEX = /#access_token=([a-zA-Z0-9.\-_]*)(&[a-z=])?/g
const DISABLE_WELCOME_MODAL = process.env.REACT_APP_DISABLE_WELCOME_MODAL === true

class App extends Component {
  componentWillMount() {
    // TODO move this logic out of a presentational component
    ACCESS_TOKEN_REGEX.lastIndex = 0
    if (ACCESS_TOKEN_REGEX.test(window.location.hash)) {
      ACCESS_TOKEN_REGEX.lastIndex = 0
      const parts = ACCESS_TOKEN_REGEX.exec(window.location.hash)
      if (parts && parts.length >= 2) {
        this.props.setToken(parts[1])
      }
    }
    this.props.getLoggedUser()

    if (!DISABLE_WELCOME_MODAL) this.props.setWelcomeModalUrl()
    this.props.checkInitialNotification()
  }

  componentDidUpdate(nextProps) {
    if (nextProps.welcomeModalUrl !== this.props.welcomeModalUrl && !DISABLE_WELCOME_MODAL)
      this.getWelcomeModal()
  }

  getWelcomeModal() {
    const storedUrl = localStorage.getItem(process.env.REACT_APP_WELCOME_MODAL_COOKIE_KEY)
    if (this.props.welcomeModalUrl && storedUrl !== this.props.welcomeModalUrl) {
      localStorage.setItem(
        process.env.REACT_APP_WELCOME_MODAL_COOKIE_KEY,
        this.props.welcomeModalUrl
      )
      this.props.setWelcomeModalContent()
    }
  }

  render() {
    return (
      <div>
        <Notifications />
        <div className={classnames('fullHeightContainer', AppStyles.app)}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.object,
  setToken: PropTypes.func,
  getLoggedUser: PropTypes.func,
  setWelcomeModalUrl: PropTypes.func,
  checkInitialNotification: PropTypes.func,
  setWelcomeModalContent: PropTypes.func,
  welcomeModalUrl: PropTypes.string,
}

export default App
