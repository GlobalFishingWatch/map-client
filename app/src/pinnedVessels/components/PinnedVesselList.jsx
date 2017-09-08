import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import PinnedVessel from 'pinnedVessels/containers/PinnedVessel';
import pinnedTracksStyles from 'styles/components/map/pinned-tracks.scss';
import ButtonStyles from 'styles/components/button.scss';

class PinnedVesselList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentBlendingOptionsShown: -1
    };
  }

  onBlendingClicked(index) {
    let currentBlendingOptionsShown = index;
    if (currentBlendingOptionsShown === this.state.currentBlendingOptionsShown) {
      currentBlendingOptionsShown = -1;
    }
    this.setState({ currentBlendingOptionsShown });
  }

  render() {
    const isVesselInfoPanelClosed = this.props.currentlyShownVessel === null;
    const unpinnedVessels = this.props.vessels.filter(vessel => !vessel.pinned);
    const pinnedVessels = this.props.vessels.filter(vessel => vessel.pinned);

    let pinnedItems = null;

    if (unpinnedVessels.length || pinnedVessels.length) {
      pinnedItems = (
        <ul className={classnames(pinnedTracksStyles.tracksList, { [pinnedTracksStyles.noInfo]: isVesselInfoPanelClosed })}>
          {unpinnedVessels.concat(pinnedVessels).map((pinnedVessel, index) =>
            (<PinnedVessel
              index={index}
              key={index}
              onPinnedVesselOptionsToggled={() => this.onBlendingClicked(index)}
              showBlending={this.state.currentBlendingOptionsShown === index}
              vessel={pinnedVessel}
            />)
          )}
        </ul>
      );
    }

    return (
      <div className={pinnedTracksStyles.pinnedTracks}>
        {pinnedItems}
        <div className={pinnedTracksStyles.pinnedButtonContainer}>
          {this.props.loggedUser != null &&
            <button
              className={classnames(ButtonStyles.button, ButtonStyles._wide, ButtonStyles._big)}
              onClick={() => this.props.openRecentVesselModal()}
            >
              recent vessels
            </button>
          }
        </div>
      </div>
    );
  }
}

PinnedVesselList.propTypes = {
  vessels: PropTypes.array,
  pinnedVesselEditMode: PropTypes.bool,
  currentlyShownVessel: PropTypes.object,
  loggedUser: PropTypes.object,
  onUpdatedItem: PropTypes.func,
  onRemoveClicked: PropTypes.func,
  setPinnedVesselHue: PropTypes.func,
  togglePinnedVesselEditMode: PropTypes.func,
  openRecentVesselModal: PropTypes.func
};

export default PinnedVesselList;
