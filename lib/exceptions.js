class LoaderException extends Error {
  constructor(message) {
    super(`svg-sprite-loader exception. ${message}`);

    this.name = this.constructor.name;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

exports.LoaderException = LoaderException;

class PluginMissingException extends LoaderException {
  constructor() {
    super('svg-sprite-loader is used without the corresponding plugin');
  }
}

exports.PluginMissingException = PluginMissingException;

class InvalidRuntimeException extends LoaderException {
  constructor(runtime, possible) {
    super(`Invalid runtime "${runtime}", possible values: ${possible}`);
  }
}

exports.InvalidRuntimeException = InvalidRuntimeException;

class SeveralRulesAppliedException extends LoaderException {
  constructor(resource, rules) {
    super(`${rules.length} rules applies to ${resource}`);
  }
}

exports.SeveralRulesAppliedException = SeveralRulesAppliedException;

class RemainingLoadersInExtractModeException extends LoaderException {
  constructor() {
    super('Some loaders will be applied after svg-sprite-loader in extract mode');
  }
}

exports.RemainingLoadersInExtractModeException = RemainingLoadersInExtractModeException;
