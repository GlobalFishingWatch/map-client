import React, { Component } from 'react';
import classnames from 'classnames';

import ModalStyles from 'styles/components/shared/c-modal.scss';
import ResultListStyles from 'styles/components/shared/c-result-list.scss';
import SearchModalStyles from 'styles/components/map/c-search-modal.scss';
import iconsStyles from 'styles/icons.scss';

import SearchIcon from 'babel!svg-react!assets/icons/search-icon.svg?name=SearchIcon';
import CloseIcon from 'babel!svg-react!assets/icons/close.svg?name=CloseIcon';

class SearchModal extends Component {

  render() {
    return (
      <div className={SearchModalStyles['c-search-modal']}>
        <h3 className={ModalStyles['modal-title']}>Search vessel</h3>
        <div className={SearchModalStyles['search-container']}>
          <div className={SearchModalStyles['search-input-container']}>
            <input
              className={SearchModalStyles['search-input']}
              placeholder="Search vessel"
            />
            <SearchIcon
              className={classnames(iconsStyles.icon, SearchModalStyles['search-icon'])}
            />
            <CloseIcon
              className={classnames(iconsStyles.icon, iconsStyles['icon-close'], SearchModalStyles['delete-icon'])}
            />
          </div>
          <ul className={classnames(ResultListStyles['c-result-list'], SearchModalStyles['search-result-list'])}>
            <li className={ResultListStyles['result-item']}>
              <span className={ResultListStyles.highlight}>JOVE</span>
              ,MMSI0112345
            </li>
            <li className={classnames(ResultListStyles['result-item'], SearchModalStyles['search-result-item'])}>
              <span className={ResultListStyles.highlight}>JOVE</span>
              ,MMSI0112345
            </li>
            <li className={ResultListStyles['result-item']}>
              <span className={ResultListStyles.highlight}>JOVE</span>
              ,MMSI0112345
            </li>
            <li className={ResultListStyles['result-item']}>
              <span className={ResultListStyles.highlight}>JOVE</span>
              ,MMSI0112345
            </li>
            <li className={ResultListStyles['result-item']}>
              <span className={ResultListStyles.highlight}>JOVE</span>
              ,MMSI0112345
            </li>
            <li className={ResultListStyles['result-item']}>
              <span className={ResultListStyles.highlight}>JOVE</span>
              ,MMSI0112345
            </li>
            <li className={ResultListStyles['result-item']}>
              <span className={ResultListStyles.highlight}>JOVE</span>
              ,MMSI0112345
            </li>
            <li className={ResultListStyles['result-item']}>
              <span className={ResultListStyles.highlight}>JOVE</span>
              ,MMSI0112345
            </li>
            <li className={ResultListStyles['result-item']}>
              <span className={ResultListStyles.highlight}>JOVE</span>
              ,MMSI0112345
            </li>
            <li className={ResultListStyles['result-item']}>
              <span className={ResultListStyles.highlight}>JOVE</span>
              ,MMSI0112345
            </li>
            <li className={ResultListStyles['result-item']}>
              <span className={ResultListStyles.highlight}>JOVE</span>
              ,MMSI0112345
            </li>
            <li className={ResultListStyles['result-item']}>
              <span className={ResultListStyles.highlight}>JOVE</span>
              ,MMSI0112345
            </li>
          </ul>
        </div>
        <div className={SearchModalStyles['paginator-container']}>
          // Pagination component goes here
        </div>
      </div>);
  }
}

export default SearchModal;
