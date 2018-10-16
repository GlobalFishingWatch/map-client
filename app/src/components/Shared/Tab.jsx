import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import tabStyles from 'styles/components/shared/tab.scss';

function Tab({ options, selectedIndex, handleTabIndexChange, style }) {
  return (
    <div className={classnames(tabStyles.tab, { [style]: style !== undefined })}>
      {options.map((option, i) => (
        <div
          key={i}
          className={classnames(tabStyles.tabHeader, { [tabStyles.active]: selectedIndex === i })}
          onClick={() => handleTabIndexChange(i)}
        >
          {option}
        </div>
      ))}
    </div>
  );
}

Tab.propTypes = {
  options: PropTypes.array.isRequired,
  selectedIndex: PropTypes.number.isRequired,
  handleTabIndexChange: PropTypes.func.isRequired,
  style: PropTypes.string
};

export default Tab;
