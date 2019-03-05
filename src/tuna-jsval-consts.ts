module tuna.jsval {
	export const options = {
		name: `val`,
		ignore: [`:disabled`],
		onError: (validator: IValidator, ngModel: ng.INgModelController) => { }
	}

	export function attr(attrs: ng.IAttributes, name: string, value?: any) {
		const n = options.name + name;
		return value ? attrs[n] = value : attrs[n];
	}

	export function format(text: string, ...args: string[]) {
		return (text || "").replace(/{(\d+)}/g, (match, number) => args[number] ? args[number] : match);
	}

	export const rules: IKeyValue<IRule> = {
		equalto: {
			text: `must match {0}`,
			valid: (validator) => {
				var other = attr(validator.attrs, "Other");
				validator.text = format(validator.text, other);
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					var target = angular.element(other);
					return target.val() == viewValue;
				}
			}
		},
		required: {
			text: `Required field`,
			valid: (validator) => {
				var regex = new RegExp(/^$/);
				return function (modelValue, viewValue) {
					return !regex.test(viewValue || '');
				}
			}
		},
		regex: {
			text: `Invalid value`,
			valid: (validator) => {
				var pattern = attr(validator.attrs, "RegexPattern");
				var regex = new RegExp(pattern);
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					return regex.test(viewValue);
				}
			}
		},
		date: {
			text: `Invalid date`,
			valid: (validator) => {
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					if (viewValue.length < 4) return false;
					var ticks = Date.parse(viewValue);
					return isNaN(ticks) === false;
				}
			}
		},
		digits: {
			text: `Only digits allowed`,
			valid: (validator) => {
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					return viewValue.length == 1 && !isNaN(viewValue);
				}
			}
		},
		number: {
			text: `Only numbers allowed`,
			valid: (validator) => {
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					return viewValue.length > 0 && !isNaN(viewValue);
				}
			}
		},
		email: {
			text: `Invalid email`,
			valid: (validator) => {
				var email = attr(validator.attrs, "Email");
				var regex = attr ? new RegExp(email) : /.+@.+\..+/;
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					return regex.test(viewValue);
				}
			}
		},
		range: {
			text: `Range must be between {0} and {1}`,
			valid: (validator) => {
				var min = attr(validator.attrs, "RangeMin");
				var max = attr(validator.attrs, "RangeMax");
				validator.text = format(validator.text, min, max);
				return function (modelValue, viewValue) {
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
			text: `Length must be between {0} and {1}`,
			valid: (validator) => {
				var min = attr(validator.attrs, "LengthMin");
				var max = attr(validator.attrs, "LengthMax");
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