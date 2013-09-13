var scopes = [
	'https://www.googleapis.com/auth/drive',
	'https://www.googleapis.com/auth/userinfo.profile',
];
var accessToken = '';

/**
* Called when the client library is loaded.
*/
function handleClientLoad() {
	checkAuth();
}

/**
* Check if the current user has authorized the application.
*/
function checkAuth() {
	gapi.auth.authorize(
		{'client_id': GOOGLE_CLIENT_ID, 'scope': scopes.join(' '), 'immediate': true},
		handleAuthResult
	);
}

/**
* Called when authorization server replies.
*
* @param {Object} authResult Authorization result.
*/
function handleAuthResult(authResult) {
	if (authResult && !authResult.error) {
		console.log(authResult);
		if (authResult.response_type === 'token') {
			accessToken = authResult.access_token;
			// Need a gapi.client.request instead of gapi.client.load to place a request
			gapi.client.request({
				'path': '/oauth2/v1/tokeninfo',
				'params': {'access_token': accessToken},
				'method': 'GET',
				'callback': callback
			});

			//gapi.client.load('drive', 'v2', driverApiLoaded);
			//makeCorsApiRequest('GET', "https://www.googleapis.com/drive/v2/files", driverApiLoaded)
		}
		else {
			alert('unknow response type');
		}
		
	// Access token has been successfully retrieved, requests can be sent to the API
	} else {
		// No access token could be retrieved, force the authorization flow.
		gapi.auth.authorize(
			{'client_id': GOOGLE_CLIENT_ID, 'scope': scopes, 'immediate': false},
			handleAuthResult
		);
	}
}
// temperary a callback for all http requests
function callback(response) {
	console.log(response);
}

// Create the XHR object.
function createCORSRequest(method, url) {
	var xhr = new XMLHttpRequest();
	xhr.open(method, url, true);
	return xhr;
}

// Make the actual CORS request.
function makeCorsApiRequest(method, url, callback) {
	var oauthToken = gapi.auth.getToken();
	var xhr = createCORSRequest(method, url);
	xhr.setRequestHeader('Authorization', 'Bearer ' + oauthToken.access_token);
	// Response handlers.
	xhr.onload = function() {
		var text = xhr.responseText;
		console.log(text);
	};
	xhr.onerror = function() {
		// TODO
	};
	xhr.send();
}