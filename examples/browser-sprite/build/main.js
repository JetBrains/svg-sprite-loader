/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_svg_sprite_loader_runtime_symbol_build__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_svg_sprite_loader_runtime_symbol_build___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_svg_sprite_loader_runtime_symbol_build__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_svg_sprite_loader_runtime_browser_sprite_build__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_svg_sprite_loader_runtime_browser_sprite_build___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_svg_sprite_loader_runtime_browser_sprite_build__);


var symbol = new __WEBPACK_IMPORTED_MODULE_0_svg_sprite_loader_runtime_symbol_build___default.a({
  "id": "twitter_1T61UOrU",
  "use": "twitter_1T61UOrU-usage",
  "viewBox": "0 0 273.4 222.2",
  "content": "<symbol viewBox=\"0 0 273.4 222.2\" id=\"twitter_1T61UOrU\"><path d=\"M273.4 26.3c-10.1 4.5-20.9 7.5-32.2 8.8 11.6-6.9 20.5-17.9 24.7-31-10.9 6.4-22.9 11.1-35.7 13.6A55.919 55.919 0 0 0 189.3 0c-31 0-56.1 25.1-56.1 56.1 0 4.4.5 8.7 1.5 12.8C88 66.5 46.7 44.2 19 10.3c-4.8 8.3-7.6 17.9-7.6 28.2 0 19.5 9.9 36.6 25 46.7-9.2-.3-17.8-2.8-25.4-7v.7c0 27.2 19.3 49.8 45 55-4.7 1.3-9.7 2-14.8 2-3.6 0-7.1-.4-10.6-1 7.1 22.3 27.9 38.5 52.4 39-19.2 15-43.4 24-69.7 24-4.5 0-9-.3-13.4-.8 24.8 15.9 54.3 25.2 86 25.2 103.2 0 159.6-85.5 159.6-159.6 0-2.4-.1-4.9-.2-7.3 11.1-8 20.6-17.9 28.1-29.1z\" /></symbol>"
});
__WEBPACK_IMPORTED_MODULE_1_svg_sprite_loader_runtime_browser_sprite_build___default.a.add(symbol);
/* unused harmony default export */ var _unused_webpack_default_export = (symbol);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__assets_twitter_svg__ = __webpack_require__(0);



/***/ }),
/* 2 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {(function (global, factory) {
	 true ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.BrowserSprite = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index = createCommonjsModule(function (module, exports) {
(function (root, factory) {
    if (false) {
        undefined(factory);
    } else {
        module.exports = factory();
    }
}(commonjsGlobal, function () {

function isMergeableObject(val) {
    var nonNullObject = val && typeof val === 'object';

    return nonNullObject
        && Object.prototype.toString.call(val) !== '[object RegExp]'
        && Object.prototype.toString.call(val) !== '[object Date]'
}

function emptyTarget(val) {
    return Array.isArray(val) ? [] : {}
}

function cloneIfNecessary(value, optionsArgument) {
    var clone = optionsArgument && optionsArgument.clone === true;
    return (clone && isMergeableObject(value)) ? deepmerge(emptyTarget(value), value, optionsArgument) : value
}

function defaultArrayMerge(target, source, optionsArgument) {
    var destination = target.slice();
    source.forEach(function(e, i) {
        if (typeof destination[i] === 'undefined') {
            destination[i] = cloneIfNecessary(e, optionsArgument);
        } else if (isMergeableObject(e)) {
            destination[i] = deepmerge(target[i], e, optionsArgument);
        } else if (target.indexOf(e) === -1) {
            destination.push(cloneIfNecessary(e, optionsArgument));
        }
    });
    return destination
}

function mergeObject(target, source, optionsArgument) {
    var destination = {};
    if (isMergeableObject(target)) {
        Object.keys(target).forEach(function (key) {
            destination[key] = cloneIfNecessary(target[key], optionsArgument);
        });
    }
    Object.keys(source).forEach(function (key) {
        if (!isMergeableObject(source[key]) || !target[key]) {
            destination[key] = cloneIfNecessary(source[key], optionsArgument);
        } else {
            destination[key] = deepmerge(target[key], source[key], optionsArgument);
        }
    });
    return destination
}

function deepmerge(target, source, optionsArgument) {
    var array = Array.isArray(source);
    var options = optionsArgument || { arrayMerge: defaultArrayMerge };
    var arrayMerge = options.arrayMerge || defaultArrayMerge;

    if (array) {
        return Array.isArray(target) ? arrayMerge(target, source, optionsArgument) : cloneIfNecessary(source, optionsArgument)
    } else {
        return mergeObject(target, source, optionsArgument)
    }
}

deepmerge.all = function deepmergeAll(array, optionsArgument) {
    if (!Array.isArray(array) || array.length < 2) {
        throw new Error('first argument should be an array with at least two elements')
    }

    // we are sure there are at least 2 values, so it is safe to have no initial value
    return array.reduce(function(prev, next) {
        return deepmerge(prev, next, optionsArgument)
    })
};

return deepmerge

}));
});

var namespaces_1 = createCommonjsModule(function (module, exports) {
var namespaces = {
  svg: {
    name: 'xmlns',
    uri: 'http://www.w3.org/2000/svg'
  },
  xlink: {
    name: 'xmlns:xlink',
    uri: 'http://www.w3.org/1999/xlink'
  }
};

exports.default = namespaces;
module.exports = exports.default;
});

/**
 * @param {Object} attrs
 * @return {string}
 */
var objectToAttrsString = function (attrs) {
  return Object.keys(attrs).map(function (attr) { return (attr + "=\"" + (attrs[attr]) + "\""); }).join(' ');
};

var svg$1 = namespaces_1.svg;
var xlink$1 = namespaces_1.xlink;

var defaultAttrs = {};
defaultAttrs[svg$1.name] = svg$1.uri;
defaultAttrs[xlink$1.name] = xlink$1.uri;

/**
 * @param {string} [content]
 * @param {Object} [attributes]
 * @return {string}
 */
var wrapWithSVG = function (content, attributes) {
  if ( content === void 0 ) content = '';

  var attrs = index(defaultAttrs, attributes || {});
  var attrsRendered = objectToAttrsString(attrs);
  return ("<svg " + attrsRendered + ">" + content + "</svg>");
};

var svg = namespaces_1.svg;
var xlink = namespaces_1.xlink;

var defaultConfig$1 = {
  attrs: ( obj = {
    style: ['position: absolute', 'width: 0', 'height: 0'].join('; ')
  }, obj[svg.name] = svg.uri, obj[xlink.name] = xlink.uri, obj )
};
var obj;

var Sprite = function Sprite(config) {
  this.config = index(defaultConfig$1, config || {});
  this.symbols = [];
};

/**
 * TODO return add | replace instead of symbol instance
 * @param {SpriteSymbol} symbol
 * @return {SpriteSymbol}
 */
Sprite.prototype.add = function add (symbol) {
  var ref = this;
    var symbols = ref.symbols;
  var existing = this.find(symbol.id);

  if (existing) {
    symbols[symbols.indexOf(existing)] = symbol;
    return symbol;
  }

  symbols.push(symbol);
  return symbol;
};

/**
 * Remove from list & destroy symbol
 * @param {string} id
 */
Sprite.prototype.remove = function remove (id) {
  var ref = this;
    var symbols = ref.symbols;
  var symbol = this.find(id);

  if (symbol) {
    symbols.splice(symbols.indexOf(symbol), 1);
    symbol.destroy();
  }
};

/**
 * @param {string} id
 * @return {SpriteSymbol|null}
 */
Sprite.prototype.find = function find (id) {
  return this.symbols.filter(function (s) { return s.id === id; })[0] || null;
};

/**
 * @param {string} id
 * @return {boolean}
 */
Sprite.prototype.has = function has (id) {
  return this.find(id) !== null;
};

/**
 * @return {string}
 */
Sprite.prototype.stringify = function stringify () {
  var ref = this.config;
    var attrs = ref.attrs;
  return wrapWithSVG(this.stringifySymbols(), attrs);
};

/**
 * @return {string}
 */
Sprite.prototype.stringifySymbols = function stringifySymbols () {
  return this.symbols.map(function (s) { return s.stringify(); }).join('');
};

/**
 * @return {string}
 */
Sprite.prototype.toString = function toString () {
  return this.stringify();
};

var arrayFrom = function (arrayLike) {
  return Array.prototype.slice.call(arrayLike, 0);
};

/**
 * @param {NodeList|Node} nodes
 * @param {boolean} [clone=true]
 * @return {string}
 */

var hasImportNode = !!document.importNode;

/**
 * @param {string} content
 * @return {Element}
 */
var parseSVG = function (content) {
  var doc = new DOMParser().parseFromString(content, 'image/svg+xml').documentElement;

  /**
   * Fix for browser which are throwing WrongDocumentError
   * if you insert an element which is not part of the document
   * @see http://stackoverflow.com/a/7986519/4624403
   */
  if (hasImportNode) {
    return document.importNode(doc, true);
  }

  return doc;
};

var URL_FUNCTION_PATTERN = /url\(#?([^)]+?)\)/g;

/**
 * @param {Attr[]} attributes
 * @param {string} startsWith
 * @param {string} replaceWith
 * @return {Attr[]}
 */
var replaceURLInAttributes = function (attributes, startsWith, replaceWith) {
  attributes.forEach(function (attr) {
    var value = attr.value;
    var match = URL_FUNCTION_PATTERN.exec(value);
    var url = match !== null && match[1] ? match[1] : null;

    URL_FUNCTION_PATTERN.lastIndex = 0;

    if (url === null) {
      return;
    }

    attr.value = attr.value.replace(startsWith, replaceWith);
  });

  return attributes;
};

/**
 * @param {NodeList} nodes
 * @param {Function} [matcher]
 * @return {Attr[]}
 */
function selectAttributes(nodes, matcher) {
  var attrs = arrayFrom(nodes).reduce(function (acc, node) {
    if (!node.attributes) {
      return acc;
    }

    var arrayfied = arrayFrom(node.attributes);
    var matched = matcher ? arrayfied.filter(matcher) : arrayfied;
    return acc.concat(matched);
  }, []);

  return attrs;
}

var xLinkNS = namespaces_1.xlink.uri;
var xLinkAttrName = 'xlink:href';

/**
 * @param {NodeList} nodes
 * @param {string} startsWith
 * @param {string} replaceWith
 * @return {NodeList}
 */
function updateReferences(nodes, startsWith, replaceWith) {
  arrayFrom(nodes).forEach(function (node) {
    var href = node.getAttribute(xLinkAttrName);
    if (href && href.indexOf(startsWith) === 0) {
      var newUrl = href.replace(startsWith, replaceWith);
      node.setAttributeNS(xLinkNS, xLinkAttrName, newUrl);
    }
  });

  return nodes;
}

var ua = navigator.userAgent;

var browser = {
  isChrome: /chrome/i.test(ua),
  isFirefox: /firefox/i.test(ua),
  isIE: /msie/i.test(ua),
  isEdge: /edge/i.test(ua)
};

/**
 * @param {string} name
 * @param {*} data
 */

/**
 * @param {string} [url] If not provided - current URL will be used
 * @return {string}
 */
var getURLWithoutFragment = function (url) {
  return (url || window.location.href).split('#')[0];
};

var defaultSelector = 'linearGradient, radialGradient, pattern';

/**
 * @param {Element} svg
 * @param {string} [selector]
 * @return {Element}
 */
var moveGradientsOutsideSymbol = function (svg, selector) {
  if ( selector === void 0 ) selector = defaultSelector;

  arrayFrom(svg.querySelectorAll('symbol')).forEach(function (symbol) {
    arrayFrom(symbol.querySelectorAll(selector)).forEach(function (node) {
      symbol.parentNode.insertBefore(node, symbol);
    });
  });
  return svg;
};

/**
 * List of SVG attributes to update url() target in them
 */
var attList = [
  'clipPath',
  'colorProfile',
  'src',
  'cursor',
  'fill',
  'filter',
  'marker',
  'markerStart',
  'markerMid',
  'markerEnd',
  'mask',
  'stroke',
  'style'
];

var fixSelector = attList.map(function (attr) { return ("[" + attr + "]"); }).join(',');

/**
 * Update URLs in sprite and referencing elements
 * @param {Element} svg
 * @param {NodeList} references
 * @param {string} startsWith
 * @param {string} replaceWith
 */
var updateBaseURLInSVG = function (svg, references, startsWith, replaceWith) {
  var nodes = svg.querySelectorAll(fixSelector);
  var attrs = selectAttributes(nodes, function (ref) {
    var localName = ref.localName;
    var value = ref.value;

    return attList.indexOf(localName) !== -1 && value.indexOf(("url(" + startsWith)) !== -1;
  });

  replaceURLInAttributes(attrs, startsWith, replaceWith);
  updateReferences(references, startsWith, replaceWith);
};

var defaultConfig = {
  locationUpdatedEventName: 'locationUpdated',
  referencesToUpdate: 'use[*|href]',
  baseURLFix: undefined
};

var BrowserSprite = (function (Sprite$$1) {
  function BrowserSprite(config) {
    var this$1 = this;

    Sprite$$1.call(this, index(defaultConfig, config || {}));

    this.node = false;
    this.isMounted = false;

    /**
     * Autodetect is base URL fix needed
     */
    if (typeof this.config.baseURLFix === 'undefined') {
      var baseTag = document.getElementsByTagName('base')[0];
      this.baseURLFix = baseTag && baseTag.getAttribute('href') !== null;
    }

    /**
     * Fix broken elements after window.history.pushState occurs
     * @see https://bugzilla.mozilla.org/show_bug.cgi?id=652991
     */
    if (!browser.isIE) {
      var eventName = this.config.locationUpdatedEventName;
      window.addEventListener(eventName, function (event) {
        this$1.updateURL(event.detail.oldURL, event.detail.newURL);
      });
    }
  }

  if ( Sprite$$1 ) BrowserSprite.__proto__ = Sprite$$1;
  BrowserSprite.prototype = Object.create( Sprite$$1 && Sprite$$1.prototype );
  BrowserSprite.prototype.constructor = BrowserSprite;

  /**
   * Update URLs in sprite and referencing elements
   * @param {string} startsWith
   * @param {string} newURL
   */
  BrowserSprite.prototype.updateURL = function updateURL (startsWith, newURL) {
    if (!this.isMounted) {
      throw new Error('Sprite should be mounted to apply updateBaseURLInSVG');
    }

    var ref = this.config;
    var referencesToUpdate = ref.referencesToUpdate;

    var searchURL = (getURLWithoutFragment(startsWith)) + "#";
    var replaceURL = (getURLWithoutFragment(newURL)) + "#";
    var references = document.querySelectorAll(referencesToUpdate);

    updateBaseURLInSVG(this.node, references, searchURL, replaceURL);
  };

  /**
   * Fix disappearing referenced elements when <base href> differs with symbols xlink:href
   * @see http://stackoverflow.com/a/18265336/796152
   * @see https://github.com/everdimension/angular-svg-base-fix
   * @see https://github.com/angular/angular.js/issues/8934#issuecomment-56568466
   */
  BrowserSprite.prototype.baseURLFix = function baseURLFix () {
    var currentURL = getURLWithoutFragment();
    var baseURL = document.querySelector('base').getAttribute('href');

    if (baseURL !== currentURL) {
      this.updateURL('#', baseURL);
    }
  };

  /**
   * @return {Element}
   */
  BrowserSprite.prototype.render = function render () {
    var svg = parseSVG(this.stringify());

    /**
     * Fix Firefox bug when gradients and patterns don't work if they are within a symbol
     * @see https://bugzilla.mozilla.org/show_bug.cgi?id=306674
     * @see https://bugzilla.mozilla.org/show_bug.cgi?id=353575
     * @see https://bugzilla.mozilla.org/show_bug.cgi?id=1235364
     */
    if (browser.isFirefox) {
      moveGradientsOutsideSymbol(svg);
    }

    return svg;
  };

  /**
   * @param {Element} target
   * @param {boolean} [prepend=false]
   */
  BrowserSprite.prototype.mount = function mount (target, prepend) {
    if ( prepend === void 0 ) prepend = false;

    if (this.isMounted) {
      return;
    }

    if (target instanceof Element === false || target.nodeType !== 1) {
      throw new Error('Invalid node type');
    }

    var node = this.render();

    if (prepend && target.childNodes[0]) {
      target.insertBefore(node, target.childNodes[0]);
    } else {
      target.appendChild(node);
    }

    this.node = node;
    this.isMounted = true;

    if (this.config.baseURLFix) {
      this.baseURLFix();
    }
  };

  return BrowserSprite;
}(Sprite));

var ready$1 = createCommonjsModule(function (module) {
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  { module.exports = definition(); }

}('domready', function () {

  var fns = [], listener
    , doc = document
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);


  if (!loaded)
  { doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener);
    loaded = 1;
    while (listener = fns.shift()) { listener(); }
  }); }

  return function (fn) {
    loaded ? setTimeout(fn, 0) : fns.push(fn);
  }

});
});

var sprite = new BrowserSprite();

ready$1(function () {
  sprite.mount(document.body, true);
});

return sprite;

})));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
	 true ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.SpriteSymbol = factory());
}(this, (function () { 'use strict';

var SpriteSymbol = function SpriteSymbol(ref) {
  var id = ref.id;
  var viewBox = ref.viewBox;
  var content = ref.content;

  this.id = id;
  this.viewBox = viewBox;
  this.content = content;
};

/**
 * @return {string}
 */
SpriteSymbol.prototype.stringify = function stringify () {
  return this.content;
};

/**
 * @return {string}
 */
SpriteSymbol.prototype.toString = function toString () {
  return this.stringify();
};

SpriteSymbol.prototype.destroy = function destroy () {
    var this$1 = this;

  ['id', 'viewBox', 'content'].forEach(function (prop) { return delete this$1[prop]; });
};

return SpriteSymbol;

})));


/***/ })
/******/ ]);