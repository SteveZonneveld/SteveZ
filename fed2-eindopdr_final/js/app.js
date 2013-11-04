/*
 *	Amsterdam Ultimate - Autumn 2013 app
 */

// Namespace
var SCOREAPP = SCOREAPP || {}; // Namespace 'SCOREAPP' aanmaken in globale scope (is om eventueel conflicten te vermijden)

// Anonieme functie
(function () { // Self-invoking (zelf aanroepende) anonieme functie
	// Local scope == function scope == lexical scope

	// Strict Mode is een functie in ECMAScript 5 die toelaat om een programma of een functie te plaatsen, in een "strict" operationele context
	'use strict';

	// Data objecten	
	SCOREAPP.schedule = { // Wordt 'schedule' object aangemaakt in de namespace 'SCOREAPP' (object literal schrijfwijze)
		schedule: [
		]
	};
	
	SCOREAPP.game = { // Game data object
		game: [
		]
	};
	
	SCOREAPP.ranking = { // Ranking data object
		rank: [
		]
	};

	// Spinner, error en fader
	SCOREAPP.utils = {
		spinner: {
			spinnerObject: document.getElementById("spinner"), // Spinner object gekoppeld aan 'spinner' ID
			show: function () {
				SCOREAPP.utils.fader.fadeOut(.5, function () { // Fade out met tijd gekoppeld aan de spinner
					SCOREAPP.utils.spinner.spinnerObject.className = "spin"; // Weergeeft de spinner
				});
			},
			hide: function () {
				SCOREAPP.utils.fader.fadeIn(.5, function () { // Fade in met tijd gekoppeld aan de spinner
					SCOREAPP.utils.spinner.spinnerObject.className ="hidespin"; // Verstopt de spinner
				});
			}
		},
		error: {
			alert: function (reason, message) {
				alert(reason + " " + message);
			}
		},
		fader: {
			fadeIn: function (duration, callback) {
				Fader.fadeInWithId("content", duration);
				if (callback) {
					callback();
				}
			},
			fadeOut: function (duration, callback) {
				Fader.fadeOutWithId("content", duration);
				if (callback) {
					callback();
				}
			}
		} 
	};
	
	// Controller initialize
	SCOREAPP.controller = {
		// Methode init
		init: function () {
			// Initialize router
			SCOREAPP.router.init(); // Het namespace 'SCOREAPP' object spreekt het 'router' object met de methode 'init' aan
			SCOREAPP.gestures.init(); // Het namespace 'SCOREAPP' object spreekt het 'gestures' object met de methode 'init' aan 
		}
	};

	// Router
	SCOREAPP.router = {
		// Methode init
		init: function () {
	  		routie({ // Spreekt 'router.min.js' aan
	  			// Methode schedule wordt aangesproken
			    '/schedule': function() {
			    	SCOREAPP.ajax.getObjectsForSchedule(); // Methode 'schedule' bevat geen attributen
				},
			    '/game/:gameID': function(gameID) {
			    	SCOREAPP.ajax.getObjectsForGame(gameID); // Methode 'game' bevat 'gameID' attributen
			    },
			    '/ranking': function() {
			    	SCOREAPP.ajax.getObjectsForRanking();
			    },
			    '*': function() { // Catch all
			    	SCOREAPP.ajax.getObjectsForSchedule();
			    }
			});
		},

		change: function () {
			// Variabele 'sections' bevat de data-route van de 'section' html tag 
			var sections = qwery('section[data-route]'), // Maakt selector data-route aan
			// Variabele 'route' leest de tekst die na de # komt 
            	route 	 = window.location.hash.slice(2);

        	// Laat actieve sectie zien en verbergt de rest
        	for(var i = 0; i < sections.length; i++) {
        			// Verwijdert class 'active' van de 'section' html tag 
        			sections[i].classList.remove('active');
        	}
			
			// Kijkt of de '/' er is voor 'gameID'
			if(route.search("/") != -1) {
				route = route.substring(0, route.search("/"));
			}
        	
        	var sectionToChange = qwery('[data-route=' + route + ']')[0]; // Spreekt array 0 aan van de data-route
        	// Voegt class 'active' toe aan de huidige sectie  
        	sectionToChange.classList.add('active');
 
        	// Standaard route
        	if (!route) {
        		// Voegt class 'active' toe aan de huidige sectie 
        		sections[0].classList.add('active');
        	}
		}
	};

	// Pages (templating)
	SCOREAPP.page = {
		render: function (route) {
			var data = SCOREAPP[route];
			// Voegt data toe aan bepaalde arrtributen
			var directives = {
				// Een array van data
				schedule: {
					// Verwijst naar data-bind 'link' in de HTML
					link: {
						href: function() {
							return "#/game/" + this.gameID; // Verwijst naar 'gameID'
						}
					}
				},
				game: {
					team1Score: {
						value: function () {
							return this.team1Score; // Levert de data voor teamscore 1
						}
					},
					team2Score: {
						value: function () {
							return this.team2Score; // Levert de data voor teamscore 2
						}
					}
				}
			}
			Transparency.render(qwery('[data-route='+route+']')[0], data, directives);
			SCOREAPP.router.change();
		}
	}

	// Objecten uit de Leaguevine API
	SCOREAPP.ajax = {
		// Pakt de objecten voor de ranking pagina (methode)
		getObjectsForRanking: function () {
			// Feed URL for ranking
			var feed = "https://api.leaguevine.com/v1/pools/?tournament_id=19389&order_by=%5Bname%5D"; // Link naar de Leaguevine API

			SCOREAPP.utils.spinner.show(); // Weergeeft de spinner
			promise.get(feed).then(function(error, data, xhr){ // GET de data uit de Leaguevine API met promise lib
				if (error) {
       				SCOREAPP.utils.error.alert("Request timed out. Error: "); // Voor eventuele time out error 
        			return;
    			}	
				
				data = JSON.parse(data) // Maakt er JSON objecten van
				// Pakt van elke pool de poolnaam 
				for (var i = 0; i < data.objects.length; i++) { // Loop de poolnamen
					var poolName = data.objects[i].name;
					SCOREAPP.ranking.rank[i] = {
						poolID: "Pool " + poolName
					};
					SCOREAPP.ranking.rank[i].teams = [];
					// Pakt van elk team uit de pool de data
					for (var c = 0; c < data.objects[i].standings.length; c++) { // Om de variabele een waarde te geven, moet de variabele worden geïnitialiseerd, in dit geval met een 0
						SCOREAPP.ranking.rank[i].teams[c] = {
						 	team: data.objects[i].standings[c].team.name,
						 	win: data.objects[i].standings[c].wins,
						 	lost: data.objects[i].standings[c].losses,
						 	gs: data.objects[i].standings[c].points_scored,
						 	ga: data.objects[i].standings[c].points_allowed,
						 	balance: data.objects[i].standings[c].plus_minus,
						};
					}	
				}

				SCOREAPP.utils.spinner.hide(); // Stopt de spinner
				SCOREAPP.page.render('ranking', function () { // Zet de ranking pagina neer
				});
			});
		},

		// Pakt de objecten voor de schedule pagina
		getObjectsForSchedule: function () {
			var feed = "https://api.leaguevine.com/v1/games/?tournament_id=19389&limit=100&access_token=82996312dc";

			SCOREAPP.utils.spinner.show(); // Weergeeft de spinner
			
			promise.get(feed).then(function(error, data, xhr) { // GET de data uit de Leaguevine API
				if (error) {
       				SCOREAPP.utils.error.alert("Request timed out. Error: "); // Voor eventuele time out error
        			return;
    			}	
				data = JSON.parse(data); // Maakt er JSON objecten van (parsen)
				for (var i = 0; i < data.objects.length; i++) { // Loop de onderdelen voor datum
					var year = data.objects[i].start_time.substr(0,4);
					var month = data.objects[i].start_time.substr(5,2);
					var day = data.objects[i].start_time.substr(8,2);
					var hour = data.objects[i].start_time.substr(11,2)
					var minutes = data.objects[i].start_time.substr(14,2)
					SCOREAPP.schedule.schedule[i] = {
						poolID: "Pool " + data.objects[i].pool.name,
						date: day + "-" + month + "-" + year + " " + hour + ":" + minutes,
						team1: data.objects[i].team_1.name,
						team1Score: data.objects[i].team_1_score,
						team2: data.objects[i].team_2.name,
						team2Score: data.objects[i].team_2_score,
						gameID: data.objects[i].id
					};
					if (i < data.objects.length - 1) {
						if (data.objects[i].pool.name  == data.objects[i + 1].pool.name) {
							SCOREAPP.schedule.schedule[i].poolID = "";
						}
					}
				}
				SCOREAPP.utils.spinner.hide(); // Stopt de spinner

				SCOREAPP.schedule.schedule.reverse(); // Zorgt er voor dat de pools op de juiste volgorde worden weergeven
				SCOREAPP.page.render('schedule'); // Zet de schedule pagina neer
			});
		},

		// Pakt de objecten voor de game pagina
		getObjectsForGame: function (gameID) { // Pakt juiste gameID om de juiste data te laden van de teams
			SCOREAPP.utils.spinner.show(); // Weergeeft de spinner

			var feed = "https://api.leaguevine.com/v1/games/" + gameID + "/";

			promise.get(feed).then(function(error, data, xhr) { // GET de data uit de Leaguevine API
				if (error) {
       				alert('Error ' + xhr.status);
        			return;
    			}
    			data = JSON.parse(data);	
    			SCOREAPP.game.game = {
    				team1Name: data.team_1.name,
    				team2Name: data.team_2.name,
    				team1Score: data.team_1_score,
    				team2Score: data.team_2_score
    			}
    			
    			SCOREAPP.page.render('game'); // Zet de game pagina neer
    			SCOREAPP.utils.spinner.hide(); // Stopt de spinner
    		});
		},

		// Voor het opslaan van de game data
		saveNewScore: function () {
			// Pakt het gameID uit de URL
			var gameID = window.location.hash.slice(2);
				if(gameID.search("/") != -1) {
					gameID = gameID.substr(gameID.search("/") + 1 , 6);
			}	
			// Pakt de waarde uit de team scores
			var team1Score = document.getElementById('team1Score').value;
			var team2Score = document.getElementById('team2Score').value;
			// Pakt de waarde uit de radio button
			var radioChecked = document.querySelector('input[name="is_final"]:checked').value;
			if (radioChecked == "yes") {
				if(confirm("Is this the real final score? If yes the game is ended")) {
					// Pakt de waardes en stuurt ze naar 'updateNewScore' methode
					SCOREAPP.ajax.updateNewScore(gameID, team1Score, team2Score, "False");
				} 
			}
			if (radioChecked == "no") {
				// Pakt de waardes en stuurt ze naar 'updateNewScore' methode
				SCOREAPP.ajax.updateNewScore(gameID, team1Score, team2Score, "True");
			}
		},

		// Voor het versturen van de game data
		updateNewScore: function (gameID, team1Score, team2Score, isFinal) {
			SCOREAPP.utils.spinner.show();
			// Maakt een nieuw request object
	        var request = new XMLHttpRequest();
	        // De data
	        var dataToSend = {
	                "game_id": gameID,
	                "team_1_score": team1Score,
	                "team_2_score": team2Score,
	                "is_final": isFinal
	        };
	        //Set method, url and if async
	        request.open("POST","https://api.leaguevine.com/v1/game_scores/",true); // POST de data uit de Leaguevine API
	        //Set request subject and content
	        request.setRequestHeader("Content-Type","application/json");
	        request.setRequestHeader("Accept","application/json");
	        request.setRequestHeader("Authorization","bearer 82996312dc");
	        // Stringify data
	        request.send(JSON.stringify(dataToSend));
	        // Wanneer de 'readystate' actief is, ga dingen doen
	              request.onreadystatechange = function() {
                  if(request.readyState == 4) { // Request finished
                  	SCOREAPP.utils.spinner.hide(); // Stopt de spinner
                  	SCOREAPP.utils.error.alert("New score posted");
                  	console.log("Post success!");
                  } document.getElementById("gesture")
                  	window.location.hash = '#/schedule'; // Verwijst door naar schedule pagina
	         }
		}
	}

	// Voor de swipes
	SCOREAPP.gestures = {
		init: function () {
			$$("#swipeleft").swipeLeft(function () {
				// Get whole URL
				var url = document.URL;
				// Look for hash, cut 2 characters from there and take rest
				var hash = window.location.hash.slice(2);
				// Check if link contains http
				var fileChecker = document.URL.substring(0, 4);
				// Get base url, without anything after hash
				var baseUrl;
			
				if (hash != "schedule" && fileChecker != "http") { 
					baseUrl = "index.html#/";
				} else {
					baseUrl = url.substring(0, url.search(hash));
				}
				// Ga naar een andere pagina
				window.location.href = baseUrl + "ranking";
				SCOREAPP.ajax.getObjectsForRanking;
			});
			$$("#swiperight").swipeRight(function () {
				var url = document.URL;
				var hash = window.location.hash.slice(2);
				var baseUrl = url.substring(0, url.search(hash));
				window.location.href = baseUrl + "schedule";
				SCOREAPP.ajax.getObjectsForRanking;
				console.log(baseUrl + "schedule");
			});
		},
	} 

	// DOM ready
	domready(function () {
		// Kickstart applicatie
		SCOREAPP.controller.init(); // Verwijst naar 'controller' object waar script mee begint
	});
	
})();