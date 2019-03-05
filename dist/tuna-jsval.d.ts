/// <reference types="angular" />
declare module Tuna {
    const Ignore: string[];
    const ValidatorAttrName = "val";
    const ValidatorEvents: IValidatorEvents;
    function getValidatorAttribute(attrs: ng.IAttributes, name: string): any;
    function format(text: string, ...args: string[]): string;
    const Validators: IValidators;
}
declare module Tuna {
}
declare module Tuna {
    interface IKeyValue<TValue> {
        [key: string]: TValue;
    }
    interface IValidator {
        text: string;
        rule: IValidateDelegate;
    }
    interface IValidators {
        texts: IKeyValue<string>;
        rules: IKeyValue<IValidateDelegate>;
    }
    interface IValidatorEvents {
        onElementError: (ngModel: any, element: JQLite, text: string) => void;
    }
    interface IValidateDelegate {
        (validator: IValidator, element: JQLite, attrs: ng.IAttributes): (modelValue: any, viewValue: any) => boolean;
    }
}
