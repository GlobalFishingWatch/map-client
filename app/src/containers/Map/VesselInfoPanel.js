import { connect } from 'react-redux';
import VesselInfoPanel from 'components/Map/VesselInfoPanel';
import { clearVesselInfo, toggleActiveVesselPin, setRecentVesselHistory } from 'actions/vesselInfo';
import { login } from 'actions/user';

const mapStateToProps = (state) => {
  const currentlyShownLayer = state.layers.workspaceLayers.find(layer => state.vesselInfo.currentlyShownVessel && layer.tilesetId === state.vesselInfo.currentlyShownVessel.tilesetId);

  let layerFieldsHeaders;
  if (currentlyShownLayer !== undefined && currentlyShownLayer.header !== undefined && currentlyShownLayer.header.vesselFields !== undefined) {
    layerFieldsHeaders = currentlyShownLayer.header.vesselFields;
  }
  return {
    currentlyShownVessel: state.vesselInfo.currentlyShownVessel,
    layerFieldsHeaders,
    infoPanelStatus: state.vesselInfo.infoPanelStatus,
    userPermissions: state.user.userPermissions
  };
}

const mapDispatchToProps = dispatch => ({
  login: () => {
    dispatch(login());
  },
  hide: () => {
    dispatch(clearVesselInfo());
  },
  onTogglePin: (seriesgroup) => {
    dispatch(toggleActiveVesselPin());
    dispatch(setRecentVesselHistory(seriesgroup));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VesselInfoPanel);
