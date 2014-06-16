//add some videos!

// track
var finish = 950;
var totalPoints = 0;
var targetVelo = 10;
var dist = 0;

var videos = new Array("road_bike_480.mp4", "test_480.mp4");

 //velocity in m/s at which additional points are added
var goal1 = {
	atDist:100,
	points:true,
	addPoints: 100,
	baseText:"+100 Points",
	secondaryText:"+121 Bonus",
	used: false
};
var goal2 = {
	atDist:200,
	points:true,
	addPoints: 200,
	baseText:"+200 Points",
	secondaryText:"+122 Bonus",
	used: false
};
var goal3 = {
	atDist:500,
	points:true,
	addPoints: 500,
	baseText:"+500 Points",
	secondaryText:"+123 Bonus",
	used: false
};
var goal4 = {
	atDist:750,
	points:true,
	addPoints: 750,
	baseText:"+750 Points",
	secondaryText:"+123 Bonus",
	used: false
};
var goal5 = {
	atDist:900,
	points:true,
	addPoints: 1000,
	baseText:"+1000 Points",
	secondaryText:"+123 Bonus",
	used: false
};

var goals = new Array(goal1,goal2,goal3);

console.log(goals);

// set speed
var speed = 1.0;
// get data how often

// video variable
video = document.getElementById("bgvid");
// play it broooo when page loaded
video.play();

$( "#img-score" ).hide();

// calc the bonus score
function calcBonus (basePoints) {
	var bonus = Math.round((Math.pow(2,(1.0/(Math.random()+0.2)))/3) * basePoints);
	totalPoints += bonus;
	return bonus;
}

// Here's the input data for the game!
function processData () {
	revs = 3 + Math.random() * 3; //faked in speed for now
	velo = revs * 2.515; // (m/s) 2.1545m is circumference of 27" wheel
	dist += 0.5 * velo; //velo is calculated twice per second
	writeData(dist, revs, velo);
	updateSpeed(velo);
	checkGoals(dist);
	checkVelo(velo);
	updateScore();
	checkFinish(dist);
}
//sets how often input state is checked
setInterval(processData, 500);

function checkVelo (velo) {
	if (velo > targetVelo) {
		totalPoints = Math.round(totalPoints + (targetVelo / 3));
	}
}

function updateScore(){
	document.getElementById("total-points").innerHTML = totalPoints;
}

function checkGoals(dist) {
	for (var i = 0 ;i < goals.length; i++) {
		if (dist > goals[i].atDist && goals[i].used == false) {
			
			textExplode();
			totalPoints += goals[i].addPoints;
			var bonus = calcBonus(goals[i].addPoints);
			updateText(goals[i].baseText, "+" + bonus + " Bonus");
			goals[i].used = true;
		}
	};
}

function updateSpeed(velocity) {
	if (velocity > 1) {
		var speed = (velocity * 1) / 10.0;
	} else {
		var speed = 0;
	}
	
	video.playbackRate = speed;
} 

// put it on the page brooo
function writeData (dist, revs, velo) {
	document.getElementById("velocity").innerHTML = Math.round(velo * 3.6 ) + " km/h";
	document.getElementById("total-dist").innerHTML = Math.round(dist) + " m";
	if (dist < finish ) {
		var progress = Math.round((dist / finish) * 1000)/10;
	} else {
		var progress = 100;
	}
	document.getElementById("progress-wrap").innerHTML = "<progress id=\"distance-bar\" value=\"" + progress + "\" max=\"100\"></progress>";
}

function updateText (primary, secondary) {
	console.log("update text");
	document.getElementById("base-text").innerHTML = primary;
	document.getElementById("secondary-text").innerHTML = secondary;
}

function showText () {
	console.log("show text");
	$("#text-wrap").show();
	$("#base-text").show();
	$("#secondary-text").show();
}

function hideText() {
	console.log("hide text");
	$("#base-text").hide();
	$("#secondary-text").hide();
}

// animation for text
function textExplode () {
	$( "#text-wrap" ).hide();
	$( "#text-wrap" ).toggle( "explode", function() {
		setTimeout(function () {
			$( "#text-wrap" ).toggle( "explode");
		}, 3000);
		
  });
}


function waitingState () {
	showText();
	timeout = 15;
	var timeoutinProgress = true;
	console.log('waiting state');
	var counter = setInterval(function(){
	//setInterval(function(){
		
		updateText("Time Until Next Heat", timeout + " seconds");
		showText();
		console.log(timeout);

		if (timeout <= 0 && timeoutinProgress == true){ 
			// done	
			hideText();
			resetDistance();
			resetGoals();
			timeoutinProgress = false;	
		  	clearInterval(counter);
		  	resetVideo();
		}
	timeout -= 1;


	}, 1000);
}

function resetVideo () {
	//selects a video from the array
	console.log('reset video function');
	var newVideo = videos[Math.floor(Math.random()*videos.length)];
	console.log(newVideo);
	document.getElementById("vid-wrap").innerHTML = "<video id=\"bgvid\"><source src=\"media/" + newVideo + "\" type=\"video/mp4\"></video>";
	video = document.getElementById("bgvid");
	video.play();
}

//
function checkFinish(dist) {
	//console.log("dist:" + dist + ". finish: " + finish);
	if (dist > finish) {
		console.log("dist > finish");
		resetDistance();
		resetTrack();
	}
}

// sets game for next heat
function resetTrack () {
	console.log("reset track");
	waitingState();
	//resetDistance();
	//resetGoals ();
}

function resetGoals () {
	for (var i = 0 ;i < goals.length; i++) {
		goals[i].used = false;
	}
}

function resetDistance() {
	dist = 0;
}