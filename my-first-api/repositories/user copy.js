const users = [
    {
        id: 1,
        email: 'patate',
        password: '123',
    },
];

export const UserRepository = {

    // Récupère un utilisateur par son identifiant
    getUserId: async (id) => {
        const user = users.find(user => user.id === id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },

    // Récupère un utilisateur par son email
    getUserEmail: async (email) => {
        return users.find(user => user.email === email) || null;
    },

    // Vérifie l'authentification par email et mot de passe
    getUserByEmailAndPassword: async (email, password) => {
        return users.find(user => user.email === email && user.password === password) || null;
    },

    // Crée un nouvel utilisateur
    createUser: async (user) => {
        const id = users.length + 1;
        const newUser = { id, ...user };
        users.push(newUser);
        return newUser;
    },
}