import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import Fleet from 'fleets/containers/Fleet';
import Vessel from 'vessels/containers/Vessel';
import ButtonStyles from 'styles/components/button.scss';
import VesselsStyles from 'vessels/components/Vessels.scss';

class Vessels extends Component {
  organizeFleetsAndVessels() {
    const { fleets, vessels } = this.props;
    const items = [];
    const pinnedVessels = vessels.filter(vessel => vessel.pinned);
    fleets.forEach((fleet) => {
      const item = { ...fleet, isFleet: true };
      item.fleetVessels = [];
      fleet.vessels.forEach((seriesgroup) => {
        const vesselIndex = pinnedVessels.findIndex(vessel => seriesgroup === vessel.seriesgroup);
        const vessel = pinnedVessels[vesselIndex];
        item.fleetVessels.push({ ...vessel });
        pinnedVessels.splice(vesselIndex, 1);
      });
      items.push(item);
    });
    pinnedVessels.forEach((remainingVessel) => {
      items.push({ ...remainingVessel });
    });
    return items;
  }

  renderItems() {
    const vesselItems = this.organizeFleetsAndVessels();
    const disableCreateFleetButton = vesselItems.filter(vesselItem => vesselItem.isFleet !== true).length <= 1;
    const vesselItemsElements = (<div>
      {vesselItems.map((item) => {
        if (item.isFleet === true) {
          return <Fleet fleet={item} key={item.id} />;
        }
        return <Vessel vessel={item} key={item.seriesgroup} />;
      })}
    </div>);
    return { vesselItemsElements, disableCreateFleetButton };
  }

  render() {
    const { vesselItemsElements, disableCreateFleetButton } = this.renderItems();
    return (<div>
      {vesselItemsElements}
      <div className={VesselsStyles.buttons}>
        <button
          className={classnames(ButtonStyles.button, { [ButtonStyles._disabled]: this.props.loggedUser === null })}
          onClick={() => this.props.openRecentVesselModal()}
        >
          recent vessels
        </button>
        <button
          className={classnames(ButtonStyles.button, { [ButtonStyles._disabled]: disableCreateFleetButton })}
          onClick={() => this.props.openFleetModal()}
        >
          group vessels
        </button>
      </div>
    </div>);
  }
}


Vessels.propTypes = {
  vessels: PropTypes.array,
  fleets: PropTypes.array,
  currentlyShownVessel: PropTypes.object,
  loggedUser: PropTypes.object,
  openRecentVesselModal: PropTypes.func,
  openFleetModal: PropTypes.func
};

export default Vessels;
