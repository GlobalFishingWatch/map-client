import React from 'react';
import PropTypes from 'prop-types';
import LegendStyles from 'styles/components/legend.scss';
import classnames from 'classnames';

function Legend({ isEmbedded }) {
  return (
    <div className={classnames(LegendStyles.legend, { [LegendStyles._isEmbedded]: isEmbedded })} >
      <ul>
        <li className={LegendStyles.legendText}>
          <span>
            Less Fishing
          </span>
          <span>
            More Fishing
          </span>
        </li>
        <li className={LegendStyles.legendOvals}>
          <span className={LegendStyles.lessFishingOval} />
          <span className={LegendStyles.line} />
          <span className={LegendStyles.moreFishingOval} />
        </li>
      </ul>
    </div >
  );
}

Legend.propTypes = {
  isEmbedded: PropTypes.bool.isRequired
};

export default Legend;
