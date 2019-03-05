/// <reference types="angular" />
declare module tuna.jsval {
    const options: {
        name: string;
        ignore: string[];
        onError: (validator: IValidator, ngModel: angular.INgModelController) => void;
    };
    function attr(attrs: ng.IAttributes, name: string, value?: any): any;
    function format(text: string, ...args: string[]): string;
    const rules: IKeyValue<IRule>;
}
declare module tuna.jsval {
}
declare module tuna.jsval {
    interface IKeyValue<TValue> {
        [key: string]: TValue;
    }
    interface IRule {
        text: string;
        valid(validator: IValidator): (modelValue: any, viewValue: any) => boolean;
    }
    interface IValidator {
        text: string;
        attrs: ng.IAttributes;
        element: JQLite;
    }
}
