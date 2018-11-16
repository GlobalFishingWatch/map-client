import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import convert from '@globalfishingwatch/map-convert';
import { LAYER_TYPES } from 'constants';
import { FORMAT_DATE } from 'config';
import PopupStyles from 'styles/components/map/popup.scss';
import moment from 'moment';

const getWorkspaceLayers = state => state.layers.workspaceLayers;
const getEvent = (state, ownProps) => ownProps.event;

const getPopupData = createSelector(
  [getWorkspaceLayers, getEvent],
  (workspaceLayers, event) => {
    const workspaceLayer = workspaceLayers.find(l => l.id === event.layer.id);
    if (event.type === 'static') {
      return {
        layerTitle: workspaceLayer.title,
        featureTitle: event.target.featureTitle
      };
    } else if (event.type === 'activity') {
      let featureTitle;
      const objects = event.target.objects;

      if (event.layer.subtype === LAYER_TYPES.Encounters) {
        const foundVessel = objects[0];
        if (foundVessel.timeIndex) {
          const date = new Date(convert.getTimestampFromOffsetedtTimeAtPrecision(foundVessel.timeIndex));
          featureTitle = moment(date).format(FORMAT_DATE);
        }
      } else {
        const numVessels = (objects === undefined) ? 'multiple' : objects.length;
        const vesselPlural = (objects === undefined || objects.length > 1) ? 'objects' : 'object';
        featureTitle = `${numVessels} ${vesselPlural} at this location`;
      }
      return {
        layerTitle: workspaceLayer.title,
        featureTitle
      };
    }
    return null;
  }
);

const mapStateToProps = (state, ownProps) => ({
  popup: getPopupData(state, ownProps)
});

const HoverPopup = (props) => {
  return (<div className={classnames(PopupStyles.popup, PopupStyles._compact)}>
    {props.popup.layerTitle}: {props.popup.featureTitle}
  </div>);
};

export default connect(mapStateToProps)(HoverPopup);
