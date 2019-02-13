import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js';
import platform from 'platform';
import Notifications from '../components/Notifications';
import { setNotification } from '../notificationsActions';

const mapStateToProps = (state) => {
  const showBanner = state.notifications.visible && window.innerWidth > 768;
  return {
    showBanner,
    literals: state.literals,
    type: state.notifications.type,
    content: state.notifications.content,
    legacyWorkspaceLoaded: state.workspace.legacyWorkspaceLoaded,
    hasDeprecatedActivityLayersMessage: state.heatmap.hasDeprecatedActivityLayersMessage
  };
};

const mapDispatchToProps = dispatch => ({
  setNotification: payload => dispatch(setNotification(payload))
});

class NotificationsContainer extends React.Component {
  componentDidMount = () => {
    // Check empty object
    if (Object.values(this.props.literals).length) {
      this.checkFirstBanner();
    }
  };

  componentDidUpdate = (prevProps) => {
    if (!Object.values(prevProps.literals).length && Object.values(this.props.literals).length > 0) {
      this.checkFirstBanner();
    }
  };

  checkFirstBanner = () => {
    const { legacyWorkspaceLoaded, hasDeprecatedActivityLayersMessage } = this.props;
    const { banner, bannerLegacyWorkspace, bannerWebGL, bannerEdge } = this.props.literals;

    const isWebGLSupported = PIXI.utils.isWebGLSupported();
    const isEdge = platform.name.match(/edge/gi) !== null;
    const visible =
      isWebGLSupported === false ||
      isEdge === true ||
      this.props.legacyWorkspaceLoaded ||
      this.props.hasDeprecatedActivityLayersMessage !== null ||
      (SHOW_BANNER === true && banner !== undefined);

    let bannerContent;
    if (SHOW_BANNER === true) bannerContent = banner;
    else if (isWebGLSupported === false) bannerContent = bannerWebGL;
    else if (legacyWorkspaceLoaded === true) bannerContent = bannerLegacyWorkspace;
    else if (hasDeprecatedActivityLayersMessage !== null) bannerContent = hasDeprecatedActivityLayersMessage;
    else if (isEdge === true) bannerContent = bannerEdge;

    if (visible) {
      // TODO: get type depending on error
      this.props.setNotification({ content: bannerContent, visible });
    }
  };

  onCloseClick = () => {
    this.props.setNotification({ content: '', visible: false });
  };

  render() {
    if (!this.props.showBanner) return null;
    return <Notifications type={this.props.type} content={this.props.content} onCloseClick={this.onCloseClick} />;
  }
}

NotificationsContainer.propTypes = {
  showBanner: PropTypes.bool.isRequired,
  type: PropTypes.string,
  content: PropTypes.string,
  legacyWorkspaceLoaded: PropTypes.bool.isRequired,
  hasDeprecatedActivityLayersMessage: PropTypes.bool.isRequired,
  literals: PropTypes.object.isRequired,
  setNotification: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationsContainer);
