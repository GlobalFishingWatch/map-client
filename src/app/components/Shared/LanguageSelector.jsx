import React, { Component } from 'react'
import cx from 'classnames'
import orderBy from 'lodash/orderBy'

import LanguageSelectorStyles from 'styles/components/shared/language-selector.module.scss'

const getLanguagesOrdered = (languages, current) => {
  const currentLang = languages.find((l) => l.key === current)
  const filteredLangs = languages.filter((l) => l.key !== current)
  return [currentLang, ...filteredLangs]
}

class LanguageSelector extends Component {
  state = {
    loaded: false,
    languages: null,
    currentLng: null,
  }

  eventFallbackInterval = null

  componentDidMount = () => {
    if (window.bablic !== undefined && window.bablic.loaded) {
      this.onBablicLoad()
    } else {
      document.addEventListener('bablicload', this.onBablicLoad)
      this.addEventListenerFallback()
    }
  }

  componentWillUnmount = () => {
    document.removeEventListener('bablicload', this.onBablicLoad)
  }

  checkBablicLoaded = () => {
    if (!this.state.loaded && window.bablic !== undefined && window.bablic.loaded) {
      this.onBablicLoad()
    }
  }

  addEventListenerFallback = () => {
    this.eventFallbackInterval = setInterval(this.checkBablicLoaded, 2000)
  }

  onBablicLoad = () => {
    if (this.eventFallbackInterval !== null) {
      clearInterval(this.eventFallbackInterval)
    }
    const languages = orderBy([...window.bablic.languages.get()], 'key')
    const currentLng = window.bablic.getLocale()
    if (languages && languages.length > 0) {
      this.setState({
        loaded: true,
        currentLng,
        languages: getLanguagesOrdered(languages, currentLng),
      })
    }
  }

  handleLangChange = (lang) => {
    window.bablic.redirectTo(lang)
    this.setState({
      currentLng: lang,
      languages: getLanguagesOrdered(this.state.languages, lang),
    })
  }

  render() {
    const { currentLng, languages } = this.state
    if (!languages) return null
    return (
      <ul className={LanguageSelectorStyles.container}>
        {languages.map((l, i) => (
          <li
            key={l.key}
            className={cx(LanguageSelectorStyles.elementContainer, {
              [LanguageSelectorStyles.elementContainerActive]: currentLng === l.key,
            })}
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
      </ul>
    )
  }
}

export default LanguageSelector
