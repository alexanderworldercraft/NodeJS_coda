// Importation du CategoryRepository pour gérer les opérations sur les catégories
import { CategoryRepository } from "../repositories/category.js";
import { CreateCategoryDto, UpdateCategoryDto } from "../dtos/CategoryDtos.js"; // Importation des DTO pour la validation des données de requête

// Fonction pour enregistrer les routes de gestion des catégories dans Fastify
export function registerCategoryRoutes(fastify) {

    /**
     * Route GET /categories pour récupérer toutes les catégories.
     * Cette route retourne la liste complète des catégories disponibles.
     */
    fastify.get('/categories', async function getCategories(request, reply) {
        const categories = await CategoryRepository.getCategories(); // Récupération de toutes les catégories via le dépôt
        return reply.send(categories); // Envoie la liste des catégories dans la réponse
    });

    /**
     * Route GET /categories/:id pour récupérer une catégorie spécifique par son identifiant.
     * @param {number} id - Identifiant de la catégorie (extrait de l'URL)
     */
    fastify.get('/categories/:id', async function getCategoryById(request, reply) {
        const id = parseInt(request.params.id); // Extraction et conversion de l'ID depuis les paramètres de la requête
        const category = await CategoryRepository.getCategoryById(id); // Récupération de la catégorie par son ID
        if (!category) {
            return reply.status(404).send({ error: 'Category not found' }); // Répond avec une erreur 404 si la catégorie n'est pas trouvée
        }
        return reply.send(category); // Envoie la catégorie trouvée dans la réponse
    });

    /**
     * Route POST /categories pour créer une nouvelle catégorie.
     * Utilise le schéma CreateCategoryDto pour valider les données de la requête.
     */
    fastify.post('/categories', { schema: CreateCategoryDto }, async function createCategory(request, reply) {
        const { nom } = request.body; // Récupération du nom de la catégorie depuis le corps de la requête
        const newCategory = await CategoryRepository.createCategory(nom); // Création de la nouvelle catégorie
        return reply.status(201).send(newCategory); // Répond avec un statut 201 pour indiquer la création et envoie la catégorie créée
    });

    /**
     * Route PUT /categories/:id pour mettre à jour une catégorie existante.
     * Utilise le schéma UpdateCategoryDto pour valider les données de mise à jour.
     * @param {number} id - Identifiant de la catégorie à mettre à jour
     */
    fastify.put('/categories/:id', { schema: UpdateCategoryDto }, async function updateCategory(request, reply) {
        const id = parseInt(request.params.id); // Extraction de l'ID de la catégorie à partir des paramètres de l'URL
        const { nom } = request.body; // Récupération du nouveau nom de la catégorie depuis le corps de la requête
        const updatedCategory = await CategoryRepository.updateCategory(id, nom); // Mise à jour de la catégorie via le dépôt
        if (!updatedCategory) {
            return reply.status(404).send({ error: 'Category not found' }); // Répond avec une erreur 404 si la catégorie n'est pas trouvée
        }
        return reply.send(updatedCategory); // Envoie la catégorie mise à jour dans la réponse
    });

    /**
     * Route DELETE /categories/:id pour supprimer une catégorie par son identifiant.
     * @param {number} id - Identifiant de la catégorie à supprimer
     */
    fastify.delete('/categories/:id', async function deleteCategory(request, reply) {
        const id = parseInt(request.params.id); // Extraction de l'ID de la catégorie depuis les paramètres de l'URL
        const deletedCategory = await CategoryRepository.deleteCategory(id); // Suppression de la catégorie via le dépôt
        if (!deletedCategory) {
            return reply.status(404).send({ error: 'Category not found' }); // Répond avec une erreur 404 si la catégorie n'est pas trouvée
        }
        return reply.send(deletedCategory); // Envoie la confirmation de suppression de la catégorie dans la réponse
    });
}