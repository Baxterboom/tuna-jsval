var Tuna;
(function (Tuna) {
    Tuna.ValidatorAttrName = "val";
    Tuna.ValidatorEvents = {
        onElementError: function (ngModel, element, text) { }
    };
    function getValidatorAttr(attrs, name) {
        return attrs[Tuna.ValidatorAttrName + name];
    }
    Tuna.getValidatorAttr = getValidatorAttr;
    Tuna.Validators = {
        texts: {
            regex: 'Invalid value',
            date: 'Invalid date',
            email: 'Invalid email',
            range: 'Range must be between {min} and {max}',
            digits: 'Only digits allowed',
            number: 'Only numbers allowed',
            required: 'Required field',
            equalto: 'must match {other}',
            length: 'Length must be between {min} and {max}',
        },
        rules: {
            equalto: function (scope, element, attrs) {
                var attr = getValidatorAttr(attrs, "Other");
                return function (viewValue, modelValue) {
                    if (!viewValue)
                        return true;
                    var target = angular.element(attr);
                    return target.val() == viewValue;
                };
            },
            required: function (scope, element, attrs) {
                var regex = new RegExp(/^$/);
                return function (viewValue, modelValue) {
                    return !regex.test(viewValue || '');
                };
            },
            regex: function (scope, element, attrs) {
                var attr = getValidatorAttr(attrs, "RegexPattern");
                var regex = new RegExp(attr);
                return function (viewValue, modelValue) {
                    if (!viewValue)
                        return true;
                    return regex.test(viewValue);
                };
            },
            date: function (scope, element, attrs) {
                return function (viewValue, modelValue) {
                    if (!viewValue)
                        return true;
                    if (viewValue.length < 4)
                        return false;
                    var ticks = Date.parse(viewValue);
                    return isNaN(ticks) === false;
                };
            },
            digits: function (scope, element, attrs) {
                return function (viewValue, modelValue) {
                    if (!viewValue)
                        return true;
                    return viewValue.length == 1 && !isNaN(viewValue);
                };
            },
            number: function (scope, element, attrs) {
                return function (viewValue, modelValue) {
                    if (!viewValue)
                        return true;
                    return viewValue.length > 0 && !isNaN(viewValue);
                };
            },
            email: function (scope, element, attrs) {
                var attr = getValidatorAttr(attrs, "Email");
                var regex = attr ? new RegExp(attr) : /.+@.+\..+/;
                return function (viewValue, modelValue) {
                    if (!viewValue)
                        return true;
                    return regex.test(viewValue);
                };
            },
            range: function (scope, element, attrs) {
                var min = getValidatorAttr(attrs, "RangeMin");
                var max = getValidatorAttr(attrs, "RangeMax");
                return function (viewValue, modelValue) {
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
            length: function (scope, element, attrs) {
                var min = getValidatorAttr(attrs, "LengthMin");
                var max = getValidatorAttr(attrs, "LengthMax");
                return function (viewValue, modelValue) {
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
    angular.module('tuna', [])
        .directive(Tuna.ValidatorAttrName, ['$parse', '$compile', function validation($parse, $compile) {
            var REGEX_VAL_ATTRIBUTE = new RegExp("^(data-)?" + Tuna.ValidatorAttrName + "-([^-]+)$");
            return {
                restrict: 'A',
                require: ['^^form', '?ngModel'],
                link: function (scope, element, attrs, controllers) {
                    var ngModel = controllers[1];
                    var validator = setupValidators(element);
                    if (!validator)
                        return;
                    scope.$evalAsync(function () {
                        scope.$watch(function () { return ngModel.$valid === true; }, function (_isValid) {
                            var text = resolveErrorText(ngModel.$error);
                            Tuna.ValidatorEvents.onElementError(ngModel, element, text);
                        });
                    });
                    function resolveErrorText(errors) {
                        var result = 'Undefined error message';
                        for (var name_1 in errors) {
                            result = validator.texts[name_1];
                            if (errors[name_1])
                                break;
                        }
                        return result;
                    }
                    function isEnabled() {
                        return ngModel !== null && $parse(attrs.val)() === true;
                    }
                    function setupValidators(element) {
                        if (!isEnabled())
                            return null;
                        var result = { texts: {} };
                        var attributes = element[0].attributes;
                        for (var prop in attributes) {
                            var current = attributes[prop];
                            var m = REGEX_VAL_ATTRIBUTE.exec(current.name);
                            if (m) {
                                var name_2 = m[m.length - 1].toLowerCase();
                                var text = setupText(current, attributes, Tuna.Validators.texts[name_2]);
                                var validator_1 = setupValidator(name_2);
                                if (!validator_1)
                                    return null;
                                result.texts[name_2] = text;
                                ngModel.$validators[name_2] = validator_1(scope, element, attrs);
                            }
                        }
                        return result;
                    }
                    function setupValidator(name) {
                        return Tuna.Validators.rules[name] || console.warn('No rule exists for ' + name);
                    }
                    function setupText(target, attributes, defaultText) {
                        var matchRegex = /{(\w+)}/g;
                        var text = target.value || defaultText || "";
                        return text.replace(matchRegex, function (_all, match) {
                            var attr = attributes[target.name + "-" + match];
                            return attr ? attr.value : match;
                        });
                    }
                }
            };
        }]);
})(Tuna || (Tuna = {}));
