//Temp for now, define the types of events and add to scope for later consumption

angular
	.module('hockeydeck')
	.controller("RedditListingController", ['$scope', '$window', 'SettingsMessageService', 'redditContentService', function($scope, $window, SettingsMessageService, redditContentService) {
		console.log("New RedditListingController");
		
		redditContentService.getGameThreads().then(function(response){
			console.log("RedditController: got game threads:", response);
			$scope.gameThreads = response;
			$scope.$digest(); //Force a digest since we are 10 layers deep in ajax calls by now.
		}, function (error) {
			console.error("RedditController: failed to get game threads.", error);
		});

		$scope.cleanGDTTitle = function(title) {
			console.log(title);
			//Ex input: Game Thread: Pittsburgh Penguins (40-25-8) at Detroit Red Wings (37-26-11) - 26 Mar 2016 - 02:00PM EDT
			//Ex output: Pittsburgh Penguins (40-25-8) at Detroit Red Wings (37-26-11)
			title = title.split(' - ')[0] //Cut everything after the teams
			title = title.split(': ')[1] //Cut everything before the teams
			return title;
		}
	}])
	.controller("RedditThreadController", ['$scope', '$window', 'SettingsMessageService', 'redditContentService', function($scope, $window, SettingsMessageService, redditContentService) {
		console.log("New RedditThreadController");
		
		redditContentService.getGameThreads().then(function(response){
			console.log("RedditThreadController: got game threads:", response);
			$scope.gameThreads = response;
			$scope.$digest(); //Force a digest since we are 10 layers deep in ajax calls by now.
		}, function (error) {
			console.error("RedditController: failed to get game threads.", error);
		});

		
	}]);
