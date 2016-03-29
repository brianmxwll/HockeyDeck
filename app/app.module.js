angular
	.module('hockeydeck', ['ngAnimate', 'angular.filter', 'ngStorage', 'ngSanitize'])
	.config(['$httpProvider', function($httpProvider) { 

		//HACK: Disable all template caches for dev env
	    //initialize get if not there
	    if (!$httpProvider.defaults.headers.get) {
	        $httpProvider.defaults.headers.get = {};    
	    }    

	    // Answer edited to include suggestions from comments
	    // because previous version of code introduced browser-related errors

	    //disable IE ajax request caching
	    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
	    // extra
	    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
	    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
	    //ENDHACK
	}])
	.filter('trustedHtml', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);

var gameFunctions = {};

gameFunctions.CleanBroadcasts = function(arr) {
	if (arr == undefined || arr.length == 0) {
		return "";
	}
	else if (arr.length == 1) {
		return arr[0].name;
	}
	else if (arr.length == 2) {
		return arr[0].name + ', ' + arr[1].name;
	}
}

gameFunctions.CleanTimeZone = function(zulu) {
	var z = moment(zulu);
	return z.format('h:mm A zz');
}

gameFunctions.IsPreGame = function(game) {
	return game.status.detailedState == "Scheduled" || game.status.detailedState == "Pre-Game";
}

function FilterGames(allowedTeams) { //Allowed event statuses
	return function(game) { //Game to check
		var home = allowedTeams.length == 0 || allowedTeams.indexOf(game.teams.home.team.abbreviation) != -1; //Is the home team allowed
		var away = allowedTeams.length == 0 || allowedTeams.indexOf(game.teams.away.team.abbreviation) != -1; //Is the away team allowed
		return home || away; //If either is allowed, show the game.
	}
}

function FilterPlays(allowedEvents, allowedTeams) { //Allowed event statuses
	return function(play) { //Play to check
		var event = allowedEvents.length == 0 || allowedEvents.indexOf(play.event) != -1;

		var team = true;
		//Filter the team depending the type of the event. 
		//If the event is a "neutral" one, check if either team matches.
		if (['GEND', 'PEND', 'PSTR', 'STOP'].indexOf(play.event) != -1) {
			team = allowedTeams.length == 0 || allowedTeams.indexOf(play.homeTeam) != -1 || allowedTeams.indexOf(play.visitorTeam) != -1;
		}
		else { //All other types, just check the team responsiblef for the action
			team = allowedTeams.length == 0 || allowedTeams.indexOf(play.meta.mainLogo) != -1;
		}
		return event && team;
	}
}