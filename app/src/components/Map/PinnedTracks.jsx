import React, { Component } from 'react';
import pinnedTracksStyles from 'styles/components/map/c-pinned-tracks.scss';

class PinnedTracks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false
    };
  }

  onRemoveClick(seriesgroup) {
    console.warn('remove ', seriesgroup);
  }

  onBlendingClicked(index) {
    console.warn('show blending popup for layer index', index);
  }

  onInfoClicked(seriesgroup) {
    console.warn('show info for vessel with seriesgroup', seriesgroup);
  }

  onEditClick() {
    this.setState({
      editMode: !this.state.editMode
    });
  }

  render() {
    const pinnedVessels = this.props.vessels.filter(vessel => vessel.pinned === true);

    if (pinnedVessels.length === 0) {
      return null;
    }

    return (
      <div className={pinnedTracksStyles['c-pinned-tracks']}>
        <ul>
          {pinnedVessels.map((pinnedVessel, index) => {
            let actions;
            if (this.state.editMode === true) {
              actions = (
                <span>
                  <button onClick={() => { this.onRemoveClick(pinnedVessel.seriesgroup); }}>remove</button>
                </span>
              );
            } else {
              actions = (
                <span>
                  <button onClick={() => { this.onBlendingClicked(index); }}>hue</button>
                  <button onClick={() => { this.onInfoClicked(pinnedVessel.seriesgroup); }}>show info</button>
                </span>
              );
            }
            return (
              <div key={pinnedVessel.seriesgroup}>
                <a href="#" onClick={() => { this.props.onVesselClicked(pinnedVessel.seriesgroup); }}>
                  {pinnedVessel.vesselname}
                </a>
                {actions}
              </div>);
          })}
        </ul>
        <button onClick={() => { this.onEditClick(); }}>
          Edit pinned
        </button>
      </div>
    );
  }
}

PinnedTracks.propTypes = {
  vessels: React.PropTypes.array,
  onVesselClicked: React.PropTypes.func
};

export default PinnedTracks;
