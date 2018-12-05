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
describe("Tuna.Validator.validators", function () {
    var modelValue, viewValue, scope, element, attrs;
    describe("equalto", function () {
        var isValid;
        beforeEach(function () {
            attrs = { valOther: "#target-other" };
            element = angular.element("<input type=\"text\" id=\"target-other\" value=\"666\"></div>");
            angular.element('body').append(element);
            isValid = Tuna.Validator.Validators["equalto"].rule(scope, element, attrs);
        });
        afterEach(function () {
            if (element)
                element.remove();
        });
        it("should exist", function () {
            expect(isValid).toBeDefined();
        });
        it("should be valid string", function () {
            viewValue = "666";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be valid number", function () {
            viewValue = 666;
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be invalid when not same value", function () {
            viewValue = "not-same-value";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(false);
        });
    });
    describe("required", function () {
        var isValid;
        beforeEach(function () {
            isValid = Tuna.Validator.Validators["required"].rule(scope, element, attrs);
        });
        it("should exist", function () {
            expect(isValid).toBeDefined();
        });
        it("should be valid", function () {
            viewValue = "some input";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be invalid when null", function () {
            viewValue = null;
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(false);
        });
        it("should be invalid when undefined", function () {
            viewValue = undefined;
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(false);
        });
        it("should be invalid when empty string", function () {
            viewValue = "";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(false);
        });
        it("should be valid when empty string(s)", function () {
            viewValue = "    ";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
    });
    describe("regex", function () {
        var isValid;
        beforeEach(function () {
            attrs = { valRegexPattern: "^match-this" };
            isValid = Tuna.Validator.Validators["regex"].rule(scope, element, attrs);
        });
        it("should exist", function () {
            expect(isValid).toBeDefined();
        });
        it("should be valid", function () {
            viewValue = "match-this";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be invalid when not matching", function () {
            viewValue = "dont-match-value";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(false);
        });
    });
    describe("date", function () {
        var isValid;
        beforeEach(function () {
            isValid = Tuna.Validator.Validators["date"].rule(scope, element, attrs);
        });
        it("should exist", function () {
            expect(isValid).toBeDefined();
        });
        it("should be valid 2011-02-20", function () {
            viewValue = "2011-02-20";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be valid 2011-02", function () {
            viewValue = "2011-02";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be valid 2011-02", function () {
            viewValue = "2011";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be valid when 02-20", function () {
            viewValue = "02-20";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be invalid when 02", function () {
            viewValue = "02";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(false);
        });
        it("should be invalid when ABCDEFG", function () {
            viewValue = "ABCDEFG";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(false);
        });
    });
    describe("digits", function () {
        var isValid;
        beforeEach(function () {
            isValid = Tuna.Validator.Validators["digits"].rule(scope, element, attrs);
        });
        it("should exist", function () {
            expect(isValid).toBeDefined();
        });
        it("should be valid when 6", function () {
            viewValue = "6";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be valid when 666", function () {
            viewValue = "666";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be invalid when decimals", function () {
            viewValue = "6.6";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(false);
        });
        it("should be invalid", function () {
            viewValue = "dont-match-value";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(false);
        });
    });
    describe("number", function () {
        var isValid;
        beforeEach(function () {
            isValid = Tuna.Validator.Validators["number"].rule(scope, element, attrs);
        });
        it("should exist", function () {
            expect(isValid).toBeDefined();
        });
        it("should be valid when 6", function () {
            viewValue = "6";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be valid when decimals", function () {
            viewValue = "6.6";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be invalid", function () {
            viewValue = "dont-match-value";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(false);
        });
    });
    describe("email", function () {
        var isValid;
        beforeEach(function () {
            isValid = Tuna.Validator.Validators["email"].rule(scope, element, attrs);
        });
        it("should exist", function () {
            expect(isValid).toBeDefined();
        });
        it("should be valid", function () {
            viewValue = "tuna@world.com";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be valid when pre domains", function () {
            viewValue = "tuna.domain@world.com";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be valid when post domains", function () {
            viewValue = "tuna@world.co.uk";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be valid when domains", function () {
            viewValue = "tuna.domain@world.co.uk";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be valid when ''", function () {
            viewValue = "";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be valid when null", function () {
            viewValue = null;
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be valid when undefined", function () {
            viewValue = undefined;
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be invalid when no @", function () {
            viewValue = "no-snabel-a.com";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(false);
        });
        it("should be invalid when no pre domain", function () {
            viewValue = "@world.com";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(false);
        });
        it("should be invalid when no post domain", function () {
            viewValue = "tuna@";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(false);
        });
    });
    describe("range", function () {
        var isValid;
        beforeEach(function () {
            attrs = {};
            attrs.valRangeMin = 0;
            attrs.valRangeMax = 2;
            isValid = Tuna.Validator.Validators["range"].rule(scope, element, attrs);
        });
        it("should exist", function () {
            expect(isValid).toBeDefined();
        });
        it("should be valid when ''", function () {
            viewValue = "";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be valid when null", function () {
            viewValue = null;
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be valid when undefined", function () {
            viewValue = undefined;
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be valid when 0", function () {
            viewValue = "0";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be valid when 1", function () {
            viewValue = "1";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be valid when 1.5", function () {
            viewValue = "1.5";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be valid when 2", function () {
            viewValue = "2";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be invalid when 2.00001", function () {
            viewValue = "2.00001";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(false);
        });
        it("should be invalid when isNaN", function () {
            viewValue = "this-is-not-a-number";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(false);
        });
        it("should be invalid when -1", function () {
            viewValue = "-1";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(false);
        });
        it("should be invalid when 4", function () {
            viewValue = "4";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(false);
        });
    });
    describe("length", function () {
        var isValid;
        beforeEach(function () {
            attrs = {};
            attrs.valLengthMin = 0;
            attrs.valLengthMax = 2;
            isValid = Tuna.Validator.Validators["length"].rule(scope, element, attrs);
        });
        it("should exist", function () {
            expect(isValid).toBeDefined();
        });
        it("should be valid when ''", function () {
            viewValue = "";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be valid when null", function () {
            viewValue = null;
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be valid when undefined", function () {
            viewValue = undefined;
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be valid when a", function () {
            viewValue = "a";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be valid when ab", function () {
            viewValue = "ab";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(true);
        });
        it("should be invalid when abc", function () {
            viewValue = "abc";
            var result = isValid(viewValue, modelValue);
            expect(result).toBe(false);
        });
    });
});
