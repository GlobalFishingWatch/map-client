import React from 'react';
import LeyendStyles from 'styles/components/leyend.scss';

function Leyend() {
  return (
    <div className={LeyendStyles.leyend} >
      <ul>
        <li className={LeyendStyles.leyendText}>
          <span>
            Less Fishing
          </span>
          <span>
            More Fishing
          </span>
        </li>
        <li className={LeyendStyles.leyendOvals}>
          <span className={LeyendStyles.lessFishingOval} />
          <span className={LeyendStyles.line} />
          <span className={LeyendStyles.moreFishingOval} />
        </li>
      </ul>
    </div >
  );
}

export default Leyend;
