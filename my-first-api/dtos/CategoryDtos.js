// Schéma pour valider les données lors de la création d'une catégorie
export const CreateCategoryDto = {
    body: {
        type: 'object',
        required: ['nom'],
        properties: {
            nom: { type: 'string', minLength: 1, maxLength: 50 } // Nom de la catégorie, obligatoire, 1-50 caractères
        },
        additionalProperties: false // Empêche les propriétés non définies dans le schéma
    }
};

// Schéma pour valider les données lors de la mise à jour d'une catégorie
export const UpdateCategoryDto = {
    body: {
        type: 'object',
        required: ['nom'],
        properties: {
            nom: { type: 'string', minLength: 1, maxLength: 50 } // Nouveau nom de la catégorie
        },
        additionalProperties: false // Empêche les propriétés non définies dans le schéma
    }
};
