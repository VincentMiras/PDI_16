// Retrieve the view container
const viewerDiv = document.getElementById('viewerDiv');

// Define the view geographic extent
itowns.proj4.defs(
    'EPSG:2154',
    '+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
);
// const coords = [669277.3032234103,670301.3032234103,6859450.014931593,6860474.014931593]
// coords.setFromValues(0,0,0)
const viewExtent = new itowns.Extent(
    'EPSG:2154',
    669277.3032234103,670301.3032234103,
    6859450.014931593,6860474.014931593,  
    // 644500.0, 659499.99,
    // 6857500.0, 6867499.99,
);

// Define the camera initial placement
const placement = {
    coord: viewExtent.center(),
    tilt: 45,
    heading: 90,
    range: 1500,
};

// Create the planar view
const view = new itowns.PlanarView(viewerDiv, viewExtent, {
    placement: placement,
});

// Define the source of the ortho-images
const sourceOrtho = new itowns.WMSSource({
    url: "https://data.geopf.fr/wms-r",
    name: "OI.OrthoimageCoverage.HR",
    format: "image/png",
    crs: 'EPSG:2154',
    extent: viewExtent,
});
// Create the ortho-images ColorLayer and add it to the view
const layerOrtho = new itowns.ColorLayer('Ortho', { source: sourceOrtho });
view.addLayer(layerOrtho);

// Define the source of the dem data
const sourceDEM = new itowns.WMSSource({
    url: "https://data.geopf.fr/wms-r",
    name: "ELEVATION.ELEVATIONGRIDCOVERAGE.HIGHRES",
    // name: "RGEALTI-MNT_PYR-ZIP_FXX_LAMB93_WMS",
    format: "image/x-bil;bits=32",
    crs: 'EPSG:2154',
    extent: viewExtent,
});
// Create the dem ElevationLayer and add it to the view
const layerDEM = new itowns.ElevationLayer('DEM', { source: sourceDEM });
view.addLayer(layerDEM);    

view.camera3D.position.set(669277.3032234103, 6859450.014931593, 100)

let tab = [];
let minColonneX = 0;
let minColonneY = 0;

// Fonction pour charger et afficher les données du fichier JSON
function chargerEtAfficherDonnees() {
    // Charger le fichier JSON
    fetch('geometry.dat')
        .then(response => response.json())
        .then(data => {
            // Stocker les données du fichier JSON dans la variable globale
            tab = data.coordinatesCarto;
            minColonneX = Math.min(...tab.map(coordonnee => coordonnee[0]));
            minColonneY = Math.min(...tab.map(coordonnee => coordonnee[1]));
           
        })
        .catch(error => {
            console.error('Erreur lors de la lecture du fichier JSON:', error);
        });
}

// Afficher les données initiales au chargement de la page
chargerEtAfficherDonnees();

// Mettre à jour automatiquement les données toutes les 5 secondes
setInterval(chargerEtAfficherDonnees, 3000);
