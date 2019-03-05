/// <reference types="angular" />
declare module tuna.jsval {
    const options: {
        name: string;
        ignore: string[];
        onError: (ngModel: angular.INgModelController, element: JQLite, text: string) => void;
    };
    function attr(attrs: ng.IAttributes, name: string, value?: any): any;
    function format(text: string, ...args: string[]): string;
    const validators: IValidators;
}
declare module tuna.jsval {
}
declare module tuna.jsval {
    interface IKeyValue<TValue> {
        [key: string]: TValue;
    }
    interface IValidator {
        text: string;
        rule: IValidateDelegate;
        attrs: ng.IAttributes;
        element: JQLite;
    }
    interface IValidators {
        texts: IKeyValue<string>;
        rules: IKeyValue<IValidateDelegate>;
    }
    interface IValidateDelegate {
        (validator: IValidator): (modelValue: any, viewValue: any) => boolean;
    }
}
