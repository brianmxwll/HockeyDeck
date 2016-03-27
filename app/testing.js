//Methods in here are likely garbage and need to be truly implemented or at a minimum, saftey checks added.
var Global = {};
Global.Plays = [];
Global.Games = [];
Global.StatLines = [];
Global.Standings = [];
Global.Teams = undefined;


//Get data immediately.
UpdateRosters();
UpdateStandings();

function UpdateScores() {
	$.get("scores.json?"+moment().unix(), function( data ) {
		console.log("Updating Scores");
		$scope = angular.element('[ng-controller=GameController]').scope();

		//Later update to accept any date.
		Global.Games = data.dates[0].games; 

		//Force a digest to see changes on page.
		if ($scope != undefined) {
			$scope.$digest();
		}

		//Update what games are being tracked.
		UpdateActiveTeams();
	}, "json" );
	
	setTimeout(UpdateScores, 15000); //Run again in 15s.
}

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

function GetTodayDate() {
	return moment().format("YYYY-MM-DD")
}

//Stupid helper method to get last item in array. Cleaner code.
if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

function UpdateActiveTeams() {
	//We start the list off as undefined to allow for a proper deep copy later on. Odd, but w/e. http://goo.gl/34Cu7W
	if (Global.Teams == undefined) {
		Global.Teams = []; //Init once ready.
	}

	//Someday should replace this with the active games for the day, not just which ones have reported plays.
	for (var i = 0; i < Global.Games.length; i++) {
		if (FindTeam(Global.Games[i].teams.home.team.abbreviation) == -1) {
			Global.Teams.push(CreateTeamFilterModel(Global.Games[i].teams.home.team));
		}

		if (FindTeam(Global.Games[i].teams.away.team.abbreviation) == -1) {
			Global.Teams.push(CreateTeamFilterModel(Global.Games[i].teams.away.team));
		}
	}

	//Sort by team name
	Global.Teams.sort(function(a, b) { 
		return a.name.localeCompare(b.name);
	});

	//Force a digest to see changes on page.
	//Technically only need this on the first run - would be nice to track down a more elegant solution if I get the time.
	$scope = angular.element('[ng-controller=SettingsController]').scope();
	if ($scope != undefined) {
		$scope.$digest();
	}
}

//This func is garbage - should find a way to more elegantly search. (Quickly)
function FindTeam(abbreviation) {
	for(var i = 0; i < Global.Teams.length; i++) {
		if (Global.Teams[i].abbreviation == abbreviation) {
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