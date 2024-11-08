import { UserRepository } from "../repositories/user.js"; // Importation du dépôt utilisateur pour récupérer les données de l'utilisateur
import JWT from 'jsonwebtoken'; // Importation du module JSON Web Token pour la vérification de jetons d'authentification

/**
 * Enregistre les middlewares d'authentification pour l'instance Fastify.
 * @param {FastifyInstance} fastify - L'instance Fastify à laquelle ajouter les middlewares d'authentification.
 */
export function registerAuthMiddlewares(fastify) {
    // Définition d'un middleware pour authentifier l'utilisateur
    fastify.decorate('authUser', async function (request, reply) {
        // Récupère l'en-tête d'autorisation de la requête
        const authHeader = request.headers['authorization'];
        
        // Si l'en-tête d'autorisation est absent, renvoie une réponse 401 (non autorisé)
        if (!authHeader) {
            reply.code(401).send({ error: 'Token not found' });
            return; // Interrompt le processus si le token est manquant
        }

        // Extrait le token en supprimant le préfixe 'Bearer '
        const token = authHeader.replace('Bearer ', '');

        console.log(token);
        try {
            // Vérifie la validité du token avec la clé secrète JWT
            const payload = JWT.verify(token, process.env.JWT_SECRET);
            
            // Récupère les informations de l'utilisateur en utilisant l'ID du payload
            const user = await UserRepository.getUserId(payload.id);
            
            // Si l'utilisateur n'est pas trouvé, renvoie une réponse 404 (non trouvé)
            if (!user) {
                reply.code(404).send({ error: 'User not found' });
                return;
            }
            
            // Assigne l'objet utilisateur à la requête pour un accès ultérieur dans le processus de requête
            request.user = user;
        } catch (err) {
            // En cas d'erreur de vérification du token, renvoie une réponse 401 (non autorisé) avec un message d'erreur
            reply.code(401).send({ error: 'invalid token' });
        }
    });
}
