// Importation des modules nécessaires : Fastify pour la création d'applications backend rapides,
// fastifyCors pour activer le CORS, ainsi que les routes pour les posts et l'authentification
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyAuth from "@fastify/auth";
import { registerPostRoutes } from "./controllers/post.js";
import { registerAuthRoutes } from "./controllers/auth.js";
import { registerCategoryRoutes } from "./controllers/category.js";
import { registerAuthMiddlewares } from "./middleware/auth.js";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

// Création d'une instance de Fastify avec le logger activé pour un suivi des requêtes et erreurs
const fastify = Fastify({
    logger: true, // Activation du logger pour journaliser les requêtes et les erreurs

    // Configuration de l'instance AJV (JSON Schema Validator) intégrée de Fastify
    ajv: {
        customOptions: { 
            removeAdditional: true // Supprime les propriétés non définies dans le schéma
        }
    }
});

// Enregistrement de la middleware d'authentification avant de définir les routes et les autres middlewares
await fastify.register(fastifyAuth);

// Enregistrement de la middleware CORS pour permettre les requêtes cross-origin
fastify.register(fastifyCors, {
    // Définition de l'origine : production uniquement depuis 'exemple.com', sinon accessible depuis n'importe où
    origin: process.env.NODE_ENV === 'production' ? 'exemple.com' : '*',
    // Autorisation des méthodes HTTP courantes et des requêtes OPTIONS (nécessaire pour CORS)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

// Enregistrement de la documentation Swagger avec Swagger-UI
await fastify.register(fastifySwagger, {
    openapi: {
        components: {
            securitySchemes: {
                token: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                }
            }
        },
    },
});

await fastify.register(fastifySwaggerUI, {
    routePrefix: '/documentation',
    uiconfig: {
        docExpansion: 'list'
    }
});



// Définition d'une route GET à la racine, qui retourne un message JSON simple pour tester le serveur
fastify.get('/', async function handler(request, reply) {
    return { hello: 'world' }; // Réponse JSON de bienvenue
});

// Enregistrement des routes spécifiques aux posts et à l'authentification
registerAuthMiddlewares(fastify);
registerPostRoutes(fastify);
registerAuthRoutes(fastify);
registerCategoryRoutes(fastify);

try {
    // Démarrage du serveur sur le port 3001
    await fastify.listen({ port: 3001 });
} catch (err) {
    // Log de l'erreur si le serveur échoue à démarrer, puis arrêt du processus
    fastify.log.error(err);
    process.exit(1);
}