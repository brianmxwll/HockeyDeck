angular
	.module('hockeydeck')
	.directive("playcol", function(){
		return {
			restrict: "E",
			templateUrl: "app/components/playcol/playView.html",
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
	.directive("addplayscol", ['$compile', '$timeout', function($compile, $timeout){
		return  {
			scope: {},
			link: function(scope, element, attrs, ctrl){
				element.bind("click", function(){
					angular.element($('#scrollcontent').append($compile('<col title="Plays / Events" type="plays" pos="' + $('[draggable]').length + '" draggable></col>')(scope))); //Position tracks what spot we are in, appending to end.
					$('#addColModal').modal('hide');
				});
			}
		};
	}]);
