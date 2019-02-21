import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import ControlPanel from 'mapPanels/rightControlPanel/containers/ControlPanel';
import Timebar from 'timebar/containers/Timebar';
import ReportPanel from 'report/containers/ReportPanel';
import MapFooter from 'siteNav/components/MapFooter';
import LeftControlPanel from 'mapPanels/leftControlPanel/containers/LeftControlPanel';
import MapPanelsStyles from 'styles/components/map-panels.scss';
import MapDashboardStyles from 'map/components/mapDashboard.scss';
import MapWrapper from 'map/containers/MapWrapper';

class MapDashboard extends Component {
  state = {
    attributions: []
  }
  onAttributionsChange = (attributions) => {
    this.setState({ attributions });
  }
  render() {
    const {
      isEmbedded,
      openSupportFormModal,
      onExternalLink,
      onToggleMapPanelsExpanded,
      mapPanelsExpanded,
      isWorkspaceLoaded
    } = this.props;
 
    const { attributions } = this.state;
    const fullScreenMap = COMPLETE_MAP_RENDER === false;
    return (<div className="fullHeightContainer" >
      {(!isEmbedded) &&
      <div
        className={classnames(
          MapPanelsStyles.mapPanels,
          {
            [MapPanelsStyles._noFooter]: fullScreenMap,
            [MapPanelsStyles._expanded]: mapPanelsExpanded
          }
        )}
      >
        <div className={MapPanelsStyles.expandButton} onClick={onToggleMapPanelsExpanded} />
        <ControlPanel isEmbedded={isEmbedded} />
        <ReportPanel />
      </div>
      }
      <div
        className={classnames(
          MapDashboardStyles.mapContainer,
          { [MapDashboardStyles._noFooter]: fullScreenMap }
        )}
        ref={(mapContainerRef) => {
          this.mapContainerRef = mapContainerRef;
        }}
      >
        {isWorkspaceLoaded === true &&
          <MapWrapper
            onAttributionsChange={this.onAttributionsChange}
          />
        }
        <LeftControlPanel />
      </div>
      <div className={classnames(MapDashboardStyles.timebarContainer, { [MapDashboardStyles._noFooter]: fullScreenMap })} >
        <Timebar />
      </div>
      {fullScreenMap === false &&
        <MapFooter
          onOpenSupportFormModal={openSupportFormModal}
          isEmbedded={isEmbedded}
          onExternalLink={onExternalLink}
          attributions={attributions}
        />
      }
    </div >);
  }
}

MapDashboard.propTypes = {
  isEmbedded: PropTypes.bool,
  mapPanelsExpanded: PropTypes.bool,
  onExternalLink: PropTypes.func,
  openSupportFormModal: PropTypes.func,
  onToggleMapPanelsExpanded: PropTypes.func,
  isWorkspaceLoaded: PropTypes.bool
};

export default MapDashboard;
