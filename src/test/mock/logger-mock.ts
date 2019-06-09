import {spy} from 'sinon'
import { EventEmitter } from 'events'
import { Logger } from '../../types';
import { LOG_LEVEL } from '../../constants';

export default class LoggerMock extends EventEmitter implements Logger {
  public isReady: boolean
  public description: string
  public lastLogLevel: any
  public lastLogEvent: any
  public lastLogMessage: any
  public lastLogArguments: any
  // tslint:disable-next-line:variable-name
  public _log: any

  constructor () {
    super()
    this.isReady = true
    this.lastLogLevel = null
    this.lastLogEvent = null
    this.lastLogMessage = null
    this.lastLogArguments = null

    this._log = spy()
  }

  public shouldLog (logLevel: LOG_LEVEL): boolean {
    return true
  }

  public warn (event, message) {
    this.log(LOG_LEVEL.WARN, event, message)
    this._log(LOG_LEVEL.WARN, event, message)
  }

  public debug (event, message) {
    this.log(LOG_LEVEL.DEBUG, event, message)
    this._log(LOG_LEVEL.DEBUG, event, message)
  }

  public info (event, message) {
    this.log(LOG_LEVEL.INFO, event, message)
    this._log(LOG_LEVEL.INFO, event, message)
  }

  public error (event, message) {
    this.log(LOG_LEVEL.ERROR, event, message)
    this._log(LOG_LEVEL.ERROR, event, message)
  }

  public log (level, event, message) {
    this.lastLogLevel = level
    this.lastLogEvent = event
    this.lastLogMessage = message
    this.lastLogArguments = Array.from(arguments)
  }

  public setLogLevel () {
  }
}
