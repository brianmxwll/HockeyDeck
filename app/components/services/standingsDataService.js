angular
	.module('hockeydeck')
    .service('standingsDataService', ['settingsMessageService', function(settingsMessageService) {
    	console.log("Standings Data Service Service init");
        var self = this; //Meaning of "this" changes over time - need a consistent reference to the service

        this.Standings = [];
        
        //"Public" methods
        this.getStandings = function() {
            return self.Standings;
        }
        
        this.UpdateStandings = function() {
            $.get("standings.json?"+moment().unix(), function( data ) {
                console.log("Updating Standings");
                self.Standings = data;

                //Notify everyone that we have new teams.
                settingsMessageService.notify('event-updated-standings', {
                    ident: 'global',
                    standings: self.Standings
                });

            }, "json" );
        }
    }]);

