let tabella;

function preload () {
  tabella = loadTable ("dataset.csv", "csv", "header")
}

function setup (){
  let margineEsterno = 20
   let spaziatura = 15;
  let dimensioneCella = 80;

  // CANVAS E GRIGLIA  COSTELLAZIONI
  let colonne = floor((windowWidth - margineEsterno * 2) / (dimensioneCella + spaziatura))
    // floor serve a arrotondare x difetto visto che divido 
    // larghezza schermo utilizzabile per dimensione celle, 
    // e se una viene divisa deve andare a capo
  let righe = ceil(tabella.getRowCount() / colonne);
    // le righe sono tante quanto righe tabella / colonne arrotondato x eccesso
  let altezzaTotale = margineEsterno * 2 + righe * dimensioneCella + (righe - 1) * spaziatura;
    // (se ho 8 righe, ci sono 7 spazi tra loro)
  createCanvas(windowWidth, altezzaTotale);
  background(10, 15, 30);


}