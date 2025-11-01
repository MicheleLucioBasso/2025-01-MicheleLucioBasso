// Variabili globali per i dati
let table; // Contiene la tabella caricata
let filteredData = []; // Righe che rispettano la condizione
let dataLoaded = false; // Flag per l'avvenuto caricamento e filtro

// Valori min/max necessari per la mappatura dei colori
let minCol0 = Infinity; // Minimo di column0 per il colore Rosso (Cerchio)
let maxCol0 = -Infinity; // Massimo di column0
let minCol1 = Infinity; // Minimo di column1 per il colore Blu (Quadrato)
let maxCol1 = -Infinity; // Massimo di column1

// --- 1. PRELOAD: Caricamento Dati ---
function preload() {
  // Carica il file CSV, trattando la prima riga come intestazione
  table = loadTable('dataset.csv', 'csv', 'header');
}

// --- 2. SETUP: Filtraggio e Preparazione ---
function setup() {
  // Crea la tela a tutta finestra
  createCanvas(windowWidth, windowHeight);
  // Imposta lo sfondo Giallo come richiesto
  background(255, 255, 0); 
  
  noLoop(); // Disegna una sola volta (statico)

  // --- Processo di Filtraggio e Calcolo Min/Max ---
  
  for (let r = 0; r < table.getRowCount(); r++) {
    const row = table.getRow(r);
    
    // Recupera i valori numerici dalle colonne necessarie
    const column0 = row.getNum("column0");
    const column1 = row.getNum("column1");
    const column2 = row.getNum("column2");
    
    // CONDIZIONE DI FILTRAGGIO: column0 > 0 E column2 < 0
    if (column0 > 0 && column2 < 0) {
      
      // Salva i dati della riga filtrata (includendo column3 e column4)
      filteredData.push({
        col0: column0,
        col1: column1,
        col2: column2,
        col3: row.getNum("column3"),
        col4: row.getNum("column4")
      });
      
      // Aggiorna i valori min/max per le mappature dei colori
      if (column0 < minCol0) minCol0 = column0;
      if (column0 > maxCol0) maxCol0 = column0;
      if (column1 < minCol1) minCol1 = column1;
      if (column1 > maxCol1) maxCol1 = column1;
    }
  }

  // Se abbiamo trovato righe, il flag è pronto
  if (filteredData.length > 0) {
    dataLoaded = true;
  }
}

// --- 3. DRAW: Visualizzazione Grafica ---
function draw() {
  // Se i dati non sono pronti, mostra un messaggio
  if (!dataLoaded) {
    textSize(32);
    textAlign(CENTER);
    fill(0);
    text("Nessun dato trovato o dati non caricati. Controlla il dataset.csv.", width / 2, height / 2);
    return;
  }
  
  // Ridisegna lo sfondo Giallo
  background(255, 255, 0); 

  // --- Parametri di Layout e Posizionamento ---
  const glifPerRow = 15; // Glifi per riga
  const paddingX = 40; // Margine laterale
  const paddingY = 60; // Margine superiore
  
  // Calcola lo spazio massimo disponibile per ogni glifo
  const maxGlifSpace = (width - 2 * paddingX) / glifPerRow;
  // Usiamo questa dimensione come spaziatura per farli "attaccare"
  const glifSpacing = maxGlifSpace; 
  
  // Punti di partenza
  let currentX = paddingX + glifSpacing / 2;
  let currentY = paddingY;
  
  // Titolo
  textAlign(CENTER);
  textSize(28);
  fill(0);
  text("Famiglia di Glifi Filtrati (Colonna 0 > 0 E Colonna 2 < 0)", width / 2, 30);
  
  // Modalità colore HSB (Hue, Saturation, Brightness) per le sfumature
  // Range HSB: 0-100 per tutti i valori
  colorMode(HSB, 100);
  noStroke(); // Nessun bordo per le forme

  // Itera su tutti i dati filtrati
  for (let i = 0; i < filteredData.length; i++) {
    const data = filteredData[i];
    
    // --- MAPPATURA DEI VALORI SULLE PROPRIETÀ VISIVE ---

    // 1. DIMENSIONE CERCHIO (da column2): Mappa col2 (assumiamo range [-100, 100])
    // Usiamo il valore assoluto per la dimensione, limitata allo spazio disponibile.
    const circleSize = map(abs(data.col2), 0, 100, 10, maxGlifSpace * 0.9);
    
    // 2. DIMENSIONE QUADRATO (da column3): Mappa col3 (assumiamo range [-100, 100])
    const squareSize = map(abs(data.col3), 0, 100, 10, maxGlifSpace * 0.9);
    
    // 3. COLORE CERCHIO (Rosso, da column0): Mappa col0 sulla Saturazione
    // HUE 0 = Rosso. Saturazione 0 (chiaro/rosa) a 100 (scuro/rosso vivo).
    const redSaturation = map(data.col0, minCol0, maxCol0, 10, 100); // 10 come minimo per un po' di colore
    
    // 4. COLORE QUADRATO (Blu, da column1): Mappa col1 sulla Saturazione
    // HUE 60-70 = Blu. Saturazione 0 (chiaro/azzurrino) a 100 (scuro/blu vivo).
    const blueSaturation = map(data.col1, minCol1, maxCol1, 10, 100); 
    
    // 5. ROTAZIONE (da column4): Mappa col4 (assumiamo range [-100, 100]) in radianti
    // La rotazione influenzerà l'intero glifo (quadrato + cerchio)
    const rotationAngle = map(data.col4, -100, 100, -PI, PI, true); 

    
    // --- DISEGNO DEL GLIFO ---
    
    push(); // Inizia la trasformazione (salva la posizione e la rotazione attuali)
    
    // Trasla il punto di origine al centro del glifo
    translate(currentX, currentY + glifSpacing / 2);
    
    // Applica la rotazione all'intero glifo (cerchio e quadrato)
    rotate(rotationAngle);
    
    // 1. DISEGNA IL QUADRATO (Sfondo/Corpo)
    // HUE tra 60 e 70 è il blu. BRIGHTNESS a 100 per colori vivi.
    fill(65, blueSaturation, 100); 
    rectMode(CENTER);
    rect(0, 0, squareSize, squareSize); // Quadrato centrato (0, 0)

    // 2. DISEGNA IL CERCHIO (Sopra il quadrato/Testa)
    // HUE 0 è il rosso.
    fill(0, redSaturation, 100); 
    // Il cerchio è posizionato leggermente più in alto (coordinata Y negativa)
    // per non essere esattamente sovrapposto al centro, ma "attaccato" sopra.
    // Usiamo 0, 0 per farli sovrapporre, per semplicità e chiarezza.
    ellipse(0, 0, circleSize, circleSize); 
    
    pop(); // Ripristina lo stato precedente (annulla la rotazione e la traslazione)
    
    // --- AVANZAMENTO DEL CURSORE ---

    // Muovi a destra per il prossimo glifo
    currentX += glifSpacing;
    
    // Se la riga è piena (15 glifi), vai alla riga successiva
    if ((i + 1) % glifPerRow === 0) {
      currentY += glifSpacing; // Sposta Y in basso
      currentX = paddingX + glifSpacing / 2; // Riporta X all'inizio
      
      // Controllo di overflow: se la prossima riga esce dal canvas, ferma il disegno
      if (currentY + glifSpacing > height) {
        break; 
      }
    }
  }
}

// Funzione per gestire il ridimensionamento della finestra
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw(); // Forza il ridisegno per adattare i glifi
}
