# README #

MVC C# data annotations for angularjs. Replaces the need for jquery validation framework(s). 

Goals:
- Simple
- Lightwight
- Easily expandable

How to install
--------------
```shell
npm install tuna-angular-unobtrusive-validation --save
```

Usage
--------------
The plugin has a global variable named Tuna.Validators, it contains two properties that can be configured. 
- Tuna.Validators.texts: containing texts for validators.
- Tuna.Validators.rules: functions that validates input.

Exising validations:
- regex: 'Invalid value',
- date: 'Invalid date',
- email: 'Invalid email',
- range: 'Range must be between {0} and {1}',
- digits: 'Only digits allowed',
- number: 'Only numbers allowed',
- required: 'Required field',
- equalto: '{0} must match {1}'

Change default messages, globally
```javascript
Tuna.Validators.texts["required"] = "override default custom text";
```
Change default messages, inline
```html
<input type="input" data-val="true" data-val-required="will override default text" />
```
Change existing validation 
```javascript
Tuna.Validators.rules["required"] = function (scope, element, attrs) { 
  return function (modelValue, viewValue) { 
    return viewValue != ""; //true === is valid.
  }
};
```
Add custom validation
```javascript

Tuna.Validators.texts["nozero"] = "zeros are not allowed!";
Tuna.Validators.rules["nozero"] = function (scope, element, attrs) {
  var regex = new RegExp(/^[1-9]+$/);
  return function (modelValue, viewValue) {
    return regex.test(viewValue || '');
  };
};

//add error callback
Tuna.ValidatorEvents.onElementError = function (ngModel, element, text) {
  alert(text);
 }

```
```html
<input type="input" placeholder="no zeros" data-val="true" data-val-nozero />
<input type="input" placeholder="no zeros" data-val="true" data-val-nozero="override nozero text" />

```

How do I get set up? ###
--------------
* to try, open index.html in demo page
* to experment, run 0-install.bat then 1-build.bat