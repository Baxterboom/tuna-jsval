module Tuna {
	export const Ignore = [":hidden"];
	export const ValidatorAttrName = "val";
	export const ValidatorEvents: IValidatorEvents = {
		onElementError: (ngModel, element, text: string) => { }
	}

	export function getValidatorAttribute(attrs: ng.IAttributes, name: string) {
		return attrs[Tuna.ValidatorAttrName + name];
	}

	export function format(text: string, ...args: string[]) {
		return (text || "").replace(/{(\d+)}/g, (match, number) => args[number] ? args[number] : match);
	}

	export const Validators: IValidators = {
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
			equalto: (validator, element, attrs) => {
				var attr = getValidatorAttribute(attrs, "Other");
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					var target = angular.element(attr);
					return target.val() == viewValue;
				}
			},
			required: (validator, element, attrs) => {
				var regex = new RegExp(/^$/);
				return function (modelValue, viewValue) {
					return !regex.test(viewValue || '');
				}
			},
			regex: (validator, element, attrs) => {
				var attr = getValidatorAttribute(attrs, "RegexPattern");
				var regex = new RegExp(attr);
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					return regex.test(viewValue);
				}
			},
			date: (validator, element, attrs) => {
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					if (viewValue.length < 4) return false;
					var ticks = Date.parse(viewValue);
					return isNaN(ticks) === false;
				}
			},
			digits: (validator, element, attrs) => {
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					return viewValue.length == 1 && !isNaN(viewValue);
				}
			},
			number: (validator, element, attrs) => {
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					return viewValue.length > 0 && !isNaN(viewValue);
				}
			},
			email: (validator, element, attrs) => {
				var attr = getValidatorAttribute(attrs, "Email");
				var regex = attr ? new RegExp(attr) : /.+@.+\..+/;
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					return regex.test(viewValue);
				}
			},
			range: (validator, element, attrs) => {
				var min = getValidatorAttribute(attrs, "RangeMin");
				var max = getValidatorAttribute(attrs, "RangeMax");
				validator.text = format(validator.text, min, max);
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					if (isNaN(viewValue)) return false;
					var value = parseFloat(viewValue);
					var minResult = min != null ? value >= min : true;
					var maxResult = max != null ? value <= max : true;
					return minResult && maxResult;
				};
			},
			length: (validator, element, attrs) => {
				var min = getValidatorAttribute(attrs, "LengthMin");
				var max = getValidatorAttribute(attrs, "LengthMax");
				validator.text = format(validator.text, min, max);
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