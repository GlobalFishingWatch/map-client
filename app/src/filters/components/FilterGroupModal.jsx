import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FilterGroupForm from 'filters/containers/FilterGroupForm';
import Modal from 'components/Shared/Modal';
import ButtonStyles from 'styles/components/button.scss';
import ModalStyles from 'styles/components/shared/modal.scss';
import classnames from 'classnames';

class FilterGroupModal extends Component {
  constructor() {
    super();
    this.state = {
      validated: false
    };
  }

  componentDidUnmount() {
    this.setState({ validated: false });
  }

  setValidated(value) {
    this.setState({ validated: value });
  }

  onClickSave() {
    if (this.props.warning === undefined || this.state.validated === true) {
      this.props.onSaveClicked();
    }
    this.setState({ validated: !this.state.validated });
  }

  onClickChangeSelection() {
    this.setState({ validated: false });
  }

  renderFooter() {
    const { displayWarning, disableSave } = this.props;
    return (
      <div className={ModalStyles.footerContainer}>
        {displayWarning &&
          <button
            className={classnames(
              ButtonStyles.button,
              ButtonStyles._big, ModalStyles.mainButton, {
                [ButtonStyles._disabled]: disableSave
              })}
            onClick={() => this.onClickChangeSelection()}
          >
            Change selection
          </button>
        }
        <button
          className={classnames(
            ButtonStyles.button, ButtonStyles._filled,
            ButtonStyles._big, ModalStyles.mainButton, {
              [ButtonStyles._disabled]: disableSave
            })}
          onClick={() => this.onClickSave()}
        >
          Save
        </button>
      </div>
    );
  }

  setDisplayWarning(value) {
    this.setState({ displayWarning: value });
  }

  setDisabledSave(value) {
    this.setState({ disableSave: value });
  }

  render() {
    const { opened, close, warning } = this.props;
    const displayedWarning = warning !== undefined && this.state.validated === true ? warning : null;
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
        <FilterGroupForm
          {...this.props}
          warning={displayedWarning}
          validated={this.state.validated}
        />
      </Modal >
    );
  }
}

FilterGroupModal.propTypes = {
  opened: PropTypes.bool,
  close: PropTypes.func,
  onSaveClicked: PropTypes.func,
  displayWarning: PropTypes.bool,
  disableSave: PropTypes.bool,
  warning: PropTypes.string
};

export default FilterGroupModal;
