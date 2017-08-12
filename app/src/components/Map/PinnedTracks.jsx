import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import PinnedTracksItem from 'containers/Map/PinnedTracksItem';
import pinnedTracksStyles from 'styles/components/map/pinned-tracks.scss';
import MapButtonStyles from 'styles/components/map/button.scss';

class PinnedTracks extends Component {
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
    const pinnedVessels = this.props.vessels.filter(vessel => vessel.pinned === true);
    const editButtonText = (this.props.pinnedVesselEditMode === false) ? 'edit pinned' : 'done';

    let pinnedItems = null;
    let pinnedItemsHeading = null;

    if (!pinnedVessels.length) {
      pinnedItemsHeading = (<div className={pinnedTracksStyles.noPinnedItems}>
        <span className={pinnedTracksStyles.noPinLiteral}>No pinned vessels</span>
      </div>);
    } else {
      pinnedItemsHeading = (
        <div className={pinnedTracksStyles.pinnedTracksHeading}>
          pinned vessels
        </div>);

      pinnedItems = (
        <ul>
          {pinnedVessels.map((pinnedVessel, index) =>
            (<PinnedTracksItem
              index={index}
              key={index}
              onLayerBlendingToggled={() => this.onBlendingClicked(index)}
              showBlending={this.state.currentBlendingOptionsShown === index}
              vessel={pinnedVessel}
            />)
          )}
        </ul>
      );
    }

    return (
      <div className={pinnedTracksStyles.pinnedTracks}>
        {pinnedItemsHeading}
        {pinnedItems}
        <div className={pinnedTracksStyles.pinnedButtonContainer}>
          {this.props.loggedUser != null &&
            <button
              className={classnames(MapButtonStyles.button, pinnedTracksStyles.pinnedButton)}
              onClick={() => this.props.openRecentVesselModal()}
            >
              recent vessels
            </button>
          }
          <button
            className={classnames(MapButtonStyles.button, pinnedTracksStyles.pinnedButton,
              { [`${MapButtonStyles._disabled}`]: !pinnedVessels.length },
              { [`${MapButtonStyles._filled}`]: !!this.props.pinnedVesselEditMode })}
            onClick={() => { this.props.togglePinnedVesselEditMode(); }}
          >
            {editButtonText}
          </button>
        </div>
      </div>
    );
  }
}

PinnedTracks.propTypes = {
  vessels: PropTypes.array,
  pinnedVesselEditMode: PropTypes.bool,
  loggedUser: PropTypes.object,
  onUpdatedItem: PropTypes.func,
  onRemoveClicked: PropTypes.func,
  setPinnedVesselHue: PropTypes.func,
  togglePinnedVesselEditMode: PropTypes.func,
  openRecentVesselModal: PropTypes.func
};

export default PinnedTracks;
