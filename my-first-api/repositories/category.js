// Importation de l'instance Prisma pour interagir avec la base de données
import { prisma } from "../services/db.js";
import { NotFoundError } from "../utils/errors.js";

// Définition du repository pour la gestion des catégories
export const CategoryRepository = {

    // Récupère toutes les catégories
    getCategories: async () => {
        const categories = await prisma.categorys.findMany();
        if (!categories || categories.length === 0) {
            throw new NotFoundError('Categories not found');
        }
        return categories; // Retourne la liste des catégories trouvées
    },

    // Récupère une catégorie par son identifiant
    getCategoryById: async (id) => {
        const category = await prisma.categorys.findUnique({
            where: {
                id: id // Filtre par identifiant de la catégorie
            }
        });
        if (!category) {
            throw new NotFoundError('Category not found');
        }
        return category; // Retourne la catégorie trouvée
    },

    // Crée une nouvelle catégorie
    createCategory: async (nom) => {
        const newCategory = await prisma.categorys.create({
            data: {
                nom: nom // Nom de la catégorie à insérer
            }
        });
        return newCategory; // Retourne la catégorie créée
    },

    // Met à jour une catégorie existante
    updateCategory: async (id, nom) => {
        const updatedCategory = await prisma.categorys.update({
            where: {
                id: id, // Identifiant de la catégorie à mettre à jour
            },
            data: {
                nom: nom // Nouveau nom de la catégorie
            }
        });
        if (!updatedCategory) {
            throw new NotFoundError('Category not found for update');
        }
        return updatedCategory; // Retourne la catégorie mise à jour
    },

    // Supprime une catégorie par son identifiant
    deleteCategory: async (id) => {
        const deletedCategory = await prisma.categorys.delete({
            where: {
                id: id, // Identifiant de la catégorie à supprimer
            }
        });
        return deletedCategory; // Retourne la catégorie supprimée
    },
};