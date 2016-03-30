angular
	.module('hockeydeck')
	.controller("StandingsController", ['$scope', '$window', 'settingsMessageService', 'standingsDataService', function($scope, $window, settingsMessageService, standingsDataService) {
		$scope.colSort = ['Conference', 'Division', '-PTS']; //Default sort is by division (conf first to keep logical)
		$scope.colGroup = 'Division';
		$scope.standings = standingsDataService.getStandings(); //In case we already pulled them down.

		//Listen for any new game updates.
		settingsMessageService.subscribe('event-updated-standings', $scope, function(args) {
			$scope.standings = args.standings;
			$scope.$digest();
	    });
	}]);
