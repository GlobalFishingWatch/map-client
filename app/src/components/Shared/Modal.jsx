import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import ModalStyles from 'styles/components/shared/modal.scss';
import Icon from '-!babel-loader!svg-react-loader!assets/icons/close.svg?name=Icon';

class Modal extends React.Component {

  constructor(props) {
    super(props);

    this.onKeyDown = (e) => {
      if (e.keyCode !== 27) {
        return;
      }
      e.preventDefault();
      this.props.close();
    };

    /* If the modal is opened at instantiation, we want the keydown handler to be active */
    if (props.opened) {
      document.addEventListener('keydown', this.onKeyDown);
      document.body.classList.add(ModalStyles._noBgOverlay);
    }
  }

  shouldComponentUpdate(nextProps) {
    /* We attach the keydown handler only if the modal gets to be visible */
    if (!this.props.opened && nextProps.opened) {
      document.addEventListener('keydown', this.onKeyDown);
      document.body.classList.add(ModalStyles._noBgOverlay);
    } else if (this.props.opened && !nextProps.opened) {
      document.body.classList.remove(ModalStyles._noBgOverlay);
    }

    return true;
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
    document.body.classList.remove(ModalStyles._noBgOverlay);
  }

  onClickOverlay(e) {
    if (this.props.closeable && e.target === e.currentTarget) {
      this.props.close();
    }
  }

  render() {
    if (!this.props.opened || !this.props.visible) return null;

    let closeButton;
    const customStyles = {
      zIndex: this.props.zIndex || null
    };

    if (this.props.closeable) {
      closeButton = (<button className={ModalStyles.closeButton} onClick={() => this.props.close()}>
        <Icon className={ModalStyles.icon} title="Close this modal" />
      </button>);
    }

    return (
      <div
        style={customStyles}
        className={classnames(ModalStyles.modal, { [ModalStyles._small]: this.props.isSmall })}
        onClick={e => this.onClickOverlay(e)}
      >
        <div
          className={ModalStyles.content}
          onClick={e => this.onClickOverlay(e)}
        >
          <div className={ModalStyles.containContent}>
            <div className={ModalStyles.containButton}>
              {closeButton}
            </div>
            <div className={ModalStyles.containPadding}>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }

}

Modal.propTypes = {
  /**
   * The callback method when closing the modal
   */
  close: PropTypes.func.isRequired,
  /**
   * Define whether the modal is opened or not
   */
  opened: PropTypes.bool.isRequired,
  /**
   * Define whether the modal is visible
   */
  visible: PropTypes.bool.isRequired,
  /**
   * Define the content of the modal
   * Required
   */
  children: PropTypes.any,
  /**
   * Define the modal box can be closed by the user
   * Required
   */
  closeable: PropTypes.bool,
  /**
   * Sets z-index of the modal
   */
  isSmall: PropTypes.bool,
  zIndex: PropTypes.number
};


export default Modal;
