import React, { Component } from 'react';

import ReportPanelStyles from 'styles/components/map/c-report-panel.scss';

class ReportPanel extends Component {

  onRemovePolygon(event) {
    const id = event.currentTarget.getAttribute('id');

    this.props.onRemovePolygon(id);
  }

  render() {
    const polygonItems = [];

    if (!!this.props.polygons && this.props.polygons.length) {
      this.props.polygons.map(polygon => (
        polygonItems.push((
          <li className={ReportPanelStyles['polygon-item']}>
            <span className={ReportPanelStyles['polygon-name']}>{polygon.name}</span>
            <span id={polygon.id} className={ReportPanelStyles['polygon-remove']}></span>
          </li>
        ))
      ));
    }

    return (
      <div className={ReportPanelStyles['c-report-panel']}>
        <div className={ReportPanelStyles.menu}>
          <span className={ReportPanelStyles['report-total']}>{this.props.polygons.length} layers added</span>
          <span className={ReportPanelStyles.toggle} />
        </div>
        <div className={ReportPanelStyles.content}>
          {this.props.polygons.length &&
            <ul className={ReportPanelStyles['polygon-list']}>
              {polygonItems}
            </ul>}
        </div>
        <div className={ReportPanelStyles['report-options']}>
          <button className={ReportPanelStyles['report-button']}>send report</button>
          <button className={ReportPanelStyles['report-button']}>discard</button>
        </div>
      </div>
    );
  }
}

ReportPanel.defaultProps = {
  polygons: []
};

ReportPanel.propTypes = {
  polygons: React.PropTypes.array,
  onRemovePolygon: React.PropTypes.func
};

export default ReportPanel;
