(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/worker.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/worker.js":
/*!***********************!*\
  !*** ./src/worker.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Gdal3; });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar gdalWorkerWrapper;\n\nvar WorkerWrapper = /*#__PURE__*/function () {\n  function WorkerWrapper(file, onload) {\n    var _this = this;\n\n    _classCallCheck(this, WorkerWrapper);\n\n    this.promises = {\n      onload: {\n        resolve: onload,\n        reject: console.error\n      }\n    };\n    this.gdalWorker = new Worker(file);\n\n    this.gdalWorker.onmessage = function (evt) {\n      if (evt.data && evt.data.id && _this.promises[evt.data.id]) {\n        if (evt.data.success) _this.promises[evt.data.id].resolve(evt.data.data);else _this.promises[evt.data.id].reject(evt.data.data);\n      }\n    };\n  }\n\n  _createClass(WorkerWrapper, [{\n    key: \"call\",\n    value: function call(i) {\n      var _this2 = this;\n\n      return new Promise(function (resolve, reject) {\n        i.id = Math.floor(Math.random() * 100000);\n        _this2.promises[i.id] = {\n          resolve: resolve,\n          reject: reject\n        };\n\n        _this2.gdalWorker.postMessage(i);\n      });\n    }\n  }, {\n    key: \"terminate\",\n    value: function terminate() {\n      this.gdalWorker.terminate();\n      delete this.gdalWorker;\n      delete this.promises;\n    }\n  }]);\n\n  return WorkerWrapper;\n}();\n\nvar drivers;\nvar gdalProxy = new Proxy({}, {\n  get: function get(target, name) {\n    if (name === 'then' || name === 'catch') return target;\n    if (name === 'drivers') return drivers;\n    return function () {\n      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {\n        args[_key] = arguments[_key];\n      }\n\n      return new Promise(function (resolve, reject) {\n        gdalWorkerWrapper.call({\n          func: name,\n          params: args\n        }).then(function (data) {\n          resolve(data);\n        })[\"catch\"](function (e) {\n          return reject(e);\n        });\n      });\n    };\n  }\n});\nfunction Gdal3() {\n  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n  return new Promise(function (resolve) {\n    gdalWorkerWrapper = new WorkerWrapper(\"\".concat(config.path || '', \"/gdal3.js\"), function (d) {\n      drivers = d;\n      resolve(gdalProxy);\n    });\n  });\n}\n\nif (typeof window !== 'undefined') {\n  window.Gdal3 = Gdal3;\n}\n\n//# sourceURL=webpack:///./src/worker.js?");

/***/ })

/******/ })["default"];
});