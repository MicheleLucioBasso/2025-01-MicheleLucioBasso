let xMax = 600;
let yMax = 600;
let xMin = 0;
let yMin = 0;

let xFlower;
let yFlower;

let xGirasole;
let yGirasole;

let r, g, b; //variabili colori

let angle; //angolo rotazione

function setup() {

    createCanvas(xMax, yMax);
    background("#66B2FF");

}

function draw() {

    xFlower = random(xMin, xMax);
    yFlower = random(yMin, yMax);
    angle = random(0, PI/4);
    rotate(angle);
    frameRate(2);
    //FIORE BIANCO
    noStroke();
    r = random(255);
    g = random(0);
    b = random(255);
    fill(r, g, b);
    circle(xFlower-25, yFlower, 100);
    circle(xFlower, yFlower-25, 100);
    circle(xFlower + 25, yFlower, 100);
    circle(xFlower, yFlower + 25, 100);

push();

    stroke("black");
    fill("#FFFF66");
    circle(xFlower, yFlower, 70);

pop();

push();

    xGirasole = random(xMin, xMax);
    yGirasole = random(yMin, yMax);

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

}