import { UserRepository } from "../repositories/user.js"; // Importation du dépôt utilisateur pour accéder et manipuler les données utilisateur
import { CreateUserDto, LoginDto } from "../dtos/AuthDtos.js"; // Importation des schémas DTO pour la validation des requêtes d'authentification
import JWT from 'jsonwebtoken'; // Importation du module JWT pour la création de jetons d'authentification

import { createHash } from 'crypto'; // Importation de la fonction de hachage pour sécuriser les mots de passe

// Fonction principale pour enregistrer les routes d'authentification sur l'instance Fastify
export function registerAuthRoutes(fastify) {

    /**
     * Route POST /signup pour l'inscription d'un nouvel utilisateur.
     * Utilise le schéma CreateUserDto pour valider le corps de la requête.
     */
    fastify.post('/signup', { schema: CreateUserDto }, async function signup(request, reply) {
        const body = request.body; // Récupération des données envoyées dans le corps de la requête
        
        // Hashage du mot de passe avec un salt pour plus de sécurité
        body.password = createHash('sha1')
            .update(body.password + process.env.PASSWORD_SALT) // Ajout du salt pour renforcer le hachage
            .digest('hex'); // Conversion en hexadécimal du mot de passe haché
        
        // Création de l'utilisateur en base de données en utilisant les informations du corps de la requête
        return await UserRepository.createUser(body);
    });

    /**
     * Route POST /login pour authentifier un utilisateur existant.
     * Utilise le schéma LoginDto pour valider le corps de la requête.
     */
    fastify.post('/login', { schema: LoginDto }, async function login(request, reply) {
        const body = request.body; // Récupération des données envoyées dans le corps de la requête
        
        // Hashage du mot de passe envoyé pour le comparer avec le mot de passe stocké
        body.password = createHash('sha1')
            .update(body.password + process.env.PASSWORD_SALT) // Ajout du même salt utilisé lors de la création
            .digest('hex'); // Conversion en hexadécimal du mot de passe haché
        
        // Recherche de l'utilisateur par nom d'utilisateur et mot de passe haché
        const user = await UserRepository.getUserByCredentials(body.username, body.password);
        
        // Si l'utilisateur n'existe pas, déclenche une erreur pour indiquer des identifiants invalides
        if (!user) {
            throw new Error('invalid credentials'); // Erreur générique pour éviter de révéler trop d'informations
        }
        
        // Génération d'un token JWT pour l'utilisateur authentifié
        user.token = JWT.sign({ id: user.id }, process.env.JWT_SECRET); // Crée un jeton signé avec l'ID de l'utilisateur
        
        // Retourne un message de succès et les informations de l'utilisateur, y compris le token
        return { message: 'Login successful', user };
    });
}