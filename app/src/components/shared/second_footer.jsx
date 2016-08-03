import React from 'react';
import footerblack from '../../../styles/components/c_second_footer.scss';
import logogfwhor from '../../../assets/logos/gfw_logo_hor_white.png';

export default function (props) {
  return (
    <div className={footerblack.c_second_footer}>
      <img src={logogfwhor}></img>
    </div>
  );
}
