import React, { Component } from 'react';
import Rhombus from 'components/Shared/Rhombus';
import classnames from 'classnames';

import PaginatorStyles from 'styles/components/shared/c-paginator.scss';

class Paginator extends Component {

  render() {
    return (
      <div className={PaginatorStyles['c-paginator']}>
        <Rhombus
          className={PaginatorStyles.previous}
        />
        <ul className={PaginatorStyles['page-list']}>
          <li className={classnames(PaginatorStyles['page-item'], PaginatorStyles['-current'])}>1</li>
          <li className={PaginatorStyles['page-item']}>2</li>
          <li className={PaginatorStyles['page-item']}>3</li>
          <li className={PaginatorStyles['page-item']}>4</li>
          <li className={PaginatorStyles['page-item']}>...</li>
          <li className={PaginatorStyles['page-item']}>23</li>
        </ul>
        <Rhombus
          className={PaginatorStyles.next}
        />
      </div>);
  }

}

export default Paginator;
