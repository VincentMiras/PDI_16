const { createServer } = require('node:http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/data') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const jsonData = JSON.parse(body);
        console.log('Données JSON reçues du client :', jsonData);

        // Sauvegarder les données dans un fichier sur le serveur
        saveData(jsonData);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Données JSON reçues et sauvegardées avec succès sur le serveur');
      } catch (error) {
        console.error('Erreur lors de l\'analyse du JSON :', error);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Erreur lors de l\'analyse du JSON');
      }
    });
  } else if (req.method === 'GET' && req.url === '/getdata') {
    // Renvoyer le contenu du fichier JSON sauvegardé sur le serveur en réponse à la requête GET
    fs.readFile('data.json', (err, data) => {
      if (err) {
        console.error('Erreur lors de la lecture du fichier JSON :', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Erreur lors de la lecture du fichier JSON');
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
      }
    });
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Page non trouvée');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function saveData(data) {
  const jsonData = JSON.stringify(data);
  fs.writeFile('data.json', jsonData, (err) => {
    if (err) {
      console.error('Erreur lors de la sauvegarde des données :', err);
    } else {
      console.log('Données sauvegardées avec succès sur le serveur');
    }
  });
}
