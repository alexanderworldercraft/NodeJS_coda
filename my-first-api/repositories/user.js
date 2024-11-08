// Importation de l'instance Prisma pour interagir avec la base de données
import { prisma } from "../services/db.js";
// Définition du UserRepository pour gérer les opérations de base de données liées aux utilisateurs
export const UserRepository = {

    // Récupère un utilisateur par son identifiant unique
    getUserId: async (id) => {
        const user = await prisma.users.findUnique({
            where: {
                id: id // Filtre par identifiant de l'utilisateur
            }
        });
        return user; // Retourne l'utilisateur correspondant ou null si non trouvé
    },

    // Récupère un utilisateur en fonction de ses identifiants (email et mot de passe)
    getUserByCredentials: async (email, password) => {
        const user = await prisma.users.findFirst({
            where: {
                email: email,      // Correspondance de l'email
                password: password // Correspondance du mot de passe
            }
        });
        return user; // Retourne l'utilisateur correspondant ou null si non trouvé
    },

    // Crée un nouvel utilisateur dans la base de données
    createUser: async (user) => {
        const newUser = await prisma.users.create({
            data: user, // Données de l'utilisateur à insérer
            select: {
                id: true,
                email: true
            }
        });
        return newUser; // Retourne l'utilisateur créé
    },
}