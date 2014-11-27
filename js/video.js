// track
var dist = 0;
var finish = 950;
var totalPoints = 0;
var targetVelocity = 10;
var timeoutinProgress = false;
var revs = undefined;
var video;

 //distance in m at which additional points are added
var goal1 = {
	atDist:100,
	points:true,
	addPoints: 100,
	baseText:"+100 Points",
	used: false
};
var goal2 = {
	atDist:200,
	points:true,
	addPoints: 200,
	baseText:"+200 Points",
	used: false
};
var goal3 = {
	atDist:500,
	points:true,
	addPoints: 500,
	baseText:"+500 Points",
	used: false
};
var goal4 = {
	atDist:750,
	points:true,
	addPoints: 750,
	baseText:"+750 Points",
	used: false
};
var goal5 = {
	atDist:900,
	points:true,
	addPoints: 1000,
	baseText:"+1000 Points",
	used: false
};
var goals = [goal1,goal2,goal3,goal4,goal5];

//select starting video
var videos = ["road_bike_480.mp4", "test_480.mp4", "mountain_2_480.mp4"];
selectVideo();

//bonus points if speed is above targetVelocity threshold
function checkVelo (currentVelocity) {
	if (currentVelocity > targetVelocity) {
		totalPoints += Math.round(targetVelocity / 3);
	}
}

// calc the bonus score
function calcBonus (basePoints) {
	var bonus = Math.round((Math.pow(2,(1.0/(Math.random()+0.2)))/3) * basePoints);
	totalPoints += bonus;
	return bonus;
}

// Input data for the game!
function processData() {
	if (timeoutinProgress == false){
		if (typeof revs === 'undefined'){
				revs = 3.5 + Math.random() * 2;
		} //faked in speed for now
		velo = revs * 2.515 * (8 + Math.random() * 2)/10 ; // (m/s) 2.1545m is circumference of 27" wheel
		dist += 0.5 * velo; //velo is calculated twice per second
		checkVelo(velo);
		checkGoals(dist);
		checkFinish(dist);
	} else {
		velo = 0;
	};
	writeData();
	updateSpeed(velo);
}
//sets how often input state is checked
setInterval(processData, 500);

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

function writeData() {
	document.getElementById("total-points").innerHTML = totalPoints;
	document.getElementById("velocity").innerHTML = Math.round(velo * 3.6) + " km/h";
	document.getElementById("total-dist").innerHTML = Math.round(dist) + " m";
	if (dist < finish) {
		var progress = Math.round((dist / finish) * 1000)/10;
	} else {
		var progress = 100;
	}
	document.getElementById("progress-wrap").innerHTML = "<progress id=\"distance-bar\" value=\""
													+ progress + "\" max=\"100\"></progress>";
}

function updateText(primary, secondary) {
	document.getElementById("base-text").innerHTML = primary;
	document.getElementById("secondary-text").innerHTML = secondary;
}

function showText() {
	$("#text-wrap").show();
	$("#base-text").show();
	$("#secondary-text").show();
}

function hideText() {
	$("#base-text").hide();
	$("#secondary-text").hide();
}

// animation for text
function textExplode() {
	$( "#text-wrap" ).hide();
	$( "#text-wrap" ).toggle( "explode", function() {
		setTimeout(function () {
			$( "#text-wrap" ).toggle( "explode");
		}, 3000);

  });
}

function waitingState() {
	timeoutinProgress = true;
	showText();
	timeout = 10;
	console.log('waiting state');
	var counter = setInterval(function(){
		updateText("Time Until Next Heat", timeout + " seconds");
		showText();

			if (timeout <= 0 && timeoutinProgress == true){
				hideText();
				resetDistance();
				resetGoals();
				revs = 4;
				timeoutinProgress = false;
			  clearInterval(counter);
			  selectVideo();
			}
	timeout -= 1;

	}, 1000);
}

function selectVideo() {
	//selects a video from the array
	var newVideo = videos[Math.floor(Math.random()*videos.length)];
	console.log("Selected Video: " + newVideo);
	document.getElementById("vid-wrap").innerHTML = "<video id=\"bgvid\"><source src=\"media/" + newVideo + "\" type=\"video/mp4\"></video>";
	video = document.getElementById("bgvid");
	video.play();
}

//
function checkFinish(dist) {
	if (dist > finish && timeoutinProgress == false) {
		console.log("dist > finish");
		resetTrack();
	}
}

// sets game for next heat
function resetTrack () {
	console.log("reset track");
	waitingState();
}

function resetGoals() {
	for (var i = 0 ;i < goals.length; i++) {
		goals[i].used = false;
	}
}

function resetDistance() {
	dist = 0;
}

//adjust gameplay speed with key strokes

document.onkeydown = function (e) {
    switch (e.keyCode) {
        case 37: //left
            (revs > 1.2) ? revs -= 0.3 : revs;
            break;
        case 38: //up
            (revs < 10) ? revs += 0.3 : revs;
            break;
        case 39: //right
            (revs < 10) ? revs += 0.3 : revs;
            break;
        case 40: //down
            (revs > 1.2) ? revs -= 0.3 : revs;
            break;
    }
};