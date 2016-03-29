angular
	.module('hockeydeck')
    .service('playDataService', ['settingsMessageService', function(settingsMessageService) {
    	console.log("Reddit Play Data Service Service init");
        var self = this; //Meaning of "this" changes over time - need a consistent reference to the service

        this.Plays = [];
        
        //"Public" methods
        this.getPlays = function() {
            return self.Plays;
        }

        this.UpdatePlays = function() {
            $.get("plays.json?"+moment().unix(), function(data) {
                console.log("Updating Plays");

                //Iterate through the new list, bottom to top. Track the relative distance from the bottom.
                for (var idx = 1; idx <= data.length; idx++) { //Starting at 0 would be equiv of arr[arr.length] which is out of bounds.
                    //Before we check indexes - are we even in bounds?
                    if (idx > self.Plays.length) {
                        //We have gone too far meaning the item in the new array should be new. Insert away!
                        self.Plays.splice(0, 0, data[data.length - idx])
                    }
                    else { //Safely in bounds of both arrays.
                        var orgPlay = self.Plays[self.Plays.length - idx]; //Contains AngularJs tracking info.
                        var newPlay = data[data.length - idx]; //Just play info, no AngularJs tracking info.
                        //Check if we have the same play or not.
                        if (orgPlay.playid == newPlay.playid) {
                            //Same play - same info?
                            if (orgPlay.meta.edited != newPlay.meta.edited) {
                                //New info, copy new over to old.
                                for(var item in newPlay) {
                                    oldPlay[item] = newPlay[item];
                                } 
                                self.Plays[self.Plays.length - idx] = oldPlay;
                            }
                            //Else info matches, do nothing.
                        }
                        else {
                            //We don't have the same play, insert the "new play"
                            self.Plays.splice(self.Plays.length - idx, 0, newPlay);
                        }   
                    }
                }

                settingsMessageService.notify('event-updated-plays', {
                    ident: 'global',
                    plays: self.Plays
                });

            }, "json" );
            
            setTimeout(self.UpdatePlays, 15000); //Run again in 15s.
        }        


        //"Private" methods


        //After everything is defined, kick off our first game loop
        self.UpdatePlays();
    }]);

