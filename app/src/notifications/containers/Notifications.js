import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js';
import platform from 'platform';
import Notifications from '../components/Notifications';
import { setNotification } from '../notificationsActions';

const getInitialNotificationConfig = (literals, localChecks) => {
  return [
    {
      id: 'banner',
      content: literals.banner,
      checker: () => SHOW_BANNER === true,
      type: 'notification'
    },
    {
      id: 'webgl',
      content: literals.webgl_warning,
      checker: () => !PIXI.utils.isWebGLSupported(),
      type: 'error'
    },
    {
      id: 'edge',
      content: literals.edge_warning,
      checker: () => platform.name.match(/edge/gi) !== null,
      type: 'warning'
    },
    {
      id: 'legacyWorkspace',
      content: literals.legacy_workspace_warning,
      checker: () => localChecks.legacyWorkspaceLoaded === true,
      type: 'warning'
    },
    {
      id: 'deprecatedActivityLayers',
      content: literals.deprecated_layers_warning,
      checker: () => localChecks.hasDeprecatedActivityLayersMessage !== null,
      type: 'warning'
    }
  ];
};

const checkInitialNotification = (config) => {
  for (let i = 0; i < config.length; i++) {
    const element = config[i];
    if (element.checker()) {
      return element;
    }
  }
  return null;
};

const mapStateToProps = (state) => {
  const localChecks = {
    legacyWorkspaceLoaded: state.workspace.legacyWorkspaceLoaded,
    hasDeprecatedActivityLayersMessage: state.heatmap.hasDeprecatedActivityLayersMessage
  };
  const notificationsConfig = getInitialNotificationConfig(state.literals, localChecks);
  return {
    visible: state.notifications.visible,
    type: state.notifications.type,
    content: state.notifications.content,
    initialNotification: notificationsConfig && checkInitialNotification(notificationsConfig)
  };
};

const mapDispatchToProps = dispatch => ({
  setNotification: payload => dispatch(setNotification(payload))
});

class NotificationsContainer extends React.Component {
  componentDidMount = () => {
    if (this.props.initialNotification) {
      const { content, type } = this.props.initialNotification;
      this.props.setNotification({ content, type, visible: true });
    }
  };

  onCloseClick = () => {
    this.props.setNotification({ content: '', visible: false });
  };

  render() {
    if (!this.props.visible) return null;
    return <Notifications type={this.props.type} content={this.props.content} onCloseClick={this.onCloseClick} />;
  }
}

NotificationsContainer.propTypes = {
  visible: PropTypes.bool.isRequired,
  type: PropTypes.string,
  content: PropTypes.string,
  initialNotification: PropTypes.object.isRequired,
  setNotification: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationsContainer);
