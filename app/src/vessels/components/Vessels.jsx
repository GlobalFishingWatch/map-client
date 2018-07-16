import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Fleet from 'vessels/containers/Fleet';
import Vessel from 'vessels/containers/Vessel';

class Vessels extends Component {
  organizeFleetsAndVessels() {
    const { fleets, vessels } = this.props;
    const items = [];
    const allVessels = vessels.filter(vessel => vessel.pinned);
    fleets.forEach((fleet) => {
      const item = { ...fleet };
      item.fleetVessels = [];
      fleet.vessels.forEach((seriesgroup) => {
        const vesselIndex = allVessels.findIndex(vessel => seriesgroup === vessel.seriesgroup);
        const vessel = allVessels[vesselIndex];
        item.fleetVessels.push({ ...vessel });
        allVessels.splice(vesselIndex, 1);
      });
      items.push(item);
    });
    allVessels.forEach((remainingVessel) => {
      items.push({ ...remainingVessel });
    });
    return items;
  }

  renderItems() {
    const items = this.organizeFleetsAndVessels();
    return (<div>
      {items.map((item) => {
        const isFleet = item.fleetVessels !== undefined;
        return (isFleet)
          ? <Fleet fleet={item} key={item.vessels.join('')} />
          : <Vessel vessel={item} key={item.seriesgroup} />;
      })}
    </div>);
  }

  render() {
    const items = this.renderItems();
    return (<div>
      {items}
    </div>);
  }
}


Vessels.propTypes = {
  vessels: PropTypes.array,
  fleets: PropTypes.array,
  currentlyShownVessel: PropTypes.object,
  loggedUser: PropTypes.object
};

export default Vessels;
