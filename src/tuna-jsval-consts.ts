module tuna.jsval {
	export const options = {
		name: "val",
		ignore: [":hidden"],
		onError: (ngModel: ng.INgModelController, element: JQLite, text: string) => { }
	}

	export function attr(attrs: ng.IAttributes, name: string, value?: any) {
		const n = options.name + name;
		return value ? attrs[n] = value : attrs[n];
	}

	export function format(text: string, ...args: string[]) {
		return (text || "").replace(/{(\d+)}/g, (match, number) => args[number] ? args[number] : match);
	}

	export const validators: IValidators = {
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
			equalto: (validator) => {
				var other = attr(validator.attrs, "Other");
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					var target = angular.element(other);
					return target.val() == viewValue;
				}
			},
			required: (validator) => {
				var regex = new RegExp(/^$/);
				return function (modelValue, viewValue) {
					return !regex.test(viewValue || '');
				}
			},
			regex: (validator) => {
				var pattern = attr(validator.attrs, "RegexPattern");
				var regex = new RegExp(pattern);
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					return regex.test(viewValue);
				}
			},
			date: (validator) => {
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					if (viewValue.length < 4) return false;
					var ticks = Date.parse(viewValue);
					return isNaN(ticks) === false;
				}
			},
			digits: (validator) => {
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					return viewValue.length == 1 && !isNaN(viewValue);
				}
			},
			number: (validator) => {
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					return viewValue.length > 0 && !isNaN(viewValue);
				}
			},
			email: (validator) => {
				var email = attr(validator.attrs, "Email");
				var regex = attr ? new RegExp(email) : /.+@.+\..+/;
				return function (modelValue, viewValue) {
					if (!viewValue) return true;
					return regex.test(viewValue);
				}
			},
			range: (validator) => {
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
			},
			length: (validator) => {
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