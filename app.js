var express = require('express');
var https = require('https');
const parseStringSync = require('xml2js-parser').parseStringSync;
var app = express();

app.use('/static', express.static('static'));
app.set('views', 'views')

app.set('view engine', 'ejs');

function getPlayer(players, key, start, end)
{
	if (start > end) {
		return -1;
	}
	var mid = Math.floor((start + end)/2);

	if (players[mid]["id"] == key) {
		return mid;
	}
	else if (players[mid]["id"] < key) {
		return getPlayer(players, key, mid+1, end);
	}
	return getPlayer(players, key, start, mid-1);
}

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

app.get('/', function (request, response) {
	response.render('index');
});

app.get('/highscore', function (request, response) {
	var data = '';
	var data1 = '';
	var result1 = null;
	var result2 = null;

	https.get('https://s132-it.ogame.gameforge.com/api/highscore.xml?category=1&type=0', function(res) {
    	if (res.statusCode >= 200 && res.statusCode < 400) {
    		res.on('data', function(data_) { data += data_.toString(); });

       		res.on('end', function() {
	         	result1 = parseStringSync(data);

	         	https.get('https://s132-it.ogame.gameforge.com/api/players.xml', function(res) {
			    	if (res.statusCode >= 200 && res.statusCode < 400) {
			    		res.on('data', function(data_) { data1 += data_.toString(); });

			       		res.on('end', function() {
				         	result2 = parseStringSync(data1);

				         	var classifica = result1['highscore']['player'];
				         	var highscore = [];
				         	for (var i=0; i<classifica.length; i++) {
				         		highscore.push(classifica[i]['$']);
				         	}

				         	var pl = result2['players']['player'];
				         	var players = []
				         	for (var i=0; i<pl.length; i++) {
				         		players.push(pl[i]['$']);
				         	}

				         	for (var i=0; i<highscore.length; i++) {
				         		var index = getPlayer(players, highscore[i]['id'], 0, (players.length)-1);
				         		if (index > -1) {
				         			highscore[i]["name"] = players[index]["name"];
				         			highscore[i]["status"] = players[index]["status"];
				         		}
				         		highscore[i]["score"] = numberWithCommas(highscore[i]["score"]);
				         	}

				         	response.setHeader('Content-Type', 'application/json');
				         	response.send(JSON.stringify(highscore));
			       		});
			     	}	
			   	});
       		});
     	}	
   	});
});

app.get('/highscore_rendered', function (request, response) {
	var data = '';
	var data1 = '';
	var result1 = null;
	var result2 = null;

	https.get('https://s132-it.ogame.gameforge.com/api/highscore.xml?category=1&type=0', function(res) {
    	if (res.statusCode >= 200 && res.statusCode < 400) {
    		res.on('data', function(data_) { data += data_.toString(); });

       		res.on('end', function() {
	         	result1 = parseStringSync(data);

	         	https.get('https://s132-it.ogame.gameforge.com/api/players.xml', function(res) {
			    	if (res.statusCode >= 200 && res.statusCode < 400) {
			    		res.on('data', function(data_) { data1 += data_.toString(); });

			       		res.on('end', function() {
				         	result2 = parseStringSync(data1);

				         	var classifica = result1['highscore']['player'];
				         	var highscore = [];
				         	for (var i=0; i<classifica.length; i++) {
				         		highscore.push(classifica[i]['$']);
				         	}

				         	var pl = result2['players']['player'];
				         	var players = []
				         	for (var i=0; i<pl.length; i++) {
				         		players.push(pl[i]['$']);
				         	}

				         	for (var i=0; i<highscore.length; i++) {
				         		var index = getPlayer(players, highscore[i]['id'], 0, (players.length)-1);
				         		if (index > -1) {
				         			highscore[i]["name"] = players[index]["name"];
				         			highscore[i]["status"] = players[index]["status"];
				         		}
				         		highscore[i]["score"] = numberWithCommas(highscore[i]["score"]);
				         	}

				         	response.render('test', {highscore: highscore});
			       		});
			     	}	
			   	});
       		});
     	}	
   	});
});

app.listen(8080, function () {
  console.log('Example app listening on port 3000!');
});