import {
  __esm,
  __export
} from "./chunk-4B2QHNJT.js";

// node_modules/tslib/tslib.es6.mjs
var tslib_es6_exports = {};
__export(tslib_es6_exports, {
  __addDisposableResource: () => __addDisposableResource,
  __assign: () => __assign,
  __asyncDelegator: () => __asyncDelegator,
  __asyncGenerator: () => __asyncGenerator,
  __asyncValues: () => __asyncValues,
  __await: () => __await,
  __awaiter: () => __awaiter,
  __classPrivateFieldGet: () => __classPrivateFieldGet,
  __classPrivateFieldIn: () => __classPrivateFieldIn,
  __classPrivateFieldSet: () => __classPrivateFieldSet,
  __createBinding: () => __createBinding,
  __decorate: () => __decorate,
  __disposeResources: () => __disposeResources,
  __esDecorate: () => __esDecorate,
  __exportStar: () => __exportStar,
  __extends: () => __extends,
  __generator: () => __generator,
  __importDefault: () => __importDefault,
  __importStar: () => __importStar,
  __makeTemplateObject: () => __makeTemplateObject,
  __metadata: () => __metadata,
  __param: () => __param,
  __propKey: () => __propKey,
  __read: () => __read,
  __rest: () => __rest,
  __runInitializers: () => __runInitializers,
  __setFunctionName: () => __setFunctionName,
  __spread: () => __spread,
  __spreadArray: () => __spreadArray,
  __spreadArrays: () => __spreadArrays,
  __values: () => __values,
  default: () => tslib_es6_default
});
function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function __param(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
}
function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access) context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_ = accept(result.get)) descriptor.get = _;
      if (_ = accept(result.set)) descriptor.set = _;
      if (_ = accept(result.init)) initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field") initializers.unshift(_);
      else descriptor[key] = _;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
}
function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
}
function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
}
function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
}
function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
}
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
    ar = ar.concat(__read(arguments[i]));
  return ar;
}
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
      r[k] = a[j];
  return r;
}
function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function verb(n) {
    if (g[n]) i[n] = function(v) {
      return new Promise(function(a, b) {
        q.push([n, v, a, b]) > 1 || resume(n, v);
      });
    };
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}
function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function(e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function() {
    return this;
  }, i;
  function verb(n, f) {
    i[n] = o[n] ? function(v) {
      return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v;
    } : f;
  }
}
function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v) {
      return new Promise(function(resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve({ value: v2, done: d });
    }, reject);
  }
}
function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", { value: raw });
  } else {
    cooked.raw = raw;
  }
  return cooked;
}
function __importStar(mod2) {
  if (mod2 && mod2.__esModule) return mod2;
  var result = {};
  if (mod2 != null) {
    for (var k in mod2) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod2, k)) __createBinding(result, mod2, k);
  }
  __setModuleDefault(result, mod2);
  return result;
}
function __importDefault(mod2) {
  return mod2 && mod2.__esModule ? mod2 : { default: mod2 };
}
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function") throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}
function __addDisposableResource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}
function __disposeResources(env) {
  function fail(e) {
    env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
    env.hasError = true;
  }
  function next() {
    while (env.stack.length) {
      var rec = env.stack.pop();
      try {
        var result = rec.dispose && rec.dispose.call(rec.value);
        if (rec.async) return Promise.resolve(result).then(next, function(e) {
          fail(e);
          return next();
        });
      } catch (e) {
        fail(e);
      }
    }
    if (env.hasError) throw env.error;
  }
  return next();
}
var extendStatics, __assign, __createBinding, __setModuleDefault, _SuppressedError, tslib_es6_default;
var init_tslib_es6 = __esm({
  "node_modules/tslib/tslib.es6.mjs"() {
    extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    __assign = function() {
      __assign = Object.assign || function __assign2(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    __createBinding = Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    };
    __setModuleDefault = Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    };
    _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
      var e = new Error(message);
      return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };
    tslib_es6_default = {
      __extends,
      __assign,
      __rest,
      __decorate,
      __param,
      __metadata,
      __awaiter,
      __generator,
      __createBinding,
      __exportStar,
      __values,
      __read,
      __spread,
      __spreadArrays,
      __spreadArray,
      __await,
      __asyncGenerator,
      __asyncDelegator,
      __asyncValues,
      __makeTemplateObject,
      __importStar,
      __importDefault,
      __classPrivateFieldGet,
      __classPrivateFieldSet,
      __classPrivateFieldIn,
      __addDisposableResource,
      __disposeResources
    };
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/utils.js
function getMagnitude(x) {
  return Math.floor(Math.log(x) * Math.LOG10E);
}
function repeat(s, times) {
  if (typeof s.repeat === "function") {
    return s.repeat(times);
  }
  var arr = new Array(times);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = s;
  }
  return arr.join("");
}
function setInternalSlot(map, pl, field, value) {
  if (!map.get(pl)) {
    map.set(pl, /* @__PURE__ */ Object.create(null));
  }
  var slots = map.get(pl);
  slots[field] = value;
}
function setMultiInternalSlots(map, pl, props) {
  for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
    var k = _a[_i];
    setInternalSlot(map, pl, k, props[k]);
  }
}
function getInternalSlot(map, pl, field) {
  return getMultiInternalSlots(map, pl, field)[field];
}
function getMultiInternalSlots(map, pl) {
  var fields = [];
  for (var _i = 2; _i < arguments.length; _i++) {
    fields[_i - 2] = arguments[_i];
  }
  var slots = map.get(pl);
  if (!slots) {
    throw new TypeError("".concat(pl, " InternalSlot has not been initialized"));
  }
  return fields.reduce(function(all, f) {
    all[f] = slots[f];
    return all;
  }, /* @__PURE__ */ Object.create(null));
}
function isLiteralPart(patternPart) {
  return patternPart.type === "literal";
}
function defineProperty(target, name, _a) {
  var value = _a.value;
  Object.defineProperty(target, name, {
    configurable: true,
    enumerable: false,
    writable: true,
    value
  });
}
function createDataProperty(target, name, value) {
  Object.defineProperty(target, name, {
    configurable: true,
    enumerable: true,
    writable: true,
    value
  });
}
function invariant(condition, message, Err) {
  if (Err === void 0) {
    Err = Error;
  }
  if (!condition) {
    throw new Err(message);
  }
}
var init_utils = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/utils.js"() {
  }
});

// node_modules/@formatjs/intl-localematcher/lib/abstract/CanonicalizeLocaleList.js
function CanonicalizeLocaleList(locales) {
  return Intl.getCanonicalLocales(locales);
}
var init_CanonicalizeLocaleList = __esm({
  "node_modules/@formatjs/intl-localematcher/lib/abstract/CanonicalizeLocaleList.js"() {
  }
});

// node_modules/@formatjs/intl-localematcher/lib/abstract/languageMatching.js
var data;
var init_languageMatching = __esm({
  "node_modules/@formatjs/intl-localematcher/lib/abstract/languageMatching.js"() {
    data = {
      supplemental: {
        languageMatching: {
          "written-new": [
            {
              paradigmLocales: {
                _locales: "en en_GB es es_419 pt_BR pt_PT"
              }
            },
            {
              $enUS: {
                _value: "AS+CA+GU+MH+MP+PH+PR+UM+US+VI"
              }
            },
            {
              $cnsar: {
                _value: "HK+MO"
              }
            },
            {
              $americas: {
                _value: "019"
              }
            },
            {
              $maghreb: {
                _value: "MA+DZ+TN+LY+MR+EH"
              }
            },
            {
              no: {
                _desired: "nb",
                _distance: "1"
              }
            },
            {
              bs: {
                _desired: "hr",
                _distance: "4"
              }
            },
            {
              bs: {
                _desired: "sh",
                _distance: "4"
              }
            },
            {
              hr: {
                _desired: "sh",
                _distance: "4"
              }
            },
            {
              sr: {
                _desired: "sh",
                _distance: "4"
              }
            },
            {
              aa: {
                _desired: "ssy",
                _distance: "4"
              }
            },
            {
              de: {
                _desired: "gsw",
                _distance: "4",
                _oneway: "true"
              }
            },
            {
              de: {
                _desired: "lb",
                _distance: "4",
                _oneway: "true"
              }
            },
            {
              no: {
                _desired: "da",
                _distance: "8"
              }
            },
            {
              nb: {
                _desired: "da",
                _distance: "8"
              }
            },
            {
              ru: {
                _desired: "ab",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "ach",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              nl: {
                _desired: "af",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "ak",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "am",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              es: {
                _desired: "ay",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              ru: {
                _desired: "az",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              ur: {
                _desired: "bal",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              ru: {
                _desired: "be",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "bem",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              hi: {
                _desired: "bh",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "bn",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              zh: {
                _desired: "bo",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              fr: {
                _desired: "br",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              es: {
                _desired: "ca",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              fil: {
                _desired: "ceb",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "chr",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "ckb",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              fr: {
                _desired: "co",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              fr: {
                _desired: "crs",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              sk: {
                _desired: "cs",
                _distance: "20"
              }
            },
            {
              en: {
                _desired: "cy",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "ee",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "eo",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              es: {
                _desired: "eu",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              da: {
                _desired: "fo",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              nl: {
                _desired: "fy",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "ga",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "gaa",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "gd",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              es: {
                _desired: "gl",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              es: {
                _desired: "gn",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              hi: {
                _desired: "gu",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "ha",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "haw",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              fr: {
                _desired: "ht",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              ru: {
                _desired: "hy",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "ia",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "ig",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "is",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              id: {
                _desired: "jv",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "ka",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              fr: {
                _desired: "kg",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              ru: {
                _desired: "kk",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "km",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "kn",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "kri",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              tr: {
                _desired: "ku",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              ru: {
                _desired: "ky",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              it: {
                _desired: "la",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "lg",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              fr: {
                _desired: "ln",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "lo",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "loz",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              fr: {
                _desired: "lua",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              hi: {
                _desired: "mai",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "mfe",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              fr: {
                _desired: "mg",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "mi",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "ml",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              ru: {
                _desired: "mn",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              hi: {
                _desired: "mr",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              id: {
                _desired: "ms",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "mt",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "my",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "ne",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              nb: {
                _desired: "nn",
                _distance: "20"
              }
            },
            {
              no: {
                _desired: "nn",
                _distance: "20"
              }
            },
            {
              en: {
                _desired: "nso",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "ny",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "nyn",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              fr: {
                _desired: "oc",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "om",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "or",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "pa",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "pcm",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "ps",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              es: {
                _desired: "qu",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              de: {
                _desired: "rm",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "rn",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              fr: {
                _desired: "rw",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              hi: {
                _desired: "sa",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "sd",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "si",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "sn",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "so",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "sq",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "st",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              id: {
                _desired: "su",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "sw",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "ta",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "te",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              ru: {
                _desired: "tg",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "ti",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              ru: {
                _desired: "tk",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "tlh",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "tn",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "to",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              ru: {
                _desired: "tt",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "tum",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              zh: {
                _desired: "ug",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              ru: {
                _desired: "uk",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "ur",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              ru: {
                _desired: "uz",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              fr: {
                _desired: "wo",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "xh",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "yi",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "yo",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              zh: {
                _desired: "za",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              en: {
                _desired: "zu",
                _distance: "30",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "aao",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "abh",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "abv",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "acm",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "acq",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "acw",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "acx",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "acy",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "adf",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "aeb",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "aec",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "afb",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "ajp",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "apc",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "apd",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "arq",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "ars",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "ary",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "arz",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "auz",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "avl",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "ayh",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "ayl",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "ayn",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "ayp",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "bbz",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "pga",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "shu",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ar: {
                _desired: "ssh",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              az: {
                _desired: "azb",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              et: {
                _desired: "vro",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ff: {
                _desired: "ffm",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ff: {
                _desired: "fub",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ff: {
                _desired: "fue",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ff: {
                _desired: "fuf",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ff: {
                _desired: "fuh",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ff: {
                _desired: "fui",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ff: {
                _desired: "fuq",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ff: {
                _desired: "fuv",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              gn: {
                _desired: "gnw",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              gn: {
                _desired: "gui",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              gn: {
                _desired: "gun",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              gn: {
                _desired: "nhd",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              iu: {
                _desired: "ikt",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              kln: {
                _desired: "enb",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              kln: {
                _desired: "eyo",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              kln: {
                _desired: "niq",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              kln: {
                _desired: "oki",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              kln: {
                _desired: "pko",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              kln: {
                _desired: "sgc",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              kln: {
                _desired: "tec",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              kln: {
                _desired: "tuy",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              kok: {
                _desired: "gom",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              kpe: {
                _desired: "gkp",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              luy: {
                _desired: "ida",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              luy: {
                _desired: "lkb",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              luy: {
                _desired: "lko",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              luy: {
                _desired: "lks",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              luy: {
                _desired: "lri",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              luy: {
                _desired: "lrm",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              luy: {
                _desired: "lsm",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              luy: {
                _desired: "lto",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              luy: {
                _desired: "lts",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              luy: {
                _desired: "lwg",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              luy: {
                _desired: "nle",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              luy: {
                _desired: "nyd",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              luy: {
                _desired: "rag",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              lv: {
                _desired: "ltg",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              mg: {
                _desired: "bhr",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              mg: {
                _desired: "bjq",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              mg: {
                _desired: "bmm",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              mg: {
                _desired: "bzc",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              mg: {
                _desired: "msh",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              mg: {
                _desired: "skg",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              mg: {
                _desired: "tdx",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              mg: {
                _desired: "tkg",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              mg: {
                _desired: "txy",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              mg: {
                _desired: "xmv",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              mg: {
                _desired: "xmw",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              mn: {
                _desired: "mvf",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "bjn",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "btj",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "bve",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "bvu",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "coa",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "dup",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "hji",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "id",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "jak",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "jax",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "kvb",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "kvr",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "kxd",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "lce",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "lcf",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "liw",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "max",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "meo",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "mfa",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "mfb",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "min",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "mqg",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "msi",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "mui",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "orn",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "ors",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "pel",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "pse",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "tmw",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "urk",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "vkk",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "vkt",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "xmm",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "zlm",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ms: {
                _desired: "zmi",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ne: {
                _desired: "dty",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              om: {
                _desired: "gax",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              om: {
                _desired: "hae",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              om: {
                _desired: "orc",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              or: {
                _desired: "spv",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ps: {
                _desired: "pbt",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              ps: {
                _desired: "pst",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qub",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qud",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "quf",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qug",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "quh",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "quk",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qul",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qup",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qur",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qus",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "quw",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qux",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "quy",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qva",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qvc",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qve",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qvh",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qvi",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qvj",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qvl",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qvm",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qvn",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qvo",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qvp",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qvs",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qvw",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qvz",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qwa",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qwc",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qwh",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qws",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qxa",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qxc",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qxh",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qxl",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qxn",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qxo",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qxp",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qxr",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qxt",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qxu",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              qu: {
                _desired: "qxw",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              sc: {
                _desired: "sdc",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              sc: {
                _desired: "sdn",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              sc: {
                _desired: "sro",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              sq: {
                _desired: "aae",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              sq: {
                _desired: "aat",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              sq: {
                _desired: "aln",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              syr: {
                _desired: "aii",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              uz: {
                _desired: "uzs",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              yi: {
                _desired: "yih",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              zh: {
                _desired: "cdo",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              zh: {
                _desired: "cjy",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              zh: {
                _desired: "cpx",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              zh: {
                _desired: "czh",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              zh: {
                _desired: "czo",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              zh: {
                _desired: "gan",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              zh: {
                _desired: "hak",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              zh: {
                _desired: "hsn",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              zh: {
                _desired: "lzh",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              zh: {
                _desired: "mnp",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              zh: {
                _desired: "nan",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              zh: {
                _desired: "wuu",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              zh: {
                _desired: "yue",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "*": {
                _desired: "*",
                _distance: "80"
              }
            },
            {
              "en-Latn": {
                _desired: "am-Ethi",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "ru-Cyrl": {
                _desired: "az-Latn",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "en-Latn": {
                _desired: "bn-Beng",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "zh-Hans": {
                _desired: "bo-Tibt",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "ru-Cyrl": {
                _desired: "hy-Armn",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "en-Latn": {
                _desired: "ka-Geor",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "en-Latn": {
                _desired: "km-Khmr",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "en-Latn": {
                _desired: "kn-Knda",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "en-Latn": {
                _desired: "lo-Laoo",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "en-Latn": {
                _desired: "ml-Mlym",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "en-Latn": {
                _desired: "my-Mymr",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "en-Latn": {
                _desired: "ne-Deva",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "en-Latn": {
                _desired: "or-Orya",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "en-Latn": {
                _desired: "pa-Guru",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "en-Latn": {
                _desired: "ps-Arab",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "en-Latn": {
                _desired: "sd-Arab",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "en-Latn": {
                _desired: "si-Sinh",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "en-Latn": {
                _desired: "ta-Taml",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "en-Latn": {
                _desired: "te-Telu",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "en-Latn": {
                _desired: "ti-Ethi",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "ru-Cyrl": {
                _desired: "tk-Latn",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "en-Latn": {
                _desired: "ur-Arab",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "ru-Cyrl": {
                _desired: "uz-Latn",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "en-Latn": {
                _desired: "yi-Hebr",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "sr-Cyrl": {
                _desired: "sr-Latn",
                _distance: "5"
              }
            },
            {
              "zh-Hans": {
                _desired: "za-Latn",
                _distance: "10",
                _oneway: "true"
              }
            },
            {
              "zh-Hans": {
                _desired: "zh-Hani",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              "zh-Hant": {
                _desired: "zh-Hani",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              "ar-Arab": {
                _desired: "ar-Latn",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              "bn-Beng": {
                _desired: "bn-Latn",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              "gu-Gujr": {
                _desired: "gu-Latn",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              "hi-Deva": {
                _desired: "hi-Latn",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              "kn-Knda": {
                _desired: "kn-Latn",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              "ml-Mlym": {
                _desired: "ml-Latn",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              "mr-Deva": {
                _desired: "mr-Latn",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              "ta-Taml": {
                _desired: "ta-Latn",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              "te-Telu": {
                _desired: "te-Latn",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              "zh-Hans": {
                _desired: "zh-Latn",
                _distance: "20",
                _oneway: "true"
              }
            },
            {
              "ja-Jpan": {
                _desired: "ja-Latn",
                _distance: "5",
                _oneway: "true"
              }
            },
            {
              "ja-Jpan": {
                _desired: "ja-Hani",
                _distance: "5",
                _oneway: "true"
              }
            },
            {
              "ja-Jpan": {
                _desired: "ja-Hira",
                _distance: "5",
                _oneway: "true"
              }
            },
            {
              "ja-Jpan": {
                _desired: "ja-Kana",
                _distance: "5",
                _oneway: "true"
              }
            },
            {
              "ja-Jpan": {
                _desired: "ja-Hrkt",
                _distance: "5",
                _oneway: "true"
              }
            },
            {
              "ja-Hrkt": {
                _desired: "ja-Hira",
                _distance: "5",
                _oneway: "true"
              }
            },
            {
              "ja-Hrkt": {
                _desired: "ja-Kana",
                _distance: "5",
                _oneway: "true"
              }
            },
            {
              "ko-Kore": {
                _desired: "ko-Hani",
                _distance: "5",
                _oneway: "true"
              }
            },
            {
              "ko-Kore": {
                _desired: "ko-Hang",
                _distance: "5",
                _oneway: "true"
              }
            },
            {
              "ko-Kore": {
                _desired: "ko-Jamo",
                _distance: "5",
                _oneway: "true"
              }
            },
            {
              "ko-Hang": {
                _desired: "ko-Jamo",
                _distance: "5",
                _oneway: "true"
              }
            },
            {
              "*-*": {
                _desired: "*-*",
                _distance: "50"
              }
            },
            {
              "ar-*-$maghreb": {
                _desired: "ar-*-$maghreb",
                _distance: "4"
              }
            },
            {
              "ar-*-$!maghreb": {
                _desired: "ar-*-$!maghreb",
                _distance: "4"
              }
            },
            {
              "ar-*-*": {
                _desired: "ar-*-*",
                _distance: "5"
              }
            },
            {
              "en-*-$enUS": {
                _desired: "en-*-$enUS",
                _distance: "4"
              }
            },
            {
              "en-*-GB": {
                _desired: "en-*-$!enUS",
                _distance: "3"
              }
            },
            {
              "en-*-$!enUS": {
                _desired: "en-*-$!enUS",
                _distance: "4"
              }
            },
            {
              "en-*-*": {
                _desired: "en-*-*",
                _distance: "5"
              }
            },
            {
              "es-*-$americas": {
                _desired: "es-*-$americas",
                _distance: "4"
              }
            },
            {
              "es-*-$!americas": {
                _desired: "es-*-$!americas",
                _distance: "4"
              }
            },
            {
              "es-*-*": {
                _desired: "es-*-*",
                _distance: "5"
              }
            },
            {
              "pt-*-$americas": {
                _desired: "pt-*-$americas",
                _distance: "4"
              }
            },
            {
              "pt-*-$!americas": {
                _desired: "pt-*-$!americas",
                _distance: "4"
              }
            },
            {
              "pt-*-*": {
                _desired: "pt-*-*",
                _distance: "5"
              }
            },
            {
              "zh-Hant-$cnsar": {
                _desired: "zh-Hant-$cnsar",
                _distance: "4"
              }
            },
            {
              "zh-Hant-$!cnsar": {
                _desired: "zh-Hant-$!cnsar",
                _distance: "4"
              }
            },
            {
              "zh-Hant-*": {
                _desired: "zh-Hant-*",
                _distance: "5"
              }
            },
            {
              "*-*-*": {
                _desired: "*-*-*",
                _distance: "4"
              }
            }
          ]
        }
      }
    };
  }
});

// node_modules/@formatjs/intl-localematcher/lib/abstract/regions.generated.js
var regions;
var init_regions_generated = __esm({
  "node_modules/@formatjs/intl-localematcher/lib/abstract/regions.generated.js"() {
    regions = {
      "001": [
        "001",
        "001-status-grouping",
        "002",
        "005",
        "009",
        "011",
        "013",
        "014",
        "015",
        "017",
        "018",
        "019",
        "021",
        "029",
        "030",
        "034",
        "035",
        "039",
        "053",
        "054",
        "057",
        "061",
        "142",
        "143",
        "145",
        "150",
        "151",
        "154",
        "155",
        "AC",
        "AD",
        "AE",
        "AF",
        "AG",
        "AI",
        "AL",
        "AM",
        "AO",
        "AQ",
        "AR",
        "AS",
        "AT",
        "AU",
        "AW",
        "AX",
        "AZ",
        "BA",
        "BB",
        "BD",
        "BE",
        "BF",
        "BG",
        "BH",
        "BI",
        "BJ",
        "BL",
        "BM",
        "BN",
        "BO",
        "BQ",
        "BR",
        "BS",
        "BT",
        "BV",
        "BW",
        "BY",
        "BZ",
        "CA",
        "CC",
        "CD",
        "CF",
        "CG",
        "CH",
        "CI",
        "CK",
        "CL",
        "CM",
        "CN",
        "CO",
        "CP",
        "CQ",
        "CR",
        "CU",
        "CV",
        "CW",
        "CX",
        "CY",
        "CZ",
        "DE",
        "DG",
        "DJ",
        "DK",
        "DM",
        "DO",
        "DZ",
        "EA",
        "EC",
        "EE",
        "EG",
        "EH",
        "ER",
        "ES",
        "ET",
        "EU",
        "EZ",
        "FI",
        "FJ",
        "FK",
        "FM",
        "FO",
        "FR",
        "GA",
        "GB",
        "GD",
        "GE",
        "GF",
        "GG",
        "GH",
        "GI",
        "GL",
        "GM",
        "GN",
        "GP",
        "GQ",
        "GR",
        "GS",
        "GT",
        "GU",
        "GW",
        "GY",
        "HK",
        "HM",
        "HN",
        "HR",
        "HT",
        "HU",
        "IC",
        "ID",
        "IE",
        "IL",
        "IM",
        "IN",
        "IO",
        "IQ",
        "IR",
        "IS",
        "IT",
        "JE",
        "JM",
        "JO",
        "JP",
        "KE",
        "KG",
        "KH",
        "KI",
        "KM",
        "KN",
        "KP",
        "KR",
        "KW",
        "KY",
        "KZ",
        "LA",
        "LB",
        "LC",
        "LI",
        "LK",
        "LR",
        "LS",
        "LT",
        "LU",
        "LV",
        "LY",
        "MA",
        "MC",
        "MD",
        "ME",
        "MF",
        "MG",
        "MH",
        "MK",
        "ML",
        "MM",
        "MN",
        "MO",
        "MP",
        "MQ",
        "MR",
        "MS",
        "MT",
        "MU",
        "MV",
        "MW",
        "MX",
        "MY",
        "MZ",
        "NA",
        "NC",
        "NE",
        "NF",
        "NG",
        "NI",
        "NL",
        "NO",
        "NP",
        "NR",
        "NU",
        "NZ",
        "OM",
        "PA",
        "PE",
        "PF",
        "PG",
        "PH",
        "PK",
        "PL",
        "PM",
        "PN",
        "PR",
        "PS",
        "PT",
        "PW",
        "PY",
        "QA",
        "QO",
        "RE",
        "RO",
        "RS",
        "RU",
        "RW",
        "SA",
        "SB",
        "SC",
        "SD",
        "SE",
        "SG",
        "SH",
        "SI",
        "SJ",
        "SK",
        "SL",
        "SM",
        "SN",
        "SO",
        "SR",
        "SS",
        "ST",
        "SV",
        "SX",
        "SY",
        "SZ",
        "TA",
        "TC",
        "TD",
        "TF",
        "TG",
        "TH",
        "TJ",
        "TK",
        "TL",
        "TM",
        "TN",
        "TO",
        "TR",
        "TT",
        "TV",
        "TW",
        "TZ",
        "UA",
        "UG",
        "UM",
        "UN",
        "US",
        "UY",
        "UZ",
        "VA",
        "VC",
        "VE",
        "VG",
        "VI",
        "VN",
        "VU",
        "WF",
        "WS",
        "XK",
        "YE",
        "YT",
        "ZA",
        "ZM",
        "ZW"
      ],
      "002": [
        "002",
        "002-status-grouping",
        "011",
        "014",
        "015",
        "017",
        "018",
        "202",
        "AO",
        "BF",
        "BI",
        "BJ",
        "BW",
        "CD",
        "CF",
        "CG",
        "CI",
        "CM",
        "CV",
        "DJ",
        "DZ",
        "EA",
        "EG",
        "EH",
        "ER",
        "ET",
        "GA",
        "GH",
        "GM",
        "GN",
        "GQ",
        "GW",
        "IC",
        "IO",
        "KE",
        "KM",
        "LR",
        "LS",
        "LY",
        "MA",
        "MG",
        "ML",
        "MR",
        "MU",
        "MW",
        "MZ",
        "NA",
        "NE",
        "NG",
        "RE",
        "RW",
        "SC",
        "SD",
        "SH",
        "SL",
        "SN",
        "SO",
        "SS",
        "ST",
        "SZ",
        "TD",
        "TF",
        "TG",
        "TN",
        "TZ",
        "UG",
        "YT",
        "ZA",
        "ZM",
        "ZW"
      ],
      "003": [
        "003",
        "013",
        "021",
        "029",
        "AG",
        "AI",
        "AW",
        "BB",
        "BL",
        "BM",
        "BQ",
        "BS",
        "BZ",
        "CA",
        "CR",
        "CU",
        "CW",
        "DM",
        "DO",
        "GD",
        "GL",
        "GP",
        "GT",
        "HN",
        "HT",
        "JM",
        "KN",
        "KY",
        "LC",
        "MF",
        "MQ",
        "MS",
        "MX",
        "NI",
        "PA",
        "PM",
        "PR",
        "SV",
        "SX",
        "TC",
        "TT",
        "US",
        "VC",
        "VG",
        "VI"
      ],
      "005": [
        "005",
        "AR",
        "BO",
        "BR",
        "BV",
        "CL",
        "CO",
        "EC",
        "FK",
        "GF",
        "GS",
        "GY",
        "PE",
        "PY",
        "SR",
        "UY",
        "VE"
      ],
      "009": [
        "009",
        "053",
        "054",
        "057",
        "061",
        "AC",
        "AQ",
        "AS",
        "AU",
        "CC",
        "CK",
        "CP",
        "CX",
        "DG",
        "FJ",
        "FM",
        "GU",
        "HM",
        "KI",
        "MH",
        "MP",
        "NC",
        "NF",
        "NR",
        "NU",
        "NZ",
        "PF",
        "PG",
        "PN",
        "PW",
        "QO",
        "SB",
        "TA",
        "TK",
        "TO",
        "TV",
        "UM",
        "VU",
        "WF",
        "WS"
      ],
      "011": [
        "011",
        "BF",
        "BJ",
        "CI",
        "CV",
        "GH",
        "GM",
        "GN",
        "GW",
        "LR",
        "ML",
        "MR",
        "NE",
        "NG",
        "SH",
        "SL",
        "SN",
        "TG"
      ],
      "013": [
        "013",
        "BZ",
        "CR",
        "GT",
        "HN",
        "MX",
        "NI",
        "PA",
        "SV"
      ],
      "014": [
        "014",
        "BI",
        "DJ",
        "ER",
        "ET",
        "IO",
        "KE",
        "KM",
        "MG",
        "MU",
        "MW",
        "MZ",
        "RE",
        "RW",
        "SC",
        "SO",
        "SS",
        "TF",
        "TZ",
        "UG",
        "YT",
        "ZM",
        "ZW"
      ],
      "015": [
        "015",
        "DZ",
        "EA",
        "EG",
        "EH",
        "IC",
        "LY",
        "MA",
        "SD",
        "TN"
      ],
      "017": [
        "017",
        "AO",
        "CD",
        "CF",
        "CG",
        "CM",
        "GA",
        "GQ",
        "ST",
        "TD"
      ],
      "018": [
        "018",
        "BW",
        "LS",
        "NA",
        "SZ",
        "ZA"
      ],
      "019": [
        "003",
        "005",
        "013",
        "019",
        "019-status-grouping",
        "021",
        "029",
        "419",
        "AG",
        "AI",
        "AR",
        "AW",
        "BB",
        "BL",
        "BM",
        "BO",
        "BQ",
        "BR",
        "BS",
        "BV",
        "BZ",
        "CA",
        "CL",
        "CO",
        "CR",
        "CU",
        "CW",
        "DM",
        "DO",
        "EC",
        "FK",
        "GD",
        "GF",
        "GL",
        "GP",
        "GS",
        "GT",
        "GY",
        "HN",
        "HT",
        "JM",
        "KN",
        "KY",
        "LC",
        "MF",
        "MQ",
        "MS",
        "MX",
        "NI",
        "PA",
        "PE",
        "PM",
        "PR",
        "PY",
        "SR",
        "SV",
        "SX",
        "TC",
        "TT",
        "US",
        "UY",
        "VC",
        "VE",
        "VG",
        "VI"
      ],
      "021": [
        "021",
        "BM",
        "CA",
        "GL",
        "PM",
        "US"
      ],
      "029": [
        "029",
        "AG",
        "AI",
        "AW",
        "BB",
        "BL",
        "BQ",
        "BS",
        "CU",
        "CW",
        "DM",
        "DO",
        "GD",
        "GP",
        "HT",
        "JM",
        "KN",
        "KY",
        "LC",
        "MF",
        "MQ",
        "MS",
        "PR",
        "SX",
        "TC",
        "TT",
        "VC",
        "VG",
        "VI"
      ],
      "030": [
        "030",
        "CN",
        "HK",
        "JP",
        "KP",
        "KR",
        "MN",
        "MO",
        "TW"
      ],
      "034": [
        "034",
        "AF",
        "BD",
        "BT",
        "IN",
        "IR",
        "LK",
        "MV",
        "NP",
        "PK"
      ],
      "035": [
        "035",
        "BN",
        "ID",
        "KH",
        "LA",
        "MM",
        "MY",
        "PH",
        "SG",
        "TH",
        "TL",
        "VN"
      ],
      "039": [
        "039",
        "AD",
        "AL",
        "BA",
        "ES",
        "GI",
        "GR",
        "HR",
        "IT",
        "ME",
        "MK",
        "MT",
        "PT",
        "RS",
        "SI",
        "SM",
        "VA",
        "XK"
      ],
      "053": [
        "053",
        "AU",
        "CC",
        "CX",
        "HM",
        "NF",
        "NZ"
      ],
      "054": [
        "054",
        "FJ",
        "NC",
        "PG",
        "SB",
        "VU"
      ],
      "057": [
        "057",
        "FM",
        "GU",
        "KI",
        "MH",
        "MP",
        "NR",
        "PW",
        "UM"
      ],
      "061": [
        "061",
        "AS",
        "CK",
        "NU",
        "PF",
        "PN",
        "TK",
        "TO",
        "TV",
        "WF",
        "WS"
      ],
      "142": [
        "030",
        "034",
        "035",
        "142",
        "143",
        "145",
        "AE",
        "AF",
        "AM",
        "AZ",
        "BD",
        "BH",
        "BN",
        "BT",
        "CN",
        "CY",
        "GE",
        "HK",
        "ID",
        "IL",
        "IN",
        "IQ",
        "IR",
        "JO",
        "JP",
        "KG",
        "KH",
        "KP",
        "KR",
        "KW",
        "KZ",
        "LA",
        "LB",
        "LK",
        "MM",
        "MN",
        "MO",
        "MV",
        "MY",
        "NP",
        "OM",
        "PH",
        "PK",
        "PS",
        "QA",
        "SA",
        "SG",
        "SY",
        "TH",
        "TJ",
        "TL",
        "TM",
        "TR",
        "TW",
        "UZ",
        "VN",
        "YE"
      ],
      "143": [
        "143",
        "KG",
        "KZ",
        "TJ",
        "TM",
        "UZ"
      ],
      "145": [
        "145",
        "AE",
        "AM",
        "AZ",
        "BH",
        "CY",
        "GE",
        "IL",
        "IQ",
        "JO",
        "KW",
        "LB",
        "OM",
        "PS",
        "QA",
        "SA",
        "SY",
        "TR",
        "YE"
      ],
      "150": [
        "039",
        "150",
        "151",
        "154",
        "155",
        "AD",
        "AL",
        "AT",
        "AX",
        "BA",
        "BE",
        "BG",
        "BY",
        "CH",
        "CQ",
        "CZ",
        "DE",
        "DK",
        "EE",
        "ES",
        "FI",
        "FO",
        "FR",
        "GB",
        "GG",
        "GI",
        "GR",
        "HR",
        "HU",
        "IE",
        "IM",
        "IS",
        "IT",
        "JE",
        "LI",
        "LT",
        "LU",
        "LV",
        "MC",
        "MD",
        "ME",
        "MK",
        "MT",
        "NL",
        "NO",
        "PL",
        "PT",
        "RO",
        "RS",
        "RU",
        "SE",
        "SI",
        "SJ",
        "SK",
        "SM",
        "UA",
        "VA",
        "XK"
      ],
      "151": [
        "151",
        "BG",
        "BY",
        "CZ",
        "HU",
        "MD",
        "PL",
        "RO",
        "RU",
        "SK",
        "UA"
      ],
      "154": [
        "154",
        "AX",
        "CQ",
        "DK",
        "EE",
        "FI",
        "FO",
        "GB",
        "GG",
        "IE",
        "IM",
        "IS",
        "JE",
        "LT",
        "LV",
        "NO",
        "SE",
        "SJ"
      ],
      "155": [
        "155",
        "AT",
        "BE",
        "CH",
        "DE",
        "FR",
        "LI",
        "LU",
        "MC",
        "NL"
      ],
      "202": [
        "011",
        "014",
        "017",
        "018",
        "202",
        "AO",
        "BF",
        "BI",
        "BJ",
        "BW",
        "CD",
        "CF",
        "CG",
        "CI",
        "CM",
        "CV",
        "DJ",
        "ER",
        "ET",
        "GA",
        "GH",
        "GM",
        "GN",
        "GQ",
        "GW",
        "IO",
        "KE",
        "KM",
        "LR",
        "LS",
        "MG",
        "ML",
        "MR",
        "MU",
        "MW",
        "MZ",
        "NA",
        "NE",
        "NG",
        "RE",
        "RW",
        "SC",
        "SH",
        "SL",
        "SN",
        "SO",
        "SS",
        "ST",
        "SZ",
        "TD",
        "TF",
        "TG",
        "TZ",
        "UG",
        "YT",
        "ZA",
        "ZM",
        "ZW"
      ],
      "419": [
        "005",
        "013",
        "029",
        "419",
        "AG",
        "AI",
        "AR",
        "AW",
        "BB",
        "BL",
        "BO",
        "BQ",
        "BR",
        "BS",
        "BV",
        "BZ",
        "CL",
        "CO",
        "CR",
        "CU",
        "CW",
        "DM",
        "DO",
        "EC",
        "FK",
        "GD",
        "GF",
        "GP",
        "GS",
        "GT",
        "GY",
        "HN",
        "HT",
        "JM",
        "KN",
        "KY",
        "LC",
        "MF",
        "MQ",
        "MS",
        "MX",
        "NI",
        "PA",
        "PE",
        "PR",
        "PY",
        "SR",
        "SV",
        "SX",
        "TC",
        "TT",
        "UY",
        "VC",
        "VE",
        "VG",
        "VI"
      ],
      "EU": [
        "AT",
        "BE",
        "BG",
        "CY",
        "CZ",
        "DE",
        "DK",
        "EE",
        "ES",
        "EU",
        "FI",
        "FR",
        "GR",
        "HR",
        "HU",
        "IE",
        "IT",
        "LT",
        "LU",
        "LV",
        "MT",
        "NL",
        "PL",
        "PT",
        "RO",
        "SE",
        "SI",
        "SK"
      ],
      "EZ": [
        "AT",
        "BE",
        "CY",
        "DE",
        "EE",
        "ES",
        "EZ",
        "FI",
        "FR",
        "GR",
        "IE",
        "IT",
        "LT",
        "LU",
        "LV",
        "MT",
        "NL",
        "PT",
        "SI",
        "SK"
      ],
      "QO": [
        "AC",
        "AQ",
        "CP",
        "DG",
        "QO",
        "TA"
      ],
      "UN": [
        "AD",
        "AE",
        "AF",
        "AG",
        "AL",
        "AM",
        "AO",
        "AR",
        "AT",
        "AU",
        "AZ",
        "BA",
        "BB",
        "BD",
        "BE",
        "BF",
        "BG",
        "BH",
        "BI",
        "BJ",
        "BN",
        "BO",
        "BR",
        "BS",
        "BT",
        "BW",
        "BY",
        "BZ",
        "CA",
        "CD",
        "CF",
        "CG",
        "CH",
        "CI",
        "CL",
        "CM",
        "CN",
        "CO",
        "CR",
        "CU",
        "CV",
        "CY",
        "CZ",
        "DE",
        "DJ",
        "DK",
        "DM",
        "DO",
        "DZ",
        "EC",
        "EE",
        "EG",
        "ER",
        "ES",
        "ET",
        "FI",
        "FJ",
        "FM",
        "FR",
        "GA",
        "GB",
        "GD",
        "GE",
        "GH",
        "GM",
        "GN",
        "GQ",
        "GR",
        "GT",
        "GW",
        "GY",
        "HN",
        "HR",
        "HT",
        "HU",
        "ID",
        "IE",
        "IL",
        "IN",
        "IQ",
        "IR",
        "IS",
        "IT",
        "JM",
        "JO",
        "JP",
        "KE",
        "KG",
        "KH",
        "KI",
        "KM",
        "KN",
        "KP",
        "KR",
        "KW",
        "KZ",
        "LA",
        "LB",
        "LC",
        "LI",
        "LK",
        "LR",
        "LS",
        "LT",
        "LU",
        "LV",
        "LY",
        "MA",
        "MC",
        "MD",
        "ME",
        "MG",
        "MH",
        "MK",
        "ML",
        "MM",
        "MN",
        "MR",
        "MT",
        "MU",
        "MV",
        "MW",
        "MX",
        "MY",
        "MZ",
        "NA",
        "NE",
        "NG",
        "NI",
        "NL",
        "NO",
        "NP",
        "NR",
        "NZ",
        "OM",
        "PA",
        "PE",
        "PG",
        "PH",
        "PK",
        "PL",
        "PT",
        "PW",
        "PY",
        "QA",
        "RO",
        "RS",
        "RU",
        "RW",
        "SA",
        "SB",
        "SC",
        "SD",
        "SE",
        "SG",
        "SI",
        "SK",
        "SL",
        "SM",
        "SN",
        "SO",
        "SR",
        "SS",
        "ST",
        "SV",
        "SY",
        "SZ",
        "TD",
        "TG",
        "TH",
        "TJ",
        "TL",
        "TM",
        "TN",
        "TO",
        "TR",
        "TT",
        "TV",
        "TZ",
        "UA",
        "UG",
        "UN",
        "US",
        "UY",
        "UZ",
        "VC",
        "VE",
        "VN",
        "VU",
        "WS",
        "YE",
        "ZA",
        "ZM",
        "ZW"
      ]
    };
  }
});

// node_modules/@formatjs/intl-localematcher/lib/abstract/utils.js
function invariant2(condition, message, Err) {
  if (Err === void 0) {
    Err = Error;
  }
  if (!condition) {
    throw new Err(message);
  }
}
function processData() {
  var _a, _b;
  if (!PROCESSED_DATA) {
    var paradigmLocales = (_b = (_a = data.supplemental.languageMatching["written-new"][0]) === null || _a === void 0 ? void 0 : _a.paradigmLocales) === null || _b === void 0 ? void 0 : _b._locales.split(" ");
    var matchVariables = data.supplemental.languageMatching["written-new"].slice(1, 5);
    var data2 = data.supplemental.languageMatching["written-new"].slice(5);
    var matches = data2.map(function(d) {
      var key = Object.keys(d)[0];
      var value = d[key];
      return {
        supported: key,
        desired: value._desired,
        distance: +value._distance,
        oneway: value.oneway === "true" ? true : false
      };
    }, {});
    PROCESSED_DATA = {
      matches,
      matchVariables: matchVariables.reduce(function(all, d) {
        var key = Object.keys(d)[0];
        var value = d[key];
        all[key.slice(1)] = value._value.split("+");
        return all;
      }, {}),
      paradigmLocales: __spreadArray(__spreadArray([], paradigmLocales, true), paradigmLocales.map(function(l) {
        return new Intl.Locale(l.replace(/_/g, "-")).maximize().toString();
      }), true)
    };
  }
  return PROCESSED_DATA;
}
function isMatched(locale, languageMatchInfoLocale, matchVariables) {
  var _a = languageMatchInfoLocale.split("-"), language = _a[0], script = _a[1], region = _a[2];
  var matches = true;
  if (region && region[0] === "$") {
    var shouldInclude = region[1] !== "!";
    var matchRegions = shouldInclude ? matchVariables[region.slice(1)] : matchVariables[region.slice(2)];
    var expandedMatchedRegions = matchRegions.map(function(r) {
      return regions[r] || [r];
    }).reduce(function(all, list) {
      return __spreadArray(__spreadArray([], all, true), list, true);
    }, []);
    matches && (matches = !(expandedMatchedRegions.indexOf(locale.region || "") > 1 != shouldInclude));
  } else {
    matches && (matches = locale.region ? region === "*" || region === locale.region : true);
  }
  matches && (matches = locale.script ? script === "*" || script === locale.script : true);
  matches && (matches = locale.language ? language === "*" || language === locale.language : true);
  return matches;
}
function serializeLSR(lsr) {
  return [lsr.language, lsr.script, lsr.region].filter(Boolean).join("-");
}
function findMatchingDistanceForLSR(desired, supported, data2) {
  for (var _i = 0, _a = data2.matches; _i < _a.length; _i++) {
    var d = _a[_i];
    var matches = isMatched(desired, d.desired, data2.matchVariables) && isMatched(supported, d.supported, data2.matchVariables);
    if (!d.oneway && !matches) {
      matches = isMatched(desired, d.supported, data2.matchVariables) && isMatched(supported, d.desired, data2.matchVariables);
    }
    if (matches) {
      var distance = d.distance * 10;
      if (data2.paradigmLocales.indexOf(serializeLSR(desired)) > -1 != data2.paradigmLocales.indexOf(serializeLSR(supported)) > -1) {
        return distance - 1;
      }
      return distance;
    }
  }
  throw new Error("No matching distance found");
}
function findMatchingDistance(desired, supported) {
  var desiredLocale = new Intl.Locale(desired).maximize();
  var supportedLocale = new Intl.Locale(supported).maximize();
  var desiredLSR = {
    language: desiredLocale.language,
    script: desiredLocale.script || "",
    region: desiredLocale.region || ""
  };
  var supportedLSR = {
    language: supportedLocale.language,
    script: supportedLocale.script || "",
    region: supportedLocale.region || ""
  };
  var matchingDistance = 0;
  var data2 = processData();
  if (desiredLSR.language !== supportedLSR.language) {
    matchingDistance += findMatchingDistanceForLSR({
      language: desiredLocale.language,
      script: "",
      region: ""
    }, {
      language: supportedLocale.language,
      script: "",
      region: ""
    }, data2);
  }
  if (desiredLSR.script !== supportedLSR.script) {
    matchingDistance += findMatchingDistanceForLSR({
      language: desiredLocale.language,
      script: desiredLSR.script,
      region: ""
    }, {
      language: supportedLocale.language,
      script: desiredLSR.script,
      region: ""
    }, data2);
  }
  if (desiredLSR.region !== supportedLSR.region) {
    matchingDistance += findMatchingDistanceForLSR(desiredLSR, supportedLSR, data2);
  }
  return matchingDistance;
}
function findBestMatch(requestedLocales, supportedLocales, threshold) {
  if (threshold === void 0) {
    threshold = DEFAULT_MATCHING_THRESHOLD;
  }
  var lowestDistance = Infinity;
  var result = {
    matchedDesiredLocale: "",
    distances: {}
  };
  requestedLocales.forEach(function(desired, i) {
    if (!result.distances[desired]) {
      result.distances[desired] = {};
    }
    supportedLocales.forEach(function(supported) {
      var distance = findMatchingDistance(desired, supported) + 0 + i * 40;
      result.distances[desired][supported] = distance;
      if (distance < lowestDistance) {
        lowestDistance = distance;
        result.matchedDesiredLocale = desired;
        result.matchedSupportedLocale = supported;
      }
    });
  });
  if (lowestDistance >= threshold) {
    result.matchedDesiredLocale = void 0;
    result.matchedSupportedLocale = void 0;
  }
  return result;
}
var UNICODE_EXTENSION_SEQUENCE_REGEX, DEFAULT_MATCHING_THRESHOLD, PROCESSED_DATA;
var init_utils2 = __esm({
  "node_modules/@formatjs/intl-localematcher/lib/abstract/utils.js"() {
    init_tslib_es6();
    init_languageMatching();
    init_regions_generated();
    UNICODE_EXTENSION_SEQUENCE_REGEX = /-u(?:-[0-9a-z]{2,8})+/gi;
    DEFAULT_MATCHING_THRESHOLD = 838;
  }
});

// node_modules/@formatjs/intl-localematcher/lib/abstract/BestFitMatcher.js
function BestFitMatcher(availableLocales, requestedLocales, getDefaultLocale) {
  var foundLocale;
  var extension;
  var noExtensionLocales = [];
  var noExtensionLocaleMap = requestedLocales.reduce(function(all, l) {
    var noExtensionLocale = l.replace(UNICODE_EXTENSION_SEQUENCE_REGEX, "");
    noExtensionLocales.push(noExtensionLocale);
    all[noExtensionLocale] = l;
    return all;
  }, {});
  var result = findBestMatch(noExtensionLocales, availableLocales);
  if (result.matchedSupportedLocale && result.matchedDesiredLocale) {
    foundLocale = result.matchedSupportedLocale;
    extension = noExtensionLocaleMap[result.matchedDesiredLocale].slice(result.matchedDesiredLocale.length) || void 0;
  }
  if (!foundLocale) {
    return { locale: getDefaultLocale() };
  }
  return {
    locale: foundLocale,
    extension
  };
}
var init_BestFitMatcher = __esm({
  "node_modules/@formatjs/intl-localematcher/lib/abstract/BestFitMatcher.js"() {
    init_utils2();
  }
});

// node_modules/@formatjs/intl-localematcher/lib/abstract/BestAvailableLocale.js
function BestAvailableLocale(availableLocales, locale) {
  var candidate = locale;
  while (true) {
    if (availableLocales.indexOf(candidate) > -1) {
      return candidate;
    }
    var pos = candidate.lastIndexOf("-");
    if (!~pos) {
      return void 0;
    }
    if (pos >= 2 && candidate[pos - 2] === "-") {
      pos -= 2;
    }
    candidate = candidate.slice(0, pos);
  }
}
var init_BestAvailableLocale = __esm({
  "node_modules/@formatjs/intl-localematcher/lib/abstract/BestAvailableLocale.js"() {
  }
});

// node_modules/@formatjs/intl-localematcher/lib/abstract/LookupMatcher.js
function LookupMatcher(availableLocales, requestedLocales, getDefaultLocale) {
  var result = { locale: "" };
  for (var _i = 0, requestedLocales_1 = requestedLocales; _i < requestedLocales_1.length; _i++) {
    var locale = requestedLocales_1[_i];
    var noExtensionLocale = locale.replace(UNICODE_EXTENSION_SEQUENCE_REGEX, "");
    var availableLocale = BestAvailableLocale(availableLocales, noExtensionLocale);
    if (availableLocale) {
      result.locale = availableLocale;
      if (locale !== noExtensionLocale) {
        result.extension = locale.slice(noExtensionLocale.length, locale.length);
      }
      return result;
    }
  }
  result.locale = getDefaultLocale();
  return result;
}
var init_LookupMatcher = __esm({
  "node_modules/@formatjs/intl-localematcher/lib/abstract/LookupMatcher.js"() {
    init_BestAvailableLocale();
    init_utils2();
  }
});

// node_modules/@formatjs/intl-localematcher/lib/abstract/UnicodeExtensionValue.js
function UnicodeExtensionValue(extension, key) {
  invariant2(key.length === 2, "key must have 2 elements");
  var size = extension.length;
  var searchValue = "-".concat(key, "-");
  var pos = extension.indexOf(searchValue);
  if (pos !== -1) {
    var start = pos + 4;
    var end = start;
    var k = start;
    var done = false;
    while (!done) {
      var e = extension.indexOf("-", k);
      var len = void 0;
      if (e === -1) {
        len = size - k;
      } else {
        len = e - k;
      }
      if (len === 2) {
        done = true;
      } else if (e === -1) {
        end = size;
        done = true;
      } else {
        end = e;
        k = e + 1;
      }
    }
    return extension.slice(start, end);
  }
  searchValue = "-".concat(key);
  pos = extension.indexOf(searchValue);
  if (pos !== -1 && pos + 3 === size) {
    return "";
  }
  return void 0;
}
var init_UnicodeExtensionValue = __esm({
  "node_modules/@formatjs/intl-localematcher/lib/abstract/UnicodeExtensionValue.js"() {
    init_utils2();
  }
});

// node_modules/@formatjs/intl-localematcher/lib/abstract/ResolveLocale.js
function ResolveLocale(availableLocales, requestedLocales, options, relevantExtensionKeys, localeData, getDefaultLocale) {
  var matcher = options.localeMatcher;
  var r;
  if (matcher === "lookup") {
    r = LookupMatcher(Array.from(availableLocales), requestedLocales, getDefaultLocale);
  } else {
    r = BestFitMatcher(Array.from(availableLocales), requestedLocales, getDefaultLocale);
  }
  var foundLocale = r.locale;
  var result = { locale: "", dataLocale: foundLocale };
  var supportedExtension = "-u";
  for (var _i = 0, relevantExtensionKeys_1 = relevantExtensionKeys; _i < relevantExtensionKeys_1.length; _i++) {
    var key = relevantExtensionKeys_1[_i];
    invariant2(foundLocale in localeData, "Missing locale data for ".concat(foundLocale));
    var foundLocaleData = localeData[foundLocale];
    invariant2(typeof foundLocaleData === "object" && foundLocaleData !== null, "locale data ".concat(key, " must be an object"));
    var keyLocaleData = foundLocaleData[key];
    invariant2(Array.isArray(keyLocaleData), "keyLocaleData for ".concat(key, " must be an array"));
    var value = keyLocaleData[0];
    invariant2(typeof value === "string" || value === null, "value must be string or null but got ".concat(typeof value, " in key ").concat(key));
    var supportedExtensionAddition = "";
    if (r.extension) {
      var requestedValue = UnicodeExtensionValue(r.extension, key);
      if (requestedValue !== void 0) {
        if (requestedValue !== "") {
          if (~keyLocaleData.indexOf(requestedValue)) {
            value = requestedValue;
            supportedExtensionAddition = "-".concat(key, "-").concat(value);
          }
        } else if (~requestedValue.indexOf("true")) {
          value = "true";
          supportedExtensionAddition = "-".concat(key);
        }
      }
    }
    if (key in options) {
      var optionsValue = options[key];
      invariant2(typeof optionsValue === "string" || typeof optionsValue === "undefined" || optionsValue === null, "optionsValue must be String, Undefined or Null");
      if (~keyLocaleData.indexOf(optionsValue)) {
        if (optionsValue !== value) {
          value = optionsValue;
          supportedExtensionAddition = "";
        }
      }
    }
    result[key] = value;
    supportedExtension += supportedExtensionAddition;
  }
  if (supportedExtension.length > 2) {
    var privateIndex = foundLocale.indexOf("-x-");
    if (privateIndex === -1) {
      foundLocale = foundLocale + supportedExtension;
    } else {
      var preExtension = foundLocale.slice(0, privateIndex);
      var postExtension = foundLocale.slice(privateIndex, foundLocale.length);
      foundLocale = preExtension + supportedExtension + postExtension;
    }
    foundLocale = Intl.getCanonicalLocales(foundLocale)[0];
  }
  result.locale = foundLocale;
  return result;
}
var init_ResolveLocale = __esm({
  "node_modules/@formatjs/intl-localematcher/lib/abstract/ResolveLocale.js"() {
    init_BestFitMatcher();
    init_LookupMatcher();
    init_UnicodeExtensionValue();
    init_utils2();
  }
});

// node_modules/@formatjs/intl-localematcher/lib/abstract/LookupSupportedLocales.js
function LookupSupportedLocales(availableLocales, requestedLocales) {
  var subset = [];
  for (var _i = 0, requestedLocales_1 = requestedLocales; _i < requestedLocales_1.length; _i++) {
    var locale = requestedLocales_1[_i];
    var noExtensionLocale = locale.replace(UNICODE_EXTENSION_SEQUENCE_REGEX, "");
    var availableLocale = BestAvailableLocale(availableLocales, noExtensionLocale);
    if (availableLocale) {
      subset.push(availableLocale);
    }
  }
  return subset;
}
var init_LookupSupportedLocales = __esm({
  "node_modules/@formatjs/intl-localematcher/lib/abstract/LookupSupportedLocales.js"() {
    init_BestAvailableLocale();
    init_utils2();
  }
});

// node_modules/@formatjs/intl-localematcher/lib/index.js
var lib_exports = {};
__export(lib_exports, {
  LookupSupportedLocales: () => LookupSupportedLocales,
  ResolveLocale: () => ResolveLocale,
  match: () => match
});
function match(requestedLocales, availableLocales, defaultLocale, opts) {
  return ResolveLocale(availableLocales, CanonicalizeLocaleList(requestedLocales), {
    localeMatcher: (opts === null || opts === void 0 ? void 0 : opts.algorithm) || "best fit"
  }, [], {}, function() {
    return defaultLocale;
  }).locale;
}
var init_lib = __esm({
  "node_modules/@formatjs/intl-localematcher/lib/index.js"() {
    init_CanonicalizeLocaleList();
    init_ResolveLocale();
    init_LookupSupportedLocales();
    init_ResolveLocale();
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/CanonicalizeLocaleList.js
function CanonicalizeLocaleList2(locales) {
  return Intl.getCanonicalLocales(locales);
}
var init_CanonicalizeLocaleList2 = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/CanonicalizeLocaleList.js"() {
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/CanonicalizeTimeZoneName.js
function CanonicalizeTimeZoneName(tz, _a) {
  var zoneNames = _a.zoneNames, uppercaseLinks = _a.uppercaseLinks;
  var uppercasedTz = tz.toUpperCase();
  var uppercasedZones = zoneNames.reduce(function(all, z) {
    all[z.toUpperCase()] = z;
    return all;
  }, {});
  var ianaTimeZone = uppercaseLinks[uppercasedTz] || uppercasedZones[uppercasedTz];
  if (ianaTimeZone === "Etc/UTC" || ianaTimeZone === "Etc/GMT") {
    return "UTC";
  }
  return ianaTimeZone;
}
var init_CanonicalizeTimeZoneName = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/CanonicalizeTimeZoneName.js"() {
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/262.js
function ToString(o) {
  if (typeof o === "symbol") {
    throw TypeError("Cannot convert a Symbol value to a string");
  }
  return String(o);
}
function ToNumber(val) {
  if (val === void 0) {
    return NaN;
  }
  if (val === null) {
    return 0;
  }
  if (typeof val === "boolean") {
    return val ? 1 : 0;
  }
  if (typeof val === "number") {
    return val;
  }
  if (typeof val === "symbol" || typeof val === "bigint") {
    throw new TypeError("Cannot convert symbol/bigint to number");
  }
  return Number(val);
}
function ToInteger(n) {
  var number = ToNumber(n);
  if (isNaN(number) || SameValue(number, -0)) {
    return 0;
  }
  if (isFinite(number)) {
    return number;
  }
  var integer = Math.floor(Math.abs(number));
  if (number < 0) {
    integer = -integer;
  }
  if (SameValue(integer, -0)) {
    return 0;
  }
  return integer;
}
function TimeClip(time) {
  if (!isFinite(time)) {
    return NaN;
  }
  if (Math.abs(time) > 8.64 * 1e15) {
    return NaN;
  }
  return ToInteger(time);
}
function ToObject(arg) {
  if (arg == null) {
    throw new TypeError("undefined/null cannot be converted to object");
  }
  return Object(arg);
}
function SameValue(x, y) {
  if (Object.is) {
    return Object.is(x, y);
  }
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  }
  return x !== x && y !== y;
}
function ArrayCreate(len) {
  return new Array(len);
}
function HasOwnProperty(o, prop) {
  return Object.prototype.hasOwnProperty.call(o, prop);
}
function Type(x) {
  if (x === null) {
    return "Null";
  }
  if (typeof x === "undefined") {
    return "Undefined";
  }
  if (typeof x === "function" || typeof x === "object") {
    return "Object";
  }
  if (typeof x === "number") {
    return "Number";
  }
  if (typeof x === "boolean") {
    return "Boolean";
  }
  if (typeof x === "string") {
    return "String";
  }
  if (typeof x === "symbol") {
    return "Symbol";
  }
  if (typeof x === "bigint") {
    return "BigInt";
  }
}
function mod(x, y) {
  return x - Math.floor(x / y) * y;
}
function Day(t) {
  return Math.floor(t / MS_PER_DAY);
}
function WeekDay(t) {
  return mod(Day(t) + 4, 7);
}
function DayFromYear(y) {
  return Date.UTC(y, 0) / MS_PER_DAY;
}
function TimeFromYear(y) {
  return Date.UTC(y, 0);
}
function YearFromTime(t) {
  return new Date(t).getUTCFullYear();
}
function DaysInYear(y) {
  if (y % 4 !== 0) {
    return 365;
  }
  if (y % 100 !== 0) {
    return 366;
  }
  if (y % 400 !== 0) {
    return 365;
  }
  return 366;
}
function DayWithinYear(t) {
  return Day(t) - DayFromYear(YearFromTime(t));
}
function InLeapYear(t) {
  return DaysInYear(YearFromTime(t)) === 365 ? 0 : 1;
}
function MonthFromTime(t) {
  var dwy = DayWithinYear(t);
  var leap = InLeapYear(t);
  if (dwy >= 0 && dwy < 31) {
    return 0;
  }
  if (dwy < 59 + leap) {
    return 1;
  }
  if (dwy < 90 + leap) {
    return 2;
  }
  if (dwy < 120 + leap) {
    return 3;
  }
  if (dwy < 151 + leap) {
    return 4;
  }
  if (dwy < 181 + leap) {
    return 5;
  }
  if (dwy < 212 + leap) {
    return 6;
  }
  if (dwy < 243 + leap) {
    return 7;
  }
  if (dwy < 273 + leap) {
    return 8;
  }
  if (dwy < 304 + leap) {
    return 9;
  }
  if (dwy < 334 + leap) {
    return 10;
  }
  if (dwy < 365 + leap) {
    return 11;
  }
  throw new Error("Invalid time");
}
function DateFromTime(t) {
  var dwy = DayWithinYear(t);
  var mft = MonthFromTime(t);
  var leap = InLeapYear(t);
  if (mft === 0) {
    return dwy + 1;
  }
  if (mft === 1) {
    return dwy - 30;
  }
  if (mft === 2) {
    return dwy - 58 - leap;
  }
  if (mft === 3) {
    return dwy - 89 - leap;
  }
  if (mft === 4) {
    return dwy - 119 - leap;
  }
  if (mft === 5) {
    return dwy - 150 - leap;
  }
  if (mft === 6) {
    return dwy - 180 - leap;
  }
  if (mft === 7) {
    return dwy - 211 - leap;
  }
  if (mft === 8) {
    return dwy - 242 - leap;
  }
  if (mft === 9) {
    return dwy - 272 - leap;
  }
  if (mft === 10) {
    return dwy - 303 - leap;
  }
  if (mft === 11) {
    return dwy - 333 - leap;
  }
  throw new Error("Invalid time");
}
function HourFromTime(t) {
  return mod(Math.floor(t / MS_PER_HOUR), HOURS_PER_DAY);
}
function MinFromTime(t) {
  return mod(Math.floor(t / MS_PER_MINUTE), MINUTES_PER_HOUR);
}
function SecFromTime(t) {
  return mod(Math.floor(t / MS_PER_SECOND), SECONDS_PER_MINUTE);
}
function IsCallable(fn) {
  return typeof fn === "function";
}
function OrdinaryHasInstance(C, O, internalSlots) {
  if (!IsCallable(C)) {
    return false;
  }
  if (internalSlots === null || internalSlots === void 0 ? void 0 : internalSlots.boundTargetFunction) {
    var BC = internalSlots === null || internalSlots === void 0 ? void 0 : internalSlots.boundTargetFunction;
    return O instanceof BC;
  }
  if (typeof O !== "object") {
    return false;
  }
  var P = C.prototype;
  if (typeof P !== "object") {
    throw new TypeError("OrdinaryHasInstance called on an object with an invalid prototype property.");
  }
  return Object.prototype.isPrototypeOf.call(P, O);
}
function msFromTime(t) {
  return mod(t, MS_PER_SECOND);
}
var MS_PER_DAY, HOURS_PER_DAY, MINUTES_PER_HOUR, SECONDS_PER_MINUTE, MS_PER_SECOND, MS_PER_MINUTE, MS_PER_HOUR;
var init__ = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/262.js"() {
    MS_PER_DAY = 864e5;
    HOURS_PER_DAY = 24;
    MINUTES_PER_HOUR = 60;
    SECONDS_PER_MINUTE = 60;
    MS_PER_SECOND = 1e3;
    MS_PER_MINUTE = MS_PER_SECOND * SECONDS_PER_MINUTE;
    MS_PER_HOUR = MS_PER_MINUTE * MINUTES_PER_HOUR;
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/CoerceOptionsToObject.js
function CoerceOptionsToObject(options) {
  if (typeof options === "undefined") {
    return /* @__PURE__ */ Object.create(null);
  }
  return ToObject(options);
}
var init_CoerceOptionsToObject = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/CoerceOptionsToObject.js"() {
    init__();
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/DefaultNumberOption.js
function DefaultNumberOption(inputVal, min, max, fallback) {
  if (inputVal === void 0) {
    return fallback;
  }
  var val = Number(inputVal);
  if (isNaN(val) || val < min || val > max) {
    throw new RangeError("".concat(val, " is outside of range [").concat(min, ", ").concat(max, "]"));
  }
  return Math.floor(val);
}
var init_DefaultNumberOption = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/DefaultNumberOption.js"() {
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/GetNumberOption.js
function GetNumberOption(options, property, minimum, maximum, fallback) {
  var val = options[property];
  return DefaultNumberOption(val, minimum, maximum, fallback);
}
var init_GetNumberOption = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/GetNumberOption.js"() {
    init_DefaultNumberOption();
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/GetOption.js
function GetOption(opts, prop, type, values, fallback) {
  if (typeof opts !== "object") {
    throw new TypeError("Options must be an object");
  }
  var value = opts[prop];
  if (value !== void 0) {
    if (type !== "boolean" && type !== "string") {
      throw new TypeError("invalid type");
    }
    if (type === "boolean") {
      value = Boolean(value);
    }
    if (type === "string") {
      value = ToString(value);
    }
    if (values !== void 0 && !values.filter(function(val) {
      return val == value;
    }).length) {
      throw new RangeError("".concat(value, " is not within ").concat(values.join(", ")));
    }
    return value;
  }
  return fallback;
}
var init_GetOption = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/GetOption.js"() {
    init__();
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/GetOptionsObject.js
function GetOptionsObject(options) {
  if (typeof options === "undefined") {
    return /* @__PURE__ */ Object.create(null);
  }
  if (typeof options === "object") {
    return options;
  }
  throw new TypeError("Options must be an object");
}
var init_GetOptionsObject = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/GetOptionsObject.js"() {
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/GetStringOrBooleanOption.js
function GetStringOrBooleanOption(opts, prop, values, trueValue, falsyValue, fallback) {
  var value = opts[prop];
  if (value === void 0) {
    return fallback;
  }
  if (value === true) {
    return trueValue;
  }
  var valueBoolean = Boolean(value);
  if (valueBoolean === false) {
    return falsyValue;
  }
  value = ToString(value);
  if (value === "true" || value === "false") {
    return fallback;
  }
  if ((values || []).indexOf(value) === -1) {
    throw new RangeError("Invalid value ".concat(value));
  }
  return value;
}
var init_GetStringOrBooleanOption = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/GetStringOrBooleanOption.js"() {
    init__();
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/IsSanctionedSimpleUnitIdentifier.js
function removeUnitNamespace(unit) {
  return unit.slice(unit.indexOf("-") + 1);
}
function IsSanctionedSimpleUnitIdentifier(unitIdentifier) {
  return SIMPLE_UNITS.indexOf(unitIdentifier) > -1;
}
var SANCTIONED_UNITS, SIMPLE_UNITS;
var init_IsSanctionedSimpleUnitIdentifier = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/IsSanctionedSimpleUnitIdentifier.js"() {
    SANCTIONED_UNITS = [
      "angle-degree",
      "area-acre",
      "area-hectare",
      "concentr-percent",
      "digital-bit",
      "digital-byte",
      "digital-gigabit",
      "digital-gigabyte",
      "digital-kilobit",
      "digital-kilobyte",
      "digital-megabit",
      "digital-megabyte",
      "digital-petabyte",
      "digital-terabit",
      "digital-terabyte",
      "duration-day",
      "duration-hour",
      "duration-millisecond",
      "duration-minute",
      "duration-month",
      "duration-second",
      "duration-week",
      "duration-year",
      "length-centimeter",
      "length-foot",
      "length-inch",
      "length-kilometer",
      "length-meter",
      "length-mile-scandinavian",
      "length-mile",
      "length-millimeter",
      "length-yard",
      "mass-gram",
      "mass-kilogram",
      "mass-ounce",
      "mass-pound",
      "mass-stone",
      "temperature-celsius",
      "temperature-fahrenheit",
      "volume-fluid-ounce",
      "volume-gallon",
      "volume-liter",
      "volume-milliliter"
    ];
    SIMPLE_UNITS = SANCTIONED_UNITS.map(removeUnitNamespace);
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/IsValidTimeZoneName.js
function IsValidTimeZoneName(tz, _a) {
  var zoneNamesFromData = _a.zoneNamesFromData, uppercaseLinks = _a.uppercaseLinks;
  var uppercasedTz = tz.toUpperCase();
  var zoneNames = /* @__PURE__ */ new Set();
  var linkNames = /* @__PURE__ */ new Set();
  zoneNamesFromData.map(function(z) {
    return z.toUpperCase();
  }).forEach(function(z) {
    return zoneNames.add(z);
  });
  Object.keys(uppercaseLinks).forEach(function(linkName) {
    linkNames.add(linkName.toUpperCase());
    zoneNames.add(uppercaseLinks[linkName].toUpperCase());
  });
  return zoneNames.has(uppercasedTz) || linkNames.has(uppercasedTz);
}
var init_IsValidTimeZoneName = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/IsValidTimeZoneName.js"() {
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/IsWellFormedCurrencyCode.js
function toUpperCase(str) {
  return str.replace(/([a-z])/g, function(_, c) {
    return c.toUpperCase();
  });
}
function IsWellFormedCurrencyCode(currency) {
  currency = toUpperCase(currency);
  if (currency.length !== 3) {
    return false;
  }
  if (NOT_A_Z_REGEX.test(currency)) {
    return false;
  }
  return true;
}
var NOT_A_Z_REGEX;
var init_IsWellFormedCurrencyCode = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/IsWellFormedCurrencyCode.js"() {
    NOT_A_Z_REGEX = /[^A-Z]/;
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/IsWellFormedUnitIdentifier.js
function toLowerCase(str) {
  return str.replace(/([A-Z])/g, function(_, c) {
    return c.toLowerCase();
  });
}
function IsWellFormedUnitIdentifier(unit) {
  unit = toLowerCase(unit);
  if (IsSanctionedSimpleUnitIdentifier(unit)) {
    return true;
  }
  var units = unit.split("-per-");
  if (units.length !== 2) {
    return false;
  }
  var numerator = units[0], denominator = units[1];
  if (!IsSanctionedSimpleUnitIdentifier(numerator) || !IsSanctionedSimpleUnitIdentifier(denominator)) {
    return false;
  }
  return true;
}
var init_IsWellFormedUnitIdentifier = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/IsWellFormedUnitIdentifier.js"() {
    init_IsSanctionedSimpleUnitIdentifier();
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/ApplyUnsignedRoundingMode.js
function ApplyUnsignedRoundingMode(x, r1, r2, unsignedRoundingMode) {
  if (x === r1)
    return r1;
  if (unsignedRoundingMode === void 0) {
    throw new Error("unsignedRoundingMode is mandatory");
  }
  if (unsignedRoundingMode === "zero") {
    return r1;
  }
  if (unsignedRoundingMode === "infinity") {
    return r2;
  }
  var d1 = x - r1;
  var d2 = r2 - x;
  if (d1 < d2) {
    return r1;
  }
  if (d2 < d1) {
    return r2;
  }
  if (d1 !== d2) {
    throw new Error("Unexpected error");
  }
  if (unsignedRoundingMode === "half-zero") {
    return r1;
  }
  if (unsignedRoundingMode === "half-infinity") {
    return r2;
  }
  if (unsignedRoundingMode !== "half-even") {
    throw new Error("Unexpected value for unsignedRoundingMode: ".concat(unsignedRoundingMode));
  }
  var cardinality = r1 / (r2 - r1) % 2;
  if (cardinality === 0) {
    return r1;
  }
  return r2;
}
var init_ApplyUnsignedRoundingMode = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/ApplyUnsignedRoundingMode.js"() {
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/CollapseNumberRange.js
function CollapseNumberRange(result) {
  return result;
}
var init_CollapseNumberRange = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/CollapseNumberRange.js"() {
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/ComputeExponentForMagnitude.js
function ComputeExponentForMagnitude(numberFormat, magnitude, _a) {
  var getInternalSlots = _a.getInternalSlots;
  var internalSlots = getInternalSlots(numberFormat);
  var notation = internalSlots.notation, dataLocaleData = internalSlots.dataLocaleData, numberingSystem = internalSlots.numberingSystem;
  switch (notation) {
    case "standard":
      return 0;
    case "scientific":
      return magnitude;
    case "engineering":
      return Math.floor(magnitude / 3) * 3;
    default: {
      var compactDisplay = internalSlots.compactDisplay, style = internalSlots.style, currencyDisplay = internalSlots.currencyDisplay;
      var thresholdMap = void 0;
      if (style === "currency" && currencyDisplay !== "name") {
        var currency = dataLocaleData.numbers.currency[numberingSystem] || dataLocaleData.numbers.currency[dataLocaleData.numbers.nu[0]];
        thresholdMap = currency.short;
      } else {
        var decimal = dataLocaleData.numbers.decimal[numberingSystem] || dataLocaleData.numbers.decimal[dataLocaleData.numbers.nu[0]];
        thresholdMap = compactDisplay === "long" ? decimal.long : decimal.short;
      }
      if (!thresholdMap) {
        return 0;
      }
      var num = String(Math.pow(10, magnitude));
      var thresholds = Object.keys(thresholdMap);
      if (num < thresholds[0]) {
        return 0;
      }
      if (num > thresholds[thresholds.length - 1]) {
        return thresholds[thresholds.length - 1].length - 1;
      }
      var i = thresholds.indexOf(num);
      if (i === -1) {
        return 0;
      }
      var magnitudeKey = thresholds[i];
      var compactPattern = thresholdMap[magnitudeKey].other;
      if (compactPattern === "0") {
        return 0;
      }
      return magnitudeKey.length - thresholdMap[magnitudeKey].other.match(/0+/)[0].length;
    }
  }
}
var init_ComputeExponentForMagnitude = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/ComputeExponentForMagnitude.js"() {
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/ToRawPrecision.js
function ToRawPrecision(x, minPrecision, maxPrecision) {
  var p = maxPrecision;
  var m;
  var e;
  var xFinal;
  if (x === 0) {
    m = repeat("0", p);
    e = 0;
    xFinal = 0;
  } else {
    var xToString = x.toString();
    var xToStringExponentIndex = xToString.indexOf("e");
    var _a = xToString.split("e"), xToStringMantissa = _a[0], xToStringExponent = _a[1];
    var xToStringMantissaWithoutDecimalPoint = xToStringMantissa.replace(".", "");
    if (xToStringExponentIndex >= 0 && xToStringMantissaWithoutDecimalPoint.length <= p) {
      e = +xToStringExponent;
      m = xToStringMantissaWithoutDecimalPoint + repeat("0", p - xToStringMantissaWithoutDecimalPoint.length);
      xFinal = x;
    } else {
      e = getMagnitude(x);
      var decimalPlaceOffset = e - p + 1;
      var n = Math.round(adjustDecimalPlace(x, decimalPlaceOffset));
      if (adjustDecimalPlace(n, p - 1) >= 10) {
        e = e + 1;
        n = Math.floor(n / 10);
      }
      m = n.toString();
      xFinal = adjustDecimalPlace(n, p - 1 - e);
    }
  }
  var int;
  if (e >= p - 1) {
    m = m + repeat("0", e - p + 1);
    int = e + 1;
  } else if (e >= 0) {
    m = "".concat(m.slice(0, e + 1), ".").concat(m.slice(e + 1));
    int = e + 1;
  } else {
    m = "0.".concat(repeat("0", -e - 1)).concat(m);
    int = 1;
  }
  if (m.indexOf(".") >= 0 && maxPrecision > minPrecision) {
    var cut = maxPrecision - minPrecision;
    while (cut > 0 && m[m.length - 1] === "0") {
      m = m.slice(0, -1);
      cut--;
    }
    if (m[m.length - 1] === ".") {
      m = m.slice(0, -1);
    }
  }
  return { formattedString: m, roundedNumber: xFinal, integerDigitsCount: int };
  function adjustDecimalPlace(x2, magnitude) {
    return magnitude < 0 ? x2 * Math.pow(10, -magnitude) : x2 / Math.pow(10, magnitude);
  }
}
var init_ToRawPrecision = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/ToRawPrecision.js"() {
    init_utils();
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/ToRawFixed.js
function ToRawFixed(x, minFraction, maxFraction) {
  var f = maxFraction;
  var n = Math.round(x * Math.pow(10, f));
  var xFinal = n / Math.pow(10, f);
  var m;
  if (n < 1e21) {
    m = n.toString();
  } else {
    m = n.toString();
    var _a = m.split("e"), mantissa = _a[0], exponent = _a[1];
    m = mantissa.replace(".", "");
    m = m + repeat("0", Math.max(+exponent - m.length + 1, 0));
  }
  var int;
  if (f !== 0) {
    var k = m.length;
    if (k <= f) {
      var z = repeat("0", f + 1 - k);
      m = z + m;
      k = f + 1;
    }
    var a = m.slice(0, k - f);
    var b = m.slice(k - f);
    m = "".concat(a, ".").concat(b);
    int = a.length;
  } else {
    int = m.length;
  }
  var cut = maxFraction - minFraction;
  while (cut > 0 && m[m.length - 1] === "0") {
    m = m.slice(0, -1);
    cut--;
  }
  if (m[m.length - 1] === ".") {
    m = m.slice(0, -1);
  }
  return { formattedString: m, roundedNumber: xFinal, integerDigitsCount: int };
}
var init_ToRawFixed = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/ToRawFixed.js"() {
    init_utils();
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/FormatNumericToString.js
function FormatNumericToString(intlObject, x) {
  var isNegative = x < 0 || SameValue(x, -0);
  if (isNegative) {
    x = -x;
  }
  var result;
  var rourndingType = intlObject.roundingType;
  switch (rourndingType) {
    case "significantDigits":
      result = ToRawPrecision(x, intlObject.minimumSignificantDigits, intlObject.maximumSignificantDigits);
      break;
    case "fractionDigits":
      result = ToRawFixed(x, intlObject.minimumFractionDigits, intlObject.maximumFractionDigits);
      break;
    default:
      result = ToRawPrecision(x, 1, 2);
      if (result.integerDigitsCount > 1) {
        result = ToRawFixed(x, 0, 0);
      }
      break;
  }
  x = result.roundedNumber;
  var string = result.formattedString;
  var int = result.integerDigitsCount;
  var minInteger = intlObject.minimumIntegerDigits;
  if (int < minInteger) {
    var forwardZeros = repeat("0", minInteger - int);
    string = forwardZeros + string;
  }
  if (isNegative) {
    x = -x;
  }
  return { roundedNumber: x, formattedString: string };
}
var init_FormatNumericToString = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/FormatNumericToString.js"() {
    init__();
    init_ToRawPrecision();
    init_utils();
    init_ToRawFixed();
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/ComputeExponent.js
function ComputeExponent(numberFormat, x, _a) {
  var getInternalSlots = _a.getInternalSlots;
  if (x === 0) {
    return [0, 0];
  }
  if (x < 0) {
    x = -x;
  }
  var magnitude = getMagnitude(x);
  var exponent = ComputeExponentForMagnitude(numberFormat, magnitude, {
    getInternalSlots
  });
  x = exponent < 0 ? x * Math.pow(10, -exponent) : x / Math.pow(10, exponent);
  var formatNumberResult = FormatNumericToString(getInternalSlots(numberFormat), x);
  if (formatNumberResult.roundedNumber === 0) {
    return [exponent, magnitude];
  }
  var newMagnitude = getMagnitude(formatNumberResult.roundedNumber);
  if (newMagnitude === magnitude - exponent) {
    return [exponent, magnitude];
  }
  return [
    ComputeExponentForMagnitude(numberFormat, magnitude + 1, {
      getInternalSlots
    }),
    magnitude + 1
  ];
}
var init_ComputeExponent = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/ComputeExponent.js"() {
    init_utils();
    init_ComputeExponentForMagnitude();
    init_FormatNumericToString();
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/CurrencyDigits.js
function CurrencyDigits(c, _a) {
  var currencyDigitsData = _a.currencyDigitsData;
  return HasOwnProperty(currencyDigitsData, c) ? currencyDigitsData[c] : 2;
}
var init_CurrencyDigits = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/CurrencyDigits.js"() {
    init__();
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/FormatApproximately.js
function FormatApproximately(numberFormat, result, _a) {
  var getInternalSlots = _a.getInternalSlots;
  var internalSlots = getInternalSlots(numberFormat);
  var symbols = internalSlots.dataLocaleData.numbers.symbols[internalSlots.numberingSystem];
  var approximatelySign = symbols.approximatelySign;
  result.push({ type: "approximatelySign", value: approximatelySign });
  return result;
}
var init_FormatApproximately = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/FormatApproximately.js"() {
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/regex.generated.js
var S_UNICODE_REGEX;
var init_regex_generated = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/regex.generated.js"() {
    S_UNICODE_REGEX = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20BF\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC1\uFDFC\uFDFD\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDE8\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEE0-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF73\uDF80-\uDFD8\uDFE0-\uDFEB]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDD78\uDD7A-\uDDCB\uDDCD-\uDE53\uDE60-\uDE6D\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6\uDF00-\uDF92\uDF94-\uDFCA]/;
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/digit-mapping.generated.js
var digitMapping;
var init_digit_mapping_generated = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/digit-mapping.generated.js"() {
    digitMapping = {
      "adlm": [
        "𞥐",
        "𞥑",
        "𞥒",
        "𞥓",
        "𞥔",
        "𞥕",
        "𞥖",
        "𞥗",
        "𞥘",
        "𞥙"
      ],
      "ahom": [
        "𑜰",
        "𑜱",
        "𑜲",
        "𑜳",
        "𑜴",
        "𑜵",
        "𑜶",
        "𑜷",
        "𑜸",
        "𑜹"
      ],
      "arab": [
        "٠",
        "١",
        "٢",
        "٣",
        "٤",
        "٥",
        "٦",
        "٧",
        "٨",
        "٩"
      ],
      "arabext": [
        "۰",
        "۱",
        "۲",
        "۳",
        "۴",
        "۵",
        "۶",
        "۷",
        "۸",
        "۹"
      ],
      "bali": [
        "᭐",
        "᭑",
        "᭒",
        "᭓",
        "᭔",
        "᭕",
        "᭖",
        "᭗",
        "᭘",
        "᭙"
      ],
      "beng": [
        "০",
        "১",
        "২",
        "৩",
        "৪",
        "৫",
        "৬",
        "৭",
        "৮",
        "৯"
      ],
      "bhks": [
        "𑱐",
        "𑱑",
        "𑱒",
        "𑱓",
        "𑱔",
        "𑱕",
        "𑱖",
        "𑱗",
        "𑱘",
        "𑱙"
      ],
      "brah": [
        "𑁦",
        "𑁧",
        "𑁨",
        "𑁩",
        "𑁪",
        "𑁫",
        "𑁬",
        "𑁭",
        "𑁮",
        "𑁯"
      ],
      "cakm": [
        "𑄶",
        "𑄷",
        "𑄸",
        "𑄹",
        "𑄺",
        "𑄻",
        "𑄼",
        "𑄽",
        "𑄾",
        "𑄿"
      ],
      "cham": [
        "꩐",
        "꩑",
        "꩒",
        "꩓",
        "꩔",
        "꩕",
        "꩖",
        "꩗",
        "꩘",
        "꩙"
      ],
      "deva": [
        "०",
        "१",
        "२",
        "३",
        "४",
        "५",
        "६",
        "७",
        "८",
        "९"
      ],
      "diak": [
        "𑥐",
        "𑥑",
        "𑥒",
        "𑥓",
        "𑥔",
        "𑥕",
        "𑥖",
        "𑥗",
        "𑥘",
        "𑥙"
      ],
      "fullwide": [
        "０",
        "１",
        "２",
        "３",
        "４",
        "５",
        "６",
        "７",
        "８",
        "９"
      ],
      "gong": [
        "𑶠",
        "𑶡",
        "𑶢",
        "𑶣",
        "𑶤",
        "𑶥",
        "𑶦",
        "𑶧",
        "𑶨",
        "𑶩"
      ],
      "gonm": [
        "𑵐",
        "𑵑",
        "𑵒",
        "𑵓",
        "𑵔",
        "𑵕",
        "𑵖",
        "𑵗",
        "𑵘",
        "𑵙"
      ],
      "gujr": [
        "૦",
        "૧",
        "૨",
        "૩",
        "૪",
        "૫",
        "૬",
        "૭",
        "૮",
        "૯"
      ],
      "guru": [
        "੦",
        "੧",
        "੨",
        "੩",
        "੪",
        "੫",
        "੬",
        "੭",
        "੮",
        "੯"
      ],
      "hanidec": [
        "〇",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九"
      ],
      "hmng": [
        "𖭐",
        "𖭑",
        "𖭒",
        "𖭓",
        "𖭔",
        "𖭕",
        "𖭖",
        "𖭗",
        "𖭘",
        "𖭙"
      ],
      "hmnp": [
        "𞅀",
        "𞅁",
        "𞅂",
        "𞅃",
        "𞅄",
        "𞅅",
        "𞅆",
        "𞅇",
        "𞅈",
        "𞅉"
      ],
      "java": [
        "꧐",
        "꧑",
        "꧒",
        "꧓",
        "꧔",
        "꧕",
        "꧖",
        "꧗",
        "꧘",
        "꧙"
      ],
      "kali": [
        "꤀",
        "꤁",
        "꤂",
        "꤃",
        "꤄",
        "꤅",
        "꤆",
        "꤇",
        "꤈",
        "꤉"
      ],
      "khmr": [
        "០",
        "១",
        "២",
        "៣",
        "៤",
        "៥",
        "៦",
        "៧",
        "៨",
        "៩"
      ],
      "knda": [
        "೦",
        "೧",
        "೨",
        "೩",
        "೪",
        "೫",
        "೬",
        "೭",
        "೮",
        "೯"
      ],
      "lana": [
        "᪀",
        "᪁",
        "᪂",
        "᪃",
        "᪄",
        "᪅",
        "᪆",
        "᪇",
        "᪈",
        "᪉"
      ],
      "lanatham": [
        "᪐",
        "᪑",
        "᪒",
        "᪓",
        "᪔",
        "᪕",
        "᪖",
        "᪗",
        "᪘",
        "᪙"
      ],
      "laoo": [
        "໐",
        "໑",
        "໒",
        "໓",
        "໔",
        "໕",
        "໖",
        "໗",
        "໘",
        "໙"
      ],
      "lepc": [
        "᪐",
        "᪑",
        "᪒",
        "᪓",
        "᪔",
        "᪕",
        "᪖",
        "᪗",
        "᪘",
        "᪙"
      ],
      "limb": [
        "᥆",
        "᥇",
        "᥈",
        "᥉",
        "᥊",
        "᥋",
        "᥌",
        "᥍",
        "᥎",
        "᥏"
      ],
      "mathbold": [
        "𝟎",
        "𝟏",
        "𝟐",
        "𝟑",
        "𝟒",
        "𝟓",
        "𝟔",
        "𝟕",
        "𝟖",
        "𝟗"
      ],
      "mathdbl": [
        "𝟘",
        "𝟙",
        "𝟚",
        "𝟛",
        "𝟜",
        "𝟝",
        "𝟞",
        "𝟟",
        "𝟠",
        "𝟡"
      ],
      "mathmono": [
        "𝟶",
        "𝟷",
        "𝟸",
        "𝟹",
        "𝟺",
        "𝟻",
        "𝟼",
        "𝟽",
        "𝟾",
        "𝟿"
      ],
      "mathsanb": [
        "𝟬",
        "𝟭",
        "𝟮",
        "𝟯",
        "𝟰",
        "𝟱",
        "𝟲",
        "𝟳",
        "𝟴",
        "𝟵"
      ],
      "mathsans": [
        "𝟢",
        "𝟣",
        "𝟤",
        "𝟥",
        "𝟦",
        "𝟧",
        "𝟨",
        "𝟩",
        "𝟪",
        "𝟫"
      ],
      "mlym": [
        "൦",
        "൧",
        "൨",
        "൩",
        "൪",
        "൫",
        "൬",
        "൭",
        "൮",
        "൯"
      ],
      "modi": [
        "𑙐",
        "𑙑",
        "𑙒",
        "𑙓",
        "𑙔",
        "𑙕",
        "𑙖",
        "𑙗",
        "𑙘",
        "𑙙"
      ],
      "mong": [
        "᠐",
        "᠑",
        "᠒",
        "᠓",
        "᠔",
        "᠕",
        "᠖",
        "᠗",
        "᠘",
        "᠙"
      ],
      "mroo": [
        "𖩠",
        "𖩡",
        "𖩢",
        "𖩣",
        "𖩤",
        "𖩥",
        "𖩦",
        "𖩧",
        "𖩨",
        "𖩩"
      ],
      "mtei": [
        "꯰",
        "꯱",
        "꯲",
        "꯳",
        "꯴",
        "꯵",
        "꯶",
        "꯷",
        "꯸",
        "꯹"
      ],
      "mymr": [
        "၀",
        "၁",
        "၂",
        "၃",
        "၄",
        "၅",
        "၆",
        "၇",
        "၈",
        "၉"
      ],
      "mymrshan": [
        "႐",
        "႑",
        "႒",
        "႓",
        "႔",
        "႕",
        "႖",
        "႗",
        "႘",
        "႙"
      ],
      "mymrtlng": [
        "꧰",
        "꧱",
        "꧲",
        "꧳",
        "꧴",
        "꧵",
        "꧶",
        "꧷",
        "꧸",
        "꧹"
      ],
      "newa": [
        "𑑐",
        "𑑑",
        "𑑒",
        "𑑓",
        "𑑔",
        "𑑕",
        "𑑖",
        "𑑗",
        "𑑘",
        "𑑙"
      ],
      "nkoo": [
        "߀",
        "߁",
        "߂",
        "߃",
        "߄",
        "߅",
        "߆",
        "߇",
        "߈",
        "߉"
      ],
      "olck": [
        "᱐",
        "᱑",
        "᱒",
        "᱓",
        "᱔",
        "᱕",
        "᱖",
        "᱗",
        "᱘",
        "᱙"
      ],
      "orya": [
        "୦",
        "୧",
        "୨",
        "୩",
        "୪",
        "୫",
        "୬",
        "୭",
        "୮",
        "୯"
      ],
      "osma": [
        "𐒠",
        "𐒡",
        "𐒢",
        "𐒣",
        "𐒤",
        "𐒥",
        "𐒦",
        "𐒧",
        "𐒨",
        "𐒩"
      ],
      "rohg": [
        "𐴰",
        "𐴱",
        "𐴲",
        "𐴳",
        "𐴴",
        "𐴵",
        "𐴶",
        "𐴷",
        "𐴸",
        "𐴹"
      ],
      "saur": [
        "꣐",
        "꣑",
        "꣒",
        "꣓",
        "꣔",
        "꣕",
        "꣖",
        "꣗",
        "꣘",
        "꣙"
      ],
      "segment": [
        "🯰",
        "🯱",
        "🯲",
        "🯳",
        "🯴",
        "🯵",
        "🯶",
        "🯷",
        "🯸",
        "🯹"
      ],
      "shrd": [
        "𑇐",
        "𑇑",
        "𑇒",
        "𑇓",
        "𑇔",
        "𑇕",
        "𑇖",
        "𑇗",
        "𑇘",
        "𑇙"
      ],
      "sind": [
        "𑋰",
        "𑋱",
        "𑋲",
        "𑋳",
        "𑋴",
        "𑋵",
        "𑋶",
        "𑋷",
        "𑋸",
        "𑋹"
      ],
      "sinh": [
        "෦",
        "෧",
        "෨",
        "෩",
        "෪",
        "෫",
        "෬",
        "෭",
        "෮",
        "෯"
      ],
      "sora": [
        "𑃰",
        "𑃱",
        "𑃲",
        "𑃳",
        "𑃴",
        "𑃵",
        "𑃶",
        "𑃷",
        "𑃸",
        "𑃹"
      ],
      "sund": [
        "᮰",
        "᮱",
        "᮲",
        "᮳",
        "᮴",
        "᮵",
        "᮶",
        "᮷",
        "᮸",
        "᮹"
      ],
      "takr": [
        "𑛀",
        "𑛁",
        "𑛂",
        "𑛃",
        "𑛄",
        "𑛅",
        "𑛆",
        "𑛇",
        "𑛈",
        "𑛉"
      ],
      "talu": [
        "᧐",
        "᧑",
        "᧒",
        "᧓",
        "᧔",
        "᧕",
        "᧖",
        "᧗",
        "᧘",
        "᧙"
      ],
      "tamldec": [
        "௦",
        "௧",
        "௨",
        "௩",
        "௪",
        "௫",
        "௬",
        "௭",
        "௮",
        "௯"
      ],
      "telu": [
        "౦",
        "౧",
        "౨",
        "౩",
        "౪",
        "౫",
        "౬",
        "౭",
        "౮",
        "౯"
      ],
      "thai": [
        "๐",
        "๑",
        "๒",
        "๓",
        "๔",
        "๕",
        "๖",
        "๗",
        "๘",
        "๙"
      ],
      "tibt": [
        "༠",
        "༡",
        "༢",
        "༣",
        "༤",
        "༥",
        "༦",
        "༧",
        "༨",
        "༩"
      ],
      "tirh": [
        "𑓐",
        "𑓑",
        "𑓒",
        "𑓓",
        "𑓔",
        "𑓕",
        "𑓖",
        "𑓗",
        "𑓘",
        "𑓙"
      ],
      "vaii": [
        "ᘠ",
        "ᘡ",
        "ᘢ",
        "ᘣ",
        "ᘤ",
        "ᘥ",
        "ᘦ",
        "ᘧ",
        "ᘨ",
        "ᘩ"
      ],
      "wara": [
        "𑣠",
        "𑣡",
        "𑣢",
        "𑣣",
        "𑣤",
        "𑣥",
        "𑣦",
        "𑣧",
        "𑣨",
        "𑣩"
      ],
      "wcho": [
        "𞋰",
        "𞋱",
        "𞋲",
        "𞋳",
        "𞋴",
        "𞋵",
        "𞋶",
        "𞋷",
        "𞋸",
        "𞋹"
      ]
    };
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/format_to_parts.js
function formatToParts(numberResult, data2, pl, options) {
  var sign = numberResult.sign, exponent = numberResult.exponent, magnitude = numberResult.magnitude;
  var notation = options.notation, style = options.style, numberingSystem = options.numberingSystem;
  var defaultNumberingSystem = data2.numbers.nu[0];
  var compactNumberPattern = null;
  if (notation === "compact" && magnitude) {
    compactNumberPattern = getCompactDisplayPattern(numberResult, pl, data2, style, options.compactDisplay, options.currencyDisplay, numberingSystem);
  }
  var nonNameCurrencyPart;
  if (style === "currency" && options.currencyDisplay !== "name") {
    var byCurrencyDisplay = data2.currencies[options.currency];
    if (byCurrencyDisplay) {
      switch (options.currencyDisplay) {
        case "code":
          nonNameCurrencyPart = options.currency;
          break;
        case "symbol":
          nonNameCurrencyPart = byCurrencyDisplay.symbol;
          break;
        default:
          nonNameCurrencyPart = byCurrencyDisplay.narrow;
          break;
      }
    } else {
      nonNameCurrencyPart = options.currency;
    }
  }
  var numberPattern;
  if (!compactNumberPattern) {
    if (style === "decimal" || style === "unit" || style === "currency" && options.currencyDisplay === "name") {
      var decimalData = data2.numbers.decimal[numberingSystem] || data2.numbers.decimal[defaultNumberingSystem];
      numberPattern = getPatternForSign(decimalData.standard, sign);
    } else if (style === "currency") {
      var currencyData = data2.numbers.currency[numberingSystem] || data2.numbers.currency[defaultNumberingSystem];
      numberPattern = getPatternForSign(currencyData[options.currencySign], sign);
    } else {
      var percentPattern = data2.numbers.percent[numberingSystem] || data2.numbers.percent[defaultNumberingSystem];
      numberPattern = getPatternForSign(percentPattern, sign);
    }
  } else {
    numberPattern = compactNumberPattern;
  }
  var decimalNumberPattern = CLDR_NUMBER_PATTERN.exec(numberPattern)[0];
  numberPattern = numberPattern.replace(CLDR_NUMBER_PATTERN, "{0}").replace(/'(.)'/g, "$1");
  if (style === "currency" && options.currencyDisplay !== "name") {
    var currencyData = data2.numbers.currency[numberingSystem] || data2.numbers.currency[defaultNumberingSystem];
    var afterCurrency = currencyData.currencySpacing.afterInsertBetween;
    if (afterCurrency && !S_DOLLAR_UNICODE_REGEX.test(nonNameCurrencyPart)) {
      numberPattern = numberPattern.replace("¤{0}", "¤".concat(afterCurrency, "{0}"));
    }
    var beforeCurrency = currencyData.currencySpacing.beforeInsertBetween;
    if (beforeCurrency && !CARET_S_UNICODE_REGEX.test(nonNameCurrencyPart)) {
      numberPattern = numberPattern.replace("{0}¤", "{0}".concat(beforeCurrency, "¤"));
    }
  }
  var numberPatternParts = numberPattern.split(/({c:[^}]+}|\{0\}|[¤%\-\+])/g);
  var numberParts = [];
  var symbols = data2.numbers.symbols[numberingSystem] || data2.numbers.symbols[defaultNumberingSystem];
  for (var _i = 0, numberPatternParts_1 = numberPatternParts; _i < numberPatternParts_1.length; _i++) {
    var part = numberPatternParts_1[_i];
    if (!part) {
      continue;
    }
    switch (part) {
      case "{0}": {
        numberParts.push.apply(numberParts, paritionNumberIntoParts(
          symbols,
          numberResult,
          notation,
          exponent,
          numberingSystem,
          // If compact number pattern exists, do not insert group separators.
          !compactNumberPattern && Boolean(options.useGrouping),
          decimalNumberPattern,
          style
        ));
        break;
      }
      case "-":
        numberParts.push({ type: "minusSign", value: symbols.minusSign });
        break;
      case "+":
        numberParts.push({ type: "plusSign", value: symbols.plusSign });
        break;
      case "%":
        numberParts.push({ type: "percentSign", value: symbols.percentSign });
        break;
      case "¤":
        numberParts.push({ type: "currency", value: nonNameCurrencyPart });
        break;
      default:
        if (/^\{c:/.test(part)) {
          numberParts.push({
            type: "compact",
            value: part.substring(3, part.length - 1)
          });
        } else {
          numberParts.push({ type: "literal", value: part });
        }
        break;
    }
  }
  switch (style) {
    case "currency": {
      if (options.currencyDisplay === "name") {
        var unitPattern = (data2.numbers.currency[numberingSystem] || data2.numbers.currency[defaultNumberingSystem]).unitPattern;
        var unitName = void 0;
        var currencyNameData = data2.currencies[options.currency];
        if (currencyNameData) {
          unitName = selectPlural(pl, numberResult.roundedNumber * Math.pow(10, exponent), currencyNameData.displayName);
        } else {
          unitName = options.currency;
        }
        var unitPatternParts = unitPattern.split(/(\{[01]\})/g);
        var result = [];
        for (var _a = 0, unitPatternParts_1 = unitPatternParts; _a < unitPatternParts_1.length; _a++) {
          var part = unitPatternParts_1[_a];
          switch (part) {
            case "{0}":
              result.push.apply(result, numberParts);
              break;
            case "{1}":
              result.push({ type: "currency", value: unitName });
              break;
            default:
              if (part) {
                result.push({ type: "literal", value: part });
              }
              break;
          }
        }
        return result;
      } else {
        return numberParts;
      }
    }
    case "unit": {
      var unit = options.unit, unitDisplay = options.unitDisplay;
      var unitData = data2.units.simple[unit];
      var unitPattern = void 0;
      if (unitData) {
        unitPattern = selectPlural(pl, numberResult.roundedNumber * Math.pow(10, exponent), data2.units.simple[unit][unitDisplay]);
      } else {
        var _b = unit.split("-per-"), numeratorUnit = _b[0], denominatorUnit = _b[1];
        unitData = data2.units.simple[numeratorUnit];
        var numeratorUnitPattern = selectPlural(pl, numberResult.roundedNumber * Math.pow(10, exponent), data2.units.simple[numeratorUnit][unitDisplay]);
        var perUnitPattern = data2.units.simple[denominatorUnit].perUnit[unitDisplay];
        if (perUnitPattern) {
          unitPattern = perUnitPattern.replace("{0}", numeratorUnitPattern);
        } else {
          var perPattern = data2.units.compound.per[unitDisplay];
          var denominatorPattern = selectPlural(pl, 1, data2.units.simple[denominatorUnit][unitDisplay]);
          unitPattern = unitPattern = perPattern.replace("{0}", numeratorUnitPattern).replace("{1}", denominatorPattern.replace("{0}", ""));
        }
      }
      var result = [];
      for (var _c = 0, _d = unitPattern.split(/(\s*\{0\}\s*)/); _c < _d.length; _c++) {
        var part = _d[_c];
        var interpolateMatch = /^(\s*)\{0\}(\s*)$/.exec(part);
        if (interpolateMatch) {
          if (interpolateMatch[1]) {
            result.push({ type: "literal", value: interpolateMatch[1] });
          }
          result.push.apply(result, numberParts);
          if (interpolateMatch[2]) {
            result.push({ type: "literal", value: interpolateMatch[2] });
          }
        } else if (part) {
          result.push({ type: "unit", value: part });
        }
      }
      return result;
    }
    default:
      return numberParts;
  }
}
function paritionNumberIntoParts(symbols, numberResult, notation, exponent, numberingSystem, useGrouping, decimalNumberPattern, style) {
  var result = [];
  var n = numberResult.formattedString, x = numberResult.roundedNumber;
  if (isNaN(x)) {
    return [{ type: "nan", value: n }];
  } else if (!isFinite(x)) {
    return [{ type: "infinity", value: n }];
  }
  var digitReplacementTable = digitMapping[numberingSystem];
  if (digitReplacementTable) {
    n = n.replace(/\d/g, function(digit) {
      return digitReplacementTable[+digit] || digit;
    });
  }
  var decimalSepIndex = n.indexOf(".");
  var integer;
  var fraction;
  if (decimalSepIndex > 0) {
    integer = n.slice(0, decimalSepIndex);
    fraction = n.slice(decimalSepIndex + 1);
  } else {
    integer = n;
  }
  if (useGrouping && (notation !== "compact" || x >= 1e4)) {
    var groupSepSymbol = style === "currency" && symbols.currencyGroup != null ? symbols.currencyGroup : symbols.group;
    var groups = [];
    var integerNumberPattern = decimalNumberPattern.split(".")[0];
    var patternGroups = integerNumberPattern.split(",");
    var primaryGroupingSize = 3;
    var secondaryGroupingSize = 3;
    if (patternGroups.length > 1) {
      primaryGroupingSize = patternGroups[patternGroups.length - 1].length;
    }
    if (patternGroups.length > 2) {
      secondaryGroupingSize = patternGroups[patternGroups.length - 2].length;
    }
    var i = integer.length - primaryGroupingSize;
    if (i > 0) {
      groups.push(integer.slice(i, i + primaryGroupingSize));
      for (i -= secondaryGroupingSize; i > 0; i -= secondaryGroupingSize) {
        groups.push(integer.slice(i, i + secondaryGroupingSize));
      }
      groups.push(integer.slice(0, i + secondaryGroupingSize));
    } else {
      groups.push(integer);
    }
    while (groups.length > 0) {
      var integerGroup = groups.pop();
      result.push({ type: "integer", value: integerGroup });
      if (groups.length > 0) {
        result.push({ type: "group", value: groupSepSymbol });
      }
    }
  } else {
    result.push({ type: "integer", value: integer });
  }
  if (fraction !== void 0) {
    var decimalSepSymbol = style === "currency" && symbols.currencyDecimal != null ? symbols.currencyDecimal : symbols.decimal;
    result.push({ type: "decimal", value: decimalSepSymbol }, { type: "fraction", value: fraction });
  }
  if ((notation === "scientific" || notation === "engineering") && isFinite(x)) {
    result.push({ type: "exponentSeparator", value: symbols.exponential });
    if (exponent < 0) {
      result.push({ type: "exponentMinusSign", value: symbols.minusSign });
      exponent = -exponent;
    }
    var exponentResult = ToRawFixed(exponent, 0, 0);
    result.push({
      type: "exponentInteger",
      value: exponentResult.formattedString
    });
  }
  return result;
}
function getPatternForSign(pattern, sign) {
  if (pattern.indexOf(";") < 0) {
    pattern = "".concat(pattern, ";-").concat(pattern);
  }
  var _a = pattern.split(";"), zeroPattern = _a[0], negativePattern = _a[1];
  switch (sign) {
    case 0:
      return zeroPattern;
    case -1:
      return negativePattern;
    default:
      return negativePattern.indexOf("-") >= 0 ? negativePattern.replace(/-/g, "+") : "+".concat(zeroPattern);
  }
}
function getCompactDisplayPattern(numberResult, pl, data2, style, compactDisplay, currencyDisplay, numberingSystem) {
  var _a;
  var roundedNumber = numberResult.roundedNumber, sign = numberResult.sign, magnitude = numberResult.magnitude;
  var magnitudeKey = String(Math.pow(10, magnitude));
  var defaultNumberingSystem = data2.numbers.nu[0];
  var pattern;
  if (style === "currency" && currencyDisplay !== "name") {
    var byNumberingSystem = data2.numbers.currency;
    var currencyData = byNumberingSystem[numberingSystem] || byNumberingSystem[defaultNumberingSystem];
    var compactPluralRules = (_a = currencyData.short) === null || _a === void 0 ? void 0 : _a[magnitudeKey];
    if (!compactPluralRules) {
      return null;
    }
    pattern = selectPlural(pl, roundedNumber, compactPluralRules);
  } else {
    var byNumberingSystem = data2.numbers.decimal;
    var byCompactDisplay = byNumberingSystem[numberingSystem] || byNumberingSystem[defaultNumberingSystem];
    var compactPlaralRule = byCompactDisplay[compactDisplay][magnitudeKey];
    if (!compactPlaralRule) {
      return null;
    }
    pattern = selectPlural(pl, roundedNumber, compactPlaralRule);
  }
  if (pattern === "0") {
    return null;
  }
  pattern = getPatternForSign(pattern, sign).replace(/([^\s;\-\+\d¤]+)/g, "{c:$1}").replace(/0+/, "0");
  return pattern;
}
function selectPlural(pl, x, rules) {
  return rules[pl.select(x)] || rules.other;
}
var CARET_S_UNICODE_REGEX, S_DOLLAR_UNICODE_REGEX, CLDR_NUMBER_PATTERN;
var init_format_to_parts = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/format_to_parts.js"() {
    init_regex_generated();
    init_ToRawFixed();
    init_digit_mapping_generated();
    CARET_S_UNICODE_REGEX = new RegExp("^".concat(S_UNICODE_REGEX.source));
    S_DOLLAR_UNICODE_REGEX = new RegExp("".concat(S_UNICODE_REGEX.source, "$"));
    CLDR_NUMBER_PATTERN = /[#0](?:[\.,][#0]+)*/g;
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/PartitionNumberPattern.js
function PartitionNumberPattern(numberFormat, x, _a) {
  var _b;
  var getInternalSlots = _a.getInternalSlots;
  var internalSlots = getInternalSlots(numberFormat);
  var pl = internalSlots.pl, dataLocaleData = internalSlots.dataLocaleData, numberingSystem = internalSlots.numberingSystem;
  var symbols = dataLocaleData.numbers.symbols[numberingSystem] || dataLocaleData.numbers.symbols[dataLocaleData.numbers.nu[0]];
  var magnitude = 0;
  var exponent = 0;
  var n;
  if (isNaN(x)) {
    n = symbols.nan;
  } else if (x == Number.POSITIVE_INFINITY || x == Number.NEGATIVE_INFINITY) {
    n = symbols.infinity;
  } else {
    if (!SameValue(x, -0)) {
      if (!isFinite(x)) {
        throw new Error("Input must be a mathematical value");
      }
      if (internalSlots.style == "percent") {
        x *= 100;
      }
      ;
      _b = ComputeExponent(numberFormat, x, {
        getInternalSlots
      }), exponent = _b[0], magnitude = _b[1];
      x = exponent < 0 ? x * Math.pow(10, -exponent) : x / Math.pow(10, exponent);
    }
    var formatNumberResult = FormatNumericToString(internalSlots, x);
    n = formatNumberResult.formattedString;
    x = formatNumberResult.roundedNumber;
  }
  var sign;
  var signDisplay = internalSlots.signDisplay;
  switch (signDisplay) {
    case "never":
      sign = 0;
      break;
    case "auto":
      if (SameValue(x, 0) || x > 0 || isNaN(x)) {
        sign = 0;
      } else {
        sign = -1;
      }
      break;
    case "always":
      if (SameValue(x, 0) || x > 0 || isNaN(x)) {
        sign = 1;
      } else {
        sign = -1;
      }
      break;
    default:
      if (x === 0 || isNaN(x)) {
        sign = 0;
      } else if (x > 0) {
        sign = 1;
      } else {
        sign = -1;
      }
  }
  return formatToParts({ roundedNumber: x, formattedString: n, exponent, magnitude, sign }, internalSlots.dataLocaleData, pl, internalSlots);
}
var init_PartitionNumberPattern = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/PartitionNumberPattern.js"() {
    init_FormatNumericToString();
    init__();
    init_ComputeExponent();
    init_format_to_parts();
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/PartitionNumberRangePattern.js
function PartitionNumberRangePattern(numberFormat, x, y, _a) {
  var getInternalSlots = _a.getInternalSlots;
  if (isNaN(x) || isNaN(y)) {
    throw new RangeError("Input must be a number");
  }
  var result = [];
  var xResult = PartitionNumberPattern(numberFormat, x, { getInternalSlots });
  var yResult = PartitionNumberPattern(numberFormat, y, { getInternalSlots });
  if (xResult === yResult) {
    return FormatApproximately(numberFormat, xResult, { getInternalSlots });
  }
  for (var _i = 0, xResult_1 = xResult; _i < xResult_1.length; _i++) {
    var r = xResult_1[_i];
    r.source = "startRange";
  }
  result = result.concat(xResult);
  var internalSlots = getInternalSlots(numberFormat);
  var symbols = internalSlots.dataLocaleData.numbers.symbols[internalSlots.numberingSystem];
  result.push({ type: "literal", value: symbols.rangeSign, source: "shared" });
  for (var _b = 0, yResult_1 = yResult; _b < yResult_1.length; _b++) {
    var r = yResult_1[_b];
    r.source = "endRange";
  }
  result = result.concat(yResult);
  return CollapseNumberRange(result);
}
var init_PartitionNumberRangePattern = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/PartitionNumberRangePattern.js"() {
    init_PartitionNumberPattern();
    init_CollapseNumberRange();
    init_FormatApproximately();
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/FormatNumericRange.js
function FormatNumericRange(numberFormat, x, y, _a) {
  var getInternalSlots = _a.getInternalSlots;
  var parts = PartitionNumberRangePattern(numberFormat, x, y, {
    getInternalSlots
  });
  return parts.map(function(part) {
    return part.value;
  }).join("");
}
var init_FormatNumericRange = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/FormatNumericRange.js"() {
    init_PartitionNumberRangePattern();
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/FormatNumericRangeToParts.js
function FormatNumericRangeToParts(numberFormat, x, y, _a) {
  var getInternalSlots = _a.getInternalSlots;
  var parts = PartitionNumberRangePattern(numberFormat, x, y, {
    getInternalSlots
  });
  return parts.map(function(part, index) {
    return {
      type: part.type,
      value: part.value,
      source: part.source,
      result: index.toString()
    };
  });
}
var init_FormatNumericRangeToParts = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/FormatNumericRangeToParts.js"() {
    init_PartitionNumberRangePattern();
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/FormatNumericToParts.js
function FormatNumericToParts(nf, x, implDetails) {
  var parts = PartitionNumberPattern(nf, x, implDetails);
  var result = ArrayCreate(0);
  for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
    var part = parts_1[_i];
    result.push({
      type: part.type,
      value: part.value
    });
  }
  return result;
}
var init_FormatNumericToParts = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/FormatNumericToParts.js"() {
    init_PartitionNumberPattern();
    init__();
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/GetUnsignedRoundingMode.js
function GetUnsignedRoundingMode(roundingMode, isNegative) {
  if (isNegative) {
    return negativeMapping[roundingMode];
  }
  return positiveMapping[roundingMode];
}
var negativeMapping, positiveMapping;
var init_GetUnsignedRoundingMode = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/GetUnsignedRoundingMode.js"() {
    negativeMapping = {
      ceil: "zero",
      floor: "infinity",
      expand: "infinity",
      trunc: "zero",
      halfCeil: "half-zero",
      halfFloor: "half-infinity",
      halfExpand: "half-infinity",
      halfTrunc: "half-zero",
      halfEven: "half-even"
    };
    positiveMapping = {
      ceil: "infinity",
      floor: "zero",
      expand: "infinity",
      trunc: "zero",
      halfCeil: "half-infinity",
      halfFloor: "half-zero",
      halfExpand: "half-infinity",
      halfTrunc: "half-zero",
      halfEven: "half-even"
    };
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/SetNumberFormatDigitOptions.js
function SetNumberFormatDigitOptions(internalSlots, opts, mnfdDefault, mxfdDefault, notation) {
  var mnid = GetNumberOption(opts, "minimumIntegerDigits", 1, 21, 1);
  var mnfd = opts.minimumFractionDigits;
  var mxfd = opts.maximumFractionDigits;
  var mnsd = opts.minimumSignificantDigits;
  var mxsd = opts.maximumSignificantDigits;
  internalSlots.minimumIntegerDigits = mnid;
  var roundingPriority = GetOption(opts, "roundingPriority", "string", ["auto", "morePrecision", "lessPrecision"], "auto");
  var hasSd = mnsd !== void 0 || mxsd !== void 0;
  var hasFd = mnfd !== void 0 || mxfd !== void 0;
  var needSd = true;
  var needFd = true;
  if (roundingPriority === "auto") {
    needSd = hasSd;
    if (hasSd || !hasFd && notation === "compact") {
      needFd = false;
    }
  }
  if (needSd) {
    if (hasSd) {
      mnsd = DefaultNumberOption(mnsd, 1, 21, 1);
      mxsd = DefaultNumberOption(mxsd, mnsd, 21, 21);
      internalSlots.minimumSignificantDigits = mnsd;
      internalSlots.maximumSignificantDigits = mxsd;
    } else {
      internalSlots.minimumSignificantDigits = 1;
      internalSlots.maximumSignificantDigits = 21;
    }
  }
  if (needFd) {
    if (hasFd) {
      mnfd = DefaultNumberOption(mnfd, 0, 20, void 0);
      mxfd = DefaultNumberOption(mxfd, 0, 20, void 0);
      if (mnfd === void 0) {
        mnfd = Math.min(mnfdDefault, mxfd);
      } else if (mxfd === void 0) {
        mxfd = Math.max(mxfdDefault, mnfd);
      } else if (mnfd > mxfd) {
        throw new RangeError("Invalid range, ".concat(mnfd, " > ").concat(mxfd));
      }
      internalSlots.minimumFractionDigits = mnfd;
      internalSlots.maximumFractionDigits = mxfd;
    } else {
      internalSlots.minimumFractionDigits = mnfdDefault;
      internalSlots.maximumFractionDigits = mxfdDefault;
    }
  }
  if (needSd || needFd) {
    if (roundingPriority === "morePrecision") {
      internalSlots.roundingType = "morePrecision";
    } else if (roundingPriority === "lessPrecision") {
      internalSlots.roundingType = "lessPrecision";
    } else if (hasSd) {
      internalSlots.roundingType = "significantDigits";
    } else {
      internalSlots.roundingType = "fractionDigits";
    }
  } else {
    internalSlots.roundingType = "morePrecision";
    internalSlots.minimumFractionDigits = 0;
    internalSlots.maximumFractionDigits = 0;
    internalSlots.minimumSignificantDigits = 1;
    internalSlots.maximumSignificantDigits = 2;
  }
}
var init_SetNumberFormatDigitOptions = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/SetNumberFormatDigitOptions.js"() {
    init_DefaultNumberOption();
    init_GetNumberOption();
    init_GetOption();
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/SetNumberFormatUnitOptions.js
function SetNumberFormatUnitOptions(nf, options, _a) {
  if (options === void 0) {
    options = /* @__PURE__ */ Object.create(null);
  }
  var getInternalSlots = _a.getInternalSlots;
  var internalSlots = getInternalSlots(nf);
  var style = GetOption(options, "style", "string", ["decimal", "percent", "currency", "unit"], "decimal");
  internalSlots.style = style;
  var currency = GetOption(options, "currency", "string", void 0, void 0);
  if (currency !== void 0 && !IsWellFormedCurrencyCode(currency)) {
    throw RangeError("Malformed currency code");
  }
  if (style === "currency" && currency === void 0) {
    throw TypeError("currency cannot be undefined");
  }
  var currencyDisplay = GetOption(options, "currencyDisplay", "string", ["code", "symbol", "narrowSymbol", "name"], "symbol");
  var currencySign = GetOption(options, "currencySign", "string", ["standard", "accounting"], "standard");
  var unit = GetOption(options, "unit", "string", void 0, void 0);
  if (unit !== void 0 && !IsWellFormedUnitIdentifier(unit)) {
    throw RangeError("Invalid unit argument for Intl.NumberFormat()");
  }
  if (style === "unit" && unit === void 0) {
    throw TypeError("unit cannot be undefined");
  }
  var unitDisplay = GetOption(options, "unitDisplay", "string", ["short", "narrow", "long"], "short");
  if (style === "currency") {
    internalSlots.currency = currency.toUpperCase();
    internalSlots.currencyDisplay = currencyDisplay;
    internalSlots.currencySign = currencySign;
  }
  if (style === "unit") {
    internalSlots.unit = unit;
    internalSlots.unitDisplay = unitDisplay;
  }
}
var init_SetNumberFormatUnitOptions = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/SetNumberFormatUnitOptions.js"() {
    init_GetOption();
    init_IsWellFormedCurrencyCode();
    init_IsWellFormedUnitIdentifier();
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/InitializeNumberFormat.js
function InitializeNumberFormat(nf, locales, opts, _a) {
  var getInternalSlots = _a.getInternalSlots, localeData = _a.localeData, availableLocales = _a.availableLocales, numberingSystemNames = _a.numberingSystemNames, getDefaultLocale = _a.getDefaultLocale, currencyDigitsData = _a.currencyDigitsData;
  var requestedLocales = CanonicalizeLocaleList2(locales);
  var options = CoerceOptionsToObject(opts);
  var opt = /* @__PURE__ */ Object.create(null);
  var matcher = GetOption(options, "localeMatcher", "string", ["lookup", "best fit"], "best fit");
  opt.localeMatcher = matcher;
  var numberingSystem = GetOption(options, "numberingSystem", "string", void 0, void 0);
  if (numberingSystem !== void 0 && numberingSystemNames.indexOf(numberingSystem) < 0) {
    throw RangeError("Invalid numberingSystems: ".concat(numberingSystem));
  }
  opt.nu = numberingSystem;
  var r = ResolveLocale(
    Array.from(availableLocales),
    requestedLocales,
    opt,
    // [[RelevantExtensionKeys]] slot, which is a constant
    ["nu"],
    localeData,
    getDefaultLocale
  );
  var dataLocaleData = localeData[r.dataLocale];
  invariant(!!dataLocaleData, "Missing locale data for ".concat(r.dataLocale));
  var internalSlots = getInternalSlots(nf);
  internalSlots.locale = r.locale;
  internalSlots.dataLocale = r.dataLocale;
  internalSlots.numberingSystem = r.nu;
  internalSlots.dataLocaleData = dataLocaleData;
  SetNumberFormatUnitOptions(nf, options, { getInternalSlots });
  var style = internalSlots.style;
  var mnfdDefault;
  var mxfdDefault;
  if (style === "currency") {
    var currency = internalSlots.currency;
    var cDigits = CurrencyDigits(currency, { currencyDigitsData });
    mnfdDefault = cDigits;
    mxfdDefault = cDigits;
  } else {
    mnfdDefault = 0;
    mxfdDefault = style === "percent" ? 0 : 3;
  }
  var notation = GetOption(options, "notation", "string", ["standard", "scientific", "engineering", "compact"], "standard");
  internalSlots.notation = notation;
  SetNumberFormatDigitOptions(internalSlots, options, mnfdDefault, mxfdDefault, notation);
  var roundingIncrement = GetNumberOption(options, "roundingIncrement", 1, 5e3, 1);
  if (VALID_ROUND_INCREMENT_VALUES.indexOf(roundingIncrement) === -1) {
    throw new RangeError("Invalid rounding increment value: ".concat(roundingIncrement, ".\nValid values are ").concat(VALID_ROUND_INCREMENT_VALUES, "."));
  }
  if (roundingIncrement !== 1 && internalSlots.roundingType !== "fractionDigits") {
    throw new TypeError("For roundingIncrement > 1 only fractionDigits is a valid roundingType");
  }
  if (roundingIncrement !== 1 && internalSlots.maximumFractionDigits !== internalSlots.minimumFractionDigits) {
    throw new RangeError("With roundingIncrement > 1, maximumFractionDigits and minimumFractionDigits must be equal.");
  }
  internalSlots.roundingIncrement = roundingIncrement;
  var trailingZeroDisplay = GetOption(options, "trailingZeroDisplay", "string", ["auto", "stripIfInteger"], "auto");
  internalSlots.trailingZeroDisplay = trailingZeroDisplay;
  var compactDisplay = GetOption(options, "compactDisplay", "string", ["short", "long"], "short");
  var defaultUseGrouping = "auto";
  if (notation === "compact") {
    internalSlots.compactDisplay = compactDisplay;
    defaultUseGrouping = "min2";
  }
  internalSlots.useGrouping = GetStringOrBooleanOption(options, "useGrouping", ["min2", "auto", "always"], "always", false, defaultUseGrouping);
  internalSlots.signDisplay = GetOption(options, "signDisplay", "string", ["auto", "never", "always", "exceptZero", "negative"], "auto");
  internalSlots.roundingMode = GetOption(options, "roundingMode", "string", [
    "ceil",
    "floor",
    "expand",
    "trunc",
    "halfCeil",
    "halfFloor",
    "halfExpand",
    "halfTrunc",
    "halfEven"
  ], "halfExpand");
  return nf;
}
var VALID_ROUND_INCREMENT_VALUES;
var init_InitializeNumberFormat = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/NumberFormat/InitializeNumberFormat.js"() {
    init_lib();
    init_CanonicalizeLocaleList2();
    init_CoerceOptionsToObject();
    init_GetNumberOption();
    init_GetOption();
    init_GetStringOrBooleanOption();
    init_utils();
    init_CurrencyDigits();
    init_SetNumberFormatDigitOptions();
    init_SetNumberFormatUnitOptions();
    VALID_ROUND_INCREMENT_VALUES = [
      1,
      2,
      5,
      10,
      20,
      25,
      50,
      100,
      200,
      250,
      500,
      1e3,
      2e3
    ];
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/PartitionPattern.js
function PartitionPattern(pattern) {
  var result = [];
  var beginIndex = pattern.indexOf("{");
  var endIndex = 0;
  var nextIndex = 0;
  var length = pattern.length;
  while (beginIndex < pattern.length && beginIndex > -1) {
    endIndex = pattern.indexOf("}", beginIndex);
    invariant(endIndex > beginIndex, "Invalid pattern ".concat(pattern));
    if (beginIndex > nextIndex) {
      result.push({
        type: "literal",
        value: pattern.substring(nextIndex, beginIndex)
      });
    }
    result.push({
      type: pattern.substring(beginIndex + 1, endIndex),
      value: void 0
    });
    nextIndex = endIndex + 1;
    beginIndex = pattern.indexOf("{", nextIndex);
  }
  if (nextIndex < length) {
    result.push({
      type: "literal",
      value: pattern.substring(nextIndex, length)
    });
  }
  return result;
}
var init_PartitionPattern = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/PartitionPattern.js"() {
    init_utils();
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/SupportedLocales.js
function SupportedLocales(availableLocales, requestedLocales, options) {
  var matcher = "best fit";
  if (options !== void 0) {
    options = ToObject(options);
    matcher = GetOption(options, "localeMatcher", "string", ["lookup", "best fit"], "best fit");
  }
  if (matcher === "best fit") {
    return LookupSupportedLocales(Array.from(availableLocales), requestedLocales);
  }
  return LookupSupportedLocales(Array.from(availableLocales), requestedLocales);
}
var init_SupportedLocales = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/SupportedLocales.js"() {
    init_lib();
    init__();
    init_GetOption();
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/data.js
function isMissingLocaleDataError(e) {
  return e.type === "MISSING_LOCALE_DATA";
}
var MissingLocaleDataError;
var init_data = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/data.js"() {
    init_tslib_es6();
    MissingLocaleDataError = /** @class */
    function(_super) {
      __extends(MissingLocaleDataError2, _super);
      function MissingLocaleDataError2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "MISSING_LOCALE_DATA";
        return _this;
      }
      return MissingLocaleDataError2;
    }(Error);
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/types/date-time.js
var RangePatternType;
var init_date_time = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/types/date-time.js"() {
    (function(RangePatternType2) {
      RangePatternType2["startRange"] = "startRange";
      RangePatternType2["shared"] = "shared";
      RangePatternType2["endRange"] = "endRange";
    })(RangePatternType || (RangePatternType = {}));
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/types/displaynames.js
var init_displaynames = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/types/displaynames.js"() {
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/types/list.js
var init_list = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/types/list.js"() {
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/types/number.js
var init_number = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/types/number.js"() {
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/types/plural-rules.js
var init_plural_rules = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/types/plural-rules.js"() {
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/types/relative-time.js
var init_relative_time = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/types/relative-time.js"() {
  }
});

// node_modules/@formatjs/ecma402-abstract/lib/index.js
var lib_exports2 = {};
__export(lib_exports2, {
  ApplyUnsignedRoundingMode: () => ApplyUnsignedRoundingMode,
  ArrayCreate: () => ArrayCreate,
  CanonicalizeLocaleList: () => CanonicalizeLocaleList2,
  CanonicalizeTimeZoneName: () => CanonicalizeTimeZoneName,
  CoerceOptionsToObject: () => CoerceOptionsToObject,
  CollapseNumberRange: () => CollapseNumberRange,
  ComputeExponent: () => ComputeExponent,
  ComputeExponentForMagnitude: () => ComputeExponentForMagnitude,
  CurrencyDigits: () => CurrencyDigits,
  DateFromTime: () => DateFromTime,
  Day: () => Day,
  DayFromYear: () => DayFromYear,
  DayWithinYear: () => DayWithinYear,
  DaysInYear: () => DaysInYear,
  FormatApproximately: () => FormatApproximately,
  FormatNumericRange: () => FormatNumericRange,
  FormatNumericRangeToParts: () => FormatNumericRangeToParts,
  FormatNumericToParts: () => FormatNumericToParts,
  FormatNumericToString: () => FormatNumericToString,
  GetNumberOption: () => GetNumberOption,
  GetOption: () => GetOption,
  GetOptionsObject: () => GetOptionsObject,
  GetStringOrBooleanOption: () => GetStringOrBooleanOption,
  GetUnsignedRoundingMode: () => GetUnsignedRoundingMode,
  HasOwnProperty: () => HasOwnProperty,
  HourFromTime: () => HourFromTime,
  InLeapYear: () => InLeapYear,
  InitializeNumberFormat: () => InitializeNumberFormat,
  IsSanctionedSimpleUnitIdentifier: () => IsSanctionedSimpleUnitIdentifier,
  IsValidTimeZoneName: () => IsValidTimeZoneName,
  IsWellFormedCurrencyCode: () => IsWellFormedCurrencyCode,
  IsWellFormedUnitIdentifier: () => IsWellFormedUnitIdentifier,
  MinFromTime: () => MinFromTime,
  MonthFromTime: () => MonthFromTime,
  OrdinaryHasInstance: () => OrdinaryHasInstance,
  PartitionNumberPattern: () => PartitionNumberPattern,
  PartitionNumberRangePattern: () => PartitionNumberRangePattern,
  PartitionPattern: () => PartitionPattern,
  RangePatternType: () => RangePatternType,
  SANCTIONED_UNITS: () => SANCTIONED_UNITS,
  SIMPLE_UNITS: () => SIMPLE_UNITS,
  SameValue: () => SameValue,
  SecFromTime: () => SecFromTime,
  SetNumberFormatDigitOptions: () => SetNumberFormatDigitOptions,
  SetNumberFormatUnitOptions: () => SetNumberFormatUnitOptions,
  SupportedLocales: () => SupportedLocales,
  TimeClip: () => TimeClip,
  TimeFromYear: () => TimeFromYear,
  ToNumber: () => ToNumber,
  ToObject: () => ToObject,
  ToRawFixed: () => ToRawFixed,
  ToRawPrecision: () => ToRawPrecision,
  ToString: () => ToString,
  Type: () => Type,
  WeekDay: () => WeekDay,
  YearFromTime: () => YearFromTime,
  _formatToParts: () => formatToParts,
  createDataProperty: () => createDataProperty,
  defineProperty: () => defineProperty,
  getInternalSlot: () => getInternalSlot,
  getMagnitude: () => getMagnitude,
  getMultiInternalSlots: () => getMultiInternalSlots,
  invariant: () => invariant,
  isLiteralPart: () => isLiteralPart,
  isMissingLocaleDataError: () => isMissingLocaleDataError,
  msFromTime: () => msFromTime,
  removeUnitNamespace: () => removeUnitNamespace,
  setInternalSlot: () => setInternalSlot,
  setMultiInternalSlots: () => setMultiInternalSlots
});
var init_lib2 = __esm({
  "node_modules/@formatjs/ecma402-abstract/lib/index.js"() {
    init_CanonicalizeLocaleList2();
    init_CanonicalizeTimeZoneName();
    init_CoerceOptionsToObject();
    init_GetNumberOption();
    init_GetOption();
    init_GetOptionsObject();
    init_GetStringOrBooleanOption();
    init_IsSanctionedSimpleUnitIdentifier();
    init_IsValidTimeZoneName();
    init_IsWellFormedCurrencyCode();
    init_IsWellFormedUnitIdentifier();
    init_ApplyUnsignedRoundingMode();
    init_CollapseNumberRange();
    init_ComputeExponent();
    init_ComputeExponentForMagnitude();
    init_CurrencyDigits();
    init_FormatApproximately();
    init_FormatNumericRange();
    init_FormatNumericRangeToParts();
    init_FormatNumericToParts();
    init_FormatNumericToString();
    init_GetUnsignedRoundingMode();
    init_InitializeNumberFormat();
    init_PartitionNumberPattern();
    init_PartitionNumberRangePattern();
    init_SetNumberFormatDigitOptions();
    init_SetNumberFormatUnitOptions();
    init_ToRawFixed();
    init_ToRawPrecision();
    init_format_to_parts();
    init_PartitionPattern();
    init_SupportedLocales();
    init_utils();
    init__();
    init_data();
    init_date_time();
    init_displaynames();
    init_list();
    init_number();
    init_plural_rules();
    init_relative_time();
    init_utils();
  }
});

export {
  __extends,
  __assign,
  __rest,
  __spreadArray,
  tslib_es6_exports,
  init_tslib_es6,
  invariant,
  lib_exports,
  init_lib,
  lib_exports2,
  init_lib2
};
//# sourceMappingURL=chunk-OJG5XMTG.js.map
