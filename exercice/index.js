const readline = require('readline');
const https = require('https');
const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

// Création de l'interface de lecture via readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Fonction pour demander l'URL à l'utilisateur
function askURL() {
    rl.question('Entrez une URL (ex: https://exemple.com) : ', (url) => {
        loadPage(url);
    });
}

// Fonction pour charger une page
function loadPage(url) {
    https.get(url, (res) => {
        let data = '';

        // Collecte des données de la réponse
        res.on('data', (chunk) => {
            data += chunk;
        });

        // Une fois toutes les données reçues, on parse la page
        res.on('end', () => {
            // Sauvegarder la page HTML localement
            savePage(data, url);
            // Analyser la page
            parsePage(data, url);
        });
    }).on('error', (err) => {
        console.error('Erreur de chargement:', err.message);
        askURL();
    });
}

// Fonction pour sauvegarder la page HTML
function savePage(html, url) {
    const fileName = `page-${new URL(url).hostname}.html`;
    fs.writeFile(fileName, html, (err) => {
        if (err) console.error('Erreur de sauvegarde:', err);
        else console.log(`Page sauvegardée sous le nom : ${fileName}`);
    });
}

// Fonction pour parser la page et afficher le titre, les liens, et les images
function parsePage(html, currentURL) {
    const $ = cheerio.load(html);

    // Afficher le titre de la page
    const title = $('title').text();
    console.log(`\nTitre de la page : ${title}\n`);

    // Récupérer et afficher tous les liens de la page
    const links = [];
    $('a').each((index, element) => {
        const href = $(element).attr('href');
        if (href) {
            links.push(href.startsWith('http') ? href : new URL(href, currentURL).href);
            console.log(`${index + 1}. ${links[links.length - 1]}`);
        }
    });

    // Lister les images
    const images = [];
    $('img').each((index, element) => {
        const src = $(element).attr('src');
        if (src) {
            images.push(src.startsWith('http') ? src : new URL(src, currentURL).href);
            console.log(`Image ${index + 1}: ${images[images.length - 1]}`);
        }
    });

    // Demander à l'utilisateur de choisir une option
    rl.question('Entrez "l" pour lister les liens, "i" pour choisir une image à télécharger, "q" pour quitter : ', (answer) => {
        if (answer.toLowerCase() === 'q') {
            rl.close();
        } else if (answer.toLowerCase() === 'l') {
            chooseLink(links);
        } else if (answer.toLowerCase() === 'i' && images.length > 0) {
            chooseImage(images);
        } else {
            console.log("Option invalide.");
            parsePage(html, currentURL);
        }
    });
}

// Fonction pour choisir un lien et naviguer
function chooseLink(links) {
    rl.question('Entrez le numéro du lien à suivre : ', (answer) => {
        const linkIndex = parseInt(answer) - 1;
        if (linkIndex >= 0 && linkIndex < links.length) {
            loadPage(links[linkIndex]);
        } else {
            console.log('Numéro invalide.');
            chooseLink(links);
        }
    });
}

// Fonction pour choisir et télécharger une image
function chooseImage(images) {
    rl.question('Entrez le numéro de l\'image à télécharger : ', (answer) => {
        const imgIndex = parseInt(answer) - 1;
        if (imgIndex >= 0 && imgIndex < images.length) {
            downloadImage(images[imgIndex]);
        } else {
            console.log('Numéro invalide.');
            chooseImage(images);
        }
    });
}

// Fonction pour télécharger une image
const crypto = require('crypto');

function downloadImage(url) {
    // Crée un nom de fichier sécurisé avec le nom de base de l'URL ou un hash si c'est trop long
    let fileName = path.basename(new URL(url).pathname);
    if (fileName.length > 100) { // Limite de longueur pour éviter les erreurs de nom trop long
        fileName = crypto.createHash('md5').update(url).digest('hex') + path.extname(fileName);
    }
    
    const file = fs.createWriteStream(fileName);
    https.get(url, (res) => {
        res.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Image téléchargée sous le nom : ${fileName}`);
        });
    }).on('error', (err) => {
        fs.unlink(fileName, () => {}); // Supprime le fichier en cas d'erreur
        console.error('Erreur de téléchargement:', err.message);
    });
}

// Démarrer le programme
askURL();