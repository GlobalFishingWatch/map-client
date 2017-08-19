import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import { REVERSE_TOOLTIP_ITEMS_MOBILE } from 'config';
import PinnedVesselOptionsTooltip from 'pinnedVessels/components/PinnedVesselOptionsTooltip';
import pinnedTracksStyles from 'styles/components/map/pinned-tracks.scss';
import icons from 'styles/icons.scss';
import InfoIcon from '-!babel-loader!svg-react-loader!assets/icons/info.svg?name=InfoIcon';
import DeleteIcon from '-!babel-loader!svg-react-loader!assets/icons/delete.svg?name=DeleteIcon';
import Toggle from 'components/Shared/Toggle';

class PinnedVessel extends Component {

  onChangeName(value) {
    this.props.setPinnedVesselTitle(this.props.vessel.seriesgroup, value);
  }

  onVesselLabelClick() {
    if (this.props.pinnedVesselEditMode === false) {
      this.props.onVesselClicked(this.props.vessel.seriesgroup, this.props.vessel.title, this.props.vessel.tilesetId);
    }
  }

  onChangeHue(hue) {
    if (!this.props.vessel.visible) {
      this.props.togglePinnedVesselVisibility(this.props.vessel.seriesgroup);
    }
    this.props.setPinnedVesselHue(this.props.vessel.seriesgroup, hue);
  }

  onChangeVisibility() {
    this.props.togglePinnedVesselVisibility(this.props.vessel.seriesgroup);
  }

  toggleBlending() {
    this.props.onPinnedVesselOptionsToggled(this.props.index);
  }

  render() {
    let actions;
    if (this.props.vessel.title === undefined) return false;

    if (this.props.pinnedVesselEditMode === true) {
      actions = (
        <div className={pinnedTracksStyles.editionMenu} >
          <DeleteIcon
            className={classnames(icons.icon, pinnedTracksStyles.deleteIcon)}
            onClick={() => {
              this.props.onRemoveClicked(this.props.vessel.seriesgroup);
            }}
          />
        </div>
      );
    } else {
      actions = (
        <ul className={pinnedTracksStyles.pinnedItemActionList} >
          <li className={pinnedTracksStyles.pinnedItemActionItem}>
            <PinnedVesselOptionsTooltip
              hueValue={this.props.vessel.hue}
              onChangeHue={hue => this.onChangeHue(hue)}
              isReverse={this.props.index < REVERSE_TOOLTIP_ITEMS_MOBILE}
              visible={this.props.showBlending}
              toggleVisibility={() => this.toggleBlending()}
            />
          </li>
          <li
            className={pinnedTracksStyles.pinnedItemActionItem}
            onClick={e => this.onVesselLabelClick(e)}
          >
            <InfoIcon className={icons.icon} />
          </li>
        </ul>
      );
    }

    return (
      <li
        className={pinnedTracksStyles.pinnedItem}
        key={this.props.vessel.seriesgroup}
      >
        <Toggle
          on={this.props.vessel.visible}
          hue={this.props.vessel.hue}
          onToggled={() => this.onChangeVisibility()}
        />
        <input
          className={classnames(pinnedTracksStyles.itemName, { [pinnedTracksStyles.itemRename]: this.props.pinnedVesselEditMode })}
          onChange={e => this.onChangeName(e.currentTarget.value)}
          readOnly={!this.props.pinnedVesselEditMode}
          value={this.props.vessel.title}
          ref={((elem) => {
            this.inputName = elem;
          })}
          onClick={e => this.onVesselLabelClick(e)}
        />
        {actions}
      </li>);
  }
}

PinnedVessel.propTypes = {
  pinnedVesselEditMode: PropTypes.bool,
  index: PropTypes.number,
  togglePinnedVesselVisibility: PropTypes.func,
  onPinnedVesselOptionsToggled: PropTypes.func,
  onRemoveClicked: PropTypes.func,
  setPinnedVesselTitle: PropTypes.func,
  onVesselClicked: PropTypes.func,
  setPinnedVesselHue: PropTypes.func,
  showBlending: PropTypes.bool,
  vessel: PropTypes.object
};

export default PinnedVessel;
