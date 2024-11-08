// Classe d'erreur personnalisée pour représenter une erreur "NotFound".
// Cette classe hérite de la classe de base Error et permet de définir un type d'erreur spécifique.

export class NotFoundError extends Error {
    /**
     * Constructeur pour initialiser le message et les options d'erreur.
     * @param {string} message - Message d'erreur décrivant ce qui n'a pas été trouvé.
     * @param {Object} [options] - Options supplémentaires pour l'erreur.
     */
    constructor(message, options) {
        super(message, options); // Appelle le constructeur de la classe parente avec le message et les options
        this.name = 'NotFoundError'; // Définit le nom de l'erreur pour la différencier d'autres types d'erreurs
    }
}