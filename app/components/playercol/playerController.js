//Temp for now, define the types of events and add to scope for later consumption

angular
	.module('hockeydeck')
	.controller("PlayerController", ['$scope', '$window', 'settingsMessageService', function($scope, $window, settingsMessageService) {
		console.log("New PlayerController");

		$scope.cleanSeason = function CleanSeason(rawTxt) {
			//Input: 20152016 Output:15-16
			return rawTxt.slice(2,4) + '-' + rawTxt.slice(6,8);
		};

		$scope.cleanStatType = function CleanStatType(rawTxt) {
			if (rawTxt == "yearByYear") {
				return "Regular Season";
			}
			else if (rawTxt == "careerRegularSeason") {
				return "NHL Career Totals: Regular Season";
			}
			else if (rawTxt == "yearByYearPlayoffs") {
				return "Playoffs";
			}
			else if (rawTxt == "careerPlayoffs") {
				return "NHL Career Totals: Playoffs";
			}
			else { //For testing purposes, make it look bad when we don't know.
				return "UNKNOWN";
			}
		};
	}]);
