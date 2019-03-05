﻿module Tuna {
	export const ValidatorAttrName = "val";

	export const ValidatorEvents: IValidatorEvents = {
		onElementError: (ngModel, element, text: string) => { }
	}

	export function getValidatorAttribute(attrs: ng.IAttributes, name: string) {
		return attrs[Tuna.ValidatorAttrName + name];
	}

	export const Validators: IValidator = {
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
				var attr = getValidatorAttribute(attrs, "Other");
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					var target = angular.element(attr);
					return target.val() == viewValue;
				}
			},
			required: function (scope, element, attrs) {
				var regex = new RegExp(/^$/);
				return function (modelValue, viewValue) {
					return !regex.test(viewValue || '');
				}
			},
			regex: function (scope, element, attrs) {
				var attr = getValidatorAttribute(attrs, "RegexPattern");
				var regex = new RegExp(attr);
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					return regex.test(viewValue);
				}
			},
			date: function (scope, element, attrs) {
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					if (viewValue.length < 4) return false;
					var ticks = Date.parse(viewValue);
					return isNaN(ticks) === false;
				}
			},
			digits: function (scope, element, attrs) {
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					return viewValue.length == 1 && !isNaN(viewValue);
				}
			},
			number: function (scope, element, attrs) {
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					return viewValue.length > 0 && !isNaN(viewValue);
				}
			},
			email: function (scope, element, attrs) {
				var attr = getValidatorAttribute(attrs, "Email");
				var regex = attr ? new RegExp(attr) : /.+@.+\..+/;
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					return regex.test(viewValue);
				}
			},
			range: function (scope, element, attrs) {
				var min = getValidatorAttribute(attrs, "RangeMin");
				var max = getValidatorAttribute(attrs, "RangeMax");
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					if (isNaN(viewValue)) return false;
					var value = parseFloat(viewValue);
					var minResult = min != null ? value >= min : true;
					var maxResult = max != null ? value <= max : true;
					return minResult && maxResult;
				};
			},
			length: function (scope, element, attrs) {
				var min = getValidatorAttribute(attrs, "LengthMin");
				var max = getValidatorAttribute(attrs, "LengthMax");
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					var value = (viewValue || '').length;
					var minResult = min ? value >= min : true;
					var maxResult = max ? value <= max : true;
					return minResult && maxResult;
				};
			}
		}
	};
}