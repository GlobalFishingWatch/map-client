import React, { Component } from 'react';

class PinnedTracks extends Component {
  render() {
    const pinnedVessels = this.props.vessels.filter(vessel => vessel.pinned === true);

    if (pinnedVessels.length === 0) {
      return null;
    }

    return (
      <ul>
      {pinnedVessels.map(pinnedVessel =>
        (<div key={pinnedVessel.seriesgroup}>
          {pinnedVessel.vesselname}{pinnedVessel.seriesgroup}
          
        </div>)
      )}
      </ul>
    );
  }
}

PinnedTracks.propTypes = {
  vessels: React.PropTypes.array
};

export default PinnedTracks;
