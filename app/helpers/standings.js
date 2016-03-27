//File to contain all methods related to fetching standings
//Make this a service at some point?
//Assumes Global has already been initialized.

function UpdateStandings() {
	$.get("standings.json?"+moment().unix(), function( data ) {
		console.log("Updating Standings");
		Global.Standings = data;
	}, "json" );
}
