/**
 * Enregistre le middleware de gestion des erreurs pour l'instance Fastify.
 * Ce middleware intercepte toutes les erreurs non gérées et renvoie une réponse standardisée.
 * @param {FastifyInstance} fastify - Instance de Fastify à laquelle ajouter le middleware de gestion des erreurs.
 */
export function registerErrorMiddleware(fastify) {
    // Définit le gestionnaire d'erreurs global
    fastify.setErrorHandler((error, request, reply) => {
        
        // Vérifie si l'erreur est une erreur de type "NotFoundError"
        if (error.name === "NotFoundError") {
            // Répond avec un statut 404 et un message d'erreur clair pour les ressources non trouvées
            reply.status(404).send({ ok: false, message: error.message });
        } else {
            // Log l'erreur complète dans la console pour débogage
            console.error(error);
            
            // Répond avec un statut 500 pour toutes les autres erreurs internes
            reply.status(500).send({ ok: false });
        }
    });
};