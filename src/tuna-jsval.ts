module tuna.jsval {
	export interface IKeyValue<TValue> {
		[key: string]: TValue;
	}

	export interface IRule {
		text: string;
		valid(validator: IValidator): (modelValue: any, viewValue: any) => boolean;
	}

	export interface IValidator {
		text: string;
		attrs: ng.IAttributes
		element: JQLite;
	}
}