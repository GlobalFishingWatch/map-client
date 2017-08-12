import React from 'react';
import PropTypes from 'prop-types';
import AreasForm from 'areasOfInterest/containers/AreasForm';
import AreasList from 'areasOfInterest/containers/AreasList';
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
