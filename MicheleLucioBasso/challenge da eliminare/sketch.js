// Variabili per contenere i dati dei tre droni (tabelle)
let tableAlfa; 
let tableBravo; 
let tableCharlie; 

// Costante per lo spazio dai bordi
const MARGINE = 50; 

let minTempo, maxTempo; // Range per l'asse X (Tempo)
let minZ, maxZ;       // Range per l'asse Y (Posizione Z)

// 1. PRELOAD: Carica tutti i dati prima di tutto
function preload() {
  // Carica i file CSV per tutti i droni
  tableAlfa = loadTable('drone_alfa_data.csv', 'csv', 'header');
  tableBravo = loadTable('drone_bravo_data.csv', 'csv', 'header');
  tableCharlie = loadTable('drone_charlie_data.csv', 'csv', 'header');
}

// 2. SETUP: Imposta l'area di disegno e calcola i limiti dei dati
function setup() {
  // Imposta la dimensione del canvas per coprire l'intera finestra del browser
  createCanvas(windowWidth, windowHeight); 
  
  // --- CALCOLO DEI LIMITI GLOBALI (per scalare correttamente tutti i droni) ---
  
  // Raccogli tutti i valori di Tempo da tutte le tabelle
  let allTempo = [
    ...tableAlfa.getColumn('timestamp'),
    ...tableBravo.getColumn('timestamp'),
    ...tableCharlie.getColumn('timestamp')
  ];
  
  // Raccogli tutti i valori di Posizione Z da tutte le tabelle
  let allZ = [
    ...tableAlfa.getColumn('z_pos'),
    ...tableBravo.getColumn('z_pos'),
    ...tableCharlie.getColumn('z_pos')
  ];
  
  // Calcola i valori minimi e massimi globali
  minTempo = min(allTempo);
  maxTempo = max(allTempo);
  
  // Aggiungiamo un piccolo buffer (+/- 0.01) a Z per non attaccare la linea al bordo
  minZ = min(allZ) - 0.01; 
  maxZ = max(allZ) + 0.01;
  
  noLoop(); // Disegna solo una volta, perché i dati sono statici
}

// Funzione ausiliaria per disegnare la linea di un drone specifico
// Riceve la tabella dei dati e il colore della linea
function drawDroneLine(dataTable, colorR, colorG, colorB) {
  
  // Calcola l'area effettiva dove disegnare la linea del grafico
  let areaGraficoW = width - 2 * MARGINE;
  let areaGraficoH = height - 2 * MARGINE;

  noFill();
  stroke(colorR, colorG, colorB); // Imposta il colore della linea
  strokeWeight(3); 
  
  beginShape(); // Inizia a tracciare la linea
  
  // Itera su ogni riga di dati nella tabella fornita
  for (let i = 0; i < dataTable.getRowCount(); i++) {
    // 1. Ottieni i valori grezzi
    let tempo = dataTable.getNum(i, 'timestamp');
    let zPos = dataTable.getNum(i, 'z_pos');
    
    // 2. Mappa i valori dei dati alle coordinate del canvas (pixel)
    
    // Asse X (Tempo): Mappa da [minTempo, maxTempo] a [MARGINE, MARGINE + areaGraficoW]
    let x = map(tempo, minTempo, maxTempo, MARGINE, MARGINE + areaGraficoW);
    
    // Asse Y (Posizione Z): Mappa da [minZ, maxZ] a [MARGINE + areaGraficoH, MARGINE]
    let y = map(zPos, minZ, maxZ, MARGINE + areaGraficoH, MARGINE);
    
    // 3. Aggiunge il punto (x, y) alla linea del grafico
    vertex(x, y);
  }
  
  endShape(); // Finisce di disegnare la linea
}

// 3. DRAW: Disegna il grafico con tutte le linee
function draw() {
  background(245); // Sfondo grigio molto chiaro
  
  // Calcola l'area effettiva dove disegnare la linea del grafico
  let areaGraficoW = width - 2 * MARGINE;
  let areaGraficoH = height - 2 * MARGINE;
  
  // --- TITOLO E LEGENDA ---
  fill(50);
  textSize(24);
  textAlign(CENTER, TOP);
  text("Confronto Posizione Verticale (Z) dei Tre Droni nel Tempo", width / 2, 15);
  
  // Legenda
  textSize(14);
  textAlign(RIGHT, TOP);
  fill(0, 100, 200); text("Drone Alfa (Blu Ibrido)", width - MARGINE, 50);
  fill(0, 0, 255); text("Drone Bravo (Blu Scuro)", width - MARGINE, 70);
  fill(0, 100, 0); text("Drone Charlie (Verde Scuro)", width - MARGINE, 90);
  
  
  // --- DISEGNO DELLE LINEE ---
  
  // 1. Drone Alfa (Blu Ibrido)
  drawDroneLine(tableAlfa, 0, 100, 200); 
  
  // 2. Drone Bravo (Blu Scuro)
  drawDroneLine(tableBravo, 0, 0, 255); 
  
  // 3. Drone Charlie (Verde Scuro)
  drawDroneLine(tableCharlie, 0, 100, 0); 
  
  
  // --- DISEGNO DEGLI ASSI E ETICHETTE (RIMANE UGUALE) ---
  
  stroke(150); // Colore grigio per gli assi
  strokeWeight(1);
  
  // Asse X (Tempo): Disegna la linea orizzontale
  line(MARGINE, height - MARGINE, width - MARGINE, height - MARGINE);
  
  // Asse Y (Posizione Z): Disegna la linea verticale
  line(MARGINE, MARGINE, MARGINE, height - MARGINE);
  
  // Etichetta Asse X
  fill(50);
  textSize(14);
  textAlign(CENTER, TOP);
  text("Tempo (sec)", width / 2, height - MARGINE + 20);
  
  // Etichetta Asse Y (Posizione Z)
  push(); // Salva le impostazioni attuali
  translate(15, height / 2); // Sposta l'origine per ruotare
  rotate(-HALF_PI); // Ruota il testo
  textAlign(CENTER, CENTER);
  text("Posizione Z (m)", 0, 0);
  pop(); // Ripristina le impostazioni
  
  // Etichette Min/Max sui bordi
  textSize(10);
  fill(0);
  
  // Min Z (Basso a sinistra)
  textAlign(RIGHT, BOTTOM);
  text(nf(minZ, 0, 2), MARGINE - 5, height - MARGINE); 
  
  // Max Z (Alto a sinistra)
  textAlign(RIGHT, TOP);
  text(nf(maxZ, 0, 2), MARGINE - 5, MARGINE); 
  
  // Min Tempo (Basso a sinistra)
  textAlign(LEFT, TOP);
  text(nf(minTempo, 0, 2), MARGINE, height - MARGINE + 5); 
  
  // Max Tempo (Basso a destra)
  textAlign(RIGHT, TOP);
  text(nf(maxTempo, 0, 2), width - MARGINE, height - MARGINE + 5);
}

// Funzione per ridisegnare il grafico se la finestra viene ridimensionata
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw(); // Forza il disegno per adattare il grafico al nuovo spazio
}
