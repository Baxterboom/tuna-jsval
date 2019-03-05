# README #

MVC C# data annotations for angularjs. Replaces the need for jquery validation framework(s). 

Goals:
- Simple
- Lightwight
- Easily extendable

How to install
--------------
```shell
npm install tuna-angular-unobtrusive-validation --save
```

Usage
--------------
It is possible to configure the attribute name to match against (default for jquery-unobtrusive-validation is "val", that is what MVC will generate): 
```javascript
	tuna.jsval.options.name = "val";
```
Elements to ignore when validating
```javascript
tuna.jsval.options.ignore = [":hidden"];
```

The plugin has a global variable named tuna.jsval.validators, it contains two properties that can be configured. 
- tuna.jsval.validators.texts: containing texts for validators.
- tuna.jsval.validators.rules: functions that validates input.

Existing validations:
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
tuna.jsval.validators.texts["required"] = "override default custom text";
```
Change default messages, inline
```html
<input type="input" data-val="true" data-val-required="will override default text" />
```
Change existing validation 
```javascript
tuna.jsval.validators.rules["required"] = function (scope, element, attrs) { 
  return function (modelValue, viewValue) { 
    return viewValue != ""; //true === is valid.
  }
};
```
Add custom validation
```javascript

tuna.jsval.validators.texts["nozero"] = "zeros are not allowed!";
tuna.jsval.validators.rules["nozero"] = function (scope, element, attrs) {
  var regex = new RegExp(/^[0]$/);
  return function (modelValue, viewValue) {
    return !regex.test(viewValue || '');
  };
};

//add error callback
tuna.jsval.options.onError = function (ngModel, element, text) {
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