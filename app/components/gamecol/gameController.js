angular
	.module('hockeydeck')
	.controller('GameController', ['$scope', '$window', 'settingsMessageService', 'gameDataService', function($scope, $window, settingsMessageService, gameDataService) {
		$scope.ident = Math.random().toString(36).substring(6); //Unique identifier for this controller instance. Will be shared with child instances as needed.
		$scope.func = gameFunctions;
		$scope.FilterGames = FilterGames;
		$scope.allowedTeams = [];
		$scope.view = "main";

		//Pull the games from the gameDataService - probably already pulled them down from the server.
		$scope.games = gameDataService.getGames();

		//Listen for any new game updates.
		settingsMessageService.subscribe('event-updated-games', $scope, function gamesChanged(args) {
			$scope.games = args.games;
			$scope.$digest();
	    });

		//Listen for any new game filters.
		settingsMessageService.subscribe('event-new-allowed-teams', $scope, function teamsChanged(args) {
			if ($scope.ident == args.ident) { //Is the source of this event the settings instance we care about?
				$scope.allowedTeams = args.allowedTeams;
			}
	    });
	}]);
