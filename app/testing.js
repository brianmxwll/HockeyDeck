//Methods in here are likely garbage and need to be truly implemented or at a minimum, saftey checks added.
var Global = {};
Global.StatLines = [];
Global.Standings = [];

//Get data immediately.
UpdateStandings();

//Stupid helper method to get last item in array. Cleaner code.
if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

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