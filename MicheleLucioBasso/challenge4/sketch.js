let tableAlfa;
let tableBravo;
let tableCharlie; 

const MARGINE = 50; //spaziatura da bordi

let minTempo, maxTempo; //asse X (tempo)
let minZ, maxZ; //asse Y (posizione Z)

function preload() {

  tableAlfa = loadTable('drone_alfa_data.csv', 'csv', 'header');
  tableBravo = loadTable('drone_bravo_data.csv', 'csv', 'header');
  tableCharlie = loadTable('drone_charlie_data.csv', 'csv', 'header');
}

function setup() {

  createCanvas(windowWidth, windowHeight);

  let allTempo = [
    ...tableAlfa.getColumn('timestamp'), //... davanti a array in parentesi quadre [], l'operatore "espande" o "scompatta" tutti elementi di quell'array
                                         //getColumn('timestamp') estrae tutti valori nella colonna timestamp in array allTempo
    ...tableBravo.getColumn('timestamp'),
    ...tableCharlie.getColumn('timestamp')
  ];

  let allZ = [
    ...tableAlfa.getColumn('z_pos'), //getColumn('z_pos') estrae tutti valori nella colonna z_pos in array allZ
    ...tableBravo.getColumn('z_pos'),
    ...tableCharlie.getColumn('z_pos')
  ];
  
  minTempo = min(allTempo); //valori minimi e massimi di tempo e posizione Z
  maxTempo = max(allTempo);
  
  minZ = min(allZ); 
  maxZ = max(allZ);
  
}

function drawDroneLine(dataTable, colorDrone) { //disegna linea di un drone ricevendo tabella dati e colore

  let areaGraficoW = width - 2 * MARGINE; //calcola area dove disegnare linea grafico
  let areaGraficoH = height - 2 * MARGINE;

  noFill();
  stroke(colorDrone); //imposta colore linea
  strokeWeight(2); 
  
  beginShape(); //inizia a tracciare linea, aggiunge vertici a forma personalizzata

  for (let i = 0; i < dataTable.getRowCount(); i++) { //itera su ogni riga dati
                                                      //inizia da i=0
                                                      //i < dataTable.getRowCount() restituisce numero totale righe (punti dati) nel file CSV, ciclo continua finché elaborato ultima riga
    let tempo = dataTable.getNum(i, 'timestamp'); //i è numero riga corrente, 'timestamp' nome colonna tempo drone
    let zPos = dataTable.getNum(i, 'z_pos'); //i è numero riga corrente, 'z_pos' nome colonna posizione Z drone
        
    let x = map(tempo, minTempo, maxTempo, MARGINE, MARGINE + areaGraficoW); //asse X
                                                                             //valore originale è tempo, compreso in intervallo tra minTempo e maxTempo, valore viene reinserito proporzionalmente in intervallo tra MARGINE e MARGINE + areaGraficoW
    let y = map(zPos, minZ, maxZ, MARGINE + areaGraficoH, MARGINE); //asse Y
                                                                    //valore originale è tempo, compreso in intervallo tra minZ e maxZ, valore viene reinserito proporzionalmente in intervallo tra MARGINE + areaGraficoH e MARGINE
    vertex(x, y); //aggiunge punto (x, y) a linea grafico
  }
  
  endShape(); //finisce disegnare linea
}

function draw() {

  background("#fff700ff");
  
  let areaGraficoW = width - 2 * MARGINE; //area dove disegnata linea grafico
  let areaGraficoH = height - 2 * MARGINE;
  
  noStroke();
  fill("#000000ff");
  textSize(24);
  textAlign(CENTER, TOP);
  text("Confronto posizione verticale (Z) dei 3 droni nel tempo", width / 2, 15);
  
  noStroke();
  textSize(14);
  textAlign(RIGHT, TOP);
  fill("#ff0000ff"); text("Drone Alfa", width - MARGINE, 50);
  fill("#003cffff"); text("Drone Bravo", width - MARGINE, 70);
  fill("#13ba23ff"); text("Drone Charlie", width - MARGINE, 90);

  drawDroneLine(tableAlfa, "#ff0000ff"); //linea drone Alfa
  drawDroneLine(tableBravo, "#003cffff"); //linea drone Bravo
  drawDroneLine(tableCharlie, "#13ba23ff"); //linea drone Charlie

  stroke("#000000ff"); //assi grafico
  strokeWeight(1);
  
  line(MARGINE, height - MARGINE, width - MARGINE, height - MARGINE); //asseX tempo
  
  line(MARGINE, MARGINE, MARGINE, height - MARGINE); //asseY posizione Z
  
  noStroke();
  fill("#000000ff");
  textSize(14);
  textAlign(CENTER, TOP);
  text("Tempo (sec)", width / 2, height - MARGINE + 20);
  
  push();

  translate(15, height / 2); //spostamento origine per ruotare
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text("Posizione Z (m)", 0, 0);

  pop();

  textSize(10);
  fill("#000000ff");
  
  textAlign(RIGHT, BOTTOM); //numero minimo asseY, posizioneZ
  text(nf(minZ, 0, 2), MARGINE - 5, height - MARGINE); 
  
  textAlign(RIGHT, TOP); //numero massimo asseY, posizioneZ
  text(nf(maxZ, 0, 2), MARGINE - 5, MARGINE); 
  
  textAlign(LEFT, TOP); //numero minimo asseX, minimo tempo
  text(nf(minTempo, 0, 2), MARGINE, height - MARGINE + 5); 
  
  textAlign(RIGHT, TOP); //numero massimo asseX, massimo tempo
  text(nf(maxTempo, 0, 2), width - MARGINE, height - MARGINE + 5);
  
}

function windowResized() { //per ridisegnare grafico se finestra ridimensionata
  resizeCanvas(windowWidth, windowHeight);
  redraw(); //noLoop() dice a p5 disegnare grafico una sola volta
            //redraw(); forza iridisegno grafico nel nuovo spazio
}