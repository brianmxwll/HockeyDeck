//Temp for now, define the types of events and add to scope for later consumption

angular
	.module('hockeydeck')
	.controller("PlayController", ['$scope', '$window', 'settingsMessageService', function($scope, $window, settingsMessageService) {
		$scope.pages = 1;
		$scope.allowedEvents = [];
		$scope.allowedTeams = [];
		$scope.FilterPlays = FilterPlays;
		
		//Watch for new plays
		$scope.$watch(
			function () {
				return $window.Global.Plays;
			}, function(n,o){
				$scope.plays = n;
			}
		);	

		//We must subscribe to any events we may care about. So far, this means events coming from the settings page.
		settingsMessageService.subscribe('event-new-allowed-events', $scope, function eventsChanged(args) {
			if ($scope.controllerIdent == args.ident) { //Is the source of this event the settings instance we care about?
				console.log($scope.controllerIdent, 'New allowed events', args);
				$scope.allowedEvents = args.allowedEvents;
			}
	    });

		settingsMessageService.subscribe('event-new-allowed-teams', $scope, function teamsChanged(args) {
			if ($scope.controllerIdent == args.ident) { //Is the source of this event the settings instance we care about?
				$scope.allowedTeams = args.allowedTeams;
			}
	    });
	}]);
