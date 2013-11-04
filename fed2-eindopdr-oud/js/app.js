/*
 *	Score app v0.1 door Steve Zonneveld
 */

// Namespace
var SCOREAPP = SCOREAPP || {}; // Namespace 'SCOREAPP' aanmaken in globale scope (is om eventueel conflicten te vermijden)

// Anonieme functie
(function() { // Self-invoking (zelf aanroepende) anonieme functie
	// Local scope == function scope == lexical scope
	"use strict";
	// Data objecten
	SCOREAPP.schedule = { // Wordt 'schedule' object aangemaakt in de namespace 'SCOREAPP' (object literal schrijfwijze)
		// Data objecten die worden aangesproken in de html
		title: 'Schedule',
		description: 'Dit is de schedule pagina',
		items: [ 
			{ date: "Monday, 9:00am", team1: "Chasing", team1Score: "13", team2: "Amsterdam Money Gang", team2Score: "9"},
		    { date: "Monday, 9:00am", team1: "Boomsquad", team1Score: "15", team2: "Beast Amsterdam", team2Score: "11"},
		    { date: "Monday, 10:00am", team1: "Beast Amsterdam", team1Score: "14", team2: "Amsterdam Money Gang", team2Score: "12"},
		    { date: "Monday, 10:00am", team1: "Chasing", team1Score: "5", team2: "Burning Snow", team2Score: "15"},
		    { date: "Monday, 11:00am", team1: "Boomsquad", team1Score: "11", team2: "Amsterdam Money Gang", team2Score: "15"},    
		    { date: "Monday, 11:00am", team1: "Burning Snow", team1Score: "15", team2: "Beast Amsterdam", team2Score: "6"},
		    { date: "Monday, 12:00pm", team1: "Chasing", team1Score: "8", team2: "Beast Amsterdam", team2Score: "15"},
		    { date: "Monday, 12:00pm", team1: "Boomsquad", team1Score: "15", team2: "Burning Snow", team2Score: "8"},
		    { date: "Monday, 1:00pm", team1: "Chasing", team1Score: "15", team2: "Boomsquad", team2Score: "14"},
		    { date: "Monday, 1:00pm", team1: "Burning Snow", team1Score: "15", team2: "Amsterdam Money Gang", team2Score: "11"}
		]
	};

	SCOREAPP.game = {
		title: 'Game',
		description: 'Dit is de game pagina',
		items: [
		    { score: "1", team1: "Boomsquad", team1Score: "1", team2: "Burning Snow", team2Score: "0"},
		    { score: "2", team1: "Boomsquad", team1Score: "2", team2: "Burning Snow", team2Score: "0"},
		    { score: "3", team1: "Boomsquad", team1Score: "2", team2: "Burning Snow", team2Score: "1"},
		    { score: "4", team1: "Boomsquad", team1Score: "2", team2: "Burning Snow", team2Score: "2"},
		    { score: "5", team1: "Boomsquad", team1Score: "3", team2: "Burning Snow", team2Score: "2"},
		    { score: "6", team1: "Boomsquad", team1Score: "4", team2: "Burning Snow", team2Score: "2"},
		    { score: "7", team1: "Boomsquad", team1Score: "5", team2: "Burning Snow", team2Score: "2"},
		    { score: "8", team1: "Boomsquad", team1Score: "5", team2: "Burning Snow", team2Score: "3"},
		    { score: "9", team1: "Boomsquad", team1Score: "6", team2: "Burning Snow", team2Score: "3"},
		    { score: "10", team1: "Boomsquad", team1Score: "7", team2: "Burning Snow", team2Score: "3"},
		    { score: "11", team1: "Boomsquad", team1Score: "7", team2: "Burning Snow", team2Score: "4"},
		    { score: "12", team1: "Boomsquad", team1Score: "8", team2: "Burning Snow", team2Score: "4"},
		    { score: "13", team1: "Boomsquad", team1Score: "8", team2: "Burning Snow", team2Score: "5"},
		    { score: "14", team1: "Boomsquad", team1Score: "8", team2: "Burning Snow", team2Score: "6"},
		    { score: "15", team1: "Boomsquad", team1Score: "9", team2: "Burning Snow", team2Score: "6"},
		    { score: "16", team1: "Boomsquad", team1Score: "9", team2: "Burning Snow", team2Score: "7"},
		    { score: "17", team1: "Boomsquad", team1Score: "10", team2: "Burning Snow", team2Score: "7"},
		    { score: "18", team1: "Boomsquad", team1Score: "11", team2: "Burning Snow", team2Score: "7"},
		    { score: "19", team1: "Boomsquad", team1Score: "12", team2: "Burning Snow", team2Score: "7"},
		    { score: "20", team1: "Boomsquad", team1Score: "13", team2: "Burning Snow", team2Score: "7"},
		    { score: "21", team1: "Boomsquad", team1Score: "14", team2: "Burning Snow", team2Score: "7"},
		    { score: "22", team1: "Boomsquad", team1Score: "14", team2: "Burning Snow", team2Score: "8"},
		    { score: "23", team1: "Boomsquad", team1Score: "15", team2: "Burning Snow", team2Score: "8"}
		]
	};

	SCOREAPP.ranking = {
		title: 'Ranking',
		description: 'Dit is de ranking pagina',
		items: [
			{ team: "Chasing", Win: "2", Lost: "2", Sw: "7", Sl: "9", Pw: "35", Pl: "39"},
		    { team: "Boomsquad", Win: "2", Lost: "2", Sw: "9", Sl: "8", Pw: "36", Pl: "34"},
		    { team: "Burning Snow", Win: "3", Lost: "1", Sw: "11", Sl: "4", Pw: "36", Pl: "23"},
		    { team: "Beast Amsterdam", Win: "2", Lost: "2", Sw: "6", Sl: "8", Pw: "30", Pl: "34"},
		    { team: "Amsterdam Money Gang", Win: "1", Lost: "3", Sw: "6", Sl: "10", Pw: "30", Pl: "37"}
		]
	};

	SCOREAPP.movies = {
		title: 'Movies',
		description: 'Dit is de movies pagina'

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
					SCOREAPP.page.schedule(); // Methode 'schedule' bevat geen attributen
				},
				'/game': function() {
					SCOREAPP.page.game(); 
				},
				'/ranking': function() {
					SCOREAPP.page.ranking();
				},
				'/movies': function() {
					SCOREAPP.page.movies();
				},
				'*': function() { // Catch all
			    	SCOREAPP.page.schedule();
			    }
			});
		},

		change: function () {
			// Variabele 'route' leest de tekst die na de # komt 
            var route = window.location.hash.slice(2),
            	// Variabele 'sections' bevat de data-route van de 'section' html tag 
                sections = qwery('section[data-route]'), // Maakt selector data-route aan
                section = qwery('[data-route=' + route + ']')[0]; // Spreekt array 0 aan van de data-route 

            // Laat actieve sectie zien en verbergt de rest
            if (section) {
            	// Verwijdert class 'active' van de 'section' html tag 
            	for (var i=0; i < sections.length; i++){
            		sections[i].classList.remove('active');
            	}
            	// Voegt class 'active' toe aan de huidige sectie 
            	section.classList.add('active');
            }

            // Standaard route
            if (!route) {
            	sections[0].classList.add('active');
            }

		}	
	};

	// Pages
	SCOREAPP.page = {
		schedule: function () { // Methode 'schedule'
			Transparency.render(qwery('[data-route=schedule]')[0], SCOREAPP.schedule); // De data wordt opgehaald uit het object 'schedule' om dit vervolgens te koppelen aan de juiste data-route
			SCOREAPP.router.change(); // Object constructor

		},

		game: function () {
			Transparency.render(qwery('[data-route=game]')[0], SCOREAPP.game);
			SCOREAPP.router.change();
		},

		ranking: function () {
			Transparency.render(qwery('[data-route=ranking]')[0], SCOREAPP.ranking);
			SCOREAPP.router.change();
		},

		movies: function () {
			promise.get('http://dennistel.nl/movies').then(function(error, text, xhr) {
			    if (error) {
			      console.log('Error ' + xhr.status);
			      // Stop met de functie
			      return;
		    }

		    SCOREAPP.movies = JSON.parse(text);
		    Transparency.render(qwery('[data-route=movies')[0], SCOREAPP.movies);

			});

			SCOREAPP.router.change();
		}
	}

	// DOM ready
	domready(function () {
		// Kickstart applicatie
		SCOREAPP.controller.init(); // Verwijst naar 'controller' object waar script mee begint
	});

})();