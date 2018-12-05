module Tuna.Validator {
	angular.module('tuna', [])
		.directive(AttrName, ['$parse', '$compile', function validation($parse, $compile) {
			const REGEX_VAL_ATTRIBUTE = new RegExp(`^(data-)?${AttrName}-([^-]+)$`);

			return <ng.IDirective>{
				restrict: 'A',
				require: ['^^form', '?ngModel'],
				link: function (scope, element, attrs, controllers: [ng.IFormController, ng.INgModelController]) {
					// const ngForm = controllers[0];
					const ngModel = controllers[1];
					const validators = setupValidators(element[0]);
					if (!validators) return;

					scope.$evalAsync(() => {
						scope.$watch(() => ngModel.$valid === true, (_isValid) => {
							const text = resolveErrorText(ngModel.$error);
							Events.onElementError(ngModel, element, text);
						});
					});

					function resolveErrorText(errors) {
						let result;
						for (let name in errors) {
							if (errors[name]) {
								result = setupText(validators[name]);
								break;
							}
						}
						return result || `Undefined error message for ${name} validator`;
					}

					function isEnabled() {
						return ngModel !== null && $parse(attrs.val)() === true;
					}

					function setupValidators(element: HTMLElement) {
						if (!isEnabled()) return null;

						const result: IKeyValue<IValidatorInfo> = {};
						const attributes = element.attributes;

						for (let prop in attributes) {
							const attr = attributes[prop];
							const m = REGEX_VAL_ATTRIBUTE.exec(attr.name);
							if (!m) continue;

							const name = m[m.length - 1].toLowerCase();
							const validator = setupValidator(name);
							if (validator) result[name] = { attr, name, element, validator };
						}

						return result;
					}

					function setupValidator(name: string) {
						const validator = Validators[name] || console.warn('No rule exists for ' + name);
						if (validator) ngModel.$validators[name] = validator.rule(scope, element, attrs);
						return validator;
					}

					function setupText(validatorInfo: IValidatorInfo) {
						if (!validatorInfo) return ``;

						const attr = validatorInfo.attr;
						const attributes = validatorInfo.element.attributes;
						const matchRegex = /{(\w+)}/g

						let text = attr.value || validatorInfo.validator.text || "";
						return text.replace(matchRegex, (_all, match) => {
							const a = attributes[`${attr.name}-${match}`];
							return a ? a.value : match;
						});
					}
				}
			}
		}]);
}