import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import Vessel from 'vessels/containers/Vessel';
import Toggle from 'components/Shared/Toggle';
import IconButton from 'src/components/Shared/IconButton';
import FleetStyles from 'fleets/components/Fleet.scss';
import VesselStyles from 'vessels/components/Vessel.scss';

class Fleet extends Component {
  renderFleetVessel(fleetVessel) {
    return (<div key={fleetVessel.seriesgroup}>
      {fleetVessel.title}
    </div>);
  }

  render() {
    const { fleet } = this.props;
    const fleetVessels = (fleet.visible === false) ? null : (<div className={FleetStyles.vessels}>
      {fleet.fleetVessels.map(fleetVessel => (<Vessel
        vessel={fleetVessel}
        key={fleetVessel.seriesgroup}
        editable={false}
        tall={false}
      />))}
    </div>);

    return (<div className={classnames(FleetStyles.fleet, { [FleetStyles._collapsed]: !fleet.visible })}>
      <div className={VesselStyles.vessel}>
        <div className={VesselStyles.toggle}>
          <Toggle
            on={fleet.visible}
            color={fleet.color}
            onToggled={() => this.props.toggle(fleet.id)}
          />
        </div>
        <div className={classnames(VesselStyles.title, VesselStyles._light)}>
          {fleet.title}
        </div>
        <div>
          <IconButton icon="pencil" />
        </div>
      </div>
      {fleetVessels}
    </div>);
  }
}

Fleet.propTypes = {
  fleet: PropTypes.object,
  toggle: PropTypes.func
};

export default Fleet;
