//File to contain all methods related to fetching rosters & the players on them.
//Make this a service at some point?
//Assumes Global has already been initialized.

function UpdateRosters() {
	$.get("rosters.json?"+moment().unix(), function( data ) {
		console.log("Updating Rosters");
		Global.Rosters = data;
	}, "json" );
}

function GetPlayer(team, name, num) {
	searchName = name.toLowerCase();

	if (team in Global.Rosters) {
		var teamRoster = Global.Rosters[team];

		var lists = [teamRoster.forwards, teamRoster.defensemen, teamRoster.goalie];
		for (var i = 0; i < lists.length; i++) {
			for (var k = 0; k < lists[i].length; k++) {
				var player = lists[i][k];
				var thisName = player.name.toLowerCase();
				if (player.number == num && thisName.indexOf(searchName) > -1) {
					return player;
				}
			}
		}
	}
	else {
		console.log("Roster not found:", team, name, num);
	}
}

function GetPlayerStatLines(nhlId, callback) {
	var url = "https://statsapi.web.nhl.com/api/v1/people/" + nhlId + "?expand=person.stats&stats=yearByYear,careerRegularSeason,yearByYearPlayoffs,careerPlayoffs"
	$.get(url, function( data ) {
		callback(data);
	}, "json" );
}
