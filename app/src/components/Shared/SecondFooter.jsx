import React from 'react';
import footerBlack from '../../../styles/components/c-second-footer.scss';
import logoGFWHorizontal from '../../../assets/logos/gfw_logo_hor_white.png';

export default function () {
  return (
    <div className={footerBlack.c_second_footer}>
      <img src={logoGFWHorizontal} alt="GFW logo" />
    </div>
  );
}
