# README #

MVC C# data annotations for angularjs. Replaces the need for jquery validation framework(s).

Goals:
- Simple
- Lightwight
- Easily expandable

### Usage ###

If you want to add custom validators, lets say data-val-custom="override My default custom test" you do:

```
#!javascript
Tuna.Validators.texts["custom"] = "My default custom test";
Tuna.Validators.rules["custom"] = function (scope, element, attrs) {
  var regex = new RegExp(/^$/);
  return function (modelValue, viewValue) {
    return !regex.test(viewValue || '');
  };
};

Tuna.ValidatorEvents.onElementError = function (ngModel, element, text) { }

```



### How do I get set up? ###

* to try, open index.html in demo page
* to experment, run 0-install.bat then 1-build.bat