var Subsumer = require('subsumer');
var ko = require('knockout');
	
module.exports = function(){

	var kernel = new Subsumer();
	var registeredModules = [];

	var registerService = function(service) {
		if (!!service.singleton) {
			kernel.bind(service.name).to(service.service);
		}
		else {
			kernel.bind(service.name).to(service.service).asSingleton();
		}
	};

	var registerServices = function(services) {
		for (var index in services) {
			if (services.hasOwnProperty(index)) {
				registerService(services[index]);
			}
		}
	};

	var registerModule = function(module) {
		kernel.bind(module.name).to(module.module);
		registeredModules.push(module);
	};

	var registerModules = function(modules) {
		for (var index in modules) {
			if (modules.hasOwnProperty(index)) {
				var module = modules[index];
				kernel.bind(module.name).to(module.module);
			}
		}
		registeredModules = registeredModules.concat(modules);
	};

	var resolveAndBindModules = function() {
		for (var index in registeredModules) {
			if (registeredModules.hasOwnProperty(index)) {
				var module = registeredModules[index];
				var viewModelInstance = kernel.resolve(module.name);
				var templateId = module.template ? module.template : module.name;
				ko.applyBindings(viewModelInstance, document.getElementById(templateId));
				if (viewModelInstance.init) {
					viewModelInstance.init();
				}
			}
		}
	};

	/* Bind up knockout, so modules (and services) can require it */
	kernel.bind('knockout').to(ko);

	return {
		registerServices: registerServices,
		registerModules: registerModules,
		resolveAndBindModules: resolveAndBindModules,
		container: kernel
	};

};