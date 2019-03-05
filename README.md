# README #

MVC C# data annotations for angularjs. Replaces the need for jquery validation framework(s). 

Goals:
- Simple
- Lightwight
- Easily extendable

How to install
--------------
```shell
npm install tuna-jsval --save
npm install git+https://github.com/Baxterboom/tuna-jsval.git --save
```

Usage
--------------
Register angular module "tuna.jsval" to your module
```javascript
	angular.module("your-module", ["tuna.jsval"]);
```

It is possible to configure the attribute name to match against (default for jquery-unobtrusive-validation is "val", that is what MVC will generate)
```javascript
	tuna.jsval.options.name = "val";
```
Elements to ignore when validating. 
```javascript
tuna.jsval.options.ignore = [":disabled"]; 
```

The component has a global variable named tuna.jsval.rules that contains all rules used by tuna-jsval. To access a specific rule you go tuna.jsval.rules["required"], that will yeild you two properties that can be configured. 
- text: containing text for the validator.
- valid: functions that validates element (see example at end of docs).

Existing validations:
- regex: 'Invalid value',
- date: 'Invalid date',
- email: 'Invalid email',
- range: 'Range must be between {0} and {1}',
- length: 'Length must be between {0} and {1}',
- digits: 'Only digits allowed',
- number: 'Only numbers allowed',
- required: 'Required field',
- equalto: '{0} must match {1}'

Change default messages, globally
```javascript
tuna.jsval.rules["required"].text = "override default text";
```
```html
<input type="input" data-val="true" data-val-required />
```

Change default messages, inline
```html
<input type="input" data-val="true" data-val-required="this text will be displayed instead of default text" />
```

Change existing rules 
```javascript
tuna.jsval.rules["required"].valid = function (validator) { 
  return function (modelValue, viewValue) { 
    return viewValue != ""; //true === is valid.
  }
};
```

Add custom rule
```javascript
tuna.jsval.rules["nozero"] = {
  text: "zeros are not allowed!",
  valid: function (validator) {
    var regex = new RegExp(/^[0]$/);
    return function (modelValue, viewValue) {
      return !regex.test(viewValue || '');
    };
  }
}
```
```html
<input type="input" placeholder="no zeros" data-val="true" data-val-nozero />
<input type="input" placeholder="no zeros" data-val="true" data-val-nozero="override nozero text" />

```

Add validate callback
```javascript
tuna.jsval.options.onError = function (validator, ngModel) { 
  console.log(arguments);
  alert(validator.text);
}
```

How do I get set up? ###
--------------
* to try, open index.html in demo page
* to experment, run 0-install.bat then 1-build.bat