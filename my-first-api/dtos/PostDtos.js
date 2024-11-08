import { PublicUserDto } from "./usersDtos.js";

// Définition d'une catégorie existante pour l'inclure dans les posts
const CategoryDto = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        nom: { type: 'string' },
    },
    required: ['id', 'nom']
};

// Schéma pour un post existant, incluant les catégories associées
const ExistingPostDto = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        content: { type: 'string' },
        author: PublicUserDto,
        categories: { 
            type: 'array', 
            items: CategoryDto // Inclut un tableau de catégories associées
        }
    },
    required: ['id', 'title', 'content'],
};

// Schéma pour la création d'un nouveau post
export const CreatePostDto = {
    body: {
        type: 'object',
        properties: {
            title: { type: 'string' },     // Titre du post, obligatoire
            content: { type: 'string' },   // Contenu du post, obligatoire
            categories: { 
                type: 'array', 
                items: { type: 'number' } // Tableau d'IDs de catégories
            }
        },
        required: ['title', 'content'], // Titre et contenu sont obligatoires
    },
    response: {
        201: ExistingPostDto, // Retourne un post complet en cas de succès
    },
};

// Schéma pour la mise à jour d'un post existant
export const UpdatePostDto = {
    body: {
        type: 'object',
        properties: {
            title: { type: 'string' },     // Titre, optionnel
            content: { type: 'string' },   // Contenu, optionnel
            categories: { 
                type: 'array', 
                items: { type: 'number' } // Tableau d'IDs de catégories
            }
        },
        required: [],                     // Permet d'envoyer uniquement les champs à modifier
        additionalProperties: false,      // Empêche l'envoi de propriétés non définies
    },
    response: {
        200: ExistingPostDto, // Retourne le post mis à jour en cas de succès
    },
};

// Schéma pour la récupération des posts avec pagination
export const GetPostsDtos = {
    querystring: {
        type: 'object',
        properties: {
            page: { type: 'number' },      // Page actuelle, de type nombre
            limit: { type: 'number' },     // Nombre de posts par page, de type nombre
        },
    },
    response: {
        200: {
            type: 'array',
            items: ExistingPostDto,       // Chaque élément du tableau est un post existant
        },
    },
};

// Schéma pour la suppression d'un post par son ID
export const DeletePostDto = {
    params: {
        type: 'object',
        properties: {
            id: { type: 'number' },        // ID du post à supprimer, de type nombre
        },
        required: ['id'],                 // ID est obligatoire pour cette opération
    },
    response: {
        200: ExistingPostDto,             // Retourne le post supprimé en cas de succès
    },
};