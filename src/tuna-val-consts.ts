module Tuna.Validator {
	export const AttrName = "val";

	export const Events: IValidatorEvents = {
		onElementError: (ngModel: ng.INgModelController, element: JQLite, text: string) => { }
	}

	export const Validators: IValidators = {
		equalto: {
			text: "Must match {other}",
			rule: function (scope, element, attrs) {
				var attr = getValidatorAttr(attrs, "Other");
				return function (viewValue, modelValue) {
					if (!viewValue) return true;
					var target = angular.element(attr);
					return target.val() == viewValue;
				}
			}
		},
		required: {
			text: "Required field",
			rule: function (scope, element, attrs) {
				return function (viewValue, modelValue) {
					return !/^$/.test(viewValue || '');
				}
			},
		},
		regex: {
			text: "Invalid value",
			rule: function (scope, element, attrs) {
				var attr = getValidatorAttr(attrs, "RegexPattern");
				var regex = new RegExp(attr);
				return function (viewValue, modelValue) {
					if (!viewValue) return true;
					return regex.test(viewValue);
				}
			}
		},
		date: {
			text: "Invalid date",
			rule: function (scope, element, attrs) {
				return function (viewValue, modelValue) {
					if (!viewValue) return true;
					if (viewValue.length < 4) return false;
					var ticks = Date.parse(viewValue);
					return isNaN(ticks) === false;
				}
			}
		},
		digits: {
			text: "Only digits allowed",
			rule: function (scope, element, attrs) {
				return function (viewValue, modelValue) {
					if (viewValue == null) return true;
					return !/\D+/.test(viewValue);
				}
			}
		},
		number: {
			text: "Only numbers allowed",
			rule: function (scope, element, attrs) {
				return function (viewValue, modelValue) {
					if (viewValue == null) return true;
					return viewValue.length == 0 || !isNaN(viewValue);
				}
			}
		},
		email: {
			text: "Invalid email",
			rule: function (scope, element, attrs) {
				var attr = getValidatorAttr(attrs, "Email");
				var regex = attr ? new RegExp(attr) : /.+@.+\..+/;
				return function (viewValue, modelValue) {
					if (!viewValue) return true;
					return regex.test(viewValue);
				}
			}
		},
		range: {
			text: "Range must be between {min} and {max}",
			rule: function (scope, element, attrs) {
				var min = getValidatorAttr(attrs, "RangeMin");
				var max = getValidatorAttr(attrs, "RangeMax");
				return function (viewValue, modelValue) {
					if (!viewValue) return true;
					if (isNaN(viewValue)) return false;
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
					if (!viewValue) return true;
					var value = (viewValue || '').length;
					var minResult = min ? value >= min : true;
					var maxResult = max ? value <= max : true;
					return minResult && maxResult;
				};
			}
		}
	};

	function getValidatorAttr(attrs: ng.IAttributes, name: string) {
		return attrs[AttrName + name];
	}
}