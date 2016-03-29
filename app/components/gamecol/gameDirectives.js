angular
	.module('hockeydeck')
	.directive("gamecol", function(){
		return {
			restrict: "E",
			templateUrl: "app/components/gamecol/gameView.html"
		}
	})
	.directive("addgamecol", ['$compile', '$timeout', 'gameDataService', function($compile, $timeout, gameDataService){
		return  {
			link: function(scope, element, attrs, ctrl){
				element.bind("click", function(){
					angular.element($('#scrollcontent').append($compile('<col title="Games" type="games" pos="' + $('[draggable]').length + '" draggable></col>')(scope))); //Position tracks what spot we are in, appending to end.
					$('#addColModal').modal('hide');
				});
			}
		};
	}]);
