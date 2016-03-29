//Temp for now, define the types of events and add to scope for later consumption

angular
	.module('hockeydeck')
	.controller("RedditListingController", ['$scope', '$window', 'settingsMessageService', 'redditContentService', function($scope, $window, settingsMessageService, redditContentService) {
		console.log("New RedditListingController");
		
		redditContentService.getGDTs().then(function(response){
			console.log("RedditController: got game threads:", response);
			$scope.gameThreads = response;
			$scope.$digest(); //Force a digest since we are 10 layers deep in ajax calls by now.
		}, function (error) {
			console.error("RedditController: failed to get game threads.", error);
		});

		$scope.cleanGDTTitle = function(title) {
			//Ex input: Game Thread: Pittsburgh Penguins (40-25-8) at Detroit Red Wings (37-26-11) - 26 Mar 2016 - 02:00PM EDT
			//Ex output: Pittsburgh Penguins (40-25-8) at Detroit Red Wings (37-26-11)
			title = title.split(' - ')[0] //Cut everything after the teams
			title = title.split(': ')[1] //Cut everything before the teams
			return title;
		}
	}])
	.controller("RedditThreadController", ['$scope', '$window', 'settingsMessageService', 'redditContentService', function($scope, $window, settingsMessageService, redditContentService) {
		console.log("New RedditThreadController");
		
		//After we are initialized, go fetch some of the core data.
		$scope.$watch("assignments", function (value) {
			console.log("INIT FOR THREAD - RUNONCE");
		    redditContentService.getGDTComments($scope.thread.subreddit, $scope.thread.id).then(function(response){
				console.log("RedditController: got game thread comments:", response);
				$scope.thread = response[1].data.children[0].data;
				$scope.comments = response[1].data.children;

				console.log('RedditThreadController: Loaded thread comments: ', $scope.comments);
				$scope.$digest(); //Force a digest since we are 10 layers deep in ajax calls by now.
			}, function (error) {
				console.error("RedditController: failed to get game thread comments.", error);
			});
		});

		$scope.decodeContent = function(encodedStr) {
			return $("<div/>").html(encodedStr).text();
		};
	}]);
