angular
	.module('hockeydeck')
	.controller("StandingsController", ['$scope', '$window', 'SettingsMessageService', function($scope, $window, SettingsMessageService) {
		$scope.colSort = ['Conference', 'Division', '-PTS']; //Default sort is by division (conf first to keep logical)
		$scope.colGroup = 'Division';

		//Watch for new plays
		$scope.$watch(
			function () {
				return $window.Global.Standings;
			}, function(n,o){
				$scope.standings = n;
				console.log($scope.standings);
			}
		);	
	}]);
