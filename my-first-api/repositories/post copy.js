// Définition d'un tableau simulant une base de données pour les posts
const posts = [
    {
        id: 1,
        title: 'hello world',
        content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi enim doloremque ullam laboriosam saepe aperiam, neque, perspiciatis nisi possimus tenetur libero obcaecati dicta laudantium, quia illo totam blanditiis. Quia, in.',
    },
];

// Définition du repository pour la gestion des posts
export const PostRepository = {
    // Récupère une page de posts avec une limite définie
    getPosts: async (page, limit) => {
        const start = (page - 1) * limit; // Calcul de l'index de départ
        const end = page * limit; // Calcul de l'index de fin
        return posts.slice(start, end); // Retourne une portion des posts selon pagination
    },

    // Récupère un post par son identifiant
    getPost: async (id) => {
        const post = posts.find(post => post.id === id);
        if (!post) {
            throw new Error('Post not found'); // Lève une erreur si le post n'existe pas
        }
        return post; // Retourne le post trouvé
    },

    // Crée un nouveau post et l'ajoute au tableau
    createPost: async (post) => {
        const id = posts.length + 1; // Détermine un nouvel ID pour le post
        const newPost = {id, ...post}; // Crée un nouvel objet post avec l'ID
        posts.push(newPost); // Ajoute le post au tableau
        return newPost; // Retourne le nouveau post créé
    },

    // Met à jour un post existant en fonction de son identifiant
    updatePost: async (id, post) => {
        const oldpost = posts.find(post => post.id === id); // Recherche le post existant
        const index = posts.findIndex(post => post.id === id); // Trouve l'index du post
        if (!oldpost) {
            throw new Error('Post not found'); // Lève une erreur si le post n'existe pas
        }
        const newPost = { id, ...oldpost, ...post}; // Fusionne les données existantes avec les nouvelles
        posts[index] = newPost; // Remplace l'ancien post par le nouveau
        return newPost; // Retourne le post mis à jour
    },

    // Supprime un post par son identifiant
    deletePost: async (id) => {
        const index = posts.findIndex(post => post.id === id);
        if (index === -1) {
            throw new Error('Post not found'); // Lève une erreur si le post n'existe pas
        }
        const deleted = posts.splice(index, 1); // Supprime le post du tableau
        return deleted; // Retourne le post supprimé
    },
};