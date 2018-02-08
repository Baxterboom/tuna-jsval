module Tuna {
	angular.module('tuna', [])
		.directive('val', ['$parse', '$compile', function validation($parse, $compile) {
			const REGEX_VAL_ATTRIBUTE = /^(data-)?val-([^-]+)$/;

			return {
				restrict: 'A',
				require: ['^^form', '?ngModel'],
				link: function (scope, element, attrs, controllers) {
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

					function getText(errors) {
						var result = 'Undefined error message';
						for (var name in errors) {
							result = validator.texts[name];
							if (errors[name]) break;
						}
						return result;
					}

					function setupValidators(element): IValidator {
						var enabled = ngModel !== null && $parse(attrs.val)() === true;
						if (!enabled) return null;

						const result: IValidator = { rules: {}, texts: {} };
						const attributes = element[0].attributes;

						for (var prop in attributes) {
							const item = attributes[prop];
							const m = REGEX_VAL_ATTRIBUTE.exec(item.name);
							if (m) {
								const name = m[m.length - 1].toLowerCase();
								const text = item.value || Validators.texts[name];
								const rule = Validators.rules[name];

								if (!rule) {
									console.error('No rule exists for ' + name);
									return null;
								}

								result.texts[name] = text;
								result.rules[name] = rule;

								ngModel.$validators[name] = result.rules[name](scope, element, attrs);
							}
						}

						return result;
					}
				}
			}
		}]);
}