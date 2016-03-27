angular
	.module('hockeydeck')
	.directive("gamecol", function(){
		return {
			restrict: "E",
			templateUrl: "app/components/gamecol/gameView.html"
		}
	})
	.directive("addgamecol", function($compile, $timeout){
		return  {
			link: function(scope, element, attrs, ctrl){
				element.bind("click", function(){
					angular.element($('#scrollcontent').append($compile('<col title="Games" type="games" pos="' + $('[draggable]').length + '" draggable></col>')(scope))); //Position tracks what spot we are in, appending to end.
					$timeout(UpdateScores,10);
					$('#addColModal').modal('hide');
				});
			}
		};
	});
