//Possible resources: 

//Reddit OAuth documentation
//https://github.com/reddit/reddit/wiki/OAuth2

//Authenticating a JS-based reddit application with user login (Implicit grant flow)
//http://wattydev.com/authenticating-a-js-based-reddit-application-with-user-login-implicit-grant-flow/

//Promises
//http://www.html5rocks.com/en/tutorials/es6/promises/


angular
	.module('hockeydeck')
    .service('redditContentService', ['redditOAuthService', function(redditOAuthService) {
    	console.log("Reddit Content Service init");
        
        //"Public" methods
        this.getGDTs = function() {
            return new Promise(function(resolve, reject) {
                get("https://oauth.reddit.com/user/GDT_Bot/submitted/?sort=top&t=day").then(function(apiResponse) {
                    //Strip off some of the layers.
                    resolve(apiResponse.data.children);
                }, function(error){
                    console.log('error found', error);
                });
            });
        }

        this.getGDTComments = function(subreddit, gdtId) {
            return new Promise(function(resolve, reject) {
                get("https://oauth.reddit.com/r/" + subreddit + "/comments/" + gdtId).then(function(apiResponse) {
                    //We get back the thread and the comments - return both for now?
                    resolve(apiResponse);
                }, function(error){
                    console.log('error found', error);
                });
            });
        }

        //"Private" methods
        function get(urlRequested) {
            console.log("Start get");
            return new Promise(function(resolve, reject) {

                redditOAuthService.getAuthToken().then(function(authKey) {
                    $.ajax({
                        type:"GET",
                        beforeSend: function (request)
                        {
                            request.setRequestHeader("Authorization", 'bearer ' + authKey);
                        },
                        url: urlRequested,
                        success: function(data) {
                            console.log('redditContentService: Got data back:', data);
                            resolve(data);
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            reject(xhr);
                        }
                    });
                }, function(error) {
                    console.log("Error getting auth token", error);
                })
            });
        }
    }]);

