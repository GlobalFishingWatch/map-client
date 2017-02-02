import React from 'react';
import classnames from 'classnames';
import styles from 'styles/components/shared/c-modal.scss';
import Icon from 'babel!svg-react!assets/icons/close.svg?name=Icon';

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
    }
  }

  shouldComponentUpdate(nextProps) {
    /* We attach the keydown handler only if the modal gets to be visible */
    if (!this.props.opened && nextProps.opened) {
      document.addEventListener('keydown', this.onKeyDown);
    }

    return true;
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onClickOverlay(e) {
    if (this.props.closeable && e.target === e.currentTarget) {
      this.props.close();
    }
  }

  render() {
    if (!this.props.opened) {
      return null;
    }

    let closeButton;
    const customStyles = {
      zIndex: this.props.zIndex || null
    };

    if (this.props.closeable) {
      closeButton = (<button className={styles['close-button']} onClick={() => this.props.close()}>
        <Icon className={styles.icon} title="Close this modal" />
      </button>);
    }

    return (
      <div
        style={customStyles}
        className={classnames(styles['c-modal'], { [styles['-small']]: this.props.isSmall })}
        onClick={e => this.onClickOverlay(e)}
      >
        <div
          className={styles.content}
          onClick={e => this.onClickOverlay(e)}
        >
          <div className={styles['contain-content']}>
            <div className={styles['contain-button']}>
              {closeButton}
            </div>
            <div className={styles['contain-padding']}>
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
  close: React.PropTypes.func.isRequired,
  /**
   * Define whether the modal is opened or not
   */
  opened: React.PropTypes.bool.isRequired,
  /**
   * Define the content of the modal
   * Required
   */
  children: React.PropTypes.any,
  /**
   * Define the modal box can be closed by the user
   * Required
   */
  closeable: React.PropTypes.bool,
  /**
   * Sets z-index of the modal
   */
  isSmall: React.PropTypes.bool,
  zIndex: React.PropTypes.number
};


export default Modal;
