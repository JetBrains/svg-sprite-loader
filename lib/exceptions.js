const { PACKAGE_NAME } = require('./config');

class LoaderException extends Error {
  constructor(message) {
    super(`${PACKAGE_NAME} exception. ${message}`);

    this.name = this.constructor.name;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

class PluginMissingException extends LoaderException {
  constructor() {
    super(`${PACKAGE_NAME} is used without the corresponding plugin`);
  }
}

class InvalidRuntimeException extends LoaderException {
  constructor(runtime) {
    super(`Runtime generator "${runtime}" not found`);
  }
}

class SeveralRulesAppliedException extends LoaderException {
  constructor(resource, rules) {
    super(`${rules.length} rules applies to ${resource}`);
  }
}

class RemainingLoadersInExtractModeException extends LoaderException {
  constructor() {
    super(`Some loaders will be applied after ${PACKAGE_NAME} in extract mode`);
  }
}

exports.LoaderException = LoaderException;
exports.PluginMissingException = PluginMissingException;
exports.InvalidRuntimeException = InvalidRuntimeException;
exports.SeveralRulesAppliedException = SeveralRulesAppliedException;
exports.RemainingLoadersInExtractModeException = RemainingLoadersInExtractModeException;
