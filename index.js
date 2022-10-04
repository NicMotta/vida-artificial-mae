let walker = [];
let totalWalkers;

let facemesh;
let video;
let predictions = [];

let pointsDistance = 0;
let startDraw = false;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight - 5);

  video = createCapture(VIDEO);
  video.size(width, height);

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on("predict", results => {
    predictions = results;
  });

  video.hide();

  totalWalkers = random(100, 1000)
  for (let i = 0; i < totalWalkers; i++){
    walker[i] = new Walker();
  }

  background(0);
}

function modelReady() {
  console.log("Model ready!");
  startDraw = true;
}

function draw() {
  fill(0, 1)
  rect(0, 0, window.innerWidth, window.innerHeight - 5)

  if (startDraw) {
    for (let i = 0; i < totalWalkers; i++){
      walker[i].step();
      walker[i].render();
    }
    drawKeypoints();
  }
}

class Walker {
  constructor(){
    this.x = random(width)
    this.y = random(height)
    this.s = 8
    this.c = color(random(0, 255), 0, random(0, 125), 50)
    this.c2 = color(random(0, 125), 0, random(0, 255), 50)
  }

  render() {
    noStroke();

    (pointsDistance < 50)
      ? fill(this.c2)
      : fill(this.c)

    ellipse(this.x, this.y, this.s, this.s)
  }

  step() {
    let randomSpeed

    (pointsDistance < 50)
      ? randomSpeed = 2
      : randomSpeed = 4
 
    let xStep = round(random(-randomSpeed, randomSpeed));
    let yStep = round(random(-randomSpeed, randomSpeed));
    this.x += xStep;
    this.y += yStep;
  }
}

function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const keypoints = predictions[i].scaledMesh;

    const [x, y] = keypoints[0] // punto superior boca
    const [x2, y2] = keypoints[15] // punto inferior boca
    pointsDistance = dist(x, y, x2, y2)
  }
}


function mouseClicked() {
  background(0)
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight - 5);
}