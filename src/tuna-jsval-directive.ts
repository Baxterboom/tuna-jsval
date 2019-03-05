module Tuna {
	angular.module('tuna.jsval', [])
		.directive(Tuna.ValidatorAttrName, ['$parse', '$compile', function validation($parse: ng.IParseService, $compile: ng.ICompileService) {
			const REGEX_VAL_ATTRIBUTE = new RegExp(`^(data-)?${Tuna.ValidatorAttrName}-([^-]+)$`);

			return {
				restrict: 'A',
				require: ['^^form', '?ngModel'],
				link: function (scope: ng.IScope, element: JQLite, attrs: ng.IAttributes, controllers: [ng.IFormController, ng.INgModelController]) {
					const ngForm = controllers[0];
					const ngModel = controllers[1];
					const validator = setupValidators(element);

					if (validator) init();

					function init() {
						scope.$evalAsync(function () {
							scope.$watch(isElementValid, function (isValid) {
								var text = getText(ngModel.$error);
								Tuna.ValidatorEvents.onElementError(ngModel, element, text);
							});
						});
					}

					function isFormValid() {
						return ngForm.$valid === true;
					}

					function isElementValid() {
						return ngModel.$valid === true;
					}

					function getText(errors: Object) {
						var result = 'Undefined error message';
						for (var name in errors) {
							result = validator.texts[name];
							if (errors[name]) break;
						}
						return result;
					}

					function setupValidators(element: JQLite): IValidators {
						var enabled = ngModel !== null && $parse(attrs.val)(scope) === true;
						if (!enabled) return null;

						const result: IValidators = { rules: {}, texts: {} };
						const attributes = element[0].attributes;

						for (var prop in attributes) {
							const item = attributes[prop];
							const m = REGEX_VAL_ATTRIBUTE.exec(item.name);
							if (m) {
								const name = m[m.length - 1].toLowerCase();
								const target: IValidator = { rule: Validators.rules[name], text: item.value || Validators.texts[name] };

								//@ts-ignore: dont care about void error
								if (!target.rule) return console.error('No rule exists for ' + name);

								const isValid = target.rule(target, element, attrs);
								result.rules[name] = target.rule;
								result.texts[name] = target.text;

								ngModel.$validators[name] = (modelValue, viewValue) => {
									if (Ignore.some(s => element.is(s))) return true;
									return isValid(modelValue, viewValue);
								}
							}
						}
						return result;
					}
				}
			}
		}]);
}