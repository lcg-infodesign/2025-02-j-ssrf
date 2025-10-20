let tabella;

function preload () {
  tabella = loadTable ("dataset.csv", "csv", "header")
}

function setup (){
  let margineEsterno = 30
  let spaziatura = 15;
  let dimensioneCella = 80

  // CANVAS E GRIGLIA  COSTELLAZIONI
  let colonne = floor((windowWidth - margineEsterno * 2) / (dimensioneCella + spaziatura))
    // floor serve arrotondare x difetto visto che divido 
    // larghezza schermo utilizzabile per dimensione celle, 
    // e se una viene divisa deve andare a capo
  let righe = ceil(tabella.getRowCount() / colonne)
    // le righe sono tante quanto righe tabella / colonne arrotondato x eccesso
  let larghezzaGriglia = colonne * dimensioneCella + (colonne - 1) * spaziatura;
    // calcolo larghezza effettiva griglia x centrarla
  let margineOrizzontale = (windowWidth - larghezzaGriglia) / 2;
    // calcolo nuovo margine 
    let altezzaTotale = margineEsterno * 2 + righe * dimensioneCella + (righe - 1) * spaziatura;
    // (se ho 8 righe, ci sono 7 spazi tra loro)
  createCanvas(windowWidth, altezzaTotale)
  background(10, 15, 30)

  // INIZIALIZZARE CONTATORI 
  let indiceColonna = 0;  // posizione nella griglia: quale colonna
  let indiceRiga = 0;     // posizione nella griglia: quale riga

  for (let rigaCSV = 0; rigaCSV < tabella.getRowCount(); rigaCSV++) {
    // parte codice all'interno di questo for eseguita per ogni riga della tabella CSV
    let dati = tabella.getRow(rigaCSV).obj
    // prendo riga numero "rigaCSV" da tabella, la converto in
    // oggetto Javascript e salvo tutto nella variabile dati
    
    // PRIMA VARIABILE: numero stelle
    let valoreStelle = dati["column0"]; // trovo valore della colonna 0 in questione
    let tutteStelle = tabella.getColumn("column0"); // raccolgo valori tutte le righe colonna 0
    let minStelle = min(tutteStelle); // definisco val. minimo colonna 0
    let maxStelle = max(tutteStelle); // definisco val. massimo colonna 0
    let numeroStelle = floor(map(valoreStelle, minStelle, maxStelle, 3, 9));
      // map --> "spalmare" intervallo tra minStelle e maxStelle su intervallo tra
      //  3 e 9, e poi trovare dove si posizione all'interno dell'intervalle 3-9 il valoreStelle, 
      // ovver il valore della funzione presa in cosnid.

    // SECONDA VARIABILE: luminosità stelle
    let valoreLuminosita = dati["column1"]; // stessa cosa sopra...
    let tutteLuminosita = tabella.getColumn("column1");
    let minLuminosita = min(tutteLuminosita);
    let maxLuminosita = max(tutteLuminosita);
    let luminosita = map(valoreLuminosita, minLuminosita, maxLuminosita, 0.4, 1);

    // TERZA VARIABILE: compattezza pos. stelle
    let valoreCompattezza = dati["column2"]; // stessa cosa sopra
    let tutteCompattezze = tabella.getColumn("column2")
    let minCompattezza = min(tutteCompattezze);
    let maxCompattezza = max(tutteCompattezze);
    let compattezza = map(valoreCompattezza, minCompattezza, maxCompattezza, 0.3, 0.8)

    // QUARTA VARIABILE: rotazione costellazione
    let valoreRotazione = dati["column3"];
    let tutteRotazioni = tabella.getColumn("column3");
    let minRotazione = min(tutteRotazioni);
    let maxRotazione = max(tutteRotazioni);
    let rotazione = map(valoreRotazione, minRotazione, maxRotazione, 0, TWO_PI);
    
    // QUINTA VARIABILE: scala costellazione
    let valoreScala = dati["column4"];
    let tutteScale = tabella.getColumn("column4");
    let minScala = min(tutteScale);
    let maxScala = max(tutteScale);
    let scala = map(valoreScala, minScala, maxScala, 0.6, 1.2);

    // CALCOLO POSIZIONE NELLA GRIGLIA
      let posizioneX = margineOrizzontale + indiceColonna * (dimensioneCella + spaziatura);
        // posizione x è uguale a margine esterno + n° colonna in cui si trova oggetto x 
       // spazio occupato da cella e spaziatur
      let posizioneY = margineEsterno + indiceRiga * (dimensioneCella + spaziatura)
      // stessa cosa...

    // Disegno costellazione
    disegnaCostellazione(posizioneX, posizioneY, dimensioneCella, numeroStelle, luminosita, compattezza, rotazione, scala, dati);
    // aggiungo dati x poterlo usare nella funzione per chiamare dati colonne di riga spefica
    
    // // Disegno bordo cella...
    // noFill();
    // stroke(255, 255, 255, 20); // bianco semi-trasparente
    // strokeWeight(1);
    // rect(posizioneX, posizioneY, dimensioneCella, dimensioneCella);

    // AGGIORNO CONTATORI
    // arrivati a questo punto del codice ho disegnato costellazione 
    // con suoi diversi parametri relativa a 1 riga tabella,
    // quindi devo aggiornare posizione nella griglia x prossima costellazione
    indiceColonna++; // a ogni iterazione indice colonna aumenta 1
    if (indiceColonna == colonne) {
      indiceColonna = 0;
      indiceRiga++;
      // se indicecolonna diventa uguale a numero colonne nella pagina torno a 0 e aggiungo 1 a indiceriga
    }
  }
}

// poi: def. funz disegnacost. che generi posizione casuale ma sempre stessa x stessi valori (RandomSeed...)
// mettendo ruota di "rotazione", scala di "scala" (prima traslate centro cella), 
// genera luminosità (cerchi concentrici sempre + opachi) in base "luminosità" !!! non so come :,(


function disegnaCostellazione (x, y, dimensione, numStelle, luminosita, compattezza, rotazione, scala, dati) {
  push () // altrimenti trasformazioni si accumulanoooooo (risolto problemone)

  translate(x + dimensione/2, y + dimensione/2);
  // faccio sì che trasformazioni avvengano attorno al centro o con centro il centro della cella

  rotate (rotazione);
  // ruoto di variabile rotazione trovata nel setup

  scale (scala)
  // stessa cosa, scalo di "scala"


  let stelle = []; // creo array in cui salvare dati x stelle

  // genero posizioni stelle casuali ma fisse, uso RandomSeed, quindi devo far sì che stessa combo valori
  // colonna 0,1,2,3,4 generi 1 numero univoco: valore colonna ha "riservate" due cifre n. univoco 
  randomSeed(dati["column0"] * 100000000 + dati["column1"] * 1000000 + dati["column2"] * 10000 + dati["column3"] * 100 + dati["column4"] * 1);

  // CICLO GENERO POSIZIONE E DIMENSIONE CASUALE
  // ( ma coerente con i parametri definiti prima)
  for (let i = 0; i < numStelle; i++) {

    // ripeti ciclo tante volte quante n. stelle della costellazione
    let angolo = random(TWO_PI)
    // creo angoli casuali lungo i quali "spingere" le stelle
    let estensione = dimensione * compattezza * 0.65; 
    // voglio che estensione dipenda da compattezza ma tenga in consid. la dimensione delle stelle
    // aggiungo 0,65 pk prima erano troppo sparse
    let distanza = random(estensione * 0.2, estensione);
    // quanto effettivamente "spingo" le stelle, dipende da variabile estensione 
    // cerco numero random tra estensione x 0,2 e estensione (20%-100%)
    
    // ora traduco questo ^ in coordinate
    let stellaX = cos(angolo) * distanza;
    // coseno uguale cat. adiacente fratto ipotenusa, distanza è ipotenusa
    // quindi c.a./i x i = c.a. che è quello orizzontale, quindi coordinata x
    let stellaY = sin(angolo) * distanza
    // seno è uguale a cateto opposto fratto ipotenusa, 
    // la distanza è appunto l'ipotenusa, 
    // quindi c.o/i x i = c.o che è uguale alla coordinata y

    let dimensioneStella = random(2, 5) * luminosita;
    // vogloi dimensione random ma comunque che dipende da luminosià
    
    stelle.push({x: stellaX, y: stellaY, dimensione: dimensioneStella});
    // pusho stella con sua posizione e dimensione nell'array creato prima
  }

  noStroke();

  // FINALMENTE DISEGNO LE STELLEEEE
  for (let i = 0; i < stelle.length; i++) {
    // ripeto ciclo per tutti gli elementi dell'array "stelle"
    let stella = stelle[i] // prendi elemento n 1 dell'array stelle 
    fill(255, 255, 240)
    circle(stella.x, stella.y, stella.dimensione); // uso dati generati 
  }

  pop ()
}

function draw () {
// blabliblabla 

}
