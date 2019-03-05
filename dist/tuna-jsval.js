var tuna;
(function (tuna) {
    var jsval;
    (function (jsval) {
        jsval.options = {
            name: "val",
            ignore: [":disabled"],
            onError: function (validator, ngModel) { }
        };
        function attr(attrs, name, value) {
            var n = jsval.options.name + name;
            return value ? attrs[n] = value : attrs[n];
        }
        jsval.attr = attr;
        function format(text) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return (text || "").replace(/{(\d+)}/g, function (match, number) { return args[number] ? args[number] : match; });
        }
        jsval.format = format;
        jsval.rules = {
            equalto: {
                text: "must match {0}",
                valid: function (validator) {
                    var other = attr(validator.attrs, "Other");
                    validator.text = format(validator.text, other);
                    return function (modelValue, viewValue) {
                        if (!viewValue)
                            return true;
                        var target = angular.element(other);
                        return target.val() == viewValue;
                    };
                }
            },
            required: {
                text: "Required field",
                valid: function (validator) {
                    var regex = new RegExp(/^$/);
                    return function (modelValue, viewValue) {
                        return !regex.test(viewValue || '');
                    };
                }
            },
            regex: {
                text: "Invalid value",
                valid: function (validator) {
                    var pattern = attr(validator.attrs, "RegexPattern");
                    var regex = new RegExp(pattern);
                    return function (modelValue, viewValue) {
                        if (!viewValue)
                            return true;
                        return regex.test(viewValue);
                    };
                }
            },
            date: {
                text: "Invalid date",
                valid: function (validator) {
                    return function (modelValue, viewValue) {
                        if (!viewValue)
                            return true;
                        if (viewValue.length < 4)
                            return false;
                        var ticks = Date.parse(viewValue);
                        return isNaN(ticks) === false;
                    };
                }
            },
            digits: {
                text: "Only digits allowed",
                valid: function (validator) {
                    return function (modelValue, viewValue) {
                        if (!viewValue)
                            return true;
                        return viewValue.length == 1 && !isNaN(viewValue);
                    };
                }
            },
            number: {
                text: "Only numbers allowed",
                valid: function (validator) {
                    return function (modelValue, viewValue) {
                        if (!viewValue)
                            return true;
                        return viewValue.length > 0 && !isNaN(viewValue);
                    };
                }
            },
            email: {
                text: "Invalid email",
                valid: function (validator) {
                    var email = attr(validator.attrs, "Email");
                    var regex = attr ? new RegExp(email) : /.+@.+\..+/;
                    return function (modelValue, viewValue) {
                        if (!viewValue)
                            return true;
                        return regex.test(viewValue);
                    };
                }
            },
            range: {
                text: "Range must be between {0} and {1}",
                valid: function (validator) {
                    var min = attr(validator.attrs, "RangeMin");
                    var max = attr(validator.attrs, "RangeMax");
                    validator.text = format(validator.text, min, max);
                    return function (modelValue, viewValue) {
                        if (!viewValue)
                            return true;
                        if (isNaN(viewValue))
                            return false;
                        var value = parseFloat(viewValue);
                        var minResult = min != null ? value >= min : true;
                        var maxResult = max != null ? value <= max : true;
                        return minResult && maxResult;
                    };
                }
            },
            length: {
                text: "Length must be between {0} and {1}",
                valid: function (validator) {
                    var min = attr(validator.attrs, "LengthMin");
                    var max = attr(validator.attrs, "LengthMax");
                    validator.text = format(validator.text, min, max);
                    return function (modelValue, viewValue) {
                        if (!viewValue)
                            return true;
                        var value = (viewValue || '').length;
                        var minResult = min ? value >= min : true;
                        var maxResult = max ? value <= max : true;
                        return minResult && maxResult;
                    };
                }
            }
        };
    })(jsval = tuna.jsval || (tuna.jsval = {}));
})(tuna || (tuna = {}));
var tuna;
(function (tuna) {
    var jsval;
    (function (jsval) {
        angular.module("tuna.jsval", [])
            .directive(jsval.options.name, ["$parse", function validation($parse) {
                var REGEX_VAL_ATTRIBUTE = new RegExp("^(data-)?" + jsval.options.name + "-([^-]+)$");
                return {
                    restrict: "A",
                    require: ["^^form", "?ngModel"],
                    link: function (scope, element, attrs, controllers) {
                        var ngModel = controllers[1];
                        var validator = setup(element);
                        if (!validator)
                            return;
                        setupWatch();
                        function setup(element) {
                            var enabled = ngModel !== null && $parse(attrs.val)(scope) === true;
                            if (!enabled)
                                return null;
                            var result = {};
                            var attributes = element[0].attributes;
                            var _loop_1 = function () {
                                var item = attributes[prop];
                                var m = REGEX_VAL_ATTRIBUTE.exec(item.name);
                                if (!m)
                                    return "continue";
                                var name_1 = m[m.length - 1].toLowerCase();
                                var rule = jsval.rules[name_1];
                                if (!rule) {
                                    console.error("Rule \"" + name_1 + "\" is missing. To add it: tuna.jsval.rules[\"" + name_1 + "\"] = { text: \"\", valid: (validator) => boolean} };");
                                    return "continue";
                                }
                                var validator_1 = result[name_1] = {
                                    text: rule.text,
                                    attrs: attrs,
                                    element: element
                                };
                                var isValid = rule.valid(validator_1);
                                ngModel.$validators[name_1] = function (modelValue, viewValue) {
                                    if (jsval.options.ignore.some(function (s) { return element.is(s); }))
                                        return true;
                                    var result = isValid(modelValue, viewValue);
                                    return result;
                                };
                            };
                            for (var prop in attributes) {
                                _loop_1();
                            }
                            return result;
                        }
                        function setupWatch() {
                            if (!jsval.options.onError)
                                return;
                            scope.$evalAsync(function () {
                                scope.$watch(isElementValid, function (isValid) {
                                    var validator = getValidator(ngModel.$error);
                                    if (validator)
                                        jsval.options.onError(validator, ngModel);
                                });
                            });
                        }
                        function isElementValid() {
                            return ngModel.$valid === true;
                        }
                        function getValidator(errors) {
                            var result;
                            for (var name in errors) {
                                if (errors[name])
                                    return validator[name];
                            }
                            return result;
                        }
                    }
                };
            }]);
    })(jsval = tuna.jsval || (tuna.jsval = {}));
})(tuna || (tuna = {}));
