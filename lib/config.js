module.exports = {
  extractIssuerRegExp: /\.(css|sass|scss|less|styl|html)$/i,
  spritePlaceholderRegExp: /\[sprite-filename\|([^\]]*)\];?/gi,

  loader: {
    symbolId: '[name]',

    // Runtime
    runtime: undefined,
    runtimeOptions: {},
    esModule: undefined,

    // Extracting
    extract: undefined,
    spriteFilename: 'sprite.svg'
  },

  runtime: {
    default: {
      spriteModule: 'svg-sprite-loader/runtime/sprite'
    },

    browser: {
      spriteModule: 'svg-sprite-loader/runtime/browser-sprite',
      baseURLFix: true,
      angularBaseURLFix: false,
      // https://bugzilla.mozilla.org/show_bug.cgi?id=353575
      refsInsideSymbolFix: true
    }
  }
};
