var settings = {}

//Default status for open/closed
settings.closed = {
	'events': true,
	'teams' : true
}

//List of the various events - should always be static
settings.events = [
	{ 'name' : 'HIT',   'desc' : 'Hit', 			  'img' : '', 'selected' : true },
	{ 'name' : 'SHOT',  'desc' : 'Shot', 		      'img' : '', 'selected' : true },
	{ 'name' : 'BLOCK', 'desc' : 'Shot - Block', 	  'img' : '', 'selected' : true },
	{ 'name' : 'MISS',  'desc' : 'Shot - Missed',     'img' : '', 'selected' : true },
	{ 'name' : 'GOAL',  'desc' : 'Goal', 			  'img' : '', 'selected' : true },
	{ 'name' : 'PENL',  'desc' : 'Penalty',           'img' : '', 'selected' : true },
	{ 'name' : 'FAC',   'desc' : 'Faceoff', 		  'img' : '', 'selected' : true },
	{ 'name' : 'GIVE',  'desc' : 'Giveaway', 		  'img' : '', 'selected' : true },
	{ 'name' : 'TAKE',  'desc' : 'Takeaway',          'img' : '', 'selected' : true },
	{ 'name' : 'CHL',   'desc' : 'Challenge',         'img' : '', 'selected' : true },
	{ 'name' : 'PSTR',  'desc' : 'Period Start',      'img' : '', 'selected' : true },
	{ 'name' : 'PEND',  'desc' : 'Period End',        'img' : '', 'selected' : true },
	{ 'name' : 'STOP',  'desc' : 'Stoppage',          'img' : '', 'selected' : true },
	{ 'name' : 'SOC',   'desc' : 'Shootout Complete', 'img' : '', 'selected' : true },
	{ 'name' : 'GEND',  'desc' : 'Game End', 		  'img' : '', 'selected' : true }
];

angular
	.module('hockeydeck')
	.controller('SettingsController', ['$scope', '$window', 'settingsMessageService', 'gameDataService', function($scope, $window, settingsMessageService, gameDataService) {
		$scope.settingsClosed = true;

		$scope.toggleSettings = function (type) {
			$scope.closed[type] = !$scope.closed[type];
		};

		$scope.events = $.extend(true, [], settings.events); //Odd way of saying deep copy to prevent references from being copied. Just setting it will make all events "selected" status share between instances.
		$scope.teams = gameDataService.getActiveTeams();
		$scope.closed = $.extend(true, [], settings.closed);

		//Listen for any new active teams
		settingsMessageService.subscribe('event-updated-active-teams', $scope, function teamsChanged(args) {
			$scope.teams = $.extend(true, [], args.activeTeams);
	    });

		//Watch for new filter on events
		$scope.$watch('events|filter:{selected:true}', function (nv) {
			$scope.allowedEvents = nv.map(function (event) {
		    	return event.name;
		    });

			settingsMessageService.notify('event-new-allowed-events', {
				ident: $scope.controllerIdent,
				allowedEvents: $scope.allowedEvents
			});
		}, true);

		//Watch for new filter on teams
		$scope.$watch('teams|filter:{selected:true}', function (nv) {
			$scope.allowedTeams = nv.map(function (team) {
		    	return team.abbreviation;
		    });

		    settingsMessageService.notify('event-new-allowed-teams', {
				ident: $scope.controllerIdent,
				allowedTeams: $scope.allowedTeams
			});
		}, true);
	}]);
