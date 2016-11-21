/**
 * Represents a NotImplementedError.
 * Inherits from `Error`
 */

module.exports = class NotImplementedError extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name
    this.message = `${message} is not implemented in this version`
    Error.captureStackTrace(this, this.constructor)
  }
}
