module Tuna {
	export interface IKeyValue<TValue> {
		[key: string]: TValue;
	}

	export interface IValidator {
		text: string;
		rule: IValidateDelegate;
	}

	export interface IValidators {
		texts: IKeyValue<string>;
		rules: IKeyValue<IValidateDelegate>;
	}

	export interface IValidatorEvents {
		onElementError: (ngModel: any, element: JQLite, text: string) => void;
	}

	export interface IValidateDelegate {
		(validator: IValidator, element: JQLite, attrs: ng.IAttributes): (modelValue: any, viewValue: any) => boolean;
	}
}