angular
	.module('hockeydeck')
	.controller('GameController', ['$scope', '$window', 'SettingsMessageService', function($scope, $window, SettingsMessageService) {
		$scope.ident = Math.random().toString(36).substring(6); //Unique identifier for this controller instance. Will be shared with child instances as needed.
		$scope.func = gameFunctions;
		$scope.FilterGames = FilterGames;
		$scope.allowedTeams = [];
		$scope.view = "main";

		setTimeout(function() {
			//$scope.view = "side";
			console.log($scope.view);
			$scope.$digest();
		}, 2000)
		//Watch for new plays
		$scope.$watch(
			function () {
				return $window.Global.Games;
			}, function(n,o){
				$scope.games = n;
			}
		);

		//Listen for any new game filters.
		SettingsMessageService.subscribe('event-new-allowed-teams', $scope, function teamsChanged(args) {
			if ($scope.ident == args.ident) { //Is the source of this event the settings instance we care about?
				$scope.allowedTeams = args.allowedTeams;
			}
	    });
	}]);
