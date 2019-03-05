var tuna;
(function (tuna) {
    var jsval;
    (function (jsval) {
        jsval.options = {
            name: "val",
            ignore: [":hidden"],
            onError: function (ngModel, element, text) { }
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
        jsval.validators = {
            texts: {
                regex: 'Invalid value',
                date: 'Invalid date',
                email: 'Invalid email',
                range: 'Range must be between {0} and {1}',
                length: 'Length must be between {0} and {1}',
                digits: 'Only digits allowed',
                number: 'Only numbers allowed',
                required: 'Required field',
                equalto: '{0} must match {1}'
            },
            rules: {
                equalto: function (validator) {
                    var other = attr(validator.attrs, "Other");
                    return function (modelValue, viewValue) {
                        if (!viewValue)
                            return true;
                        var target = angular.element(other);
                        return target.val() == viewValue;
                    };
                },
                required: function (validator) {
                    var regex = new RegExp(/^$/);
                    return function (modelValue, viewValue) {
                        return !regex.test(viewValue || '');
                    };
                },
                regex: function (validator) {
                    var pattern = attr(validator.attrs, "RegexPattern");
                    var regex = new RegExp(pattern);
                    return function (modelValue, viewValue) {
                        if (!viewValue)
                            return true;
                        return regex.test(viewValue);
                    };
                },
                date: function (validator) {
                    return function (modelValue, viewValue) {
                        if (!viewValue)
                            return true;
                        if (viewValue.length < 4)
                            return false;
                        var ticks = Date.parse(viewValue);
                        return isNaN(ticks) === false;
                    };
                },
                digits: function (validator) {
                    return function (modelValue, viewValue) {
                        if (!viewValue)
                            return true;
                        return viewValue.length == 1 && !isNaN(viewValue);
                    };
                },
                number: function (validator) {
                    return function (modelValue, viewValue) {
                        if (!viewValue)
                            return true;
                        return viewValue.length > 0 && !isNaN(viewValue);
                    };
                },
                email: function (validator) {
                    var email = attr(validator.attrs, "Email");
                    var regex = attr ? new RegExp(email) : /.+@.+\..+/;
                    return function (modelValue, viewValue) {
                        if (!viewValue)
                            return true;
                        return regex.test(viewValue);
                    };
                },
                range: function (validator) {
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
                },
                length: function (validator) {
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
        angular.module('tuna.jsval', [])
            .directive(jsval.options.name, ['$parse', '$compile', function validation($parse, $compile) {
                var REGEX_VAL_ATTRIBUTE = new RegExp("^(data-)?" + jsval.options.name + "-([^-]+)$");
                return {
                    restrict: 'A',
                    require: ['^^form', '?ngModel'],
                    link: function (scope, element, attrs, controllers) {
                        var ngForm = controllers[0];
                        var ngModel = controllers[1];
                        var validator = setupValidators(element);
                        if (validator)
                            init();
                        function init() {
                            scope.$evalAsync(function () {
                                scope.$watch(isElementValid, function (isValid) {
                                    var text = getText(ngModel.$error);
                                    jsval.options.onError(ngModel, element, text);
                                });
                            });
                        }
                        function isFormValid() {
                            return ngForm.$valid === true;
                        }
                        function isElementValid() {
                            return ngModel.$valid === true;
                        }
                        function getText(errors) {
                            var result = 'Undefined error message';
                            for (var name in errors) {
                                result = validator.texts[name];
                                if (errors[name])
                                    break;
                            }
                            return result;
                        }
                        function setupValidators(element) {
                            var enabled = ngModel !== null && $parse(attrs.val)(scope) === true;
                            if (!enabled)
                                return null;
                            var result = { rules: {}, texts: {} };
                            var attributes = element[0].attributes;
                            var _loop_1 = function () {
                                var item = attributes[prop];
                                var m = REGEX_VAL_ATTRIBUTE.exec(item.name);
                                if (!m)
                                    return "continue";
                                var name_1 = m[m.length - 1].toLowerCase();
                                var rule = jsval.validators.rules[name_1];
                                if (!rule) {
                                    console.error('No rule exists for ' + name_1);
                                    return "continue";
                                }
                                var text = item.value || jsval.validators.texts[name_1];
                                var validator_1 = { rule: rule, text: text, attrs: attrs, element: element };
                                result.rules[name_1] = validator_1.rule;
                                result.texts[name_1] = validator_1.text;
                                var isValid = validator_1.rule(validator_1);
                                ngModel.$validators[name_1] = function (modelValue, viewValue) {
                                    if (jsval.options.ignore.some(function (s) { return element.is(s); }))
                                        return true;
                                    return isValid(modelValue, viewValue);
                                };
                            };
                            for (var prop in attributes) {
                                _loop_1();
                            }
                            return result;
                        }
                    }
                };
            }]);
    })(jsval = tuna.jsval || (tuna.jsval = {}));
})(tuna || (tuna = {}));
