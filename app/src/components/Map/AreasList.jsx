import React from 'preact';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { COLORS } from 'constants';
import areasPanelStyles from 'styles/components/map/areas-panel.scss';
import controlPanelStyles from 'styles/components/control_panel.scss';
import buttonStyles from 'styles/components/map/button.scss';
import Toggle from 'components/Shared/Toggle';

function AreasList({ areas, recentlyCreated, toggleAreaVisibility, deleteArea }) {
  return (
    <div className={areasPanelStyles.areasList} >
      { areas && areas.map((area, i) => {
        let recentLastArea = false;
        let itemClassNames = [controlPanelStyles.panel];
        if (recentlyCreated && i === (areas.length - 1)) {
          recentLastArea = true;
          itemClassNames = itemClassNames.concat([areasPanelStyles.newItem]);
        }
        return (
          <div key={i} className={classnames(itemClassNames)}>
            {recentLastArea && <div className={classnames([areasPanelStyles.recentLabel])}>Area added recently</div>}
            <div className={classnames([areasPanelStyles.areaItem])}>
              <div className={classnames([areasPanelStyles.nameContainer])}>
                <Toggle
                  on={area.visible}
                  color={COLORS[area.color]}
                  onToggled={() => toggleAreaVisibility(i)}
                />
                <div className={classnames([areasPanelStyles.name])}>
                  { area.name }
                </div>
              </div>
              <button
                className={classnames([buttonStyles.button, buttonStyles._primary])}
                onClick={() => deleteArea(i)}
              >Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

AreasList.propTypes = {
  areas: PropTypes.array.isRequired,
  recentlyCreated: PropTypes.bool.isRequired,
  toggleAreaVisibility: PropTypes.func.isRequired,
  deleteArea: PropTypes.func.isRequired
};

export default AreasList;
