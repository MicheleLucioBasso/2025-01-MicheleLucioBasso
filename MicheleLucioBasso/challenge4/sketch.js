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
  
  minTempo = min(tableAlfa.getColumn('timestamp')); //valori minimi e massimi di tempo e posizione Z
  maxTempo = max(tableAlfa.getColumn('timestamp'));
  
  minZ = min(tableAlfa.getColumn('z_pos')); 
  maxZ = max(tableAlfa.getColumn('z_pos'));
  
}

function draw() {

  background("#fff700ff");
  
  let areaGraficoW = width - 2 * MARGINE; //area dove disegnata linea grafico
  let areaGraficoH = height - 2 * MARGINE;
  
  fill("#000000ff");
  textSize(24);
  textAlign(CENTER, TOP);
  text("Posizione verticale (Z) drone Alfa nel tempo", width / 2, 15);
  
  noFill();
  stroke("#ff0000ff"); //linea rossa
  strokeWeight(2);
  
  beginShape(); //inizia a tracciare linea, aggiunge vertici a forma personalizzata
  
  for (let i = 0; i < tableAlfa.getRowCount(); i++) { //itera su ogni riga dati
                                                      //inizia da i=0
                                                      //i < tableAlfa.getRowCount() restituisce numero totale righe (punti dati) nel file CSV, ciclo continua finché elaborato ultima riga
    // getNum() ottiene valori grezzi
    let tempo = tableAlfa.getNum(i, 'timestamp'); //i è numero riga corrente, 'timestamp' nome colonna tempo drone
    let zPos = tableAlfa.getNum(i, 'z_pos'); //i è numero riga corrente, 'z_pos' nome colonna posizioneZ drone
    
    // 2. Mappa i valori dei dati alle coordinate del canvas (pixel)
    
    let x = map(tempo, minTempo, maxTempo, MARGINE, MARGINE + areaGraficoW); //asse X
                                                                             //valore originale è tempo, compreso in intervallo tra minTempo e maxTempo, valore viene reinserito proporzionalmente in intervallo tra MARGINE e MARGINE + areaGraficoW
    
    // Asse Y (Posizione Z): Mappa da [minZ, maxZ] a [MARGINE + areaGraficoH, MARGINE]
    // L'asse Y è invertito in p5.js (0 è in alto), per questo i limiti sono invertiti.
    let y = map(zPos, minZ, maxZ, MARGINE + areaGraficoH, MARGINE); //asse y
                                                                    //valore originale è posZ, compreso in intervallo tra minZ e maxZ, valore viene reinserito proporzionalmente in intervallo tra MARGINE + areaGraficoH e MARGINE
    
    vertex(x, y); //aggiunge punto (x, y) a linea grafico

  }
  
  endShape(); //finisce tracciare linea
    
  stroke("#000000ff"); //assi grafico
  strokeWeight(1);
  
  line(MARGINE, height - MARGINE, width - MARGINE, height - MARGINE); //asseX tempo
  
  line(MARGINE, MARGINE, MARGINE, height - MARGINE); //asseY posizione Z
  
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