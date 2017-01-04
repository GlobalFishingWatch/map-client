/* eslint-disable max-len  */

import React, { Component } from 'react';
import classnames from 'classnames';

import iconStyles from 'styles/icons.scss';
import ReportPanelStyles from 'styles/components/map/c-report-panel.scss';

import RemovePolygonIcon from 'babel!svg-react!assets/icons/delete-icon.svg?name=RemovePolygonIcon';

class ReportPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.polygons.length > 0,
      expanded: this.props.polygons.length > 0
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.polygons.length > 0,
      expanded: nextProps.polygons.length > 0
    });
  }

  onTogglePanel() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    const polygonItems = [];

    if (!this.state.visible) return null;

    const panelClass = this.state.expanded && window.innerWidth >= 1024 ?
      classnames(ReportPanelStyles['c-report-panel'], ReportPanelStyles['-minimized']) : ReportPanelStyles['c-report-panel'];

    const containerClass = this.state.expanded ?
      classnames(ReportPanelStyles.container, ReportPanelStyles['-expanded']) : ReportPanelStyles.container;

    const toggleClass = this.state.expanded ?
      ReportPanelStyles.toggle : classnames(ReportPanelStyles.toggle, ReportPanelStyles['-expanded']);

    if (this.props.polygons.length) {
      this.props.polygons.map((polygon, index) => (
        polygonItems.push((
          <li className={ReportPanelStyles['polygon-item']} key={polygon.id}>
            <span className={ReportPanelStyles['polygon-name']}>{polygon.name}</span>
            <span className={ReportPanelStyles['polygon-remove']}>
              <RemovePolygonIcon
                className={classnames(iconStyles.icon, ReportPanelStyles['icon-remove-polygon'])}
                id={polygon.id}
                onClick={() => this.props.onRemovePolygon(index)}
              />
            </span>
          </li>
        ))
      ));
    }

    return (
      <div className={panelClass}>
        <div className={ReportPanelStyles.menu} onClick={() => this.onTogglePanel()}>
          <span className={ReportPanelStyles['report-total']}>{this.props.polygons.length} layers added</span>
          <span className={toggleClass} />
        </div>
        <div className={containerClass}>
          <div className={ReportPanelStyles.content}>
            {this.props.polygons.length &&
              <ul className={ReportPanelStyles['polygon-list']}>
                {polygonItems}
              </ul>}
          </div>
          <div className={ReportPanelStyles['report-options']}>
            <button className={ReportPanelStyles['report-button']} onClick={this.props.onSendReport}>send report</button>
            <button className={ReportPanelStyles['report-button']} onClick={this.props.onDiscardReport}>discard</button>
          </div>
        </div>
      </div>
    );
  }
}

ReportPanel.defaultProps = {
  polygons: []
};

ReportPanel.propTypes = {
  onDiscardReport: React.PropTypes.func,
  onRemovePolygon: React.PropTypes.func,
  onSendReport: React.PropTypes.func,
  polygons: React.PropTypes.array
};

export default ReportPanel;
