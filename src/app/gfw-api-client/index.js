const GATEWAY_URL =
  process.env.API_AUTH_URL ||
  process.env.REACT_APP_API_AUTH_URL ||
  'https://gateway.api.dev.globalfishingwatch.org/auth'
const USER_TOKEN_STORAGE_KEY = 'GFW_API_USER_TOKEN'
const USER_REFRESH_TOKEN_STORAGE_KEY = 'GFW_API_USER_REFRESH_TOKEN'

const processStatus = (response) =>
  response.status >= 200 && response.status < 300
    ? Promise.resolve(response)
    : Promise.reject({ status: response.status, message: response.statusText })

const parseJSON = (response) => response.json()
const isUnauthorizedError = (error) => error && error.status > 400 && error.status < 403

export class GFW_API {
  constructor({
    debug = true,
    token = null,
    refreshToken = null,
    baseUrl = GATEWAY_URL,
    tokenStorageKey = USER_TOKEN_STORAGE_KEY,
    refreshTokenStorageKey = USER_REFRESH_TOKEN_STORAGE_KEY,
  } = {}) {
    this.debug = debug
    this.baseUrl = baseUrl
    this.storageKeys = { token: tokenStorageKey, refreshToken: refreshTokenStorageKey }
    this._setToken(token || localStorage.getItem(tokenStorageKey))
    this._setRefreshToken(refreshToken || localStorage.getItem(refreshTokenStorageKey))
    this.refreshRetries = 0

    if (debug) {
      console.log('GFW API Client initialized with the following config', this._getConfig())
    }
  }

  _getConfig() {
    return {
      debug: this.debug,
      baseUrl: this.baseUrl,
      storageKeys: this.storageKeys,
      token: this.getToken(),
      refreshToken: this.getRefreshToken(),
    }
  }

  getToken() {
    return this.token
  }

  _setToken(token) {
    this.token = token
    localStorage.setItem(this.storageKeys.token, token)
    if (this.debug) {
      console.log('GFWAPI: updated token with', token)
    }
  }

  getRefreshToken() {
    return this.refreshToken
  }

  _setRefreshToken(refreshToken) {
    this.refreshToken = refreshToken
    localStorage.setItem(this.storageKeys.refreshToken, refreshToken)
    if (this.debug) {
      console.log('GFWAPI: updated refreshToken with', refreshToken)
    }
  }

  async _getTokensWithAccessToken(accessToken) {
    return fetch(`${this.baseUrl}/token?access-token=${accessToken}`)
      .then(processStatus)
      .then(parseJSON)
  }

  async _getTokenWithRefreshToken(refreshToken) {
    return fetch(`${this.baseUrl}/token/reload`, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    })
      .then(processStatus)
      .then(parseJSON)
  }

  async fetch(url, options = {}, refreshRetries = 0) {
    try {
      const { method = 'GET', body = null, headers = {} } = options
      if (this.debug) {
        console.log(`GFWAPI: Fetching url: ${url}`)
      }
      const data = await fetch(url, {
        method,
        ...(body && body),
        headers: { ...headers, Authorization: `Bearer ${this.getToken()}` },
      })
        .then(processStatus)
        .then(parseJSON)
      return data
    } catch (e) {
      if (this.debug) {
        if (refreshRetries >= 2) {
          console.log(`GFWAPI: Attemps to refresh the token excedeed`)
        }
        console.warn(`GFWAPI: There was an error trying to fetch ${url}`)
        console.warn(e)
      }
      // 401 = not authenticated, trying to refresh the token
      if (e.status === 401 && refreshRetries < 2) {
        if (this.debug) {
          console.log(`GFWAPI: Trying to refresh the token attempt: ${refreshRetries}`)
        }
        try {
          const { token } = await this._getTokenWithRefreshToken(this.getRefreshToken())
          this._setToken(token)

          if (this.debug) {
            console.log(`Token refresh worked! trying to fetch again ${url}`)
          }
          return this.fetch(url, options, ++refreshRetries)
        } catch (e) {
          if (this.debug) {
            console.warn(e)
          }
          throw new Error(`Error fetching resource ${url}`)
        }
      } else {
        throw new Error(`Error fetching resource ${url}`)
      }
    }
  }

  async fetchUser() {
    try {
      const user = await this.fetch(`${this.baseUrl}/me`)
      return user
    } catch (e) {
      throw new Error('Error trying to get user data')
    }
  }

  async login({ accessToken = '', refreshToken = this.getRefreshToken() }) {
    if (accessToken) {
      try {
        const tokens = await this._getTokensWithAccessToken(accessToken)
        this._setToken(tokens.token)
        this._setRefreshToken(tokens.refreshToken)
      } catch (e) {
        if (!this.getToken() && !this.getRefreshToken()) {
          const msg = isUnauthorizedError(e)
            ? 'Invalid access token'
            : 'Error trying to generate tokens'
          throw new Error(msg)
        }
      }
    }

    if (this.getToken()) {
      try {
        const user = await this.fetchUser()
        return user
      } catch (e) {
        if (this.debug) {
          console.warn('GFWAPI: Token expired, trying to refresh', e)
        }
      }
    }

    if (refreshToken) {
      try {
        const { token } = await this._getTokenWithRefreshToken(refreshToken)
        this._setToken(token)
        return this.fetchUser()
      } catch (e) {
        const msg = isUnauthorizedError(e)
          ? 'Invalid refresh token'
          : 'Error trying to refreshing the token'
        throw new Error(msg)
      }
    }

    return null
  }

  async logout() {
    try {
      this._setToken('')
      this._setRefreshToken('')
      await this.fetch(`${this.baseUrl}/logout`)
      return true
    } catch (e) {
      throw new Error('Error on the logout proccess')
    }
  }
}

export default new GFW_API()
