// Importation du module 'https' pour effectuer des requêtes HTTPS externes
const https = require('https');
// Importation du module 'fs' pour interagir avec le système de fichiers
const fs = require('fs');
// Importation du module 'readline' pour gérer l'entrée utilisateur via la console
const readline = require('readline');

// Création d'une interface pour capturer les entrées et sorties de la console
const input = readline.createInterface({
    input: process.stdin,  // Définit l'entrée standard (clavier)
    output: process.stdout // Définit la sortie standard (console)
});

// Fonction pour poser une question à l'utilisateur
function askQuestion(){
    // Pose une question via la console et attend la réponse de l'utilisateur
    input.question('De quelle couleur est le cheval blanc d\'henri IV ?', (answer) => {
        // Vérifie si la réponse est "blanc"
        if (answer === "blanc") {
            console.log("Bravo, tu as trouvé."); // Message de validation de la réponse correcte
            callApi(); // Appel de l'API en cas de bonne réponse
            input.close(); // Fermeture de l'interface d'entrée
        } else {
            console.log("Bah non, il est blanc, regarde la question."); // Message en cas de mauvaise réponse
            input.close(); // Fermeture de l'interface d'entrée
        }
    });
}

// Appel initial pour poser la question à l'utilisateur
askQuestion();

// Fonction pour appeler une API externe et récupérer des données
function callApi(){
    // Envoie une requête HTTPS GET à l'API 'randomuser.me'
    https.get('https://randomuser.me/api/', (resq) => {
        let data = ''; // Variable pour accumuler les données reçues par l'API
        // Réception des données par morceaux (chunks)
        resq.on('data', (chunk) => {
            data += chunk; // Ajoute chaque morceau de données reçu
        });
        // Une fois toutes les données reçues
        resq.on('end', () => {
            saveFile(data); // Appel de la fonction pour sauvegarder les données
        });
    });
};

// Fonction pour sauvegarder le contenu dans un fichier JSON
function saveFile(content){
    const d = new Date(); // Création d'un objet Date pour obtenir l'horodatage actuel
    // Sauvegarde du contenu dans un fichier nommé 'randomuser-<timestamp>.json'
    fs.writeFile(`randomuser-${d.getTime()}.json`, content, (err) => {
        if (err) { // Vérifie s'il y a une erreur lors de l'écriture du fichier
            throw err; // Lance une exception si une erreur se produit
        }
        console.log('L\'utilisateur a été enregistré!'); // Confirme la sauvegarde réussie dans la console
    });
}