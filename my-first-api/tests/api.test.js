import { expect, test } from 'vitest';
import got from 'got';

const client = got.extend({
    prefixUrl: 'http://localhost:3001/',
    responseType: 'json',
    throwHttpErrors: false,
});

const testEmail = 'testuser@gmail.com';
const testPassword = 'securepassword123';

test('[VALID] POST / signup - create new user', async () => {
    const res = await client.post('signup', {
        json: {
            email: testEmail,
            password: testPassword
        },
        responseType: 'json'
    });
    const data = res.body;
    expect(res.statusCode).toBe(200);
    expect(data).toHaveProperty('id');
    expect(data.email).toBe(testEmail);
    expect(data).not.toHaveProperty('password');
});

test('[INVALID] POST / signup - duplicate user', async () => {
    const res = await client.post('signup', {
        json: {
            email: testEmail,
            password: testPassword
        },
        responseType: 'json'
    });
    expect(res.statusCode).toBe(409); // Conflict error for duplicate email
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('User with this email already exists');
});

test('[VALID] POST / login - authenticate user', async () => {
    const res = await client.post('login', {
        json: {
            email: testEmail,
            password: testPassword
        },
        responseType: 'json'
    });
    const data = res.body;
    expect(res.statusCode).toBe(200);
    expect(data).toHaveProperty('user');
    expect(data.user).toHaveProperty('id');
    expect(data.user.email).toBe(testEmail);
    expect(data.user).not.toHaveProperty('password');
    expect(data).toHaveProperty('token'); // JWT token should be present
});

test('[INVALID] POST / login - incorrect password', async () => {
    const res = await client.post('login', {
        json: {
            email: testEmail,
            password: 'wrongpassword'
        },
        responseType: 'json'
    });
    expect(res.statusCode).toBe(401); // Unauthorized error for incorrect password
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('Invalid email or password');
});

test('[VALID] PUT / update user - update user email', async () => {
    // Authenticate to get token
    const loginRes = await client.post('login', {
        json: { email: testEmail, password: testPassword },
    });
    const token = loginRes.body.token;
    const updatedEmail = 'updateduser@gmail.com';

    // Update user email
    const res = await client.put('user', {
        headers: { Authorization: `Bearer ${token}` },
        json: { email: updatedEmail },
        responseType: 'json'
    });
    const data = res.body;
    expect(res.statusCode).toBe(200);
    expect(data).toHaveProperty('email');
    expect(data.email).toBe(updatedEmail);
});

test('[VALID] DELETE / delete user - delete the test user', async () => {
    // Authenticate to get token
    const loginRes = await client.post('login', {
        json: { email: testEmail, password: testPassword },
    });
    const token = loginRes.body.token;

    // Delete the user
    const res = await client.delete('user', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'json'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('User deleted successfully');
});

test('[INVALID] GET / user profile after deletion', async () => {
    // Try to authenticate with a deleted user
    const res = await client.post('login', {
        json: { email: testEmail, password: testPassword },
        responseType: 'json'
    });
    expect(res.statusCode).toBe(401); // Unauthorized as user no longer exists
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('Invalid email or password');
});











// Variables pour stocker les IDs des catégories et des posts créés
let categoryId1;
let categoryId2;
let postId;
const testUserEmail = 'posttestuser@gmail.com';
const testUserPassword = 'securepassword456';

test('[VALID] POST /categories - create new categories', async () => {
    const res1 = await client.post('categories', {
        json: { nom: 'Technology' },
        responseType: 'json'
    });
    categoryId1 = res1.body.id;
    expect(res1.statusCode).toBe(201);
    expect(res1.body).toHaveProperty('id');
    expect(res1.body.nom).toBe('Technology');

    const res2 = await client.post('categories', {
        json: { nom: 'Science' },
        responseType: 'json'
    });
    categoryId2 = res2.body.id;
    expect(res2.statusCode).toBe(201);
    expect(res2.body).toHaveProperty('id');
    expect(res2.body.nom).toBe('Science');
});

test('[VALID] GET /categories - fetch all categories', async () => {
    const res = await client.get('categories');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toEqual(
        expect.arrayContaining([
            expect.objectContaining({ id: categoryId1, nom: 'Technology' }),
            expect.objectContaining({ id: categoryId2, nom: 'Science' }),
        ])
    );
});

test('[VALID] POST /posts - create new post with categories', async () => {
    // Authentifier un utilisateur et obtenir le token
    const loginRes = await client.post('login', {
        json: { email: testUserEmail, password: testUserPassword },
    });
    const token = loginRes.body.token;

    const res = await client.post('posts', {
        headers: { Authorization: `Bearer ${token}` },
        json: {
            title: 'Exploring the Universe',
            content: 'This is a post about space exploration.',
            categories: [categoryId1, categoryId2] // Associer les catégories
        },
        responseType: 'json'
    });
    postId = res.body.id;
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Exploring the Universe');
    expect(res.body.categorys).toEqual(
        expect.arrayContaining([
            expect.objectContaining({ category: { id: categoryId1, nom: 'Technology' } }),
            expect.objectContaining({ category: { id: categoryId2, nom: 'Science' } }),
        ])
    );
});

test('[VALID] GET /posts - fetch all posts with categories', async () => {
    const res = await client.get('posts');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                id: postId,
                title: 'Exploring the Universe',
                categorys: expect.arrayContaining([
                    expect.objectContaining({ category: { id: categoryId1, nom: 'Technology' } }),
                    expect.objectContaining({ category: { id: categoryId2, nom: 'Science' } }),
                ])
            }),
        ])
    );
});

test('[VALID] PUT /posts/:id - update post title and categories', async () => {
    // Authentifier un utilisateur et obtenir le token
    const loginRes = await client.post('login', {
        json: { email: testUserEmail, password: testUserPassword },
    });
    const token = loginRes.body.token;

    const res = await client.put(`posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
        json: {
            title: 'Exploring the Deep Sea',
            content: 'Updated content about deep-sea exploration.',
            categories: [categoryId2] // Modifier les catégories
        },
        responseType: 'json'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Exploring the Deep Sea');
    expect(res.body.categorys).toEqual(
        expect.arrayContaining([
            expect.objectContaining({ category: { id: categoryId2, nom: 'Science' } })
        ])
    );
});

test('[VALID] DELETE /posts/:id - delete a post', async () => {
    // Authentifier un utilisateur et obtenir le token
    const loginRes = await client.post('login', {
        json: { email: testUserEmail, password: testUserPassword },
    });
    const token = loginRes.body.token;

    const res = await client.delete(`posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'json'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Post deleted successfully');
});

test('[VALID] DELETE /categories/:id - delete categories', async () => {
    const res1 = await client.delete(`categories/${categoryId1}`);
    expect(res1.statusCode).toBe(200);
    expect(res1.body).toHaveProperty('message');
    expect(res1.body.message).toBe('Category deleted successfully');

    const res2 = await client.delete(`categories/${categoryId2}`);
    expect(res2.statusCode).toBe(200);
    expect(res2.body).toHaveProperty('message');
    expect(res2.body.message).toBe('Category deleted successfully');
});








let invalidPostId = 9999; // ID inexistant pour tester les erreurs
let invalidCategoryId = 8888;

//const testUserEmail = 'testuser@gmail.com';
//const testUserPassword = 'securepassword123';

// [INVALID] Test pour création de catégorie sans champ "nom"
test('[INVALID] POST /categories - missing "nom" field', async () => {
    const res = await client.post('categories', {
        json: {}, // Champ "nom" manquant
        responseType: 'json'
    });
    expect(res.statusCode).toBe(400); // Erreur 400 attendue pour requête incorrecte
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('Invalid input');
});

// [INVALID] Test pour récupération d'une catégorie avec un ID invalide
test('[INVALID] GET /categories/:id - invalid category ID', async () => {
    const res = await client.get(`categories/${invalidCategoryId}`);
    expect(res.statusCode).toBe(404); // Erreur 404 attendue pour ID inexistant
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('Category not found');
});

// [INVALID] Test pour mise à jour d'une catégorie avec un ID invalide
test('[INVALID] PUT /categories/:id - update with invalid ID', async () => {
    const res = await client.put(`categories/${invalidCategoryId}`, {
        json: { nom: 'New Name' },
        responseType: 'json'
    });
    expect(res.statusCode).toBe(404); // Erreur 404 attendue pour ID inexistant
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('Category not found');
});

// [INVALID] Test pour suppression d'une catégorie avec un ID invalide
test('[INVALID] DELETE /categories/:id - delete with invalid ID', async () => {
    const res = await client.delete(`categories/${invalidCategoryId}`);
    expect(res.statusCode).toBe(404); // Erreur 404 attendue pour ID inexistant
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('Category not found');
});

// [INVALID] Test pour création de post sans titre
test('[INVALID] POST /posts - missing title field', async () => {
    // Authentifier un utilisateur et obtenir le token
    const loginRes = await client.post('login', {
        json: { email: testUserEmail, password: testUserPassword },
    });
    const token = loginRes.body.token;

    const res = await client.post('posts', {
        headers: { Authorization: `Bearer ${token}` },
        json: {
            content: 'This is a post without a title.',
            categories: [invalidCategoryId]
        },
        responseType: 'json'
    });
    expect(res.statusCode).toBe(400); // Erreur 400 attendue pour champ manquant
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('Invalid input');
});

// [INVALID] Test pour récupération d'un post avec un ID invalide
test('[INVALID] GET /posts/:id - invalid post ID', async () => {
    const res = await client.get(`posts/${invalidPostId}`);
    expect(res.statusCode).toBe(404); // Erreur 404 attendue pour ID inexistant
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('Post not found');
});

// [INVALID] Test pour mise à jour d'un post avec un ID invalide
test('[INVALID] PUT /posts/:id - update with invalid ID', async () => {
    // Authentifier un utilisateur et obtenir le token
    const loginRes = await client.post('login', {
        json: { email: testUserEmail, password: testUserPassword },
    });
    const token = loginRes.body.token;

    const res = await client.put(`posts/${invalidPostId}`, {
        headers: { Authorization: `Bearer ${token}` },
        json: {
            title: 'Updated Invalid Post',
            content: 'Trying to update a non-existing post.',
            categories: []
        },
        responseType: 'json'
    });
    expect(res.statusCode).toBe(404); // Erreur 404 attendue pour ID inexistant
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('Post not found');
});

// [INVALID] Test pour suppression d'un post avec un ID invalide
test('[INVALID] DELETE /posts/:id - delete with invalid ID', async () => {
    // Authentifier un utilisateur et obtenir le token
    const loginRes = await client.post('login', {
        json: { email: testUserEmail, password: testUserPassword },
    });
    const token = loginRes.body.token;

    const res = await client.delete(`posts/${invalidPostId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'json'
    });
    expect(res.statusCode).toBe(404); // Erreur 404 attendue pour ID inexistant
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('Post not found');
});