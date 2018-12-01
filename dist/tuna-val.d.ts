/// <reference types="angular" />
declare module Tuna {
    const ValidatorAttrName = "val";
    const ValidatorEvents: IValidatorEvents;
    function getValidatorAttr(attrs: ng.IAttributes, name: string): any;
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
        (scope: ng.IScope, element: JQLite, attrs: ng.IAttributes): (viewValue: any, modelValue: any) => boolean;
    }
}
