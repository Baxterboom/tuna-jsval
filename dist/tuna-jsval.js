var Tuna;
(function (Tuna) {
    Tuna.Ignore = [":hidden"];
    Tuna.ValidatorAttrName = "val";
    Tuna.ValidatorEvents = {
        onElementError: function (ngModel, element, text) { }
    };
    function getValidatorAttribute(attrs, name) {
        return attrs[Tuna.ValidatorAttrName + name];
    }
    Tuna.getValidatorAttribute = getValidatorAttribute;
    function format(text) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return (text || "").replace(/{(\d+)}/g, function (match, number) { return args[number] ? args[number] : match; });
    }
    Tuna.format = format;
    Tuna.Validators = {
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
            equalto: function (validator, element, attrs) {
                var attr = getValidatorAttribute(attrs, "Other");
                return function (modelValue, viewValue) {
                    if (!viewValue)
                        return true;
                    var target = angular.element(attr);
                    return target.val() == viewValue;
                };
            },
            required: function (validator, element, attrs) {
                var regex = new RegExp(/^$/);
                return function (modelValue, viewValue) {
                    return !regex.test(viewValue || '');
                };
            },
            regex: function (validator, element, attrs) {
                var attr = getValidatorAttribute(attrs, "RegexPattern");
                var regex = new RegExp(attr);
                return function (modelValue, viewValue) {
                    if (!viewValue)
                        return true;
                    return regex.test(viewValue);
                };
            },
            date: function (validator, element, attrs) {
                return function (modelValue, viewValue) {
                    if (!viewValue)
                        return true;
                    if (viewValue.length < 4)
                        return false;
                    var ticks = Date.parse(viewValue);
                    return isNaN(ticks) === false;
                };
            },
            digits: function (validator, element, attrs) {
                return function (modelValue, viewValue) {
                    if (!viewValue)
                        return true;
                    return viewValue.length == 1 && !isNaN(viewValue);
                };
            },
            number: function (validator, element, attrs) {
                return function (modelValue, viewValue) {
                    if (!viewValue)
                        return true;
                    return viewValue.length > 0 && !isNaN(viewValue);
                };
            },
            email: function (validator, element, attrs) {
                var attr = getValidatorAttribute(attrs, "Email");
                var regex = attr ? new RegExp(attr) : /.+@.+\..+/;
                return function (modelValue, viewValue) {
                    if (!viewValue)
                        return true;
                    return regex.test(viewValue);
                };
            },
            range: function (validator, element, attrs) {
                var min = getValidatorAttribute(attrs, "RangeMin");
                var max = getValidatorAttribute(attrs, "RangeMax");
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
            length: function (validator, element, attrs) {
                var min = getValidatorAttribute(attrs, "LengthMin");
                var max = getValidatorAttribute(attrs, "LengthMax");
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
})(Tuna || (Tuna = {}));
var Tuna;
(function (Tuna) {
    angular.module('tuna.jsval', [])
        .directive(Tuna.ValidatorAttrName, ['$parse', '$compile', function validation($parse, $compile) {
            var REGEX_VAL_ATTRIBUTE = new RegExp("^(data-)?" + Tuna.ValidatorAttrName + "-([^-]+)$");
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
                                Tuna.ValidatorEvents.onElementError(ngModel, element, text);
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
                            if (m) {
                                var name_1 = m[m.length - 1].toLowerCase();
                                var target = { rule: Tuna.Validators.rules[name_1], text: item.value || Tuna.Validators.texts[name_1] };
                                if (!target.rule)
                                    return { value: console.error('No rule exists for ' + name_1) };
                                var isValid_1 = target.rule(target, element, attrs);
                                result.rules[name_1] = target.rule;
                                result.texts[name_1] = target.text;
                                ngModel.$validators[name_1] = function (modelValue, viewValue) {
                                    if (Tuna.Ignore.some(function (s) { return element.is(s); }))
                                        return true;
                                    return isValid_1(modelValue, viewValue);
                                };
                            }
                        };
                        for (var prop in attributes) {
                            var state_1 = _loop_1();
                            if (typeof state_1 === "object")
                                return state_1.value;
                        }
                        return result;
                    }
                }
            };
        }]);
})(Tuna || (Tuna = {}));
