import React, { Component } from 'preact';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import AreasForm from 'containers/Map/AreasForm';
import { COLORS } from 'constants';
import areasPanelStyles from 'styles/components/map/areas-panel.scss';
import controlPanelStyles from 'styles/components/control_panel.scss';
import Toggle from 'components/Shared/Toggle';

class AreasPanel extends Component {
  render() {
    const { areas, toggleAreaVisibility } = this.props;
    return (
      <div className={areasPanelStyles.areasPanel} >
        <div className={areasPanelStyles.areasList} >
          {areas && areas.map((area, i) => (
            <div key={i} className={classnames([controlPanelStyles.panel, areasPanelStyles.areaItem])} >
              <Toggle
                on={area.visible}
                color={COLORS[area.color]}
                onToggled={() => toggleAreaVisibility(i)}
              />
              <div className={classnames([areasPanelStyles.name])} >
                {area.name}
              </div >
            </div >
          ))}
        </div >
        <AreasForm />
      </div >
    );
  }
}

AreasPanel.propTypes = {
  areas: PropTypes.array.isRequired,
  toggleAreaVisibility: PropTypes.func.isRequired
};

export default AreasPanel;
