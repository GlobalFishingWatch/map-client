import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import Modal from 'components/Shared/Modal';
import Checkbox from 'components/Shared/Checkbox';
import ColorPicker from 'components/Shared/ColorPicker';
import ButtonStyles from 'styles/components/button.scss';
import OuterModalStyles from 'styles/components/shared/modal.scss';
import ModalStyles from 'styles/components/map/modal.scss';

import ItemList from 'styles/components/map/item-list.scss';


class FleetsModal extends Component {
  componentWillReceiveProps(nextProps) {
    const { fleet, onTitleChange } = this.props;
    const nextFleet = nextProps.fleet;
    // if defaultTitle generated in reducer changed,
    // and if user did not changed from the default title
    // (title is the same as the previously generated title)
    // force trigger a title change with the generated name
    if (fleet.defaultTitle !== nextFleet.defaultTitle
        && fleet.title === fleet.defaultTitle) {
      onTitleChange(nextFleet.defaultTitle);
    }
  }
  renderFooter() {
    const { fleet, onBreakApart } = this.props;
    const disableSave = fleet.vessels.length <= 1;
    return (
      <div className={OuterModalStyles.footerContainer}>
        {fleet.isNew !== true &&
          <button
            className={classnames(
              ButtonStyles.button,
              ButtonStyles._big, OuterModalStyles.mainButton)}
            onClick={onBreakApart}
          >
            Break apart group
          </button>
        }
        <button
          className={classnames(
            ButtonStyles.button, ButtonStyles._filled,
            ButtonStyles._big, OuterModalStyles.mainButton, {
              [ButtonStyles._disabled]: disableSave
            })}
          onClick={this.props.onSaveClicked}
        >
          Save
        </button >
      </div >
    );
  }

  renderVesselList() {
    const { fleet, fleets, vessels } = this.props;
    const pinnedVessels = vessels.filter(vessel => vessel.pinned);
    return pinnedVessels.map((vessel, i) => {
      const belongsToOtherFleet = fleets
        .filter(f => f.id !== fleet.id)
        .map(f => f.vessels.indexOf(vessel.seriesgroup) > -1)
        .some(f => f === true);
      const belongsToThatFleet = fleet.vessels.indexOf(vessel.seriesgroup) > -1;

      return (
        <li
          className={classnames([ItemList.listItem, ItemList._baseline, ItemList._noPadding])}
          key={i}
        >
          <Checkbox
            classNames="-spaced"
            key={vessel.seriesgroup}
            id={`fleetedit-${vessel.seriesgroup}`}
            label={vessel.title}
            labelClassNames={ModalStyles.itemTitle}
            callback={() => this.props.onVesselChecked(vessel.seriesgroup)}
            checked={belongsToThatFleet}
            disabled={belongsToOtherFleet}
          />
        </li>
      );
    });
  }

  renderForm() {
    const { fleet } = this.props;
    return (<div>
      <h3 className={ModalStyles.title}>{fleet.isNewFilter ? 'Create vessel group' : 'Edit vessel group'}</h3>
      <div className={ModalStyles.optionsContainer}>
        <div className={ModalStyles.section} >
          <div className={ModalStyles.sectionTitle} >
            Select the vessels for this group:
          </div>
          <div className={ItemList.wrapper}>
            <ul>
              {this.renderVesselList()}
            </ul>
          </div>
        </div>
        <div className={ModalStyles.section}>
          <div className={ModalStyles._bottomPadding}>
            <ColorPicker
              id={'filter-color'}
              color={fleet.color}
              onTintChange={this.props.onTintChange}
            />
          </div>
          <div className={ModalStyles.sectionTitle}>
            <label htmlFor="name">Group name:</label>
          </div>
          <input
            type="text"
            name="name"
            onChange={(event) => { this.props.onTitleChange(event.target.value); }}
            className={ModalStyles.nameInput}
            placeholder="Group Name"
            value={fleet.title}
          />
        </div>
      </div>
    </div>);
  }

  render() {
    const { opened, close } = this.props;

    return (
      <Modal
        opened={opened}
        close={close}
        visible
        closeable
        isSmall
        isScrollable
        footer={this.renderFooter()}
      >
        {this.renderForm()}
      </Modal >
    );
  }
}

FleetsModal.propTypes = {
  fleet: PropTypes.object,
  fleets: PropTypes.array,
  vessels: PropTypes.array,
  opened: PropTypes.bool,
  close: PropTypes.func,
  onSaveClicked: PropTypes.func,
  onBreakApart: PropTypes.func,
  onVesselChecked: PropTypes.func,
  onTintChange: PropTypes.func,
  onTitleChange: PropTypes.func
};

export default FleetsModal;
