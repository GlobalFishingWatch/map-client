import React from 'preact';
import PropTypes from 'prop-types';
import AreasForm from 'containers/Map/AreasForm';
import AreasList from 'containers/Map/AreasList';
import areasPanelStyles from 'styles/components/map/areas-panel.scss';

function AreasPanel({ drawing }) {
  return (
    <div className={areasPanelStyles.areasPanel} >
      {!drawing && <AreasList />}
      <AreasForm />
    </div>
  );
}

AreasPanel.propTypes = {
  drawing: PropTypes.bool
};

export default AreasPanel;
