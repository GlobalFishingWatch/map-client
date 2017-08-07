/* eslint-disable max-len  */

import React, { Component } from 'preact';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { REPORT_STATUS } from 'constants';
import iconStyles from 'styles/icons.scss';
import ReportPanelStyles from 'styles/components/map/report-panel.scss';

import RemovePolygonIcon from 'babel!svg-react!assets/icons/delete-icon.svg?name=RemovePolygonIcon';
import AlertIcon from 'babel!svg-react!assets/icons/alert.svg?name=AlertIcon';


class ReportPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      expanded: true
    };
  }

  onTogglePanel() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    if (this.props.visible === false) return null;

    const panelClass = this.state.expanded && window.innerWidth >= 1024 ?
      classnames(ReportPanelStyles.reportPanel, ReportPanelStyles._minimized, {
        [ReportPanelStyles._noFooter]: !COMPLETE_MAP_RENDER
      }) : classnames(ReportPanelStyles.reportPanel, {
        [ReportPanelStyles._noFooter]: !COMPLETE_MAP_RENDER
      });

    const containerClass = this.state.expanded ?
      classnames(ReportPanelStyles.container, ReportPanelStyles._expanded) : ReportPanelStyles.container;

    const toggleClass = this.state.expanded ?
      ReportPanelStyles.toggle : classnames(ReportPanelStyles.toggle, ReportPanelStyles._expanded);

    let content;

    if (this.props.status === REPORT_STATUS.sent || this.props.status === REPORT_STATUS.error) {
      content = (<li className={ReportPanelStyles.polygonItem}>
        <span className={ReportPanelStyles.polygonMessage}>{this.props.statusText}</span>
      </li>);
    } else if (this.props.polygons.length) {
      content = [];
      this.props.polygons.map((polygon, index) => (
        content.push((
          <li className={ReportPanelStyles.polygonItem} key={polygon.id}>
            <span className={ReportPanelStyles.polygonName}>{polygon.name}</span>
            <span className={ReportPanelStyles.polygonRemove}>
              <RemovePolygonIcon
                className={classnames(iconStyles.icon, ReportPanelStyles.iconRemovePolygon)}
                id={polygon.id}
                onClick={() => this.props.onRemovePolygon(index)}
              />
            </span>
          </li>
        ))
      ));
    } else {
      content = (<li className={ReportPanelStyles.polygonItem}>
        <span className={ReportPanelStyles.polygonName}>No regions added yet.<br /> Select regions on the map.</span>
      </li>);
    }

    let buttons;
    if (this.props.status === REPORT_STATUS.idle || this.props.status === REPORT_STATUS.error) {
      buttons = (<div className={ReportPanelStyles.reportOptions}>
        <button className={ReportPanelStyles.reportButton} onClick={this.props.onSendReport}>send report</button>
        <button className={ReportPanelStyles.reportButton} onClick={this.props.onDiscardReport}>discard</button>
      </div>);
    } else if (this.props.status === REPORT_STATUS.sent) {
      buttons = (<div className={ReportPanelStyles.reportOptions}>
        <button className={classnames(ReportPanelStyles.reportButton, ReportPanelStyles._wide)} onClick={this.props.onReportClose}>close</button>
      </div>);
    }

    return (
      <div className={panelClass}>
        <div className={ReportPanelStyles.menu} onClick={() => this.onTogglePanel()}>
          <span className={ReportPanelStyles.reportTotal}>{this.props.layerTitle}: {this.props.polygons.length} added</span>
          <span className={toggleClass} />
        </div>
        <div className={containerClass}>
          <div className={ReportPanelStyles.content}>
            <ul className={ReportPanelStyles.polygonList}>
              {content}
            </ul>
            {this.props.reportableInfo.hasNonReportableLayers &&
            <div className={ReportPanelStyles.warning}>
              <AlertIcon className={ReportPanelStyles.warningIcon} />
              {this.props.reportWarning.replace('$REPORTABLE_LAYERS', this.props.reportableInfo.reportableLayersNames)}
            </div>
            }
          </div>
          {buttons}
        </div>
      </div>
    );
  }
}

ReportPanel.defaultProps = {
  polygons: []
};

ReportPanel.propTypes = {
  onReportClose: PropTypes.func,
  onDiscardReport: PropTypes.func,
  onRemovePolygon: PropTypes.func,
  onSendReport: PropTypes.func,
  polygons: PropTypes.array,
  layerTitle: PropTypes.string,
  visible: PropTypes.bool,
  status: PropTypes.string,
  statusText: PropTypes.string,
  reportWarning: PropTypes.string,
  reportableInfo: PropTypes.object
};

export default ReportPanel;
