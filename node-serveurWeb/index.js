// Importation du module 'http' pour créer un serveur HTTP
const http = require('http');

// Déclaration des routes avec les différentes méthodes HTTP associées
const routes = {
    '/hello': {
        // Route GET pour '/hello' : répond avec un message "hello" et le nom fourni en paramètre
        GET: function (request, response) {
            // Récupération du paramètre 'name' de la requête ou utilisation de 'world' par défaut
            const name = request.query.name || 'world';
            // En-tête de la réponse avec un statut HTTP 200 et le type de contenu texte brut
            response.writeHead(200, { 'content-Type': 'text/plain' });
            // Envoi de la réponse avec le message "hello" suivi du nom
            response.end('hello ' + name);
        }
    },
    '/goodbye': function (request, response) {
        // Route GET pour '/goodbye' : répond avec un message "Good bye world!"
        response.writeHead(200, { 'content-Type': 'text/plain' });
        response.end('Good bye world !');
    },
    '/data': {
        // Route POST pour '/data' : accepte des données JSON, ajoute un champ 'success', et renvoie les données
        POST: function (request, response) {
            const body = request.body; // Récupération du corps de la requête
            body.success = true; // Ajout d'un champ 'success' pour indiquer la réussite de l'opération
            // En-tête de la réponse avec un statut HTTP 200 et le type de contenu JSON
            response.writeHead(200, { 'content-Type': 'application/json' });
            // Envoi de la réponse avec le corps de la requête en format JSON
            response.end(JSON.stringify(request.body, null, 2));
        }
    }
}

// Fonction pour analyser les paramètres de la requête (query string) et les ajouter à l'objet 'request'
function parseQuery(request, response) {
    const queryString = request.url.split('?')[1]; // Extraction de la chaîne de requête
    let query = {}; // Initialisation d'un objet pour stocker les paramètres
    if (queryString) {
        // Transformation de la chaîne en objet clé-valeur
        query = queryString
            .split('&')
            .reduce((obj, param) => {
                const p = param.split('='); // Séparation de chaque paramètre en clé et valeur
                const key = p[0];
                const val = p[1];
                obj[key] = val;
                return obj;
            }, {});
    }
    request.query = query; // Ajout des paramètres de requête à l'objet 'request'
}

// Fonction pour analyser le corps de la requête et le traiter si c'est du JSON
function parseBody(request, response) {
    return new Promise((resolve, reject) => {
        let bodyStr = ''; // Initialisation de la chaîne pour stocker le corps de la requête
        request.on('data', function (chunk) {
            bodyStr += chunk; // Accumulation des fragments de données reçus
        });
        request.on('end', function () {
            if (request.headers['content-type'] === 'application/json') { // Vérification du type de contenu
                try {
                    request.body = JSON.parse(bodyStr); // Conversion du JSON en objet
                } catch (e) {
                    reject(e); // Gestion des erreurs de parsing JSON
                }
            }
            resolve(); // Résolution de la promesse après la fin de la lecture du corps
        });
    });
}

// Fonction middleware pour traiter les paramètres de requête et le corps de la requête
async function middlware(request, response) {
    parseQuery(request, response); // Traitement des paramètres de requête
    await parseBody(request, response); // Traitement du corps de la requête
}

// Création et démarrage du serveur HTTP
http.createServer(async function (request, response) {
    const path = request.url.split('?')[0]; // Extraction du chemin de la requête sans les paramètres
    const handler = routes[path] ? routes[path][request.method] : null; // Sélection du gestionnaire de route

    if (handler) {
        // Si un gestionnaire est trouvé, on exécute le middleware puis le gestionnaire de route
        await middlware(request, response);
        handler(request, response);
    } else {
        // Si aucun gestionnaire trouvé, on renvoie une erreur 404
        response.writeHead(404, { 'content-Type': 'text/plain' });
        response.end('erreur 404');
    }
}).listen(3000); // Le serveur écoute sur le port 3000

// Logs pour indiquer les différentes URL de test dans la console
console.log('server running at http://127.0.0.1:3000/');
console.log('server test hello at http://127.0.0.1:3000/hello');
console.log('server test goodbye at http://127.0.0.1:3000/goodbye');
console.log('server test data (POST) at http://127.0.0.1:3000/data');