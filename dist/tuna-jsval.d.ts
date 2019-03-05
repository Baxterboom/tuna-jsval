/// <reference types="angular" />
declare module Tuna {
    const ValidatorAttrName = "val";
    const ValidatorEvents: IValidatorEvents;
    function getValidatorAttribute(attrs: ng.IAttributes, name: string): any;
    const Validators: IValidator;
}
declare module Tuna {
}
declare module Tuna {
    interface IKeyValue<TValue> {
        [key: string]: TValue;
    }
    interface IValidator {
        texts: IKeyValue<string>;
        rules: IKeyValue<IValidateDelegate>;
    }
    interface IValidatorEvents {
        onElementError: (ngModel: any, element: JQLite, text: string) => void;
    }
    interface IValidateDelegate {
        (scope: ng.IScope, element: JQLite, attrs: ng.IAttributes): (modelValue: any, viewValue: any) => boolean;
    }
}
