module tuna.jsval {
	angular.module(`tuna.jsval`, [])
		.directive(options.name, [`$parse`, function validation($parse: ng.IParseService) {
			const REGEX_VAL_ATTRIBUTE = new RegExp(`^(data-)?${options.name}-([^-]+)$`);

			return {
				restrict: `A`,
				require: [`^^form`, `?ngModel`],
				link: function (scope: ng.IScope, element: JQLite, attrs: ng.IAttributes, controllers: [ng.IFormController, ng.INgModelController]) {
					const ngModel = controllers[1];
					const validator = setup(element);
					if (!validator) return;
					setupWatch();

					function setup(element: JQLite) {
						var enabled = ngModel !== null && $parse(attrs.val)(scope) === true;
						if (!enabled) return null;

						const result: IKeyValue<IValidator> = {};
						const attributes = element[0].attributes;

						for (var prop in attributes) {
							const item = attributes[prop];
							const m = REGEX_VAL_ATTRIBUTE.exec(item.name);
							if (!m) continue;

							const name = m[m.length - 1].toLowerCase();
							const rule = rules[name];

							if (!rule) {
								console.error(`Rule "${name}" is missing. To add it: tuna.jsval.rules["${name}"] = { text: "", valid: (validator) => boolean} };`);
								continue;
							}

							const validator = result[name] = {
								text: rule.text,
								attrs: attrs,
								element: element
							};

							const isValid = rule.valid(validator);
							ngModel.$validators[name] = (modelValue, viewValue) => {
								if (options.ignore.some(s => element.is(s))) return true;
								const result = isValid(modelValue, viewValue);
								return result;
							}
						}

						return result;
					}

					function setupWatch() {
						if (!options.onError) return;
						scope.$evalAsync(function () {
							scope.$watch(isElementValid, isValid => {
								const validator = getValidator(ngModel.$error);
								if (validator) options.onError(validator, ngModel);
							});
						});
					}

					function isElementValid() {
						return ngModel.$valid === true;
					}

					function getValidator(errors: Object) {
						let result: IValidator;
						for (var name in errors) {
							if (errors[name]) return validator[name];
						}
						return result;
					}
				}
			}
		}]);
}