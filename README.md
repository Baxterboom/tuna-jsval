# README #

MVC C# data annotations for angularjs. Replaces the need for jquery validation framework(s) and microsoft unobtrusive script(s). 

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
Tuna.Validator.AttrName = "val";
```
In Tuna.Validator.Validators you will find all the rules used. It is here you add new or change existing rules:
```javascript
Tuna.Validator.Validators = {
  "required": {
    text: "Field is required",
    rule: function (scope, element, attrs) {
			return function (viewValue, modelValue) {
				return viewValue != ""; //return true means its valid
			};
    }
  },
  ...
};
```
Existing validations:
--------------
- regex: 'Invalid value',
- date: 'Invalid date',
- email: 'Invalid email',
- range: 'Range must be between {min} and {max}',
- digits: 'Only digits allowed',
- number: 'Only numbers allowed',
- required: 'Required field',
- equalto: 'Must match {other}',
- length: 'Length should be between {min} and {max}'

Customizations
--------------
Change default messages, globally
```javascript
Tuna.Validator.Validators["required"].text = "override default custom text";
```
Change default messages, inline
```html
<input type="input" data-val="true" data-val-required="will override default text" />
```
Change existing validation 
```javascript
Tuna.Validator.Validators["required"].rule = function (scope, element, attrs) { 
  return function (viewValue, modelValue) { 
    return viewValue != ""; //true === is valid.
  }
};
```
Add custom validation, with message formatting.
```javascript

Tuna.Validator.Validators["nozero"] = {
  text: "zeros are not allowed, {extra}!",
  rule: function (scope, element, attrs) {
    var regex = new RegExp(/^[0]$/);
    return function (viewValue, modelValue) {
      return !regex.test(viewValue || '');
    };
  };
};

//add error callback
Tuna.Validator.Events.onElementError = function (ngModel, element, text) {
  alert(text);
 }

```
```html
<input type="input" placeholder="no zeros" data-val="true" data-val-nozero data-val-nozero-extra="some additional text to the message"/>
<input type="input" placeholder="no zeros" data-val="true" data-val-nozero="overrided nozero text! {zzz}" data-val-nozero-zzz="some additional text to the message"/>

```

How do I get set up? ###
--------------
* to try, open index.html in demo page
* to experment, run 0-install.bat then 1-build.bat
