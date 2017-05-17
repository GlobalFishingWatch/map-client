/* global PIXI */
/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import classnames from 'classnames';
import AppStyles from 'styles/components/c-app.scss';

const ACCESS_TOKEN_REGEX = /#access_token=([a-zA-Z0-9.\-_]*)(&[a-z=])?/g;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bannerDismissed: false
    };
  }

  componentWillMount() {
    this.props.loadLiterals();
    // TODO move this logic out of a presentational component
    ACCESS_TOKEN_REGEX.lastIndex = 0;
    if (ACCESS_TOKEN_REGEX.test(window.location.hash)) {
      ACCESS_TOKEN_REGEX.lastIndex = 0;
      const parts = ACCESS_TOKEN_REGEX.exec(window.location.hash);
      if (parts && parts.length >= 2) {
        this.props.setToken(parts[1]);
      }
    }
    this.props.getLoggedUser();

    if (!DISABLE_WELCOME_MODAL) this.props.setWelcomeModalUrl();
  }

  componentDidUpdate(nextProps) {
    if (nextProps.welcomeModalUrl !== this.props.welcomeModalUrl && !DISABLE_WELCOME_MODAL) this.getWelcomeModal();
  }

  getWelcomeModal() {
    const storedUrl = localStorage.getItem(WELCOME_MODAL_COOKIE_KEY);
    if (this.props.welcomeModalUrl && storedUrl !== this.props.welcomeModalUrl) {
      localStorage.setItem(WELCOME_MODAL_COOKIE_KEY, this.props.welcomeModalUrl);
      this.props.setWelcomeModalContent();
    }
  }

  dismissBanner() {
    this.setState({
      bannerDismissed: true
    });
  }

  render() {
    const isWebGLSupported = PIXI.utils.isWebGLSupported();
    const showBanner =
      (isWebGLSupported === false || (SHOW_BANNER === true && this.props.banner !== undefined))
      && this.state.bannerDismissed === false;
    const bannerContent = (SHOW_BANNER === true) ? (<span
      dangerouslySetInnerHTML={{ __html: this.props.banner }}
    />) : (<span>
      ⚠️ There is a problem with your current configuration (WebGL is disabled or unavailable).
      The map will be shown with degraded performance.
    </span>);

    document.body.classList.toggle('-has-banner', showBanner);

    return (
      <div>
        {showBanner === true &&
          <div className={AppStyles.banner}>
            {bannerContent}
            <button className={AppStyles['close-button']} onClick={() => this.dismissBanner()}>
              <span className={AppStyles.icon}>✕</span>
            </button>
          </div>
        }
        <div className={classnames('full-height-container', AppStyles['c-app'])}>
          {this.props.children}
        </div>
      </div>
    );
  }

}

App.propTypes = {
  children: React.PropTypes.object,
  setToken: React.PropTypes.func,
  getLoggedUser: React.PropTypes.func,
  setWelcomeModalUrl: React.PropTypes.func,
  setWelcomeModalContent: React.PropTypes.func,
  loadLiterals: React.PropTypes.func,
  welcomeModalUrl: React.PropTypes.string,
  banner: React.PropTypes.string
};


export default App;
