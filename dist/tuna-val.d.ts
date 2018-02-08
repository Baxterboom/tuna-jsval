declare module Tuna {
    const ValidatorEvents: IValidatorEvents;
    const Validators: IValidator;
}
declare module Tuna {
}
declare var angular: any;
declare module Tuna {
    interface IKeyValue<TValue> {
        [key: string]: TValue;
    }
    interface IValidator {
        texts: IKeyValue<string>;
        rules: IKeyValue<IValidateDelegate>;
    }
    interface IValidatorEvents {
        onElementError: (ngModel: any, element: any, text: string) => void;
    }
    interface IValidateDelegate {
        (scope: any, element: any, attrs: any): (modelValue, viewValue) => boolean;
    }
}
