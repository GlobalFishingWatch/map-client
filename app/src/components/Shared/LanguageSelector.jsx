import React, { Component } from 'react';
import cx from 'classnames';

import LanguageSelectorStyles from 'styles/components/shared/language-selector.scss';

class LanguageSelector extends Component {
  state = {
    languages: null,
    currentLng: null
  };

  componentDidMount = () => {
    if (window.bablic !== undefined) {
      const languages = window.bablic.languages.get();
      const currentLng = window.bablic.getLocale();
      this.setState({
        currentLng,
        languages: this.getLanguagesOrdered(languages, currentLng)
      });
    }
  }

  getLanguagesOrdered(languages, current) {
    const currentLang = languages.find(l => l.key === current);
    const filteredLangs = languages.filter(l => l.key !== current);
    return [currentLang, ...filteredLangs];
  }

  handleLangChange = (lang) => {
    window.bablic.redirectTo(lang);
    this.setState({
      currentLng: lang,
      languages: this.getLanguagesOrdered(this.state.languages, lang)
    });
  }

  render() {
    const { currentLng, languages } = this.state;
    if (!languages) return null;
    return (<ul className={LanguageSelectorStyles.container}>
      {languages.map((l, i) => (
        <li
          key={l.key}
          className={cx(
            LanguageSelectorStyles.elementContainer,
            { [LanguageSelectorStyles.elementContainerActive]: currentLng === l.key }
          )}
          style={{ transform: `translateX(-${100 * i}%)` }}
        >
          <button
            className={LanguageSelectorStyles.element}
            onClick={() => this.handleLangChange(l.key)}
          >
            {l.key.toUpperCase()}
          </button>
        </li>
      ))}
    </ul>);
  }
}

export default LanguageSelector;
