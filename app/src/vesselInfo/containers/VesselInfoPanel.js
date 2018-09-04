import { connect } from 'react-redux';
import VesselInfoPanel from 'vesselInfo/components/VesselInfoPanel';
import { clearVesselInfo, toggleActiveVesselPin, targetCurrentlyShownVessel } from 'vesselInfo/vesselInfoActions';
import { setEncountersInfo } from 'encounters/encountersActions';
import { login } from 'user/userActions';

const mapStateToProps = (state) => {
  const vesselInfo = state.vesselInfo.currentlyShownVessel;
  const currentlyShownLayer = state.layers.workspaceLayers
    .find(layer => vesselInfo && layer.tilesetId === vesselInfo.tilesetId);

  let layerFieldsHeaders;
  let layerIsPinable = true;
  if (
    currentlyShownLayer !== undefined &&
    currentlyShownLayer.header !== undefined) {
    if (currentlyShownLayer.header.info.fields !== undefined) {
      layerFieldsHeaders = currentlyShownLayer.header.info.fields;
    }
    if (currentlyShownLayer.header.pinable === false) {
      layerIsPinable = false;
    }
  }

  return {
    vesselInfo,
    layerFieldsHeaders,
    layerIsPinable,
    status: state.vesselInfo.infoPanelStatus,
    userPermissions: state.user.userPermissions
  };
};

const mapDispatchToProps = dispatch => ({
  login: () => {
    dispatch(login());
  },
  hide: () => {
    dispatch(clearVesselInfo());
  },
  onTogglePin: (seriesgroup) => {
    dispatch(toggleActiveVesselPin(seriesgroup));
  },
  showParentEncounter: (encounter) => {
    dispatch(clearVesselInfo());
    dispatch(setEncountersInfo(encounter.seriesgroup, encounter.tilesetId));
  },
  targetVessel: () => {
    dispatch(targetCurrentlyShownVessel());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VesselInfoPanel);
