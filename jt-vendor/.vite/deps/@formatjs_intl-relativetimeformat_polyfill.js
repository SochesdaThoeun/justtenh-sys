import {
  init_lib,
  init_lib2,
  init_tslib_es6,
  lib_exports,
  lib_exports2,
  tslib_es6_exports
} from "./chunk-OJG5XMTG.js";
import {
  __commonJS,
  __toCommonJS
} from "./chunk-4B2QHNJT.js";

// node_modules/@formatjs/intl-relativetimeformat/abstract/InitializeRelativeTimeFormat.js
var require_InitializeRelativeTimeFormat = __commonJS({
  "node_modules/@formatjs/intl-relativetimeformat/abstract/InitializeRelativeTimeFormat.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InitializeRelativeTimeFormat = void 0;
    var ecma402_abstract_1 = (init_lib2(), __toCommonJS(lib_exports2));
    var intl_localematcher_1 = (init_lib(), __toCommonJS(lib_exports));
    var NUMBERING_SYSTEM_REGEX = /^[a-z0-9]{3,8}(-[a-z0-9]{3,8})*$/i;
    function InitializeRelativeTimeFormat(rtf, locales, options, _a) {
      var getInternalSlots = _a.getInternalSlots, availableLocales = _a.availableLocales, relevantExtensionKeys = _a.relevantExtensionKeys, localeData = _a.localeData, getDefaultLocale = _a.getDefaultLocale;
      var internalSlots = getInternalSlots(rtf);
      internalSlots.initializedRelativeTimeFormat = true;
      var requestedLocales = (0, ecma402_abstract_1.CanonicalizeLocaleList)(locales);
      var opt = /* @__PURE__ */ Object.create(null);
      var opts = (0, ecma402_abstract_1.CoerceOptionsToObject)(options);
      var matcher = (0, ecma402_abstract_1.GetOption)(opts, "localeMatcher", "string", ["best fit", "lookup"], "best fit");
      opt.localeMatcher = matcher;
      var numberingSystem = (0, ecma402_abstract_1.GetOption)(
        opts,
        // @ts-expect-error TS option is wack
        "numberingSystem",
        "string",
        void 0,
        void 0
      );
      if (numberingSystem !== void 0) {
        if (!NUMBERING_SYSTEM_REGEX.test(numberingSystem)) {
          throw new RangeError("Invalid numbering system ".concat(numberingSystem));
        }
      }
      opt.nu = numberingSystem;
      var r = (0, intl_localematcher_1.ResolveLocale)(availableLocales, requestedLocales, opt, relevantExtensionKeys, localeData, getDefaultLocale);
      var locale = r.locale, nu = r.nu;
      internalSlots.locale = locale;
      internalSlots.style = (0, ecma402_abstract_1.GetOption)(opts, "style", "string", ["long", "narrow", "short"], "long");
      internalSlots.numeric = (0, ecma402_abstract_1.GetOption)(opts, "numeric", "string", ["always", "auto"], "always");
      var fields = localeData[r.dataLocale];
      (0, ecma402_abstract_1.invariant)(!!fields, "Missing locale data for ".concat(r.dataLocale));
      internalSlots.fields = fields;
      internalSlots.numberFormat = new Intl.NumberFormat(locales);
      internalSlots.pluralRules = new Intl.PluralRules(locales);
      internalSlots.numberingSystem = nu;
      return rtf;
    }
    exports.InitializeRelativeTimeFormat = InitializeRelativeTimeFormat;
  }
});

// node_modules/@formatjs/intl-relativetimeformat/abstract/SingularRelativeTimeUnit.js
var require_SingularRelativeTimeUnit = __commonJS({
  "node_modules/@formatjs/intl-relativetimeformat/abstract/SingularRelativeTimeUnit.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SingularRelativeTimeUnit = void 0;
    var ecma402_abstract_1 = (init_lib2(), __toCommonJS(lib_exports2));
    function SingularRelativeTimeUnit(unit) {
      (0, ecma402_abstract_1.invariant)((0, ecma402_abstract_1.Type)(unit) === "String", "unit must be a string");
      if (unit === "seconds")
        return "second";
      if (unit === "minutes")
        return "minute";
      if (unit === "hours")
        return "hour";
      if (unit === "days")
        return "day";
      if (unit === "weeks")
        return "week";
      if (unit === "months")
        return "month";
      if (unit === "quarters")
        return "quarter";
      if (unit === "years")
        return "year";
      if (unit !== "second" && unit !== "minute" && unit !== "hour" && unit !== "day" && unit !== "week" && unit !== "month" && unit !== "quarter" && unit !== "year") {
        throw new RangeError("invalid unit");
      }
      return unit;
    }
    exports.SingularRelativeTimeUnit = SingularRelativeTimeUnit;
  }
});

// node_modules/@formatjs/intl-relativetimeformat/abstract/MakePartsList.js
var require_MakePartsList = __commonJS({
  "node_modules/@formatjs/intl-relativetimeformat/abstract/MakePartsList.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MakePartsList = void 0;
    var ecma402_abstract_1 = (init_lib2(), __toCommonJS(lib_exports2));
    function MakePartsList(pattern, unit, parts) {
      var patternParts = (0, ecma402_abstract_1.PartitionPattern)(pattern);
      var result = [];
      for (var _i = 0, patternParts_1 = patternParts; _i < patternParts_1.length; _i++) {
        var patternPart = patternParts_1[_i];
        if (patternPart.type === "literal") {
          result.push({
            type: "literal",
            value: patternPart.value
          });
        } else {
          (0, ecma402_abstract_1.invariant)(patternPart.type === "0", "Malformed pattern ".concat(pattern));
          for (var _a = 0, parts_1 = parts; _a < parts_1.length; _a++) {
            var part = parts_1[_a];
            result.push({
              type: part.type,
              value: part.value,
              unit
            });
          }
        }
      }
      return result;
    }
    exports.MakePartsList = MakePartsList;
  }
});

// node_modules/@formatjs/intl-relativetimeformat/abstract/PartitionRelativeTimePattern.js
var require_PartitionRelativeTimePattern = __commonJS({
  "node_modules/@formatjs/intl-relativetimeformat/abstract/PartitionRelativeTimePattern.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PartitionRelativeTimePattern = void 0;
    var ecma402_abstract_1 = (init_lib2(), __toCommonJS(lib_exports2));
    var SingularRelativeTimeUnit_1 = require_SingularRelativeTimeUnit();
    var MakePartsList_1 = require_MakePartsList();
    function PartitionRelativeTimePattern(rtf, value, unit, _a) {
      var getInternalSlots = _a.getInternalSlots;
      (0, ecma402_abstract_1.invariant)((0, ecma402_abstract_1.Type)(value) === "Number", "value must be number, instead got ".concat(typeof value), TypeError);
      (0, ecma402_abstract_1.invariant)((0, ecma402_abstract_1.Type)(unit) === "String", "unit must be number, instead got ".concat(typeof value), TypeError);
      if (isNaN(value) || !isFinite(value)) {
        throw new RangeError("Invalid value ".concat(value));
      }
      var resolvedUnit = (0, SingularRelativeTimeUnit_1.SingularRelativeTimeUnit)(unit);
      var _b = getInternalSlots(rtf), fields = _b.fields, style = _b.style, numeric = _b.numeric, pluralRules = _b.pluralRules, numberFormat = _b.numberFormat;
      var entry = resolvedUnit;
      if (style === "short") {
        entry = "".concat(resolvedUnit, "-short");
      } else if (style === "narrow") {
        entry = "".concat(resolvedUnit, "-narrow");
      }
      if (!(entry in fields)) {
        entry = resolvedUnit;
      }
      var patterns = fields[entry];
      if (numeric === "auto") {
        if ((0, ecma402_abstract_1.ToString)(value) in patterns) {
          return [
            {
              type: "literal",
              value: patterns[(0, ecma402_abstract_1.ToString)(value)]
            }
          ];
        }
      }
      var tl = "future";
      if ((0, ecma402_abstract_1.SameValue)(value, -0) || value < 0) {
        tl = "past";
      }
      var po = patterns[tl];
      var fv = typeof numberFormat.formatToParts === "function" ? numberFormat.formatToParts(Math.abs(value)) : (
        // TODO: If formatToParts is not supported, we assume the whole formatted
        // number is a part
        [
          {
            type: "literal",
            value: numberFormat.format(Math.abs(value)),
            unit
          }
        ]
      );
      var pr = pluralRules.select(value);
      var pattern = po[pr];
      return (0, MakePartsList_1.MakePartsList)(pattern, resolvedUnit, fv);
    }
    exports.PartitionRelativeTimePattern = PartitionRelativeTimePattern;
  }
});

// node_modules/@formatjs/intl-relativetimeformat/get_internal_slots.js
var require_get_internal_slots = __commonJS({
  "node_modules/@formatjs/intl-relativetimeformat/get_internal_slots.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var internalSlotMap = /* @__PURE__ */ new WeakMap();
    function getInternalSlots(x) {
      var internalSlots = internalSlotMap.get(x);
      if (!internalSlots) {
        internalSlots = /* @__PURE__ */ Object.create(null);
        internalSlotMap.set(x, internalSlots);
      }
      return internalSlots;
    }
    exports.default = getInternalSlots;
  }
});

// node_modules/@formatjs/intl-relativetimeformat/index.js
var require_intl_relativetimeformat = __commonJS({
  "node_modules/@formatjs/intl-relativetimeformat/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var ecma402_abstract_1 = (init_lib2(), __toCommonJS(lib_exports2));
    var InitializeRelativeTimeFormat_1 = require_InitializeRelativeTimeFormat();
    var PartitionRelativeTimePattern_1 = require_PartitionRelativeTimePattern();
    var get_internal_slots_1 = tslib_1.__importDefault(require_get_internal_slots());
    var RelativeTimeFormat = (
      /** @class */
      function() {
        function RelativeTimeFormat2(locales, options) {
          var newTarget = this && this instanceof RelativeTimeFormat2 ? this.constructor : void 0;
          if (!newTarget) {
            throw new TypeError("Intl.RelativeTimeFormat must be called with 'new'");
          }
          return (0, InitializeRelativeTimeFormat_1.InitializeRelativeTimeFormat)(this, locales, options, {
            getInternalSlots: get_internal_slots_1.default,
            availableLocales: RelativeTimeFormat2.availableLocales,
            relevantExtensionKeys: RelativeTimeFormat2.relevantExtensionKeys,
            localeData: RelativeTimeFormat2.localeData,
            getDefaultLocale: RelativeTimeFormat2.getDefaultLocale
          });
        }
        RelativeTimeFormat2.prototype.format = function(value, unit) {
          if (typeof this !== "object") {
            throw new TypeError("format was called on a non-object");
          }
          var internalSlots = (0, get_internal_slots_1.default)(this);
          if (!internalSlots.initializedRelativeTimeFormat) {
            throw new TypeError("format was called on a invalid context");
          }
          return (0, PartitionRelativeTimePattern_1.PartitionRelativeTimePattern)(this, Number(value), (0, ecma402_abstract_1.ToString)(unit), {
            getInternalSlots: get_internal_slots_1.default
          }).map(function(el) {
            return el.value;
          }).join("");
        };
        RelativeTimeFormat2.prototype.formatToParts = function(value, unit) {
          if (typeof this !== "object") {
            throw new TypeError("formatToParts was called on a non-object");
          }
          var internalSlots = (0, get_internal_slots_1.default)(this);
          if (!internalSlots.initializedRelativeTimeFormat) {
            throw new TypeError("formatToParts was called on a invalid context");
          }
          return (0, PartitionRelativeTimePattern_1.PartitionRelativeTimePattern)(this, Number(value), (0, ecma402_abstract_1.ToString)(unit), { getInternalSlots: get_internal_slots_1.default });
        };
        RelativeTimeFormat2.prototype.resolvedOptions = function() {
          if (typeof this !== "object") {
            throw new TypeError("resolvedOptions was called on a non-object");
          }
          var internalSlots = (0, get_internal_slots_1.default)(this);
          if (!internalSlots.initializedRelativeTimeFormat) {
            throw new TypeError("resolvedOptions was called on a invalid context");
          }
          return {
            locale: internalSlots.locale,
            style: internalSlots.style,
            numeric: internalSlots.numeric,
            numberingSystem: internalSlots.numberingSystem
          };
        };
        RelativeTimeFormat2.supportedLocalesOf = function(locales, options) {
          return (0, ecma402_abstract_1.SupportedLocales)(RelativeTimeFormat2.availableLocales, (0, ecma402_abstract_1.CanonicalizeLocaleList)(locales), options);
        };
        RelativeTimeFormat2.__addLocaleData = function() {
          var data = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
          }
          for (var _a = 0, data_1 = data; _a < data_1.length; _a++) {
            var _b = data_1[_a], d = _b.data, locale = _b.locale;
            var minimizedLocale = new Intl.Locale(locale).minimize().toString();
            RelativeTimeFormat2.localeData[locale] = RelativeTimeFormat2.localeData[minimizedLocale] = d;
            RelativeTimeFormat2.availableLocales.add(minimizedLocale);
            RelativeTimeFormat2.availableLocales.add(locale);
            if (!RelativeTimeFormat2.__defaultLocale) {
              RelativeTimeFormat2.__defaultLocale = minimizedLocale;
            }
          }
        };
        RelativeTimeFormat2.getDefaultLocale = function() {
          return RelativeTimeFormat2.__defaultLocale;
        };
        RelativeTimeFormat2.localeData = {};
        RelativeTimeFormat2.availableLocales = /* @__PURE__ */ new Set();
        RelativeTimeFormat2.__defaultLocale = "";
        RelativeTimeFormat2.relevantExtensionKeys = ["nu"];
        RelativeTimeFormat2.polyfilled = true;
        return RelativeTimeFormat2;
      }()
    );
    exports.default = RelativeTimeFormat;
    try {
      if (typeof Symbol !== "undefined") {
        Object.defineProperty(RelativeTimeFormat.prototype, Symbol.toStringTag, {
          value: "Intl.RelativeTimeFormat",
          writable: false,
          enumerable: false,
          configurable: true
        });
      }
      Object.defineProperty(RelativeTimeFormat.prototype.constructor, "length", {
        value: 0,
        writable: false,
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(RelativeTimeFormat.supportedLocalesOf, "length", {
        value: 1,
        writable: false,
        enumerable: false,
        configurable: true
      });
    } catch (e) {
    }
  }
});

// node_modules/@formatjs/intl-relativetimeformat/supported-locales.generated.js
var require_supported_locales_generated = __commonJS({
  "node_modules/@formatjs/intl-relativetimeformat/supported-locales.generated.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.supportedLocales = void 0;
    exports.supportedLocales = ["af", "af-NA", "agq", "ak", "am", "ar", "ar-AE", "ar-BH", "ar-DJ", "ar-DZ", "ar-EG", "ar-EH", "ar-ER", "ar-IL", "ar-IQ", "ar-JO", "ar-KM", "ar-KW", "ar-LB", "ar-LY", "ar-MA", "ar-MR", "ar-OM", "ar-PS", "ar-QA", "ar-SA", "ar-SD", "ar-SO", "ar-SS", "ar-SY", "ar-TD", "ar-TN", "ar-YE", "as", "asa", "ast", "az", "az-Cyrl", "az-Latn", "bas", "be", "be-tarask", "bem", "bez", "bg", "bm", "bn", "bn-IN", "bo", "bo-IN", "br", "brx", "bs", "bs-Cyrl", "bs-Latn", "ca", "ca-AD", "ca-ES-valencia", "ca-FR", "ca-IT", "ccp", "ccp-IN", "ce", "ceb", "cgg", "chr", "ckb", "ckb-IR", "cs", "cy", "da", "da-GL", "dav", "de", "de-AT", "de-BE", "de-CH", "de-IT", "de-LI", "de-LU", "dje", "doi", "dsb", "dua", "dyo", "dz", "ebu", "ee", "ee-TG", "el", "el-CY", "en", "en-001", "en-150", "en-AE", "en-AG", "en-AI", "en-AS", "en-AT", "en-AU", "en-BB", "en-BE", "en-BI", "en-BM", "en-BS", "en-BW", "en-BZ", "en-CA", "en-CC", "en-CH", "en-CK", "en-CM", "en-CX", "en-CY", "en-DE", "en-DG", "en-DK", "en-DM", "en-ER", "en-FI", "en-FJ", "en-FK", "en-FM", "en-GB", "en-GD", "en-GG", "en-GH", "en-GI", "en-GM", "en-GU", "en-GY", "en-HK", "en-IE", "en-IL", "en-IM", "en-IN", "en-IO", "en-JE", "en-JM", "en-KE", "en-KI", "en-KN", "en-KY", "en-LC", "en-LR", "en-LS", "en-MG", "en-MH", "en-MO", "en-MP", "en-MS", "en-MT", "en-MU", "en-MW", "en-MY", "en-NA", "en-NF", "en-NG", "en-NL", "en-NR", "en-NU", "en-NZ", "en-PG", "en-PH", "en-PK", "en-PN", "en-PR", "en-PW", "en-RW", "en-SB", "en-SC", "en-SD", "en-SE", "en-SG", "en-SH", "en-SI", "en-SL", "en-SS", "en-SX", "en-SZ", "en-TC", "en-TK", "en-TO", "en-TT", "en-TV", "en-TZ", "en-UG", "en-UM", "en-VC", "en-VG", "en-VI", "en-VU", "en-WS", "en-ZA", "en-ZM", "en-ZW", "eo", "es", "es-419", "es-AR", "es-BO", "es-BR", "es-BZ", "es-CL", "es-CO", "es-CR", "es-CU", "es-DO", "es-EA", "es-EC", "es-GQ", "es-GT", "es-HN", "es-IC", "es-MX", "es-NI", "es-PA", "es-PE", "es-PH", "es-PR", "es-PY", "es-SV", "es-US", "es-UY", "es-VE", "et", "eu", "ewo", "fa", "fa-AF", "ff", "ff-Adlm", "ff-Adlm-BF", "ff-Adlm-CM", "ff-Adlm-GH", "ff-Adlm-GM", "ff-Adlm-GW", "ff-Adlm-LR", "ff-Adlm-MR", "ff-Adlm-NE", "ff-Adlm-NG", "ff-Adlm-SL", "ff-Adlm-SN", "ff-Latn", "ff-Latn-BF", "ff-Latn-CM", "ff-Latn-GH", "ff-Latn-GM", "ff-Latn-GN", "ff-Latn-GW", "ff-Latn-LR", "ff-Latn-MR", "ff-Latn-NE", "ff-Latn-NG", "ff-Latn-SL", "fi", "fil", "fo", "fo-DK", "fr", "fr-BE", "fr-BF", "fr-BI", "fr-BJ", "fr-BL", "fr-CA", "fr-CD", "fr-CF", "fr-CG", "fr-CH", "fr-CI", "fr-CM", "fr-DJ", "fr-DZ", "fr-GA", "fr-GF", "fr-GN", "fr-GP", "fr-GQ", "fr-HT", "fr-KM", "fr-LU", "fr-MA", "fr-MC", "fr-MF", "fr-MG", "fr-ML", "fr-MQ", "fr-MR", "fr-MU", "fr-NC", "fr-NE", "fr-PF", "fr-PM", "fr-RE", "fr-RW", "fr-SC", "fr-SN", "fr-SY", "fr-TD", "fr-TG", "fr-TN", "fr-VU", "fr-WF", "fr-YT", "fur", "fy", "ga", "ga-GB", "gd", "gl", "gsw", "gsw-FR", "gsw-LI", "gu", "guz", "gv", "ha", "ha-GH", "ha-NE", "haw", "he", "hi", "hr", "hr-BA", "hsb", "hu", "hy", "ia", "id", "ig", "ii", "is", "it", "it-CH", "it-SM", "it-VA", "ja", "jgo", "jmc", "jv", "ka", "kab", "kam", "kde", "kea", "kgp", "khq", "ki", "kk", "kkj", "kl", "kln", "km", "kn", "ko", "ko-KP", "kok", "ks", "ks-Arab", "ksb", "ksf", "ksh", "ku", "kw", "ky", "lag", "lb", "lg", "lkt", "ln", "ln-AO", "ln-CF", "ln-CG", "lo", "lrc", "lrc-IQ", "lt", "lu", "luo", "luy", "lv", "mai", "mas", "mas-TZ", "mer", "mfe", "mg", "mgh", "mgo", "mi", "mk", "ml", "mn", "mni", "mni-Beng", "mr", "ms", "ms-BN", "ms-ID", "ms-SG", "mt", "mua", "my", "mzn", "naq", "nb", "nb-SJ", "nd", "nds", "nds-NL", "ne", "ne-IN", "nl", "nl-AW", "nl-BE", "nl-BQ", "nl-CW", "nl-SR", "nl-SX", "nmg", "nn", "nnh", "no", "nus", "nyn", "om", "om-KE", "or", "os", "os-RU", "pa", "pa-Arab", "pa-Guru", "pcm", "pl", "ps", "ps-PK", "pt", "pt-AO", "pt-CH", "pt-CV", "pt-GQ", "pt-GW", "pt-LU", "pt-MO", "pt-MZ", "pt-PT", "pt-ST", "pt-TL", "qu", "qu-BO", "qu-EC", "rm", "rn", "ro", "ro-MD", "rof", "ru", "ru-BY", "ru-KG", "ru-KZ", "ru-MD", "ru-UA", "rw", "rwk", "sa", "sah", "saq", "sat", "sat-Olck", "sbp", "sc", "sd", "sd-Arab", "sd-Deva", "se", "se-FI", "se-SE", "seh", "ses", "sg", "shi", "shi-Latn", "shi-Tfng", "si", "sk", "sl", "smn", "sn", "so", "so-DJ", "so-ET", "so-KE", "sq", "sq-MK", "sq-XK", "sr", "sr-Cyrl", "sr-Cyrl-BA", "sr-Cyrl-ME", "sr-Cyrl-XK", "sr-Latn", "sr-Latn-BA", "sr-Latn-ME", "sr-Latn-XK", "su", "su-Latn", "sv", "sv-AX", "sv-FI", "sw", "sw-CD", "sw-KE", "sw-UG", "ta", "ta-LK", "ta-MY", "ta-SG", "te", "teo", "teo-KE", "tg", "th", "ti", "ti-ER", "tk", "to", "tr", "tr-CY", "tt", "twq", "tzm", "ug", "uk", "und", "ur", "ur-IN", "uz", "uz-Arab", "uz-Cyrl", "uz-Latn", "vai", "vai-Latn", "vai-Vaii", "vi", "vun", "wae", "wo", "xh", "xog", "yav", "yi", "yo", "yo-BJ", "yrl", "yrl-CO", "yrl-VE", "yue", "yue-Hans", "yue-Hant", "zgh", "zh", "zh-Hans", "zh-Hans-HK", "zh-Hans-MO", "zh-Hans-SG", "zh-Hant", "zh-Hant-HK", "zh-Hant-MO", "zu"];
  }
});

// node_modules/@formatjs/intl-relativetimeformat/should-polyfill.js
var require_should_polyfill = __commonJS({
  "node_modules/@formatjs/intl-relativetimeformat/should-polyfill.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.shouldPolyfill = void 0;
    var intl_localematcher_1 = (init_lib(), __toCommonJS(lib_exports));
    var supported_locales_generated_1 = require_supported_locales_generated();
    function supportedLocalesOf(locale) {
      if (!locale) {
        return true;
      }
      var locales = Array.isArray(locale) ? locale : [locale];
      return Intl.RelativeTimeFormat.supportedLocalesOf(locales).length === locales.length;
    }
    function hasResolvedOptionsNumberingSystem(locale) {
      try {
        return "numberingSystem" in new Intl.RelativeTimeFormat(locale || "en", {
          numeric: "auto"
        }).resolvedOptions();
      } catch (_) {
        return false;
      }
    }
    function shouldPolyfill(locale) {
      if (locale === void 0) {
        locale = "en";
      }
      if (!("RelativeTimeFormat" in Intl) || !supportedLocalesOf(locale) || !hasResolvedOptionsNumberingSystem(locale)) {
        return (0, intl_localematcher_1.match)([locale], supported_locales_generated_1.supportedLocales, "en");
      }
    }
    exports.shouldPolyfill = shouldPolyfill;
  }
});

// node_modules/@formatjs/intl-relativetimeformat/polyfill.js
var require_polyfill = __commonJS({
  "node_modules/@formatjs/intl-relativetimeformat/polyfill.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var _1 = tslib_1.__importDefault(require_intl_relativetimeformat());
    var should_polyfill_1 = require_should_polyfill();
    if ((0, should_polyfill_1.shouldPolyfill)()) {
      Object.defineProperty(Intl, "RelativeTimeFormat", {
        value: _1.default,
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
  }
});
export default require_polyfill();
//# sourceMappingURL=@formatjs_intl-relativetimeformat_polyfill.js.map
