//Possible resources: 

//Reddit OAuth documentation
//https://github.com/reddit/reddit/wiki/OAuth2

//Authenticating a JS-based reddit application with user login (Implicit grant flow)
//http://wattydev.com/authenticating-a-js-based-reddit-application-with-user-login-implicit-grant-flow/


angular
	.module('hockeydeck')
    .service('redditOAuthService', ['$localStorage', function($localStorage) {
    	console.log("Reddit OAuth Service init");
    	//Set any static values
    	var clientId = "yL6KjSuclZOJrg"; //Non-secret reddit client ID.

    	//Do we need to initialize local storage values? 
    	if ($localStorage.redditAuth == undefined) {
    		intializeAuthValues();
    	}   	

    	//"Public" methods:
    	this.getAuthToken = function() {
            return new Promise(function(resolve, reject) {
            	if (haveToken()) {
            		resolve($localStorage.redditAuth.token);
            	} 
            	else {
	                $.ajax({
			            type:"POST",
			            beforeSend: function (request)
			            {
			                //request.setRequestHeader("User-Agent", "/u/TheBored HockeyDeck v0.0 Alpha"); //Can't set UA - forbidden. Are there issues with API usage with standard Chrome UA?
			                request.setRequestHeader("Authorization", "Basic " + btoa(clientId + ":" + "")); //For no-user auth, username is clientId, pw is empty: https://goo.gl/VBsegi
			            },
			            url: "https://www.reddit.com/api/v1/access_token",
			            data: "grant_type=https://oauth.reddit.com/grants/installed_client&device_id=" + $localStorage.redditAuth.deviceId,
			            processData: false,
			            success: function(data) {
			            	console.log("getAuthToken: Got auth data back:", data);
			                setAuthToken(data.access_token, data.expires_in);
			                console.log("getAuthToken: Auth key set as:", $localStorage.redditAuth.token);
			                resolve(data.access_token);
			            },
			            error: function (xhr, ajaxOptions, thrownError) {
	                        reject(xhr);
	                    }
			    	});
            	}
            });
        }

    	//"Private" methods:
    	function intializeAuthValues() {
    		//It's either the first time we're setting these, or just wiping.
    		var auth = {}
    		auth.deviceId = Math.random().toString(36).substring(6); //Ident for this user/browser. Should not be re-created unless completely lost.
    		auth.type = "userless";

    		$localStorage.redditAuth = auth;
    	}

    	function getAuthValues() {
    		return $localStorage.redditAuth;
    	}

    	function setAuthToken(token, expires_in) {
    		console.log("SETTING AUTH TOKEN:", token);
    		$localStorage.redditAuth.token = token;
            $localStorage.redditAuth.expires = moment().unix() + (expires_in - 30); //Cut our expiration short so the user doesn't see the overlap.
    	}

    	function haveToken() {
            //Do we even have a token?
            if ($localStorage.redditAuth.token == undefined) {
                return false;
            }

            //Okay, we have a token, but has it expired?
            if ($localStorage.redditAuth.expires < moment().unix()) {
                return false;
            }
    		return true;
    	}

    	//TODO: Refreshes, revoking, etc

    }]);