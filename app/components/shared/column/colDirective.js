angular
	.module('hockeydeck')
	.directive("col", function(){
		return {
			restrict: "E",
			//scope: {},
			templateUrl: "app/components/shared/column/colView.html",
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