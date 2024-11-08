// DTO (Data Transfer Object) pour représenter les données publiques d'un utilisateur
// Utilisé pour définir les informations d'un utilisateur visibles publiquement
export const PublicUserDto = {
    type: 'object', // Définit que la structure de données est un objet
    properties: {
        id: { type: 'number' } // Spécifie que l'objet contient un champ "id" de type numérique
    },
};