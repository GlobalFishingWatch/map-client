import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { COLORS } from 'constants';
import areasPanelStyles from 'styles/components/map/areas-panel.scss';
import controlPanelStyles from 'styles/components/control_panel.scss';
import buttonStyles from 'styles/components/map/button.scss';
import Toggle from 'components/Shared/Toggle';

export default class AreasItem extends Component {

  render() {
    const area = this.props.areas[this.props.index];
    let recentLastArea = false;
    let itemClassNames = [controlPanelStyles.item];
    if (this.props.recentlyCreated) {
      recentLastArea = true;
      itemClassNames = itemClassNames.concat([areasPanelStyles.newItem]);
    }
    return (
      <div className={classnames(itemClassNames)} >
        {recentLastArea &&
        <div className={classnames([areasPanelStyles.recentLabel])} >Area added recently</div >}
        <div className={classnames([areasPanelStyles.areaItem])} >
          <div className={classnames([areasPanelStyles.nameContainer])} >
            <Toggle
              on={area.visible}
              color={COLORS[area.color]}
              onToggled={() => this.props.toggleAreaVisibility(this.props.index)}
            />
            <div className={classnames([areasPanelStyles.name])} >
              {area.name}
            </div >
          </div >
          <button
            className={classnames([buttonStyles.button, buttonStyles._primary])}
            onClick={() => this.props.setEditAreaIndex(this.props.index)}
          >Edit
          </button >
          <button
            className={classnames([buttonStyles.button, buttonStyles._primary])}
            onClick={() => this.props.deleteArea(this.props.index)}
          >Delete
          </button >
        </div >
      </div >
    );
  }
}

AreasItem.propTypes = {
  areas: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  recentlyCreated: PropTypes.bool.isRequired,
  toggleAreaVisibility: PropTypes.func.isRequired,
  deleteArea: PropTypes.func.isRequired,
  setEditAreaIndex: PropTypes.func.isRequired
};
