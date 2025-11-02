let xFlower;
let yFlower;

let xGirasole;
let yGirasole;

let r, g, b; //variabili colori

let angle; //angolo rotazione

function setup() {

    createCanvas(windowWidth, windowHeight);
    background("#66B2FF");

}

function draw() {

    xFlower = random(width);
    yFlower = random(height);
    angle = random(0, PI/4);
    rotate(angle);
    frameRate(2);

    //FIORE TONDO
    noStroke();
    r = random(255);
    g = random(0);
    b = random(255);
    if (mouseIsPressed === true) {
      fill(random(r = random(10), random(20), random(30)));
      circle(mouseX-25, mouseY, 100);
      circle(mouseX, mouseY-25, 100);
      circle(mouseX + 25, mouseY, 100);
      circle(mouseX, mouseY + 25, 100);
    } else {
      fill(r, g, b);
      circle(xFlower-25, yFlower, 100);
      circle(xFlower, yFlower-25, 100);
      circle(xFlower + 25, yFlower, 100);
      circle(xFlower, yFlower + 25, 100);
    }

push();

    if (mouseIsPressed === true) {
      stroke("black");
      fill("#FFFF66");
      circle(mouseX, mouseY, 70);
    } else {
      stroke("black");
      fill("#FFFF66");
      circle(xFlower, yFlower, 70);
    }

pop();

//FIORE GIALLO
push();

    xGirasole = random(width);
    yGirasole = random(height);

    fill("#FFFF00");
    ellipse(xGirasole + 20, yGirasole, 80, 20);
    ellipse(xGirasole -20, yGirasole, 80, 20);
    ellipse(xGirasole, yGirasole + 20, 20, 80);
    ellipse(xGirasole, yGirasole -20, 20, 80);
    
pop();

push();

    fill("#663300");
    circle(xGirasole, yGirasole, 40);

pop();

push();

textAlign(CENTER);
textStyle(32);
fill("#ffffff");
text('Tieni premuto il mouse');

pop();

}