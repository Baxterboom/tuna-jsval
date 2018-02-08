var Tuna;
(function (Tuna) {
    Tuna.ValidatorEvents = {
        onElementError: function (ngModel, element, text) { }
    };
    Tuna.Validators = {
        texts: {
            regex: 'Invalid value',
            date: 'Invalid date',
            email: 'Invalid email',
            range: 'Range must be between {0} and {1}',
            digits: 'Only digits allowed',
            number: 'Only numbers allowed',
            required: 'Required field',
            equalto: '{0} must match {1}'
        },
        rules: {
            equalto: function (scope, element, attrs) {
                var other = attrs.valOther;
                return function (modelValue, viewValue) {
                    if (!viewValue)
                        return true;
                    var target = angular.element(other);
                    return target.val() == viewValue;
                };
            },
            required: function (scope, element, attrs) {
                var regex = new RegExp(/^$/);
                return function (modelValue, viewValue) {
                    return !regex.test(viewValue || '');
                };
            },
            regex: function (scope, element, attrs) {
                var regex = new RegExp(attrs.valRegexPattern);
                return function (modelValue, viewValue) {
                    if (!viewValue)
                        return true;
                    return regex.test(viewValue);
                };
            },
            date: function (scope, element, attrs) {
                return function (modelValue, viewValue) {
                    if (!viewValue)
                        return true;
                    if (viewValue.length < 4)
                        return false;
                    var ticks = Date.parse(viewValue);
                    return isNaN(ticks) === false;
                };
            },
            digits: function (scope, element, attrs) {
                return function (modelValue, viewValue) {
                    if (!viewValue)
                        return true;
                    return viewValue.length == 1 && !isNaN(viewValue);
                };
            },
            number: function (scope, element, attrs) {
                return function (modelValue, viewValue) {
                    if (!viewValue)
                        return true;
                    return viewValue.length > 0 && !isNaN(viewValue);
                };
            },
            email: function (scope, element, attrs) {
                var regex = /.+@.+\..+/;
                return function (modelValue, viewValue) {
                    if (!viewValue)
                        return true;
                    return regex.test(viewValue);
                };
            },
            range: function (scope, element, attrs) {
                var min = attrs.valRangeMin;
                var max = attrs.valRangeMax;
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
            length: function (scope, element, attrs) {
                var min = attrs.valLengthMin;
                var max = attrs.valLengthMax;
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
describe("Tuna.Validators", function () {
    var modelValue, viewValue, scope, element, attrs;
    describe("equalto", function () {
        var isValid;
        beforeEach(function () {
            attrs = { valOther: "#target-other" };
            element = angular.element("<input type=\"text\" id=\"target-other\" value=\"666\"></div>");
            angular.element('body').append(element);
            isValid = Tuna.Validators.rules["equalto"](scope, element, attrs);
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
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be valid number", function () {
            viewValue = 666;
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be invalid when not same value", function () {
            viewValue = "not-same-value";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(false);
        });
    });
    describe("required", function () {
        var isValid;
        beforeEach(function () {
            isValid = Tuna.Validators.rules["required"](scope, element, attrs);
        });
        it("should exist", function () {
            expect(isValid).toBeDefined();
        });
        it("should be valid", function () {
            viewValue = "some input";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be invalid when null", function () {
            viewValue = null;
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(false);
        });
        it("should be invalid when undefined", function () {
            viewValue = undefined;
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(false);
        });
        it("should be invalid when empty string", function () {
            viewValue = "";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(false);
        });
        it("should be valid when empty string(s)", function () {
            viewValue = "    ";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
    });
    describe("regex", function () {
        var isValid;
        beforeEach(function () {
            attrs = { valRegexPattern: "^match-this" };
            isValid = Tuna.Validators.rules["regex"](scope, element, attrs);
        });
        it("should exist", function () {
            expect(isValid).toBeDefined();
        });
        it("should be valid", function () {
            viewValue = "match-this";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be invalid when not matching", function () {
            viewValue = "dont-match-value";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(false);
        });
    });
    describe("date", function () {
        var isValid;
        beforeEach(function () {
            isValid = Tuna.Validators.rules["date"](scope, element, attrs);
        });
        it("should exist", function () {
            expect(isValid).toBeDefined();
        });
        it("should be valid 2011-02-20", function () {
            viewValue = "2011-02-20";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be valid 2011-02", function () {
            viewValue = "2011-02";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be valid 2011-02", function () {
            viewValue = "2011";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be valid when 02-20", function () {
            viewValue = "02-20";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be invalid when 02", function () {
            viewValue = "02";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(false);
        });
        it("should be invalid when ABCDEFG", function () {
            viewValue = "ABCDEFG";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(false);
        });
    });
    describe("digits", function () {
        var isValid;
        beforeEach(function () {
            isValid = Tuna.Validators.rules["digits"](scope, element, attrs);
        });
        it("should exist", function () {
            expect(isValid).toBeDefined();
        });
        it("should be valid when 6", function () {
            viewValue = "6";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be invalid when decimals", function () {
            viewValue = "6.6";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(false);
        });
        it("should be invalid", function () {
            viewValue = "dont-match-value";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(false);
        });
    });
    describe("number", function () {
        var isValid;
        beforeEach(function () {
            isValid = Tuna.Validators.rules["number"](scope, element, attrs);
        });
        it("should exist", function () {
            expect(isValid).toBeDefined();
        });
        it("should be valid when 6", function () {
            viewValue = "6";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be valid when decimals", function () {
            viewValue = "6.6";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be invalid", function () {
            viewValue = "dont-match-value";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(false);
        });
    });
    describe("email", function () {
        var isValid;
        beforeEach(function () {
            isValid = Tuna.Validators.rules["email"](scope, element, attrs);
        });
        it("should exist", function () {
            expect(isValid).toBeDefined();
        });
        it("should be valid", function () {
            viewValue = "tuna@world.com";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be valid when pre domains", function () {
            viewValue = "tuna.domain@world.com";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be valid when post domains", function () {
            viewValue = "tuna@world.co.uk";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be valid when domains", function () {
            viewValue = "tuna.domain@world.co.uk";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be valid when ''", function () {
            viewValue = "";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be valid when null", function () {
            viewValue = null;
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be valid when undefined", function () {
            viewValue = undefined;
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be invalid when no @", function () {
            viewValue = "no-snabel-a.com";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(false);
        });
        it("should be invalid when no pre domain", function () {
            viewValue = "@world.com";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(false);
        });
        it("should be invalid when no post domain", function () {
            viewValue = "tuna@";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(false);
        });
    });
    describe("range", function () {
        var isValid;
        beforeEach(function () {
            attrs = {};
            attrs.valRangeMin = 0;
            attrs.valRangeMax = 2;
            isValid = Tuna.Validators.rules["range"](scope, element, attrs);
        });
        it("should exist", function () {
            expect(isValid).toBeDefined();
        });
        it("should be valid when ''", function () {
            viewValue = "";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be valid when null", function () {
            viewValue = null;
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be valid when undefined", function () {
            viewValue = undefined;
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be valid when 0", function () {
            viewValue = "0";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be valid when 1", function () {
            viewValue = "1";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be valid when 1.5", function () {
            viewValue = "1.5";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be valid when 2", function () {
            viewValue = "2";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be invalid when 2.00001", function () {
            viewValue = "2.00001";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(false);
        });
        it("should be invalid when isNaN", function () {
            viewValue = "this-is-not-a-number";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(false);
        });
        it("should be invalid when -1", function () {
            viewValue = "-1";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(false);
        });
        it("should be invalid when 4", function () {
            viewValue = "4";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(false);
        });
    });
    describe("length", function () {
        var isValid;
        beforeEach(function () {
            attrs = {};
            attrs.valLengthMin = 0;
            attrs.valLengthMax = 2;
            isValid = Tuna.Validators.rules["length"](scope, element, attrs);
        });
        it("should exist", function () {
            expect(isValid).toBeDefined();
        });
        it("should be valid when ''", function () {
            viewValue = "";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be valid when null", function () {
            viewValue = null;
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be valid when undefined", function () {
            viewValue = undefined;
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be valid when a", function () {
            viewValue = "a";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be valid when ab", function () {
            viewValue = "ab";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(true);
        });
        it("should be invalid when abc", function () {
            viewValue = "abc";
            var result = isValid(modelValue, viewValue);
            expect(result).toBe(false);
        });
    });
});
