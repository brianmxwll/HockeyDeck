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
	}])
	.directive("viewthreadcomments", ['$compile', 'SettingsMessageService', function($compile, SettingsMessageService){
		return  {
			link: function(scope, element, attrs, ctrl){
				//Setup our element.
				var thread = JSON.parse(attrs['thread']);
				
				element.bind("click", function(){
					SettingsMessageService.notify('event-view-thread-detail', {
						ident: scope.controllerIdent,
						thread: thread
					});
				});
			}
		};
	}])
	.directive("commentscol", ['$compile', 'SettingsMessageService', function($compile, SettingsMessageService){
		return {
			restrict: "E",
			templateUrl: "app/components/redditcol/redditCommentsView.html",
			link: function(scope, element, attrs, parent){
				//Copy over all attributes that aren't jQuery/Angular.
				console.log('New RedditCommentsCol', attrs);
				for (x in attrs) {
					if (x.indexOf('$')) {
						scope[x] = attrs[x];
					}
				}

				//Manually convert from string.
				scope.thread = JSON.parse(scope['thread']); //Arg passed from prev view

				//Get the thread posts now
			}
		}
	}]);
