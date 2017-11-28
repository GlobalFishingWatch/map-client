import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import MediaQuery from 'react-responsive';
import ExpandButton from 'components/Shared/ExpandButton';
import infoPanelStyles from 'styles/components/info-panel.scss';
import buttonCloseStyles from 'styles/components/button-close.scss';
import CloseIcon from '-!babel-loader!svg-react-loader!assets/icons/close.svg?name=Icon';
import { INFO_STATUS } from 'constants';

import EncountersInfo from './EncountersInfo';

class EncountersPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: true
    };
  }

  onExpand() {
    this.setState({
      isExpanded: !this.state.isExpanded
    });
  }

  renderEncountersInfoContainer() {
    const { encountersInfo, infoPanelStatus } = this.props;
    if (infoPanelStatus === INFO_STATUS.LOADING) {
      return (
        <div className={infoPanelStyles.metadata} >
          <div>Loading encounters information...</div>
        </div>
      );
    } else if (infoPanelStatus === INFO_STATUS.LOADED && encountersInfo) {
      return (
        <div className={classnames(infoPanelStyles.metadata, infoPanelStyles._noPadding)} >
          <EncountersInfo encountersInfo={encountersInfo} />
        </div>
      );
    }
    return null;
  }

  render() {
    const { encountersInfo, infoPanelStatus } = this.props;

    if (infoPanelStatus !== INFO_STATUS.LOADING && encountersInfo === null) {
      return null;
    }

    return (
      <div
        className={classnames(infoPanelStyles.infoPanel,
          { [`${infoPanelStyles._expanded}`]: this.state.isExpanded })}
      >
        <div className={infoPanelStyles.buttonsContainer} >
          <MediaQuery maxWidth={789} >
            <ExpandButton
              onExpand={() => this.onExpand()}
              isExpanded={this.state.isExpanded}
            />
          </MediaQuery>

          <button
            onClick={() => this.props.hide()}
            className={classnames(buttonCloseStyles.buttonClose, infoPanelStyles.closeBtn)}
          >
            <CloseIcon className={buttonCloseStyles.cross} />
          </button>
        </div>
        {this.renderEncountersInfoContainer()}
      </div>);
  }
}

EncountersPanel.propTypes = {
  encountersInfo: PropTypes.object,
  infoPanelStatus: PropTypes.number,
  openVessel: PropTypes.func.isRequired,
  hide: PropTypes.func.isRequired
};

export default EncountersPanel;
