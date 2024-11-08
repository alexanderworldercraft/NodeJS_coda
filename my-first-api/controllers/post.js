// Importation du PostRepository pour gérer les opérations sur les posts,
// ainsi que les DTOs pour la validation des schémas des requêtes et réponses
import { PostRepository } from "../repositories/post.js";
import { CreatePostDto, DeletePostDto, GetPostsDtos, UpdatePostDto } from "../dtos/PostDtos.js";

// Fonction pour enregistrer les routes de gestion des posts dans Fastify
export function registerPostRoutes(fastify) {

    /**
     * Route GET /posts pour récupérer une liste de posts avec pagination.
     * @query {number} page - Page courante pour la pagination (par défaut 1).
     * @query {number} limit - Limite d'éléments par page (par défaut 10).
     */
    fastify.get('/posts', { schema: GetPostsDtos }, async function getPosts(request, reply) {
        const page = request.query.page || 1; // Page courante, valeur par défaut 1
        const limit = request.query.limit || 10; // Limite d'éléments par page, valeur par défaut 10
        const posts = await PostRepository.getPosts(page, limit); // Récupère les posts paginés
        return reply.send(posts); // Envoie la liste des posts dans la réponse
    });

    /**
     * Route GET /posts/:id pour récupérer un post spécifique par son identifiant.
     * @param {number} id - Identifiant du post à récupérer.
     */
    fastify.get('/posts/:id', async function getPost(request, reply) {
        const id = parseInt(request.params.id); // Conversion de l'ID depuis les paramètres
        const post = await PostRepository.getPost(id); // Récupération du post par son ID
        if (!post) {
            // Renvoie une réponse 404 si le post n'est pas trouvé
            return reply.status(404).send({ error: 'Post not found' });
        }
        return reply.send(post); // Envoie le post trouvé dans la réponse
    });

    /**
     * Route POST /posts pour créer un nouveau post.
     * Validation avec le schéma CreatePostDto.
     * Nécessite une authentification préalable pour garantir que l'utilisateur est authentifié.
     */
    fastify.post('/posts', {
        preHandler: fastify.auth([fastify.authUser]), // Middleware d'authentification
        schema: CreatePostDto // Schéma pour valider les données de la requête
    }, async (request, reply) => {
        const { title, content, categories } = request.body; // Extraction des données du post depuis le corps de la requête
        const authorId = request.user.id; // Identifiant de l'auteur depuis l'utilisateur authentifié
        const newPost = await PostRepository.createPost(title, content, categories, authorId); // Création du post
        return reply.status(201).send(newPost); // Répond avec un statut 201 pour indiquer la création
    });

    /**
     * Route PUT /posts/:id pour mettre à jour un post existant.
     * Validation avec le schéma UpdatePostDto.
     * @param {number} id - Identifiant du post à mettre à jour.
     * Nécessite une authentification préalable.
     */
    fastify.put('/posts/:id', {
        preHandler: fastify.auth([fastify.authUser]), // Middleware d'authentification
        schema: UpdatePostDto // Schéma de validation pour les données de mise à jour
    }, async function updatePost(request, reply) {
        const id = parseInt(request.params.id); // Conversion de l'ID depuis les paramètres de la requête
        const { title, content, categories = [] } = request.body; // Valeur par défaut à tableau vide pour `categories`
        const updatedPost = await PostRepository.updatePost(id, { title, content }, categories); // Mise à jour du post
        if (!updatedPost) {
            return reply.status(404).send({ error: 'Post not found' }); // Erreur 404 si le post n'est pas trouvé
        }
        return reply.send(updatedPost); // Envoie le post mis à jour dans la réponse
    });

    /**
     * Route DELETE /posts/:id pour supprimer un post par son identifiant.
     * Validation avec le schéma DeletePostDto.
     * @param {number} id - Identifiant du post à supprimer.
     * Nécessite une authentification préalable pour vérifier les droits de suppression.
     */
    fastify.delete('/posts/:id', {
        preHandler: fastify.deletePostAuth, // Middleware d'authentification spécifique pour la suppression
        schema: DeletePostDto // Schéma pour valider la requête de suppression
    }, async function deletePost(request, reply) {
        const id = parseInt(request.params.id); // Conversion de l'ID depuis les paramètres
        const deletedPost = await PostRepository.deletePost(id); // Suppression du post par ID
        if (!deletedPost) {
            return reply.status(404).send({ error: 'Post not found' }); // Erreur 404 si le post n'est pas trouvé
        }
        return reply.send(deletedPost); // Envoie la confirmation de suppression dans la réponse
    });
}