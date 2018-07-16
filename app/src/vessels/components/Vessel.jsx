import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Toggle from 'components/Shared/Toggle';
import ExpandItemButton from 'components/Shared/ExpandItemButton';
import ExpandItem from 'components/Shared/ExpandItem';
import ColorPicker from 'components/Shared/ColorPicker';
import DeleteIcon from '-!babel-loader!svg-react-loader!assets/icons/delete.svg?name=DeleteIcon';
import PaintIcon from '-!babel-loader!svg-react-loader!assets/icons/paint.svg?name=PaintIcon';

class Vessel extends Component {
  constructor() {
    super();
    this.state = { expanded: false };
  }

  toggleExpand() {
    this.setState({ expanded: !this.state.expanded });
  }

  onTintChange = (color) => {
    const { vessel } = this.props;
    if (!vessel.visible) {
      this.props.toggle(vessel.seriesgroup);
    }
    this.props.setColor(vessel.seriesgroup, color);
  }

  render() {
    const { vessel, editable, currentlyShownVessel } = this.props;
    const isEditable = editable !== false;
    const detailsCurrentlyShown =
      currentlyShownVessel !== null &&
      currentlyShownVessel !== undefined &&
      currentlyShownVessel.seriesgroup === vessel.seriesgroup;

    return (<div>
      {isEditable && <Toggle
        on={vessel.visible}
        color={vessel.color}
        onToggled={() => this.props.toggle(vessel.seriesgroup)}
      />}
      <div onClick={() => this.props.showVesselDetails(vessel.seriesgroup)}>
        {vessel.title}
      </div>
      {isEditable && <div onClick={() => this.props.delete(vessel.seriesgroup)}>
        delete
      </div>}
      {isEditable && <div onClick={() => this.toggleExpand()}>
        <ExpandItemButton active={this.state.expand === true} >
          <PaintIcon
            // className={IconStyles.paintIcon}
          />
        </ExpandItemButton >
      </div>}
      <div onClick={() => this.props.showVesselDetails(vessel.seriesgroup)}>
        info:
        {detailsCurrentlyShown}
      </div>
      <ExpandItem active={this.state.expanded === true} arrowPosition={0}>
        <ColorPicker
          color={vessel.color}
          onTintChange={this.onTintChange}
          id={vessel.seriesgroup.toString()}
        />
      </ExpandItem >
    </div>);
  }
}

Vessel.propTypes = {
  vessel: PropTypes.object,
  currentlyShownVessel: PropTypes.object,
  editable: PropTypes.bool,
  toggle: PropTypes.func,
  showVesselDetails: PropTypes.func,
  delete: PropTypes.func,
  setColor: PropTypes.func
};

export default Vessel;
