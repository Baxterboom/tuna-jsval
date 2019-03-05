module tuna.jsval {
	angular.module('tuna.jsval', [])
		.directive(options.name, ['$parse', '$compile', function validation($parse: ng.IParseService, $compile: ng.ICompileService) {
			const REGEX_VAL_ATTRIBUTE = new RegExp(`^(data-)?${options.name}-([^-]+)$`);

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
								options.onError(ngModel, element, text);
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
							if (!m) continue;
							const name = m[m.length - 1].toLowerCase();
							const rule = validators.rules[name];

							if (!rule) {
								console.error('No rule exists for ' + name);
								continue;
							}
							const text = item.value || validators.texts[name];
							const validator: IValidator = { rule, text, attrs, element };

							result.rules[name] = validator.rule;
							result.texts[name] = validator.text;

							const isValid = validator.rule(validator);
							ngModel.$validators[name] = (modelValue, viewValue) => {
								if (options.ignore.some(s => element.is(s))) return true;
								return isValid(modelValue, viewValue);
							}
						}

						return result;
					}
				}
			}
		}]);
}