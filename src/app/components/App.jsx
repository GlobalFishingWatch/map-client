/* eslint-disable react/no-danger */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import AppStyles from 'styles/components/app.module.scss'
import Notifications from 'app/notifications/containers/Notifications'

const DISABLE_WELCOME_MODAL = process.env.REACT_APP_DISABLE_WELCOME_MODAL === 'true'

class App extends Component {
  componentWillMount() {
    this.props.getLoggedUser()

    if (!DISABLE_WELCOME_MODAL) {
      this.props.setWelcomeModalUrl()
    }
    this.props.checkInitialNotification()
  }

  componentDidUpdate(nextProps) {
    if (nextProps.welcomeModalUrl !== this.props.welcomeModalUrl && !DISABLE_WELCOME_MODAL) {
      this.getWelcomeModal()
    }
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
  getLoggedUser: PropTypes.func,
  setWelcomeModalUrl: PropTypes.func,
  checkInitialNotification: PropTypes.func,
  setWelcomeModalContent: PropTypes.func,
  welcomeModalUrl: PropTypes.string,
}

export default App
