angular
	.module('hockeydeck')
	.directive("standingscol", function(){
		return {
			restrict: "E",
			templateUrl: "app/components/standingscol/standingsView.html",
			link: function(scope, element, attrs, parent){
				//Copy over all attributes that aren't jQuery/Angular.
				console.log('New StandingsCol', attrs);
				for (x in attrs) {
					if (x.indexOf('$')) {
						scope[x] = attrs[x];
					}
				}
			}
		}
	})
	.directive("addstandingscol", function($compile, $timeout){
		return  {
			scope: {},
			link: function(scope, element, attrs, ctrl){
				element.bind("click", function(){
					angular.element($('#scrollcontent').append($compile('<col title="Standings" type="standings" pos="' + $('[draggable]').length + '" draggable></col>')(scope))); //Position tracks what spot we are in, appending to end.
					$('#addColModal').modal('hide');
				});
			}
		};
	});
