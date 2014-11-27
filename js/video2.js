function Game() {
  // track
  this.dist = 0;
  this.finish = 950;
  this.totalPoints = 0;
  this.targetVelo = 10;
  this.timeoutinProgress = false;
  this.revs = undefined;
  this.video = undefined;

  this.init = function () {
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
    this.goals = [goal1,goal2,goal3,goal4,goal5];
  };

  this.run = function () {

  };
}


// better way

var game = new Game(["road_bike_480.mp4", "test_480.mp4", "mountain_2_480.mp4"],
  'total-points');
game.run();


// worse way

var game = {
    dist: 0
  , finish: 950
  , totalPoints: 0
  , targetVelo: 10
  , timeoutinProgress: false
  , revs: undefined
  , video: undefined
  , run: function () {
    game.dist = adsf;
  }
}
game.run()