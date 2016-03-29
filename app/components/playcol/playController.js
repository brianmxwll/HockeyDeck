//Temp for now, define the types of events and add to scope for later consumption

angular
	.module('hockeydeck')
	.controller("PlayController", ['$scope', '$window', 'settingsMessageService', 'playDataService', function($scope, $window, settingsMessageService, playDataService) {
		$scope.pages = 1;
		$scope.allowedEvents = [];
		$scope.allowedTeams = [];
		$scope.FilterPlays = FilterPlays;
		$scope.plays = playDataService.getPlays();
		
		//SOMEHOW USE $scope.firstRun to determine if this should animate or not.

		//We must subscribe to any events we may care about. So far, this means events coming from the settings page.
		settingsMessageService.subscribe('event-updated-plays', $scope, function eventsChanged(args) {
			console.log($scope.controllerIdent, 'Updated plays', args);
			$scope.plays = args.plays;
			$scope.$digest();
	    });

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
