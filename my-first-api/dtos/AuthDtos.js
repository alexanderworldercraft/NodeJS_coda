// Schéma pour la création d'un nouvel utilisateur
export const CreateUserDto = {
    // Structure attendue dans le corps de la requête
    body: {
        type: 'object',
        properties: {
            email: { type: 'string', format: 'email' },  // Email de l'utilisateur, format email
            password: { type: 'string' },                // Mot de passe de l'utilisateur, chaîne de caractères
        },
        required: ['email', 'password'],  // Email et mot de passe sont obligatoires
        additionalProperties: false,      // Empêche l'ajout de propriétés non définies dans le schéma
    },
    // Schéma de la réponse en cas de succès (status 201), retourne l'utilisateur créé
    response: {
        201: {
            type: 'object',
            properties: {
                email: { type: 'string', format: 'email' },
            },
            required: ['email'],
        },
        401: {
            type: 'object',
            properties: {
                error: { type: 'string' }                 // Message d'erreur en cas de mauvais identifiants
            },
            required: ['error'],
        }
    },
};

// Schéma pour la connexion d'un utilisateur
export const LoginDto = {
    // Structure attendue dans le corps de la requête
    body: {
        type: 'object',
        properties: {
            email: { type: 'string', format: 'email' },  // Email de l'utilisateur, format email
            password: { type: 'string' },                // Mot de passe de l'utilisateur, chaîne de caractères
        },
        required: ['email', 'password'],  // Email et mot de passe sont obligatoires
        additionalProperties: false,      // Empêche l'ajout de propriétés non définies dans le schéma
    },
    // Schéma de la réponse en cas de succès (status 200), retourne un message et un token
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' },              // Message de succès
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },           // Identifiant unique de l'utilisateur
                        email: { type: 'string', format: 'email' },
                        token: { type: 'string' },        // Jeton d'authentification JWT
                    },
                    required: ['id', 'email', 'token'],
                },
            },
            required: ['message', 'user'],
        },
        401: {
            type: 'object',
            properties: {
                error: { type: 'string' }                 // Message d'erreur en cas de mauvais identifiants
            },
            required: ['error'],
        }
    }
};

// Schéma pour la mise à jour partielle d'un utilisateur
export const UpdateUserDto = {
    // Structure attendue dans le corps de la requête pour une mise à jour partielle
    body: {
        type: 'object',
        properties: {
            email: { type: 'string', format: 'email' },  // Email de l'utilisateur, optionnel
            password: { type: 'string' },                // Mot de passe de l'utilisateur, optionnel
        },
        required: [],  // Aucun champ requis, permettant des mises à jour partielles
        additionalProperties: false,  // Empêche l'ajout de propriétés non définies dans le schéma
    },
    // Schéma de la réponse en cas de succès (status 200), retourne l'utilisateur mis à jour
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'number' },       // Identifiant unique de l'utilisateur
                email: { type: 'string', format: 'email' },
            },
            required: ['id', 'email'],
        },
    },
};