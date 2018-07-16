import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Vessel from 'vessels/containers/Vessel';
import Toggle from 'components/Shared/Toggle';

class Fleet extends Component {
  renderFleetVessel(fleetVessel) {
    return (<div key={fleetVessel.seriesgroup}>
      {fleetVessel.title}
    </div>);
  }

  render() {
    const { fleet } = this.props;
    const fleetVessels = (fleet.visible === false) ? null : (<div>
      {fleet.fleetVessels.map(fleetVessel => (<Vessel
        vessel={fleetVessel}
        key={fleetVessel.seriesgroup}
        editable={false}
      />))}
    </div>);
    return (<div>
      <Toggle
        on={fleet.visible}
        color={fleet.color}
        onToggled={() => this.props.toggle(fleet.id)}
      />
      {fleet.title}
      {fleetVessels}
    </div>);
  }
}

Fleet.propTypes = {
  fleet: PropTypes.object,
  toggle: PropTypes.func
};

export default Fleet;
