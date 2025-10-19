let tabella;

function preload () {
  tabella = loadTable ("dataset.csv", "csv", "header")
}

function setup (){
  let margineEsterno = 20
  let spaziatura = 15;
  let dimensioneCella = 80

  // CANVAS E GRIGLIA  COSTELLAZIONI
  let colonne = floor((windowWidth - margineEsterno * 2) / (dimensioneCella + spaziatura))
    // floor serve arrotondare x difetto visto che divido 
    // larghezza schermo utilizzabile per dimensione celle, 
    // e se una viene divisa deve andare a capo
  let righe = ceil(tabella.getRowCount() / colonne);
    // le righe sono tante quanto righe tabella / colonne arrotondato x eccesso
  let altezzaTotale = margineEsterno * 2 + righe * dimensioneCella + (righe - 1) * spaziatura;
    // (se ho 8 righe, ci sono 7 spazi tra loro)
  createCanvas(windowWidth, altezzaTotale);
  background(10, 15, 30);

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
    let posizioneX = margineEsterno + indiceColonna * (dimensioneCella + spaziatura);
      // posizione x è uguale a margine esterno + n° colonna in cui si trova oggetto x 
      // spazio occupato da cella e spaziatura
    let posizioneY = margineEsterno + indiceRiga * (dimensioneCella + spaziatura)
      // stessa cosa...

    // Disegno costellazione
    disegnaCostellazione (posizioneX, posizioneY, dimensioneCella, numeroStelle, luminosita, compattezza, rotazione, scala);

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
// genera luminosità (cerchi concentrici sempre + opachi) in base "luminosità"
