//This controller is designed to handle the actions of the "generic" controller holder - no specific hockey content is stored in this element.
angular
	.module('hockeydeck')
	.controller('ColumnController', ['$scope', '$window', 'SettingsMessageService', function($scope, $window, SettingsMessageService) {
		$scope.controllerIdent = Math.random().toString(36).substring(6); //Unique identifier for this controller instance. Will be shared with child instances as needed.
		console.log('New base controller:', $scope.controllerIdent);
		$scope.returnToMainView = function() {
			$scope.view = "main";
		};
		$scope.view = "main";
		$scope.viewArgs = {};

		SettingsMessageService.subscribe('event-view-player-detail', $scope, function eventsChanged(args) {
			if ($scope.controllerIdent == args.ident) { //Is the source of this event the settings instance we care about?
				console.log($scope.controllerIdent, ' New player detail event', args);
				SetSideView($scope, "player", args);
			}
	    });
	}]);



function SetSideView($scope, type, args) {
	$scope.view = "side";
	$scope.sideType = "player";

	if ($scope.sideType == "player") {
		$scope.sideTitle = "Back to " + $scope.title;
		$scope.playerDetails = args.player;
	}

	$scope.$digest();
}
