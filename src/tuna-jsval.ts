module tuna.jsval {
	export interface IKeyValue<TValue> {
		[key: string]: TValue;
	}

	export interface IValidator {
		text: string;
		rule: IValidateDelegate;
		attrs: ng.IAttributes
		element: JQLite;
	}

	export interface IValidators {
		texts: IKeyValue<string>;
		rules: IKeyValue<IValidateDelegate>;
	}

	export interface IValidateDelegate {
		(validator: IValidator): (modelValue: any, viewValue: any) => boolean;
	}
}