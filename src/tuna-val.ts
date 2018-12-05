declare var angular: any;

module Tuna.Validator {
	export interface IKeyValue<TValue> {
		[key: string]: TValue;
	}

	export interface IValidators {
		[name: string]: IValidator;
	}

	export interface IValidatorInfo {
		attr: Attr;
		name: string;
		element: HTMLElement;
		validator: IValidator;
	}

	export interface IValidator {
		text: string;
		rule: IValidateDelegate;
	}

	export interface IValidatorEvents {
		onElementError: (ngModel: any, element: any, text: string) => void;
	}

	export interface IValidateDelegate {
		(scope: ng.IScope, element: JQLite, attrs: ng.IAttributes): (viewValue: any, modelValue: any) => boolean;
	}
}