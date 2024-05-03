const { createServer } = require('node:http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

let jsonDataM= null
let jsonDataI= null

const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'POST' && req.url === '/postDeplacementM') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const jsonData = JSON.parse(body);
        console.log('Données JSON reçues du client Minetest :', jsonData);
        saveDataM(jsonData);
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
  } else if (req.method === 'GET' && req.url === '/getDeplacementM') {
    try {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(jsonDataM);
    } catch (error) {
      console.error('Erreur lors de l\'analyse du JSON :', error);
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Erreur lors de l\'analyse du JSON');
    }
  }
  else if (req.method === 'POST' && req.url === '/postDeplacementI') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          console.log('Données JSON reçues du client ITowns:', jsonData);
          saveDataI(jsonData);
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
  } else if (req.method === 'GET' && req.url === '/getDeplacementI') {
    try {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(jsonDataI);
    } catch (error) {
      console.error('Erreur lors de l\'analyse du JSON :', error);
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Erreur lors de l\'analyse du JSON');
    }
  }else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Page non trouvée');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function saveDataM(data) {
  jsonDataM = JSON.stringify(data);
}

function saveDataI(data) {
  jsonDataI = JSON.stringify(data);
}
