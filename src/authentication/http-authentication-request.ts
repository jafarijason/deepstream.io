import { post } from 'needle'
import { EVENT } from '../constants'
import { Logger } from '../types';

/**
 * This class represents a single request from deepstream to a http
 * endpoint for authentication data
 */
export default class HttpAuthenticationRequest {
  private settings: any
  private callback: Function
  private logger: Logger

  /**
   * Creates and issues the request and starts the timeout
   *
   * @param   {Object}   data           Map with authData and connectionData
   * @param   {Object}   settings       contains requestTimeout and permittedStatusCodes
   * @param   {Function} callback       Called with error, isAuthenticated, userData
   * @param   {Logger}   logger
   *
   * @constructor
   * @returns {void}
   */
  constructor (data: any, settings: any, logger: Logger, callback: Function) {
    this.settings = settings
    this.callback = callback
    this.logger = logger

    const options = {
      read_timeout: settings.requestTimeout,
      open_timeout: settings.requestTimeout,
      timeout: settings.requestTimeout,
      follow_max: 2,
      json: true
    }

    post(settings.endpointUrl, data, options, this._onComplete.bind(this))
  }

  /**
   * Invoked for completed responses, whether succesful
   * or errors
   */
  private _onComplete (error, response): void {
    if (error) {
      this.logger.warn(EVENT.AUTH_ERROR, `http auth error: ${error}`)
      this.callback(false, null)
      return
    }

    if (response.statusCode >= 500 && response.statusCode < 600) {
      this.logger.warn(EVENT.AUTH_ERROR, `http auth server error: ${JSON.stringify(response.body)}`)
    }

    if (this.settings.permittedStatusCodes.indexOf(response.statusCode) === -1) {
      this.callback(false, response.body || null)
    } else if (response.body && typeof response.body === 'string') {
      this.callback(true, { username: response.body })
    } else {
      this.callback(true, response.body || null)
    }
  }
}
