var Tuna;
(function (Tuna) {
    var Validator;
    (function (Validator) {
        Validator.AttrName = "val";
        Validator.Events = {
            onElementError: function (ngModel, element, text) { }
        };
        Validator.Validators = {
            equalto: {
                text: "Must match {other}",
                rule: function (scope, element, attrs) {
                    var attr = getValidatorAttr(attrs, "Other");
                    return function (viewValue, modelValue) {
                        if (!viewValue)
                            return true;
                        var target = angular.element(attr);
                        return target.val() == viewValue;
                    };
                }
            },
            required: {
                text: "Required field",
                rule: function (scope, element, attrs) {
                    return function (viewValue, modelValue) {
                        return !/^$/.test(viewValue || '');
                    };
                },
            },
            regex: {
                text: "Invalid value",
                rule: function (scope, element, attrs) {
                    var attr = getValidatorAttr(attrs, "RegexPattern");
                    var regex = new RegExp(attr);
                    return function (viewValue, modelValue) {
                        if (!viewValue)
                            return true;
                        return regex.test(viewValue);
                    };
                }
            },
            date: {
                text: "Invalid date",
                rule: function (scope, element, attrs) {
                    return function (viewValue, modelValue) {
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
                rule: function (scope, element, attrs) {
                    return function (viewValue, modelValue) {
                        if (viewValue == null)
                            return true;
                        return !/\D+/.test(viewValue);
                    };
                }
            },
            number: {
                text: "Only numbers allowed",
                rule: function (scope, element, attrs) {
                    return function (viewValue, modelValue) {
                        if (viewValue == null)
                            return true;
                        return viewValue.length == 0 || !isNaN(viewValue);
                    };
                }
            },
            email: {
                text: "Invalid email",
                rule: function (scope, element, attrs) {
                    var attr = getValidatorAttr(attrs, "Email");
                    var regex = attr ? new RegExp(attr) : /.+@.+\..+/;
                    return function (viewValue, modelValue) {
                        if (!viewValue)
                            return true;
                        return regex.test(viewValue);
                    };
                }
            },
            range: {
                text: "Range must be between {min} and {max}",
                rule: function (scope, element, attrs) {
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
                }
            },
            length: {
                text: "Length must be between {min} and {max}",
                rule: function (scope, element, attrs) {
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
        function getValidatorAttr(attrs, name) {
            return attrs[Validator.AttrName + name];
        }
    })(Validator = Tuna.Validator || (Tuna.Validator = {}));
})(Tuna || (Tuna = {}));
var Tuna;
(function (Tuna) {
    var Validator;
    (function (Validator) {
        angular.module('tuna', [])
            .directive(Validator.AttrName, ['$parse', '$compile', function validation($parse, $compile) {
                var REGEX_VAL_ATTRIBUTE = new RegExp("^(data-)?" + Validator.AttrName + "-([^-]+)$");
                return {
                    restrict: 'A',
                    require: ['^^form', '?ngModel'],
                    link: function (scope, element, attrs, controllers) {
                        var ngModel = controllers[1];
                        var validators = setupValidators(element[0]);
                        if (!validators)
                            return;
                        scope.$evalAsync(function () {
                            scope.$watch(function () { return ngModel.$valid === true; }, function (_isValid) {
                                var text = resolveErrorText(ngModel.$error);
                                Validator.Events.onElementError(ngModel, element, text);
                            });
                        });
                        function resolveErrorText(errors) {
                            var result;
                            for (var name_1 in errors) {
                                if (errors[name_1]) {
                                    result = setupText(validators[name_1]);
                                    break;
                                }
                            }
                            return result || "Undefined error message for " + name + " validator";
                        }
                        function isEnabled() {
                            return ngModel !== null && $parse(attrs.val)() === true;
                        }
                        function setupValidators(element) {
                            if (!isEnabled())
                                return null;
                            var result = {};
                            var attributes = element.attributes;
                            for (var prop in attributes) {
                                var attr = attributes[prop];
                                var m = REGEX_VAL_ATTRIBUTE.exec(attr.name);
                                if (!m)
                                    continue;
                                var name_2 = m[m.length - 1].toLowerCase();
                                var validator = setupValidator(name_2);
                                if (validator)
                                    result[name_2] = { attr: attr, name: name_2, element: element, validator: validator };
                            }
                            return result;
                        }
                        function setupValidator(name) {
                            var validator = Validator.Validators[name] || console.warn('No rule exists for ' + name);
                            if (validator)
                                ngModel.$validators[name] = validator.rule(scope, element, attrs);
                            return validator;
                        }
                        function setupText(validatorInfo) {
                            if (!validatorInfo)
                                return "";
                            var attr = validatorInfo.attr;
                            var attributes = validatorInfo.element.attributes;
                            var matchRegex = /{(\w+)}/g;
                            var text = attr.value || validatorInfo.validator.text || "";
                            return text.replace(matchRegex, function (_all, match) {
                                var a = attributes[attr.name + "-" + match];
                                return a ? a.value : match;
                            });
                        }
                    }
                };
            }]);
    })(Validator = Tuna.Validator || (Tuna.Validator = {}));
})(Tuna || (Tuna = {}));
