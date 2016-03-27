angular
	.module('hockeydeck')
	.directive("colsettings", function(){
		return {
			restrict: "E",
			templateUrl: "app/components/shared/settingsView.html",
			link: function(scope, element, attrs, parent){
				//Copy over all attributes that aren't jQuery/Angular.
				for (x in attrs) {
					if (x.indexOf('$')) {
						scope[x] = attrs[x];
					}
				}
			}
		}
	})
	.directive("opencolsettings", function($compile, $timeout){
		return  {
			link: function(scope, element, attrs, ctrl){
				element.bind("click", function(){
					//Can't CSS animate due to limitations: https://goo.gl/tvCF8N
					var parent = $(element).closest('.col-titlebar'); //Find shared parent
					var settings = $('.settings-container', parent); //Get the settings

					if (settings.is(':visible')) {
						settings.slideUp(300);
					}
					else {
						settings.slideDown(300);
					}
				});
			}
		};
	});
