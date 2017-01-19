import React, { Component } from 'react';
import classnames from 'classnames';
import LayerOptionsTooltip from 'components/Map/LayerOptionsTooltip';

import pinnedTracksStyles from 'styles/components/map/c-pinned-tracks.scss';
import iconsStyles from 'styles/icons.scss';

import InfoIcon from 'babel!svg-react!assets/icons/info-icon.svg?name=InfoIcon';
import BlendingIcon from 'babel!svg-react!assets/icons/blending-icon.svg?name=BlendingIcon';
import RenameIcon from 'babel!svg-react!assets/icons/close.svg?name=RenameIcon';
import DeleteIcon from 'babel!svg-react!assets/icons/delete-icon.svg?name=DeleteIcon';

class PinnedTracksItem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      editable: false,
      vesselName: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    const vesselName = this.state.vesselName.length === 0 ?
      nextProps.pinnedVessel.vesselname : this.state.vesselName;
    const hue = this.state.hue || nextProps.pinnedVessel.hue;

    this.setState({
      vesselName,
      hue,
      editable: nextProps.editMode
    });

    if (nextProps.editMode === false && this.state.editable === true) {
      this.props.onUpdatedItem({
        vesselname: vesselName
      }, this.props.index);
    }
  }

  onChange(value) {
    this.setState({
      vesselName: value
    });
  }

  canEditName() {
    this.setState({
      vesselName: '',
      editable: true
    });

    this.inputName.focus();
  }

  onChangeHue(hue) {
    this.props.setPinnedVesselHue(this.props.pinnedVessel.seriesgroup, hue);

    this.setState({
      hue
    });

    this.props.onUpdatedItem({
      hue
    }, this.props.index);
  }

  render() {
    let actions;
    if (this.state.vesselName === undefined) return false;

    if (this.props.editMode === true) {
      actions = (
        <div className={pinnedTracksStyles['edition-menu']}>
          <DeleteIcon
            className={classnames(iconsStyles.icon, pinnedTracksStyles['delete-icon'])}
            onClick={() => { this.props.onRemoveClicked(this.props.pinnedVessel.seriesgroup); }}
          />
        </div>
      );
    } else {
      actions = (
        <ul className={pinnedTracksStyles['pinned-item-action-list']}>
          <li className={pinnedTracksStyles['pinned-item-action-item']}>
            <BlendingIcon
              className={iconsStyles['blending-icon']}
              onClick={() => { this.props.onLayerBlendingToggled(this.props.index); }}
            />
          </li>
          <li className={pinnedTracksStyles['pinned-item-action-item']}>
            <InfoIcon
              className={iconsStyles['info-icon']}
              onClick={() => { this.props.onVesselClicked(this.props.pinnedVessel.seriesgroup); }}
            />
          </li>
          <LayerOptionsTooltip
            displayHue
            displayOpacity={false}
            hueValue={this.state.hue}
            showBlending={this.props.showBlending}
            onChangeHue={(hue) => this.onChangeHue(hue)}
          />
        </ul>
      );
    }

    return (
      <li
        className={pinnedTracksStyles['pinned-item']}
        key={this.props.pinnedVessel.seriesgroup}
      >
        <input
          className={pinnedTracksStyles['item-name']}
          onChange={(e) => this.onChange(e.currentTarget.value)}
          readOnly={!this.state.editable}
          value={this.state.vesselName}
          ref={((elem) => { this.inputName = elem; })}
        />
        {this.props.editMode === true && <RenameIcon
          className={classnames(iconsStyles.icon, iconsStyles['icon-close'], pinnedTracksStyles['rename-icon'])}
          onClick={() => this.canEditName()}
        />}
        {actions}
      </li>);
  }
}

PinnedTracksItem.propTypes = {
  editMode: React.PropTypes.bool,
  index: React.PropTypes.number,
  onLayerBlendingToggled: React.PropTypes.func,
  onRemoveClicked: React.PropTypes.func,
  onUpdatedItem: React.PropTypes.func,
  onVesselClicked: React.PropTypes.func,
  setPinnedVesselHue: React.PropTypes.func,
  showBlending: React.PropTypes.bool,
  pinnedVessel: React.PropTypes.object
};

export default PinnedTracksItem;
