function httpGetRequest(path, param, callback) 
{
	var xhttp = new XMLHttpRequest();

	if (param == "" || param == null) { 
		param = ""
	}
	else {
		param = "?" + param;
	}

	xhttp.open("GET", path + param, true);

	xhttp.setRequestHeader('Access-Control-Allow-Origin', '*' );
	xhttp.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
	xhttp.setRequestHeader("Access-Control-Max-Age", "3600");
	xhttp.setRequestHeader("Content-Type", "application/json; charset=utf8");

	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       callback(xhttp.responseText); 
	    }
	}

	xhttp.send();
}

httpGetRequest('/highscore', "", function(data) {
	var highscore = JSON.parse(data)
	var html = "<table class='table'><thead><tr><th scope='col'>#</th><th scope='col'>Nickname</th><th scope='col'>Score</th></tr></thead><tbody>";

	for (var i=0; i<highscore.length; i++) {
		html += "<tr><td>"+highscore[i]['position']+"</td><td>"+highscore[i]['name']+"</td><td>"+highscore[i]['score']+"</td></tr>";
	}
	html += "</tbody></table>";

	document.getElementById("highscoreTable").innerHTML = html;
});