/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import * as PIXI from 'pixi.js';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import AppStyles from 'styles/components/app.scss';
import BannerStyles from 'styles/components/banner.scss';
import ReactGA from 'react-ga';
import platform from 'platform';

const ACCESS_TOKEN_REGEX = /#access_token=([a-zA-Z0-9.\-_]*)(&[a-z=])?/g;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bannerDismissed: false
    };
    ReactGA.initialize(GA_TRACKING_CODE);
    ReactGA.pageview(window.location.pathname);
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
    const isEdge = platform.name.match(/edge/gi) !== null;

    const showBanner =
      (
        isWebGLSupported === false ||
        isEdge === true ||
        this.props.legacyWorkspaceLoaded ||
        this.props.hasDeprecatedActivityLayersMessage !== null ||
        (SHOW_BANNER === true && this.props.banner !== undefined)
      )
      && this.state.bannerDismissed === false
      && window.innerWidth > 768;

    let bannerContent;
    if (SHOW_BANNER === true) bannerContent = this.props.banner;
    else if (isWebGLSupported === false) bannerContent = this.props.bannerWebGL;
    else if (this.props.legacyWorkspaceLoaded === true) bannerContent = this.props.bannerLegacyWorkspace;
    else if (this.props.hasDeprecatedActivityLayersMessage !== null) bannerContent = this.props.hasDeprecatedActivityLayersMessage;
    else if (isEdge === true) bannerContent = this.props.bannerEdge;

    document.body.classList.toggle('-has-banner', showBanner);

    return (
      <div>
        {showBanner === true &&
          <div className={BannerStyles.banner}>
            <span dangerouslySetInnerHTML={{ __html: bannerContent }} />
            <button className={BannerStyles.closeButton} onClick={() => this.dismissBanner()}>
              <span className={BannerStyles.icon}>✕</span>
            </button>
          </div>
        }
        <div className={classnames('fullHeightContainer', AppStyles.app)}>
          {this.props.children}
        </div>
      </div>
    );
  }

}

App.propTypes = {
  children: PropTypes.object,
  setToken: PropTypes.func,
  getLoggedUser: PropTypes.func,
  setWelcomeModalUrl: PropTypes.func,
  setWelcomeModalContent: PropTypes.func,
  loadLiterals: PropTypes.func,
  welcomeModalUrl: PropTypes.string,
  banner: PropTypes.string,
  bannerWebGL: PropTypes.string,
  bannerLegacyWorkspace: PropTypes.string,
  legacyWorkspaceLoaded: PropTypes.bool,
  hasDeprecatedActivityLayersMessage: PropTypes.string,
  bannerEdge: PropTypes.string
};


export default App;
