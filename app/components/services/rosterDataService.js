angular
	.module('hockeydeck')
    .service('rosterDataService', ['settingsMessageService', function(settingsMessageService) {
    	console.log("Roster Data Service Service init");
        var self = this; //Meaning of "this" changes over time - need a consistent reference to the service

        this.Rosters = [];
        
        //"Public" methods
        this.getRosters = function() {
            return self.Rosters;
        }
        
        this.UpdateRosters = function() {
            $.get("rosters.json?"+moment().unix(), function( data ) {
                console.log("Updating Rosters");
                self.Rosters = data;
            }, "json" );
        }

        this.GetPlayer = function(team, name, num) {
            searchName = name.toLowerCase();

            if (team in self.Rosters) {
                var teamRoster = self.Rosters[team];

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

        this.GetPlayerStatLines = function(nhlId, callback) {
            var url = "https://statsapi.web.nhl.com/api/v1/people/" + nhlId + "?expand=person.stats&stats=yearByYear,careerRegularSeason,yearByYearPlayoffs,careerPlayoffs"
            $.get(url, function( data ) {
                callback(data);
            }, "json" );
        }
    }]);

