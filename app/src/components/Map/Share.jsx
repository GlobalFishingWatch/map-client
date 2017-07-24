import PropTypes from 'prop-types';
import React, { Component } from 'preact';
import classnames from 'classnames';
import ShareStyles from 'styles/components/map/c-share.scss';
import iconStyles from 'styles/icons.scss';
import FacebookIcon from 'babel!svg-react!assets/icons/facebook.svg?name=FacebookIcon';
import TwitterIcon from 'babel!svg-react!assets/icons/twitter.svg?name=TwitterIcon';
import GooglePlusIcon from 'babel!svg-react!assets/icons/google-plus.svg?name=GooglePlusIcon';
import { EMBED_SIZE_SETTINGS, DEFAULT_EMBED_SIZE } from 'constants';

class Share extends Component {

  constructor(props) {
    super(props);

    this.state = {
      copied: false,   // If the input's content has been copied
      copyError: false, // If the copy action failed
      display: 'link',
      embedSizeName: DEFAULT_EMBED_SIZE
    };
  }

  setDisplay(display) {
    this.setState({
      display
    });
  }

  /**
   * Copy the input's content into the clipboard and set the state's "copied"
   * attribute to true. If the action failed, set the "copyError" attribute to
   * true. After few milliseconds, the "copied" attribute is resetted to false
   * to display a quick visual feedback.
   *
   * @param {object} e - click event on the button
   */
  onCopy(e) {
    e.preventDefault();

    this.input.select();

    let error = false;
    try {
      if (!document.execCommand('copy')) error = true;
    } catch (err) {
      error = true;
    }

    this.setState({
      copied: !error,
      error
    });

    /* We want the copied state to only last few millisecond to display a visual
     * feedback */
    if (!error) setTimeout(() => this.setState({ copied: false }), 1000);
  }

  /**
   * Return the URL of the page with the workspace id included
   *
   * @returns {string} URL
   */
  getURLWithWorkspace() {
    if (SHARE_BASE_URL) {
      return SHARE_BASE_URL.replace('{workspace_id}', this.props.workspaceId);
    }
    return `${location.origin}${location.pathname.replace(/\/$/g, '')}/?workspace=${this.props.workspaceId}`;
  }

  updateEmbedSize(event) {
    this.setState({
      embedSizeName: event.target.value
    });
  }

  openFacebook() {
    const url = this.getURLWithWorkspace();

    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
  }

  openGooglePlus() {
    const url = this.getURLWithWorkspace();

    window.open(`https://plus.google.com/share?url=${url}`);
  }

  openTwitter() {
    const url = this.getURLWithWorkspace();

    window.open(`https://twitter.com/share?url=${url}`);
  }

  renderSocialNetworks() {
    return (
      <div className={ShareStyles['social-links']} >
        <button
          className={classnames(ShareStyles['social-button'], ShareStyles['-facebook'])}
          onClick={e => this.openFacebook(e)}
        >
          <span className={ShareStyles['button-container']} >
            <FacebookIcon className={classnames(iconStyles.icon, ShareStyles['facebook-icon'])} />
            <span className={ShareStyles['button-text']} >facebook</span>
          </span>
        </button>
        <button
          className={classnames(ShareStyles['social-button'], ShareStyles['-googleplus'])}
          onClick={e => this.openGooglePlus(e)}
        >
          <span className={ShareStyles['button-container']} >
            <GooglePlusIcon className={classnames(iconStyles.icon, ShareStyles['google-plus-icon'])} />
            <span className={ShareStyles['button-text']} >Google</span>
          </span>
        </button>
        <button
          className={classnames(ShareStyles['social-button'], ShareStyles['-twitter'])}
          onClick={e => this.openTwitter(e)}
        >
          <span className={ShareStyles['button-container']} >
            <TwitterIcon className={classnames(iconStyles.icon, ShareStyles['twitter-icon'])} />
            <span className={ShareStyles['button-text']} >Twitter</span>
          </span>
        </button>
      </div>
    );
  }

  renderLink() {
    const url = this.getURLWithWorkspace();
    return (
      <div className={ShareStyles.content} >
        <p className={ShareStyles.intro} >
          Copy and paste the link into an email or IM
        </p>
        <form>
          <input
            className={ShareStyles['share-input']}
            type="text"
            readOnly
            value={url}
            ref={(input) => { this.input = input; }}
          />
          <button className={ShareStyles['copy-button']} type="submit" onClick={e => this.onCopy(e)} >
            {this.state.copied ? 'Copied!' : 'Copy'}
          </button>
        </form>
      </div>
    );
  }

  renderEmbed() {
    // TODO share url should be built in a more centralized wayee from a reducer
    const url = this.getURLWithWorkspace();
    const urlSeparator = (url.match(/\?/gi)) ? '&' : '?';
    const size = EMBED_SIZE_SETTINGS.find(elem => elem.name === this.state.embedSizeName);
    const embed = `<iframe allowfullscreen="true"
    width="${size.width}" height="${size.height}" src="${url}${urlSeparator}embedded=true" />`;

    const selectOptions = EMBED_SIZE_SETTINGS.map(option => (
      <option key={option.name} value={option.name} >{option.name} ({option.width}x{option.height})</option>)
    );

    return (
      <div className={ShareStyles.content} >
        <form>

          <div className={ShareStyles['embed-container']} >
            <p className={ShareStyles.intro} >
              Embed Size
            </p>
            <select
              className={ShareStyles['share-input']}
              onChange={event => this.updateEmbedSize(event)}
              value={this.state.embedSizeName}
            >
              {selectOptions}
            </select>
          </div>
          <div className={ShareStyles['embed-container']} >
            <p className={ShareStyles.intro} >
              Embed in your site
            </p>
            <div>
              <input
                className={ShareStyles['share-input']}
                type="text"
                readOnly
                value={embed}
                ref={(input) => { this.input = input; }}
              />
              <button className={ShareStyles['copy-button']} type="submit" onClick={e => this.onCopy(e)} >
                {this.state.copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  render() {
    if (this.props.error) {
      return (
        <div className={ShareStyles['c-share']} >
          <h2 className={ShareStyles.title} >Share this map</h2>
          <p>
            Sorry, an error prevented the workspace to be saved. Try again.
          </p>
        </div>
      );
    }


    if (!this.props.workspaceId) {
      return (
        <div className={ShareStyles['c-share']} >
          <h2 className={ShareStyles.title} >Share this map</h2>
          <p>
            Saving your workspace...
          </p>
        </div>
      );
    }

    const copyError = (
      <p className={ShareStyles['copy-error']} >
        Sorry, the link couldn&#39;t be copied. Please right click on the input and copy it manually.
      </p>
    );
    const socialNetworks = this.renderSocialNetworks();

    return (
      <div className={ShareStyles['c-share']} >
        <h2 className={ShareStyles.title} >Share this map</h2>
        <div className={ShareStyles['content-switcher']} >
          <span
            className={classnames(ShareStyles['content-option'],
              { [`${ShareStyles['-selected']}`]: this.state.display === 'link' })}
            onClick={() => this.setDisplay('link')}
          >
              Link
          </span>
          <span
            className={classnames(ShareStyles['content-option'],
              {
                [`${ShareStyles['-selected']}`]: this.state.display === 'embed'
              })}
            onClick={() => this.setDisplay('embed')}
          >
            Embed
          </span>
        </div>
        {this.state.display === 'link' && this.renderLink()}
        {this.state.display === 'embed' && this.renderEmbed()}
        <div className={ShareStyles.separator} >
          <span className={ShareStyles['word-separator']} >or</span>
        </div>
        {socialNetworks}
        {this.state.error && copyError}
      </div>
    );
  }

}

Share.propTypes = {
  /**
   * Id of the created workspace
   */
  workspaceId: PropTypes.string,
  /**
   * Possible error due to failed request to save the workspace
   */
  error: PropTypes.string
};

export default Share;
