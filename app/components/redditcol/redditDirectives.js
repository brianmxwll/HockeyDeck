angular
	.module('hockeydeck')
	.directive("redditcol", function(){
		return {
			restrict: "E",
			templateUrl: "app/components/redditcol/redditListingView.html",
			link: function(scope, element, attrs, parent){
				//Copy over all attributes that aren't jQuery/Angular.
				console.log('New RedditCol', attrs);
				for (x in attrs) {
					if (x.indexOf('$')) {
						scope[x] = attrs[x];
					}
				}

			}
		}
	})
	.directive("addredditcol", ['$compile', 'SettingsMessageService', function($compile, SettingsMessageService){
		return  {
			scope: {},
			link: function(scope, element, attrs, ctrl){
				element.bind("click", function(){
					angular.element($('#scrollcontent').append($compile('<col title="Reddit TBD" type="reddit" pos="' + $('[draggable]').length + '" draggable></col>')(scope))); //Position tracks what spot we are in, appending to end.
					$('#addColModal').modal('hide');
				});
			}
		};
	}]);
