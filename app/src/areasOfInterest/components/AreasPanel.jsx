import React from 'react';
import PropTypes from 'prop-types';
import AreasForm from 'areasOfInterest/containers/AreasForm';
import AreasList from 'areasOfInterest/containers/AreasList';
import areasPanelStyles from 'styles/components/map/areas-panel.scss';

function AreasPanel({ isDrawing }) {
  return (
    <div className={areasPanelStyles.areasPanel} >
      {!isDrawing && <AreasList />}
      <AreasForm />
    </div>
  );
}

AreasPanel.propTypes = {
  isDrawing: PropTypes.bool
};

export default AreasPanel;
