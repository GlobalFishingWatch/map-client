import React, { Component } from 'react';
import classnames from 'classnames';
import PinnedTracksItem from 'containers/Map/PinnedTracksItem';
import pinnedTracksStyles from 'styles/components/map/c-pinned-tracks.scss';
import MapButtonStyles from 'styles/components/map/c-button.scss';

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
      pinnedItemsHeading = (<div className={pinnedTracksStyles['no-pinned-items']}>
        <span className={pinnedTracksStyles['no-pin-literal']}>No pinned vessels</span>
      </div>);
    } else {
      pinnedItemsHeading = (
        <div className={pinnedTracksStyles['pinned-tracks-heading']}>
          pinned vessels
        </div>);

      pinnedItems = (
        <ul className={pinnedTracksStyles['pinned-item-list']}>
          {pinnedVessels.map((pinnedVessel, index) =>
            <PinnedTracksItem
              index={index}
              key={index}
              onLayerBlendingToggled={() => this.onBlendingClicked(index)}
              showBlending={this.state.currentBlendingOptionsShown === index}
              vessel={pinnedVessel}
            />
          )}
        </ul>
      );
    }

    return (
      <div className={pinnedTracksStyles['c-pinned-tracks']}>
        {pinnedItemsHeading}
        {pinnedItems}
        <div className={pinnedTracksStyles['pinned-button-container']}>
          {this.props.loggedUser != null &&
            <button
              className={classnames(MapButtonStyles['c-button'], pinnedTracksStyles['pinned-button'])}
              onClick={() => this.props.openRecentVesselModal()}
            >
              recent vessels
            </button>
          }
          <button
            className={classnames(MapButtonStyles['c-button'], pinnedTracksStyles['pinned-button'],
              { [`${MapButtonStyles['-disabled']}`]: !pinnedVessels.length },
              { [`${MapButtonStyles['-filled']}`]: !!this.props.pinnedVesselEditMode })}
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
  vessels: React.PropTypes.array,
  pinnedVesselEditMode: React.PropTypes.bool,
  loggedUser: React.PropTypes.object,
  onUpdatedItem: React.PropTypes.func,
  onRemoveClicked: React.PropTypes.func,
  setPinnedVesselHue: React.PropTypes.func,
  togglePinnedVesselEditMode: React.PropTypes.func,
  openRecentVesselModal: React.PropTypes.func
};

export default PinnedTracks;
