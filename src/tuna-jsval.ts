module Tuna {
	export interface IKeyValue<TValue> {
		[key: string]: TValue;
	}

	export interface IValidator {
		texts: IKeyValue<string>;
		rules: IKeyValue<IValidateDelegate>;
	}

	export interface IValidatorEvents {
		onElementError: (ngModel: any, element: JQLite, text: string) => void;
	}

	export interface IValidateDelegate {
		(scope: ng.IScope, element: JQLite, attrs: ng.IAttributes): (modelValue: any, viewValue: any) => boolean;
	}
}