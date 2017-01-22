import React, { Component } from 'react';
import classnames from 'classnames';

import LayerOptionsTooltip from 'components/Map/LayerOptionsTooltip';

import pinnedTracksStyles from 'styles/components/map/c-pinned-tracks.scss';
import MapButtonStyles from 'styles/components/map/c-button.scss';
import iconStyles from 'styles/icons.scss';

import InfoIcon from 'babel!svg-react!assets/icons/info-icon.svg?name=InfoIcon';
import BlendingIcon from 'babel!svg-react!assets/icons/blending-icon.svg?name=BlendingIcon';
import DeleteIcon from 'babel!svg-react!assets/icons/delete-icon.svg?name=DeleteIcon';

class PinnedTracks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
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

  onEditClick() {
    this.setState({
      editMode: !this.state.editMode
    });
  }

  render() {
    const pinnedVessels = this.props.vessels.filter(vessel => vessel.pinned === true);
    const editButtonText = (this.state.editMode === false) ? 'edit pinned' : 'done';

    let pinnedItems = null;

    if (!pinnedVessels.length) {
      pinnedItems = (<div className={pinnedTracksStyles['no-pinned-items']}>
        <span className={pinnedTracksStyles['no-pin-literal']}>No pinned vessels</span>
        <InfoIcon className={pinnedTracksStyles['info-icon']} />
      </div>);
    } else {
      pinnedItems = (
        <ul className={pinnedTracksStyles['pinned-item-list']}>
          {pinnedVessels.map((pinnedVessel, index) => {
            let actions;
            if (this.state.editMode === true) {
              actions = (
                <DeleteIcon
                  onClick={() => { this.props.onRemoveClicked(pinnedVessel.seriesgroup); }}
                />
              );
            } else {
              actions = (
                <ul className={pinnedTracksStyles['pinned-item-action-list']}>
                  <li className={pinnedTracksStyles['pinned-item-action-item']}>
                    <BlendingIcon
                      className={iconStyles['blending-icon']}
                      onClick={() => { this.onBlendingClicked(index); }}
                    />
                  </li>
                  <li className={pinnedTracksStyles['pinned-item-action-item']}>
                    <InfoIcon
                      className={iconStyles['info-icon']}
                      onClick={() => { this.props.onVesselClicked(pinnedVessel.seriesgroup); }}
                    />
                  </li>
                  <LayerOptionsTooltip
                    displayHue
                    displayOpacity={false}
                    hueValue={pinnedVessel.hue}
                    showBlending={this.state.currentBlendingOptionsShown === index}
                    onChangeHue={hue => this.props.setPinnedVesselHue(pinnedVessel.seriesgroup, hue)}
                  />
                </ul>
              );
            }

            return (
              <li
                className={pinnedTracksStyles['pinned-item']}
                key={pinnedVessel.seriesgroup}
              >
                <span className={pinnedTracksStyles['item-name']}>
                  {pinnedVessel.vesselname}
                </span>
                {actions}
              </li>);
          })}
        </ul>
      );
    }

    return (
      <div className={pinnedTracksStyles['c-pinned-tracks']}>
        {pinnedItems}
        <div className={pinnedTracksStyles['pinned-button-container']}>
          <button
            className={classnames(MapButtonStyles['c-button'], pinnedTracksStyles['pinned-button'])}
          >
            recent vessels
          </button>
          <button
            className={classnames(MapButtonStyles['c-button'], pinnedTracksStyles['pinned-button'],
              { [`${MapButtonStyles['-disabled']}`]: !pinnedVessels.length },
              { [`${MapButtonStyles['-filled']}`]: !!this.state.editMode })}
            onClick={() => { this.onEditClick(); }}
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
  onVesselClicked: React.PropTypes.func,
  onRemoveClicked: React.PropTypes.func,
  setPinnedVesselHue: React.PropTypes.func
};

export default PinnedTracks;
