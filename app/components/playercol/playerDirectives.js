angular
	.module('hockeydeck')
	.directive("playercol", function(){
		return {
			restrict: "E",
			templateUrl: "app/components/playercol/playerView.html",
			link: function(scope, element, attrs, parent){
				//Copy over all attributes that aren't jQuery/Angular.
				console.log('New PlayerCol', attrs);
				for (x in attrs) {
					if (x.indexOf('$')) {
						scope[x] = attrs[x];
					}
				}

				//Manually convert from string.
				scope.player = JSON.parse(scope['player']); //Arg passed from prev view
				scope.playerInfo = GetPlayer(scope.player.team, scope.player.name, scope.player.num);
				GetPlayerStatLines(scope.playerInfo.id, function(result) {
					scope.playerData = result.people[0];
					scope.playerData.birthDate = moment(scope.playerData.birthDate).format('MMMM D, YYYY');
				});

				scope.img = 'http://tsnimages.tsn.ca/ImageProvider/PlayerHeadshot?seoId=' + scope.playerInfo.name.replace(' ','-').replace("'",'').replace('.','')
			}
		}
	})
	.directive("viewplayer", ['$compile', 'SettingsMessageService', function($compile, SettingsMessageService){
		return  {
			link: function(scope, element, attrs, ctrl){
				//Setup our element.
				var player = JSON.parse(attrs['player']);
				//Set the name
				element.text(player.displayName);
				
				element.bind("click", function(){
					SettingsMessageService.notify('event-view-player-detail', {
						ident: scope.controllerIdent,
						player: player
					});
				});
			}
		};
	}]);
