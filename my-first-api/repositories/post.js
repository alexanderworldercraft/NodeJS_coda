import { prisma } from "../services/db.js"; // Importation de l'instance Prisma pour les opérations de base de données
import { NotFoundError } from "../utils/errors.js"; // Importation de l'erreur NotFoundError pour les cas de données non trouvées

// Dépôt pour gérer les opérations CRUD sur les posts
export const PostRepository = {

    /**
     * Récupère une liste paginée de posts, avec les informations de l'auteur et des catégories associées.
     * @param {number} page - Numéro de la page actuelle.
     * @param {number} limit - Nombre de posts à récupérer par page.
     * @returns {Promise<Array>} - Liste des posts paginés.
     * @throws {NotFoundError} - Erreur si aucun post n'est trouvé.
     */
    getPosts: async (page, limit) => {
        const start = (page - 1) * limit; // Calcul de l'offset pour la pagination
        const posts = await prisma.posts.findMany({
            skip: start,
            take: limit,
            include: {
                author: true, // Inclut les informations de l'auteur
                categorys: { // Inclut les catégories associées
                    include: { category: true } // Récupère les informations de chaque catégorie
                }
            }
        });
        if (!posts) {
            throw new NotFoundError('posts not found'); // Lance une erreur si aucun post n'est trouvé
        }
        return posts;
    },

    /**
     * Récupère un post spécifique par son identifiant.
     * @param {number} id - Identifiant unique du post.
     * @returns {Promise<Object>} - Objet post avec auteur et catégories.
     * @throws {NotFoundError} - Erreur si le post n'est pas trouvé.
     */
    getPost: async (id) => {
        const post = await prisma.posts.findUnique({
            where: { id: id },
            include: {
                author: {
                    select: {
                        id: true // Récupère uniquement l'ID de l'auteur pour des raisons de confidentialité
                    }
                },
                categorys: {
                    select: {
                        category: {
                            select: {
                                id: true,
                                nom: true // Récupère uniquement l'ID et le nom de chaque catégorie
                            }
                        }
                    }
                }
            }
        });
        if (!post) {
            throw new NotFoundError('Post not found'); // Erreur si le post n'est pas trouvé
        }
        return post;
    },

    /**
     * Crée un nouveau post et associe les catégories et l'auteur.
     * @param {string} title - Titre du post.
     * @param {string} content - Contenu du post.
     * @param {Array<number>} categoryIds - Identifiants des catégories à associer.
     * @param {number} authorId - Identifiant de l'auteur.
     * @returns {Promise<Object>} - Objet du post nouvellement créé avec auteur et catégories.
     */
    createPost: async (title, content, categoryIds = [], authorId) => {
        const newPost = await prisma.posts.create({
            data: {
                title: title,
                content: content,
                authorId: authorId, // Associe l'auteur au post
                categorys: {
                    create: categoryIds.map(id => ({
                        category: { connect: { id } } // Connecte chaque catégorie par son ID
                    }))
                }
            },
            include: {
                author: true, // Inclut l'auteur dans la réponse
                categorys: {
                    include: { category: true } // Inclut les informations de chaque catégorie
                }
            }
        });
        if (!newPost) {
            throw new NotFoundError('newPost not found'); // Erreur si la création échoue
        }
        return newPost;
    },

    /**
     * Met à jour un post existant et réassigne les catégories.
     * @param {number} id - Identifiant unique du post à mettre à jour.
     * @param {Object} postData - Données à mettre à jour (ex: titre, contenu).
     * @param {Array<number>} categoryIds - Identifiants des nouvelles catégories à associer.
     * @returns {Promise<Object>} - Objet post mis à jour avec auteur et catégories.
     * @throws {NotFoundError} - Erreur si le post n'est pas trouvé.
     */
    updatePost: async (id, postData, categoryIds = []) => {
        const update = await prisma.posts.update({
            where: { id: id },
            data: {
                ...postData,
                categorys: {
                    deleteMany: {}, // Supprime toutes les relations existantes pour les catégories
                    create: categoryIds.map(id => ({
                        category: { connect: { id } } // Crée de nouvelles associations avec les catégories
                    }))
                }
            },
            include: {
                author: true, // Inclut les informations de l'auteur
                categorys: {
                    include: { category: true } // Inclut les informations de chaque catégorie
                }
            }
        });
        if (!update) {
            throw new NotFoundError('update not found'); // Erreur si la mise à jour échoue
        }
        return update;
    },

    /**
     * Supprime un post par son identifiant et dissocie toutes les catégories associées.
     * @param {number} id - Identifiant unique du post à supprimer.
     * @returns {Promise<Object>} - Objet du post supprimé.
     * @throws {NotFoundError} - Erreur si le post n'est pas trouvé.
     */
    deletePost: async (id) => {
        // Supprime d'abord toutes les relations dans `postsCategorys` pour ce post
        await prisma.postsCategorys.deleteMany({
            where: { postId: id }
        });
    
        // Ensuite, supprime le post
        const deleted = await prisma.posts.delete({
            where: { id: id }
        });
        if (!deleted) {
            throw new NotFoundError('deleted not found'); // Erreur si la suppression échoue
        }
        return deleted;
    },
};