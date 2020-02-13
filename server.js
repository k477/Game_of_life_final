var express = require('express');
var path = require('path');
var app = express();
var Flower = require('./public/flower.js');
var GrassEater = require('./public/grass_eater.js');
var Grass = require('./public/grass.js');
var Predator = require('./public/predator.js');
var Mower = require('./public/mower.js');
var Girl = require('./public/girl.js');

let file  = "statistics.json";
let matrixSize = 80;
grassArr = [];
grassEaterArr = [];
predatorArr = [];
flowerArr = [];
mowerArr = [];
girlArr = [];

flowerCount = 0;
grassEaterCount = 0;
grassCount = 0;
predatorCount = 0;
mowerCount = 0;
girlCount = 0;

 counts = [];
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');

app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')));

var server = server.listen(app.get('port'), function () {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});
matrix = [];
currentWeather = 'Spring';

function random(min, max) {
  return Math.floor(Math.random() * max) + min;
}

function matrixGenerator(matrixSize, grassCount, grassEaterCount, predatorCount, flowerCount, girlCount, mowerCount) {
  for (let index = 0; index < matrixSize; index++) {
    matrix[index] = [];
    for (let i = 0; i < matrixSize; i++) {
      matrix[index][i] = 0;
    }
  }
  function action(count, number) {
    for (let index = 0; index < count; index++) {
      let x = Math.floor(random(0, matrixSize));
      let y = Math.floor(random(0, matrixSize));
      matrix[y][x] = number;
    }
  }
  action(grassCount, 1);
  action(grassEaterCount, 2);
  action(predatorCount, 3);
  action(flowerCount, 4);
  action(girlCount, 5);
  action(mowerCount, 6);

}

function createCreatures() {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] == 1) {
        let grass = new Grass(x, y);
        grassArr.push(grass);
        grassCount++;
      }
      else if (matrix[y][x] == 2) {
        let grassEater = new GrassEater(x, y);
        grassEaterArr.push(grassEater);
        grassEaterCount++;
      }
      else if (matrix[y][x] == 3) {
        let predator = new Predator(x, y);
        predatorArr.push(predator);
        predatorCount++;
      }
      else if (matrix[y][x] == 4) {
        let flower = new Flower(x, y);
        flowerArr.push(flower);
        flowerCount++;
      }
      else if (matrix[y][x] == 5) {
        let girl = new Girl(x, y);
        girlArr.push(girl);
        girlCount++;
      }
      else if (matrix[y][x] == 6) {
        let mower = new Mower(x, y);
        mowerArr.push(mower);
        mowerCount++;
      }
    }
  }
}

function changeWeather() {
  switch (currentWeather) {
    case 'Spring': currentWeather = 'Summer'; break;
    case 'Summer': currentWeather = 'Autumn'; break;
    case 'Autumn': currentWeather = 'Winter'; break;
    case 'Winter': currentWeather = 'Spring';
  }
}

function creator() {
  for (let i = 0; i < 5; i++) {
    let x = Math.floor(random(0, matrixSize));
    let y = Math.floor(random(0, matrixSize));
    matrix[y][x] = 1;
    let grass = new Grass(x, y);
    grassArr.push(grass);
    grassCount++;

    x = Math.floor(random(0, matrixSize));
    y = Math.floor(random(0, matrixSize));
    matrix[y][x] = 2;
    let grassEater = new GrassEater(x, y);
    grassEaterArr.push(grassEater);
    grassEaterCount++;

    x = Math.floor(random(0, matrixSize));
    y = Math.floor(random(0, matrixSize));
    matrix[y][x] = 3;
    let predator = new Predator(x, y);
    predatorArr.push(predator);
    predatorCount++;

    x = Math.floor(random(0, matrixSize));
    y = Math.floor(random(0, matrixSize));
    matrix[y][x] = 4;
    let flower = new Flower(x, y);
    flowerArr.push(flower);
    flowerCount++;

    x = Math.floor(random(0, matrixSize));
    y = Math.floor(random(0, matrixSize));
    matrix[y][x] = 5;
    let girl = new Girl(x, y);
    girlArr.push(girl);
    girlCount++;

    x = Math.floor(random(0, matrixSize));
    y = Math.floor(random(0, matrixSize));
    matrix[y][x] = 6;
    let mower = new Mower(x, y);
    mowerArr.push(mower);
    mowerCount++;
  }
}
function virus() {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] == 3) {
        matrix[y][x] = 0;
        predatorCount--;
      }
    }
  }

}

function actionFromServer() {
  for (let index = 0; index < grassArr.length; index++) {
    grassArr[index].mul();
  }
  for (let index = 0; index < grassEaterArr.length; index++) {
    grassEaterArr[index].eat();
  }
  for (let index = 0; index < predatorArr.length; index++) {
    predatorArr[index].eat();
  }
  for (let index = 0; index < flowerArr.length; index++) {
    flowerArr[index].mul();
  }

  for (let index = 0; index < girlArr.length; index++) {
    girlArr[index].pick();
  }

  for (let index = 0; index < mowerArr.length; index++) {
    mowerArr[index].mow();
  }



  if (currentWeather === 'Spring') {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x] === 1) {
          matrix[y][x] = 7;
        }
      }
    }
  }
  else if (currentWeather === 'Summer') {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x] === 7) {
          matrix[y][x] = 1;
        }
      }
    }
  }

  io.sockets.emit('sending_matrix', matrix);
}

matrixGenerator(80, 800, 50, 50, 30, 20, 15);
createCreatures();

io.on('connection', function (socket) {
  socket.on('call_creator', function (res) {
    creator();
    res(matrix);
  });
  counts.push(`grassCount: ${grassCount}`);
  counts.push(`grassEaterCount: ${grassEaterCount}`);
  counts.push(`predatorCount: ${predatorCount}`);
  counts.push(`flowerCount: ${flowerCount}`);
  counts.push(`girlCount: ${girlCount}`);
  counts.push(`mowerCount: ${mowerCount}`);

  fs.writeFileSync(file, JSON.stringify(counts));

  socket.on('call_virus', function (res) {
    virus();
    res(matrix);
  });


});


setInterval(() => {
  io.sockets.emit("sending_weather", currentWeather);
  changeWeather();
}, 6000);

setInterval(actionFromServer, 2000);