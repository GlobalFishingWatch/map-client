import React, { Component } from 'react';
import classnames from 'classnames';
import LayerOptionsTooltip from 'components/Map/LayerOptionsTooltip';
import pinnedTracksStyles from 'styles/components/map/c-pinned-tracks.scss';
import iconsStyles from 'styles/icons.scss';
import BlendingIcon from 'babel!svg-react!assets/icons/blending-icon.svg?name=BlendingIcon';
import RenameIcon from 'babel!svg-react!assets/icons/close.svg?name=RenameIcon';
import DeleteIcon from 'babel!svg-react!assets/icons/delete-icon.svg?name=DeleteIcon';

class PinnedTracksItem extends Component {

  constructor(props) {
    super(props);

    this.onVesselLabelClick = this.onVesselLabelClick.bind(this);
  }
  onChangeName(value) {
    this.props.setPinnedVesselTitle(this.props.vessel.seriesgroup, value);
  }

  onVesselLabelClick() {
    if (this.props.editMode === false) {
      this.props.onVesselClicked(this.props.vessel.seriesgroup);
    }
  }

  clearName() {
    this.onChangeName('');
    this.inputName.focus();
  }

  onChangeHue(hue) {
    this.props.setPinnedVesselHue(this.props.vessel.seriesgroup, hue);
  }

  render() {
    let actions;
    if (this.props.vessel.title === undefined) return false;

    if (this.props.editMode === true) {
      actions = (
        <div className={pinnedTracksStyles['edition-menu']} >
          <DeleteIcon
            className={classnames(iconsStyles.icon, pinnedTracksStyles['delete-icon'])}
            onClick={() => {
              this.props.onRemoveClicked(this.props.vessel.seriesgroup);
            }}
          />
        </div>
      );
    } else {
      actions = (
        <ul className={pinnedTracksStyles['pinned-item-action-list']} >
          <li className={pinnedTracksStyles['pinned-item-action-item']} >
            <BlendingIcon
              className={iconsStyles['blending-icon']}
              onClick={() => {
                this.props.onLayerBlendingToggled(this.props.index);
              }}
            />
          </li>
          <LayerOptionsTooltip
            displayHue
            displayOpacity={false}
            hueValue={this.props.vessel.hue}
            showBlending={this.props.showBlending}
            onChangeHue={hue => this.onChangeHue(hue)}
          />
        </ul>
      );
    }

    return (
      <li
        className={pinnedTracksStyles['pinned-item']}
        key={this.props.vessel.seriesgroup}
      >
        <input
          className={classnames(pinnedTracksStyles['item-name'], { [pinnedTracksStyles['item-rename']]: this.props.editMode })}
          onChange={e => this.onChangeName(e.currentTarget.value)}
          readOnly={!this.props.editMode}
          value={this.props.vessel.title}
          ref={((elem) => {
            this.inputName = elem;
          })}
          onClick={this.onVesselLabelClick}
        />
        {this.props.editMode === true && <RenameIcon
          className={classnames(iconsStyles.icon, iconsStyles['icon-close'], pinnedTracksStyles['rename-icon'])}
          onClick={() => this.clearName()}
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
  setPinnedVesselTitle: React.PropTypes.func,
  onVesselClicked: React.PropTypes.func,
  setPinnedVesselHue: React.PropTypes.func,
  showBlending: React.PropTypes.bool,
  vessel: React.PropTypes.object
};

export default PinnedTracksItem;
