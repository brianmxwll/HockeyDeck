//Methods in here are likely garbage and need to be truly implemented or at a minimum, saftey checks added.
var Global = {};
Global.Plays = [];
Global.StatLines = [];
Global.Standings = [];


//Get data immediately.
UpdateRosters();
UpdateStandings();

function UpdatePlays() {
	$.get("plays.json?"+moment().unix(), function( data ) {
		console.log("Updating Plays");

		$scope = angular.element('[ng-controller=PlayController]').scope();

		if ($scope != undefined) {
			$scope.firstRun = Global.Plays.length == 0; //Track if we need to animate or not.			
		}
		
		//Iterate through the new list, bottom to top. Track the relative distance from the bottom.
		for (var idx = 1; idx <= data.length; idx++) { //Starting at 0 would be equiv of arr[arr.length] which is out of bounds.
			//Before we check indexes - are we even in bounds?
			if (idx > Global.Plays.length) {
				//We have gone too far meaning the item in the new array should be new. Insert away!
				Global.Plays.splice(0, 0, data[data.length - idx])
			}
			else { //Safely in bounds of both arrays.
				var orgPlay = Global.Plays[Global.Plays.length - idx]; //Contains AngularJs tracking info.
				var newPlay = data[data.length - idx]; //Just play info, no AngularJs tracking info.
				//Check if we have the same play or not.
				if (orgPlay.playid == newPlay.playid) {
					//Same play - same info?
					if (orgPlay.meta.edited != newPlay.meta.edited) {
						//New info, copy new over to old.
						for(var item in newPlay) {
							oldPlay[item] = newPlay[item];
						} 
						Global.Plays[Global.Plays.length - idx] = oldPlay;
					}
					//Else info matches, do nothing.
				}
				else {
					//We don't have the same play, insert the "new play"
					Global.Plays.splice(Global.Plays.length - idx, 0, newPlay);
				}	
			}
		}

		//Force a digest to see changes on page.
		if ($scope != undefined){
			$scope.$digest();
		}
	}, "json" );
	
	setTimeout(UpdatePlays, 15000); //Run again in 15s.
}

//Stupid helper method to get last item in array. Cleaner code.
if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

function CreateTeamFilterModel(team) {
	var model = {}
	model.name = team.name;
	model.abbreviation = team.abbreviation;
	model.selected = true;

	return model;
}

///OAUTH CRAP
var popup;
var response = '#access_token=7211948-GGS9L4WWs6pWojtlqx1FOgCc044&token_type=bearer&state=asjdhflakjshdfljhasdfew&expires_in=3600&scope=edit+identity+read+submit+vote'
function openChildWin() {   
    popup = window.open("/temp/childWin.html", "_blank", "height=400, width=550, status=yes, toolbar=no, menubar=no, location=no,addressbar=no"); 
}

function alertRecepit(val1) {
   alert('VALUE BACK: ' + val1);
   response = val1;
   popup.close();
}

function parseToken(redditResponse) {
	txt = redditResponse.replace('#','').split('&')
	for (var i = 0; i < txt.length; i++) {
		if (txt[i].indexOf('access_token') > -1) {
			return txt[i].split('=')[1];
		}
	}
}

function testConn(key) {
	$.ajax({
        type:"GET",
        beforeSend: function (request)
        {
            request.setRequestHeader("Authorization", 'bearer '+key);
        },
        url: "https://oauth.reddit.com/api/v1/me",
        //data: "json=" + escape(JSON.stringify(createRequestObject)),
        //processData: false,
        success: function(msg) {
            console.log(msg);
        }
    });
}
///END OAUTH CRAP