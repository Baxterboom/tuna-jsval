declare var angular: any;

module Tuna {
	export interface IKeyValue<TValue> {
		[key: string]: TValue;
	}

	export interface IValidator {
		texts: IKeyValue<string>;
		rules: IKeyValue<IValidateDelegate>;
	}

	export interface IValidatorEvents {
		onElementError: (ngModel: any, element: any, text: string) => void;
	}

	export interface IValidateDelegate {
		(scope, element, attrs): (modelValue, viewValue) => boolean;
	}
}