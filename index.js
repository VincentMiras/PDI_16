// Retrieve the view container
const viewerDiv = document.getElementById('viewerDiv');

// Define the view geographic extent
itowns.proj4.defs(
    'EPSG:2154',
    '+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
);
// const coords = [669277.3032234103,670301.3032234103,6859450.014931593,6860474.014931593]
// coords.setFromValues(0,0,0)
let Xmin = 0;
let Xmax = 0;
let Ymin = 0;
let Ymax = 0;

let viewExtent;
let view;

function extrudeBuildings(properties) {
    return properties.hauteur;
}

function altitudeBuildings(properties) {
    return properties.altitude_minimale_sol;
}
function prendreEmprise() {
    fetch('http://127.0.0.1:3000/getDeplacementM')
        .then(response => response.json())
        .then(data => {
            // Stocker les données du fichier JSON dans la variable globale
            Xmin = data.xmin;
            Ymin = data.ymin;
            Xmax = data.xmax;
            Ymax = data.ymax;
            console.log(Xmin, Xmax, Ymin, Ymax);

            // Créer viewExtent une seule fois avec les données récupérées
            viewExtent = new itowns.Extent(
                'EPSG:2154',
                Xmin, Xmax,
                Ymin, Ymax  
            );

            // Reste du code pour la création de la vue itowns
            const placement = {
                coord: viewExtent.center(),
                tilt: 45,
                heading: 90,
                range: 1500,
            };

            // Create the planar view
            view = new itowns.PlanarView(viewerDiv, viewExtent, {
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

            const sourceM3D = new itowns.WFSSource({
                url: 'https://data.geopf.fr/wfs/ows?',
                version: '2.0.0',
                typeName: 'BDTOPO_V3:batiment',
                ipr: 'IGN',
                crs: 'EPSG:2154',
                extent: viewExtent,
                format: 'application/json',
            });
            
            
            const geometryLayer = new itowns.FeatureGeometryLayer('sourceM3D', {
                batchId: function (property, featureId) { return featureId; },
                crs: 'EPSG:2154',
                source: sourceM3D,
                style: {
                    fill: {
                        color: new itowns.THREE.Color(0x808080),
                        base_altitude: altitudeBuildings,
                        extrusion_height: extrudeBuildings,
                    }
                }});
            view.addLayer(geometryLayer);

            // Autres configurations de vue, création de couches, etc.
        })
        .catch(error => {
            console.error('Erreur lors de la création de la carte:', error);
        });
}

// Appeler la fonction prendreEmprise une seule fois pour initialiser la vue
prendreEmprise();



// attendre prendreEmprise()
setTimeout(() => {
// Fonction pour charger et afficher les données du fichier JSON
function chargerEtAfficherDonnees() {
    // Charger le fichier JSON
    fetch('http://127.0.0.1:3000/getDeplacementM')
        .then(response => response.json())
        .then(data => {
            // Stocker les données du fichier JSON dans la variable globale
            deplacement_minetest = data.deplacement_minetest;
            Xmin = data.xmin;
            Ymin = data.ymin;
            Xmax = data.xmax;
            Ymax = data.ymax;

            yaw =data.yaw*Math.PI/180;
            pitch =data.pitch*Math.PI/180;
            roll = 0;
            rota = new THREE.Euler(yaw, pitch, roll, 'ZYX');
            view.camera3D.setRotationFromEuler(rota);
            
            //on suppose qu'il faut tourner la caméra car on pointe sur la map quand on regarde l'horizon sur le jeu
            view.camera3D.rotateX(Math.PI/2);
            //view.camera3D.rotateY(Math.PI/2);
            //view.camera3D.rotateZ(Math.PI/2);
            
            // cliquer pour voir la rotation dans la console
            viewerDiv.addEventListener('click', function() {
                // Code à exécuter lorsque l'événement de clic se produit
                console.log(view.camera3D.position);
                console.log(view.camera3D.rotation);
            });

            posz = data.position.y;
            posx = data.position.x;
            posy = data.position.z;

            pospre = view.camera3D.position;
            tranx = posx - pospre.x;
            trany = posy - pospre.y;
            tranz = posz - pospre.z;
            
            tran = new THREE.Vector3(tranx, trany, tranz);
            
            if (deplacement_minetest==true)
                view.camera3D.position.addVectors(pospre, tran);
                view.notifyChange(view.camera3D)    
        })
        .catch(error => {
            console.error('Erreur lors de la lecture du fichier JSON:', error);
        });
    }

chargerEtAfficherDonnees();

// Mettre à jour automatiquement les données toutes les 100 msecondes
setInterval(chargerEtAfficherDonnees, 100);


    
// Fonction pour charger et afficher les données du fichier JSON en utilisant une requête POST
function posterDonnees() {
    // Configurer les données à envoyer dans la requête POST
    const pData = {
        x:view.camera3D.position.x,
        y:view.camera3D.position.y,
        z:view.camera3D.position.z
    };

    // Configuration de la requête fetch avec la méthode POST et les données
    fetch('http://127.0.0.1:3000/postDeplacementI', {
        method: 'POST', // Spécifier la méthode POST
        headers: {
            'Content-Type': 'application/json' // Indiquer le type de contenu JSON
        },
        mode: 'no-cors',
        body: JSON.stringify(pData) // Convertir les données en format JSON pour le corps de la requête
    })
    .then(response => response.json())
    .then(data => {
        console.log('Données JSON post sur le serveur :', data);
    })
    .catch(error => {
        console.error('Erreur lors du post du fichier JSON:', error);
    });
}

// Modification des données dans le serveur
posterDonnees();

// Mettre à jour automatiquement les données toutes les 5 secondes
setInterval(posterDonnees, 3000);
}, 100);