module Tuna {
	angular.module('tuna', [])
		.directive(Tuna.ValidatorAttrName, ['$parse', '$compile', function validation($parse, $compile) {
			const REGEX_VAL_ATTRIBUTE = new RegExp(`^(data-)?${Tuna.ValidatorAttrName}-([^-]+)$`);

			return <ng.IDirective>{
				restrict: 'A',
				require: ['^^form', '?ngModel'],
				link: function (scope, element, attrs, controllers: [ng.IFormController, ng.INgModelController]) {
					// const ngForm = controllers[0];
					const ngModel = controllers[1];
					const validator = setupValidators(element);
					if (!validator) return;

					scope.$evalAsync(() => {
						scope.$watch(() => ngModel.$valid === true, (_isValid) => {
							const text = resolveErrorText(ngModel.$error);
							Tuna.ValidatorEvents.onElementError(ngModel, element, text);
						});
					});

					function resolveErrorText(errors) {
						let result = 'Undefined error message';
						for (let name in errors) {
							result = validator.texts[name];
							if (errors[name]) break;
						}
						return result;
					}

					function isEnabled() {
						return ngModel !== null && $parse(attrs.val)() === true;
					}

					function setupValidators(element) {
						if (!isEnabled()) return null;

						const result = { texts: {} };
						const attributes = element[0].attributes;

						for (let prop in attributes) {
							const current = attributes[prop];
							const m = REGEX_VAL_ATTRIBUTE.exec(current.name);
							if (m) {
								const name = m[m.length - 1].toLowerCase();
								const text = setupText(current, attributes, Validators.texts[name]);
								const validator = setupValidator(name);
								if (!validator) return null;

								result.texts[name] = text;
								ngModel.$validators[name] = validator(scope, element, attrs);
							}
						}

						return result;
					}

					function setupValidator(name: string) {
						return Validators.rules[name] || console.warn('No rule exists for ' + name);
					}

					function setupText(target: Attr, attributes: NamedNodeMap, defaultText: string) {
						const matchRegex = /{(\w+)}/g
						let text = target.value || defaultText || "";

						return text.replace(matchRegex, (_all, match) => {
							var attr = attributes[`${target.name}-${match}`];
							return attr ? attr.value : match;
						});
					}
				}
			}
		}]);
}