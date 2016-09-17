var gameTheme = new Audio('casinoTheme.mp3');
gameTheme.play();

var view = {
	displayMessage: function(msg){
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	
	displayHit: function(location){
		var cell = document.getElementById(location);
		var body = document.getElementById("body");
		var audio = new Audio('explosion.mp3');
		var audio2 = new Audio('applause.mp3');
		setTimeout(function(){cell.setAttribute("class", "cellFlash")},1250);
		setTimeout(function(){cell.setAttribute("class", "hit")},1250);
		setTimeout(function(){body.setAttribute("class", "white")},1250);
		setTimeout(function(){board.setAttribute("class", "white")},1250);
		setTimeout(function(){body.setAttribute("class", "flash")},1350);
		setTimeout(function(){body.setAttribute("class", "black")},1900);
		setTimeout(function(){audio.play()},1250);
		setTimeout(function(){audio2.play()},1350);
	},
	
	displayMiss: function(location){
		var cell = document.getElementById(location);
		var audio = new Audio('splash.mp3');
		setTimeout(function(){cell.setAttribute("class", "miss")},1250);
		setTimeout(function(){audio.play()},1250);
	}

};

var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	
	ships: [{ locations: [0, 0, 0], hits: ["", "", ""]},
				{ locations: [0, 0, 0], hits: ["", "", ""]},
				{ locations: [0, 0, 0], hits: ["", "", ""]}],

	fire: function(guess) {
		for(var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			var audio = new Audio('cannon.mp3');
			audio.play();
			if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");
				if(this.isSunk(ship)){
					this.shipsSunk++;
				}
				return true;
			}

		}
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},

	isSunk: function(ship) {
		for(var i = 0; i < this.shipLength; i++){
			if(ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	},

	generateShipLocations: function() {
		console.log("generateShipLocations is working");
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do{
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
	},

	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, column;

		if(direction === 1){
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		} else {
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
		}
	
		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if(direction === 1){
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++){
			var ship = model.ships[i];

			for(var j = 0; j<locations.length; j++) {
				if(ship.locations.indexOf(locations[j]) >= 0){
					return true;
				}
			}
		}
		return false;
	}
};

var controller = {
	guesses: 0,

	processGuess: function(guess) {
		var location = parseGuess(guess);
		var audio = new Audio('ending.mp3');
		if(location) {
			this.guesses++;
			var hit = model.fire(location);
			if(hit && model.shipsSunk === model.numShips){
				console.log("slkdjf");
				view.displayMessage("You sank all my batteship in " + this.guesses + " guesses");
				setTimeout(function(){audio.play()},2000);
			}
		}
	}
};

function parseGuess(guess) {
	var alphabet = ["a", "b", "c", "d", "e", "f", "g"];

	if(guess === null || guess.length !== 2) {
		alert("Oops!, Please enter a number and a number on the board.");
	} else {
		var firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);

		if( isNaN(row) || isNaN(column)) {
			alert("Oops! That isn't on the board.");
		} else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
				alert("Oops, That's of the board!");
		} else {
				return row + column;
		}
	}
	return null;
}

function init(){
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	model.generateShipLocations();
}

function handleFireButton(){
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess(guess);

	guessInput.value = "";
}

function handleKeyPress(e){
	var fireButton = document.getElementById("fireButton");
	if(e.keyCode === 13){
		fireButton.click();
		return false;
	}
}

window.onload = init;
console.log(model.ships);




