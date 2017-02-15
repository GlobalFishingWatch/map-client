import React, { Component } from 'react';
import classnames from 'classnames';
import { REVERSE_TOOLTIP_ITEMS_MOBILE } from 'constants';
import LayerBlendingOptionsTooltip from 'components/Map/LayerBlendingOptionsTooltip';
import pinnedTracksStyles from 'styles/components/map/c-pinned-tracks.scss';
import icons from 'styles/icons.scss';
import BlendingIcon from 'babel!svg-react!assets/icons/blending-icon.svg?name=BlendingIcon';
import InfoIcon from 'babel!svg-react!assets/icons/info-icon.svg?name=InfoIcon';
import DeleteIcon from 'babel!svg-react!assets/icons/delete-icon.svg?name=DeleteIcon';
import Toggle from 'components/Shared/Toggle';

class PinnedTracksItem extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.closeTooltip = this.closeTooltip.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.showBlending !== this.props.showBlending) {
      if (nextProps.showBlending) window.addEventListener('click', this.closeTooltip);
    }
    return true;
  }

  onChangeName(value) {
    this.props.setPinnedVesselTitle(this.props.vessel.seriesgroup, value);
  }

  onVesselLabelClick() {
    if (this.props.pinnedVesselEditMode === false) {
      this.props.onVesselClicked(this.props.vessel.seriesgroup);
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

  closeTooltip(e) {
    e.stopPropagation();
    e.preventDefault();

    if (this.tooltip.contains(e.target)) return;
    window.removeEventListener('click', this.closeTooltip);
    this.props.onLayerBlendingToggled(this.props.index);
  }

  render() {
    let actions;
    if (this.props.vessel.title === undefined) return false;

    if (this.props.pinnedVesselEditMode === true) {
      actions = (
        <div className={pinnedTracksStyles['edition-menu']} >
          <DeleteIcon
            className={classnames(icons.icon, pinnedTracksStyles['delete-icon'])}
            onClick={() => {
              this.props.onRemoveClicked(this.props.vessel.seriesgroup);
            }}
          />
        </div>
      );
    } else {
      actions = (
        <ul className={pinnedTracksStyles['pinned-item-action-list']} >
          <li
            className={pinnedTracksStyles['pinned-item-action-item']}
            ref={(ref) => { this.tooltip = ref; }}
          >
            <BlendingIcon
              className={classnames(icons['blending-icon'],
                { [icons['-white']]: this.props.showBlending })}
              onClick={() => this.props.onLayerBlendingToggled(this.props.index)}
            />
            {this.props.showBlending &&
            <LayerBlendingOptionsTooltip
              displayHue
              hueValue={this.props.vessel.hue}
              onChangeHue={hue => this.onChangeHue(hue)}
              isReverse={this.props.index < REVERSE_TOOLTIP_ITEMS_MOBILE}
            />
            }
          </li>
          <li
            className={pinnedTracksStyles['pinned-item-action-item']}
            onClick={e => this.onVesselLabelClick(e)}
          >
            <InfoIcon className={classnames(icons.icon, icons['info-icon'])} />
          </li>
        </ul>
      );
    }

    return (
      <li
        className={pinnedTracksStyles['pinned-item']}
        key={this.props.vessel.seriesgroup}
      >
        <Toggle
          on={this.props.vessel.visible}
          hue={this.props.vessel.hue}
          onToggled={() => this.onChangeVisibility()}
        />
        <input
          className={classnames(pinnedTracksStyles['item-name'], { [pinnedTracksStyles['item-rename']]: this.props.pinnedVesselEditMode })}
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

PinnedTracksItem.propTypes = {
  pinnedVesselEditMode: React.PropTypes.bool,
  index: React.PropTypes.number,
  togglePinnedVesselVisibility: React.PropTypes.func,
  onLayerBlendingToggled: React.PropTypes.func,
  onRemoveClicked: React.PropTypes.func,
  setPinnedVesselTitle: React.PropTypes.func,
  onVesselClicked: React.PropTypes.func,
  setPinnedVesselHue: React.PropTypes.func,
  showBlending: React.PropTypes.bool,
  vessel: React.PropTypes.object
};

export default PinnedTracksItem;
