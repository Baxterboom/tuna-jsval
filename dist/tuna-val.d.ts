/// <reference types="angular" />
declare module Tuna.Validator {
    const AttrName = "val";
    const Events: IValidatorEvents;
    const Validators: IValidators;
}
declare module Tuna.Validator {
}
declare var angular: any;
declare module Tuna.Validator {
    interface IKeyValue<TValue> {
        [key: string]: TValue;
    }
    interface IValidators {
        [name: string]: IValidator;
    }
    interface IValidatorInfo {
        attr: Attr;
        name: string;
        element: HTMLElement;
        validator: IValidator;
    }
    interface IValidator {
        text: string;
        rule: IValidateDelegate;
    }
    interface IValidatorEvents {
        onElementError: (ngModel: any, element: any, text: string) => void;
    }
    interface IValidateDelegate {
        (scope: ng.IScope, element: JQLite, attrs: ng.IAttributes): (viewValue: any, modelValue: any) => boolean;
    }
}
