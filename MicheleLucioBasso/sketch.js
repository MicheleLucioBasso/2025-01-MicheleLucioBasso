function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#39ae16ff");

}

function draw() {

push();

fill("#4b00eeff");
circle(width/2, height/2, 48); //media colonna0

pop();

push();

  fill("#ff0000ff");
  rect(width/4, height/2, 55, 55); //deviazione standard colonna1

pop();

push();

  fill("#000000ff");
  text("Moda column2 = -98", 20, 50); //moda colonna2

  fill("#ffffffff");
  text("Mediana column3 = -18", 20, 80); //mediana colonna3

  fill("#00e5ffff");
  ellipse(width/6, height/2, 58, 1); //media e deviazione standard colonna4

pop();
}
