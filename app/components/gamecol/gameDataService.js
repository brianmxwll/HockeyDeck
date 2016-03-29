angular
	.module('hockeydeck')
    .service('gameDataService', ['settingsMessageService', function(settingsMessageService) {
    	console.log("Reddit Game Data Service Service init");
        var self = this; //Meaning of "this" changes over time - need a consistent reference to the service

        this.Games = [];
        this.Teams = [];
        
        //"Public" methods
        this.getGames = function() {
            return self.Games;
        }

        this.getActiveTeams = function() {
            return self.Teams;
        }

        this.UpdateScores = function() {
            $.get("scores.json?"+moment().unix(), function( data ) {
                console.log("Updating Scores");

                //Later update to accept any date.
                self.Games = data.dates[0].games; 

                settingsMessageService.notify('event-updated-games', {
                    ident: 'global',
                    games: self.Games
                });

                //Update what games are being tracked.
                self.UpdateActiveTeams();
            }, "json" );
            
            setTimeout(self.UpdateScores, 15000); //Run again in 15s.
        }

        this.UpdateActiveTeams = function() {
            //We start the list off as undefined to allow for a proper deep copy later on. Odd, but w/e. http://goo.gl/34Cu7W
            if (self.Teams == undefined) {
                self.Teams = []; //Init once ready.
            }

            //Someday should replace this with the active games for the day, not just which ones have reported plays.
            for (var i = 0; i < self.Games.length; i++) {
                if (FindTeam(self.Games[i].teams.home.team.abbreviation) == -1) {
                    self.Teams.push(CreateTeamFilterModel(self.Games[i].teams.home.team));
                }

                if (FindTeam(self.Games[i].teams.away.team.abbreviation) == -1) {
                    self.Teams.push(CreateTeamFilterModel(self.Games[i].teams.away.team));
                }
            }

            //Sort by team name
            self.Teams.sort(function(a, b) { 
                return a.name.localeCompare(b.name);
            });

            //Notify everyone that we have new teams.
            settingsMessageService.notify('event-updated-active-teams', {
                ident: 'global',
                activeTeams: self.Teams
            });
        }


        //"Private" methods
        //This func is garbage - should find a way to more elegantly search. (Quickly)
        function FindTeam(abbreviation) {
            for(var i = 0; i < self.Teams.length; i++) {
                if (self.Teams[i].abbreviation == abbreviation) {
                    return i;
                }
            }

            return -1;
        }

        function CreateTeamFilterModel(team) {
            var model = {}
            model.name = team.name;
            model.abbreviation = team.abbreviation;
            model.selected = true;

            return model;
        }

        //After everything is defined, kick off our first game loop
        self.UpdateScores();
    }]);

