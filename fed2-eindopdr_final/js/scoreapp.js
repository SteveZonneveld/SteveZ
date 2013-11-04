/*
 *	Amsterdam Ultimate - Autumn 2013 app
 */

// Namespace
var SCOREAPP = SCOREAPP || {}; // Namespace 'SCOREAPP' aanmaken in globale scope (is om eventueel conflicten te vermijden)

// Anonieme functie
(function() { // Self-invoking (zelf aanroepende) anonieme functie
	// Local scope == function scope == lexical scope

	// Strict Mode is een functie in ECMAScript 5 die toelaat om een programma of een functie te plaatsen, in een "strict" operationele context
	"use strict";

	// Data objecten
	SCOREAPP.schedulePage = { // Wordt 'schedule' object aangemaakt in de namespace 'SCOREAPP' (object literal schrijfwijze)
		// Data objecten die worden aangesproken in de html
		title: 'Schedule',
		description: 'Dit is de schedule pagina',
		schedule: [ 

		]
	};
	SCOREAPP.gamePage = {
		title: 'Game',
		description: 'Dit is de game pagina',
		game: [

		]
	};
	SCOREAPP.rankingPage = {
		title: 'Ranking',
		description: 'Dit is de ranking pagina',
		rank: [

		]
	};

	SCOREAPP.settings = {
        token : 'bearer 82996312dc',
        gameUrl : 'https://api.leaguevine.com/v1/game_scores/',
        rankingUrl : 'https://api.leaguevine.com/v1/pools/?tournament_id=19389&access_token=ca3dd469a3',
        // in de url geven we mee dat we alleen bepaalde fields nodig hebben om zo minder data te hoeven op halen en de verbinding sneller te maken. we geven mee dat we team_1, team_1_score, start_time, team_2 en team_2_score willen. team_1 en 2 zijn objecten die id en naam van de team bevatten.
        scheduleUrl : 'https://api.leaguevine.com/v1/games/?tournament_id=19389&fields=%5Bid%2Cstart_time%2C%20team_1%2C%20team_2%2C%20team_1_score%2C%20team_2_score%20%5D&access_token=82996312dc'
    }

    	//Some utilities
	SCOREAPP.utils = {
		spinner: {
			spinnerObject: document.getElementById("spinner"), 
			show: function () {
				SCOREAPP.utils.fader.fadeOut(.5, function () {
					SCOREAPP.utils.spinner.spinnerObject.className = "spin";
				});
			},
			hide: function () {
				SCOREAPP.utils.fader.fadeIn(.5, function () {
					SCOREAPP.utils.spinner.spinnerObject.className ="hidespin";
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
					SCOREAPP.ajax.getObjectsForGame(gameID);
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
			// Variabele 'route' leest de tekst die na de # komt 
			var route  = window.location.hash.slice(2),
				sections = qwery('section[data-route]');
            	
        	
        	for(var i = 0; i < sections.length; i++) {
        		// Verwijdert class 'active' van de 'section' html tag 
        		sections[i].classList.remove('active');
        	}
			
			// Check if slash is there or not for gameID
			if(route.search("/") != -1) {
				route = route.substring(0, route.search("/"));
			}
        	
        	var sectionToChange = qwery('[data-route=' + route + ']')[0];
        		// Voegt class 'active' toe aan de huidige sectie
        		sectionToChange.classList.add('active');
 
        	// If no route is found, default is schedule
        	if (!route) {
        		// Voegt class 'active' toe aan de huidige sectie
        		sections[0].classList.add('active');
        	}
		}	
	};

	// Pages
	SCOREAPP.page = {
		render: function (route) {
			var data = SCOREAPP[route];
			//Add data to some attributes
			var directives = {
				// Array of data
				schedule: {
					//ID of the to be changed
					link: {
						href: function(params) {
							return "#/game/" + this.gameID;
						}
					}
				},
				game: {
					team1Score: {
						value: function (params) {
							return this.team1Score;
						}
					},
					team2Score: {
						value: function (params) {
							return this.team2Score;
						}
					}
				}
			}
			Transparency.render(qwery('[data-route='+route+']')[0], data, directives);
			SCOREAPP.router.change();
		}
	}

	SCOREAPP.ajax = {
		//Grabs the objects for the ranking page
		getObjectsForRanking: function () {
			//Feed URL for ranking
			var feed = "https://api.leaguevine.com/v1/pools/?tournament_id=19389&order_by=%5Bname%5D";
			// Fixes visual bug where DOM shows some objects
			//document.querySelector('article > section:nth-of-type(3) > section').classList.remove("show");
			//document.querySelector('article > section:nth-of-type(3) > section').classList.add("hide");
			SCOREAPP.utils.spinner.show();
			promise.get(feed).then(function(error, data, xhr){
				if (error) {
       				FRISBEEAPP.utilities.error.alert("Request timed out. Error code: ");
        			return;
    			}	
				
				data = JSON.parse(data)
				// For every pool in the api get poolname
				for (var i=0; i < data.objects.length; i++) {
					var poolName = data.objects[i].name;
					SCOREAPP.rankingPage.rank[i] = {
						poolID: "Pool " + poolName
					};
					SCOREAPP.rankingPage.rank[i].teams = [];
					// For every team in a pool grab data
					for (var c = 0; c < data.objects[i].standings.length; c++) {
						SCOREAPP.rankingPage.rank[i].teams[c] = {
						 	team: data.objects[i].standings[c].team.name,
						 	win: data.objects[i].standings[c].wins,
						 	lost: data.objects[i].standings[c].losses,
						 	gs: data.objects[i].standings[c].points_scored,
						 	ga: data.objects[i].standings[c].points_allowed,
						 	balance: data.objects[i].standings[c].plus_minus,
						};
					}	
				}
				//Shows elements after array has been filled
				document.querySelector('article > section:nth-of-type(3) > section').classList.remove("hide");
				document.querySelector('article > section:nth-of-type(3) > section').classList.add("show");
				SCOREAPP.utils.spinner.hide();
				SCOREAPP.page.render('ranking', function () {
				});
			});
		},

		getObjectsForSchedule: function () {
			var feed = "https://api.leaguevine.com/v1/games/?tournament_id=19389&limit=100&access_token=6c8247a098";
			document.querySelector('article > section:nth-of-type(1) > section').classList.remove("show");
			document.querySelector('article > section:nth-of-type(1) > section').classList.add("hide");
			SCOREAPP.utils.spinner.show();
			
			promise.get(feed).then(function(error, data, xhr) {
				if (error) {
       				SCOREAPP.utils.error.alert("Request timed out. Error: ");
        			return;
    			}	
				data = JSON.parse(data);
				for (var i = 0; i < data.objects.length; i++) {
					var year = data.objects[i].start_time.substr(0,4);
					var month = data.objects[i].start_time.substr(5,2);
					var day = data.objects[i].start_time.substr(8,2);
					var hour = data.objects[i].start_time.substr(11,2)
					var minutes = data.objects[i].start_time.substr(14,2)
					SCOREAPP.schedulePage.schedule[i] = {
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
							SCOREAPP.schedulePage.schedule[i].poolID = "";
						}
					}
				}
				SCOREAPP.utils.spinner.hide();
				document.querySelector('article > section:nth-of-type(1) > section').classList.remove("hide");
				document.querySelector('article > section:nth-of-type(1) > section').classList.add("show");
				SCOREAPP.schedulePage.schedule.reverse();
				SCOREAPP.page.render('schedule');
			});
		},

		getObjectsForGame: function (gameID) {
			SCOREAPP.utils.spinner.show();
			var feed = "https://api.leaguevine.com/v1/games/" + gameID + "/";
			promise.get(feed).then(function(error, data, xhr) {
				if (error) {
       				alert('Error ' + xhr.status);
        			return;
    			}
    			data = JSON.parse(data);	
    			SCOREAPP.gamePage.game = {
    				team1Name: data.team_1.name,
    				team2Name: data.team_2.name,
    				team1Score: data.team_1_score,
    				team2Score: data.team_2_score
    			}
    			
    			SCOREAPP.page.render('game');
    			SCOREAPP.utils.spinner.hide();
    		});
		},

		saveNewScore: function () {
			//Locate gameID from URL
			var gameID = window.location.hash.slice(2);
			if(gameID.search("/") != -1) {
				//FIX THE SUBSTRRRR
				gameID = gameID.substr(gameID.search("/") + 1 , 6);
			}	
			//Grab the value out of the input types
			var team1Score = document.getElementById('team1Score').value;
			var team2Score = document.getElementById('team2Score').value;
			//Grab value of radio button
			var radioChecked = document.querySelector('input[name="is_final"]:checked').value;
			if (radioChecked == "yes") {
				if(confirm("Once you agree that the game has ended, you will not be able to update the score anymore, are you sure you want to proceed?")) {
					//Fire updatenewScore function
					SCOREAPP.ajax.updateNewScore(gameID, team1Score, team2Score, "False");
				} 
			}
			if (radioChecked == "no") {
				//Fire updatenewScore function
				SCOREAPP.ajax.updateNewScore(gameID, team1Score, team2Score, "True");
			}
		},

		updateNewScore: function (gameID, team1Score, team2Score, isFinal) {
			SCOREAPP.utils.spinner.show();
			//Make new request object
	        var request = new XMLHttpRequest();
	        //The data to adjust
	        var dataToSend = {
	                "game_id": gameID,
	                "team_1_score": team1Score,
	                "team_2_score": team2Score,
	                "is_final": isFinal
	        };
	        //Set method, url and if async
	        request.open("POST","https://api.leaguevine.com/v1/game_scores/",true);
	        //Set request subject and content
	        request.setRequestHeader("Content-Type","application/json");
	        request.setRequestHeader("Accept","application/json");
	        request.setRequestHeader("Authorization","bearer 395c969df9");
	        //Stringify data
	        request.send(JSON.stringify(dataToSend));
	        //If reeadystate changes do stuff
	        request.onreadystatechange = function() {
                  if(request.readyState == 4) {
                  	SCOREAPP.utils.spinner.hide();
                  	SCOREAPP.utils.error.alert("Posted new score.", "Check the schedule page for the update!");
                  	console.log("Post success!");
                  } document.getElementById("gesture")
	         }
		}
	}

	/*SCOREAPP.gestures = {
		init: function () {
			$$("#swipeleft").swipeLeft(function () {
				//Get whole URL
				var url = document.URL;
				//Look for hash, cut 2 characters from there and take rest
				var hash = window.location.hash.slice(2);
				//Check if link contains http
				var fileChecker = document.URL.substring(0, 4);
				//Get base url, without anything after hash
				var baseUrl = url.substring(0, url.search(hash));
				//Go to other page
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
	}*/



	// DOM ready
	domready(function () {
		// Kickstart applicatie
		SCOREAPP.controller.init(); // Verwijst naar 'controller' object waar script mee begint
	});

})();