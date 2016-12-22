/* eslint-disable max-len  */

import React, { Component } from 'react';
import classnames from 'classnames';

import ReportPanelStyles from 'styles/components/map/c-report-panel.scss';

class ReportPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.polygons.length,
      expanded: this.props.polygons.length
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.polygons.length,
      expanded: nextProps.polygons.length
    });
  }

  onRemovePolygon(event) {
    const id = event.currentTarget.getAttribute('id');

    this.props.onRemovePolygon(id);
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

    const containerClass = this.state.expanded && window.innerWidth < 1024 ?
      ReportPanelStyles.container : classnames(ReportPanelStyles.container, ReportPanelStyles['-expanded']);

    const toggleClass = this.state.expanded ?
      ReportPanelStyles.toggle : classnames(ReportPanelStyles.toggle, ReportPanelStyles['-expanded']);

    if (!!this.props.polygons && this.props.polygons.length) {
      this.props.polygons.map(polygon => (
        polygonItems.push((
          <li className={ReportPanelStyles['polygon-item']} key={polygon.id}>
            <span className={ReportPanelStyles['polygon-name']}>{polygon.name}</span>
            <span id={polygon.id} className={ReportPanelStyles['polygon-remove']}></span>
          </li>
        ))
      ));
    }

    return (
      <div className={panelClass}>
        <div className={ReportPanelStyles.menu}>
          <span className={ReportPanelStyles['report-total']}>{this.props.polygons.length} layers added</span>
          <span className={toggleClass} onClick={() => this.onTogglePanel()} />
        </div>
        <div className={containerClass}>
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
